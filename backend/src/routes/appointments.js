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
      `SELECT a.*, 
              c.title AS clinic_title, c.city AS clinic_city, 
              d.name AS doctor_name, d.consultation_fee AS doctor_consultation_fee, d.specialty AS doctor_specialty, d.role AS doctor_role,
              t.name AS treatment_name
         FROM sid_appointments a
         LEFT JOIN sid_clinics c ON c.id = a.clinic_id
         LEFT JOIN sid_doctors d ON d.id = a.doctor_id
         LEFT JOIN sid_treatments t ON t.id = a.treatment_id
        WHERE ${where.join(' AND ')}
        ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT 250`,
      params
    );

    res.json({
      success: true,
      data: rows.map((r) => {
        const docFee = Number(r.doctor_consultation_fee) || 0;
        const baseEstimate = Number(r.amount_estimate) || 0;
        const discount = Number(r.discount_amount) || 0;
        const totalNet = Math.max(0, baseEstimate + docFee - discount);

        return {
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
          doctorFee: docFee,
          doctorFeeFormatted: docFee > 0 ? `₹${docFee.toLocaleString('en-IN')}` : '₹1,000',
          doctorSpecialty: r.doctor_specialty || '',
          doctorRole: r.doctor_role || '',
          serviceName: r.service_name || r.treatment_name || 'Consultation',
          appointmentDate: r.appointment_date,
          appointmentTime: r.appointment_time,
          visitType: r.visit_type,
          couponCode: r.coupon_code,
          discountAmount: discount,
          amountEstimate: baseEstimate,
          totalPayable: totalNet,
          totalPayableFormatted: `₹${totalNet.toLocaleString('en-IN')}`,
          status: r.status,
          notes: r.notes,
          source: r.source,
          createdAt: r.created_at,
        };
      }),
    });
  })
);

/**
 * GET /api/appointments/:id
 */
router.get(
  '/:id',
  requirePermission('appointments.view'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const row = await one(
      `SELECT a.*, 
              c.title AS clinic_title, c.city AS clinic_city, c.address AS clinic_address, c.phones AS clinic_phone,
              d.name AS doctor_name, d.consultation_fee AS doctor_consultation_fee, d.specialty AS doctor_specialty, d.qualifications AS doctor_qualifications,
              t.name AS treatment_name
         FROM sid_appointments a
         LEFT JOIN sid_clinics c ON c.id = a.clinic_id
         LEFT JOIN sid_doctors d ON d.id = a.doctor_id
         LEFT JOIN sid_treatments t ON t.id = a.treatment_id
        WHERE a.id = ?`,
      [id]
    );

    if (!row) throw new HttpError(404, 'Appointment not found');

    const docFee = Number(row.doctor_consultation_fee) || 0;
    const baseEstimate = Number(row.amount_estimate) || 0;
    const discount = Number(row.discount_amount) || 0;
    const totalNet = Math.max(0, baseEstimate + docFee - discount);

    res.json({
      success: true,
      data: {
        id: String(row.id),
        appointmentNo: row.appointment_no,
        patientName: row.patient_name,
        phone: row.phone,
        email: row.email,
        gender: row.gender,
        age: row.age,
        clinicId: row.clinic_id ? String(row.clinic_id) : null,
        clinicName: row.clinic_title || row.clinic_city || 'Skinfinity Derma HQ Clinic',
        clinicAddress: row.clinic_address || 'B-1/22, Sector 36, Near Golf Course Metro, Noida, UP - 201301',
        clinicPhone: row.clinic_phone || '+91 9871941444',
        doctorId: row.doctor_id ? String(row.doctor_id) : null,
        doctorName: row.doctor_name || 'Assigned on Arrival',
        doctorFee: docFee,
        doctorFeeFormatted: docFee > 0 ? `₹${docFee.toLocaleString('en-IN')}` : '₹1,000',
        doctorSpecialty: row.doctor_specialty || 'Senior Aesthetic Dermatologist',
        doctorQualifications: row.doctor_qualifications || 'MD, DNB (Dermatology)',
        serviceName: row.service_name || row.treatment_name || 'Consultation',
        appointmentDate: row.appointment_date,
        appointmentTime: row.appointment_time,
        visitType: row.visit_type,
        couponCode: row.coupon_code,
        discountAmount: discount,
        amountEstimate: baseEstimate,
        totalPayable: totalNet,
        totalPayableFormatted: `₹${totalNet.toLocaleString('en-IN')}`,
        status: row.status,
        notes: row.notes,
        source: row.source,
        createdAt: row.created_at,
      },
    });
  })
);

/**
 * PUT /api/appointments/:id
 * Full appointment update including doctor assignment, fees, and notes
 */
router.put(
  '/:id',
  requirePermission('appointments.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
      doctorId,
      clinicId,
      patientName,
      phone,
      email,
      serviceName,
      appointmentDate,
      appointmentTime,
      amountEstimate,
      discountAmount,
      couponCode,
      status,
      notes,
    } = req.body;

    const existing = await one('SELECT * FROM sid_appointments WHERE id = ?', [id]);
    if (!existing) throw new HttpError(404, 'Appointment not found');

    await query(
      `UPDATE sid_appointments SET
         doctor_id = ?,
         clinic_id = ?,
         patient_name = COALESCE(?, patient_name),
         phone = COALESCE(?, phone),
         email = COALESCE(?, email),
         service_name = COALESCE(?, service_name),
         appointment_date = COALESCE(?, appointment_date),
         appointment_time = COALESCE(?, appointment_time),
         amount_estimate = COALESCE(?, amount_estimate),
         discount_amount = COALESCE(?, discount_amount),
         coupon_code = COALESCE(?, coupon_code),
         status = COALESCE(?, status),
         notes = COALESCE(?, notes),
         updated_at = NOW()
       WHERE id = ?`,
      [
        doctorId !== undefined ? (doctorId ? parseInt(doctorId, 10) : null) : existing.doctor_id,
        clinicId !== undefined ? (clinicId ? parseInt(clinicId, 10) : null) : existing.clinic_id,
        patientName || null,
        phone || null,
        email || null,
        serviceName || null,
        appointmentDate || null,
        appointmentTime || null,
        amountEstimate !== undefined ? Number(amountEstimate) : existing.amount_estimate,
        discountAmount !== undefined ? Number(discountAmount) : existing.discount_amount,
        couponCode !== undefined ? couponCode : existing.coupon_code,
        status || existing.status,
        notes !== undefined ? notes : existing.notes,
        id,
      ]
    );

    if (notes && notes !== existing.notes) {
      await query(
        `INSERT INTO sid_lead_notes (entity_type, entity_id, user_id, user_name, note)
         VALUES ('appointment', ?, ?, ?, ?)`,
        [id, req.user?.id || 1, req.user?.name || 'Staff', notes]
      );
    }

    await audit(req, {
      action: 'update',
      entity: 'appointments',
      entityId: id,
      summary: `Updated appointment details for ${existing.appointment_no}`,
    });

    res.json({ success: true, message: 'Appointment details updated successfully' });
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

    const appt = await one('SELECT * FROM sid_appointments WHERE id = ?', [id]);
    if (!appt) throw new HttpError(404, 'Appointment not found');

    await query('UPDATE sid_appointments SET status = ? WHERE id = ?', [status, id]);

    if (notes) {
      await query(
        `INSERT INTO sid_lead_notes (entity_type, entity_id, user_id, user_name, note)
         VALUES ('appointment', ?, ?, ?, ?)`,
        [id, req.user?.id || 1, req.user?.name || 'Staff', notes]
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
    const appt = await one('SELECT appointment_no FROM sid_appointments WHERE id = ?', [id]);
    if (!appt) throw new HttpError(404, 'Appointment not found');

    await query('DELETE FROM sid_appointments WHERE id = ?', [id]);

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
