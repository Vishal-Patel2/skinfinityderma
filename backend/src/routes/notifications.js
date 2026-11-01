const express = require('express');
const { query, one } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { asyncHandler, HttpError } = require('../middleware/error');

const router = express.Router();

/**
 * GET /api/notifications
 * List recent notifications and unread count
 */
router.get(
  '/',
  requirePermission('notifications.view'),
  asyncHandler(async (req, res) => {
    const unreadCount = await one('SELECT COUNT(*) AS total FROM sid_notifications WHERE is_read = 0');
    const rows = await query('SELECT * FROM sid_notifications ORDER BY created_at DESC LIMIT 50');

    res.json({
      success: true,
      unreadCount: unreadCount ? unreadCount.total : 0,
      data: rows.map((n) => ({
        id: String(n.id),
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        channel: n.channel,
        isRead: Boolean(n.is_read),
        createdAt: n.created_at,
      })),
    });
  })
);

/**
 * PATCH /api/notifications/:id/read
 */
router.patch(
  '/:id/read',
  requirePermission('notifications.view'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('UPDATE sid_notifications SET is_read = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Notification marked as read' });
  })
);

/**
 * POST /api/notifications/mark-all-read
 */
router.post(
  '/mark-all-read',
  requirePermission('notifications.view'),
  asyncHandler(async (req, res) => {
    await query('UPDATE sid_notifications SET is_read = 1 WHERE is_read = 0');
    res.json({ success: true, message: 'All notifications marked as read' });
  })
);

module.exports = router;
