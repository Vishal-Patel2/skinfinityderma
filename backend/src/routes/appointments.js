const express = require('express');
const { query, one, tx } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');
const { createNotification } = require('../utils/notifications');

const router = express.Router();

/**
 * Helper: Find or create patient profile in sid_patients by phone
 */
async function syncPatient({ name, phone, email, gender, age }) {
  if (!phone) return null;
  const cleanP = phone.replace(/[^0-9]/g, '').slice(-10);
  const existing = await one(
    'SELECT id, name FROM sid_patients WHERE phone = ? OR phone LIKE ? LIMIT 1',
    [phone, `%${cleanP}`]
  );
  if (existing) {
    if (name && name !== existing.name) {
      await query('UPDATE sid_patients SET name = ? WHERE id = ?', [name, existing.id]);
    }
    return existing.id;
  }
  const code = 'PAT-' + Math.floor(100000 + Math.random() * 900000);
  const r = await query(
    `INSERT INTO sid_patients (patient_code, name, email, phone, gender, age)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [code, name || 'New Patient', email || null, phone, gender || null, age ? parseInt(age, 10) : null]
  );
  return r.insertId;
}

/**
 * GET /api/appointments/calendar
 * Returns events formatted for daily, weekly, and monthly calendar views
 */
router.get(
  '/calendar',
  requirePermission('appointments.view'),
  asyncHandler(async (req, res) => {
    const { start, end, clinicId, doctorId } = req.query;
    const where = ["status NOT IN ('cancelled')"];
    const params = [];

    if (start) {
      where.push('a.appointment_date >= ?');
      params.push(start.slice(0, 10));
    }
    if (end) {
      where.push('a.appointment_date <= ?');
      params.push(end.slice(0, 10));
    }
    if (clinicId) {
      where.push('a.clinic_id = ?');
      params.push(clinicId);
    }
    if (doctorId) {
      where.push('a.doctor_id = ?');
      params.push(doctorId);
    }

    const rows = await query(
      `SELECT a.*, c.title AS clinic_title, d.name AS doctor_name, t.name AS treatment_name
         FROM sid_appointments a
         LEFT JOIN sid_clinics c ON c.id = a.clinic_id
         LEFT JOIN sid_doctors d ON d.id = a.doctor_id
         LEFT JOIN sid_treatments t ON t.id = a.treatment_id
        WHERE ${where.join(' AND ')}
        ORDER BY a.appointment_date ASC, a.appointment_time ASC`,
      params
    );

    const events = rows.map((r) => {
      const timeParts = (r.appointment_time || '11:00').split(':');
      const h = parseInt(timeParts[0] || '11', 10);
      const m = parseInt(timeParts[1] || '00', 10);
      const startDateTime = `${r.appointment_date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
      
      // Assume 45 min default duration
      const endH = m + 45 >= 60 ? h + 1 : h;
      const endM = (m + 45) % 60;
      const endDateTime = `${r.appointment_date}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;

      let color = '#02542D'; // emerald
      if (r.status === 'confirmed') color = '#0D9488'; // teal
      else if (r.status === 'completed') color = '#2563EB'; // blue
      else if (r.status === 'rescheduled') color = '#D97706'; // amber
      else if (r.status === 'no_show') color = '#DC2626'; // red

      return {
        id: String(r.id),
        title: `${r.patient_name} - ${r.service_name || 'Consultation'}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          appointmentNo: r.appointment_no,
          patientName: r.patient_name,
          phone: r.phone,
          clinicName: r.clinic_title || 'HQ Clinic',
          doctorName: r.doctor_name || 'Dr. Ipshita Johri',
          serviceName: r.service_name || r.treatment_name,
          time: r.appointment_time,
          status: r.status,
          notes: r.notes,
        },
      };
    });

    res.json({ success: true, data: events });
  })
);

/**
 * GET /api/appointments
 * Search, filter, and paginate appointments
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
      where.push('(a.patient_name LIKE ? OR a.phone LIKE ? OR a.appointment_no LIKE ? OR a.service_name LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
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
        ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT 300`,
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
          patientId: r.patient_id ? String(r.patient_id) : null,
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
        patientId: row.patient_id ? String(row.patient_id) : null,
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
 * POST /api/appointments
 * Admin booking creation with double-booking prevention & patient sync
 */
router.post(
  '/',
  requirePermission('appointments.create'),
  asyncHandler(async (req, res) => {
    const {
      patientName,
      phone,
      email,
      gender,
      age,
      clinicId,
      doctorId,
      serviceName,
      treatmentId,
      appointmentDate,
      appointmentTime,
      visitType,
      amountEstimate,
      discountAmount,
      notes,
      source,
    } = req.body;

    if (!patientName) throw new HttpError(400, 'Patient name is required');
    if (!phone) throw new HttpError(400, 'Patient contact phone is required');
    if (!appointmentDate) throw new HttpError(400, 'Appointment date is required');
    if (!appointmentTime) throw new HttpError(400, 'Appointment time is required');

    // Double booking guard
    const targetClinicId = clinicId ? parseInt(clinicId, 10) : 1;
    const existingBookings = await one(
      `SELECT COUNT(*) AS total FROM sid_appointments
        WHERE clinic_id = ? AND appointment_date = ? AND appointment_time = ?
          AND status NOT IN ('cancelled', 'no_show')`,
      [targetClinicId, appointmentDate, appointmentTime]
    );

    const clinicRow = await one('SELECT slot_capacity FROM sid_clinics WHERE id = ?', [targetClinicId]);
    const maxCapacity = (clinicRow && clinicRow.slot_capacity) || 2;

    if (existingBookings && existingBookings.total >= maxCapacity) {
      throw new HttpError(409, `Double booking prevented: Time slot ${appointmentTime} on ${appointmentDate} is already at full capacity (${maxCapacity} patients). Please choose another slot.`);
    }

    const patientId = await syncPatient({ name: patientName, phone, email, gender, age });
    const apptNo = `SKF-${Date.now().toString().slice(-6)}`;

    const r = await query(
      `INSERT INTO sid_appointments (
        appointment_no, patient_id, patient_name, phone, email, gender, age,
        clinic_id, doctor_id, treatment_id, service_name, appointment_date, appointment_time,
        visit_type, amount_estimate, discount_amount, notes, source, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
      [
        apptNo,
        patientId,
        patientName.trim(),
        phone.trim(),
        email ? email.trim() : null,
        gender || 'Female',
        age ? parseInt(age, 10) : null,
        targetClinicId,
        doctorId ? parseInt(doctorId, 10) : null,
        treatmentId ? parseInt(treatmentId, 10) : null,
        serviceName || 'Clinical Consultation',
        appointmentDate,
        appointmentTime,
        visitType || 'new',
        amountEstimate ? Number(amountEstimate) : 1000,
        discountAmount ? Number(discountAmount) : 0,
        notes || null,
        source || 'admin-dashboard',
      ]
    );

    await createNotification({
      type: 'appointment_confirmed',
      title: 'Appointment Scheduled (Admin)',
      message: `${patientName} scheduled for ${serviceName || 'Consultation'} on ${appointmentDate} at ${appointmentTime}`,
      link: '/appointments.html',
      channel: 'in_app',
    });

    await audit(req, {
      action: 'create',
      entity: 'appointments',
      entityId: r.insertId,
      summary: `Created appointment ${apptNo} for ${patientName}`,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: { id: String(r.insertId), appointmentNo: apptNo },
    });
  })
);

/**
 * PUT /api/appointments/:id/reschedule
 * Reschedule an appointment slot
 */
router.put(
  '/:id/reschedule',
  requirePermission('appointments.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { appointmentDate, appointmentTime, clinicId } = req.body;
    if (!appointmentDate || !appointmentTime) {
      throw new HttpError(400, 'New appointment date and time are required.');
    }

    const appt = await one('SELECT * FROM sid_appointments WHERE id = ?', [id]);
    if (!appt) throw new HttpError(404, 'Appointment not found');

    const targetClinicId = clinicId ? parseInt(clinicId, 10) : appt.clinic_id || 1;

    // Check capacity for new slot
    const countRow = await one(
      `SELECT COUNT(*) AS total FROM sid_appointments
        WHERE clinic_id = ? AND appointment_date = ? AND appointment_time = ?
          AND id != ? AND status NOT IN ('cancelled', 'no_show')`,
      [targetClinicId, appointmentDate, appointmentTime, id]
    );

    const clinicRow = await one('SELECT slot_capacity FROM sid_clinics WHERE id = ?', [targetClinicId]);
    const maxCapacity = (clinicRow && clinicRow.slot_capacity) || 2;

    if (countRow && countRow.total >= maxCapacity) {
      throw new HttpError(409, `Reschedule conflict: Slot ${appointmentTime} on ${appointmentDate} is already booked to capacity.`);
    }

    const oldDate = `${appt.appointment_date} ${appt.appointment_time}`;
    await query(
      `UPDATE sid_appointments SET
         appointment_date = ?,
         appointment_time = ?,
         clinic_id = ?,
         status = 'rescheduled',
         updated_at = NOW()
       WHERE id = ?`,
      [appointmentDate, appointmentTime, targetClinicId, id]
    );

    await query(
      `INSERT INTO sid_lead_notes (entity_type, entity_id, user_id, user_name, note)
       VALUES ('appointment', ?, ?, ?, ?)`,
      [
        id,
        req.user?.id || 1,
        req.user?.name || 'Staff',
        `Rescheduled from ${oldDate} to ${appointmentDate} ${appointmentTime}`,
      ]
    );

    await createNotification({
      type: 'appointment_rescheduled',
      title: 'Appointment Rescheduled',
      message: `${appt.patient_name}'s appointment moved to ${appointmentDate} at ${appointmentTime}`,
      link: '/appointments.html',
    });

    await audit(req, {
      action: 'reschedule',
      entity: 'appointments',
      entityId: id,
      summary: `Rescheduled appointment ${appt.appointment_no} to ${appointmentDate} ${appointmentTime}`,
    });

    res.json({ success: true, message: 'Appointment rescheduled successfully' });
  })
);

/**
 * PUT /api/appointments/:id
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

    await createNotification({
      type: `appointment_${status}`,
      title: `Appointment Status: ${status.toUpperCase()}`,
      message: `Appointment ${appt.appointment_no} (${appt.patient_name}) updated to ${status}`,
      link: '/appointments.html',
    });

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
