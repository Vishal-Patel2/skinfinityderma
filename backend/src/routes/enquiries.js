const express = require('express');
const { query, one } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');
const { parseJson } = require('../utils/helpers');

const router = express.Router();

/**
 * GET /api/enquiries
 */
router.get(
  '/',
  requirePermission('enquiries.view'),
  asyncHandler(async (req, res) => {
    const { type, status, q } = req.query;
    const where = ['1=1'];
    const params = [];

    if (type && type !== 'all') {
      where.push('e.type = ?');
      params.push(type);
    }
    if (status && status !== 'all') {
      where.push('e.status = ?');
      params.push(status);
    }
    if (q) {
      where.push('(e.name LIKE ? OR e.phone LIKE ? OR e.email LIKE ? OR e.enquiry_no LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    }

    const rows = await query(
      `SELECT e.*, t.name AS treatment_name
         FROM sid_enquiries e
         LEFT JOIN sid_treatments t ON t.id = e.treatment_id
        WHERE ${where.join(' AND ')}
        ORDER BY e.created_at DESC LIMIT 200`,
      params
    );

    res.json({
      success: true,
      data: rows.map((r) => ({
        id: String(r.id),
        enquiryNo: r.enquiry_no,
        type: r.type,
        name: r.name,
        phone: r.phone,
        email: r.email,
        city: r.city,
        subject: r.subject,
        message: r.message,
        treatmentName: r.treatment_name,
        source: r.source,
        extra: parseJson(r.extra, null),
        status: r.status,
        priority: r.priority,
        createdAt: r.created_at,
      })),
    });
  })
);

/**
 * PATCH /api/enquiries/:id/status
 */
router.patch(
  '/:id/status',
  requirePermission('enquiries.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, note } = req.body;
    if (!status) throw new HttpError(400, 'Status is required');

    const enq = await one('SELECT * FROM sid_enquiries WHERE id = ?', [id]);
    if (!enq) throw new HttpError(404, 'Enquiry not found');

    await query('UPDATE sid_enquiries SET status = ? WHERE id = ?', [status, id]);

    if (note) {
      await query(
        `INSERT INTO sid_lead_notes (entity_type, entity_id, user_id, user_name, note)
         VALUES ('enquiry', ?, ?, ?, ?)`,
        [id, req.user.id, req.user.name, note]
      );
    }

    await audit(req, {
      action: 'status_update',
      entity: 'enquiries',
      entityId: id,
      summary: `Updated enquiry ${enq.enquiry_no} status to ${status}`,
    });

    res.json({ success: true, message: `Enquiry marked as ${status}` });
  })
);

/**
 * DELETE /api/enquiries/:id
 */
router.delete(
  '/:id',
  requirePermission('enquiries.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const enq = await one('SELECT enquiry_no FROM sid_enquiries WHERE id = ?', [id]);
    if (!enq) throw new HttpError(404, 'Enquiry not found');

    await query('DELETE FROM sid_enquiries WHERE id = ?', [id]);

    await audit(req, {
      action: 'delete',
      entity: 'enquiries',
      entityId: id,
      summary: `Deleted enquiry ${enq.enquiry_no}`,
    });

    res.json({ success: true, message: 'Enquiry deleted successfully' });
  })
);

module.exports = router;
