const express = require('express');
const { query, one, tx } = require('../config/db');
const { asyncHandler, HttpError } = require('../middleware/error');
const { cleanText, cleanPhone, isEmail, parseJson, absolutizeUploads } = require('../utils/helpers');

const router = express.Router();

// Cache headers helper
const setPublicCache = (res) => {
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
};

/**
 * GET /api/public/site
 * Consolidated site payload: settings, stats, clinics, menus, content blocks
 */
router.get(
  '/site',
  asyncHandler(async (req, res) => {
    setPublicCache(res);

    // Settings
    const settingRows = await query('SELECT setting_key, setting_value FROM settings');
    const settings = {};
    settingRows.forEach((r) => {
      settings[r.setting_key] = parseJson(r.setting_value, r.setting_value);
    });

    // Clinics
    const clinicRows = await query(
      `SELECT id, slug, city, title, address, landmark, pincode, phones, email, whatsapp,
              hours, map_embed_url, map_link, highlights, image, latitude, longitude
         FROM clinics WHERE is_active = 1 ORDER BY display_order ASC`
    );
    const clinics = clinicRows.map((c) => ({
      ...c,
      id: String(c.id),
      phones: parseJson(c.phones, []),
      highlights: parseJson(c.highlights, []),
    }));

    // Menus
    const menuRows = await query(
      `SELECT id, menu_key, parent_id, label, url, icon, badge, open_in_new_tab, meta, display_order
         FROM menu_items WHERE is_active = 1 ORDER BY display_order ASC`
    );
    const menus = {};
    menuRows.forEach((m) => {
      menus[m.menu_key] = menus[m.menu_key] || [];
      menus[m.menu_key].push({
        id: String(m.id),
        label: m.label,
        url: m.url,
        icon: m.icon,
        badge: m.badge,
        newTab: Boolean(m.open_in_new_tab),
        meta: parseJson(m.meta, null),
      });
    });

    // Content Blocks
    const blockRows = await query('SELECT block_key, content FROM content_blocks WHERE is_active = 1');
    const blocks = {};
    blockRows.forEach((b) => {
      blocks[b.block_key] = parseJson(b.content, b.content);
    });

    res.json({
      success: true,
      data: {
        settings: settings.general || {},
        seo: settings.seo || {},
        reviews: settings.reviews || {},
        stats: settings.stats || {},
        scripts: settings.scripts || {},
        clinics,
        menus,
        blocks,
      },
    });
  })
);

/**
 * GET /api/public/banners
 */
router.get(
  '/banners',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const location = req.query.location || 'Homepage Hero';
    const rows = await query(
      `SELECT id, title, subtitle, desktop_image, mobile_image, alt_text, button_text, button_url, location, display_order
         FROM banners WHERE is_active = 1 AND location = ? ORDER BY display_order ASC`,
      [location]
    );

    res.json({
      success: true,
      data: rows.map((r) => ({
        id: String(r.id),
        title: r.title,
        subtitle: r.subtitle,
        desktopImage: r.desktop_image,
        mobileImage: r.mobile_image,
        altText: r.alt_text,
        buttonText: r.button_text,
        buttonUrl: r.button_url,
        location: r.location,
        displayOrder: r.display_order,
      })),
    });
  })
);

/**
 * GET /api/public/categories
 */
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const rows = await query(
      `SELECT id, name, slug, description, thumbnail, display_order
         FROM categories WHERE is_active = 1 ORDER BY display_order ASC`
    );
    res.json({
      success: true,
      data: rows.map((r) => ({
        id: String(r.id),
        name: r.name,
        slug: r.slug,
        description: r.description,
        thumbnail: r.thumbnail,
        displayOrder: r.display_order,
      })),
    });
  })
);

/**
 * GET /api/public/treatments
 */
router.get(
  '/treatments',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const { category, featured, limit } = req.query;
    const where = ['t.is_active = 1'];
    const params = [];

    if (category && category !== 'All Treatments') {
      where.push('(c.name = ? OR c.slug = ?)');
      params.push(category, category);
    }
    if (featured === '1' || featured === 'true') {
      where.push('t.is_featured = 1');
    }

    const limitNum = parseInt(limit, 10) || 50;

    const rows = await query(
      `SELECT t.*, c.name AS category_name, c.slug AS category_slug
         FROM treatments t
         LEFT JOIN categories c ON c.id = t.category_id
        WHERE ${where.join(' AND ')}
        ORDER BY t.display_order ASC LIMIT ?`,
      [...params, limitNum]
    );

    const data = rows.map((r) => ({
      id: r.legacy_id || String(r.id),
      slug: r.slug,
      aliases: parseJson(r.aliases, []),
      name: r.name,
      category: r.category_name || 'General Dermatology',
      categorySlug: r.category_slug,
      bodyArea: r.body_area || 'Full Body',
      tags: parseJson(r.tags, []),
      rating: Number(r.rating) || 4.9,
      reviewsCount: r.reviews_count || 100,
      duration: r.duration || '60 mins',
      price: Number(r.price) || 0,
      priceFormatted: `₹${Number(r.price || 0).toLocaleString('en-IN')}`,
      originalPriceFormatted: r.original_price ? `₹${Number(r.original_price).toLocaleString('en-IN')}` : undefined,
      discountBadge: r.discount_badge || undefined,
      emiMonthly: r.emi_monthly ? `₹${Number(r.emi_monthly).toLocaleString('en-IN')}` : undefined,
      emiMonths: r.emi_months || 6,
      sessionsInfo: r.sessions_info || '1 Clinical Session',
      cardHighlights: parseJson(r.card_highlights, []),
      explainedSubtitle: r.explained_subtitle || '',
      shortDesc: r.short_desc || '',
      fullDesc: r.full_desc || '',
      bannerImage: r.banner_image || '',
      galleryImages: parseJson(r.gallery_images, []),
      howItWorksSteps: parseJson(r.how_it_works, []),
      idealFrequency: r.ideal_frequency || '',
      idealFor: parseJson(r.ideal_for, []),
      notIdealFor: parseJson(r.not_ideal_for, []),
      beforeTreatment: parseJson(r.before_treatment, []),
      afterTreatment: parseJson(r.after_treatment, []),
      youtubeVideoId: r.youtube_video_id || undefined,
      faqs: parseJson(r.faqs, []),
      seoTitle: r.seo_title,
      seoDescription: r.seo_description,
    }));

    res.json({ success: true, data });
  })
);

/**
 * GET /api/public/treatments/:slug
 */
router.get(
  '/treatments/:slug',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const { slug } = req.params;

    const row = await one(
      `SELECT t.*, c.name AS category_name, c.slug AS category_slug
         FROM treatments t
         LEFT JOIN categories c ON c.id = t.category_id
        WHERE t.is_active = 1
          AND (t.slug = ? OR t.legacy_id = ? OR JSON_CONTAINS(t.aliases, JSON_QUOTE(?)))
        LIMIT 1`,
      [slug, slug, slug]
    );

    if (!row) {
      throw new HttpError(404, 'Treatment not found');
    }

    const treatment = {
      id: row.legacy_id || String(row.id),
      slug: row.slug,
      aliases: parseJson(row.aliases, []),
      name: row.name,
      category: row.category_name || 'General Dermatology',
      categorySlug: row.category_slug,
      bodyArea: row.body_area || 'Full Body',
      tags: parseJson(row.tags, []),
      rating: Number(row.rating) || 4.9,
      reviewsCount: row.reviews_count || 100,
      duration: row.duration || '60 mins',
      price: Number(row.price) || 0,
      priceFormatted: `₹${Number(row.price || 0).toLocaleString('en-IN')}`,
      originalPriceFormatted: row.original_price ? `₹${Number(row.original_price).toLocaleString('en-IN')}` : undefined,
      discountBadge: row.discount_badge || undefined,
      emiMonthly: row.emi_monthly ? `₹${Number(row.emi_monthly).toLocaleString('en-IN')}` : undefined,
      emiMonths: row.emi_months || 6,
      sessionsInfo: row.sessions_info || '1 Clinical Session',
      cardHighlights: parseJson(row.card_highlights, []),
      explainedSubtitle: row.explained_subtitle || '',
      shortDesc: row.short_desc || '',
      fullDesc: row.full_desc || '',
      bannerImage: row.banner_image || '',
      galleryImages: parseJson(row.gallery_images, []),
      howItWorksSteps: parseJson(row.how_it_works, []),
      idealFrequency: row.ideal_frequency || '',
      idealFor: parseJson(row.ideal_for, []),
      notIdealFor: parseJson(row.not_ideal_for, []),
      beforeTreatment: parseJson(row.before_treatment, []),
      afterTreatment: parseJson(row.after_treatment, []),
      youtubeVideoId: row.youtube_video_id || undefined,
      faqs: parseJson(row.faqs, []),
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
    };

    // Related treatments
    const relatedRows = await query(
      `SELECT t.*, c.name AS category_name
         FROM treatments t
         LEFT JOIN categories c ON c.id = t.category_id
        WHERE t.is_active = 1 AND t.id <> ? AND t.category_id = ?
        LIMIT 4`,
      [row.id, row.category_id || 0]
    );

    const related = relatedRows.map((r) => ({
      id: r.legacy_id || String(r.id),
      slug: r.slug,
      name: r.name,
      category: r.category_name,
      priceFormatted: `₹${Number(r.price || 0).toLocaleString('en-IN')}`,
      bannerImage: r.banner_image,
      rating: Number(r.rating),
    }));

    res.json({ success: true, data: treatment, related });
  })
);

/**
 * GET /api/public/doctors
 */
router.get(
  '/doctors',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const rows = await query(
      `SELECT id, slug, name, role, qualifications, specialty, experience, image, bio,
              consultation_fee, available_locations, availability, display_order
         FROM doctors WHERE is_active = 1 ORDER BY display_order ASC`
    );

    res.json({
      success: true,
      data: rows.map((d) => ({
        id: d.slug || String(d.id),
        name: d.name,
        role: d.role,
        qualifications: d.qualifications,
        specialty: d.specialty,
        experience: d.experience,
        image: d.image,
        bio: d.bio,
        slug: d.slug,
        consultationFee: Number(d.consultation_fee) || 1000,
        availableLocations: parseJson(d.available_locations, ['Noida']),
        availability: d.availability,
      })),
    });
  })
);

/**
 * GET /api/public/reviews
 */
router.get(
  '/reviews',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const rows = await query(
      `SELECT id, reviewer_name, initials, avatar, rating, review_text, treatment_tag, branch, verified, review_date
         FROM reviews WHERE is_active = 1 ORDER BY display_order ASC, id DESC LIMIT 50`
    );

    const statsRow = await one(
      `SELECT setting_value FROM settings WHERE setting_key = 'reviews' LIMIT 1`
    );
    const stats = statsRow ? parseJson(statsRow.setting_value, {}) : { rating: 4.5, reviewCount: '4,500+' };

    res.json({
      success: true,
      data: rows.map((r) => ({
        id: String(r.id),
        patientName: r.reviewer_name,
        initials: r.initials || r.reviewer_name.slice(0, 2).toUpperCase(),
        rating: r.rating,
        reviewText: r.review_text,
        treatment: r.treatment_tag || 'Skin Treatment',
        clinicLocation: r.branch || 'Noida Clinic',
        verified: Boolean(r.verified),
        reviewDate: r.review_date,
      })),
      meta: { stats },
    });
  })
);

/**
 * GET /api/public/results (Before/After)
 */
router.get(
  '/results',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const rows = await query(
      `SELECT id, legacy_id, patient_name, treatment, description, before_image, after_image, results_type, timeframe
         FROM before_after_cases
        WHERE is_active = 1 AND has_patient_consent = 1 AND approval_status = 'Approved'
        ORDER BY display_order ASC`
    );

    res.json({
      success: true,
      data: rows.map((r) => ({
        id: r.legacy_id || String(r.id),
        patientName: r.patient_name || 'Verified Patient',
        treatment: r.treatment,
        description: r.description,
        beforeImage: r.before_image,
        image: r.after_image,
        resultsType: r.results_type || 'Clinical Results',
        timeframe: r.timeframe || '',
      })),
    });
  })
);

/**
 * GET /api/public/offers
 */
router.get(
  '/offers',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const rows = await query(
      `SELECT o.*, c.code AS coupon_code, c.discount_type, c.discount_value
         FROM offers o
         LEFT JOIN coupons c ON c.id = o.coupon_id
        WHERE o.is_active = 1
        ORDER BY o.display_order ASC`
    );

    res.json({
      success: true,
      data: rows.map((o) => ({
        id: o.legacy_id || String(o.id),
        title: o.title,
        badge: o.badge || 'Special Offer',
        desc: o.description,
        image: o.image,
        linkText: o.link_text || 'Claim Offer',
        slug: o.slug ? o.slug.replace(/^\//, '') : 'book-appointment',
        couponCode: o.coupon_code || undefined,
        discountType: o.discount_type,
        discountValue: o.discount_value,
      })),
    });
  })
);

/**
 * GET /api/public/memberships
 */
router.get(
  '/memberships',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const rows = await query(
      `SELECT * FROM membership_plans WHERE is_active = 1 ORDER BY display_order ASC`
    );
    res.json({
      success: true,
      data: rows.map((m) => ({
        id: m.slug || String(m.id),
        slug: m.slug,
        name: m.name,
        price: m.price ? `₹${Number(m.price).toLocaleString('en-IN')}` : m.price_formatted,
        rawPrice: Number(m.price),
        period: m.period,
        validity: m.validity,
        tagline: m.tagline,
        popular: Boolean(m.is_popular),
        features: parseJson(m.features, []),
        cardBg: m.card_bg,
        passGradient: m.pass_gradient,
        badgeStyle: m.badge_style,
        buttonStyle: m.button_style,
        accentText: m.accent_text,
        subscribersCount: m.subscribers_count,
      })),
    });
  })
);

/**
 * GET /api/public/faqs
 */
router.get(
  '/faqs',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const scope = req.query.scope || 'home';
    const rows = await query(
      `SELECT id, scope, question, answer FROM faqs WHERE is_active = 1 AND (scope = ? OR scope = 'general') ORDER BY display_order ASC`,
      [scope]
    );

    res.json({
      success: true,
      data: rows.map((f) => ({
        id: String(f.id),
        question: f.question,
        answer: f.answer,
      })),
    });
  })
);

/**
 * GET /api/public/seo?path=/treatments
 */
router.get(
  '/seo',
  asyncHandler(async (req, res) => {
    const p = req.query.path || '/';
    const cleanPath = p.startsWith('/') ? p : `/${p}`;

    const row = await one(
      `SELECT * FROM seo_pages WHERE is_active = 1 AND (path = ? OR path = ?) LIMIT 1`,
      [cleanPath, cleanPath.replace(/\/$/, '') || '/']
    );

    if (!row) {
      return res.json({ success: true, data: null });
    }

    res.json({
      success: true,
      data: {
        title: row.meta_title,
        description: row.meta_description,
        keywords: row.meta_keywords ? row.meta_keywords.split(',').map((s) => s.trim()) : [],
        ogTitle: row.og_title || row.meta_title,
        ogDescription: row.og_description || row.meta_description,
        ogImage: row.og_image,
        canonical: row.canonical_url,
        robots: row.robots,
        schema: parseJson(row.schema_json, null),
      },
    });
  })
);

/**
 * GET /api/public/sitemap
 */
router.get(
  '/sitemap',
  asyncHandler(async (req, res) => {
    const seoRows = await query(
      `SELECT path, sitemap_priority, sitemap_changefreq, updated_at
         FROM seo_pages WHERE is_active = 1 AND include_in_sitemap = 1`
    );

    const treatRows = await query(
      `SELECT slug, updated_at FROM treatments WHERE is_active = 1`
    );

    const items = [
      ...seoRows.map((r) => ({
        path: r.path,
        priority: Number(r.sitemap_priority) || 0.8,
        changefreq: r.sitemap_changefreq || 'weekly',
        lastmod: r.updated_at,
      })),
      ...treatRows.map((t) => ({
        path: `/${t.slug}/`,
        priority: 0.9,
        changefreq: 'weekly',
        lastmod: t.updated_at,
      })),
    ];

    res.json({ success: true, data: items });
  })
);

/**
 * POST /api/public/coupons/validate
 * Validates a coupon code against a subtotal and treatment slugs
 */
router.post(
  '/coupons/validate',
  asyncHandler(async (req, res) => {
    const { code, treatmentSlugs = [], subtotal = 0 } = req.body;
    if (!code) throw new HttpError(400, 'Coupon code is required');

    const cleanCode = code.trim().toUpperCase();
    const coupon = await one(
      `SELECT * FROM coupons WHERE UPPER(code) = ? AND is_active = 1 LIMIT 1`,
      [cleanCode]
    );

    if (!coupon) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Invalid coupon code. Try 'DERMA10' or 'VIP20'.",
      });
    }

    const orderAmt = Number(subtotal) || 0;
    if (coupon.min_order && orderAmt < Number(coupon.min_order)) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `This coupon requires a minimum booking value of ₹${Number(coupon.min_order).toLocaleString('en-IN')}`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percent') {
      discount = Math.round((orderAmt * Number(coupon.discount_value)) / 100);
      if (coupon.max_discount && discount > Number(coupon.max_discount)) {
        discount = Number(coupon.max_discount);
      }
    } else {
      discount = Math.min(orderAmt, Number(coupon.discount_value));
    }

    const finalAmount = Math.max(0, orderAmt - discount);

    res.json({
      success: true,
      valid: true,
      data: {
        code: coupon.code,
        title: coupon.title,
        discountType: coupon.discount_type,
        discountValue: Number(coupon.discount_value),
        discountAmount: discount,
        finalAmount,
        message: `${coupon.title} Applied! You saved ₹${discount.toLocaleString('en-IN')}`,
      },
    });
  })
);

/**
 * POST /api/public/appointments
 */
router.post(
  '/appointments',
  asyncHandler(async (req, res) => {
    const {
      name,
      patientName,
      phone,
      patientPhone,
      email,
      patientEmail,
      gender,
      age,
      clinic,
      clinicBranch,
      doctor,
      doctorName,
      treatmentSlug,
      service,
      treatmentName,
      date,
      appointmentDate,
      time,
      timeSlot,
      visitType,
      notes,
      couponCode,
      source,
      paymentStatus,
      transactionId,
      amount,
    } = req.body;

    const finalName = name || patientName;
    const finalPhone = phone || patientPhone;
    const finalEmail = email || patientEmail;
    const finalClinic = clinic || clinicBranch;
    const finalDoctor = doctor || doctorName;
    const finalService = service || treatmentName;
    const finalDate = date || appointmentDate;
    const finalTime = time || timeSlot;

    if (!finalName) throw new HttpError(400, 'Full name is required');
    if (!finalPhone) throw new HttpError(400, 'Phone number is required');

    const cleanP = cleanPhone(finalPhone);
    if (!cleanP) throw new HttpError(400, 'Valid 10-digit phone number is required');

    // Find clinic if specified
    let clinicId = null;
    if (finalClinic) {
      const cRow = await one(
        `SELECT id FROM clinics WHERE slug = ? OR city = ? OR title LIKE ? LIMIT 1`,
        [finalClinic, finalClinic, `%${finalClinic}%`]
      );
      if (cRow) clinicId = cRow.id;
    }

    // Find doctor if specified
    let doctorId = null;
    if (finalDoctor) {
      const dRow = await one(
        `SELECT id FROM doctors WHERE slug = ? OR name LIKE ? LIMIT 1`,
        [finalDoctor, `%${finalDoctor}%`]
      );
      if (dRow) doctorId = dRow.id;
    }

    // Find treatment if specified
    let treatmentId = null;
    if (treatmentSlug) {
      const tRow = await one(
        `SELECT id, name, price FROM treatments WHERE slug = ? OR legacy_id = ? LIMIT 1`,
        [treatmentSlug, treatmentSlug]
      );
      if (tRow) treatmentId = tRow.id;
    }

    const apptNo = `SKF-${Date.now().toString().slice(-6)}`;
    const apptDate = finalDate || new Date().toISOString().slice(0, 10);
    const apptTime = finalTime || '11:00';

    const insertResult = await query(
      `INSERT INTO appointments (
        appointment_no, patient_name, phone, email, gender, age, clinic_id, doctor_id,
        treatment_id, service_name, appointment_date, appointment_time, visit_type,
        notes, source, coupon_code, status, ip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        apptNo,
        cleanText(finalName, 120),
        cleanP,
        cleanText(finalEmail, 120),
        gender || 'Female',
        age ? parseInt(age, 10) : 30,
        clinicId,
        doctorId,
        treatmentId,
        cleanText(finalService || (treatmentSlug ? treatmentSlug.replace(/-/g, ' ') : 'Consultation'), 180),
        apptDate,
        apptTime,
        visitType || 'new',
        cleanText(notes, 500),
        cleanText(source || 'website-form', 80),
        cleanText(couponCode, 40),
        (req.headers['x-forwarded-for'] || req.ip || '').slice(0, 60),
      ]
    );

    res.status(201).json({
      success: true,
      data: {
        appointmentNo: apptNo,
        id: String(insertResult.insertId),
        status: 'pending',
        message: 'Appointment booked successfully! Our clinic coordinator will contact you shortly.',
      },
    });
  })
);

/**
 * POST /api/public/enquiries
 * Handles Contact Form, Franchise, EMI, Skin Analyser, Hair Calculator leads
 */
router.post(
  '/enquiries',
  asyncHandler(async (req, res) => {
    const { type = 'contact', name, phone, email, city, location, subject, service, message, treatmentSlug, source, extra } = req.body;
    const finalCity = city || location;
    const finalSubject = subject || service;

    if (!name) throw new HttpError(400, 'Name is required');
    if (!phone) throw new HttpError(400, 'Phone is required');

    const cleanP = cleanPhone(phone);
    if (!cleanP) throw new HttpError(400, 'Valid 10-digit phone number is required');

    const enqNo = `ENQ-${Date.now().toString().slice(-6)}`;

    const insertResult = await query(
      `INSERT INTO enquiries (
        enquiry_no, type, name, phone, email, city, subject, message,
        source, extra, status, ip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
      [
        enqNo,
        type,
        cleanText(name, 120),
        cleanP,
        cleanText(email, 120),
        cleanText(finalCity, 80),
        cleanText(finalSubject, 180),
        cleanText(message, 1000),
        cleanText(source || 'website', 120),
        extra ? JSON.stringify(extra) : null,
        (req.headers['x-forwarded-for'] || req.ip || '').slice(0, 60),
      ]
    );

    res.status(201).json({
      success: true,
      data: {
        enquiryNo: enqNo,
        id: String(insertResult.insertId),
        message: 'Enquiry submitted successfully! Our expert will get in touch with you shortly.',
      },
    });
  })
);

module.exports = router;
