const express = require('express');
const { query, one, tx } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');

const router = express.Router();

/** Helper: Calculate age from DOB */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return Math.max(0, age);
}

/**
 * GET /api/patients/export
 * Export patients as downloadable CSV
 */
router.get(
  '/export',
  requirePermission('patients.export', 'patients.view'),
  asyncHandler(async (req, res) => {
    const { q, gender, clinicId, status } = req.query;
    const where = ['1=1'];
    const params = [];

    if (q) {
      where.push('(p.name LIKE ? OR p.phone LIKE ? OR p.email LIKE ? OR p.patient_code LIKE ? OR p.whatsapp_no LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (gender) {
      where.push('p.gender = ?');
      params.push(gender);
    }
    if (clinicId) {
      where.push('p.preferred_clinic_id = ?');
      params.push(clinicId);
    }
    if (status) {
      where.push('p.status = ?');
      params.push(status);
    }

    const rows = await query(
      `SELECT p.*, c.title AS preferred_clinic_name,
              (SELECT COUNT(*) FROM sid_appointments WHERE patient_id = p.id OR phone = p.phone) AS appointment_count,
              (SELECT MAX(appointment_date) FROM sid_appointments WHERE patient_id = p.id OR phone = p.phone) AS last_visit_date
         FROM sid_patients p
         LEFT JOIN sid_clinics c ON c.id = p.preferred_clinic_id
        WHERE ${where.join(' AND ')}
        ORDER BY p.id DESC`,
      params
    );

    let csv = 'Patient ID,Full Name,Email,Primary Phone,WhatsApp,Gender,DOB,Age,City,State,Preferred Branch,Status,Total Visits,Last Visit,Registration Date\n';
    rows.forEach((r) => {
      const age = r.dob ? calculateAge(r.dob) : (r.age || '—');
      const clean = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
      csv += [
        clean(r.patient_code || `PAT-${r.id}`),
        clean(r.name),
        clean(r.email || '—'),
        clean(r.phone),
        clean(r.whatsapp_no || r.phone),
        clean(r.gender || 'Not Specified'),
        clean(r.dob || '—'),
        clean(age),
        clean(r.city || 'Noida'),
        clean(r.state || 'Uttar Pradesh'),
        clean(r.preferred_clinic_name || 'Noida HQ'),
        clean(r.status || 'Active'),
        clean(r.appointment_count || 0),
        clean(r.last_visit_date || 'Never'),
        clean(r.created_at ? new Date(r.created_at).toISOString().slice(0, 10) : '—'),
      ].join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=skinfinity_patients_${Date.now()}.csv`);
    res.send(csv);
  })
);

/**
 * GET /api/patients
 * List patients with search, multi-filters, sorting and pagination
 */
router.get(
  '/',
  requirePermission('patients.view'),
  asyncHandler(async (req, res) => {
    const {
      q,
      gender,
      clinicId,
      status,
      startDate,
      endDate,
      sortBy = 'id',
      sortOrder = 'DESC',
      page = 1,
      limit = 20,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const where = ['1=1'];
    const params = [];

    if (q && q.trim()) {
      where.push('(p.name LIKE ? OR p.phone LIKE ? OR p.email LIKE ? OR p.patient_code LIKE ? OR p.whatsapp_no LIKE ?)');
      params.push(`%${q.trim()}%`, `%${q.trim()}%`, `%${q.trim()}%`, `%${q.trim()}%`, `%${q.trim()}%`);
    }

    if (gender && gender.trim()) {
      where.push('p.gender = ?');
      params.push(gender.trim());
    }

    if (clinicId) {
      where.push('p.preferred_clinic_id = ?');
      params.push(Number(clinicId));
    }

    if (status && status.trim()) {
      where.push('p.status = ?');
      params.push(status.trim());
    }

    if (startDate) {
      where.push('DATE(p.created_at) >= ?');
      params.push(startDate);
    }

    if (endDate) {
      where.push('DATE(p.created_at) <= ?');
      params.push(endDate);
    }

    // Allowed sort columns
    const allowedSorts = {
      id: 'p.id',
      name: 'p.name',
      created_at: 'p.created_at',
      status: 'p.status',
      appointment_count: 'appointment_count',
      last_visit_date: 'last_visit_date',
    };
    const orderCol = allowedSorts[sortBy] || 'p.id';
    const orderDir = String(sortOrder).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countRow = await one(
      `SELECT COUNT(*) AS total FROM sid_patients p WHERE ${where.join(' AND ')}`,
      params
    );

    const rows = await query(
      `SELECT p.*, c.title AS preferred_clinic_name,
              (SELECT COUNT(*) FROM sid_appointments WHERE patient_id = p.id OR phone = p.phone) AS appointment_count,
              (SELECT MAX(appointment_date) FROM sid_appointments WHERE patient_id = p.id OR phone = p.phone) AS last_visit_date
         FROM sid_patients p
         LEFT JOIN sid_clinics c ON c.id = p.preferred_clinic_id
        WHERE ${where.join(' AND ')}
        ORDER BY ${orderCol} ${orderDir}
        LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    res.json({
      success: true,
      total: Number(countRow.total) || 0,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil((Number(countRow.total) || 0) / limitNum),
      data: rows.map((p, idx) => {
        const age = p.dob ? calculateAge(p.dob) : (p.age || '—');
        return {
          sn: offset + idx + 1,
          id: String(p.id),
          patientCode: p.patient_code || `PAT-${String(p.id).padStart(5, '0')}`,
          name: p.name,
          email: p.email || '—',
          phone: p.phone,
          whatsappNo: p.whatsapp_no || p.phone,
          gender: p.gender || 'Not Specified',
          age: age || '—',
          dob: p.dob || null,
          city: p.city || 'Noida',
          state: p.state || 'Uttar Pradesh',
          pincode: p.pincode || '',
          preferredClinicId: p.preferred_clinic_id || 1,
          preferredClinicName: p.preferred_clinic_name || 'Noida HQ Clinic',
          status: p.status || 'Active',
          loyaltyPoints: p.loyalty_points || 0,
          memberTier: p.member_tier || 'Silver',
          medicalHistory: p.medical_history || '',
          allergies: p.allergies || 'None recorded',
          skinConcerns: p.skin_concerns || '',
          emergencyContact: p.emergency_contact || '',
          notes: p.notes || '',
          appointmentCount: Number(p.appointment_count) || 0,
          lastVisitDate: p.last_visit_date || null,
          createdAt: p.created_at,
        };
      }),
    });
  })
);

/**
 * GET /api/patients/:id
 * Retrieve Complete Patient Profile & 14-Tab Clinical Dossier
 */
router.get(
  '/:id',
  requirePermission('patients.view'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const p = await one(
      `SELECT p.*, c.title AS preferred_clinic_name 
         FROM sid_patients p 
         LEFT JOIN sid_clinics c ON c.id = p.preferred_clinic_id 
        WHERE p.id = ?`,
      [id]
    );
    if (!p) throw new HttpError(404, 'Patient profile not found');

    const calculatedAge = p.dob ? calculateAge(p.dob) : (p.age || '—');

    // 14 Clinical Dossier Tabs Queries in Parallel
    const [
      appointments,
      consultations,
      skinAssessments,
      prescriptions,
      documents,
      gallery,
      packages,
      payments,
      invoices,
      activityLogs,
      enquiries,
      loyaltyLogs,
      leadNotes,
    ] = await Promise.all([
      // Tab 3: Appointments
      query(
        `SELECT a.id, a.appointment_no, a.appointment_date, a.appointment_time, a.service_name,
                a.status, a.visit_type, a.consultation_fee, a.discount_amount, a.final_amount,
                a.payment_status, a.follow_up_date, a.notes,
                c.title AS clinic_name, d.name AS doctor_name, d.specialty AS doctor_specialty
           FROM sid_appointments a
           LEFT JOIN sid_clinics c ON c.id = a.clinic_id
           LEFT JOIN sid_doctors d ON d.id = a.doctor_id
          WHERE a.patient_id = ? OR a.phone = ?
          ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
        [id, p.phone]
      ),
      // Tab 4: Consultations
      query(
        `SELECT c.*, d.name AS doctor_name, d.specialty AS doctor_specialty, cl.title AS clinic_name
           FROM sid_patient_consultations c
           LEFT JOIN sid_doctors d ON d.id = c.doctor_id
           LEFT JOIN sid_clinics cl ON cl.id = c.clinic_id
          WHERE c.patient_id = ?
          ORDER BY c.consultation_date DESC, c.id DESC`,
        [id]
      ),
      // Tab 8: Skin Health Records
      query(
        `SELECT s.*, d.name AS doctor_name
           FROM sid_patient_skin_assessments s
           LEFT JOIN sid_doctors d ON d.id = s.doctor_id
          WHERE s.patient_id = ?
          ORDER BY s.assessment_date DESC, s.id DESC`,
        [id]
      ),
      // Tab 7: Prescriptions
      query(
        `SELECT rx.*, d.name AS doctor_name, cl.title AS clinic_name
           FROM sid_patient_prescriptions rx
           LEFT JOIN sid_doctors d ON d.id = rx.doctor_id
           LEFT JOIN sid_clinics cl ON cl.id = rx.clinic_id
          WHERE rx.patient_id = ?
          ORDER BY rx.prescription_date DESC, rx.id DESC`,
        [id]
      ),
      // Tab 9: Uploaded Documents
      query(
        `SELECT doc.*, u.name AS uploaded_by_name
           FROM sid_patient_documents doc
           LEFT JOIN sid_users u ON u.id = doc.uploaded_by
          WHERE doc.patient_id = ?
          ORDER BY doc.created_at DESC`,
        [id]
      ),
      // Tab 6b: Before & After Clinical Gallery
      query(
        `SELECT g.*, t.name AS treatment_name
           FROM sid_patient_gallery g
           LEFT JOIN sid_treatments t ON t.id = g.treatment_id
          WHERE g.patient_id = ?
          ORDER BY g.created_at DESC`,
        [id]
      ),
      // Tab 5 & 11: Purchased Treatment Packages
      query(
        `SELECT pkg.*, t.name AS treatment_name
           FROM sid_patient_packages pkg
           LEFT JOIN sid_treatments t ON t.id = pkg.treatment_id
          WHERE pkg.patient_id = ?
          ORDER BY pkg.purchase_date DESC, pkg.id DESC`,
        [id]
      ),
      // Tab 10a: Payments
      query(
        `SELECT * FROM sid_payments
          WHERE patient_id = ?
          ORDER BY payment_date DESC, id DESC`,
        [id]
      ),
      // Tab 10b: Invoices
      query(
        `SELECT * FROM sid_invoices
          WHERE patient_id = ?
          ORDER BY invoice_date DESC, id DESC`,
        [id]
      ),
      // Tab 14: Activity Timeline
      query(
        `SELECT act.*, u.name AS user_name
           FROM sid_patient_activity_logs act
           LEFT JOIN sid_users u ON u.id = act.user_id
          WHERE act.patient_id = ?
          ORDER BY act.created_at DESC`,
        [id]
      ),
      // Tab 12: Enquiries & Communications
      query(
        `SELECT * FROM sid_enquiries
          WHERE phone = ? OR (email IS NOT NULL AND email = ?)
          ORDER BY created_at DESC`,
        [p.phone, p.email]
      ),
      // Tab 11: Loyalty Transactions
      query(
        `SELECT * FROM sid_loyalty_transactions
          WHERE patient_id = ?
          ORDER BY created_at DESC`,
        [id]
      ),
      // Tab 13: Internal Clinical & Coordinator Notes
      query(
        `SELECT n.*, u.name AS author_name 
           FROM sid_lead_notes n
           LEFT JOIN sid_users u ON u.id = n.user_id
          WHERE n.entity_type = 'patient' AND n.entity_id = ?
          ORDER BY n.created_at DESC`,
        [id]
      ),
    ]);

    // Fetch items for each prescription
    for (const rx of prescriptions) {
      rx.items = await query('SELECT * FROM sid_prescription_items WHERE prescription_id = ?', [rx.id]);
    }

    // Overview Statistics calculation
    let totalSpent = 0;
    payments.forEach((pay) => {
      if (pay.status === 'successful') totalSpent += Number(pay.amount) || 0;
    });

    const activePackagesCount = packages.filter((pkg) => pkg.status === 'Active').length;
    const completedTreatmentsCount = appointments.filter((a) => a.status === 'completed').length;

    res.json({
      success: true,
      data: {
        // Tab 1: Overview
        overview: {
          id: String(p.id),
          patientCode: p.patient_code || `PAT-${String(p.id).padStart(5, '0')}`,
          name: p.name,
          phone: p.phone,
          whatsappNo: p.whatsapp_no || p.phone,
          email: p.email || '—',
          gender: p.gender || 'Not Specified',
          age: calculatedAge,
          status: p.status || 'Active',
          memberTier: p.member_tier || 'Silver',
          loyaltyPoints: p.loyalty_points || 0,
          preferredClinicName: p.preferred_clinic_name || 'Noida HQ',
          registrationDate: p.created_at,
          totalAppointments: appointments.length,
          completedTreatments: completedTreatmentsCount,
          activePackagesCount,
          totalSpent,
          totalSpentFormatted: `₹${totalSpent.toLocaleString('en-IN')}`,
          lastVisitDate: appointments.length > 0 ? appointments[0].appointment_date : null,
        },

        // Tab 2: Personal Details
        personalDetails: {
          id: String(p.id),
          patientCode: p.patient_code,
          name: p.name,
          email: p.email,
          phone: p.phone,
          whatsappNo: p.whatsapp_no,
          gender: p.gender,
          age: calculatedAge,
          dob: p.dob,
          address: p.address,
          city: p.city,
          state: p.state,
          pincode: p.pincode,
          preferredClinicId: p.preferred_clinic_id,
          preferredClinicName: p.preferred_clinic_name,
          emergencyContact: p.emergency_contact,
        },

        // Tab 3: Appointments
        appointments,

        // Tab 4: Consultation History
        consultations,

        // Tab 5: Treatment History
        treatmentHistory: packages,

        // Tab 6: Medical Records
        medicalRecords: {
          medicalHistory: p.medical_history || 'No chronic contraindications recorded.',
          allergies: p.allergies || 'No known drug or cosmetic allergies.',
          skinConcerns: p.skin_concerns || 'None specified.',
        },

        // Tab 7: Prescriptions
        prescriptions,

        // Tab 8: Skin Health Records
        skinHealthRecords: skinAssessments,

        // Tab 9: Uploaded Documents
        documents,

        // Tab 6b: Before & After Photos Gallery
        gallery,

        // Tab 10: Payments & Invoices
        payments,
        invoices,

        // Tab 11: Membership & Loyalty
        membership: {
          tier: p.member_tier || 'Silver',
          loyaltyPoints: p.loyalty_points || 0,
          transactions: loyaltyLogs,
        },

        // Tab 12: Enquiries & Communication
        enquiries,

        // Tab 13: Internal Notes
        internalNotes: leadNotes.length > 0 ? leadNotes : (p.notes ? [{ id: 0, note: p.notes, author_name: 'Coordinator', created_at: p.created_at }] : []),

        // Tab 14: Activity Timeline
        activityTimeline: activityLogs,
      },
    });
  })
);

/**
 * POST /api/patients
 * Create new patient profile (Admin walk-in registration)
 */
router.post(
  '/',
  requirePermission('patients.create'),
  asyncHandler(async (req, res) => {
    const {
      name,
      phone,
      email,
      whatsappNo,
      gender,
      dob,
      age,
      city,
      state,
      pincode,
      address,
      preferredClinicId,
      medicalHistory,
      allergies,
      skinConcerns,
      emergencyContact,
      notes,
      status = 'Active',
    } = req.body;

    if (!name || !name.trim()) throw new HttpError(400, 'Patient name is required');
    if (!phone || !phone.trim()) throw new HttpError(400, 'Primary phone number is required');

    const cleanP = phone.replace(/[^0-9]/g, '').slice(-10);
    const existing = await one('SELECT id, name FROM sid_patients WHERE phone LIKE ?', [`%${cleanP}`]);
    if (existing) {
      throw new HttpError(409, `A patient with phone number ending in ${cleanP} already exists (${existing.name}).`);
    }

    const calculatedAge = dob ? calculateAge(dob) : (age ? parseInt(age, 10) : null);

    const countRow = await one('SELECT COUNT(*) AS total FROM sid_patients');
    const patientCode = `PAT-${String(100 + Number(countRow.total) + 1).padStart(5, '0')}`;

    const r = await query(
      `INSERT INTO sid_patients (
        patient_code, name, email, phone, whatsapp_no, gender, age, dob, city, state, pincode, address,
        preferred_clinic_id, medical_history, allergies, skin_concerns, emergency_contact, notes, status,
        loyalty_points, member_tier
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 100, 'Silver')`,
      [
        patientCode,
        name.trim(),
        email ? email.trim() : null,
        phone.trim(),
        whatsappNo ? whatsappNo.trim() : phone.trim(),
        gender || 'Female',
        calculatedAge,
        dob || null,
        city || 'Noida',
        state || 'Uttar Pradesh',
        pincode || '',
        address || '',
        preferredClinicId ? Number(preferredClinicId) : 1,
        medicalHistory || '',
        allergies || '',
        skinConcerns || '',
        emergencyContact || '',
        notes || '',
        status || 'Active',
      ]
    );

    const newId = r.insertId;

    // Log Activity
    await query(
      `INSERT INTO sid_patient_activity_logs (patient_id, user_id, activity_type, description)
       VALUES (?, ?, 'Patient Registration', 'Walk-in patient registered by clinic desk.')`,
      [newId, req.user ? req.user.id : null]
    );

    await audit(req, {
      action: 'create',
      entity: 'patients',
      entityId: newId,
      summary: `Created walk-in patient record for ${name} (${patientCode})`,
    });

    res.status(201).json({
      success: true,
      message: 'Patient profile registered successfully',
      data: { id: String(newId), patientCode },
    });
  })
);

/**
 * PUT /api/patients/:id
 * Update patient profile details
 */
router.put(
  '/:id',
  requirePermission('patients.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
      name,
      phone,
      whatsappNo,
      email,
      gender,
      age,
      dob,
      city,
      state,
      pincode,
      address,
      preferredClinicId,
      medicalHistory,
      allergies,
      skinConcerns,
      emergencyContact,
      notes,
      status,
    } = req.body;

    const existing = await one('SELECT * FROM sid_patients WHERE id = ?', [id]);
    if (!existing) throw new HttpError(404, 'Patient profile not found');

    const calculatedAge = dob ? calculateAge(dob) : (age !== undefined ? parseInt(age, 10) : existing.age);

    await query(
      `UPDATE sid_patients SET
         name = COALESCE(?, name),
         email = COALESCE(?, email),
         phone = COALESCE(?, phone),
         whatsapp_no = COALESCE(?, whatsapp_no),
         gender = COALESCE(?, gender),
         age = COALESCE(?, age),
         dob = COALESCE(?, dob),
         city = COALESCE(?, city),
         state = COALESCE(?, state),
         pincode = COALESCE(?, pincode),
         address = COALESCE(?, address),
         preferred_clinic_id = COALESCE(?, preferred_clinic_id),
         medical_history = COALESCE(?, medical_history),
         allergies = COALESCE(?, allergies),
         skin_concerns = COALESCE(?, skin_concerns),
         emergency_contact = COALESCE(?, emergency_contact),
         notes = COALESCE(?, notes),
         status = COALESCE(?, status),
         updated_at = NOW()
       WHERE id = ?`,
      [
        name || null,
        email !== undefined ? email : existing.email,
        phone || null,
        whatsappNo || null,
        gender || null,
        calculatedAge,
        dob || null,
        city || null,
        state || null,
        pincode || null,
        address !== undefined ? address : existing.address,
        preferredClinicId ? Number(preferredClinicId) : null,
        medicalHistory !== undefined ? medicalHistory : existing.medical_history,
        allergies !== undefined ? allergies : existing.allergies,
        skinConcerns !== undefined ? skinConcerns : existing.skin_concerns,
        emergencyContact !== undefined ? emergencyContact : existing.emergency_contact,
        notes !== undefined ? notes : existing.notes,
        status || null,
        id,
      ]
    );

    await query(
      `INSERT INTO sid_patient_activity_logs (patient_id, user_id, activity_type, description)
       VALUES (?, ?, 'Profile Updated', 'Patient profile updated by clinic staff.')`,
      [id, req.user ? req.user.id : null]
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
 * Delete or archive patient record
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

/* ========================================================================== */
/* CLINICAL RECORD ACTION SUB-ENDPOINTS                                       */
/* ========================================================================== */

/**
 * POST /api/patients/:id/consultations
 * Create clinical consultation record
 */
router.post(
  '/:id/consultations',
  requirePermission('patients.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
      doctorId,
      clinicId,
      consultationDate,
      primaryConcern,
      symptoms,
      skinHairAssessment,
      diagnosis,
      treatmentRecommendations,
      doctorNotes,
      followUpDate,
      status = 'Completed',
    } = req.body;

    const patient = await one('SELECT id, name FROM sid_patients WHERE id = ?', [id]);
    if (!patient) throw new HttpError(404, 'Patient not found');

    const result = await query(
      `INSERT INTO sid_patient_consultations
        (patient_id, doctor_id, clinic_id, consultation_date, primary_concern, symptoms,
         skin_hair_assessment, diagnosis, treatment_recommendations, doctor_notes, follow_up_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        doctorId ? Number(doctorId) : 1,
        clinicId ? Number(clinicId) : 1,
        consultationDate || new Date().toISOString().slice(0, 10),
        primaryConcern || '',
        symptoms || '',
        skinHairAssessment || '',
        diagnosis || '',
        treatmentRecommendations || '',
        doctorNotes || '',
        followUpDate || null,
        status,
      ]
    );

    const docName = (await one('SELECT name FROM sid_doctors WHERE id = ?', [doctorId || 1]))?.name || 'Doctor';

    await query(
      `INSERT INTO sid_patient_activity_logs (patient_id, user_id, activity_type, description)
       VALUES (?, ?, 'Consultation Completed', ?)`,
      [id, req.user ? req.user.id : null, `Clinical consultation recorded by ${docName}. Diagnosis: ${diagnosis || 'General Assessment'}`]
    );

    res.status(201).json({
      success: true,
      message: 'Consultation record saved successfully',
      data: { id: String(result.insertId) },
    });
  })
);

/**
 * POST /api/patients/:id/skin-assessments
 * Create new version of skin health assessment
 */
router.post(
  '/:id/skin-assessments',
  requirePermission('patients.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
      doctorId,
      skinType,
      skinConcerns,
      acneCondition,
      pigmentation,
      melasma,
      skinSensitivity,
      hairConcerns,
      previousTreatments,
      currentSkincareRoutine,
      assessmentNotes,
      assessmentDate,
    } = req.body;

    const patient = await one('SELECT id, name FROM sid_patients WHERE id = ?', [id]);
    if (!patient) throw new HttpError(404, 'Patient not found');

    const result = await query(
      `INSERT INTO sid_patient_skin_assessments
        (patient_id, doctor_id, assessment_date, skin_type, skin_concerns, acne_condition,
         pigmentation, melasma, skin_sensitivity, hair_concerns, previous_treatments,
         current_skincare_routine, assessment_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        doctorId ? Number(doctorId) : 1,
        assessmentDate || new Date().toISOString().slice(0, 10),
        skinType || '',
        skinConcerns || '',
        acneCondition || '',
        pigmentation || '',
        melasma || '',
        skinSensitivity || '',
        hairConcerns || '',
        previousTreatments || '',
        currentSkincareRoutine || '',
        assessmentNotes || '',
      ]
    );

    await query(
      `INSERT INTO sid_patient_activity_logs (patient_id, user_id, activity_type, description)
       VALUES (?, ?, 'Skin Health Record Updated', 'New version of clinical skin & scalp assessment recorded.')`,
      [id, req.user ? req.user.id : null]
    );

    res.status(201).json({
      success: true,
      message: 'Skin health record version saved successfully',
      data: { id: String(result.insertId) },
    });
  })
);

/**
 * POST /api/patients/:id/prescriptions
 * Create new medical prescription with medicines
 */
router.post(
  '/:id/prescriptions',
  requirePermission('patients.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { doctorId, clinicId, diagnosis, generalAdvice, followUpDate, prescriptionDate, items = [] } = req.body;

    const patient = await one('SELECT id, name FROM sid_patients WHERE id = ?', [id]);
    if (!patient) throw new HttpError(404, 'Patient not found');

    const prescriptionNo = `RX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await tx(async (q) => {
      const rxRes = await q(
        `INSERT INTO sid_patient_prescriptions
          (prescription_no, patient_id, doctor_id, clinic_id, diagnosis, general_advice, follow_up_date, prescription_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prescriptionNo,
          id,
          doctorId ? Number(doctorId) : 1,
          clinicId ? Number(clinicId) : 1,
          diagnosis || '',
          generalAdvice || '',
          followUpDate || null,
          prescriptionDate || new Date().toISOString().slice(0, 10),
        ]
      );
      const rxId = rxRes.insertId;

      for (const item of items) {
        if (item.medicineName) {
          await q(
            `INSERT INTO sid_prescription_items
              (prescription_id, medicine_name, dosage, frequency, duration, instructions)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              rxId,
              item.medicineName,
              item.dosage || '',
              item.frequency || '',
              item.duration || '',
              item.instructions || '',
            ]
          );
        }
      }

      await q(
        `INSERT INTO sid_patient_activity_logs (patient_id, user_id, activity_type, description)
         VALUES (?, ?, 'Prescription Issued', ?)`,
        [id, req.user ? req.user.id : null, `Prescription #${prescriptionNo} created with ${items.length} prescribed items.`]
      );

      return { rxId, prescriptionNo };
    });

    res.status(201).json({
      success: true,
      message: 'Prescription generated successfully',
      data: result,
    });
  })
);

/**
 * GET /api/patients/prescription/:rxId/print
 * Printable prescription dossier
 */
router.get(
  '/prescription/:rxId/print',
  requirePermission('patients.view'),
  asyncHandler(async (req, res) => {
    const { rxId } = req.params;
    const rx = await one(
      `SELECT rx.*, p.name AS patient_name, p.patient_code, p.phone AS patient_phone,
              p.gender, p.age, p.dob, p.city, p.allergies,
              d.name AS doctor_name, d.specialty AS doctor_specialty, d.qualifications,
              c.title AS clinic_name, c.address AS clinic_address, c.phones AS clinic_phones
         FROM sid_patient_prescriptions rx
         JOIN sid_patients p ON p.id = rx.patient_id
         LEFT JOIN sid_doctors d ON d.id = rx.doctor_id
         LEFT JOIN sid_clinics c ON c.id = rx.clinic_id
        WHERE rx.id = ?`,
      [rxId]
    );

    if (!rx) throw new HttpError(404, 'Prescription not found');

    const items = await query('SELECT * FROM sid_prescription_items WHERE prescription_id = ?', [rxId]);
    res.json({
      success: true,
      data: {
        ...rx,
        patientAge: rx.dob ? calculateAge(rx.dob) : rx.age,
        items,
      },
    });
  })
);

/**
 * POST /api/patients/:id/documents
 * Attach medical document
 */
router.post(
  '/:id/documents',
  requirePermission('patients.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { documentType, documentName, fileUrl, fileSize, fileMime, notes } = req.body;
    if (!documentName || !fileUrl) throw new HttpError(400, 'Document name and file URL are required');

    const result = await query(
      `INSERT INTO sid_patient_documents
        (patient_id, document_type, document_name, file_url, file_size, file_mime, notes, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        documentType || 'Lab Report',
        documentName,
        fileUrl,
        fileSize || 0,
        fileMime || 'application/pdf',
        notes || '',
        req.user ? req.user.id : null,
      ]
    );

    await query(
      `INSERT INTO sid_patient_activity_logs (patient_id, user_id, activity_type, description)
       VALUES (?, ?, 'Document Uploaded', ?)`,
      [id, req.user ? req.user.id : null, `Uploaded medical document: ${documentName} (${documentType || 'Report'})`]
    );

    res.status(201).json({
      success: true,
      message: 'Medical document attached successfully',
      data: { id: String(result.insertId) },
    });
  })
);

/**
 * POST /api/patients/:id/gallery
 * Upload Before & After Photo Case
 */
router.post(
  '/:id/gallery',
  requirePermission('patients.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { treatmentId, beforeImageUrl, afterImageUrl, title, description, sessionDate, isPrivate = 1 } = req.body;
    if (!beforeImageUrl && !afterImageUrl) throw new HttpError(400, 'At least one photo (before or after) is required');

    const result = await query(
      `INSERT INTO sid_patient_gallery
        (patient_id, treatment_id, before_image_url, after_image_url, title, description, session_date, is_private)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        treatmentId ? Number(treatmentId) : null,
        beforeImageUrl || null,
        afterImageUrl || null,
        title || 'Clinical Progress Record',
        description || '',
        sessionDate || new Date().toISOString().slice(0, 10),
        isPrivate ? 1 : 0,
      ]
    );

    await query(
      `INSERT INTO sid_patient_activity_logs (patient_id, user_id, activity_type, description)
       VALUES (?, ?, 'Clinical Images Uploaded', ?)`,
      [id, req.user ? req.user.id : null, `Added before & after clinical photography record: ${title || 'Photo Case'}`]
    );

    res.status(201).json({
      success: true,
      message: 'Clinical photography case saved successfully',
      data: { id: String(result.insertId) },
    });
  })
);

/**
 * POST /api/patients/:id/packages
 * Assign / Purchase Treatment Package
 */
router.post(
  '/:id/packages',
  requirePermission('patients.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { treatmentId, packageName, totalSessions, amountPaid, purchaseDate, expiryDate, status = 'Active' } = req.body;
    if (!packageName) throw new HttpError(400, 'Package name is required');

    const result = await query(
      `INSERT INTO sid_patient_packages
        (patient_id, treatment_id, package_name, total_sessions, used_sessions, amount_paid, purchase_date, expiry_date, status)
       VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?)`,
      [
        id,
        treatmentId ? Number(treatmentId) : null,
        packageName,
        parseInt(totalSessions, 10) || 1,
        parseFloat(amountPaid) || 0.0,
        purchaseDate || new Date().toISOString().slice(0, 10),
        expiryDate || null,
        status,
      ]
    );

    await query(
      `INSERT INTO sid_patient_activity_logs (patient_id, user_id, activity_type, description)
       VALUES (?, ?, 'Package Purchased', ?)`,
      [id, req.user ? req.user.id : null, `Enrolled in package: ${packageName} (${totalSessions || 1} Sessions) for ₹${parseFloat(amountPaid || 0).toLocaleString('en-IN')}`]
    );

    res.status(201).json({
      success: true,
      message: 'Treatment package assigned successfully',
      data: { id: String(result.insertId) },
    });
  })
);

/**
 * POST /api/patients/:id/packages/:pkgId/use-session
 * Record session completed on a treatment package
 */
router.post(
  '/:id/packages/:pkgId/use-session',
  requirePermission('patients.edit'),
  asyncHandler(async (req, res) => {
    const { id, pkgId } = req.params;
    const pkg = await one('SELECT * FROM sid_patient_packages WHERE id = ? AND patient_id = ?', [pkgId, id]);
    if (!pkg) throw new HttpError(404, 'Package not found');

    if (pkg.used_sessions >= pkg.total_sessions) {
      throw new HttpError(400, 'All sessions for this package have already been completed.');
    }

    const newUsed = pkg.used_sessions + 1;
    const newStatus = newUsed >= pkg.total_sessions ? 'Completed' : 'Active';

    await query('UPDATE sid_patient_packages SET used_sessions = ?, status = ? WHERE id = ?', [newUsed, newStatus, pkgId]);

    await query(
      `INSERT INTO sid_patient_activity_logs (patient_id, user_id, activity_type, description)
       VALUES (?, ?, 'Treatment Session Completed', ?)`,
      [id, req.user ? req.user.id : null, `Completed session #${newUsed} of ${pkg.total_sessions} for ${pkg.package_name}`]
    );

    res.json({
      success: true,
      message: `Session #${newUsed} marked completed! (${pkg.total_sessions - newUsed} remaining)`,
      data: { usedSessions: newUsed, totalSessions: pkg.total_sessions, status: newStatus },
    });
  })
);

/**
 * POST /api/patients/:id/payments
 * Record clinical payment & issue invoice
 */
router.post(
  '/:id/payments',
  requirePermission('patients.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount, paymentMethod = 'UPI', paymentType = 'treatment', transactionRef, notes, appointmentId } = req.body;
    if (!amount || Number(amount) <= 0) throw new HttpError(400, 'Valid payment amount is required');

    const paymentNo = `PAY-SKIN-${Date.now().toString().slice(-7)}`;
    const invoiceNo = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await tx(async (q) => {
      const payRes = await q(
        `INSERT INTO sid_payments
          (payment_no, appointment_id, patient_id, amount, payment_method, transaction_ref, payment_type, status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'successful', ?)`,
        [paymentNo, appointmentId ? Number(appointmentId) : null, id, Number(amount), paymentMethod, transactionRef || '', paymentType, notes || '']
      );
      const paymentId = payRes.insertId;

      const tax = Math.round((Number(amount) * 0.18) / 1.18 * 100) / 100;
      const base = Number(amount) - tax;

      await q(
        `INSERT INTO sid_invoices
          (invoice_no, payment_id, patient_id, amount, tax_amount, total_amount, invoice_date, status)
         VALUES (?, ?, ?, ?, ?, ?, CURDATE(), 'Paid')`,
        [invoiceNo, paymentId, id, base, tax, Number(amount)]
      );

      // If appointment was attached, mark paid
      if (appointmentId) {
        await q('UPDATE sid_appointments SET payment_status = "paid", final_amount = ? WHERE id = ?', [Number(amount), appointmentId]);
      }

      await q(
        `INSERT INTO sid_patient_activity_logs (patient_id, user_id, activity_type, description)
         VALUES (?, ?, 'Payment Received', ?)`,
        [id, req.user ? req.user.id : null, `Recorded payment of ₹${Number(amount).toLocaleString('en-IN')} via ${paymentMethod}. Invoice #${invoiceNo} generated.`]
      );

      return { paymentId, paymentNo, invoiceNo, amount: Number(amount) };
    });

    res.status(201).json({
      success: true,
      message: 'Payment and invoice generated successfully',
      data: result,
    });
  })
);

/**
 * POST /api/patients/:id/notes
 * Add internal clinical or coordinator note
 */
router.post(
  '/:id/notes',
  requirePermission('patients.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { note } = req.body;
    if (!note || !note.trim()) throw new HttpError(400, 'Note content is required');

    await query(
      `INSERT INTO sid_lead_notes (entity_type, entity_id, user_id, note)
       VALUES ('patient', ?, ?, ?)`,
      [id, req.user ? req.user.id : null, note.trim()]
    );

    res.status(201).json({ success: true, message: 'Internal note added' });
  })
);

module.exports = router;
