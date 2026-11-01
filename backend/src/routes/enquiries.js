const express = require('express');
const { query, one } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');
const { parseJson } = require('../utils/helpers');
const { createNotification } = require('../utils/notifications');

const router = express.Router();

/**
 * GET /api/enquiries
 * Filter, search, and list CRM leads
 */
router.get(
  '/',
  requirePermission('enquiries.view'),
  asyncHandler(async (req, res) => {
    const { type, status, assignedTo, q } = req.query;
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
    if (assignedTo) {
      where.push('e.assigned_to = ?');
      params.push(assignedTo);
    }
    if (q) {
      where.push('(e.name LIKE ? OR e.phone LIKE ? OR e.email LIKE ? OR e.enquiry_no LIKE ? OR e.subject LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    }

    const rows = await query(
      `SELECT e.*, t.name AS treatment_name, u.name AS assigned_user_name
         FROM sid_enquiries e
         LEFT JOIN sid_treatments t ON t.id = e.treatment_id
         LEFT JOIN sid_users u ON u.id = e.assigned_to
        WHERE ${where.join(' AND ')}
        ORDER BY e.created_at DESC LIMIT 250`,
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
        assignedTo: r.assigned_to ? String(r.assigned_to) : null,
        assignedUserName: r.assigned_user_name || 'Unassigned',
        followUpAt: r.follow_up_at,
        createdAt: r.created_at,
      })),
    });
  })
);

/**
 * GET /api/enquiries/:id/notes
 * Get timeline of CRM notes for a lead
 */
router.get(
  '/:id/notes',
  requirePermission('enquiries.view'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notes = await query(
      `SELECT * FROM sid_lead_notes WHERE entity_type = 'enquiry' AND entity_id = ? ORDER BY created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: notes.map((n) => ({
        id: String(n.id),
        userName: n.user_name || 'Staff',
        note: n.note,
        createdAt: n.created_at,
      })),
    });
  })
);

/**
 * POST /api/enquiries/:id/notes
 * Add CRM follow-up note
 */
router.post(
  '/:id/notes',
  requirePermission('enquiries.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { note } = req.body;
    if (!note || !note.trim()) throw new HttpError(400, 'Note text is required');

    const enq = await one('SELECT enquiry_no FROM sid_enquiries WHERE id = ?', [id]);
    if (!enq) throw new HttpError(404, 'Enquiry not found');

    const r = await query(
      `INSERT INTO sid_lead_notes (entity_type, entity_id, user_id, user_name, note)
       VALUES ('enquiry', ?, ?, ?, ?)`,
      [id, req.user?.id || 1, req.user?.name || 'Staff', note.trim()]
    );

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: { id: String(r.insertId), note: note.trim() },
    });
  })
);

/**
 * POST /api/enquiries
 * Staff create lead manually
 */
router.post(
  '/',
  requirePermission('enquiries.create'),
  asyncHandler(async (req, res) => {
    const { name, phone, email, city, subject, message, type = 'contact', source = 'manual_entry', priority = 'normal', assignedTo } = req.body;
    if (!name || !phone) throw new HttpError(400, 'Name and phone are required');

    const enqNo = `ENQ-${Date.now().toString().slice(-6)}`;

    const r = await query(
      `INSERT INTO sid_enquiries (
        enquiry_no, type, name, phone, email, city, subject, message, source, priority, assigned_to, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
      [
        enqNo,
        type,
        name.trim(),
        phone.trim(),
        email ? email.trim() : null,
        city || 'Noida',
        subject || 'General Enquiry',
        message || null,
        source,
        priority,
        assignedTo ? parseInt(assignedTo, 10) : null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: { id: String(r.insertId), enquiryNo: enqNo },
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
    const { status, note, followUpAt } = req.body;
    if (!status) throw new HttpError(400, 'Status is required');

    const enq = await one('SELECT * FROM sid_enquiries WHERE id = ?', [id]);
    if (!enq) throw new HttpError(404, 'Enquiry not found');

    await query(
      `UPDATE sid_enquiries SET
         status = ?,
         follow_up_at = COALESCE(?, follow_up_at),
         updated_at = NOW()
       WHERE id = ?`,
      [status, followUpAt || null, id]
    );

    if (note) {
      await query(
        `INSERT INTO sid_lead_notes (entity_type, entity_id, user_id, user_name, note)
         VALUES ('enquiry', ?, ?, ?, ?)`,
        [id, req.user?.id || 1, req.user?.name || 'Staff', note]
      );
    }

    await audit(req, {
      action: 'status_update',
      entity: 'enquiries',
      entityId: id,
      summary: `Updated enquiry ${enq.enquiry_no} status to ${status}`,
    });

    res.json({ success: true, message: `Lead marked as ${status}` });
  })
);

/**
 * PATCH /api/enquiries/:id/assign
 */
router.patch(
  '/:id/assign',
  requirePermission('enquiries.assign'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const user = await one('SELECT id, name FROM sid_users WHERE id = ?', [assignedTo]);
    if (!user) throw new HttpError(400, 'Staff user not found');

    await query('UPDATE sid_enquiries SET assigned_to = ?, updated_at = NOW() WHERE id = ?', [user.id, id]);

    await query(
      `INSERT INTO sid_lead_notes (entity_type, entity_id, user_id, user_name, note)
       VALUES ('enquiry', ?, ?, ?, ?)`,
      [id, req.user?.id || 1, req.user?.name || 'Staff', `Lead assigned to ${user.name}`]
    );

    res.json({ success: true, message: `Lead successfully assigned to ${user.name}` });
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
