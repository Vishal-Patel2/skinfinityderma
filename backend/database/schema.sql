-- =====================================================================
-- Skinfinity Derma — Database schema (MySQL 5.7+ / MariaDB 10.4+)
-- Re-runnable: every statement is CREATE ... IF NOT EXISTS.
-- Conventions: snake_case columns, utf8mb4, InnoDB, created_at/updated_at,
--              JSON stored in JSON (LONGTEXT alias on MariaDB) columns.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ACCESS CONTROL (RBAC)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(50)  NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  is_system   TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permissions (
  id      INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code    VARCHAR(80)  NOT NULL UNIQUE,         -- e.g. treatments.edit
  module  VARCHAR(50)  NOT NULL,
  action  VARCHAR(30)  NOT NULL,
  label   VARCHAR(150) NOT NULL,
  INDEX idx_permissions_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id       INT UNSIGNED NOT NULL,
  permission_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_perm FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NOT NULL UNIQUE,
  phone         VARCHAR(30)  NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id       INT UNSIGNED NOT NULL,
  avatar        VARCHAR(500) NULL,
  status        ENUM('active','inactive') NOT NULL DEFAULT 'active',
  last_login_at DATETIME     NULL,
  token_version INT UNSIGNED NOT NULL DEFAULT 0,   -- bump to invalidate all issued JWTs
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id),
  INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NULL,
  user_name  VARCHAR(120) NULL,
  action     VARCHAR(40)  NOT NULL,              -- create | update | delete | login | status ...
  entity     VARCHAR(60)  NOT NULL,
  entity_id  VARCHAR(40)  NULL,
  summary    VARCHAR(255) NULL,
  details    JSON         NULL,
  ip         VARCHAR(64)  NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_entity (entity, entity_id),
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. SITE CONFIGURATION & GLOBAL CONTENT
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  setting_key   VARCHAR(100) NOT NULL PRIMARY KEY,
  setting_value JSON         NULL,
  group_name    VARCHAR(50)  NOT NULL DEFAULT 'general',
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menu_items (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  menu_key        VARCHAR(60)  NOT NULL,          -- header_main | footer_company | footer_treatments | footer_legal ...
  parent_id       INT UNSIGNED NULL,
  label           VARCHAR(150) NOT NULL,
  url             VARCHAR(500) NOT NULL DEFAULT '#',
  icon            VARCHAR(80)  NULL,
  badge           VARCHAR(40)  NULL,
  open_in_new_tab TINYINT(1)   NOT NULL DEFAULT 0,
  meta            JSON         NULL,
  display_order   INT          NOT NULL DEFAULT 0,
  is_active       TINYINT(1)   NOT NULL DEFAULT 1,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_menu_key (menu_key, parent_id, display_order),
  CONSTRAINT fk_menu_parent FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS content_blocks (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  block_key   VARCHAR(120) NOT NULL UNIQUE,        -- e.g. home.brand_journey
  title       VARCHAR(190) NOT NULL,
  description VARCHAR(255) NULL,
  content     JSON         NULL,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  updated_by  INT UNSIGNED NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS seo_pages (
  id                  INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  path                VARCHAR(255) NOT NULL UNIQUE,   -- /, /treatments, /about-us ...
  name                VARCHAR(150) NOT NULL,
  meta_title          VARCHAR(255) NULL,
  meta_description    VARCHAR(500) NULL,
  meta_keywords       VARCHAR(500) NULL,
  og_title            VARCHAR(255) NULL,
  og_description      VARCHAR(500) NULL,
  og_image            VARCHAR(500) NULL,
  canonical_url       VARCHAR(500) NULL,
  robots              VARCHAR(60)  NOT NULL DEFAULT 'index,follow',
  schema_json         JSON         NULL,
  include_in_sitemap  TINYINT(1)   NOT NULL DEFAULT 1,
  sitemap_priority    DECIMAL(2,1) NOT NULL DEFAULT 0.7,
  sitemap_changefreq  VARCHAR(20)  NOT NULL DEFAULT 'weekly',
  is_active           TINYINT(1)   NOT NULL DEFAULT 1,
  created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media_files (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  filename      VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NULL,
  url           VARCHAR(500) NOT NULL,
  mime_type     VARCHAR(100) NULL,
  size_bytes    INT UNSIGNED NOT NULL DEFAULT 0,
  width         INT UNSIGNED NULL,
  height        INT UNSIGNED NULL,
  alt_text      VARCHAR(255) NULL,
  uploaded_by   INT UNSIGNED NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_media_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. CLINICS, DOCTORS, CATALOG
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clinics (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug           VARCHAR(120) NOT NULL UNIQUE,
  city           VARCHAR(80)  NOT NULL,
  title          VARCHAR(190) NOT NULL,
  address        VARCHAR(300) NOT NULL,
  landmark       VARCHAR(200) NULL,
  pincode        VARCHAR(12)  NULL,
  phones         JSON         NULL,
  email          VARCHAR(190) NULL,
  whatsapp       VARCHAR(30)  NULL,
  hours          VARCHAR(190) NULL,
  map_embed_url  TEXT         NULL,
  map_link       VARCHAR(500) NULL,
  highlights     JSON         NULL,
  image          VARCHAR(500) NULL,
  latitude       DECIMAL(10,7) NULL,
  longitude      DECIMAL(10,7) NULL,
  slot_start     VARCHAR(5)   NOT NULL DEFAULT '10:00',
  slot_end       VARCHAR(5)   NOT NULL DEFAULT '20:00',
  slot_minutes   SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  slot_capacity  SMALLINT UNSIGNED NOT NULL DEFAULT 2,     -- parallel appointments per slot
  weekly_off     VARCHAR(40)  NULL,                        -- e.g. "Sun" or "Sat,Sun"
  display_order  INT          NOT NULL DEFAULT 0,
  is_active      TINYINT(1)   NOT NULL DEFAULT 1,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS doctors (
  id                  INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug                VARCHAR(150) NOT NULL UNIQUE,
  name                VARCHAR(150) NOT NULL,
  role                VARCHAR(255) NULL,
  qualifications      VARCHAR(500) NULL,
  specialty           VARCHAR(500) NULL,
  experience          VARCHAR(100) NULL,
  image               VARCHAR(500) NULL,
  bio                 TEXT         NULL,
  consultation_fee    DECIMAL(10,2) NOT NULL DEFAULT 0,
  available_locations JSON         NULL,                 -- ["Noida","Gurgaon"]
  availability        VARCHAR(255) NULL,
  display_order       INT          NOT NULL DEFAULT 0,
  is_active           TINYINT(1)   NOT NULL DEFAULT 1,
  created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(120) NOT NULL UNIQUE,
  slug            VARCHAR(140) NOT NULL UNIQUE,
  description     VARCHAR(500) NULL,
  thumbnail       VARCHAR(500) NULL,
  seo_title       VARCHAR(255) NULL,
  seo_description VARCHAR(500) NULL,
  display_order   INT          NOT NULL DEFAULT 0,
  is_active       TINYINT(1)   NOT NULL DEFAULT 1,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS concerns (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL UNIQUE,
  slug          VARCHAR(140) NOT NULL UNIQUE,
  description   VARCHAR(500) NULL,
  thumbnail     VARCHAR(500) NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS treatments (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  legacy_id          VARCHAR(80)  NULL,                      -- id used by the website's static catalog
  slug               VARCHAR(190) NOT NULL UNIQUE,
  aliases            JSON         NULL,                      -- extra slugs that resolve to this treatment
  name               VARCHAR(220) NOT NULL,
  category_id        INT UNSIGNED NULL,
  body_area          VARCHAR(60)  NULL,
  tags               JSON         NULL,
  rating             DECIMAL(3,2) NOT NULL DEFAULT 4.80,
  reviews_count      INT UNSIGNED NOT NULL DEFAULT 0,
  duration           VARCHAR(80)  NULL,
  price              DECIMAL(10,2) NOT NULL DEFAULT 0,
  original_price     DECIMAL(10,2) NULL,
  discount_badge     VARCHAR(60)  NULL,
  emi_months         SMALLINT UNSIGNED NULL,
  emi_monthly        DECIMAL(10,2) NULL,
  sessions_info      VARCHAR(255) NULL,
  card_highlights    JSON         NULL,
  explained_subtitle VARCHAR(255) NULL,
  short_desc         TEXT         NULL,
  full_desc          MEDIUMTEXT   NULL,
  banner_image       VARCHAR(500) NULL,
  gallery_images     JSON         NULL,                      -- [{src,caption}]
  how_it_works       JSON         NULL,                      -- [{stepNumber,title,desc,image}]
  ideal_frequency    VARCHAR(255) NULL,
  ideal_for          JSON         NULL,
  not_ideal_for      JSON         NULL,
  before_treatment   JSON         NULL,
  after_treatment    JSON         NULL,
  youtube_video_id   VARCHAR(40)  NULL,
  faqs               JSON         NULL,                      -- [{question,answer}]
  seo_title          VARCHAR(255) NULL,
  seo_description    VARCHAR(500) NULL,
  seo_keywords       VARCHAR(500) NULL,
  og_image           VARCHAR(500) NULL,
  display_order      INT          NOT NULL DEFAULT 0,
  is_active          TINYINT(1)   NOT NULL DEFAULT 1,
  is_featured        TINYINT(1)   NOT NULL DEFAULT 0,
  created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_treatments_category (category_id),
  INDEX idx_treatments_active (is_active, is_featured, display_order),
  UNIQUE KEY uq_treatments_legacy (legacy_id),
  CONSTRAINT fk_treatments_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS treatment_concerns (
  treatment_id INT UNSIGNED NOT NULL,
  concern_id   INT UNSIGNED NOT NULL,
  PRIMARY KEY (treatment_id, concern_id),
  CONSTRAINT fk_tc_treatment FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE,
  CONSTRAINT fk_tc_concern   FOREIGN KEY (concern_id)   REFERENCES concerns(id)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. WEBSITE MEDIA & SOCIAL PROOF
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS banners (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  subtitle      VARCHAR(500) NULL,
  desktop_image VARCHAR(500) NULL,
  mobile_image  VARCHAR(500) NULL,
  alt_text      VARCHAR(255) NULL,
  button_text   VARCHAR(80)  NULL,
  button_url    VARCHAR(500) NULL,
  location      VARCHAR(60)  NOT NULL DEFAULT 'Homepage Hero',
  meta          JSON         NULL,
  starts_at     DATE         NULL,
  ends_at       DATE         NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_banners_loc (location, is_active, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery_items (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  image         VARCHAR(500) NOT NULL,
  title         VARCHAR(255) NULL,
  alt_text      VARCHAR(255) NULL,
  category      VARCHAR(100) NULL,
  treatment_id  INT UNSIGNED NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_gallery_treatment FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS before_after_cases (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  legacy_id          VARCHAR(80)  NULL,
  patient_name       VARCHAR(120) NULL,
  treatment          VARCHAR(220) NOT NULL,
  treatment_id       INT UNSIGNED NULL,
  description        TEXT         NULL,
  before_image       VARCHAR(500) NULL,
  after_image        VARCHAR(500) NOT NULL,
  results_type       VARCHAR(100) NULL,
  timeframe          VARCHAR(100) NULL,
  has_patient_consent TINYINT(1)  NOT NULL DEFAULT 0,
  approval_status    ENUM('Pending','Approved','Restricted') NOT NULL DEFAULT 'Pending',
  display_order      INT          NOT NULL DEFAULT 0,
  is_active          TINYINT(1)   NOT NULL DEFAULT 1,
  created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ba_legacy (legacy_id),
  CONSTRAINT fk_ba_treatment FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  legacy_id     VARCHAR(80)  NULL,
  reviewer_name VARCHAR(120) NOT NULL,
  initials      VARCHAR(6)   NULL,
  avatar        VARCHAR(500) NULL,
  rating        TINYINT UNSIGNED NOT NULL DEFAULT 5,
  review_text   TEXT         NOT NULL,
  treatment_tag VARCHAR(160) NULL,
  branch        VARCHAR(160) NULL,
  source        ENUM('google','website','manual') NOT NULL DEFAULT 'google',
  verified      TINYINT(1)   NOT NULL DEFAULT 1,
  review_date   DATE         NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_reviews_legacy (legacy_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS videos (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  legacy_id     VARCHAR(80)  NULL,
  title         VARCHAR(255) NOT NULL,
  category      VARCHAR(120) NULL,
  youtube_id    VARCHAR(40)  NOT NULL,
  doctor_name   VARCHAR(150) NULL,
  type          ENUM('doctor_video','patient_story','short') NOT NULL DEFAULT 'doctor_video',
  thumbnail     VARCHAR(500) NULL,
  quote         TEXT         NULL,
  rating        TINYINT UNSIGNED NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_videos_legacy (legacy_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS press_mentions (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(400) NOT NULL,
  outlet        VARCHAR(150) NULL,
  date_label    VARCHAR(60)  NULL,
  doctor        VARCHAR(150) NULL,
  type          VARCHAR(80)  NULL,
  image         VARCHAR(500) NULL,
  thumbnail     VARCHAR(500) NULL,
  link          VARCHAR(500) NULL,
  video_id      VARCHAR(40)  NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faqs (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  scope         VARCHAR(80)  NOT NULL DEFAULT 'general',      -- home | general | <treatment slug> ...
  question      VARCHAR(500) NOT NULL,
  answer        TEXT         NOT NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_faqs_scope (scope, is_active, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. MARKETING: COUPONS & OFFERS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS coupons (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code           VARCHAR(40)  NOT NULL UNIQUE,
  title          VARCHAR(190) NOT NULL,
  description    VARCHAR(500) NULL,
  discount_type  ENUM('percent','flat') NOT NULL DEFAULT 'percent',
  discount_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_discount   DECIMAL(10,2) NULL,                          -- cap for percent coupons
  min_order      DECIMAL(10,2) NOT NULL DEFAULT 0,
  applies_to     ENUM('all','treatments','categories') NOT NULL DEFAULT 'all',
  usage_limit    INT UNSIGNED NULL,                           -- NULL = unlimited
  used_count     INT UNSIGNED NOT NULL DEFAULT 0,
  valid_from     DATE         NULL,
  valid_to       DATE         NULL,
  is_active      TINYINT(1)   NOT NULL DEFAULT 1,
  created_by     INT UNSIGNED NULL,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS coupon_treatments (
  coupon_id    INT UNSIGNED NOT NULL,
  treatment_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (coupon_id, treatment_id),
  CONSTRAINT fk_ct_coupon    FOREIGN KEY (coupon_id)    REFERENCES coupons(id)    ON DELETE CASCADE,
  CONSTRAINT fk_ct_treatment FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS coupon_categories (
  coupon_id   INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (coupon_id, category_id),
  CONSTRAINT fk_cc_coupon   FOREIGN KEY (coupon_id)   REFERENCES coupons(id)    ON DELETE CASCADE,
  CONSTRAINT fk_cc_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS offers (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  legacy_id     VARCHAR(80)  NULL,
  title         VARCHAR(255) NOT NULL,
  badge         VARCHAR(80)  NULL,
  description   VARCHAR(600) NULL,
  image         VARCHAR(500) NULL,
  link_text     VARCHAR(80)  NULL,
  slug          VARCHAR(190) NULL,                            -- link target on the website
  coupon_id     INT UNSIGNED NULL,
  valid_from    DATE         NULL,
  valid_to      DATE         NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_offers_legacy (legacy_id),
  CONSTRAINT fk_offers_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS offer_treatments (
  offer_id     INT UNSIGNED NOT NULL,
  treatment_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (offer_id, treatment_id),
  CONSTRAINT fk_ot_offer     FOREIGN KEY (offer_id)     REFERENCES offers(id)     ON DELETE CASCADE,
  CONSTRAINT fk_ot_treatment FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. CLINIC OPERATIONS: ENQUIRIES & APPOINTMENTS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enquiries (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  enquiry_no     VARCHAR(24)  NULL UNIQUE,
  type           ENUM('contact','appointment_callback','emi','franchise','membership','skin_analysis','hair_graft','laser_estimate','other') NOT NULL DEFAULT 'contact',
  name           VARCHAR(150) NOT NULL,
  phone          VARCHAR(30)  NULL,
  email          VARCHAR(190) NULL,
  city           VARCHAR(100) NULL,
  subject        VARCHAR(255) NULL,
  message        TEXT         NULL,
  treatment_id   INT UNSIGNED NULL,
  treatment_name VARCHAR(220) NULL,
  clinic_id      INT UNSIGNED NULL,
  source         VARCHAR(255) NULL,
  extra          JSON         NULL,
  status         ENUM('new','contacted','qualified','converted','closed','spam') NOT NULL DEFAULT 'new',
  priority       ENUM('low','normal','high') NOT NULL DEFAULT 'normal',
  assigned_to    INT UNSIGNED NULL,
  follow_up_at   DATETIME     NULL,
  ip             VARCHAR(64)  NULL,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_enq_status (status, created_at),
  INDEX idx_enq_type (type),
  INDEX idx_enq_phone (phone),
  CONSTRAINT fk_enq_treatment FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE SET NULL,
  CONSTRAINT fk_enq_clinic    FOREIGN KEY (clinic_id)    REFERENCES clinics(id)    ON DELETE SET NULL,
  CONSTRAINT fk_enq_user      FOREIGN KEY (assigned_to)  REFERENCES users(id)      ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS appointments (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  appointment_no   VARCHAR(24)  NULL UNIQUE,
  patient_name     VARCHAR(150) NOT NULL,
  phone            VARCHAR(30)  NOT NULL,
  email            VARCHAR(190) NULL,
  gender           ENUM('Female','Male','Other') NULL,
  age              TINYINT UNSIGNED NULL,
  clinic_id        INT UNSIGNED NULL,
  doctor_id        INT UNSIGNED NULL,
  treatment_id     INT UNSIGNED NULL,
  service_name     VARCHAR(220) NULL,
  appointment_date DATE         NOT NULL,
  appointment_time VARCHAR(5)   NOT NULL,                     -- HH:MM (24h)
  visit_type       ENUM('new','follow_up','online') NOT NULL DEFAULT 'new',
  notes            TEXT         NULL,
  source           VARCHAR(120) NULL,
  coupon_id        INT UNSIGNED NULL,
  coupon_code      VARCHAR(40)  NULL,
  discount_amount  DECIMAL(10,2) NOT NULL DEFAULT 0,
  amount_estimate  DECIMAL(10,2) NULL,
  status           ENUM('pending','confirmed','rescheduled','completed','cancelled','no_show') NOT NULL DEFAULT 'pending',
  cancel_reason    VARCHAR(255) NULL,
  assigned_to      INT UNSIGNED NULL,
  ip               VARCHAR(64)  NULL,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_appt_date (appointment_date, clinic_id, status),
  INDEX idx_appt_status (status, created_at),
  INDEX idx_appt_phone (phone),
  CONSTRAINT fk_appt_clinic    FOREIGN KEY (clinic_id)    REFERENCES clinics(id)    ON DELETE SET NULL,
  CONSTRAINT fk_appt_doctor    FOREIGN KEY (doctor_id)    REFERENCES doctors(id)    ON DELETE SET NULL,
  CONSTRAINT fk_appt_treatment FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE SET NULL,
  CONSTRAINT fk_appt_coupon    FOREIGN KEY (coupon_id)    REFERENCES coupons(id)    ON DELETE SET NULL,
  CONSTRAINT fk_appt_user      FOREIGN KEY (assigned_to)  REFERENCES users(id)      ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lead_notes (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('enquiry','appointment') NOT NULL,
  entity_id   INT UNSIGNED NOT NULL,
  user_id     INT UNSIGNED NULL,
  user_name   VARCHAR(120) NULL,
  note        TEXT         NOT NULL,
  is_system   TINYINT(1)   NOT NULL DEFAULT 0,               -- auto-generated status-change entries
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notes_entity (entity_type, entity_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  coupon_id       INT UNSIGNED NOT NULL,
  appointment_id  INT UNSIGNED NULL,
  customer_phone  VARCHAR(30)  NULL,
  customer_email  VARCHAR(190) NULL,
  order_amount    DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_red_coupon (coupon_id, created_at),
  CONSTRAINT fk_red_coupon FOREIGN KEY (coupon_id)      REFERENCES coupons(id)      ON DELETE CASCADE,
  CONSTRAINT fk_red_appt   FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
