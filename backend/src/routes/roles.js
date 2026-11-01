const express = require('express');
const { query, one, tx } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');
const { slugify } = require('../utils/slug');
const { MODULES } = require('../config/permissions');

const router = express.Router();

/**
 * GET /api/roles
 * List all roles with staff count and permissions count
 */
router.get(
  '/',
  requirePermission('roles.view'),
  asyncHandler(async (req, res) => {
    const roles = await query(`
      SELECT r.*,
             (SELECT COUNT(*) FROM sid_users WHERE role_id = r.id) AS user_count,
             (SELECT COUNT(*) FROM sid_role_permissions WHERE role_id = r.id) AS permission_count
        FROM sid_roles r
       ORDER BY r.id ASC
    `);

    res.json({
      success: true,
      data: roles.map((r) => ({
        id: String(r.id),
        slug: r.slug,
        name: r.name,
        description: r.description,
        isSystem: Boolean(r.is_system),
        userCount: r.user_count || 0,
        permissionCount: r.permission_count || 0,
        createdAt: r.created_at,
      })),
    });
  })
);

/**
 * GET /api/roles/permissions
 * List all permissions grouped by module
 */
router.get(
  '/permissions',
  requirePermission('roles.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM sid_permissions ORDER BY module ASC, id ASC');

    const grouped = {};
    rows.forEach((p) => {
      if (!grouped[p.module]) {
        const modMeta = MODULES.find((m) => m.module === p.module);
        grouped[p.module] = {
          module: p.module,
          label: modMeta ? modMeta.label : p.module,
          permissions: [],
        };
      }
      grouped[p.module].permissions.push({
        id: p.id,
        code: p.code,
        action: p.action,
        label: p.label,
      });
    });

    res.json({
      success: true,
      data: Object.values(grouped),
    });
  })
);

/**
 * GET /api/roles/:id
 * Retrieve role with assigned permission IDs and codes
 */
router.get(
  '/:id',
  requirePermission('roles.view'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const r = await one('SELECT * FROM sid_roles WHERE id = ?', [id]);
    if (!r) throw new HttpError(404, 'Role not found');

    const permRows = await query(
      `SELECT p.id, p.code, p.module, p.action, p.label
         FROM sid_role_permissions rp
         JOIN sid_permissions p ON p.id = rp.permission_id
        WHERE rp.role_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        id: String(r.id),
        slug: r.slug,
        name: r.name,
        description: r.description,
        isSystem: Boolean(r.is_system),
        permissionIds: permRows.map((p) => p.id),
        permissionCodes: permRows.map((p) => p.code),
        permissions: permRows,
      },
    });
  })
);

/**
 * POST /api/roles
 * Create a new custom role with permissions
 */
router.post(
  '/',
  requirePermission('roles.create'),
  asyncHandler(async (req, res) => {
    const { name, slug, description, permissionIds = [] } = req.body;
    if (!name) throw new HttpError(400, 'Role name is required');

    const roleSlug = slug ? slugify(slug) : slugify(name);
    const existing = await one('SELECT id FROM sid_roles WHERE slug = ?', [roleSlug]);
    if (existing) throw new HttpError(409, `A role with slug "${roleSlug}" already exists`);

    const result = await tx(async (conn) => {
      const [r] = await conn.query(
        'INSERT INTO sid_roles (slug, name, description, is_system) VALUES (?, ?, ?, 0)',
        [roleSlug, name.trim(), description || null]
      );
      const roleId = r.insertId;

      if (Array.isArray(permissionIds) && permissionIds.length > 0) {
        const values = permissionIds.map((pId) => [roleId, parseInt(pId, 10)]);
        await conn.query('INSERT IGNORE INTO sid_role_permissions (role_id, permission_id) VALUES ?', [values]);
      }

      return roleId;
    });

    await audit(req, {
      action: 'create',
      entity: 'roles',
      entityId: result,
      summary: `Created custom role: ${name} with ${permissionIds.length} permissions`,
    });

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: { id: String(result), slug: roleSlug },
    });
  })
);

/**
 * PUT /api/roles/:id
 * Update role details and assigned permissions
 */
router.put(
  '/:id',
  requirePermission('roles.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, permissionIds } = req.body;

    const existing = await one('SELECT * FROM sid_roles WHERE id = ?', [id]);
    if (!existing) throw new HttpError(404, 'Role not found');

    await tx(async (conn) => {
      await conn.query(
        'UPDATE sid_roles SET name = COALESCE(?, name), description = COALESCE(?, description), updated_at = NOW() WHERE id = ?',
        [name || null, description !== undefined ? description : existing.description, id]
      );

      if (Array.isArray(permissionIds)) {
        await conn.query('DELETE FROM sid_role_permissions WHERE role_id = ?', [id]);
        if (permissionIds.length > 0) {
          const values = permissionIds.map((pId) => [parseInt(id, 10), parseInt(pId, 10)]);
          await conn.query('INSERT IGNORE INTO sid_role_permissions (role_id, permission_id) VALUES ?', [values]);
        }
      }
    });

    await audit(req, {
      action: 'update',
      entity: 'roles',
      entityId: id,
      summary: `Updated role: ${existing.name}`,
    });

    res.json({ success: true, message: 'Role updated successfully' });
  })
);

/**
 * DELETE /api/roles/:id
 */
router.delete(
  '/:id',
  requirePermission('roles.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await one('SELECT * FROM sid_roles WHERE id = ?', [id]);
    if (!existing) throw new HttpError(404, 'Role not found');
    if (existing.is_system) {
      throw new HttpError(400, 'System default roles cannot be deleted.');
    }

    const assignedUsers = await one('SELECT COUNT(*) AS total FROM sid_users WHERE role_id = ?', [id]);
    if (assignedUsers.total > 0) {
      throw new HttpError(400, `Cannot delete role: ${assignedUsers.total} staff members are assigned to this role.`);
    }

    await query('DELETE FROM sid_roles WHERE id = ?', [id]);

    await audit(req, {
      action: 'delete',
      entity: 'roles',
      entityId: id,
      summary: `Deleted custom role: ${existing.name}`,
    });

    res.json({ success: true, message: 'Role deleted successfully' });
  })
);

module.exports = router;
