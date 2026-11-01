const express = require('express');
const { query, one } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');

const router = express.Router();

/**
 * GET /api/patients
 * List patients with search and pagination
 */
router.get(
  '/',
  requirePermission('patients.view'),
  asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 50 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const where = ['1=1'];
    const params = [];

    if (q) {
      where.push('(p.name LIKE ? OR p.phone LIKE ? OR p.email LIKE ? OR p.patient_code LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    }

    const countRow = await one(
      `SELECT COUNT(*) AS total FROM sid_patients p WHERE ${where.join(' AND ')}`,
      params
    );

    const rows = await query(
      `SELECT p.*, 
              (SELECT COUNT(*) FROM sid_appointments WHERE patient_id = p.id OR phone = p.phone) AS appointment_count,
              (SELECT MAX(appointment_date) FROM sid_appointments WHERE patient_id = p.id OR phone = p.phone) AS last_visit_date
         FROM sid_patients p
        WHERE ${where.join(' AND ')}
        ORDER BY p.id DESC
        LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), offset]
    );

    res.json({
      success: true,
      total: countRow.total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      data: rows.map((p) => ({
        id: String(p.id),
        patientCode: p.patient_code || `PAT-${String(p.id).padStart(5, '0')}`,
        name: p.name,
        email: p.email || '—',
        phone: p.phone,
        gender: p.gender || 'Not Specified',
        age: p.age || '—',
        city: p.city || 'Noida / NCR',
        address: p.address || '',
        medicalHistory: p.medical_history || '',
        allergies: p.allergies || 'None recorded',
        emergencyContact: p.emergency_contact || '',
        notes: p.notes || '',
        appointmentCount: p.appointment_count || 0,
        lastVisitDate: p.last_visit_date || null,
        createdAt: p.created_at,
      })),
    });
  })
);

/**
 * GET /api/patients/:id
 * Retrieve patient profile with appointment history & clinical notes
 */
router.get(
  '/:id',
  requirePermission('patients.view'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const p = await one('SELECT * FROM sid_patients WHERE id = ?', [id]);
    if (!p) throw new HttpError(404, 'Patient profile not found');

    const appointments = await query(
      `SELECT a.id, a.appointment_no, a.appointment_date, a.appointment_time, a.service_name, a.status,
              c.title AS clinic_name, d.name AS doctor_name, a.amount_estimate, a.discount_amount
         FROM sid_appointments a
         LEFT JOIN sid_clinics c ON c.id = a.clinic_id
         LEFT JOIN sid_doctors d ON d.id = a.doctor_id
        WHERE a.patient_id = ? OR a.phone = ?
        ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [id, p.phone]
    );

    const notes = await query(
      `SELECT * FROM sid_lead_notes
        WHERE entity_type = 'appointment'
          AND entity_id IN (SELECT id FROM sid_appointments WHERE patient_id = ? OR phone = ?)
        ORDER BY created_at DESC`,
      [id, p.phone]
    );

    res.json({
      success: true,
      data: {
        id: String(p.id),
        patientCode: p.patient_code || `PAT-${String(p.id).padStart(5, '0')}`,
        name: p.name,
        email: p.email,
        phone: p.phone,
        gender: p.gender,
        age: p.age,
        dob: p.dob,
        address: p.address,
        city: p.city,
        medicalHistory: p.medical_history,
        allergies: p.allergies,
        emergencyContact: p.emergency_contact,
        notes: p.notes,
        appointments: appointments.map((a) => ({
          id: String(a.id),
          appointmentNo: a.appointment_no,
          date: a.appointment_date,
          time: a.appointment_time,
          service: a.service_name,
          doctorName: a.doctor_name || 'Assigned Specialist',
          clinicName: a.clinic_name || 'Main Clinic',
          status: a.status,
          amount: a.amount_estimate,
        })),
        clinicalNotes: notes,
      },
    });
  })
);

/**
 * POST /api/patients
 * Create new patient profile
 */
router.post(
  '/',
  requirePermission('patients.create'),
  asyncHandler(async (req, res) => {
    const { name, phone, email, gender, age, dob, city, address, medicalHistory, allergies, emergencyContact, notes } = req.body;
    if (!name) throw new HttpError(400, 'Patient name is required');
    if (!phone) throw new HttpError(400, 'Patient phone number is required');

    const cleanP = phone.replace(/[^0-9]/g, '').slice(-10);
    const existing = await one('SELECT id FROM sid_patients WHERE phone = ? OR phone LIKE ?', [phone, `%${cleanP}`]);
    if (existing) {
      throw new HttpError(409, `A patient with phone number ${phone} already exists.`);
    }

    const patientCode = 'PAT-' + Math.floor(100000 + Math.random() * 900000);

    const r = await query(
      `INSERT INTO sid_patients (
        patient_code, name, email, phone, gender, age, dob, city, address,
        medical_history, allergies, emergency_contact, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientCode,
        name.trim(),
        email ? email.trim() : null,
        phone.trim(),
        gender || null,
        age ? parseInt(age, 10) : null,
        dob || null,
        city || 'Noida',
        address || null,
        medicalHistory || null,
        allergies || null,
        emergencyContact || null,
        notes || null,
      ]
    );

    await audit(req, {
      action: 'create',
      entity: 'patients',
      entityId: r.insertId,
      summary: `Created patient record for ${name} (${patientCode})`,
    });

    res.status(201).json({
      success: true,
      message: 'Patient profile created successfully',
      data: { id: String(r.insertId), patientCode },
    });
  })
);

/**
 * PUT /api/patients/:id
 * Update patient profile
 */
router.put(
  '/:id',
  requirePermission('patients.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, gender, age, dob, city, address, medicalHistory, allergies, emergencyContact, notes } = req.body;

    const existing = await one('SELECT * FROM sid_patients WHERE id = ?', [id]);
    if (!existing) throw new HttpError(404, 'Patient profile not found');

    await query(
      `UPDATE sid_patients SET
         name = COALESCE(?, name),
         email = COALESCE(?, email),
         phone = COALESCE(?, phone),
         gender = COALESCE(?, gender),
         age = COALESCE(?, age),
         dob = COALESCE(?, dob),
         city = COALESCE(?, city),
         address = COALESCE(?, address),
         medical_history = COALESCE(?, medical_history),
         allergies = COALESCE(?, allergies),
         emergency_contact = COALESCE(?, emergency_contact),
         notes = COALESCE(?, notes),
         updated_at = NOW()
       WHERE id = ?`,
      [
        name || null,
        email !== undefined ? email : existing.email,
        phone || null,
        gender || null,
        age !== undefined ? parseInt(age, 10) : existing.age,
        dob || null,
        city || null,
        address !== undefined ? address : existing.address,
        medicalHistory !== undefined ? medicalHistory : existing.medical_history,
        allergies !== undefined ? allergies : existing.allergies,
        emergencyContact !== undefined ? emergencyContact : existing.emergency_contact,
        notes !== undefined ? notes : existing.notes,
        id,
      ]
    );

    await audit(req, {
      action: 'update',
      entity: 'patients',
      entityId: id,
      summary: `Updated patient details for ${existing.name}`,
    });

    res.json({ success: true, message: 'Patient profile updated successfully' });
  })
);

/**
 * DELETE /api/patients/:id
 */
router.delete(
  '/:id',
  requirePermission('patients.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await one('SELECT name, patient_code FROM sid_patients WHERE id = ?', [id]);
    if (!existing) throw new HttpError(404, 'Patient not found');

    await query('DELETE FROM sid_patients WHERE id = ?', [id]);

    await audit(req, {
      action: 'delete',
      entity: 'patients',
      entityId: id,
      summary: `Deleted patient profile: ${existing.name} (${existing.patient_code})`,
    });

    res.json({ success: true, message: 'Patient profile deleted successfully' });
  })
);

module.exports = router;
