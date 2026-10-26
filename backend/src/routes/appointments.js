const express = require('express');
const { query, one } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');

const router = express.Router();

/**
 * GET /api/appointments
 */
router.get(
  '/',
  requirePermission('appointments.view'),
  asyncHandler(async (req, res) => {
    const { status, clinicId, doctorId, date, q } = req.query;
    const where = ['1=1'];
    const params = [];

    if (status && status !== 'all') {
      where.push('a.status = ?');
      params.push(status);
    }
    if (clinicId) {
      where.push('a.clinic_id = ?');
      params.push(clinicId);
    }
    if (doctorId) {
      where.push('a.doctor_id = ?');
      params.push(doctorId);
    }
    if (date) {
      where.push('a.appointment_date = ?');
      params.push(date);
    }
    if (q) {
      where.push('(a.patient_name LIKE ? OR a.phone LIKE ? OR a.appointment_no LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    const rows = await query(
      `SELECT a.*, c.title AS clinic_title, c.city AS clinic_city, d.name AS doctor_name, t.name AS treatment_name
         FROM appointments a
         LEFT JOIN clinics c ON c.id = a.clinic_id
         LEFT JOIN doctors d ON d.id = a.doctor_id
         LEFT JOIN treatments t ON t.id = a.treatment_id
        WHERE ${where.join(' AND ')}
        ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT 200`,
      params
    );

    res.json({
      success: true,
      data: rows.map((r) => ({
        id: String(r.id),
        appointmentNo: r.appointment_no,
        patientName: r.patient_name,
        phone: r.phone,
        email: r.email,
        gender: r.gender,
        age: r.age,
        clinicId: r.clinic_id ? String(r.clinic_id) : null,
        clinicName: r.clinic_title || r.clinic_city || 'HQ Clinic',
        doctorId: r.doctor_id ? String(r.doctor_id) : null,
        doctorName: r.doctor_name || 'Assigned on Arrival',
        serviceName: r.service_name || r.treatment_name || 'Consultation',
        appointmentDate: r.appointment_date,
        appointmentTime: r.appointment_time,
        visitType: r.visit_type,
        couponCode: r.coupon_code,
        discountAmount: Number(r.discount_amount) || 0,
        amountEstimate: Number(r.amount_estimate) || 0,
        status: r.status,
        notes: r.notes,
        source: r.source,
        createdAt: r.created_at,
      })),
    });
  })
);

/**
 * PATCH /api/appointments/:id/status
 */
router.patch(
  '/:id/status',
  requirePermission('appointments.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    if (!status) throw new HttpError(400, 'Status is required');

    const appt = await one('SELECT * FROM appointments WHERE id = ?', [id]);
    if (!appt) throw new HttpError(404, 'Appointment not found');

    await query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);

    if (notes) {
      await query(
        `INSERT INTO lead_notes (entity_type, entity_id, user_id, user_name, note)
         VALUES ('appointment', ?, ?, ?, ?)`,
        [id, req.user.id, req.user.name, notes]
      );
    }

    await audit(req, {
      action: 'status_update',
      entity: 'appointments',
      entityId: id,
      summary: `Updated appointment ${appt.appointment_no} status to ${status}`,
    });

    res.json({ success: true, message: `Appointment marked as ${status}` });
  })
);

/**
 * DELETE /api/appointments/:id
 */
router.delete(
  '/:id',
  requirePermission('appointments.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const appt = await one('SELECT appointment_no FROM appointments WHERE id = ?', [id]);
    if (!appt) throw new HttpError(404, 'Appointment not found');

    await query('DELETE FROM appointments WHERE id = ?', [id]);

    await audit(req, {
      action: 'delete',
      entity: 'appointments',
      entityId: id,
      summary: `Deleted appointment ${appt.appointment_no}`,
    });

    res.json({ success: true, message: 'Appointment deleted successfully' });
  })
);

module.exports = router;
