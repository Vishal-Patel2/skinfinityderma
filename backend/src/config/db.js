const mysql = require('mysql2/promise');
const config = require('./env');

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  decimalNumbers: true, // DECIMAL columns come back as numbers
  dateStrings: ['DATE'], // keep DATE columns as 'YYYY-MM-DD'
});

// Configure high max_allowed_packet on startup & ensure sid_offers schema
(async function initDbConfig() {
  try {
    await pool.query('SET GLOBAL max_allowed_packet = 67108864');
  } catch (e) {
    // Ignore if permission denied
  }

  try {
    // Check if category column exists in sid_offers
    const [cols] = await pool.query("SHOW COLUMNS FROM sid_offers LIKE 'category'");
    if (!cols || cols.length === 0) {
      await pool.query("ALTER TABLE sid_offers ADD COLUMN category VARCHAR(60) NOT NULL DEFAULT 'Skin' AFTER title");
      console.log('✅ Added category column to sid_offers');
    }

    // Check count of offers
    const [cntRows] = await pool.query('SELECT COUNT(*) AS total FROM sid_offers');
    const total = cntRows && cntRows[0] ? cntRows[0].total : 0;
    if (total < 10) {
      console.log(`ℹ️ Only ${total} offers found in sid_offers. Auto-populating 19 promotional packages...`);
      const defaultOffers = [
        ['offer-1', 'Free Doctor Skin & Hair Consultation', 'Skin', 'Limited Period', 'Comprehensive digital skin analysis and consultation with our senior MD Dermatologists at zero consultation fee.', '/images/offers/skinfinity-offer-1.png', 'Claim Consultation', '/contact-us#appointment_form', 1],
        ['offer-2', 'Full Body Laser Hair Reduction @ 30% OFF', 'Laser', 'Bestseller', 'US-FDA Soprano Titanium painless laser hair removal with continuous -4°C contact cooling for full body smoothness.', '/images/offers/skinfinity-offer-2.png', 'View Package', '/laser-hair-removal-noida', 2],
        ['offer-3', 'Signature Sugarcane HydraFacial MD @ ₹3,499', 'Skin', 'Instant Glass Glow', '7-step clinical hydradermabrasion infusing organic sugarcane AHA, peptides & hyaluronic acid.', '/images/offers/skinfinity-offer-3.png', 'Book HydraFacial', '/sugarcane-hydrafacial-noida', 3],
        ['offer-4', 'GFC Regenerative Hair Regrowth Package', 'Hair', 'Hair Fall Special', '3 sessions of advanced growth factor concentrate mesotherapy with complimentary scalp micro-needling.', '/images/offers/skinfinity-offer-4.png', 'Explore Hair Care', '/gfc-hair-growth-therapy-noida', 4],
        ['offer-5', 'Body Wellness Packages', 'Body', 'Holistic Care', 'Complete body toning, skin firming and lymphatic drainage packages designed for holistic wellness.', '/images/offers/skinfinity-offer-5.png', 'Explore Wellness', '/contact-us#appointment_form', 5],
        ['offer-6', 'Bridal Skin Preparation Luxury Package', 'Bridal', 'Bridal Special', 'Customized 60-day bridal skin glow ritual with HydraFacial MD, carbon laser peel & collagen boost.', '/images/offers/skinfinity-offer-6.png', 'Book Bridal Consult', '/contact-us#appointment_form', 6],
        ['offer-7', 'Special Bridal Luxury Packages', 'Bridal', 'Exclusive Glow', 'Curated pre-wedding dermatological sessions for brides and grooms with personalized skin therapists.', '/images/offers/skinfinity-offer-7.png', 'View Bridal Package', '/contact-us#appointment_form', 7],
        ['offer-8', 'Medical Facial Offers', 'Skin', 'Deep Cleansing', 'Clinical grade hydra-dermabrasion and customized medical facials targeted for acne, pores and pigmentation.', '/images/offers/skinfinity-offer-8.png', 'Claim Facial Offer', '/contact-us#appointment_form', 8],
        ['offer-9', 'Signature Facial Packages', 'Skin', 'Instant Glow', 'Multi-session medical facial packages infused with antioxidants, peptides and hyaluronic acid.', '/images/offers/skinfinity-offer-9.png', 'Explore Packages', '/contact-us#appointment_form', 9],
        ['offer-10', 'Fat Loss & Skin Tightening Treatment Plan', 'Body', 'Body Contouring', 'Non-invasive US-FDA radiofrequency body contouring, stubborn fat reduction and skin tightening.', '/images/offers/skinfinity-offer-10.png', 'View Plan Details', '/contact-us#appointment_form', 10],
        ['offer-11', 'Festive Hair Care Packages', 'Hair', 'Root Defense', 'Comprehensive festive packages for thinning hair, hair loss prevention and scalp rejuvenation.', '/images/offers/skinfinity-offer-11.png', 'Book Hair Consult', '/contact-us#appointment_form', 11],
        ['offer-12', 'Skinfinity All-In-One Festive Package', 'Skin', 'All-In-One', 'Full festive rejuvenation bundle combining laser toning, medical facial and vitamin infusion.', '/images/offers/skinfinity-offer-12.png', 'Claim Festive Bundle', '/contact-us#appointment_form', 12],
        ['offer-13', 'Dermal Fillers Festive Packages', 'Skin', 'Youth Restore', 'Precision hyaluronic acid dermal fillers for cheek contouring, lip enhancement and smile lines.', '/images/offers/skinfinity-offer-13.png', 'Book Consultation', '/contact-us#appointment_form', 13],
        ['offer-14', 'Dermal Fillers Special Offers', 'Skin', 'Natural Contour', 'US-FDA approved dermal fillers administered by certified senior dermatologists at special festive rates.', '/images/offers/skinfinity-offer-14.png', 'View Filler Offers', '/contact-us#appointment_form', 14],
        ['offer-15', 'GFC Therapy Festive Offer', 'Hair', 'Growth Booster', 'Pure autologous growth factor concentrate therapy for active hair regrowth and follicle strengthening.', '/images/offers/skinfinity-offer-15.png', 'Claim GFC Offer', '/contact-us#appointment_form', 15],
        ['offer-16', 'Hair Fall Control Festive Packages', 'Hair', 'Anti Hair Fall', 'Clinical protocols targeting DHT reduction, follicle stimulation and scalp cellular therapy.', '/images/offers/skinfinity-offer-16.png', 'Book Package', '/contact-us#appointment_form', 16],
        ['offer-17', 'US-FDA Laser Festive Offer', 'Laser', 'Painless ICE', 'Triple-wavelength Soprano Titanium laser hair reduction at special seasonal rates.', '/images/offers/skinfinity-offer-17.png', 'Claim Laser Offer', '/contact-us#appointment_form', 17],
        ['offer-18', 'Laser Hair Reduction Festive Packages', 'Laser', 'Permanent Reduction', 'Full body and combo laser hair removal packages with permanent follicle reduction.', '/images/offers/skinfinity-offer-18.png', 'Claim Package', '/contact-us#appointment_form', 18],
        ['offer-19', 'Hair Regain Booster Exclusive Offers', 'Hair', 'Cellular Boost', 'Multi-session hair regrowth booster packages with microneedling and peptide serums.', '/images/offers/skinfinity-offer-19.png', 'Book Regain Booster', '/contact-us#appointment_form', 19],
      ];
      for (const row of defaultOffers) {
        await pool.query(
          `INSERT INTO sid_offers (legacy_id, title, category, badge, description, image, link_text, slug, display_order, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
           ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), badge=VALUES(badge), description=VALUES(description), image=VALUES(image)`,
          row
        );
      }
      console.log('✅ Auto-populated 19 promotional offers into sid_offers');
    }
  } catch (err) {
    console.warn('⚠️ sid_offers startup check skipped/failed:', err.message);
  }

  // Ensure CRM tables and columns are automatically migrated on cloud boot (Render / Railway / Hostinger)
  try {
    const { runCrmMigration } = require('./init-crm-schema');
    await runCrmMigration();
    console.log('✅ CRM database schema initialized and up-to-date.');
  } catch (crmErr) {
    console.warn('CRM auto-init notice:', crmErr.message);
  }
})();

/** Run a query and return the rows. */
async function query(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

/** Run a query and return the first row (or null). */
async function one(sql, params) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

/**
 * Run `fn(q)` inside a transaction. `q(sql, params)` runs on the transaction connection.
 */
async function tx(fn) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const q = async (sql, params) => {
      const [rows] = await conn.query(sql, params);
      return rows;
    };
    const result = await fn(q);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { pool, query, one, tx };
