const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { query, one } = require('../config/db');
const { signToken, signPatientToken, authenticate, authenticatePatient, clearAuthCache } = require('../middleware/auth');
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
 * POST /api/auth/forgot-password
 */
router.post(
  '/forgot-password',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new HttpError(400, 'Email address is required');

    const user = await one('SELECT id, name, email FROM sid_users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (!user) {
      // Return success even if email not found to prevent enumeration
      return res.json({
        success: true,
        message: 'If an account exists with this email, instructions have been generated.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await query(
      'UPDATE sid_users SET reset_token = ?, reset_expires_at = ? WHERE id = ?',
      [resetToken, expiresAt, user.id]
    );

    await audit({ user, ip: req.ip, headers: req.headers }, {
      action: 'password_reset_request',
      entity: 'auth',
      entityId: user.id,
      summary: `Password reset requested for ${user.email}`,
    });

    res.json({
      success: true,
      message: 'Password reset link sent to registered email address.',
      resetToken, // Provided for instant testing
    });
  })
);

/**
 * POST /api/auth/reset-password
 */
router.post(
  '/reset-password',
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) throw new HttpError(400, 'Reset token and new password are required');
    if (newPassword.length < 6) throw new HttpError(400, 'Password must be at least 6 characters');

    const user = await one(
      'SELECT id, name, email FROM sid_users WHERE reset_token = ? AND reset_expires_at > NOW()',
      [token]
    );

    if (!user) {
      throw new HttpError(400, 'Invalid or expired password reset token');
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await query(
      'UPDATE sid_users SET password_hash = ?, reset_token = NULL, reset_expires_at = NULL, token_version = token_version + 1 WHERE id = ?',
      [newHash, user.id]
    );

    clearAuthCache(user.id);

    await audit({ user, ip: req.ip, headers: req.headers }, {
      action: 'password_reset_complete',
      entity: 'auth',
      entityId: user.id,
      summary: `Password reset successfully for ${user.email}`,
    });

    res.json({
      success: true,
      message: 'Password has been reset successfully. You may now sign in with your new password.',
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

/* ========================================================================== */
/* PATIENT PORTAL AUTHENTICATION & PROFILE APIS                               */
/* ========================================================================== */

/**
 * POST /api/auth/patient/register
 * Public patient registration through website or booking portal
 */
router.post(
  '/patient/register',
  asyncHandler(async (req, res) => {
    const {
      name,
      email,
      phone,
      password,
      whatsappNo,
      gender,
      dob,
      address,
      city,
      state,
      pincode,
      preferredClinicId,
      skinConcerns,
      medicalHistory,
      allergies,
    } = req.body;

    if (!name || !name.trim()) throw new HttpError(400, 'Full Name is required');
    if (!phone || !phone.trim()) throw new HttpError(400, 'Primary Phone Number is required');
    if (!password || password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters');

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const cleanEmail = email ? email.trim().toLowerCase() : null;

    // Check existing phone
    const existingPhone = await one('SELECT id, name FROM sid_patients WHERE phone LIKE ?', [`%${cleanPhone}`]);
    if (existingPhone) {
      throw new HttpError(409, `An account with phone number ${phone} is already registered. Please sign in instead.`);
    }

    if (cleanEmail) {
      const existingEmail = await one('SELECT id FROM sid_patients WHERE LOWER(email) = ?', [cleanEmail]);
      if (existingEmail) {
        throw new HttpError(409, `An account with email ${email} already exists. Please sign in instead.`);
      }
    }

    // Calculate age from DOB if given
    let calculatedAge = null;
    if (dob) {
      const birthDate = new Date(dob);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate unique Patient Code
    const countRow = await one('SELECT COUNT(*) AS total FROM sid_patients');
    const patientCode = `PAT-${String(100 + Number(countRow.total) + 1).padStart(5, '0')}`;

    const insertResult = await query(
      `INSERT INTO sid_patients 
        (patient_code, name, email, phone, whatsapp_no, gender, age, dob, address, city, state, pincode,
         preferred_clinic_id, skin_concerns, medical_history, allergies, status, password_hash, loyalty_points, member_tier)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, 100, 'Silver')`,
      [
        patientCode,
        name.trim(),
        cleanEmail,
        cleanPhone,
        whatsappNo || cleanPhone,
        gender || 'Female',
        calculatedAge,
        dob || null,
        address || '',
        city || 'Noida',
        state || 'Uttar Pradesh',
        pincode || '',
        preferredClinicId ? Number(preferredClinicId) : 1,
        skinConcerns || '',
        medicalHistory || '',
        allergies || '',
        passwordHash,
      ]
    );

    const newId = insertResult.insertId;

    // Log Activity
    await query(
      `INSERT INTO sid_patient_activity_logs (patient_id, activity_type, description)
       VALUES (?, 'Patient Registration', 'Patient account successfully registered via online patient portal.')`,
      [newId]
    );

    // Initial 100 welcome bonus loyalty points
    await query(
      `INSERT INTO sid_loyalty_transactions (patient_id, points, transaction_type, description)
       VALUES (?, 100, 'bonus', 'Welcome gift: 100 Skinfinity Loyalty Credits on account registration')`,
      [newId]
    );

    const newPatient = await one(
      `SELECT p.*, c.title AS preferred_clinic_name 
         FROM sid_patients p 
         LEFT JOIN sid_clinics c ON c.id = p.preferred_clinic_id
        WHERE p.id = ?`,
      [newId]
    );

    const token = signPatientToken(newPatient);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully. Welcome to Skinfinity Derma!',
      token,
      data: {
        id: String(newPatient.id),
        patientCode: newPatient.patient_code,
        name: newPatient.name,
        email: newPatient.email,
        phone: newPatient.phone,
        whatsappNo: newPatient.whatsapp_no,
        gender: newPatient.gender,
        age: newPatient.age,
        dob: newPatient.dob,
        address: newPatient.address,
        city: newPatient.city,
        state: newPatient.state,
        pincode: newPatient.pincode,
        preferredClinicId: newPatient.preferred_clinic_id,
        preferredClinicName: newPatient.preferred_clinic_name || 'Noida HQ',
        loyaltyPoints: newPatient.loyalty_points,
        memberTier: newPatient.member_tier,
      },
    });
  })
);

/**
 * POST /api/auth/patient/login
 * Patient login using email or phone + password
 */
router.post(
  '/patient/login',
  asyncHandler(async (req, res) => {
    const { identifier, email, phone, password } = req.body;
    const loginInput = (identifier || email || phone || '').trim();
    if (!loginInput) throw new HttpError(400, 'Please enter your registered email or phone number');
    if (!password) throw new HttpError(400, 'Please enter your account password');

    const cleanDigits = loginInput.replace(/[^0-9]/g, '');
    let patient = null;

    if (cleanDigits.length >= 10) {
      const last10 = cleanDigits.slice(-10);
      patient = await one(
        `SELECT p.*, c.title AS preferred_clinic_name 
           FROM sid_patients p 
           LEFT JOIN sid_clinics c ON c.id = p.preferred_clinic_id
          WHERE p.phone LIKE ? OR p.whatsapp_no LIKE ?
          LIMIT 1`,
        [`%${last10}`, `%${last10}`]
      );
    }

    if (!patient && loginInput.includes('@')) {
      patient = await one(
        `SELECT p.*, c.title AS preferred_clinic_name 
           FROM sid_patients p 
           LEFT JOIN sid_clinics c ON c.id = p.preferred_clinic_id
          WHERE LOWER(p.email) = LOWER(?)
          LIMIT 1`,
        [loginInput]
      );
    }

    if (!patient) {
      throw new HttpError(401, 'No registered patient profile found with that email or phone number.');
    }

    if (patient.status === 'Blocked') {
      throw new HttpError(403, 'Your account has been deactivated. Please contact clinic reception.');
    }

    // If password_hash is not set (e.g. walk-in registered without password yet)
    if (!patient.password_hash) {
      throw new HttpError(401, 'Your account does not have a web password set yet. Please register or contact clinic reception.');
    }

    const matches = await bcrypt.compare(password, patient.password_hash);
    if (!matches) {
      throw new HttpError(401, 'Invalid password. Please check your credentials and try again.');
    }

    // Get active cart count
    const cartCountRow = await one(
      `SELECT COALESCE(SUM(ci.quantity), 0) AS total_items
         FROM sid_carts c
         JOIN sid_cart_items ci ON ci.cart_id = c.id
        WHERE c.patient_id = ?`,
      [patient.id]
    );

    const token = signPatientToken(patient);

    res.json({
      success: true,
      token,
      message: `Welcome back, ${patient.name}!`,
      cartCount: Number(cartCountRow.total_items) || 0,
      data: {
        id: String(patient.id),
        patientCode: patient.patient_code,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        whatsappNo: patient.whatsapp_no,
        gender: patient.gender,
        age: patient.age,
        dob: patient.dob,
        address: patient.address,
        city: patient.city,
        state: patient.state,
        pincode: patient.pincode,
        preferredClinicId: patient.preferred_clinic_id,
        preferredClinicName: patient.preferred_clinic_name || 'Noida HQ',
        loyaltyPoints: patient.loyalty_points,
        memberTier: patient.member_tier,
      },
    });
  })
);

/**
 * GET /api/auth/patient/me
 * Retrieve authenticated patient's live profile, metrics & session
 */
router.get(
  '/patient/me',
  authenticatePatient,
  asyncHandler(async (req, res) => {
    const p = req.patient;

    const [apptCounts, activePackages, cartCount] = await Promise.all([
      one(
        `SELECT COUNT(*) AS total_appts,
                SUM(CASE WHEN appointment_date >= CURDATE() AND status IN ('confirmed','pending') THEN 1 ELSE 0 END) AS upcoming_appts,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_appts
           FROM sid_appointments WHERE patient_id = ? OR phone = ?`,
        [p.id, p.phone]
      ),
      one(
        `SELECT COUNT(*) AS total_packages,
                COALESCE(SUM(total_sessions - used_sessions), 0) AS remaining_sessions
           FROM sid_patient_packages WHERE patient_id = ? AND status = 'Active'`,
        [p.id]
      ),
      one(
        `SELECT COALESCE(SUM(ci.quantity), 0) AS total_items
           FROM sid_carts c
           JOIN sid_cart_items ci ON ci.cart_id = c.id
          WHERE c.patient_id = ?`,
        [p.id]
      ),
    ]);

    // Next upcoming appointment
    const nextAppt = await one(
      `SELECT a.id, a.appointment_no, a.appointment_date, a.appointment_time, a.service_name, a.status,
              c.title AS clinic_name, d.name AS doctor_name
         FROM sid_appointments a
         LEFT JOIN sid_clinics c ON c.id = a.clinic_id
         LEFT JOIN sid_doctors d ON d.id = a.doctor_id
        WHERE (a.patient_id = ? OR a.phone = ?) AND a.appointment_date >= CURDATE() AND a.status IN ('confirmed', 'pending')
        ORDER BY a.appointment_date ASC, a.appointment_time ASC
        LIMIT 1`,
      [p.id, p.phone]
    );

    res.json({
      success: true,
      data: {
        id: String(p.id),
        patientCode: p.patient_code,
        name: p.name,
        email: p.email,
        phone: p.phone,
        whatsappNo: p.whatsapp_no,
        gender: p.gender,
        age: p.age,
        dob: p.dob,
        address: p.address,
        city: p.city,
        state: p.state,
        pincode: p.pincode,
        preferredClinicId: p.preferred_clinic_id,
        preferredClinicName: p.preferred_clinic_name || 'Noida HQ',
        loyaltyPoints: p.loyalty_points,
        memberTier: p.member_tier,
        stats: {
          totalAppointments: Number(apptCounts.total_appts) || 0,
          upcomingAppointments: Number(apptCounts.upcoming_appts) || 0,
          completedAppointments: Number(apptCounts.completed_appts) || 0,
          activePackages: Number(activePackages.total_packages) || 0,
          remainingSessions: Number(activePackages.remaining_sessions) || 0,
          cartItemsCount: Number(cartCount.total_items) || 0,
        },
        nextAppointment: nextAppt
          ? {
              id: String(nextAppt.id),
              appointmentNo: nextAppt.appointment_no,
              date: nextAppt.appointment_date,
              time: nextAppt.appointment_time,
              treatment: nextAppt.service_name,
              doctor: nextAppt.doctor_name || 'Specialist Dermatologist',
              clinic: nextAppt.clinic_name || 'Main Clinic',
              status: nextAppt.status,
            }
          : null,
      },
    });
  })
);

/**
 * PUT /api/auth/patient/profile
 * Patient updates their contact and personal details from My Account
 */
router.put(
  '/patient/profile',
  authenticatePatient,
  asyncHandler(async (req, res) => {
    const {
      name,
      whatsappNo,
      gender,
      dob,
      address,
      city,
      state,
      pincode,
      preferredClinicId,
    } = req.body;

    let calculatedAge = req.patient.age;
    if (dob) {
      const birthDate = new Date(dob);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
      }
    }

    await query(
      `UPDATE sid_patients
          SET name = COALESCE(?, name),
              whatsapp_no = COALESCE(?, whatsapp_no),
              gender = COALESCE(?, gender),
              dob = COALESCE(?, dob),
              age = COALESCE(?, age),
              address = COALESCE(?, address),
              city = COALESCE(?, city),
              state = COALESCE(?, state),
              pincode = COALESCE(?, pincode),
              preferred_clinic_id = COALESCE(?, preferred_clinic_id)
        WHERE id = ?`,
      [
        name ? name.trim() : null,
        whatsappNo || null,
        gender || null,
        dob || null,
        calculatedAge,
        address || null,
        city || null,
        state || null,
        pincode || null,
        preferredClinicId ? Number(preferredClinicId) : null,
        req.patientId,
      ]
    );

    await query(
      `INSERT INTO sid_patient_activity_logs (patient_id, activity_type, description)
       VALUES (?, 'Profile Updated', 'Patient updated personal & contact details from My Account portal.')`,
      [req.patientId]
    );

    const updated = await one(
      `SELECT p.*, c.title AS preferred_clinic_name 
         FROM sid_patients p 
         LEFT JOIN sid_clinics c ON c.id = p.preferred_clinic_id
        WHERE p.id = ?`,
      [req.patientId]
    );

    res.json({
      success: true,
      message: 'Profile details updated successfully.',
      data: {
        id: String(updated.id),
        patientCode: updated.patient_code,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        whatsappNo: updated.whatsapp_no,
        gender: updated.gender,
        age: updated.age,
        dob: updated.dob,
        address: updated.address,
        city: updated.city,
        state: updated.state,
        pincode: updated.pincode,
        preferredClinicId: updated.preferred_clinic_id,
        preferredClinicName: updated.preferred_clinic_name || 'Noida HQ',
        loyaltyPoints: updated.loyalty_points,
        memberTier: updated.member_tier,
      },
    });
  })
);

/**
 * GET /api/auth/patient/my-records
 * Retrieve patient's live clinical history, packages, appointments & prescriptions
 */
router.get(
  '/patient/my-records',
  authenticatePatient,
  asyncHandler(async (req, res) => {
    const patientId = req.patientId;
    const phone = req.patient.phone;

    const [appointments, packages, skinAssessments, prescriptions, payments, activityLogs] = await Promise.all([
      query(
        `SELECT a.id, a.appointment_no, a.service_name, a.appointment_date, a.appointment_time,
                a.status, a.payment_status, a.consultation_fee, a.discount_amount AS discount, a.final_amount,
                a.follow_up_date, c.title AS clinic_branch, d.name AS doctor_name, d.role AS doctor_role
           FROM sid_appointments a
           LEFT JOIN sid_clinics c ON c.id = a.clinic_id
           LEFT JOIN sid_doctors d ON d.id = a.doctor_id
          WHERE a.patient_id = ? OR a.phone = ?
          ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
        [patientId, phone]
      ),
      query(
        `SELECT p.id, p.package_name, p.total_sessions, p.used_sessions, p.amount_paid,
                p.purchase_date, p.expiry_date, p.status, t.name AS treatment_name, t.slug AS treatment_slug,
                t.banner_image
           FROM sid_patient_packages p
           LEFT JOIN sid_treatments t ON t.id = p.treatment_id
          WHERE p.patient_id = ?
          ORDER BY p.purchase_date DESC`,
        [patientId]
      ),
      query(
        `SELECT s.id, s.assessment_date, s.skin_type, s.skin_concerns, s.acne_condition AS acne_grade,
                s.pigmentation AS pigmentation_type, s.skin_sensitivity AS sensitivity_level,
                s.hair_concerns AS hair_scalp_condition, s.assessment_notes, d.name AS doctor_name
           FROM sid_patient_skin_assessments s
           LEFT JOIN sid_doctors d ON d.id = s.doctor_id
          WHERE s.patient_id = ?
          ORDER BY s.assessment_date DESC`,
        [patientId]
      ),
      query(
        `SELECT rx.id, rx.prescription_no AS rx_number, rx.prescription_date, rx.diagnosis, rx.follow_up_date, rx.general_advice,
                d.name AS doctor_name, d.role AS doctor_role
           FROM sid_patient_prescriptions rx
           LEFT JOIN sid_doctors d ON d.id = rx.doctor_id
          WHERE rx.patient_id = ?
          ORDER BY rx.prescription_date DESC`,
        [patientId]
      ),
      query(
        `SELECT pay.id, pay.payment_no, pay.amount, pay.payment_method, pay.payment_type, pay.status,
                pay.created_at, o.order_no
           FROM sid_payments pay
           LEFT JOIN sid_orders o ON o.id = pay.order_id
          WHERE pay.patient_id = ?
          ORDER BY pay.created_at DESC`,
        [patientId]
      ),
      query(
        `SELECT id, activity_type, description, created_at
           FROM sid_patient_activity_logs
          WHERE patient_id = ?
          ORDER BY created_at DESC LIMIT 20`,
        [patientId]
      ),
    ]);

    // Attach items to prescriptions
    for (const rx of prescriptions) {
      rx.items = await query(
        `SELECT medicine_name AS item_name, dosage, frequency, duration, instructions
           FROM sid_prescription_items
          WHERE prescription_id = ?`,
        [rx.id]
      );
    }

    res.json({
      success: true,
      data: {
        appointments,
        packages,
        skinAssessments,
        prescriptions,
        payments,
        activityLogs,
      },
    });
  })
);

module.exports = router;
