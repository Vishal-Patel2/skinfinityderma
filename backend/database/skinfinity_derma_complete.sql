-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: skinfinity_derma
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary table structure for view `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!50001 DROP VIEW IF EXISTS `appointments`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `appointments` AS SELECT
 1 AS `id`,
  1 AS `appointment_no`,
  1 AS `patient_name`,
  1 AS `phone`,
  1 AS `email`,
  1 AS `gender`,
  1 AS `age`,
  1 AS `clinic_id`,
  1 AS `doctor_id`,
  1 AS `treatment_id`,
  1 AS `service_name`,
  1 AS `appointment_date`,
  1 AS `appointment_time`,
  1 AS `visit_type`,
  1 AS `notes`,
  1 AS `source`,
  1 AS `coupon_id`,
  1 AS `coupon_code`,
  1 AS `discount_amount`,
  1 AS `amount_estimate`,
  1 AS `status`,
  1 AS `cancel_reason`,
  1 AS `assigned_to`,
  1 AS `ip`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!50001 DROP VIEW IF EXISTS `audit_logs`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `audit_logs` AS SELECT
 1 AS `id`,
  1 AS `user_id`,
  1 AS `user_name`,
  1 AS `action`,
  1 AS `entity`,
  1 AS `entity_id`,
  1 AS `summary`,
  1 AS `details`,
  1 AS `ip`,
  1 AS `created_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!50001 DROP VIEW IF EXISTS `banners`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `banners` AS SELECT
 1 AS `id`,
  1 AS `title`,
  1 AS `subtitle`,
  1 AS `desktop_image`,
  1 AS `mobile_image`,
  1 AS `alt_text`,
  1 AS `button_text`,
  1 AS `button_url`,
  1 AS `location`,
  1 AS `meta`,
  1 AS `starts_at`,
  1 AS `ends_at`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `before_after_cases`
--

DROP TABLE IF EXISTS `before_after_cases`;
/*!50001 DROP VIEW IF EXISTS `before_after_cases`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `before_after_cases` AS SELECT
 1 AS `id`,
  1 AS `legacy_id`,
  1 AS `patient_name`,
  1 AS `treatment`,
  1 AS `treatment_id`,
  1 AS `description`,
  1 AS `before_image`,
  1 AS `after_image`,
  1 AS `results_type`,
  1 AS `timeframe`,
  1 AS `has_patient_consent`,
  1 AS `approval_status`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!50001 DROP VIEW IF EXISTS `categories`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `categories` AS SELECT
 1 AS `id`,
  1 AS `name`,
  1 AS `slug`,
  1 AS `description`,
  1 AS `thumbnail`,
  1 AS `seo_title`,
  1 AS `seo_description`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `clinics`
--

DROP TABLE IF EXISTS `clinics`;
/*!50001 DROP VIEW IF EXISTS `clinics`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `clinics` AS SELECT
 1 AS `id`,
  1 AS `slug`,
  1 AS `city`,
  1 AS `title`,
  1 AS `address`,
  1 AS `landmark`,
  1 AS `pincode`,
  1 AS `phones`,
  1 AS `email`,
  1 AS `whatsapp`,
  1 AS `hours`,
  1 AS `map_embed_url`,
  1 AS `map_link`,
  1 AS `highlights`,
  1 AS `image`,
  1 AS `latitude`,
  1 AS `longitude`,
  1 AS `slot_start`,
  1 AS `slot_end`,
  1 AS `slot_minutes`,
  1 AS `slot_capacity`,
  1 AS `weekly_off`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `concerns`
--

DROP TABLE IF EXISTS `concerns`;
/*!50001 DROP VIEW IF EXISTS `concerns`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `concerns` AS SELECT
 1 AS `id`,
  1 AS `name`,
  1 AS `slug`,
  1 AS `description`,
  1 AS `thumbnail`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `content_blocks`
--

DROP TABLE IF EXISTS `content_blocks`;
/*!50001 DROP VIEW IF EXISTS `content_blocks`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `content_blocks` AS SELECT
 1 AS `id`,
  1 AS `block_key`,
  1 AS `title`,
  1 AS `description`,
  1 AS `content`,
  1 AS `is_active`,
  1 AS `updated_by`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `coupon_categories`
--

DROP TABLE IF EXISTS `coupon_categories`;
/*!50001 DROP VIEW IF EXISTS `coupon_categories`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `coupon_categories` AS SELECT
 1 AS `coupon_id`,
  1 AS `category_id` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `coupon_redemptions`
--

DROP TABLE IF EXISTS `coupon_redemptions`;
/*!50001 DROP VIEW IF EXISTS `coupon_redemptions`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `coupon_redemptions` AS SELECT
 1 AS `id`,
  1 AS `coupon_id`,
  1 AS `appointment_id`,
  1 AS `customer_phone`,
  1 AS `customer_email`,
  1 AS `order_amount`,
  1 AS `discount_amount`,
  1 AS `created_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `coupon_treatments`
--

DROP TABLE IF EXISTS `coupon_treatments`;
/*!50001 DROP VIEW IF EXISTS `coupon_treatments`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `coupon_treatments` AS SELECT
 1 AS `coupon_id`,
  1 AS `treatment_id` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!50001 DROP VIEW IF EXISTS `coupons`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `coupons` AS SELECT
 1 AS `id`,
  1 AS `code`,
  1 AS `title`,
  1 AS `description`,
  1 AS `discount_type`,
  1 AS `discount_value`,
  1 AS `max_discount`,
  1 AS `min_order`,
  1 AS `applies_to`,
  1 AS `usage_limit`,
  1 AS `used_count`,
  1 AS `valid_from`,
  1 AS `valid_to`,
  1 AS `is_active`,
  1 AS `created_by`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!50001 DROP VIEW IF EXISTS `doctors`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `doctors` AS SELECT
 1 AS `id`,
  1 AS `slug`,
  1 AS `name`,
  1 AS `role`,
  1 AS `qualifications`,
  1 AS `specialty`,
  1 AS `experience`,
  1 AS `image`,
  1 AS `bio`,
  1 AS `consultation_fee`,
  1 AS `available_locations`,
  1 AS `availability`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `enquiries`
--

DROP TABLE IF EXISTS `enquiries`;
/*!50001 DROP VIEW IF EXISTS `enquiries`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `enquiries` AS SELECT
 1 AS `id`,
  1 AS `enquiry_no`,
  1 AS `type`,
  1 AS `name`,
  1 AS `phone`,
  1 AS `email`,
  1 AS `city`,
  1 AS `subject`,
  1 AS `message`,
  1 AS `treatment_id`,
  1 AS `treatment_name`,
  1 AS `clinic_id`,
  1 AS `source`,
  1 AS `extra`,
  1 AS `status`,
  1 AS `priority`,
  1 AS `assigned_to`,
  1 AS `follow_up_at`,
  1 AS `ip`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `faqs`
--

DROP TABLE IF EXISTS `faqs`;
/*!50001 DROP VIEW IF EXISTS `faqs`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `faqs` AS SELECT
 1 AS `id`,
  1 AS `scope`,
  1 AS `question`,
  1 AS `answer`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `gallery_items`
--

DROP TABLE IF EXISTS `gallery_items`;
/*!50001 DROP VIEW IF EXISTS `gallery_items`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `gallery_items` AS SELECT
 1 AS `id`,
  1 AS `image`,
  1 AS `title`,
  1 AS `alt_text`,
  1 AS `category`,
  1 AS `treatment_id`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `lead_notes`
--

DROP TABLE IF EXISTS `lead_notes`;
/*!50001 DROP VIEW IF EXISTS `lead_notes`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `lead_notes` AS SELECT
 1 AS `id`,
  1 AS `entity_type`,
  1 AS `entity_id`,
  1 AS `user_id`,
  1 AS `user_name`,
  1 AS `note`,
  1 AS `is_system`,
  1 AS `created_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `media_files`
--

DROP TABLE IF EXISTS `media_files`;
/*!50001 DROP VIEW IF EXISTS `media_files`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `media_files` AS SELECT
 1 AS `id`,
  1 AS `filename`,
  1 AS `original_name`,
  1 AS `url`,
  1 AS `mime_type`,
  1 AS `size_bytes`,
  1 AS `width`,
  1 AS `height`,
  1 AS `alt_text`,
  1 AS `uploaded_by`,
  1 AS `created_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `membership_plans`
--

DROP TABLE IF EXISTS `membership_plans`;
/*!50001 DROP VIEW IF EXISTS `membership_plans`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `membership_plans` AS SELECT
 1 AS `id`,
  1 AS `slug`,
  1 AS `name`,
  1 AS `price`,
  1 AS `price_formatted`,
  1 AS `period`,
  1 AS `validity`,
  1 AS `tagline`,
  1 AS `is_popular`,
  1 AS `features`,
  1 AS `card_bg`,
  1 AS `pass_gradient`,
  1 AS `badge_style`,
  1 AS `button_style`,
  1 AS `accent_text`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `subscribers_count`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!50001 DROP VIEW IF EXISTS `menu_items`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `menu_items` AS SELECT
 1 AS `id`,
  1 AS `menu_key`,
  1 AS `parent_id`,
  1 AS `label`,
  1 AS `url`,
  1 AS `icon`,
  1 AS `badge`,
  1 AS `open_in_new_tab`,
  1 AS `meta`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `offer_treatments`
--

DROP TABLE IF EXISTS `offer_treatments`;
/*!50001 DROP VIEW IF EXISTS `offer_treatments`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `offer_treatments` AS SELECT
 1 AS `offer_id`,
  1 AS `treatment_id` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!50001 DROP VIEW IF EXISTS `offers`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `offers` AS SELECT
 1 AS `id`,
  1 AS `legacy_id`,
  1 AS `title`,
  1 AS `badge`,
  1 AS `description`,
  1 AS `image`,
  1 AS `link_text`,
  1 AS `slug`,
  1 AS `coupon_id`,
  1 AS `valid_from`,
  1 AS `valid_to`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!50001 DROP VIEW IF EXISTS `permissions`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `permissions` AS SELECT
 1 AS `id`,
  1 AS `code`,
  1 AS `module`,
  1 AS `action`,
  1 AS `label` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `press_mentions`
--

DROP TABLE IF EXISTS `press_mentions`;
/*!50001 DROP VIEW IF EXISTS `press_mentions`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `press_mentions` AS SELECT
 1 AS `id`,
  1 AS `title`,
  1 AS `outlet`,
  1 AS `date_label`,
  1 AS `doctor`,
  1 AS `type`,
  1 AS `image`,
  1 AS `thumbnail`,
  1 AS `link`,
  1 AS `video_id`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!50001 DROP VIEW IF EXISTS `reviews`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `reviews` AS SELECT
 1 AS `id`,
  1 AS `legacy_id`,
  1 AS `reviewer_name`,
  1 AS `initials`,
  1 AS `avatar`,
  1 AS `rating`,
  1 AS `review_text`,
  1 AS `treatment_tag`,
  1 AS `branch`,
  1 AS `source`,
  1 AS `verified`,
  1 AS `review_date`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!50001 DROP VIEW IF EXISTS `role_permissions`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `role_permissions` AS SELECT
 1 AS `role_id`,
  1 AS `permission_id` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!50001 DROP VIEW IF EXISTS `roles`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `roles` AS SELECT
 1 AS `id`,
  1 AS `slug`,
  1 AS `name`,
  1 AS `description`,
  1 AS `is_system`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `seo_pages`
--

DROP TABLE IF EXISTS `seo_pages`;
/*!50001 DROP VIEW IF EXISTS `seo_pages`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `seo_pages` AS SELECT
 1 AS `id`,
  1 AS `path`,
  1 AS `name`,
  1 AS `meta_title`,
  1 AS `meta_description`,
  1 AS `meta_keywords`,
  1 AS `og_title`,
  1 AS `og_description`,
  1 AS `og_image`,
  1 AS `canonical_url`,
  1 AS `robots`,
  1 AS `schema_json`,
  1 AS `include_in_sitemap`,
  1 AS `sitemap_priority`,
  1 AS `sitemap_changefreq`,
  1 AS `is_active`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!50001 DROP VIEW IF EXISTS `settings`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `settings` AS SELECT
 1 AS `setting_key`,
  1 AS `setting_value`,
  1 AS `group_name`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `sid_appointments`
--

DROP TABLE IF EXISTS `sid_appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_appointments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `appointment_no` varchar(24) DEFAULT NULL,
  `patient_name` varchar(150) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `email` varchar(190) DEFAULT NULL,
  `gender` enum('Female','Male','Other') DEFAULT NULL,
  `age` tinyint(3) unsigned DEFAULT NULL,
  `clinic_id` int(10) unsigned DEFAULT NULL,
  `doctor_id` int(10) unsigned DEFAULT NULL,
  `treatment_id` int(10) unsigned DEFAULT NULL,
  `service_name` varchar(220) DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` varchar(5) NOT NULL,
  `visit_type` enum('new','follow_up','online') NOT NULL DEFAULT 'new',
  `notes` text DEFAULT NULL,
  `source` varchar(120) DEFAULT NULL,
  `coupon_id` int(10) unsigned DEFAULT NULL,
  `coupon_code` varchar(40) DEFAULT NULL,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `amount_estimate` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','rescheduled','completed','cancelled','no_show') NOT NULL DEFAULT 'pending',
  `cancel_reason` varchar(255) DEFAULT NULL,
  `assigned_to` int(10) unsigned DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `appointment_no` (`appointment_no`),
  KEY `idx_appt_date` (`appointment_date`,`clinic_id`,`status`),
  KEY `idx_appt_status` (`status`,`created_at`),
  KEY `idx_appt_phone` (`phone`),
  KEY `fk_appt_clinic` (`clinic_id`),
  KEY `fk_appt_doctor` (`doctor_id`),
  KEY `fk_appt_treatment` (`treatment_id`),
  KEY `fk_appt_coupon` (`coupon_id`),
  KEY `fk_appt_user` (`assigned_to`),
  CONSTRAINT `fk_appt_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `sid_clinics` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_appt_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `sid_coupons` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_appt_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `sid_doctors` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_appt_treatment` FOREIGN KEY (`treatment_id`) REFERENCES `sid_treatments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_appt_user` FOREIGN KEY (`assigned_to`) REFERENCES `sid_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_appointments`
--

LOCK TABLES `sid_appointments` WRITE;
/*!40000 ALTER TABLE `sid_appointments` DISABLE KEYS */;
INSERT INTO `sid_appointments` VALUES (1,'SKF-APP-1001','Pooja Verma','+91 9876543210','pooja.verma@example.com','Female',28,NULL,NULL,NULL,'Full Body Laser Hair Reduction','2026-11-05','11:30','new','Patch test requested before full session.','website_modal',NULL,'DERMA10',1699.00,15300.00,'confirmed',NULL,NULL,NULL,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(3,'SKF-APP-1002','Vikram Mehta','+91 9811223344','vikram.m@example.com','Male',34,1,1,NULL,'GFC Hair Restoration','2026-11-06','15:00','new','Doctor confirmed for Dr. Ipshita Johri','quick_book',NULL,'DERMA10',500.00,5999.00,'confirmed',NULL,NULL,NULL,'2026-10-26 18:07:16','2026-10-27 02:34:06'),(4,'SKF-552387','Ananya Verma','9876543210','ananya@example.com','Female',30,NULL,1,NULL,'US-FDA Soprano Titanium Laser Hair Removal','2026-10-28','11:30','new','Verified test appointment booking','website-form',NULL,NULL,0.00,NULL,'pending',NULL,NULL,'::1','2026-10-26 18:32:32','2026-10-26 18:32:32');
/*!40000 ALTER TABLE `sid_appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_audit_logs`
--

DROP TABLE IF EXISTS `sid_audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_audit_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `user_name` varchar(120) DEFAULT NULL,
  `action` varchar(40) NOT NULL,
  `entity` varchar(60) NOT NULL,
  `entity_id` varchar(40) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `ip` varchar(64) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_audit_entity` (`entity`,`entity_id`),
  KEY `idx_audit_user` (`user_id`),
  KEY `idx_audit_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_audit_logs`
--

LOCK TABLES `sid_audit_logs` WRITE;
/*!40000 ALTER TABLE `sid_audit_logs` DISABLE KEYS */;
INSERT INTO `sid_audit_logs` VALUES (1,1,'Dr. Ipshita Johri (Founder)','login','auth','1','Staff login: Dr. Ipshita Johri (Founder) (Super Admin)',NULL,'::1','2026-10-26 18:10:59'),(2,1,'Dr. Ipshita Johri (Founder)','login','auth','1','Staff login: Dr. Ipshita Johri (Founder) (Super Admin)',NULL,'::1','2026-10-26 18:32:51'),(3,5,'Reception & Patient Coordinator','login','auth','5','Staff login: Reception & Patient Coordinator (Front Desk)',NULL,'::1','2026-10-26 18:32:56'),(4,5,'Reception & Patient Coordinator','login','auth','5','Staff login: Reception & Patient Coordinator (Front Desk)',NULL,'::1','2026-10-26 18:33:01'),(5,1,'Dr. Ipshita Johri (Founder)','login','auth','1','Staff login: Dr. Ipshita Johri (Founder) (Super Admin)',NULL,'::1','2026-10-26 18:33:07'),(6,1,'Dr. Ipshita Johri (Founder)','login','auth','1','Staff login: Dr. Ipshita Johri (Founder) (Super Admin)',NULL,'::1','2026-10-26 18:33:48'),(7,1,'Dr. Ipshita Johri (Founder)','login','auth','1','Staff login: Dr. Ipshita Johri (Founder) (Super Admin)',NULL,'::1','2026-10-26 18:33:53'),(8,1,'Dr. Ipshita Johri (Founder)','login','auth','1','Staff login: Dr. Ipshita Johri (Founder) (Super Admin)',NULL,'::1','2026-10-26 18:36:10'),(9,2,'Clinic Operations Admin','login','auth','2','Staff login: Clinic Operations Admin (Admin)',NULL,'::1','2026-10-26 18:42:43'),(10,1,'Dr. Ipshita Johri (Founder)','login','auth','1','Staff login: Dr. Ipshita Johri (Founder) (Super Admin)',NULL,'::1','2026-10-26 19:13:28'),(11,1,'Dr. Ipshita Johri (Founder)','status','coupons','2','Deactivated coupon SKIN10',NULL,'::1','2026-10-26 19:15:21'),(12,1,'Dr. Ipshita Johri (Founder)','status','coupons','2','Activated coupon SKIN10',NULL,'::1','2026-10-26 19:15:24'),(13,1,'Dr. Ipshita Johri (Founder)','login','auth','1','Staff login: Dr. Ipshita Johri (Founder) (Super Admin)',NULL,'::1','2026-10-27 02:33:58'),(14,1,'Dr. Ipshita Johri (Founder)','login','auth','1','Staff login: Dr. Ipshita Johri (Founder) (Super Admin)',NULL,'::1','2026-10-27 02:34:06'),(15,1,'Dr. Ipshita Johri (Founder)','update','appointments','3','Updated appointment details for SKF-APP-1002',NULL,'::1','2026-10-27 02:34:06'),(16,1,'Dr. Ipshita Johri (Founder)','login','auth','1','Staff login: Dr. Ipshita Johri (Founder) (Super Admin)',NULL,'::1','2026-10-27 02:34:14'),(17,1,'Dr. Ipshita Johri (Founder)','login','auth','1','Staff login: Dr. Ipshita Johri (Founder) (Super Admin)',NULL,'::1','2026-10-27 02:34:21'),(18,1,'Dr. Ipshita Johri (Founder)','login','auth','1','Staff login: Dr. Ipshita Johri (Founder) (Super Admin)',NULL,'::1','2026-10-27 02:35:02');
/*!40000 ALTER TABLE `sid_audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_banners`
--

DROP TABLE IF EXISTS `sid_banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_banners` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(500) DEFAULT NULL,
  `desktop_image` varchar(500) DEFAULT NULL,
  `mobile_image` varchar(500) DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `button_text` varchar(80) DEFAULT NULL,
  `button_url` varchar(500) DEFAULT NULL,
  `location` varchar(60) NOT NULL DEFAULT 'Homepage Hero',
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `starts_at` date DEFAULT NULL,
  `ends_at` date DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_banners_loc` (`location`,`is_active`,`display_order`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_banners`
--

LOCK TABLES `sid_banners` WRITE;
/*!40000 ALTER TABLE `sid_banners` DISABLE KEYS */;
INSERT INTO `sid_banners` VALUES (1,'Meet The Skinfinity Derma Team - Delhi NCR\'s Most Trusted Dermatologists','Consult directly with Dr. Ipshita Johri and our certified senior clinical dermatologists.','/images/banners/team-banner-desktop.png','/images/banners/team-banner-mobile.png','Meet The Skinfinity Derma Team - Delhi NCR\'s Most Trusted Dermatologists','About Our Doctors','/about-us','Homepage Hero',NULL,NULL,NULL,1,1,'2026-10-26 18:46:50','2026-10-26 18:46:50'),(2,'Tired of shaving & waxing before every occasion? Laser Hair Reduction package at ?39,999/-','Smooth-looking skin, long-term hair reduction, dermatologist-led treatment.','/images/banners/laser-banner-desktop.png','/images/banners/laser-banner-mobile.png','Laser Hair Reduction package at ?39,999/- at Skinfinity Derma','Claim Laser Package','/laser-hair-reduction-noida','Homepage Hero',NULL,NULL,NULL,2,1,'2026-10-26 18:46:50','2026-10-26 18:46:50');
/*!40000 ALTER TABLE `sid_banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_before_after_cases`
--

DROP TABLE IF EXISTS `sid_before_after_cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_before_after_cases` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `legacy_id` varchar(80) DEFAULT NULL,
  `patient_name` varchar(120) DEFAULT NULL,
  `treatment` varchar(220) NOT NULL,
  `treatment_id` int(10) unsigned DEFAULT NULL,
  `description` text DEFAULT NULL,
  `before_image` varchar(500) DEFAULT NULL,
  `after_image` varchar(500) NOT NULL,
  `results_type` varchar(100) DEFAULT NULL,
  `timeframe` varchar(100) DEFAULT NULL,
  `has_patient_consent` tinyint(1) NOT NULL DEFAULT 0,
  `approval_status` enum('Pending','Approved','Restricted') NOT NULL DEFAULT 'Pending',
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ba_legacy` (`legacy_id`),
  KEY `fk_ba_treatment` (`treatment_id`),
  CONSTRAINT `fk_ba_treatment` FOREIGN KEY (`treatment_id`) REFERENCES `sid_treatments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_before_after_cases`
--

LOCK TABLES `sid_before_after_cases` WRITE;
/*!40000 ALTER TABLE `sid_before_after_cases` DISABLE KEYS */;
INSERT INTO `sid_before_after_cases` VALUES (1,'result-1','Patient A','Acne Scar Revision & Skin Clarity',1,'Significant reduction in deep acne scar craters and post-inflammatory pigmentation after 4 sessions of MNRF and targeted peels.','/images/results/acne-before.jpg','/images/results/acne-after.jpg','Acne & Scars','3 Months (4 Sessions)',1,'Approved',1,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(2,'result-2','Patient B','GFC Hair Density Restoration',NULL,'Notable reversal of crown hair thinning and thicker follicular density over 4 GFC sessions.','/images/results/hair-before.jpg','/images/results/hair-after.jpg','Hair Restoration','4 Months (4 Sessions)',1,'Approved',2,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(3,'result-3','Patient C','Dermal Melasma & Sun Damage Clearance',NULL,'80% clearance of stubborn melasma and pigmentation with Q-Switched laser toning and medical depigmentation therapy.','/images/results/pigmentation-before.jpg','/images/results/pigmentation-after.jpg','Pigmentation','8 Weeks (3 Sessions)',1,'Approved',3,1,'2026-10-26 18:07:04','2026-10-26 18:07:04');
/*!40000 ALTER TABLE `sid_before_after_cases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_categories`
--

DROP TABLE IF EXISTS `sid_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` varchar(500) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_categories`
--

LOCK TABLES `sid_categories` WRITE;
/*!40000 ALTER TABLE `sid_categories` DISABLE KEYS */;
INSERT INTO `sid_categories` VALUES (1,'Laser Hair Reduction','laser-hair-reduction','Pain-free permanent hair reduction with US-FDA Soprano Titanium','/images/treatments/banner-laser.webp',NULL,NULL,1,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(2,'Medi-Facials & Glow','medi-facials-and-glow','Doctor-formulated clinical facials, HydraFacial MD & peel infusions','/images/treatments/banner-hydrafacial.webp',NULL,NULL,2,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(3,'Acne & Scar Revision','acne-and-scar-revision','Targeted MNRF, subcision, CO2 laser and medical peel protocols','/images/treatments/banner-acne.webp',NULL,NULL,3,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(4,'Pigmentation & Lasers','pigmentation-and-lasers','Q-Switched & Picosecond laser therapies for melasma, freckles & dark spots','/images/treatments/banner-pigmentation.webp',NULL,NULL,4,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(5,'Hair Restoration','hair-restoration','GFC, PRP and regenerative scalp stimulation therapies for hair fall','/images/treatments/banner-hair.webp',NULL,NULL,5,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(6,'Anti-Ageing & Contouring','anti-ageing-and-contouring','Botox, dermal fillers, Morpheus8 RF and skin tightening treatments','/images/treatments/banner-antiaging.webp',NULL,NULL,6,1,'2026-10-26 18:07:04','2026-10-26 18:07:04');
/*!40000 ALTER TABLE `sid_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_clinics`
--

DROP TABLE IF EXISTS `sid_clinics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_clinics` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) NOT NULL,
  `city` varchar(80) NOT NULL,
  `title` varchar(190) NOT NULL,
  `address` varchar(300) NOT NULL,
  `landmark` varchar(200) DEFAULT NULL,
  `pincode` varchar(12) DEFAULT NULL,
  `phones` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`phones`)),
  `email` varchar(190) DEFAULT NULL,
  `whatsapp` varchar(30) DEFAULT NULL,
  `hours` varchar(190) DEFAULT NULL,
  `map_embed_url` text DEFAULT NULL,
  `map_link` varchar(500) DEFAULT NULL,
  `highlights` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`highlights`)),
  `image` varchar(500) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `slot_start` varchar(5) NOT NULL DEFAULT '10:00',
  `slot_end` varchar(5) NOT NULL DEFAULT '20:00',
  `slot_minutes` smallint(5) unsigned NOT NULL DEFAULT 30,
  `slot_capacity` smallint(5) unsigned NOT NULL DEFAULT 2,
  `weekly_off` varchar(40) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_clinics`
--

LOCK TABLES `sid_clinics` WRITE;
/*!40000 ALTER TABLE `sid_clinics` DISABLE KEYS */;
INSERT INTO `sid_clinics` VALUES (1,'noida-sector-36','Noida','Skinfinity Derma — Noida Clinic (HQ)','Basement Floor, House B1, Sector 36','Near Logix City Centre Mall & Wave City Center Metro','201303','[\"+91 9871941444\",\"+91 8929765785\"]','skinfinityderma@gmail.com','+91 9871941444','Mon - Sun: 10:00 AM – 08:00 PM','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.9449753!2d77.3473269149!3d28.5714399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a555555555%3A0x1017377320914!2sSkinfinity%20Derma%20Noida!5e0!3m2!1sen!2sin!4v166313','https://maps.google.com/?q=Skinfinity+Derma+Noida','[\"2 Min Walk from Metro\",\"In-House Diagnostic Lab & Pharmacy\",\"Full MD Dermatologist Team On-Site\"]','/images/clinic/interior-1.jpg',28.5714399,77.3473269,'10:00','20:00',30,2,NULL,1,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(2,'gurgaon-golf-course-road','Gurgaon','Skinfinity Derma — Gurgaon Clinic','2nd Floor, SP1, Sector 28, Golf Course Road','Opposite Mega Mall & Near Phase 1 Metro','122002','[\"+91 8591110110\",\"+91 9871941444\"]','skinfinityderma@gmail.com','+91 8591110110','Mon - Sun: 10:00 AM – 08:00 PM','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.2891!2d77.0987!3d28.4721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI4JzE5LjYiTiA3N8KwMDUnNTUuMyJF!5e0!3m2!1sen!2sin!4v166313','https://maps.google.com/?q=Skinfinity+Derma+Gurgaon','[\"Prime Golf Course Road Location\",\"Valet Parking Available\",\"Private Executive Procedure Suites\"]','/images/clinic/interior-2.jpg',28.4721000,77.0987000,'10:00','20:00',30,2,NULL,2,1,'2026-10-26 18:07:04','2026-10-26 18:07:04');
/*!40000 ALTER TABLE `sid_clinics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_concerns`
--

DROP TABLE IF EXISTS `sid_concerns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_concerns` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_concerns`
--

LOCK TABLES `sid_concerns` WRITE;
/*!40000 ALTER TABLE `sid_concerns` DISABLE KEYS */;
INSERT INTO `sid_concerns` VALUES (1,'Acne & Pimples','acne-pimples','Active cystic breakouts, hormonal acne, blackheads & whiteheads','/images/results/acne-before.jpg',1,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(2,'Acne Scars','acne-scars','Deep boxcar, rolling and ice-pick atrophic acne scars','/images/results/acne-after.jpg',2,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(3,'Pigmentation & Melasma','pigmentation-melasma','Stubborn dark spots, tanning, sun damage and hyperpigmentation','/images/results/pigmentation-after.jpg',3,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(4,'Hair Fall & Thinning','hair-fall-thinning','Excessive hair shedding, receding hairline and low scalp density','/images/results/hair-after.jpg',4,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(5,'Fine Lines & Wrinkles','fine-lines-wrinkles','Forehead lines, crow\'s feet, sagging skin and loss of volume','/images/treatments/banner-antiaging.webp',5,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(6,'Unwanted Body Hair','unwanted-hair','Facial and body hair removal for smooth, ingrown-free skin','/images/treatments/banner-laser.webp',6,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(7,'Skin Dullness & Open Pores','dullness-open-pores','Enlarged pores, congestion, dead skin buildup and lackluster complexion','/images/treatments/banner-hydrafacial.webp',7,1,'2026-10-26 18:07:04','2026-10-26 18:07:04');
/*!40000 ALTER TABLE `sid_concerns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_content_blocks`
--

DROP TABLE IF EXISTS `sid_content_blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_content_blocks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `block_key` varchar(120) NOT NULL,
  `title` varchar(190) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`content`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `block_key` (`block_key`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_content_blocks`
--

LOCK TABLES `sid_content_blocks` WRITE;
/*!40000 ALTER TABLE `sid_content_blocks` DISABLE KEYS */;
INSERT INTO `sid_content_blocks` VALUES (1,'home.brand_journey','Brand Journey Milestones','Timeline of Skinfinity Derma clinic excellence since inception','[{\"year\":\"2017\",\"title\":\"The Genesis\",\"description\":\"Founded by Dr. Ipshita Johri in Noida with a focus on holistic, results-oriented clinical care.\",\"color\":\"from-brand-700 to-teal-600\",\"badge\":\"Foundation\",\"image\":\"/images/journey/journey-2017.jpg\"},{\"year\":\"2019\",\"title\":\"Technology Upgrade\",\"description\":\"Introduced US-FDA approved Soprano Titanium laser and authentic HydraFacial MD systems.\",\"color\":\"from-teal-600 to-emerald-600\",\"badge\":\"Innovation\",\"image\":\"/images/journey/journey-2019.jpg\"},{\"year\":\"2022\",\"title\":\"Gurgaon Flagship\",\"description\":\"Launched state-of-the-art clinic center on Golf Course Road, Gurugram.\",\"color\":\"from-emerald-600 to-teal-700\",\"badge\":\"Expansion\",\"image\":\"/images/journey/journey-2022.jpg\"},{\"year\":\"2026\",\"title\":\"1,00,000+ Happy Patients\",\"description\":\"Crossed landmark milestone of 1,00,000 satisfied patient journeys across Delhi-NCR.\",\"color\":\"from-brand-800 to-teal-900\",\"badge\":\"Milestone\",\"image\":\"/images/journey/journey-2024.jpg\"}]',1,NULL,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(2,'home.top_treatments','Top 25 Curated Treatments','Quick links list featured in the services and footer sections','[\"Acne & Pimple Treatment\",\"Acne Scar Subcision\",\"Full Body Laser Hair Reduction\",\"HydraFacial MD Glass Glow\",\"GFC Hair Regrowth Therapy\",\"Chemical Peels\",\"Q-Switched Pigmentation Laser\",\"Dermal Fillers & Botox\",\"Morpheus8 MNRF Tightening\",\"Glutathione Radiance Drip\",\"Beard Shaping Laser for Men\",\"Tattoo Removal Laser\"]',1,NULL,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(3,'home.franchise_overview','Franchise Partner Overview','Franchise stats and investment model overview for entrepreneurs','{\"brandStats\":{\"experience\":\"10+ Years\",\"patients\":\"1,00,000+\",\"reviews\":\"4,500+ (4.5 ★)\",\"clinics\":\"Flagship Centers in Noida & Gurgaon\",\"investmentRange\":\"₹1.5 crore – ₹2 crore\"},\"headline\":\"Partner with India’s Fastest Growing Doctor-Led Dermatology Brand\",\"subheadline\":\"High ROI, turnkey setup, doctor recruitment support, and centralized marketing drive.\"}',1,NULL,'2026-10-26 18:07:16','2026-10-26 18:07:16');
/*!40000 ALTER TABLE `sid_content_blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_coupon_categories`
--

DROP TABLE IF EXISTS `sid_coupon_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_coupon_categories` (
  `coupon_id` int(10) unsigned NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`coupon_id`,`category_id`),
  KEY `fk_cc_category` (`category_id`),
  CONSTRAINT `fk_cc_category` FOREIGN KEY (`category_id`) REFERENCES `sid_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cc_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `sid_coupons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_coupon_categories`
--

LOCK TABLES `sid_coupon_categories` WRITE;
/*!40000 ALTER TABLE `sid_coupon_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `sid_coupon_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_coupon_redemptions`
--

DROP TABLE IF EXISTS `sid_coupon_redemptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_coupon_redemptions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `coupon_id` int(10) unsigned NOT NULL,
  `appointment_id` int(10) unsigned DEFAULT NULL,
  `customer_phone` varchar(30) DEFAULT NULL,
  `customer_email` varchar(190) DEFAULT NULL,
  `order_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_red_coupon` (`coupon_id`,`created_at`),
  KEY `fk_red_appt` (`appointment_id`),
  CONSTRAINT `fk_red_appt` FOREIGN KEY (`appointment_id`) REFERENCES `sid_appointments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_red_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `sid_coupons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_coupon_redemptions`
--

LOCK TABLES `sid_coupon_redemptions` WRITE;
/*!40000 ALTER TABLE `sid_coupon_redemptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sid_coupon_redemptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_coupon_treatments`
--

DROP TABLE IF EXISTS `sid_coupon_treatments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_coupon_treatments` (
  `coupon_id` int(10) unsigned NOT NULL,
  `treatment_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`coupon_id`,`treatment_id`),
  KEY `fk_ct_treatment` (`treatment_id`),
  CONSTRAINT `fk_ct_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `sid_coupons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ct_treatment` FOREIGN KEY (`treatment_id`) REFERENCES `sid_treatments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_coupon_treatments`
--

LOCK TABLES `sid_coupon_treatments` WRITE;
/*!40000 ALTER TABLE `sid_coupon_treatments` DISABLE KEYS */;
INSERT INTO `sid_coupon_treatments` VALUES (4,1),(5,2);
/*!40000 ALTER TABLE `sid_coupon_treatments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_coupons`
--

DROP TABLE IF EXISTS `sid_coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_coupons` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(40) NOT NULL,
  `title` varchar(190) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `discount_type` enum('percent','flat') NOT NULL DEFAULT 'percent',
  `discount_value` decimal(10,2) NOT NULL DEFAULT 0.00,
  `max_discount` decimal(10,2) DEFAULT NULL,
  `min_order` decimal(10,2) NOT NULL DEFAULT 0.00,
  `applies_to` enum('all','treatments','categories') NOT NULL DEFAULT 'all',
  `usage_limit` int(10) unsigned DEFAULT NULL,
  `used_count` int(10) unsigned NOT NULL DEFAULT 0,
  `valid_from` date DEFAULT NULL,
  `valid_to` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_coupons`
--

LOCK TABLES `sid_coupons` WRITE;
/*!40000 ALTER TABLE `sid_coupons` DISABLE KEYS */;
INSERT INTO `sid_coupons` VALUES (1,'DERMA10','10% Clinical Discount','Get 10% discount on all dermatologist treatments and clinical facials.','percent',10.00,2500.00,1000.00,'all',1000,0,NULL,NULL,1,NULL,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(2,'SKIN10','10% Off Skin Therapies','Applicable on HydraFacials, Chemical Peels, and Pigmentation lasers.','percent',10.00,2000.00,2000.00,'categories',NULL,0,NULL,NULL,1,NULL,'2026-10-26 18:07:04','2026-10-26 19:15:24'),(3,'VIP20','20% VIP Club Privilege','20% discount on total booking value above ₹10,000.','percent',20.00,5000.00,10000.00,'all',500,0,NULL,NULL,1,NULL,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(4,'LASER30','30% Off Laser Hair Reduction','Exclusive 30% savings on Soprano Titanium Full Body Laser packages.','percent',30.00,15000.00,15000.00,'treatments',NULL,0,NULL,NULL,1,NULL,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(5,'GLOW500','Flat ₹500 Off HydraFacial','Flat ₹500 discount on your first Signature Sugarcane HydraFacial MD session.','flat',500.00,NULL,3000.00,'treatments',NULL,0,NULL,NULL,1,NULL,'2026-10-26 18:07:04','2026-10-26 18:07:04');
/*!40000 ALTER TABLE `sid_coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_doctors`
--

DROP TABLE IF EXISTS `sid_doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_doctors` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(150) NOT NULL,
  `name` varchar(150) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `qualifications` varchar(500) DEFAULT NULL,
  `specialty` varchar(500) DEFAULT NULL,
  `experience` varchar(100) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `consultation_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `available_locations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`available_locations`)),
  `availability` varchar(255) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_doctors`
--

LOCK TABLES `sid_doctors` WRITE;
/*!40000 ALTER TABLE `sid_doctors` DISABLE KEYS */;
INSERT INTO `sid_doctors` VALUES (1,'dr-ipshita-johri','Dr. Ipshita Johri','Founder, Medical Director & Chief Dermatologist','MBBS, DDV | PG Dip. Clinical Dermatology (Cardiff University, U.K.)','Celebrity Dermatologist, Advanced Anti-Ageing, Facial Sculpting & Aesthetic Lasers','12+ Years Clinical Experience','/images/doctors/dr-ipshita-johri.jpg','Dr. Ipshita Johri is the visionary founder and medical director of Skinfinity Derma clinics in Noida and Gurgaon. An internationally trained clinical dermatologist holding prestigious credentials from Cardiff University UK, she is renowned for her holistic, root-cause aesthetic medical approach.',1200.00,'[\"Noida\",\"Gurgaon\"]','Mon, Wed, Fri, Sat (10:00 AM - 07:00 PM)',1,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(2,'dr-sukriti-agarwal','Dr. Sukriti Agarwal','Senior Consultant Dermatologist & Trichologist','MBBS, MD - Dermatology, Venereology & Leprosy','Acne Scar Subcision, Chemical Peels, Melasma Revision & Laser Hair Reduction','8+ Years Clinical Experience','/images/doctors/dr-sukriti-agarwal.jpg','Dr. Sukriti Agarwal is an acclaimed board-certified MD dermatologist specializing in clinical dermatology, medical trichology and scar revision protocols.',1000.00,'[\"Noida\"]','Mon - Sat (10:30 AM - 06:30 PM)',2,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(3,'dr-anchal-bansal','Dr. Anchal Bansal','Consultant Dermatologist & Aesthetic Physician','MBBS, DNB - Dermatology & Venereology','Medi-Facials, Anti-Ageing Injectables, Skin Glow Therapies & Hair Restoration','7+ Years Clinical Experience','/images/doctors/dr-anchal-bansal.jpg','Dr. Anchal Bansal brings extensive expertise in modern aesthetic procedures, precision laser protocols, and non-invasive facial rejuvenation.',1000.00,'[\"Gurgaon\"]','Tue, Thu, Sat, Sun (11:00 AM - 07:30 PM)',3,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(4,'dr-neha-sharma','Dr. Neha Sharma','Consultant Aesthetic Physician','MBBS, FAM (Fellowship in Aesthetic Medicine)','Laser Hair Reduction, Pigmentation Resurfacing & Body Contouring','6+ Years Clinical Experience','/images/doctors/dr-neha-sharma.jpg','Dr. Neha specializes in clinical laser procedures with custom wavelengths calibrated for diverse Indian Fitzpatrick skin types.',900.00,'[\"Noida\"]','Mon - Fri (10:00 AM - 06:00 PM)',4,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(5,'dr-shradha-saxena','Dr. Shradha Saxena','Senior Trichology & Regenerative Hair Specialist','MBBS, Fellowship in Hair Restoration & Regenerative Medicine','GFC / PRP Therapy, Female Pattern Thinning, Alopecia Areata & Scalp Health','7+ Years Experience','/images/doctors/dr-shradha.jpg','Specialist in growth-factor hair regeneration and personalized clinical scalp therapies with high success rates.',1000.00,'[\"Gurgaon\",\"Noida\"]','Wed - Sun (11:00 AM - 07:00 PM)',5,1,'2026-10-26 18:07:04','2026-10-26 18:07:04');
/*!40000 ALTER TABLE `sid_doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_enquiries`
--

DROP TABLE IF EXISTS `sid_enquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_enquiries` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `enquiry_no` varchar(24) DEFAULT NULL,
  `type` enum('contact','appointment_callback','emi','franchise','membership','skin_analysis','hair_graft','laser_estimate','other') NOT NULL DEFAULT 'contact',
  `name` varchar(150) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(190) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `treatment_id` int(10) unsigned DEFAULT NULL,
  `treatment_name` varchar(220) DEFAULT NULL,
  `clinic_id` int(10) unsigned DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `extra` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extra`)),
  `status` enum('new','contacted','qualified','converted','closed','spam') NOT NULL DEFAULT 'new',
  `priority` enum('low','normal','high') NOT NULL DEFAULT 'normal',
  `assigned_to` int(10) unsigned DEFAULT NULL,
  `follow_up_at` datetime DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `enquiry_no` (`enquiry_no`),
  KEY `idx_enq_status` (`status`,`created_at`),
  KEY `idx_enq_type` (`type`),
  KEY `idx_enq_phone` (`phone`),
  KEY `fk_enq_treatment` (`treatment_id`),
  KEY `fk_enq_clinic` (`clinic_id`),
  KEY `fk_enq_user` (`assigned_to`),
  CONSTRAINT `fk_enq_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `sid_clinics` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_enq_treatment` FOREIGN KEY (`treatment_id`) REFERENCES `sid_treatments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_enq_user` FOREIGN KEY (`assigned_to`) REFERENCES `sid_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_enquiries`
--

LOCK TABLES `sid_enquiries` WRITE;
/*!40000 ALTER TABLE `sid_enquiries` DISABLE KEYS */;
INSERT INTO `sid_enquiries` VALUES (1,'ENQ-2026-001','franchise','Sunil Choudhary','+91 9822334455','sunil.c@investgroup.in','Chandigarh','FICO Franchise Model Inquiry','Looking to invest ₹1.8 Crore for a franchise clinic in Tricity region with prime commercial space available.',NULL,NULL,NULL,'franchise_page',NULL,'qualified','high',NULL,NULL,NULL,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(2,'ENQ-2026-002','emi','Ritu Sen','+91 9833445566','ritu.sen@gmail.com','Noida','6-Month Zero Cost EMI for Laser Package','Requested pre-approval for ₹39,999 laser hair reduction package on Bajaj Finserv.',NULL,NULL,NULL,'emi_modal',NULL,'contacted','normal',NULL,NULL,NULL,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(3,'ENQ-2026-003','contact','Ananya Roy','+91 9844556677','ananya.roy@example.com','Gurgaon','Doctor Consultation Callback','Need urgent appointment with Dr. Ipshita for hormonal adult cystic acne breakout.',NULL,NULL,NULL,'contact_page',NULL,'new','high',NULL,NULL,NULL,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(4,'ENQ-557417','franchise','Sameer Khanna','9811223344','sameer@example.com','Delhi NCR',NULL,'Interested in FICO model with 2 Cr net worth',NULL,NULL,NULL,'website',NULL,'new','normal',NULL,NULL,'::1','2026-10-26 18:32:37','2026-10-26 18:32:37');
/*!40000 ALTER TABLE `sid_enquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_faqs`
--

DROP TABLE IF EXISTS `sid_faqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_faqs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `scope` varchar(80) NOT NULL DEFAULT 'general',
  `question` varchar(500) NOT NULL,
  `answer` text NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_faqs_scope` (`scope`,`is_active`,`display_order`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_faqs`
--

LOCK TABLES `sid_faqs` WRITE;
/*!40000 ALTER TABLE `sid_faqs` DISABLE KEYS */;
INSERT INTO `sid_faqs` VALUES (1,'home','Why choose Skinfinity Derma over commercial salons or beauty clinics?','At Skinfinity Derma, all consultations, laser settings, and clinical procedures are directly diagnosed and supervised by board-certified MD Dermatologists utilizing authentic US-FDA approved technologies in hospital-grade sterile environments.',1,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(2,'home','Is laser hair reduction permanent and safe for Indian skin?','Yes. We utilize the Soprano Titanium triple-wavelength system with integrated -4°C sapphire contact cooling, specifically calibrated to treat melanin-rich Indian Fitzpatrick skin tones safely without burns or rebound hyperpigmentation.',2,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(3,'home','Do you offer No-Cost EMI options for treatment packages?','Yes! We provide 0% interest No-Cost EMI options for 3, 6, and 9 months through our financial partners with instant paperless digital approval.',3,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(4,'home','How do I book an appointment with Dr. Ipshita Johri?','You can book directly through our online appointment portal, call our helpline at +91 9871941444, or WhatsApp our patient care desk for immediate slot confirmation.',4,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(5,'home','Why choose Skinfinity Derma over commercial salons or beauty clinics?','At Skinfinity Derma, all consultations, laser settings, and clinical procedures are directly diagnosed and supervised by board-certified MD Dermatologists utilizing authentic US-FDA approved technologies in hospital-grade sterile environments.',1,1,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(6,'home','Is laser hair reduction permanent and safe for Indian skin?','Yes. We utilize the Soprano Titanium triple-wavelength system with integrated -4°C sapphire contact cooling, specifically calibrated to treat melanin-rich Indian Fitzpatrick skin tones safely without burns or rebound hyperpigmentation.',2,1,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(7,'home','Do you offer No-Cost EMI options for treatment packages?','Yes! We provide 0% interest No-Cost EMI options for 3, 6, and 9 months through our financial partners with instant paperless digital approval.',3,1,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(8,'home','How do I book an appointment with Dr. Ipshita Johri?','You can book directly through our online appointment portal, call our helpline at +91 9871941444, or WhatsApp our patient care desk for immediate slot confirmation.',4,1,'2026-10-26 18:07:16','2026-10-26 18:07:16');
/*!40000 ALTER TABLE `sid_faqs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_gallery_items`
--

DROP TABLE IF EXISTS `sid_gallery_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_gallery_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `image` varchar(500) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `treatment_id` int(10) unsigned DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_gallery_treatment` (`treatment_id`),
  CONSTRAINT `fk_gallery_treatment` FOREIGN KEY (`treatment_id`) REFERENCES `sid_treatments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_gallery_items`
--

LOCK TABLES `sid_gallery_items` WRITE;
/*!40000 ALTER TABLE `sid_gallery_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `sid_gallery_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_lead_notes`
--

DROP TABLE IF EXISTS `sid_lead_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_lead_notes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `entity_type` enum('enquiry','appointment') NOT NULL,
  `entity_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `user_name` varchar(120) DEFAULT NULL,
  `note` text NOT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_notes_entity` (`entity_type`,`entity_id`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_lead_notes`
--

LOCK TABLES `sid_lead_notes` WRITE;
/*!40000 ALTER TABLE `sid_lead_notes` DISABLE KEYS */;
INSERT INTO `sid_lead_notes` VALUES (1,'appointment',3,1,'Dr. Ipshita Johri (Founder)','Doctor confirmed for Dr. Ipshita Johri',0,'2026-10-27 02:34:06');
/*!40000 ALTER TABLE `sid_lead_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_media_files`
--

DROP TABLE IF EXISTS `sid_media_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_media_files` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `url` varchar(500) NOT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `size_bytes` int(10) unsigned NOT NULL DEFAULT 0,
  `width` int(10) unsigned DEFAULT NULL,
  `height` int(10) unsigned DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `uploaded_by` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_media_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_media_files`
--

LOCK TABLES `sid_media_files` WRITE;
/*!40000 ALTER TABLE `sid_media_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `sid_media_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_membership_plans`
--

DROP TABLE IF EXISTS `sid_membership_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_membership_plans` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(100) NOT NULL,
  `name` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `price_formatted` varchar(50) NOT NULL,
  `period` varchar(50) NOT NULL DEFAULT '/ year',
  `validity` varchar(100) NOT NULL DEFAULT '12 Months Validity',
  `tagline` varchar(255) DEFAULT NULL,
  `is_popular` tinyint(1) DEFAULT 0,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`features`)),
  `card_bg` varchar(255) DEFAULT NULL,
  `pass_gradient` varchar(255) DEFAULT NULL,
  `badge_style` varchar(255) DEFAULT NULL,
  `button_style` varchar(255) DEFAULT NULL,
  `accent_text` varchar(100) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `subscribers_count` int(11) DEFAULT 18,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_membership_plans`
--

LOCK TABLES `sid_membership_plans` WRITE;
/*!40000 ALTER TABLE `sid_membership_plans` DISABLE KEYS */;
INSERT INTO `sid_membership_plans` VALUES (1,'silver','Silver Glow Pass',9999.00,'Ôé╣9,999','/ year','12 Months Validity','Essential clinical maintenance for clear, healthy skin.',0,'[\"1 Complimentary Sugarcane HydraFacial\", \"10% Flat Discount on all Laser Hair Removal Packages\", \"10% Discount on Chemical & Organic Peels\", \"Priority Appointment Booking\", \"Complimentary Digital Skin Health Analysis\", \"Annual Dermatology Consultation Pass for Self\"]','bg-gradient-to-br from-slate-50 via-white to-slate-100/80 border-slate-300','from-slate-700 via-slate-600 to-slate-800','bg-slate-200 text-slate-800 border-slate-300','bg-slate-800 hover:bg-slate-900 text-white','text-slate-700',1,1,64,'2026-10-26 19:00:41','2026-10-26 19:00:41'),(2,'gold','Gold Prestige Club',24999.00,'Ôé╣24,999','/ year','12 Months Validity','Our most popular comprehensive aesthetic rejuvenation tier.',1,'[\"3 Complimentary Sugarcane HydraFacials or Laser Toning\", \"15% Flat Discount on all Lasers, Peels & Body Contouring\", \"10% Discount on Dermal Fillers & Botox Injections\", \"Free Consultations for Self + 2 Family Members\", \"Birthday Month Special Glow Treatment Gift\", \"Direct WhatsApp Hotline with Senior Doctor Assistant\", \"Free Home Sample Collection via Orange Health Labs\"]','bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/60 border-amber-400','from-amber-600 via-yellow-500 to-amber-700','bg-amber-500 text-slate-950 border-amber-400','bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black','text-amber-700',2,1,142,'2026-10-26 19:00:41','2026-10-26 19:00:41'),(3,'platinum','Platinum VIP Elite',49999.00,'Ôé╣49,999','/ year','12 Months VIP Concierge Validity','Ultimate luxury bespoke medical aesthetics & concierge care.',0,'[\"6 Complimentary Signature Medi-Facials / Laser Glow Sessions\", \"20% Flat Discount on All Laser & Anti-Ageing Procedures\", \"15% Flat Discount on Botox, Fillers & Profhilo Bio-Remodeling\", \"Unlimited Doctor Consultations Across Noida & Gurgaon\", \"Dedicated Private Treatment Suite Access\", \"Orange Health Comprehensive Skin & Hormone Diagnostic Profile\", \"Complimentary Post-Procedure Barrier Repair Skincare Kit\", \"Invitations to VIP Aesthetic Masterclasses with Our Team of Dermatologists\"]','bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/60 border-[#008081]','from-[#042f2e] via-[#008081] to-emerald-900','bg-[#008081] text-white border-teal-600','bg-gradient-to-r from-[#042f2e] via-[#008081] to-teal-800 hover:opacity-95 text-white','text-[#008081]',3,1,48,'2026-10-26 19:00:41','2026-10-26 19:00:41');
/*!40000 ALTER TABLE `sid_membership_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_menu_items`
--

DROP TABLE IF EXISTS `sid_menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_menu_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `menu_key` varchar(60) NOT NULL,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `label` varchar(150) NOT NULL,
  `url` varchar(500) NOT NULL DEFAULT '#',
  `icon` varchar(80) DEFAULT NULL,
  `badge` varchar(40) DEFAULT NULL,
  `open_in_new_tab` tinyint(1) NOT NULL DEFAULT 0,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_menu_key` (`menu_key`,`parent_id`,`display_order`),
  KEY `fk_menu_parent` (`parent_id`),
  CONSTRAINT `fk_menu_parent` FOREIGN KEY (`parent_id`) REFERENCES `sid_menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_menu_items`
--

LOCK TABLES `sid_menu_items` WRITE;
/*!40000 ALTER TABLE `sid_menu_items` DISABLE KEYS */;
INSERT INTO `sid_menu_items` VALUES (1,'header_main',NULL,'Home','/',NULL,NULL,0,NULL,1,1,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(2,'header_main',NULL,'About Clinic','/about-clinic',NULL,NULL,0,NULL,2,1,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(3,'header_main',NULL,'Treatments','/treatments',NULL,NULL,0,NULL,3,1,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(4,'header_main',NULL,'Doctors','/about-us',NULL,NULL,0,NULL,4,1,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(5,'header_main',NULL,'Real Results','/results',NULL,NULL,0,NULL,5,1,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(6,'header_main',NULL,'Offers','/latest-offer',NULL,'Special',0,NULL,6,1,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(7,'header_main',NULL,'Franchise','/franchise',NULL,NULL,0,NULL,7,1,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(8,'header_main',NULL,'Contact Us','/contact-us',NULL,NULL,0,NULL,8,1,'2026-10-26 18:07:16','2026-10-26 18:07:16');
/*!40000 ALTER TABLE `sid_menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_offer_treatments`
--

DROP TABLE IF EXISTS `sid_offer_treatments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_offer_treatments` (
  `offer_id` int(10) unsigned NOT NULL,
  `treatment_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`offer_id`,`treatment_id`),
  KEY `fk_ot_treatment` (`treatment_id`),
  CONSTRAINT `fk_ot_offer` FOREIGN KEY (`offer_id`) REFERENCES `sid_offers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ot_treatment` FOREIGN KEY (`treatment_id`) REFERENCES `sid_treatments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_offer_treatments`
--

LOCK TABLES `sid_offer_treatments` WRITE;
/*!40000 ALTER TABLE `sid_offer_treatments` DISABLE KEYS */;
/*!40000 ALTER TABLE `sid_offer_treatments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_offers`
--

DROP TABLE IF EXISTS `sid_offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_offers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `legacy_id` varchar(80) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `badge` varchar(80) DEFAULT NULL,
  `description` varchar(600) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `link_text` varchar(80) DEFAULT NULL,
  `slug` varchar(190) DEFAULT NULL,
  `coupon_id` int(10) unsigned DEFAULT NULL,
  `valid_from` date DEFAULT NULL,
  `valid_to` date DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_offers_legacy` (`legacy_id`),
  KEY `fk_offers_coupon` (`coupon_id`),
  CONSTRAINT `fk_offers_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `sid_coupons` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_offers`
--

LOCK TABLES `sid_offers` WRITE;
/*!40000 ALTER TABLE `sid_offers` DISABLE KEYS */;
INSERT INTO `sid_offers` VALUES (1,'offer-1','Free Doctor Skin & Hair Consultation','Limited Period','Comprehensive digital skin analysis and consultation with our senior MD Dermatologists at zero consultation fee.','/images/offers/free-consultation-offer.webp','Claim Consultation','/contact-us',1,NULL,NULL,1,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(2,'offer-2','Full Body Laser Hair Reduction @ 30% OFF','Bestseller','US-FDA Soprano Titanium painless laser hair removal with continuous -4°C contact cooling for full body smoothness.','/images/treatments/banner-laser.webp','View Package','/laser-hair-removal-noida',4,NULL,NULL,2,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(3,'offer-3','Signature Sugarcane HydraFacial MD @ ₹3,499','Instant Glass Glow','7-step clinical hydradermabrasion infusing organic sugarcane AHA, peptides & hyaluronic acid.','/images/treatments/banner-hydrafacial.webp','Book HydraFacial','/sugarcane-hydrafacial-noida',5,NULL,NULL,3,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(4,'offer-4','GFC Regenerative Hair Regrowth Package','Hair Fall Special','3 sessions of advanced growth factor concentrate mesotherapy with complimentary scalp micro-needling.','/images/treatments/banner-hair.webp','Explore Hair Care','/gfc-hair-growth-therapy-noida',1,NULL,NULL,4,1,'2026-10-26 18:07:04','2026-10-26 18:07:04');
/*!40000 ALTER TABLE `sid_offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_permissions`
--

DROP TABLE IF EXISTS `sid_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(80) NOT NULL,
  `module` varchar(50) NOT NULL,
  `action` varchar(30) NOT NULL,
  `label` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_permissions_module` (`module`)
) ENGINE=InnoDB AUTO_INCREMENT=189 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_permissions`
--

LOCK TABLES `sid_permissions` WRITE;
/*!40000 ALTER TABLE `sid_permissions` DISABLE KEYS */;
INSERT INTO `sid_permissions` VALUES (1,'dashboard.view','dashboard','view','View — Dashboard'),(2,'appointments.view','appointments','view','View — Appointments'),(3,'appointments.create','appointments','create','Create — Appointments'),(4,'appointments.edit','appointments','edit','Edit — Appointments'),(5,'appointments.delete','appointments','delete','Delete — Appointments'),(6,'enquiries.view','enquiries','view','View — Enquiries & Leads'),(7,'enquiries.create','enquiries','create','Create — Enquiries & Leads'),(8,'enquiries.edit','enquiries','edit','Edit — Enquiries & Leads'),(9,'enquiries.delete','enquiries','delete','Delete — Enquiries & Leads'),(10,'treatments.view','treatments','view','View — Treatments'),(11,'treatments.create','treatments','create','Create — Treatments'),(12,'treatments.edit','treatments','edit','Edit — Treatments'),(13,'treatments.delete','treatments','delete','Delete — Treatments'),(14,'categories.view','categories','view','View — Treatment Categories'),(15,'categories.create','categories','create','Create — Treatment Categories'),(16,'categories.edit','categories','edit','Edit — Treatment Categories'),(17,'categories.delete','categories','delete','Delete — Treatment Categories'),(18,'concerns.view','concerns','view','View — Skin / Hair Concerns'),(19,'concerns.create','concerns','create','Create — Skin / Hair Concerns'),(20,'concerns.edit','concerns','edit','Edit — Skin / Hair Concerns'),(21,'concerns.delete','concerns','delete','Delete — Skin / Hair Concerns'),(22,'doctors.view','doctors','view','View — Doctors'),(23,'doctors.create','doctors','create','Create — Doctors'),(24,'doctors.edit','doctors','edit','Edit — Doctors'),(25,'doctors.delete','doctors','delete','Delete — Doctors'),(26,'clinics.view','clinics','view','View — Clinics & Branches'),(27,'clinics.create','clinics','create','Create — Clinics & Branches'),(28,'clinics.edit','clinics','edit','Edit — Clinics & Branches'),(29,'clinics.delete','clinics','delete','Delete — Clinics & Branches'),(30,'banners.view','banners','view','View — Hero Banners'),(31,'banners.create','banners','create','Create — Hero Banners'),(32,'banners.edit','banners','edit','Edit — Hero Banners'),(33,'banners.delete','banners','delete','Delete — Hero Banners'),(34,'offers.view','offers','view','View — Offers'),(35,'offers.create','offers','create','Create — Offers'),(36,'offers.edit','offers','edit','Edit — Offers'),(37,'offers.delete','offers','delete','Delete — Offers'),(38,'coupons.view','coupons','view','View — Coupons'),(39,'coupons.create','coupons','create','Create — Coupons'),(40,'coupons.edit','coupons','edit','Edit — Coupons'),(41,'coupons.delete','coupons','delete','Delete — Coupons'),(42,'reviews.view','reviews','view','View — Patient Reviews'),(43,'reviews.create','reviews','create','Create — Patient Reviews'),(44,'reviews.edit','reviews','edit','Edit — Patient Reviews'),(45,'reviews.delete','reviews','delete','Delete — Patient Reviews'),(46,'videos.view','videos','view','View — Videos & Stories'),(47,'videos.create','videos','create','Create — Videos & Stories'),(48,'videos.edit','videos','edit','Edit — Videos & Stories'),(49,'videos.delete','videos','delete','Delete — Videos & Stories'),(50,'before_after.view','before_after','view','View — Before & After Results'),(51,'before_after.create','before_after','create','Create — Before & After Results'),(52,'before_after.edit','before_after','edit','Edit — Before & After Results'),(53,'before_after.delete','before_after','delete','Delete — Before & After Results'),(54,'gallery.view','gallery','view','View — Gallery'),(55,'gallery.create','gallery','create','Create — Gallery'),(56,'gallery.edit','gallery','edit','Edit — Gallery'),(57,'gallery.delete','gallery','delete','Delete — Gallery'),(58,'press.view','press','view','View — Press & Media'),(59,'press.create','press','create','Create — Press & Media'),(60,'press.edit','press','edit','Edit — Press & Media'),(61,'press.delete','press','delete','Delete — Press & Media'),(62,'faqs.view','faqs','view','View — FAQs'),(63,'faqs.create','faqs','create','Create — FAQs'),(64,'faqs.edit','faqs','edit','Edit — FAQs'),(65,'faqs.delete','faqs','delete','Delete — FAQs'),(66,'menus.view','menus','view','View — Menus (Header & Footer)'),(67,'menus.create','menus','create','Create — Menus (Header & Footer)'),(68,'menus.edit','menus','edit','Edit — Menus (Header & Footer)'),(69,'menus.delete','menus','delete','Delete — Menus (Header & Footer)'),(70,'content_blocks.view','content_blocks','view','View — Website Content Blocks'),(71,'content_blocks.create','content_blocks','create','Create — Website Content Blocks'),(72,'content_blocks.edit','content_blocks','edit','Edit — Website Content Blocks'),(73,'content_blocks.delete','content_blocks','delete','Delete — Website Content Blocks'),(74,'seo.view','seo','view','View — SEO Manager'),(75,'seo.create','seo','create','Create — SEO Manager'),(76,'seo.edit','seo','edit','Edit — SEO Manager'),(77,'seo.delete','seo','delete','Delete — SEO Manager'),(78,'media.view','media','view','View — Media Library'),(79,'media.create','media','create','Create — Media Library'),(80,'media.delete','media','delete','Delete — Media Library'),(81,'settings.view','settings','view','View — Site Settings'),(82,'settings.edit','settings','edit','Edit — Site Settings'),(83,'settings.scripts','settings','scripts','Manage tracking / custom scripts — Site Settings'),(84,'users.view','users','view','View — Staff Users'),(85,'users.create','users','create','Create — Staff Users'),(86,'users.edit','users','edit','Edit — Staff Users'),(87,'users.delete','users','delete','Delete — Staff Users'),(88,'roles.view','roles','view','View — Roles & Permissions'),(89,'roles.create','roles','create','Create — Roles & Permissions'),(90,'roles.edit','roles','edit','Edit — Roles & Permissions'),(91,'roles.delete','roles','delete','Delete — Roles & Permissions'),(92,'audit_logs.view','audit_logs','view','View — Audit Logs'),(93,'system.view','system','view','View — System & Developer Tools'),(94,'system.manage','system','manage','Manage — System & Developer Tools');
/*!40000 ALTER TABLE `sid_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_press_mentions`
--

DROP TABLE IF EXISTS `sid_press_mentions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_press_mentions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(400) NOT NULL,
  `outlet` varchar(150) DEFAULT NULL,
  `date_label` varchar(60) DEFAULT NULL,
  `doctor` varchar(150) DEFAULT NULL,
  `type` varchar(80) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `link` varchar(500) DEFAULT NULL,
  `video_id` varchar(40) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_press_mentions`
--

LOCK TABLES `sid_press_mentions` WRITE;
/*!40000 ALTER TABLE `sid_press_mentions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sid_press_mentions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_reviews`
--

DROP TABLE IF EXISTS `sid_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_reviews` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `legacy_id` varchar(80) DEFAULT NULL,
  `reviewer_name` varchar(120) NOT NULL,
  `initials` varchar(6) DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `rating` tinyint(3) unsigned NOT NULL DEFAULT 5,
  `review_text` text NOT NULL,
  `treatment_tag` varchar(160) DEFAULT NULL,
  `branch` varchar(160) DEFAULT NULL,
  `source` enum('google','website','manual') NOT NULL DEFAULT 'google',
  `verified` tinyint(1) NOT NULL DEFAULT 1,
  `review_date` date DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reviews_legacy` (`legacy_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_reviews`
--

LOCK TABLES `sid_reviews` WRITE;
/*!40000 ALTER TABLE `sid_reviews` DISABLE KEYS */;
INSERT INTO `sid_reviews` VALUES (1,'rev-1','Sirjana Grewal','SG',NULL,5,'I have been getting Laser hair removal from here. Great services and hygiene has been consistently maintained throughout the duration of my entire process here. I would blindly recommend this to anyone. Getting laser removal from here has been one of the best decisions I have ever made.','Laser Hair Removal','Noida HQ Clinic','google',1,'2026-02-10',1,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(2,'rev-2','Kavita Sharma','KS',NULL,5,'My dermatology visit with Dr. Ipshita\'s clinic exceeded all my expectations. Not only did I leave with a clear understanding of my skin concerns, but I also felt empowered to take control of my skincare regimen. Truly exceptional team!','Acne Scar Revision','Noida HQ Clinic','google',1,'2026-02-12',2,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(3,'rev-3','Rohan Malhotra','RM',NULL,5,'Took 3 sessions of GFC for acute hair thinning. The density improvement on my crown within 2 months has been unbelievable. Very transparent and medical-grade approach without any unnecessary products.','GFC Hair Regrowth','Gurgaon Clinic','google',1,'2026-02-15',3,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(4,'rev-4','Aishwarya Sen','AS',NULL,5,'The Signature Sugarcane HydraFacial gave my skin an instant glass finish! Zero irritation or redness, and my stubborn blackheads on the nose were completely vacuumed away. Worth every penny.','HydraFacial MD','Noida HQ Clinic','google',1,'2026-02-18',4,1,'2026-10-26 18:07:04','2026-10-26 18:07:04');
/*!40000 ALTER TABLE `sid_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_role_permissions`
--

DROP TABLE IF EXISTS `sid_role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_role_permissions` (
  `role_id` int(10) unsigned NOT NULL,
  `permission_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `fk_rp_perm` (`permission_id`),
  CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permission_id`) REFERENCES `sid_permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `sid_roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_role_permissions`
--

LOCK TABLES `sid_role_permissions` WRITE;
/*!40000 ALTER TABLE `sid_role_permissions` DISABLE KEYS */;
INSERT INTO `sid_role_permissions` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),(1,29),(1,30),(1,31),(1,32),(1,33),(1,34),(1,35),(1,36),(1,37),(1,38),(1,39),(1,40),(1,41),(1,42),(1,43),(1,44),(1,45),(1,46),(1,47),(1,48),(1,49),(1,50),(1,51),(1,52),(1,53),(1,54),(1,55),(1,56),(1,57),(1,58),(1,59),(1,60),(1,61),(1,62),(1,63),(1,64),(1,65),(1,66),(1,67),(1,68),(1,69),(1,70),(1,71),(1,72),(1,73),(1,74),(1,75),(1,76),(1,77),(1,78),(1,79),(1,80),(1,81),(1,82),(1,83),(1,84),(1,85),(1,86),(1,87),(1,88),(1,89),(1,90),(1,91),(1,92),(1,93),(1,94),(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(2,14),(2,15),(2,16),(2,17),(2,18),(2,19),(2,20),(2,21),(2,22),(2,23),(2,24),(2,25),(2,26),(2,27),(2,28),(2,29),(2,30),(2,31),(2,32),(2,33),(2,34),(2,35),(2,36),(2,37),(2,38),(2,39),(2,40),(2,41),(2,42),(2,43),(2,44),(2,45),(2,46),(2,47),(2,48),(2,49),(2,50),(2,51),(2,52),(2,53),(2,54),(2,55),(2,56),(2,57),(2,58),(2,59),(2,60),(2,61),(2,62),(2,63),(2,64),(2,65),(2,66),(2,67),(2,68),(2,69),(2,70),(2,71),(2,72),(2,73),(2,74),(2,75),(2,76),(2,77),(2,78),(2,79),(2,80),(2,81),(2,82),(2,84),(2,85),(2,86),(2,92),(3,1),(3,10),(3,14),(3,18),(3,22),(3,30),(3,42),(3,58),(3,59),(3,60),(3,61),(3,62),(3,63),(3,64),(3,65),(3,66),(3,70),(3,72),(3,74),(3,75),(3,76),(3,77),(3,78),(3,79),(3,81),(4,1),(4,2),(4,6),(4,10),(4,14),(4,18),(4,22),(4,26),(4,30),(4,34),(4,38),(4,42),(4,46),(4,50),(4,54),(4,58),(4,62),(4,66),(4,67),(4,68),(4,69),(4,70),(4,71),(4,72),(4,73),(4,74),(4,75),(4,76),(4,77),(4,78),(4,79),(4,80),(4,81),(4,82),(4,83),(4,84),(4,92),(4,93),(4,94),(5,1),(5,10),(5,11),(5,12),(5,14),(5,15),(5,16),(5,17),(5,18),(5,19),(5,20),(5,21),(5,22),(5,23),(5,24),(5,26),(5,30),(5,31),(5,32),(5,33),(5,34),(5,35),(5,36),(5,38),(5,42),(5,43),(5,44),(5,45),(5,46),(5,47),(5,48),(5,49),(5,50),(5,51),(5,52),(5,53),(5,54),(5,55),(5,56),(5,57),(5,58),(5,59),(5,60),(5,61),(5,62),(5,63),(5,64),(5,65),(5,74),(5,78),(5,79),(5,80),(6,1),(6,2),(6,3),(6,4),(6,6),(6,7),(6,8),(6,10),(6,22),(6,26),(6,38);
/*!40000 ALTER TABLE `sid_role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_roles`
--

DROP TABLE IF EXISTS `sid_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_roles`
--

LOCK TABLES `sid_roles` WRITE;
/*!40000 ALTER TABLE `sid_roles` DISABLE KEYS */;
INSERT INTO `sid_roles` VALUES (1,'super_admin','Super Admin','Full, unrestricted access including users, roles and system tools.',1,'2026-10-26 18:07:03','2026-10-26 18:07:03'),(2,'admin','Admin','Runs the clinic website & operations. Cannot manage roles, system tools or tracking scripts.',1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(3,'seo_executive','SEO Executive','Owns SEO metadata, sitemap, FAQs and content blocks. Read-only elsewhere.',1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(4,'developer','Developer','Technical owner: site settings, tracking scripts, menus, content blocks, system tools.',1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(5,'content_manager','Content Manager','Manages website content: treatments, doctors, banners, offers, reviews, media.',1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(6,'front_desk','Front Desk','Handles appointments and incoming enquiries.',1,'2026-10-26 18:07:04','2026-10-26 18:07:04');
/*!40000 ALTER TABLE `sid_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_seo_pages`
--

DROP TABLE IF EXISTS `sid_seo_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_seo_pages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL,
  `name` varchar(150) NOT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `meta_keywords` varchar(500) DEFAULT NULL,
  `og_title` varchar(255) DEFAULT NULL,
  `og_description` varchar(500) DEFAULT NULL,
  `og_image` varchar(500) DEFAULT NULL,
  `canonical_url` varchar(500) DEFAULT NULL,
  `robots` varchar(60) NOT NULL DEFAULT 'index,follow',
  `schema_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`schema_json`)),
  `include_in_sitemap` tinyint(1) NOT NULL DEFAULT 1,
  `sitemap_priority` decimal(2,1) NOT NULL DEFAULT 0.7,
  `sitemap_changefreq` varchar(20) NOT NULL DEFAULT 'weekly',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `path` (`path`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_seo_pages`
--

LOCK TABLES `sid_seo_pages` WRITE;
/*!40000 ALTER TABLE `sid_seo_pages` DISABLE KEYS */;
INSERT INTO `sid_seo_pages` VALUES (1,'/','Homepage','Best Dermatologist in Noida & Gurgaon | No.1 Skin Clinic | Skinfinity Derma','Award-winning Dermatology & Aesthetic Laser clinic led by Dr. Ipshita Johri. 4,500+ Verified reviews with 4.5 Rating. 5 Senior MD Dermatologists.','Dermatologist in Noida, Skin specialist Gurgaon, Laser hair removal Noida, HydraFacial Noida, Dr Ipshita Johri',NULL,NULL,'/images/hero/hero-banner.webp','https://www.skinfinityderma.com/','index,follow',NULL,1,1.0,'daily',1,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(2,'/treatments','Treatments Catalog','Dermatology & Laser Treatments in Noida & Gurgaon | Skinfinity Derma','Explore full catalog of doctor-led skin, hair, laser, anti-ageing and medi-facial treatments at transparent clinical pricing.','Skin treatments price list, Laser hair reduction cost Noida, HydraFacial price Noida, Acne scar doctor',NULL,NULL,NULL,'https://www.skinfinityderma.com/treatments/','index,follow',NULL,1,0.9,'weekly',1,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(3,'/about-clinic','About Clinic','About Skinfinity Derma Clinic | Vision, Doctors & Technology','Learn about Skinfinity Derma’s decade-long medical heritage, founder Dr. Ipshita Johri, and hospital-grade aesthetic care standards.',NULL,NULL,NULL,NULL,'https://www.skinfinityderma.com/about-clinic/','index,follow',NULL,1,0.8,'monthly',1,'2026-10-26 18:07:16','2026-10-26 18:07:16'),(4,'/contact-us','Contact & Clinic Locations','Book Appointment & Clinic Locations | Skinfinity Derma Noida & Gurgaon','Schedule your consultation with senior MD Dermatologists. Get clinic directions, phone numbers, WhatsApp, and consultation timings.',NULL,NULL,NULL,NULL,'https://www.skinfinityderma.com/contact-us/','index,follow',NULL,1,0.8,'monthly',1,'2026-10-26 18:07:16','2026-10-26 18:07:16');
/*!40000 ALTER TABLE `sid_seo_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_settings`
--

DROP TABLE IF EXISTS `sid_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`setting_value`)),
  `group_name` varchar(50) NOT NULL DEFAULT 'general',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_settings`
--

LOCK TABLES `sid_settings` WRITE;
/*!40000 ALTER TABLE `sid_settings` DISABLE KEYS */;
INSERT INTO `sid_settings` VALUES ('general','{\"clinicName\":\"Skinfinity Derma\",\"tagline\":\"Premier Aesthetic Dermatology & Trichology Clinic\",\"phone\":\"+91 9871941444\",\"alternatePhone\":\"+91 8929765785\",\"whatsapp\":\"+91 9871941444\",\"email\":\"skinfinityderma@gmail.com\",\"workingHours\":\"Mon - Sun: 10:00 AM – 08:00 PM\",\"logo\":\"/images/logo.webp\",\"favicon\":\"/favicon.png\",\"socialLinks\":{\"instagram\":\"https://instagram.com/skinfinityderma\",\"facebook\":\"https://facebook.com/skinfinityderma\",\"youtube\":\"https://youtube.com/@skinfinityderma\"}}','general','2026-10-26 18:07:04'),('reviews','{\"rating\":4.5,\"reviewCount\":\"4,500+\",\"writeReviewUrl\":\"https://g.page/r/skinfinityderma/review\"}','reviews','2026-10-26 18:07:04'),('scripts','{\"head\":\"<!-- Google Tag Manager / Analytics Scripts configured by Developer -->\",\"body\":\"<!-- Pixel Scripts -->\"}','scripts','2026-10-26 18:07:04'),('seo','{\"defaultTitle\":\"Best Dermatologist in Noida & Gurgaon | No.1 Skin Clinic | Skinfinity Derma\",\"defaultDescription\":\"Award-winning Dermatology & Aesthetic Laser clinic led by Dr. Ipshita Johri. 4,500+ Verified reviews with 4.5 rating. US-FDA approved technologies.\",\"keywords\":\"Dermatologist in Noida, Skin Specialist Gurgaon, Laser Hair Removal Noida, HydraFacial Noida, Dr Ipshita Johri\",\"ogImage\":\"/images/hero/hero-banner.webp\",\"siteUrl\":\"https://www.skinfinityderma.com\"}','seo','2026-10-26 18:07:04'),('stats','{\"reviewsCount\":\"4,500+\",\"rating\":\"4.5\",\"yearsOfExcellence\":\"10+\",\"totalPatients\":\"1,00,000+\",\"expertDermatologists\":\"6+\",\"successfulProcedures\":\"50,000+\",\"safetyStandards\":\"100% US-FDA Approved\"}','stats','2026-10-26 18:07:04');
/*!40000 ALTER TABLE `sid_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_treatment_concerns`
--

DROP TABLE IF EXISTS `sid_treatment_concerns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_treatment_concerns` (
  `treatment_id` int(10) unsigned NOT NULL,
  `concern_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`treatment_id`,`concern_id`),
  KEY `fk_tc_concern` (`concern_id`),
  CONSTRAINT `fk_tc_concern` FOREIGN KEY (`concern_id`) REFERENCES `sid_concerns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tc_treatment` FOREIGN KEY (`treatment_id`) REFERENCES `sid_treatments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_treatment_concerns`
--

LOCK TABLES `sid_treatment_concerns` WRITE;
/*!40000 ALTER TABLE `sid_treatment_concerns` DISABLE KEYS */;
INSERT INTO `sid_treatment_concerns` VALUES (1,6),(2,7),(3,1),(3,2),(4,4),(5,3);
/*!40000 ALTER TABLE `sid_treatment_concerns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_treatments`
--

DROP TABLE IF EXISTS `sid_treatments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_treatments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `legacy_id` varchar(80) DEFAULT NULL,
  `slug` varchar(190) NOT NULL,
  `aliases` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`aliases`)),
  `name` varchar(220) NOT NULL,
  `category_id` int(10) unsigned DEFAULT NULL,
  `body_area` varchar(60) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `rating` decimal(3,2) NOT NULL DEFAULT 4.80,
  `reviews_count` int(10) unsigned NOT NULL DEFAULT 0,
  `duration` varchar(80) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `original_price` decimal(10,2) DEFAULT NULL,
  `discount_badge` varchar(60) DEFAULT NULL,
  `emi_months` smallint(5) unsigned DEFAULT NULL,
  `emi_monthly` decimal(10,2) DEFAULT NULL,
  `sessions_info` varchar(255) DEFAULT NULL,
  `card_highlights` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`card_highlights`)),
  `explained_subtitle` varchar(255) DEFAULT NULL,
  `short_desc` text DEFAULT NULL,
  `full_desc` mediumtext DEFAULT NULL,
  `banner_image` varchar(500) DEFAULT NULL,
  `gallery_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gallery_images`)),
  `how_it_works` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`how_it_works`)),
  `ideal_frequency` varchar(255) DEFAULT NULL,
  `ideal_for` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ideal_for`)),
  `not_ideal_for` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`not_ideal_for`)),
  `before_treatment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`before_treatment`)),
  `after_treatment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`after_treatment`)),
  `youtube_video_id` varchar(40) DEFAULT NULL,
  `faqs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`faqs`)),
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` varchar(500) DEFAULT NULL,
  `seo_keywords` varchar(500) DEFAULT NULL,
  `og_image` varchar(500) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `uq_treatments_legacy` (`legacy_id`),
  KEY `idx_treatments_category` (`category_id`),
  KEY `idx_treatments_active` (`is_active`,`is_featured`,`display_order`),
  CONSTRAINT `fk_treatments_category` FOREIGN KEY (`category_id`) REFERENCES `sid_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_treatments`
--

LOCK TABLES `sid_treatments` WRITE;
/*!40000 ALTER TABLE `sid_treatments` DISABLE KEYS */;
INSERT INTO `sid_treatments` VALUES (1,'full-body-lhr','laser-hair-removal-noida','[\"laser-hair-reduction-noida\",\"full-body-laser-hair-reduction\"]','Full Body Laser Hair Reduction',1,'Full Body','[\"US-FDA SOPRANO TITANIUM\",\"PAINLESS ICE-COOL\"]',4.94,1420,'90 mins',16999.00,19999.00,'30% OFF',6,11167.00,'1 Full Body Session (6-Session Package @ ₹39,999)','[\"90%–95% permanent reduction in hair growth over 6–8 sessions\",\"Covers full body including face, arms, underarms, legs, back & bikini\",\"US-FDA approved triple-wavelength diode with -4°C sapphire ice cooling\"]','Painless, Permanent, Triple-Wavelength US-FDA Protocol','Triple-wavelength diode and Alexandrite laser hair reduction with advanced sapphire contact cooling for pain-free, permanent full-body smoothness.','Eliminate unwanted facial and body hair permanently with Skinfinity Derma\'s gold-standard Full Body Laser Hair Reduction. Powered by US-FDA approved triple-wavelength (755nm + 810nm + 1064nm) Soprano Titanium technology and continuous -4°C ICE Plus contact cooling, our protocol targets deep follicular melanin while keeping the epidermis completely cool and comfortable.','/images/treatments/banner-laser.webp','[{\"src\":\"/images/treatments/banner-laser.webp\",\"caption\":\"US-FDA Triple-Wavelength Painless Laser Hair Reduction\"},{\"src\":\"/images/results/laser-after.jpg\",\"caption\":\"Smooth, Ingrown-Free Skin After Clinical Laser Sessions\"}]','[{\"stepNumber\":\"01\",\"title\":\"Clinical Skin & Hair Profiling\",\"desc\":\"Dermatologist examines follicle depth, hair thickness and Fitzpatrick skin type.\",\"image\":\"/images/clinic/interior-1.jpg\"},{\"stepNumber\":\"02\",\"title\":\"Hygiene Prep & Cooling Gel\",\"desc\":\"Target area sanitized, precision shaved and coated with chilling ultrasound gel.\",\"image\":\"/images/clinic/interior-2.jpg\"},{\"stepNumber\":\"03\",\"title\":\"Triple-Wavelength Laser Gliding\",\"desc\":\"In-motion laser pulses gradually heat follicles to disabling temperatures.\",\"image\":\"/images/treatments/banner-laser.webp\"},{\"stepNumber\":\"04\",\"title\":\"Calming Aloe-Zinc Barrier\",\"desc\":\"Post-laser soothing balm and SPF application with detailed home care instructions.\",\"image\":\"/images/clinic/interior-3.jpg\"}]','Every 4 to 6 weeks for optimal hair growth cycle targeting','[\"Coarse unwanted body hair\",\"Frequent ingrown hair & razor burns\",\"PCOS-induced hirsutism\"]','[\"Active sunburns\",\"White/grey hairs lacking melanin\",\"Open wounds\"]','[\"Shave 24 hours prior\",\"Avoid waxing/threading for 4 weeks\",\"Skip direct sunbathing for 5 days\"]','[\"Apply broad-spectrum SPF 50\",\"Avoid hot showers & saunas for 24h\",\"Moisturize twice daily\"]','1WmieekXjG4','[{\"question\":\"Does laser hair reduction hurt?\",\"answer\":\"Not at all. With our -4°C sapphire cooling tip, patients feel only a soothing warm sensation like a hot stone massage.\"},{\"question\":\"How many sessions are required?\",\"answer\":\"Usually 6 to 8 sessions achieve 90%–95% permanent reduction due to hair growth cycles.\"}]','Full Body Laser Hair Removal in Noida & Gurgaon | Skinfinity Derma','Pain-free Full Body Laser Hair Reduction in Noida using US-FDA Soprano Titanium. Book your free patch test with senior MD Dermatologists.',NULL,NULL,1,1,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(2,'hydrafacial-elite','sugarcane-hydrafacial-noida','[\"hydrafacial-noida\",\"signature-hydrafacial-md\"]','Signature Sugarcane HydraFacial MD Glass Glow',2,'Face','[\"INSTANT GLASS GLOW\",\"ZERO DOWNTIME\",\"MD PROTOCOL\"]',4.96,2150,'60 mins',3499.00,5500.00,'36% OFF',3,1166.00,'1 Clinical Session (Package of 3 @ ₹8,999)','[\"Instant Korean glass-skin hydration with zero downtime\",\"Vortex vacuum extraction cleans congested blackheads & sebum\",\"Custom antioxidant cocktail infused with organic sugarcane AHA\"]','Medical-Grade 7-Step Hydradermabrasion & Antioxidant Infusion','Patented 7-step medical hydradermabrasion infusing sugarcane glycolic acid, hyaluronic peptides, and active botanical antioxidants for glowing skin.','The authentic Signature Sugarcane HydraFacial MD at Skinfinity Derma is a medical-grade hydradermabrasion therapy combining clinical deep-pore cleansing, gentle chemical exfoliation, painless vortex sebum suction, and deep transdermal infusion of hyaluronic acid, peptides, and organic sugarcane extracts.','/images/treatments/banner-hydrafacial.webp','[{\"src\":\"/images/treatments/banner-hydrafacial.webp\",\"caption\":\"Vortex-Fusion Antioxidant Infusion\"},{\"src\":\"/images/results/acne-after.jpg\",\"caption\":\"Immediate Dewy Radiance After Treatment\"}]','[{\"stepNumber\":\"01\",\"title\":\"Deep Vortex Cleanse\",\"desc\":\"Lactic acid solution sweeps away dead surface cells.\",\"image\":\"/images/clinic/interior-1.jpg\"},{\"stepNumber\":\"02\",\"title\":\"Sugarcane Glycolic Peel\",\"desc\":\"Mild chemical peel loosens deep comedones without irritation.\",\"image\":\"/images/clinic/interior-2.jpg\"},{\"stepNumber\":\"03\",\"title\":\"Painless Vacuum Extraction\",\"desc\":\"Vortex suction clears pores painlessly.\",\"image\":\"/images/treatments/banner-hydrafacial.webp\"},{\"stepNumber\":\"04\",\"title\":\"Antioxidant & Peptide Saturation\",\"desc\":\"Serums drenched with Hyaluronic Acid and Peptides infused.\",\"image\":\"/images/clinic/interior-4.jpg\"}]','Once every 4 weeks for long-term skin health and glow','[\"Clogged pores & blackheads\",\"Dull and tired complexion\",\"Pre-event bridal radiance\"]','[\"Severe active cystic acne flare-ups\",\"Open eczema or cold sores\"]','[\"Stop retinoids 48 hours before\",\"Avoid bleach/waxing for 3 days\"]','[\"Apply sunscreen SPF 50\",\"No heavy makeup for 6 hours\",\"Enjoy instant dewy skin\"]','1WmieekXjG4','[{\"question\":\"Is there any peeling or downtime?\",\"answer\":\"None at all. Your skin looks instantly radiant and plump right after the 60-minute session.\"}]','HydraFacial in Noida & Gurgaon | Glass Skin Facial | Skinfinity Derma','Authentic 7-step Signature HydraFacial MD in Noida for instant glass skin glow. Doctor-supervised hydradermabrasion at best price.',NULL,NULL,2,1,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(3,'acne-scar-mnrf','acne-pimple-treatment-noida','[\"acne-scar-treatment-noida\",\"mnrf-subcision-acne-scars\"]','Advanced Acne & Scar Revision (MNRF + Subcision)',3,'Face','[\"GOLD STANDARD SCAR REVISION\",\"DOCTOR-PERFORMED\"]',4.91,980,'75 mins',4999.00,7500.00,'33% OFF',6,2500.00,'1 Session (Recommended Protocol: 4 Sessions)','[\"Breaks fibrous tethered bands with precision surgical subcision\",\"Stimulates deep neocollagenesis using micro-insulated gold needles\",\"Visible 70%–85% reduction in atrophic and rolling scar depth\"]','Dual Action: Fibrous Band Release + Micro-Needling Radiofrequency','Synergistic combination of subcision to release deep scar tethering and gold-plated MNRF to rebuild collagen from within.','Our flagship Acne Scar Revision protocol is formulated by Dr. Ipshita Johri to systematically address rolling, boxcar, and ice-pick scars. Combining subcision with gold-insulated Microneedling Radiofrequency (MNRF), it breaks down tough fibrotic scar bands and triggers vigorous dermal remodeling.','/images/treatments/banner-acne.webp','[{\"src\":\"/images/treatments/banner-acne.webp\",\"caption\":\"Gold-Plated MNRF for Scar Remodeling\"},{\"src\":\"/images/results/acne-after.jpg\",\"caption\":\"Smoother Texture and Even Tone After 4 Sessions\"}]','[{\"stepNumber\":\"01\",\"title\":\"Topical Numbing\",\"desc\":\"High-strength clinical numbing cream applied for 45 minutes.\",\"image\":\"/images/clinic/interior-1.jpg\"},{\"stepNumber\":\"02\",\"title\":\"Precision Subcision\",\"desc\":\"Dermatologist inserts specialized cannula to free tethered scar tissue.\",\"image\":\"/images/clinic/interior-2.jpg\"},{\"stepNumber\":\"03\",\"title\":\"Gold-Plated MNRF Delivery\",\"desc\":\"Micro-needles penetrate precisely delivering RF heat energy into the dermis.\",\"image\":\"/images/treatments/banner-acne.webp\"},{\"stepNumber\":\"04\",\"title\":\"Cryo-Soothing & Growth Factor Mask\",\"desc\":\"Calming sheet mask locks in hydration and reduces redness.\",\"image\":\"/images/clinic/interior-3.jpg\"}]','Every 4 to 6 weeks for 3 to 5 sessions','[\"Rolling and boxcar acne scars\",\"Large open pores\",\"Post-acne textural irregularity\"]','[\"Severe active bacterial cystic infection (treat active acne first)\"]','[\"Avoid blood-thinning supplements 3 days prior\",\"Come with clean, makeup-free skin\"]','[\"Mild pinkness settles within 24–48 hours\",\"Use gentle hydrating cleanser and SPF 50\"]','1WmieekXjG4','[{\"question\":\"How soon will I see results?\",\"answer\":\"Collagen remodeling begins immediately and improves progressively over 8 to 12 weeks.\"}]','Acne Scar Treatment in Noida & Gurgaon | MNRF & Subcision | Skinfinity Derma','Best acne scar revision in Noida using Subcision and US-FDA MNRF. 80%+ visible improvement in pitted scars. Book doctor consult.',NULL,NULL,3,1,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(4,'gfc-hair-therapy','gfc-hair-growth-therapy-noida','[\"hair-prp-treatment-noida\",\"growth-factor-concentrate-hair\"]','GFC (Growth Factor Concentrate) Hair Restoration',5,'Scalp','[\"NEXT-GEN PRP\",\"100% AUTOLOGOUS\",\"HIGH CONCENTRATION\"]',4.93,1120,'45 mins',5999.00,9000.00,'33% OFF',6,2999.00,'1 Session (Recommended Protocol: 3 to 4 Sessions)','[\"5x higher concentration of PDGF, VEGF, EGF than traditional PRP\",\"Completely acellular, sterile, non-pyrogenic with minimal pain\",\"Stops active hair fall and strengthens dormant miniaturized follicles\"]','Advanced Autologous Growth Factors for Follicular Reactivation','Pure autologous growth factor concentrate extracted from your own blood to awaken dormant follicles, reverse miniaturization and boost hair thickness.','GFC (Growth Factor Concentrate) is the next generation of regenerative hair therapy, superior to traditional PRP. By utilizing dedicated vacuum tubes, high concentrations of natural growth factors (PDGF, VEGF, EGF, IGF-1) are extracted from blood platelets in an acellular form, ensuring zero pain, zero clot risk, and maximum follicular stimulation.','/images/treatments/banner-hair.webp','[{\"src\":\"/images/treatments/banner-hair.webp\",\"caption\":\"Precision Scalp Mesotherapy with GFC\"},{\"src\":\"/images/results/hair-after.jpg\",\"caption\":\"Significant Increase in Hair Density and Crown Coverage\"}]','[{\"stepNumber\":\"01\",\"title\":\"Blood Draw\",\"desc\":\"10ml of blood collected in specialized GFC tubes.\",\"image\":\"/images/clinic/interior-1.jpg\"},{\"stepNumber\":\"02\",\"title\":\"Incubation & Centrifugation\",\"desc\":\"30-minute incubation releases maximum growth factors from platelets.\",\"image\":\"/images/clinic/interior-2.jpg\"},{\"stepNumber\":\"03\",\"title\":\"Micro-Injection Delivery\",\"desc\":\"Acellular GFC injected with ultra-fine 32G micro-needles across thinning scalp zones.\",\"image\":\"/images/treatments/banner-hair.webp\"},{\"stepNumber\":\"04\",\"title\":\"Laser Hair Stimulation\",\"desc\":\"Low-Level Laser Light therapy (LLLT) accelerates absorption and scalp microcirculation.\",\"image\":\"/images/clinic/interior-4.jpg\"}]','Once every 3 to 4 weeks for 3 to 4 sessions','[\"Male & female pattern hair thinning\",\"Telogen effluvium post-COVID / post-stress\",\"Early-stage baldness\"]','[\"Completely scarred hairless scalp patches\"]','[\"Wash hair thoroughly before the visit\",\"Stay well hydrated\"]','[\"Do not wash hair for 12 hours\",\"Avoid vigorous workouts for 24 hours\"]','1WmieekXjG4','[{\"question\":\"Is GFC better than regular PRP?\",\"answer\":\"Yes. GFC is completely acellular with no RBCs or WBCs, resulting in less pain, zero inflammation and up to 5x higher growth factor concentration.\"}]','GFC Hair Loss Treatment in Noida & Gurgaon | Hair PRP | Skinfinity Derma','Best GFC Hair Restoration therapy in Noida. Reverse hair thinning and stop hair fall with pure autologous growth factor therapy.',NULL,NULL,4,1,1,'2026-10-26 18:07:04','2026-10-26 18:07:04'),(5,'q-switched-laser','pigmentation-laser-treatment-noida','[\"q-switch-nd-yag-laser\",\"melasma-laser-treatment\"]','Q-Switched Nd:YAG Laser Melasma & Pigmentation Revision',4,'Face','[\"US-FDA PICO/Q-SWITCH\",\"TARGETED MELANIN CLEARANCE\"]',4.89,870,'45 mins',4499.00,6500.00,'30% OFF',3,1499.00,'1 Session (Package of 4 Sessions @ ₹14,999)','[\"Shatters epidermal & dermal pigment particles into microscopic dust\",\"Targets stubborn melasma, sun freckles and post-inflammatory hyperpigmentation\",\"Zero peeling or social downtime with immediate skin brightening\"]','Acoustic Shockwave Melanin Fragmentation with Zero Heat Damage','Gold-standard 1064nm photo-acoustic laser that shatters stubborn dermal melanin particles without harming the surrounding skin barrier.','Skinfinity Derma utilizes the US-FDA approved Q-Switched Nd:YAG laser system delivering nanosecond pulses. It breaks deep melanin deposits into tiny fragments naturally cleared by the immune system, successfully treating melasma, sun spots, and uneven tan.','/images/treatments/banner-pigmentation.webp','[{\"src\":\"/images/treatments/banner-pigmentation.webp\",\"caption\":\"Targeted Laser Pigment Resurfacing\"},{\"src\":\"/images/results/pigmentation-after.jpg\",\"caption\":\"Clearer, Even-Toned Complexion After Laser Sessions\"}]','[{\"stepNumber\":\"01\",\"title\":\"Diagnostic Wood’s Lamp Analysis\",\"desc\":\"Identifies whether pigment is epidermal, dermal, or mixed.\",\"image\":\"/images/clinic/interior-1.jpg\"},{\"stepNumber\":\"02\",\"title\":\"Laser Energy Calibration\",\"desc\":\"Wavelength and spot size calibrated for Indian skin.\",\"image\":\"/images/treatments/banner-pigmentation.webp\"},{\"stepNumber\":\"03\",\"title\":\"Photo-Acoustic Toning\",\"desc\":\"Rapid nanosecond pulses fragment melanin clusters.\",\"image\":\"/images/clinic/interior-2.jpg\"},{\"stepNumber\":\"04\",\"title\":\"Cooling Serum & Sun Barrier\",\"desc\":\"Soothing post-laser serum and mineral SPF applied.\",\"image\":\"/images/clinic/interior-3.jpg\"}]','Every 3 to 4 weeks for 4 to 6 sessions','[\"Hormonal melasma patches\",\"Stubborn sun tanning\",\"Post-acne dark marks (PIH)\"]','[\"Active sunburn within past 48 hours\"]','[\"Avoid direct tanning and bleach for 7 days\"]','[\"Strict daily broad-spectrum SPF 50 reapplication every 3 hours\"]','1WmieekXjG4','[{\"question\":\"Will pigmentation return after laser?\",\"answer\":\"With regular sunscreen use and our doctor-prescribed maintenance regimen, results are long-lasting and prevent recurrence.\"}]','Pigmentation & Melasma Treatment in Noida | Laser Toning | Skinfinity Derma','Best Melasma and Pigmentation laser treatment in Noida with Q-Switched Nd:YAG laser. Safe for Indian skin tones. Consult MD Dermatologist.',NULL,NULL,5,1,1,'2026-10-26 18:07:04','2026-10-26 18:07:04');
/*!40000 ALTER TABLE `sid_treatments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_users`
--

DROP TABLE IF EXISTS `sid_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int(10) unsigned NOT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `last_login_at` datetime DEFAULT NULL,
  `token_version` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_users_role` (`role_id`),
  KEY `idx_users_status` (`status`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `sid_roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_users`
--

LOCK TABLES `sid_users` WRITE;
/*!40000 ALTER TABLE `sid_users` DISABLE KEYS */;
INSERT INTO `sid_users` VALUES (1,'Dr. Ipshita Johri (Founder)','superadmin@skinfinityderma.com','+91 9871941444','$2a$10$t.0vEcHJbU5PFx6z6eDLzeRk0hpwuJLYZbFVUhDA8HhJ1m/Ikh1sK',1,'https://images.unsplash.com/photo-1594824813637-230cb233b47c?w=150&auto=format&fit=crop&q=80','active','2026-10-27 08:05:02',0,'2026-10-26 18:07:04','2026-10-27 02:35:02'),(2,'Clinic Operations Admin','admin@skinfinityderma.com','+91 8929765785','$2a$10$t.0vEcHJbU5PFx6z6eDLzeRk0hpwuJLYZbFVUhDA8HhJ1m/Ikh1sK',2,'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80','active','2026-10-27 00:12:43',0,'2026-10-26 18:07:04','2026-10-26 18:42:43'),(3,'SEO & Growth Manager','seo@skinfinityderma.com','+91 9811122233','$2a$10$t.0vEcHJbU5PFx6z6eDLzeRk0hpwuJLYZbFVUhDA8HhJ1m/Ikh1sK',3,'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80','active',NULL,0,'2026-10-26 18:07:04','2026-10-26 18:07:16'),(4,'Lead Web Developer','dev@skinfinityderma.com','+91 9877788899','$2a$10$t.0vEcHJbU5PFx6z6eDLzeRk0hpwuJLYZbFVUhDA8HhJ1m/Ikh1sK',4,'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80','active',NULL,0,'2026-10-26 18:07:04','2026-10-26 18:07:16'),(5,'Reception & Patient Coordinator','reception@skinfinityderma.com','+91 9871941445','$2a$10$t.0vEcHJbU5PFx6z6eDLzeRk0hpwuJLYZbFVUhDA8HhJ1m/Ikh1sK',6,'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80','active','2026-10-27 00:03:01',0,'2026-10-26 18:07:04','2026-10-26 18:33:01');
/*!40000 ALTER TABLE `sid_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sid_videos`
--

DROP TABLE IF EXISTS `sid_videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sid_videos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `legacy_id` varchar(80) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(120) DEFAULT NULL,
  `youtube_id` varchar(40) NOT NULL,
  `doctor_name` varchar(150) DEFAULT NULL,
  `type` enum('doctor_video','patient_story','short') NOT NULL DEFAULT 'doctor_video',
  `thumbnail` varchar(500) DEFAULT NULL,
  `quote` text DEFAULT NULL,
  `rating` tinyint(3) unsigned DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_videos_legacy` (`legacy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sid_videos`
--

LOCK TABLES `sid_videos` WRITE;
/*!40000 ALTER TABLE `sid_videos` DISABLE KEYS */;
/*!40000 ALTER TABLE `sid_videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `treatment_concerns`
--

DROP TABLE IF EXISTS `treatment_concerns`;
/*!50001 DROP VIEW IF EXISTS `treatment_concerns`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `treatment_concerns` AS SELECT
 1 AS `treatment_id`,
  1 AS `concern_id` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `treatments`
--

DROP TABLE IF EXISTS `treatments`;
/*!50001 DROP VIEW IF EXISTS `treatments`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `treatments` AS SELECT
 1 AS `id`,
  1 AS `legacy_id`,
  1 AS `slug`,
  1 AS `aliases`,
  1 AS `name`,
  1 AS `category_id`,
  1 AS `body_area`,
  1 AS `tags`,
  1 AS `rating`,
  1 AS `reviews_count`,
  1 AS `duration`,
  1 AS `price`,
  1 AS `original_price`,
  1 AS `discount_badge`,
  1 AS `emi_months`,
  1 AS `emi_monthly`,
  1 AS `sessions_info`,
  1 AS `card_highlights`,
  1 AS `explained_subtitle`,
  1 AS `short_desc`,
  1 AS `full_desc`,
  1 AS `banner_image`,
  1 AS `gallery_images`,
  1 AS `how_it_works`,
  1 AS `ideal_frequency`,
  1 AS `ideal_for`,
  1 AS `not_ideal_for`,
  1 AS `before_treatment`,
  1 AS `after_treatment`,
  1 AS `youtube_video_id`,
  1 AS `faqs`,
  1 AS `seo_title`,
  1 AS `seo_description`,
  1 AS `seo_keywords`,
  1 AS `og_image`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `is_featured`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `users`
--

DROP TABLE IF EXISTS `users`;
/*!50001 DROP VIEW IF EXISTS `users`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `users` AS SELECT
 1 AS `id`,
  1 AS `name`,
  1 AS `email`,
  1 AS `phone`,
  1 AS `password_hash`,
  1 AS `role_id`,
  1 AS `avatar`,
  1 AS `status`,
  1 AS `last_login_at`,
  1 AS `token_version`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!50001 DROP VIEW IF EXISTS `videos`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `videos` AS SELECT
 1 AS `id`,
  1 AS `legacy_id`,
  1 AS `title`,
  1 AS `category`,
  1 AS `youtube_id`,
  1 AS `doctor_name`,
  1 AS `type`,
  1 AS `thumbnail`,
  1 AS `quote`,
  1 AS `rating`,
  1 AS `display_order`,
  1 AS `is_active`,
  1 AS `created_at`,
  1 AS `updated_at` */;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `appointments`
--

/*!50001 DROP VIEW IF EXISTS `appointments`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `appointments` AS select `sid_appointments`.`id` AS `id`,`sid_appointments`.`appointment_no` AS `appointment_no`,`sid_appointments`.`patient_name` AS `patient_name`,`sid_appointments`.`phone` AS `phone`,`sid_appointments`.`email` AS `email`,`sid_appointments`.`gender` AS `gender`,`sid_appointments`.`age` AS `age`,`sid_appointments`.`clinic_id` AS `clinic_id`,`sid_appointments`.`doctor_id` AS `doctor_id`,`sid_appointments`.`treatment_id` AS `treatment_id`,`sid_appointments`.`service_name` AS `service_name`,`sid_appointments`.`appointment_date` AS `appointment_date`,`sid_appointments`.`appointment_time` AS `appointment_time`,`sid_appointments`.`visit_type` AS `visit_type`,`sid_appointments`.`notes` AS `notes`,`sid_appointments`.`source` AS `source`,`sid_appointments`.`coupon_id` AS `coupon_id`,`sid_appointments`.`coupon_code` AS `coupon_code`,`sid_appointments`.`discount_amount` AS `discount_amount`,`sid_appointments`.`amount_estimate` AS `amount_estimate`,`sid_appointments`.`status` AS `status`,`sid_appointments`.`cancel_reason` AS `cancel_reason`,`sid_appointments`.`assigned_to` AS `assigned_to`,`sid_appointments`.`ip` AS `ip`,`sid_appointments`.`created_at` AS `created_at`,`sid_appointments`.`updated_at` AS `updated_at` from `sid_appointments` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `audit_logs`
--

/*!50001 DROP VIEW IF EXISTS `audit_logs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `audit_logs` AS select `sid_audit_logs`.`id` AS `id`,`sid_audit_logs`.`user_id` AS `user_id`,`sid_audit_logs`.`user_name` AS `user_name`,`sid_audit_logs`.`action` AS `action`,`sid_audit_logs`.`entity` AS `entity`,`sid_audit_logs`.`entity_id` AS `entity_id`,`sid_audit_logs`.`summary` AS `summary`,`sid_audit_logs`.`details` AS `details`,`sid_audit_logs`.`ip` AS `ip`,`sid_audit_logs`.`created_at` AS `created_at` from `sid_audit_logs` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `banners`
--

/*!50001 DROP VIEW IF EXISTS `banners`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `banners` AS select `sid_banners`.`id` AS `id`,`sid_banners`.`title` AS `title`,`sid_banners`.`subtitle` AS `subtitle`,`sid_banners`.`desktop_image` AS `desktop_image`,`sid_banners`.`mobile_image` AS `mobile_image`,`sid_banners`.`alt_text` AS `alt_text`,`sid_banners`.`button_text` AS `button_text`,`sid_banners`.`button_url` AS `button_url`,`sid_banners`.`location` AS `location`,`sid_banners`.`meta` AS `meta`,`sid_banners`.`starts_at` AS `starts_at`,`sid_banners`.`ends_at` AS `ends_at`,`sid_banners`.`display_order` AS `display_order`,`sid_banners`.`is_active` AS `is_active`,`sid_banners`.`created_at` AS `created_at`,`sid_banners`.`updated_at` AS `updated_at` from `sid_banners` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `before_after_cases`
--

/*!50001 DROP VIEW IF EXISTS `before_after_cases`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `before_after_cases` AS select `sid_before_after_cases`.`id` AS `id`,`sid_before_after_cases`.`legacy_id` AS `legacy_id`,`sid_before_after_cases`.`patient_name` AS `patient_name`,`sid_before_after_cases`.`treatment` AS `treatment`,`sid_before_after_cases`.`treatment_id` AS `treatment_id`,`sid_before_after_cases`.`description` AS `description`,`sid_before_after_cases`.`before_image` AS `before_image`,`sid_before_after_cases`.`after_image` AS `after_image`,`sid_before_after_cases`.`results_type` AS `results_type`,`sid_before_after_cases`.`timeframe` AS `timeframe`,`sid_before_after_cases`.`has_patient_consent` AS `has_patient_consent`,`sid_before_after_cases`.`approval_status` AS `approval_status`,`sid_before_after_cases`.`display_order` AS `display_order`,`sid_before_after_cases`.`is_active` AS `is_active`,`sid_before_after_cases`.`created_at` AS `created_at`,`sid_before_after_cases`.`updated_at` AS `updated_at` from `sid_before_after_cases` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `categories`
--

/*!50001 DROP VIEW IF EXISTS `categories`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `categories` AS select `sid_categories`.`id` AS `id`,`sid_categories`.`name` AS `name`,`sid_categories`.`slug` AS `slug`,`sid_categories`.`description` AS `description`,`sid_categories`.`thumbnail` AS `thumbnail`,`sid_categories`.`seo_title` AS `seo_title`,`sid_categories`.`seo_description` AS `seo_description`,`sid_categories`.`display_order` AS `display_order`,`sid_categories`.`is_active` AS `is_active`,`sid_categories`.`created_at` AS `created_at`,`sid_categories`.`updated_at` AS `updated_at` from `sid_categories` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `clinics`
--

/*!50001 DROP VIEW IF EXISTS `clinics`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `clinics` AS select `sid_clinics`.`id` AS `id`,`sid_clinics`.`slug` AS `slug`,`sid_clinics`.`city` AS `city`,`sid_clinics`.`title` AS `title`,`sid_clinics`.`address` AS `address`,`sid_clinics`.`landmark` AS `landmark`,`sid_clinics`.`pincode` AS `pincode`,`sid_clinics`.`phones` AS `phones`,`sid_clinics`.`email` AS `email`,`sid_clinics`.`whatsapp` AS `whatsapp`,`sid_clinics`.`hours` AS `hours`,`sid_clinics`.`map_embed_url` AS `map_embed_url`,`sid_clinics`.`map_link` AS `map_link`,`sid_clinics`.`highlights` AS `highlights`,`sid_clinics`.`image` AS `image`,`sid_clinics`.`latitude` AS `latitude`,`sid_clinics`.`longitude` AS `longitude`,`sid_clinics`.`slot_start` AS `slot_start`,`sid_clinics`.`slot_end` AS `slot_end`,`sid_clinics`.`slot_minutes` AS `slot_minutes`,`sid_clinics`.`slot_capacity` AS `slot_capacity`,`sid_clinics`.`weekly_off` AS `weekly_off`,`sid_clinics`.`display_order` AS `display_order`,`sid_clinics`.`is_active` AS `is_active`,`sid_clinics`.`created_at` AS `created_at`,`sid_clinics`.`updated_at` AS `updated_at` from `sid_clinics` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `concerns`
--

/*!50001 DROP VIEW IF EXISTS `concerns`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `concerns` AS select `sid_concerns`.`id` AS `id`,`sid_concerns`.`name` AS `name`,`sid_concerns`.`slug` AS `slug`,`sid_concerns`.`description` AS `description`,`sid_concerns`.`thumbnail` AS `thumbnail`,`sid_concerns`.`display_order` AS `display_order`,`sid_concerns`.`is_active` AS `is_active`,`sid_concerns`.`created_at` AS `created_at`,`sid_concerns`.`updated_at` AS `updated_at` from `sid_concerns` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `content_blocks`
--

/*!50001 DROP VIEW IF EXISTS `content_blocks`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `content_blocks` AS select `sid_content_blocks`.`id` AS `id`,`sid_content_blocks`.`block_key` AS `block_key`,`sid_content_blocks`.`title` AS `title`,`sid_content_blocks`.`description` AS `description`,`sid_content_blocks`.`content` AS `content`,`sid_content_blocks`.`is_active` AS `is_active`,`sid_content_blocks`.`updated_by` AS `updated_by`,`sid_content_blocks`.`created_at` AS `created_at`,`sid_content_blocks`.`updated_at` AS `updated_at` from `sid_content_blocks` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `coupon_categories`
--

/*!50001 DROP VIEW IF EXISTS `coupon_categories`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `coupon_categories` AS select `sid_coupon_categories`.`coupon_id` AS `coupon_id`,`sid_coupon_categories`.`category_id` AS `category_id` from `sid_coupon_categories` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `coupon_redemptions`
--

/*!50001 DROP VIEW IF EXISTS `coupon_redemptions`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `coupon_redemptions` AS select `sid_coupon_redemptions`.`id` AS `id`,`sid_coupon_redemptions`.`coupon_id` AS `coupon_id`,`sid_coupon_redemptions`.`appointment_id` AS `appointment_id`,`sid_coupon_redemptions`.`customer_phone` AS `customer_phone`,`sid_coupon_redemptions`.`customer_email` AS `customer_email`,`sid_coupon_redemptions`.`order_amount` AS `order_amount`,`sid_coupon_redemptions`.`discount_amount` AS `discount_amount`,`sid_coupon_redemptions`.`created_at` AS `created_at` from `sid_coupon_redemptions` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `coupon_treatments`
--

/*!50001 DROP VIEW IF EXISTS `coupon_treatments`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `coupon_treatments` AS select `sid_coupon_treatments`.`coupon_id` AS `coupon_id`,`sid_coupon_treatments`.`treatment_id` AS `treatment_id` from `sid_coupon_treatments` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `coupons`
--

/*!50001 DROP VIEW IF EXISTS `coupons`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `coupons` AS select `sid_coupons`.`id` AS `id`,`sid_coupons`.`code` AS `code`,`sid_coupons`.`title` AS `title`,`sid_coupons`.`description` AS `description`,`sid_coupons`.`discount_type` AS `discount_type`,`sid_coupons`.`discount_value` AS `discount_value`,`sid_coupons`.`max_discount` AS `max_discount`,`sid_coupons`.`min_order` AS `min_order`,`sid_coupons`.`applies_to` AS `applies_to`,`sid_coupons`.`usage_limit` AS `usage_limit`,`sid_coupons`.`used_count` AS `used_count`,`sid_coupons`.`valid_from` AS `valid_from`,`sid_coupons`.`valid_to` AS `valid_to`,`sid_coupons`.`is_active` AS `is_active`,`sid_coupons`.`created_by` AS `created_by`,`sid_coupons`.`created_at` AS `created_at`,`sid_coupons`.`updated_at` AS `updated_at` from `sid_coupons` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `doctors`
--

/*!50001 DROP VIEW IF EXISTS `doctors`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `doctors` AS select `sid_doctors`.`id` AS `id`,`sid_doctors`.`slug` AS `slug`,`sid_doctors`.`name` AS `name`,`sid_doctors`.`role` AS `role`,`sid_doctors`.`qualifications` AS `qualifications`,`sid_doctors`.`specialty` AS `specialty`,`sid_doctors`.`experience` AS `experience`,`sid_doctors`.`image` AS `image`,`sid_doctors`.`bio` AS `bio`,`sid_doctors`.`consultation_fee` AS `consultation_fee`,`sid_doctors`.`available_locations` AS `available_locations`,`sid_doctors`.`availability` AS `availability`,`sid_doctors`.`display_order` AS `display_order`,`sid_doctors`.`is_active` AS `is_active`,`sid_doctors`.`created_at` AS `created_at`,`sid_doctors`.`updated_at` AS `updated_at` from `sid_doctors` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `enquiries`
--

/*!50001 DROP VIEW IF EXISTS `enquiries`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `enquiries` AS select `sid_enquiries`.`id` AS `id`,`sid_enquiries`.`enquiry_no` AS `enquiry_no`,`sid_enquiries`.`type` AS `type`,`sid_enquiries`.`name` AS `name`,`sid_enquiries`.`phone` AS `phone`,`sid_enquiries`.`email` AS `email`,`sid_enquiries`.`city` AS `city`,`sid_enquiries`.`subject` AS `subject`,`sid_enquiries`.`message` AS `message`,`sid_enquiries`.`treatment_id` AS `treatment_id`,`sid_enquiries`.`treatment_name` AS `treatment_name`,`sid_enquiries`.`clinic_id` AS `clinic_id`,`sid_enquiries`.`source` AS `source`,`sid_enquiries`.`extra` AS `extra`,`sid_enquiries`.`status` AS `status`,`sid_enquiries`.`priority` AS `priority`,`sid_enquiries`.`assigned_to` AS `assigned_to`,`sid_enquiries`.`follow_up_at` AS `follow_up_at`,`sid_enquiries`.`ip` AS `ip`,`sid_enquiries`.`created_at` AS `created_at`,`sid_enquiries`.`updated_at` AS `updated_at` from `sid_enquiries` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `faqs`
--

/*!50001 DROP VIEW IF EXISTS `faqs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `faqs` AS select `sid_faqs`.`id` AS `id`,`sid_faqs`.`scope` AS `scope`,`sid_faqs`.`question` AS `question`,`sid_faqs`.`answer` AS `answer`,`sid_faqs`.`display_order` AS `display_order`,`sid_faqs`.`is_active` AS `is_active`,`sid_faqs`.`created_at` AS `created_at`,`sid_faqs`.`updated_at` AS `updated_at` from `sid_faqs` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `gallery_items`
--

/*!50001 DROP VIEW IF EXISTS `gallery_items`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `gallery_items` AS select `sid_gallery_items`.`id` AS `id`,`sid_gallery_items`.`image` AS `image`,`sid_gallery_items`.`title` AS `title`,`sid_gallery_items`.`alt_text` AS `alt_text`,`sid_gallery_items`.`category` AS `category`,`sid_gallery_items`.`treatment_id` AS `treatment_id`,`sid_gallery_items`.`display_order` AS `display_order`,`sid_gallery_items`.`is_active` AS `is_active`,`sid_gallery_items`.`created_at` AS `created_at`,`sid_gallery_items`.`updated_at` AS `updated_at` from `sid_gallery_items` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `lead_notes`
--

/*!50001 DROP VIEW IF EXISTS `lead_notes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `lead_notes` AS select `sid_lead_notes`.`id` AS `id`,`sid_lead_notes`.`entity_type` AS `entity_type`,`sid_lead_notes`.`entity_id` AS `entity_id`,`sid_lead_notes`.`user_id` AS `user_id`,`sid_lead_notes`.`user_name` AS `user_name`,`sid_lead_notes`.`note` AS `note`,`sid_lead_notes`.`is_system` AS `is_system`,`sid_lead_notes`.`created_at` AS `created_at` from `sid_lead_notes` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `media_files`
--

/*!50001 DROP VIEW IF EXISTS `media_files`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `media_files` AS select `sid_media_files`.`id` AS `id`,`sid_media_files`.`filename` AS `filename`,`sid_media_files`.`original_name` AS `original_name`,`sid_media_files`.`url` AS `url`,`sid_media_files`.`mime_type` AS `mime_type`,`sid_media_files`.`size_bytes` AS `size_bytes`,`sid_media_files`.`width` AS `width`,`sid_media_files`.`height` AS `height`,`sid_media_files`.`alt_text` AS `alt_text`,`sid_media_files`.`uploaded_by` AS `uploaded_by`,`sid_media_files`.`created_at` AS `created_at` from `sid_media_files` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `membership_plans`
--

/*!50001 DROP VIEW IF EXISTS `membership_plans`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `membership_plans` AS select `sid_membership_plans`.`id` AS `id`,`sid_membership_plans`.`slug` AS `slug`,`sid_membership_plans`.`name` AS `name`,`sid_membership_plans`.`price` AS `price`,`sid_membership_plans`.`price_formatted` AS `price_formatted`,`sid_membership_plans`.`period` AS `period`,`sid_membership_plans`.`validity` AS `validity`,`sid_membership_plans`.`tagline` AS `tagline`,`sid_membership_plans`.`is_popular` AS `is_popular`,`sid_membership_plans`.`features` AS `features`,`sid_membership_plans`.`card_bg` AS `card_bg`,`sid_membership_plans`.`pass_gradient` AS `pass_gradient`,`sid_membership_plans`.`badge_style` AS `badge_style`,`sid_membership_plans`.`button_style` AS `button_style`,`sid_membership_plans`.`accent_text` AS `accent_text`,`sid_membership_plans`.`display_order` AS `display_order`,`sid_membership_plans`.`is_active` AS `is_active`,`sid_membership_plans`.`subscribers_count` AS `subscribers_count`,`sid_membership_plans`.`created_at` AS `created_at`,`sid_membership_plans`.`updated_at` AS `updated_at` from `sid_membership_plans` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `menu_items`
--

/*!50001 DROP VIEW IF EXISTS `menu_items`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `menu_items` AS select `sid_menu_items`.`id` AS `id`,`sid_menu_items`.`menu_key` AS `menu_key`,`sid_menu_items`.`parent_id` AS `parent_id`,`sid_menu_items`.`label` AS `label`,`sid_menu_items`.`url` AS `url`,`sid_menu_items`.`icon` AS `icon`,`sid_menu_items`.`badge` AS `badge`,`sid_menu_items`.`open_in_new_tab` AS `open_in_new_tab`,`sid_menu_items`.`meta` AS `meta`,`sid_menu_items`.`display_order` AS `display_order`,`sid_menu_items`.`is_active` AS `is_active`,`sid_menu_items`.`created_at` AS `created_at`,`sid_menu_items`.`updated_at` AS `updated_at` from `sid_menu_items` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `offer_treatments`
--

/*!50001 DROP VIEW IF EXISTS `offer_treatments`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `offer_treatments` AS select `sid_offer_treatments`.`offer_id` AS `offer_id`,`sid_offer_treatments`.`treatment_id` AS `treatment_id` from `sid_offer_treatments` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `offers`
--

/*!50001 DROP VIEW IF EXISTS `offers`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `offers` AS select `sid_offers`.`id` AS `id`,`sid_offers`.`legacy_id` AS `legacy_id`,`sid_offers`.`title` AS `title`,`sid_offers`.`badge` AS `badge`,`sid_offers`.`description` AS `description`,`sid_offers`.`image` AS `image`,`sid_offers`.`link_text` AS `link_text`,`sid_offers`.`slug` AS `slug`,`sid_offers`.`coupon_id` AS `coupon_id`,`sid_offers`.`valid_from` AS `valid_from`,`sid_offers`.`valid_to` AS `valid_to`,`sid_offers`.`display_order` AS `display_order`,`sid_offers`.`is_active` AS `is_active`,`sid_offers`.`created_at` AS `created_at`,`sid_offers`.`updated_at` AS `updated_at` from `sid_offers` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `permissions`
--

/*!50001 DROP VIEW IF EXISTS `permissions`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `permissions` AS select `sid_permissions`.`id` AS `id`,`sid_permissions`.`code` AS `code`,`sid_permissions`.`module` AS `module`,`sid_permissions`.`action` AS `action`,`sid_permissions`.`label` AS `label` from `sid_permissions` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `press_mentions`
--

/*!50001 DROP VIEW IF EXISTS `press_mentions`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `press_mentions` AS select `sid_press_mentions`.`id` AS `id`,`sid_press_mentions`.`title` AS `title`,`sid_press_mentions`.`outlet` AS `outlet`,`sid_press_mentions`.`date_label` AS `date_label`,`sid_press_mentions`.`doctor` AS `doctor`,`sid_press_mentions`.`type` AS `type`,`sid_press_mentions`.`image` AS `image`,`sid_press_mentions`.`thumbnail` AS `thumbnail`,`sid_press_mentions`.`link` AS `link`,`sid_press_mentions`.`video_id` AS `video_id`,`sid_press_mentions`.`display_order` AS `display_order`,`sid_press_mentions`.`is_active` AS `is_active`,`sid_press_mentions`.`created_at` AS `created_at`,`sid_press_mentions`.`updated_at` AS `updated_at` from `sid_press_mentions` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `reviews`
--

/*!50001 DROP VIEW IF EXISTS `reviews`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `reviews` AS select `sid_reviews`.`id` AS `id`,`sid_reviews`.`legacy_id` AS `legacy_id`,`sid_reviews`.`reviewer_name` AS `reviewer_name`,`sid_reviews`.`initials` AS `initials`,`sid_reviews`.`avatar` AS `avatar`,`sid_reviews`.`rating` AS `rating`,`sid_reviews`.`review_text` AS `review_text`,`sid_reviews`.`treatment_tag` AS `treatment_tag`,`sid_reviews`.`branch` AS `branch`,`sid_reviews`.`source` AS `source`,`sid_reviews`.`verified` AS `verified`,`sid_reviews`.`review_date` AS `review_date`,`sid_reviews`.`display_order` AS `display_order`,`sid_reviews`.`is_active` AS `is_active`,`sid_reviews`.`created_at` AS `created_at`,`sid_reviews`.`updated_at` AS `updated_at` from `sid_reviews` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `role_permissions`
--

/*!50001 DROP VIEW IF EXISTS `role_permissions`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `role_permissions` AS select `sid_role_permissions`.`role_id` AS `role_id`,`sid_role_permissions`.`permission_id` AS `permission_id` from `sid_role_permissions` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `roles`
--

/*!50001 DROP VIEW IF EXISTS `roles`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `roles` AS select `sid_roles`.`id` AS `id`,`sid_roles`.`slug` AS `slug`,`sid_roles`.`name` AS `name`,`sid_roles`.`description` AS `description`,`sid_roles`.`is_system` AS `is_system`,`sid_roles`.`created_at` AS `created_at`,`sid_roles`.`updated_at` AS `updated_at` from `sid_roles` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `seo_pages`
--

/*!50001 DROP VIEW IF EXISTS `seo_pages`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `seo_pages` AS select `sid_seo_pages`.`id` AS `id`,`sid_seo_pages`.`path` AS `path`,`sid_seo_pages`.`name` AS `name`,`sid_seo_pages`.`meta_title` AS `meta_title`,`sid_seo_pages`.`meta_description` AS `meta_description`,`sid_seo_pages`.`meta_keywords` AS `meta_keywords`,`sid_seo_pages`.`og_title` AS `og_title`,`sid_seo_pages`.`og_description` AS `og_description`,`sid_seo_pages`.`og_image` AS `og_image`,`sid_seo_pages`.`canonical_url` AS `canonical_url`,`sid_seo_pages`.`robots` AS `robots`,`sid_seo_pages`.`schema_json` AS `schema_json`,`sid_seo_pages`.`include_in_sitemap` AS `include_in_sitemap`,`sid_seo_pages`.`sitemap_priority` AS `sitemap_priority`,`sid_seo_pages`.`sitemap_changefreq` AS `sitemap_changefreq`,`sid_seo_pages`.`is_active` AS `is_active`,`sid_seo_pages`.`created_at` AS `created_at`,`sid_seo_pages`.`updated_at` AS `updated_at` from `sid_seo_pages` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `settings`
--

/*!50001 DROP VIEW IF EXISTS `settings`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `settings` AS select `sid_settings`.`setting_key` AS `setting_key`,`sid_settings`.`setting_value` AS `setting_value`,`sid_settings`.`group_name` AS `group_name`,`sid_settings`.`updated_at` AS `updated_at` from `sid_settings` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `treatment_concerns`
--

/*!50001 DROP VIEW IF EXISTS `treatment_concerns`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `treatment_concerns` AS select `sid_treatment_concerns`.`treatment_id` AS `treatment_id`,`sid_treatment_concerns`.`concern_id` AS `concern_id` from `sid_treatment_concerns` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `treatments`
--

/*!50001 DROP VIEW IF EXISTS `treatments`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `treatments` AS select `sid_treatments`.`id` AS `id`,`sid_treatments`.`legacy_id` AS `legacy_id`,`sid_treatments`.`slug` AS `slug`,`sid_treatments`.`aliases` AS `aliases`,`sid_treatments`.`name` AS `name`,`sid_treatments`.`category_id` AS `category_id`,`sid_treatments`.`body_area` AS `body_area`,`sid_treatments`.`tags` AS `tags`,`sid_treatments`.`rating` AS `rating`,`sid_treatments`.`reviews_count` AS `reviews_count`,`sid_treatments`.`duration` AS `duration`,`sid_treatments`.`price` AS `price`,`sid_treatments`.`original_price` AS `original_price`,`sid_treatments`.`discount_badge` AS `discount_badge`,`sid_treatments`.`emi_months` AS `emi_months`,`sid_treatments`.`emi_monthly` AS `emi_monthly`,`sid_treatments`.`sessions_info` AS `sessions_info`,`sid_treatments`.`card_highlights` AS `card_highlights`,`sid_treatments`.`explained_subtitle` AS `explained_subtitle`,`sid_treatments`.`short_desc` AS `short_desc`,`sid_treatments`.`full_desc` AS `full_desc`,`sid_treatments`.`banner_image` AS `banner_image`,`sid_treatments`.`gallery_images` AS `gallery_images`,`sid_treatments`.`how_it_works` AS `how_it_works`,`sid_treatments`.`ideal_frequency` AS `ideal_frequency`,`sid_treatments`.`ideal_for` AS `ideal_for`,`sid_treatments`.`not_ideal_for` AS `not_ideal_for`,`sid_treatments`.`before_treatment` AS `before_treatment`,`sid_treatments`.`after_treatment` AS `after_treatment`,`sid_treatments`.`youtube_video_id` AS `youtube_video_id`,`sid_treatments`.`faqs` AS `faqs`,`sid_treatments`.`seo_title` AS `seo_title`,`sid_treatments`.`seo_description` AS `seo_description`,`sid_treatments`.`seo_keywords` AS `seo_keywords`,`sid_treatments`.`og_image` AS `og_image`,`sid_treatments`.`display_order` AS `display_order`,`sid_treatments`.`is_active` AS `is_active`,`sid_treatments`.`is_featured` AS `is_featured`,`sid_treatments`.`created_at` AS `created_at`,`sid_treatments`.`updated_at` AS `updated_at` from `sid_treatments` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `users`
--

/*!50001 DROP VIEW IF EXISTS `users`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `users` AS select `sid_users`.`id` AS `id`,`sid_users`.`name` AS `name`,`sid_users`.`email` AS `email`,`sid_users`.`phone` AS `phone`,`sid_users`.`password_hash` AS `password_hash`,`sid_users`.`role_id` AS `role_id`,`sid_users`.`avatar` AS `avatar`,`sid_users`.`status` AS `status`,`sid_users`.`last_login_at` AS `last_login_at`,`sid_users`.`token_version` AS `token_version`,`sid_users`.`created_at` AS `created_at`,`sid_users`.`updated_at` AS `updated_at` from `sid_users` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `videos`
--

/*!50001 DROP VIEW IF EXISTS `videos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `videos` AS select `sid_videos`.`id` AS `id`,`sid_videos`.`legacy_id` AS `legacy_id`,`sid_videos`.`title` AS `title`,`sid_videos`.`category` AS `category`,`sid_videos`.`youtube_id` AS `youtube_id`,`sid_videos`.`doctor_name` AS `doctor_name`,`sid_videos`.`type` AS `type`,`sid_videos`.`thumbnail` AS `thumbnail`,`sid_videos`.`quote` AS `quote`,`sid_videos`.`rating` AS `rating`,`sid_videos`.`display_order` AS `display_order`,`sid_videos`.`is_active` AS `is_active`,`sid_videos`.`created_at` AS `created_at`,`sid_videos`.`updated_at` AS `updated_at` from `sid_videos` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-27  8:05:10
