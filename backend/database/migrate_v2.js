const { pool, query, tx } = require('../src/config/db');

async function migrateV2() {
  console.log('🚀 Running Skinfinity Derma Database Schema Migration v2...');

  // 1. Create sid_patients table
  await query(`
    CREATE TABLE IF NOT EXISTS sid_patients (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      patient_code VARCHAR(30) NULL UNIQUE,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(190) NULL,
      phone VARCHAR(30) NOT NULL,
      gender ENUM('Female','Male','Other') NULL,
      age TINYINT UNSIGNED NULL,
      dob DATE NULL,
      address TEXT NULL,
      city VARCHAR(100) NULL,
      medical_history TEXT NULL,
      allergies TEXT NULL,
      emergency_contact VARCHAR(100) NULL,
      notes TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_patient_phone (phone),
      INDEX idx_patient_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✅ sid_patients table verified.');

  // 2. Create sid_blogs table
  await query(`
    CREATE TABLE IF NOT EXISTS sid_blogs (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(190) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT NULL,
      content MEDIUMTEXT NULL,
      featured_image VARCHAR(500) NULL,
      category VARCHAR(100) NULL,
      author_name VARCHAR(120) NOT NULL DEFAULT 'Dr. Ipshita Johri',
      author_id INT UNSIGNED NULL,
      tags JSON NULL,
      views_count INT UNSIGNED NOT NULL DEFAULT 0,
      is_published TINYINT(1) NOT NULL DEFAULT 1,
      published_at DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_blogs_pub (is_published, published_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✅ sid_blogs table verified.');

  // 3. Create sid_notifications table
  await query(`
    CREATE TABLE IF NOT EXISTS sid_notifications (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      type VARCHAR(60) NOT NULL DEFAULT 'general',
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      link VARCHAR(500) NULL,
      data JSON NULL,
      channel ENUM('in_app','email','sms','whatsapp') NOT NULL DEFAULT 'in_app',
      is_read TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_notif_read (is_read, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✅ sid_notifications table verified.');

  // 4. Create sid_clinic_schedules table
  await query(`
    CREATE TABLE IF NOT EXISTS sid_clinic_schedules (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      clinic_id INT UNSIGNED NOT NULL,
      day_of_week TINYINT UNSIGNED NOT NULL, -- 0=Sunday, 1=Monday... 6=Saturday
      start_time VARCHAR(5) NOT NULL DEFAULT '10:00',
      end_time VARCHAR(5) NOT NULL DEFAULT '20:00',
      break_start VARCHAR(5) NULL DEFAULT '14:00',
      break_end VARCHAR(5) NULL DEFAULT '15:00',
      is_working TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_clinic_day (clinic_id, day_of_week)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✅ sid_clinic_schedules table verified.');

  // 5. Create sid_clinic_holidays table
  await query(`
    CREATE TABLE IF NOT EXISTS sid_clinic_holidays (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      clinic_id INT UNSIGNED NULL, -- NULL means all clinics
      holiday_date DATE NOT NULL,
      title VARCHAR(150) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_holiday_date (holiday_date, clinic_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✅ sid_clinic_holidays table verified.');

  // 6. Extend sid_treatments columns if they don't exist
  const treatmentCols = await query(`SHOW COLUMNS FROM sid_treatments`);
  const existingColNames = treatmentCols.map(c => c.Field);

  const columnsToAdd = [
    { name: 'video_url', type: 'VARCHAR(500) NULL' },
    { name: 'video_title', type: 'VARCHAR(255) NULL' },
    { name: 'video_thumbnail', type: 'VARCHAR(500) NULL' },
    { name: 'image_alt_text', type: 'VARCHAR(255) NULL' },
    { name: 'sub_image_1', type: 'VARCHAR(500) NULL' },
    { name: 'sub_image_2', type: 'VARCHAR(500) NULL' },
    { name: 'sub_image_3', type: 'VARCHAR(500) NULL' },
    { name: 'canonical_url', type: 'VARCHAR(500) NULL' },
    { name: 'benefits', type: 'JSON NULL' },
    { name: 'procedure_steps', type: 'JSON NULL' },
    { name: 'expected_results', type: 'TEXT NULL' },
    { name: 'recovery_info', type: 'TEXT NULL' },
    { name: 'precautions', type: 'TEXT NULL' },
    { name: 'related_treatment_ids', type: 'JSON NULL' }
  ];

  for (const col of columnsToAdd) {
    if (!existingColNames.includes(col.name)) {
      await query(`ALTER TABLE sid_treatments ADD COLUMN ${col.name} ${col.type}`);
      console.log(`➕ Added column ${col.name} to sid_treatments`);
    }
  }

  // 7. Extend sid_appointments with patient_id if not present
  const apptCols = await query(`SHOW COLUMNS FROM sid_appointments`);
  const apptColNames = apptCols.map(c => c.Field);
  if (!apptColNames.includes('patient_id')) {
    await query(`ALTER TABLE sid_appointments ADD COLUMN patient_id INT UNSIGNED NULL AFTER email`);
    console.log(`➕ Added column patient_id to sid_appointments`);
  }

  // 8. Modify sid_enquiries status column to support all CRM lead statuses
  try {
    await query(`
      ALTER TABLE sid_enquiries MODIFY COLUMN status 
      VARCHAR(50) NOT NULL DEFAULT 'new'
    `);
    console.log('✅ sid_enquiries status column updated to VARCHAR(50).');
  } catch (err) {
    console.warn('Note modifying sid_enquiries status:', err.message);
  }

  // 9. Sync sid_patients from existing appointments
  const appts = await query(`SELECT DISTINCT patient_name, phone, email, gender, age FROM sid_appointments WHERE phone IS NOT NULL AND phone != ''`);
  for (const a of appts) {
    const existing = await query(`SELECT id FROM sid_patients WHERE phone = ?`, [a.phone]);
    let patientId;
    if (existing.length === 0) {
      const code = 'PAT-' + Math.floor(100000 + Math.random() * 900000);
      const res = await query(
        `INSERT INTO sid_patients (patient_code, name, email, phone, gender, age) VALUES (?, ?, ?, ?, ?, ?)`,
        [code, a.patient_name, a.email || null, a.phone, a.gender || null, a.age || null]
      );
      patientId = res.insertId;
      console.log(`👤 Seeded patient ${a.patient_name} (${a.phone})`);
    } else {
      patientId = existing[0].id;
    }
    await query(`UPDATE sid_appointments SET patient_id = ? WHERE phone = ?`, [patientId, a.phone]);
  }

  // 10. Ensure the 7 standard RBAC roles
  const standardRoles = [
    { slug: 'super_admin', name: 'Super Admin', desc: 'Full unrestricted access to all modules, users, roles, and settings.', is_system: 1 },
    { slug: 'admin', name: 'Admin', desc: 'Clinic operations, appointments, catalog, content and customer relationships.', is_system: 1 },
    { slug: 'clinic_manager', name: 'Clinic Manager', desc: 'Oversees daily clinic operations, doctor rosters, appointments, and leads.', is_system: 1 },
    { slug: 'doctor', name: 'Doctor', desc: 'Access to assigned appointments, consultation notes, and treatment procedures.', is_system: 1 },
    { slug: 'receptionist', name: 'Receptionist', desc: 'Front desk patient check-in, appointment bookings, rescheduling, and lead intake.', is_system: 1 },
    { slug: 'content_manager', name: 'Content Manager', desc: 'Manages website catalog, blogs, banners, reviews, before-after cases, and FAQs.', is_system: 1 },
    { slug: 'marketing_manager', name: 'Marketing Manager', desc: 'Manages promo codes, banners, campaigns, leads pipeline, and customer reviews.', is_system: 1 }
  ];

  for (const r of standardRoles) {
    const existing = await query(`SELECT id FROM sid_roles WHERE slug = ?`, [r.slug]);
    if (existing.length === 0) {
      await query(`INSERT INTO sid_roles (slug, name, description, is_system) VALUES (?, ?, ?, ?)`, [r.slug, r.name, r.desc, r.is_system]);
      console.log(`🛡️ Created role: ${r.name}`);
    } else {
      await query(`UPDATE sid_roles SET name = ?, description = ? WHERE slug = ?`, [r.name, r.desc, r.slug]);
    }
  }

  // 11. Populate initial sample blogs if empty
  const blogCount = await query(`SELECT COUNT(*) AS total FROM sid_blogs`);
  if (blogCount[0].total === 0) {
    await query(`
      INSERT INTO sid_blogs (slug, title, excerpt, content, featured_image, category, author_name, tags, published_at)
      VALUES 
      (
        'ultimate-guide-to-hydrafacial-md',
        'The Ultimate Guide to HydraFacial MD for Glowing Skin',
        'Discover how medical-grade HydraFacial cleanses, extracts, and hydrates your skin with patented vortex technology.',
        '<p>HydraFacial MD is an invigorating treatment that can be given in as little as 30 minutes. It delivers long-term skin health and can be tailored to meet the specific needs of all skin types. It offers instant, noticeable results with no downtime or irritation.</p><p>The HydraFacial treatment removes dead skin cells and extracts impurities while simultaneously bathing the new skin with cleansing, hydrating and moisturizing serums.</p>',
        '/images/treatments/hydrafacial.webp',
        'Skin Glow & Facial',
        'Dr. Ipshita Johri',
        JSON_ARRAY('HydraFacial', 'Skin Glow', 'Anti-Aging'),
        NOW()
      ),
      (
        'understanding-acne-scar-subcision-mnrf',
        'Understanding Acne Scar Remodeling: Subcision + MNRF',
        'Everything you need to know about combining subcision with radiofrequency microneedling for deep boxcar and rolling scars.',
        '<p>Acne scars require a multi-layered approach because scar tissue anchors into deeper dermal layers. Subcision physically releases fibrous bands pulling down the skin surface, while Morpheus8 MNRF stimulates intense neocollagenesis.</p>',
        '/images/treatments/acne-scars.webp',
        'Acne & Scars',
        'Dr. Ipshita Johri',
        JSON_ARRAY('Acne Scars', 'Morpheus8', 'Subcision', 'Dermatology'),
        NOW()
      )
    `);
    console.log('📰 Seeded initial clinical blog articles.');
  }

  console.log('🎉 Migration v2 completed successfully!');
}

migrateV2()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
