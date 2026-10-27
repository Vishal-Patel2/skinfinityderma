const express = require('express');
const bcrypt = require('bcryptjs');
const { query, one } = require('../config/db');
const { signToken, authenticate, clearAuthCache } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');

const router = express.Router();

/**
 * POST /api/auth/login
 */
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new HttpError(400, 'Email and password are required');

    const user = await one(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar, u.password_hash, u.status, u.token_version,
              r.id AS role_id, r.slug AS role_slug, r.name AS role_name
         FROM sid_users u
         JOIN sid_roles r ON r.id = u.role_id
        WHERE LOWER(u.email) = LOWER(?) LIMIT 1`,
      [email.trim()]
    );

    if (!user) throw new HttpError(401, 'Invalid email or password');
    if (user.status !== 'active') throw new HttpError(403, 'Account is disabled. Contact superadmin.');

    // Support both bcrypt and legacy plain text fallback
    let matches = false;
    if (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$')) {
      matches = await bcrypt.compare(password, user.password_hash);
    } else {
      matches = user.password_hash === password;
    }

    if (!matches) throw new HttpError(401, 'Invalid email or password');

    // Update last login
    await query('UPDATE sid_users SET last_login_at = NOW() WHERE id = ?', [user.id]);

    // Permissions
    user.isSuperAdmin = user.role_slug === 'super_admin';
    const permRows = user.isSuperAdmin
      ? await query('SELECT code FROM sid_permissions')
      : await query(
          `SELECT p.code FROM sid_role_permissions rp JOIN sid_permissions p ON p.id = rp.permission_id WHERE rp.role_id = ?`,
          [user.role_id]
        );
    const permissions = permRows.map((r) => r.code);

    const token = signToken(user);

    await audit({ user, ip: req.ip, headers: req.headers }, {
      action: 'login',
      entity: 'auth',
      entityId: user.id,
      summary: `Staff login: ${user.name} (${user.role_name})`,
    });

    res.json({
      success: true,
      token,
      data: {
        id: String(user.id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role_name,
        roleSlug: user.role_slug,
        isSuperAdmin: user.isSuperAdmin,
        permissions,
      },
    });
  })
);

/**
 * GET /api/auth/me
 */
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: {
        id: String(req.user.id),
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        avatar: req.user.avatar,
        role: req.user.role_name,
        roleSlug: req.user.role_slug,
        isSuperAdmin: req.user.isSuperAdmin,
        permissions: req.user.permissions,
      },
    });
  })
);

/**
 * POST /api/auth/update-password
 */
router.post(
  '/update-password',
  authenticate,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) throw new HttpError(400, 'Both passwords are required');
    if (newPassword.length < 6) throw new HttpError(400, 'New password must be at least 6 characters');

    const user = await one('SELECT password_hash FROM sid_users WHERE id = ?', [req.user.id]);
    let matches = false;
    if (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$')) {
      matches = await bcrypt.compare(currentPassword, user.password_hash);
    } else {
      matches = user.password_hash === currentPassword;
    }

    if (!matches) throw new HttpError(400, 'Current password does not match');

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await query('UPDATE sid_users SET password_hash = ?, token_version = token_version + 1 WHERE id = ?', [
      newHash,
      req.user.id,
    ]);

    clearAuthCache(req.user.id);

    await audit(req, {
      action: 'password_change',
      entity: 'users',
      entityId: req.user.id,
      summary: `Password changed for user ${req.user.email}`,
    });

    res.json({ success: true, message: 'Password updated successfully' });
  })
);

module.exports = router;
