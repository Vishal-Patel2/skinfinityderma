/**
 * Skinfinity Derma - Database Migration v3
 * Relational tables for:
 * 1. Homepage Sections & Items
 * 2. Dedicated Services & Service Categories
 * 3. Dynamic Pages & Page Sections
 * 4. Location Enhancements (Local SEO & Clinicians)
 */

const { query } = require('../src/config/db');

async function migrateV3() {
  console.log('--- Starting Migration v3 ---');

  // 1. Homepage Sections Table
  await query(`
    CREATE TABLE IF NOT EXISTS sid_homepage_sections (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      section_key VARCHAR(80) NOT NULL UNIQUE,
      section_name VARCHAR(120) NOT NULL,
      title VARCHAR(255) NULL,
      subtitle VARCHAR(255) NULL,
      badge_text VARCHAR(100) NULL,
      description TEXT NULL,
      media_url VARCHAR(500) NULL,
      media_alt VARCHAR(255) NULL,
      button_text VARCHAR(80) NULL,
      button_url VARCHAR(255) NULL,
      secondary_button_text VARCHAR(80) NULL,
      secondary_button_url VARCHAR(255) NULL,
      extra_json LONGTEXT NULL,
      display_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✔ sid_homepage_sections table verified');

  // 2. Homepage Section Items (repeatable cards, stats, pillars, trust badges)
  await query(`
    CREATE TABLE IF NOT EXISTS sid_homepage_items (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      section_key VARCHAR(80) NOT NULL,
      title VARCHAR(190) NOT NULL,
      subtitle VARCHAR(190) NULL,
      description TEXT NULL,
      icon VARCHAR(100) NULL,
      image_url VARCHAR(500) NULL,
      link_url VARCHAR(255) NULL,
      badge VARCHAR(80) NULL,
      extra_data LONGTEXT NULL,
      display_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_section (section_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✔ sid_homepage_items table verified');

  // 3. Service Categories
  await query(`
    CREATE TABLE IF NOT EXISTS sid_service_categories (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      slug VARCHAR(120) NOT NULL UNIQUE,
      description TEXT NULL,
      icon VARCHAR(100) NULL,
      image VARCHAR(500) NULL,
      display_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✔ sid_service_categories table verified');

  // 4. Dedicated Services Table (Separate from Treatments)
  await query(`
    CREATE TABLE IF NOT EXISTS sid_services (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      category_id INT UNSIGNED NULL,
      name VARCHAR(190) NOT NULL,
      slug VARCHAR(190) NOT NULL UNIQUE,
      short_desc VARCHAR(500) NULL,
      full_desc LONGTEXT NULL,
      image VARCHAR(500) NULL,
      additional_images LONGTEXT NULL,
      benefits LONGTEXT NULL,
      procedure_steps LONGTEXT NULL,
      faqs LONGTEXT NULL,
      associated_treatment_ids LONGTEXT NULL,
      cta_text VARCHAR(80) DEFAULT 'Book Consultation',
      cta_url VARCHAR(255) DEFAULT '/treatments',
      display_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      seo_title VARCHAR(255) NULL,
      seo_desc VARCHAR(500) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_cat (category_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✔ sid_services table verified');

  // 5. Dynamic Pages Table
  await query(`
    CREATE TABLE IF NOT EXISTS sid_pages (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(190) NOT NULL,
      slug VARCHAR(190) NOT NULL UNIQUE,
      subtitle VARCHAR(255) NULL,
      banner_image VARCHAR(500) NULL,
      content LONGTEXT NULL,
      seo_title VARCHAR(255) NULL,
      seo_desc VARCHAR(500) NULL,
      seo_keywords VARCHAR(255) NULL,
      is_active TINYINT(1) DEFAULT 1,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✔ sid_pages table verified');

  // 6. Dynamic Page Content Sections
  await query(`
    CREATE TABLE IF NOT EXISTS sid_page_sections (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      page_id INT UNSIGNED NOT NULL,
      section_type VARCHAR(60) NOT NULL,
      title VARCHAR(190) NULL,
      subtitle VARCHAR(255) NULL,
      content LONGTEXT NULL,
      media_url VARCHAR(500) NULL,
      extra_json LONGTEXT NULL,
      display_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_page (page_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✔ sid_page_sections table verified');

  // 7. Location Enhancements on sid_clinics
  const clinicCols = await query('DESCRIBE sid_clinics');
  const existingCols = clinicCols.map(c => c.Field);

  if (!existingCols.includes('seo_title')) {
    await query(`ALTER TABLE sid_clinics ADD COLUMN seo_title VARCHAR(255) NULL AFTER highlights`);
  }
  if (!existingCols.includes('seo_desc')) {
    await query(`ALTER TABLE sid_clinics ADD COLUMN seo_desc VARCHAR(500) NULL AFTER seo_title`);
  }
  if (!existingCols.includes('meta_keywords')) {
    await query(`ALTER TABLE sid_clinics ADD COLUMN meta_keywords VARCHAR(255) NULL AFTER seo_desc`);
  }
  if (!existingCols.includes('schema_markup')) {
    await query(`ALTER TABLE sid_clinics ADD COLUMN schema_markup LONGTEXT NULL AFTER meta_keywords`);
  }
  if (!existingCols.includes('banner_image')) {
    await query(`ALTER TABLE sid_clinics ADD COLUMN banner_image VARCHAR(500) NULL AFTER image`);
  }
  console.log('✔ sid_clinics columns enhanced with local SEO & banner');

  // 8. Doctor Enhancements on sid_doctors
  const docCols = await query('DESCRIBE sid_doctors');
  const existingDocCols = docCols.map(c => c.Field);
  if (!existingDocCols.includes('profile_banner')) {
    await query(`ALTER TABLE sid_doctors ADD COLUMN profile_banner VARCHAR(500) NULL AFTER image`);
  }
  if (!existingDocCols.includes('achievements')) {
    await query(`ALTER TABLE sid_doctors ADD COLUMN achievements LONGTEXT NULL AFTER bio`);
  }
  if (!existingDocCols.includes('certifications')) {
    await query(`ALTER TABLE sid_doctors ADD COLUMN certifications LONGTEXT NULL AFTER achievements`);
  }
  if (!existingDocCols.includes('video_url')) {
    await query(`ALTER TABLE sid_doctors ADD COLUMN video_url VARCHAR(500) NULL AFTER certifications`);
  }
  if (!existingDocCols.includes('associated_treatments')) {
    await query(`ALTER TABLE sid_doctors ADD COLUMN associated_treatments LONGTEXT NULL AFTER video_url`);
  }
  console.log('✔ sid_doctors columns enhanced with profile banner & achievements');

  console.log('=== Migration v3 Completed Successfully ===');
  process.exit(0);
}

migrateV3().catch(err => {
  console.error('Migration v3 Failed:', err);
  process.exit(1);
});
