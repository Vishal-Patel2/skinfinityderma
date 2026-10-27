const { query } = require('../config/db');

/**
 * Write an audit-log entry. Never throws — auditing must not break the request.
 * @param {object} req Express request (for user + ip) — may be null for system actions.
 */
async function audit(req, { action, entity, entityId, summary, details }) {
  try {
    const user = req && req.user;
    await query(
      `INSERT INTO sid_audit_logs (user_id, user_name, action, entity, entity_id, summary, details, ip)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user ? user.id : null,
        user ? user.name : 'system',
        action,
        entity,
        entityId != null ? String(entityId) : null,
        summary ? String(summary).slice(0, 255) : null,
        details ? JSON.stringify(details) : null,
        req ? (req.headers['x-forwarded-for'] || req.ip || '').toString().split(',')[0].trim().slice(0, 64) : null,
      ]
    );
  } catch (err) {
    console.error('[audit] failed to write log:', err.message);
  }
}

module.exports = { audit };
