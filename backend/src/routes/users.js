const express = require('express');
const bcrypt = require('bcryptjs');
const { query, one, tx } = require('../config/db');
const { requirePermission, clearAuthCache } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');

const router = express.Router();

/**
 * GET /api/users
 */
router.get(
  '/',
  requirePermission('users.view'),
  asyncHandler(async (req, res) => {
    const rows = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar, u.status, u.last_login_at, u.created_at,
              r.id AS role_id, r.slug AS role_slug, r.name AS role_name
         FROM users u
         JOIN roles r ON r.id = u.role_id
        ORDER BY u.id ASC`
    );

    res.json({
      success: true,
      data: rows.map((u) => ({
        id: String(u.id),
        name: u.name,
        email: u.email,
        phone: u.phone,
        avatar: u.avatar,
        status: u.status,
        lastLoginAt: u.last_login_at,
        createdAt: u.created_at,
        roleId: String(u.role_id),
        roleSlug: u.role_slug,
        roleName: u.role_name,
      })),
    });
  })
);

/**
 * POST /api/users
 */
router.post(
  '/',
  requirePermission('users.create'),
  asyncHandler(async (req, res) => {
    const { name, email, phone, password = 'admin123', roleId, roleSlug, status = 'active', avatar } = req.body;

    if (!name || !email) throw new HttpError(400, 'Name and email are required');

    let resolvedRoleId = roleId;
    if (!resolvedRoleId && roleSlug) {
      const rRow = await one('SELECT id FROM roles WHERE slug = ?', [roleSlug]);
      if (rRow) resolvedRoleId = rRow.id;
    }

    if (!resolvedRoleId) throw new HttpError(400, 'Valid role is required');

    const exists = await one('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (exists) throw new HttpError(409, 'User with this email already exists');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const r = await query(
      `INSERT INTO users (name, email, phone, password_hash, role_id, status, avatar)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), email.trim(), phone || null, hash, resolvedRoleId, status, avatar || null]
    );

    await audit(req, {
      action: 'create',
      entity: 'users',
      entityId: r.insertId,
      summary: `Created staff user ${email} (${name})`,
    });

    res.status(201).json({ success: true, id: String(r.insertId), message: 'User created successfully' });
  })
);

/**
 * PUT /api/users/:id
 */
router.put(
  '/:id',
  requirePermission('users.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, roleId, roleSlug, status, avatar, password } = req.body;

    const existing = await one('SELECT * FROM users WHERE id = ?', [id]);
    if (!existing) throw new HttpError(404, 'User not found');

    let role_id = existing.role_id;
    if (roleId) role_id = roleId;
    else if (roleSlug) {
      const r = await one('SELECT id FROM roles WHERE slug = ?', [roleSlug]);
      if (r) role_id = r.id;
    }

    let passwordSql = '';
    const params = [name || existing.name, email || existing.email, phone !== undefined ? phone : existing.phone, role_id, status || existing.status, avatar !== undefined ? avatar : existing.avatar];

    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password.trim(), salt);
      passwordSql = ', password_hash = ?';
      params.push(hash);
    }

    params.push(id);

    await query(
      `UPDATE users
          SET name = ?, email = ?, phone = ?, role_id = ?, status = ?, avatar = ? ${passwordSql}
        WHERE id = ?`,
      params
    );

    clearAuthCache(id);

    await audit(req, {
      action: 'update',
      entity: 'users',
      entityId: id,
      summary: `Updated user profile for ${email || existing.email}`,
    });

    res.json({ success: true, message: 'User updated successfully' });
  })
);

/**
 * PATCH /api/users/:id/toggle
 */
router.patch(
  '/:id/toggle',
  requirePermission('users.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (Number(id) === req.user.id) throw new HttpError(400, 'Cannot deactivate your own account');

    const u = await one('SELECT status, email FROM users WHERE id = ?', [id]);
    if (!u) throw new HttpError(404, 'User not found');

    const nextStatus = u.status === 'active' ? 'inactive' : 'active';
    await query('UPDATE users SET status = ? WHERE id = ?', [nextStatus, id]);
    clearAuthCache(id);

    await audit(req, {
      action: 'status',
      entity: 'users',
      entityId: id,
      summary: `${nextStatus === 'active' ? 'Activated' : 'Suspended'} user ${u.email}`,
    });

    res.json({ success: true, status: nextStatus, message: `User account is now ${nextStatus}` });
  })
);

/**
 * DELETE /api/users/:id
 */
router.delete(
  '/:id',
  requirePermission('users.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (Number(id) === req.user.id) throw new HttpError(400, 'Cannot delete your own account');

    const u = await one('SELECT email FROM users WHERE id = ?', [id]);
    if (!u) throw new HttpError(404, 'User not found');

    await query('DELETE FROM users WHERE id = ?', [id]);
    clearAuthCache(id);

    await audit(req, {
      action: 'delete',
      entity: 'users',
      entityId: id,
      summary: `Deleted user ${u.email}`,
    });

    res.json({ success: true, message: 'User deleted successfully' });
  })
);

/**
 * GET /api/users/roles
 */
router.get(
  '/roles',
  requirePermission('roles.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM roles ORDER BY id ASC');
    res.json({
      success: true,
      data: rows.map((r) => ({
        id: String(r.id),
        slug: r.slug,
        name: r.name,
        description: r.description,
      })),
    });
  })
);

module.exports = router;
