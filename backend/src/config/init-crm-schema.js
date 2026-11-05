const mysql = require('mysql2/promise');
const config = require('./env');

async function runCrmMigration() {
  const pool = mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    charset: 'utf8mb4',
    dateStrings: ['DATE'],
  });

  const query = async (sql, params = []) => {
    const [rows] = await pool.query(sql, params);
    return rows;
  };

  console.log('🚀 Starting Skinfinity Derma CRM Schema Migration...');

  // Helper to add column if not exists
  async function addColumnIfNotExists(table, column, definition) {
    const [cols] = await pool.query(`SHOW COLUMNS FROM ${table} LIKE '${column}'`);
    if (!cols || cols.length === 0) {
      await pool.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
      console.log(`✅ Added column ${column} to ${table}`);
    }
  }

  // Helper to add index if not exists
  async function addIndexIfNotExists(table, indexName, columns) {
    const [indexes] = await pool.query(`SHOW INDEX FROM ${table} WHERE Key_name = '${indexName}'`);
    if (!indexes || indexes.length === 0) {
      try {
        await pool.query(`CREATE INDEX ${indexName} ON ${table} (${columns})`);
        console.log(`✅ Added index ${indexName} to ${table}`);
      } catch (e) {
        console.warn(`Index note: ${e.message}`);
      }
    }
  }

  try {
    // 1. Extend sid_patients
    await addColumnIfNotExists('sid_patients', 'whatsapp_no', 'VARCHAR(30) NULL AFTER phone');
    await addColumnIfNotExists('sid_patients', 'state', 'VARCHAR(100) NULL AFTER city');
    await addColumnIfNotExists('sid_patients', 'pincode', 'VARCHAR(20) NULL AFTER state');
    await addColumnIfNotExists('sid_patients', 'preferred_clinic_id', 'INT UNSIGNED NULL AFTER pincode');
    await addColumnIfNotExists('sid_patients', 'skin_concerns', 'TEXT NULL AFTER allergies');
    await addColumnIfNotExists('sid_patients', 'status', "ENUM('Active','Inactive','Blocked') NOT NULL DEFAULT 'Active' AFTER notes");
    await addColumnIfNotExists('sid_patients', 'password_hash', 'VARCHAR(255) NULL AFTER status');
    await addColumnIfNotExists('sid_patients', 'loyalty_points', 'INT NOT NULL DEFAULT 0 AFTER password_hash');
    await addColumnIfNotExists('sid_patients', 'member_tier', "VARCHAR(60) NOT NULL DEFAULT 'Silver' AFTER loyalty_points");

    await addIndexIfNotExists('sid_patients', 'idx_patients_status', 'status');
    await addIndexIfNotExists('sid_patients', 'idx_patients_clinic', 'preferred_clinic_id');

    // 2. Extend sid_appointments
    await addColumnIfNotExists('sid_appointments', 'consultation_fee', 'DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER amount_estimate');
    await addColumnIfNotExists('sid_appointments', 'final_amount', 'DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER consultation_fee');
    await addColumnIfNotExists('sid_appointments', 'payment_status', "ENUM('pending','paid','partially_paid','refunded') NOT NULL DEFAULT 'pending' AFTER status");
    await addColumnIfNotExists('sid_appointments', 'follow_up_date', 'DATE NULL AFTER appointment_date');
    await addColumnIfNotExists('sid_appointments', 'invoice_id', 'INT UNSIGNED NULL AFTER payment_status');

    // 3. Create sid_patient_consultations
    await query(`
      CREATE TABLE IF NOT EXISTS sid_patient_consultations (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        patient_id INT UNSIGNED NOT NULL,
        appointment_id INT UNSIGNED NULL,
        doctor_id INT UNSIGNED NULL,
        clinic_id INT UNSIGNED NULL,
        consultation_date DATE NOT NULL,
        primary_concern VARCHAR(255) NULL,
        symptoms TEXT NULL,
        skin_hair_assessment TEXT NULL,
        diagnosis TEXT NULL,
        treatment_recommendations TEXT NULL,
        doctor_notes TEXT NULL,
        follow_up_date DATE NULL,
        status ENUM('Scheduled', 'In Progress', 'Completed', 'Follow-up Due', 'Cancelled') NOT NULL DEFAULT 'Completed',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_cons_patient (patient_id),
        INDEX idx_cons_doctor (doctor_id),
        INDEX idx_cons_date (consultation_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_patient_consultations table');

    // 4. Create sid_patient_skin_assessments
    await query(`
      CREATE TABLE IF NOT EXISTS sid_patient_skin_assessments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        patient_id INT UNSIGNED NOT NULL,
        consultation_id INT UNSIGNED NULL,
        doctor_id INT UNSIGNED NULL,
        assessment_date DATE NOT NULL,
        skin_type VARCHAR(100) NULL,
        skin_concerns TEXT NULL,
        acne_condition VARCHAR(150) NULL,
        pigmentation VARCHAR(150) NULL,
        melasma VARCHAR(150) NULL,
        skin_sensitivity VARCHAR(150) NULL,
        hair_concerns TEXT NULL,
        previous_treatments TEXT NULL,
        current_skincare_routine TEXT NULL,
        assessment_notes TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_assess_patient (patient_id),
        INDEX idx_assess_date (assessment_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_patient_skin_assessments table');

    // 5. Create sid_patient_prescriptions
    await query(`
      CREATE TABLE IF NOT EXISTS sid_patient_prescriptions (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        prescription_no VARCHAR(40) UNIQUE NOT NULL,
        patient_id INT UNSIGNED NOT NULL,
        doctor_id INT UNSIGNED NULL,
        consultation_id INT UNSIGNED NULL,
        clinic_id INT UNSIGNED NULL,
        diagnosis TEXT NULL,
        general_advice TEXT NULL,
        follow_up_date DATE NULL,
        prescription_date DATE NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_rx_patient (patient_id),
        INDEX idx_rx_doctor (doctor_id),
        INDEX idx_rx_date (prescription_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_patient_prescriptions table');

    // 6. Create sid_prescription_items
    await query(`
      CREATE TABLE IF NOT EXISTS sid_prescription_items (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        prescription_id INT UNSIGNED NOT NULL,
        medicine_name VARCHAR(200) NOT NULL,
        dosage VARCHAR(100) NULL,
        frequency VARCHAR(100) NULL,
        duration VARCHAR(100) NULL,
        instructions TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_rx_item_rx (prescription_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_prescription_items table');

    // 7. Create sid_patient_documents
    await query(`
      CREATE TABLE IF NOT EXISTS sid_patient_documents (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        patient_id INT UNSIGNED NOT NULL,
        consultation_id INT UNSIGNED NULL,
        document_type VARCHAR(100) NOT NULL,
        document_name VARCHAR(255) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        file_size INT UNSIGNED DEFAULT 0,
        file_mime VARCHAR(100) NULL,
        notes TEXT NULL,
        uploaded_by INT UNSIGNED NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_doc_patient (patient_id),
        INDEX idx_doc_type (document_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_patient_documents table');

    // 8. Create sid_patient_gallery
    await query(`
      CREATE TABLE IF NOT EXISTS sid_patient_gallery (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        patient_id INT UNSIGNED NOT NULL,
        treatment_id INT UNSIGNED NULL,
        appointment_id INT UNSIGNED NULL,
        before_image_url VARCHAR(500) NULL,
        after_image_url VARCHAR(500) NULL,
        title VARCHAR(200) NULL,
        description TEXT NULL,
        session_date DATE NULL,
        is_private TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_gallery_patient (patient_id),
        INDEX idx_gallery_treatment (treatment_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_patient_gallery table');

    // 9. Create sid_patient_activity_logs
    await query(`
      CREATE TABLE IF NOT EXISTS sid_patient_activity_logs (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        patient_id INT UNSIGNED NOT NULL,
        user_id INT UNSIGNED NULL,
        activity_type VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        metadata JSON NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_act_patient (patient_id),
        INDEX idx_act_type (activity_type),
        INDEX idx_act_time (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_patient_activity_logs table');

    // 10. Create sid_patient_packages
    await query(`
      CREATE TABLE IF NOT EXISTS sid_patient_packages (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        patient_id INT UNSIGNED NOT NULL,
        treatment_id INT UNSIGNED NULL,
        package_name VARCHAR(255) NOT NULL,
        total_sessions INT NOT NULL DEFAULT 1,
        used_sessions INT NOT NULL DEFAULT 0,
        amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        purchase_date DATE NOT NULL,
        expiry_date DATE NULL,
        status ENUM('Active', 'Completed', 'Expired', 'Cancelled') NOT NULL DEFAULT 'Active',
        invoice_id INT UNSIGNED NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_pkg_patient (patient_id),
        INDEX idx_pkg_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_patient_packages table');

    // 11. Create sid_carts
    await query(`
      CREATE TABLE IF NOT EXISTS sid_carts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        patient_id INT UNSIGNED NOT NULL UNIQUE,
        coupon_code VARCHAR(50) NULL,
        discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_cart_patient (patient_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_carts table');

    // 12. Create sid_cart_items
    await query(`
      CREATE TABLE IF NOT EXISTS sid_cart_items (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        cart_id INT UNSIGNED NOT NULL,
        item_type ENUM('treatment', 'package', 'product') NOT NULL DEFAULT 'treatment',
        item_id INT UNSIGNED NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        item_slug VARCHAR(255) NULL,
        price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        session_info VARCHAR(100) NULL,
        image_url VARCHAR(500) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_cart_items_cart (cart_id),
        UNIQUE KEY uq_cart_item (cart_id, item_type, item_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_cart_items table');

    // 13. Create sid_orders
    await query(`
      CREATE TABLE IF NOT EXISTS sid_orders (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_no VARCHAR(40) UNIQUE NOT NULL,
        patient_id INT UNSIGNED NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        coupon_code VARCHAR(50) NULL,
        payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
        order_status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
        clinic_id INT UNSIGNED NULL,
        notes TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_orders_patient (patient_id),
        INDEX idx_orders_status (order_status),
        INDEX idx_orders_payment (payment_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_orders table');

    // 14. Create sid_order_items
    await query(`
      CREATE TABLE IF NOT EXISTS sid_order_items (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_id INT UNSIGNED NOT NULL,
        item_type ENUM('treatment', 'package', 'product') NOT NULL DEFAULT 'treatment',
        item_id INT UNSIGNED NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        total DECIMAL(10,2) NOT NULL,
        sessions_count INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_order_items_order (order_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_order_items table');

    // 15. Create sid_payments
    await query(`
      CREATE TABLE IF NOT EXISTS sid_payments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        payment_no VARCHAR(40) UNIQUE NOT NULL,
        order_id INT UNSIGNED NULL,
        appointment_id INT UNSIGNED NULL,
        patient_id INT UNSIGNED NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method ENUM('Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'EMI', 'Wallet') NOT NULL DEFAULT 'UPI',
        transaction_ref VARCHAR(100) NULL,
        payment_type ENUM('treatment', 'consultation', 'package', 'product', 'refund') NOT NULL DEFAULT 'treatment',
        payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status ENUM('successful', 'pending', 'failed', 'refunded') NOT NULL DEFAULT 'successful',
        notes TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_pay_patient (patient_id),
        INDEX idx_pay_order (order_id),
        INDEX idx_pay_appt (appointment_id),
        INDEX idx_pay_status (status),
        INDEX idx_pay_date (payment_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_payments table');

    // 16. Create sid_invoices
    await query(`
      CREATE TABLE IF NOT EXISTS sid_invoices (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        invoice_no VARCHAR(40) UNIQUE NOT NULL,
        order_id INT UNSIGNED NULL,
        payment_id INT UNSIGNED NULL,
        patient_id INT UNSIGNED NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        total_amount DECIMAL(10,2) NOT NULL,
        invoice_date DATE NOT NULL,
        pdf_path VARCHAR(500) NULL,
        status ENUM('Issued', 'Paid', 'Cancelled') NOT NULL DEFAULT 'Paid',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_inv_patient (patient_id),
        INDEX idx_inv_order (order_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_invoices table');

    // 17. Create sid_loyalty_transactions
    await query(`
      CREATE TABLE IF NOT EXISTS sid_loyalty_transactions (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        patient_id INT UNSIGNED NOT NULL,
        points INT NOT NULL,
        transaction_type ENUM('earned', 'redeemed', 'expired', 'bonus') NOT NULL DEFAULT 'earned',
        description VARCHAR(255) NOT NULL,
        reference_order_id INT UNSIGNED NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_loyalty_patient (patient_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Created sid_loyalty_transactions table');

    console.log('✨ All CRM database tables and schema migrations verified successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ CRM Migration failed:', err);
    process.exit(1);
  }
}

runCrmMigration();
