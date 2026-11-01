const express = require('express');
const { query, one, tx } = require('../config/db');
const { asyncHandler, HttpError } = require('../middleware/error');
const { cleanText, cleanPhone, isEmail, parseJson, absolutizeUploads } = require('../utils/helpers');
const { createNotification } = require('../utils/notifications');

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
    const settingRows = await query('SELECT setting_key, setting_value FROM sid_settings');
    const settings = {};
    settingRows.forEach((r) => {
      settings[r.setting_key] = parseJson(r.setting_value, r.setting_value);
    });

    // Clinics
    const clinicRows = await query(
      `SELECT id, slug, city, title, address, landmark, pincode, phones, email, whatsapp,
              hours, map_embed_url, map_link, highlights, image, latitude, longitude
         FROM sid_clinics WHERE is_active = 1 ORDER BY display_order ASC`
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
         FROM sid_menu_items WHERE is_active = 1 ORDER BY display_order ASC`
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
    const blockRows = await query('SELECT block_key, content FROM sid_content_blocks WHERE is_active = 1');
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
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    const rows = await query(
      `SELECT id, desktop_image, mobile_image, display_order
         FROM sid_banners WHERE is_active = 1 ORDER BY display_order ASC`
    );

    res.json({
      success: true,
      data: rows.map((r) => ({
        id: String(r.id),
        desktopImage: r.desktop_image,
        mobileImage: r.mobile_image || r.desktop_image,
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
         FROM sid_categories WHERE is_active = 1 ORDER BY display_order ASC`
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
         FROM sid_treatments t
         LEFT JOIN sid_categories c ON c.id = t.category_id
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
         FROM sid_treatments t
         LEFT JOIN sid_categories c ON c.id = t.category_id
        WHERE t.is_active = 1
          AND (t.slug = ? OR t.legacy_id = ? OR JSON_CONTAINS(t.aliases, JSON_QUOTE(?)))
        LIMIT 1`,
      [slug, slug, slug]
    );

    if (!row) {
      throw new HttpError(404, 'Treatment not found');
    }

    let gallery = parseJson(row.gallery_images, []);
    if (!Array.isArray(gallery)) gallery = [];
    if (row.sub_image_1 && !gallery.some((g) => g.src === row.sub_image_1)) {
      gallery.push({ src: row.sub_image_1, caption: 'Sub-image 1' });
    }
    if (row.sub_image_2 && !gallery.some((g) => g.src === row.sub_image_2)) {
      gallery.push({ src: row.sub_image_2, caption: 'Sub-image 2' });
    }
    if (row.sub_image_3 && !gallery.some((g) => g.src === row.sub_image_3)) {
      gallery.push({ src: row.sub_image_3, caption: 'Sub-image 3' });
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
      imageAltText: row.image_alt_text,
      subImage1: row.sub_image_1,
      subImage2: row.sub_image_2,
      subImage3: row.sub_image_3,
      galleryImages: gallery,
      videoUrl: row.video_url || (row.youtube_video_id ? `https://www.youtube.com/watch?v=${row.youtube_video_id}` : undefined),
      videoTitle: row.video_title,
      videoThumbnail: row.video_thumbnail,
      youtubeVideoId: row.youtube_video_id || undefined,
      benefits: parseJson(row.benefits, []),
      howItWorksSteps: parseJson(row.procedure_steps, null) || parseJson(row.how_it_works, []),
      idealFrequency: row.ideal_frequency || '',
      idealFor: parseJson(row.ideal_for, []),
      notIdealFor: parseJson(row.not_ideal_for, []),
      beforeTreatment: parseJson(row.before_treatment, []),
      afterTreatment: parseJson(row.after_treatment, []),
      expectedResults: row.expected_results,
      recoveryInfo: row.recovery_info,
      precautions: row.precautions,
      faqs: parseJson(row.faqs, []),
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      canonicalUrl: row.canonical_url,
    };

    // Related treatments
    const relatedRows = await query(
      `SELECT t.*, c.name AS category_name
         FROM sid_treatments t
         LEFT JOIN sid_categories c ON c.id = t.category_id
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
         FROM sid_doctors WHERE is_active = 1 ORDER BY display_order ASC`
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
         FROM sid_reviews WHERE is_active = 1 ORDER BY display_order ASC, id DESC LIMIT 50`
    );

    const statsRow = await one(
      `SELECT setting_value FROM sid_settings WHERE setting_key = 'reviews' LIMIT 1`
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
         FROM sid_before_after_cases
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
         FROM sid_offers o
         LEFT JOIN sid_coupons c ON c.id = o.coupon_id
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
      `SELECT * FROM sid_membership_plans WHERE is_active = 1 ORDER BY display_order ASC`
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
      `SELECT id, scope, question, answer FROM sid_faqs WHERE is_active = 1 AND (scope = ? OR scope = 'general') ORDER BY display_order ASC`,
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
      `SELECT * FROM sid_seo_pages WHERE is_active = 1 AND (path = ? OR path = ?) LIMIT 1`,
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
         FROM sid_seo_pages WHERE is_active = 1 AND include_in_sitemap = 1`
    );

    const treatRows = await query(
      `SELECT slug, updated_at FROM sid_treatments WHERE is_active = 1`
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
      `SELECT * FROM sid_coupons WHERE UPPER(code) = ? AND is_active = 1 LIMIT 1`,
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
 * GET /api/public/blogs
 */
router.get(
  '/blogs',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const { category, limit = 20 } = req.query;
    const where = ['is_published = 1'];
    const params = [];
    if (category) {
      where.push('category = ?');
      params.push(category);
    }
    const rows = await query(
      `SELECT id, slug, title, excerpt, featured_image, category, author_name, tags, published_at, created_at
         FROM sid_blogs WHERE ${where.join(' AND ')} ORDER BY published_at DESC LIMIT ?`,
      [...params, parseInt(limit, 10)]
    );
    res.json({
      success: true,
      data: rows.map((b) => ({
        id: String(b.id),
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        featuredImage: b.featured_image,
        category: b.category,
        authorName: b.author_name,
        tags: parseJson(b.tags, []),
        publishedAt: b.published_at,
        createdAt: b.created_at,
      })),
    });
  })
);

/**
 * GET /api/public/blogs/:slug
 */
router.get(
  '/blogs/:slug',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const { slug } = req.params;
    const b = await one('SELECT * FROM sid_blogs WHERE slug = ? AND is_published = 1 LIMIT 1', [slug]);
    if (!b) throw new HttpError(404, 'Article not found');
    await query('UPDATE sid_blogs SET views_count = views_count + 1 WHERE id = ?', [b.id]);
    res.json({
      success: true,
      data: {
        id: String(b.id),
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        featuredImage: b.featured_image,
        category: b.category,
        authorName: b.author_name,
        tags: parseJson(b.tags, []),
        publishedAt: b.published_at,
        createdAt: b.created_at,
      },
    });
  })
);

/**
 * GET /api/public/appointments/slots
 * Generates available appointment slots preventing double bookings and checking holidays
 */
router.get(
  '/appointments/slots',
  asyncHandler(async (req, res) => {
    const { clinicId = 1, date } = req.query;
    const targetDate = date || new Date().toISOString().slice(0, 10);
    const targetClinicId = parseInt(clinicId, 10) || 1;

    // Check holiday
    const holiday = await one(
      `SELECT title FROM sid_clinic_holidays WHERE (clinic_id = ? OR clinic_id IS NULL) AND holiday_date = ? LIMIT 1`,
      [targetClinicId, targetDate]
    );

    if (holiday) {
      return res.json({
        success: true,
        data: {
          available: false,
          isHoliday: true,
          holidayTitle: holiday.title,
          message: `Clinic is closed for ${holiday.title}`,
          slots: [],
          morning: [],
          afternoon: [],
          evening: [],
        },
      });
    }

    // Get clinic settings
    const clinic = await one('SELECT slot_start, slot_end, slot_minutes, slot_capacity, weekly_off FROM sid_clinics WHERE id = ?', [targetClinicId]);
    const slotStart = (clinic && clinic.slot_start) || '10:00';
    const slotEnd = (clinic && clinic.slot_end) || '20:00';
    const slotMinutes = (clinic && clinic.slot_minutes) || 30;
    const capacity = (clinic && clinic.slot_capacity) || 2;

    // Existing active bookings for this clinic & date
    const booked = await query(
      `SELECT appointment_time, COUNT(*) AS count
         FROM sid_appointments
        WHERE clinic_id = ? AND appointment_date = ? AND status NOT IN ('cancelled', 'no_show')
        GROUP BY appointment_time`,
      [targetClinicId, targetDate]
    );
    const bookedMap = new Map(booked.map((b) => [b.appointment_time, b.count]));

    // Generate intervals
    const [startH, startM] = slotStart.split(':').map(Number);
    const [endH, endM] = slotEnd.split(':').map(Number);
    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const availableSlots = [];
    const morning = [];
    const afternoon = [];
    const evening = [];

    while (currentMinutes < endMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      const time24 = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      
      // Skip lunch break (14:00 - 15:00)
      if (h !== 14) {
        const currentCount = bookedMap.get(time24) || 0;
        if (currentCount < capacity) {
          const mer = h >= 12 ? 'PM' : 'AM';
          const h12 = h % 12 === 0 ? 12 : h % 12;
          const label = `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${mer}`;

          const slotObj = { time: time24, label, availableCapacity: capacity - currentCount };
          availableSlots.push(slotObj);

          if (h < 12) morning.push(slotObj);
          else if (h < 17) afternoon.push(slotObj);
          else evening.push(slotObj);
        }
      }
      currentMinutes += slotMinutes;
    }

    res.json({
      success: true,
      data: {
        available: true,
        isHoliday: false,
        clinicId: targetClinicId,
        date: targetDate,
        totalSlots: availableSlots.length,
        slots: availableSlots,
        morning,
        afternoon,
        evening,
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
    let clinicId = 1;
    if (finalClinic) {
      const cRow = await one(
        `SELECT id FROM sid_clinics WHERE slug = ? OR city = ? OR title LIKE ? LIMIT 1`,
        [finalClinic, finalClinic, `%${finalClinic}%`]
      );
      if (cRow) clinicId = cRow.id;
    }

    // Find doctor if specified
    let doctorId = null;
    if (finalDoctor) {
      const dRow = await one(
        `SELECT id FROM sid_doctors WHERE slug = ? OR name LIKE ? LIMIT 1`,
        [finalDoctor, `%${finalDoctor}%`]
      );
      if (dRow) doctorId = dRow.id;
    }

    // Find treatment if specified
    let treatmentId = null;
    let treatmentPrice = 0;
    if (treatmentSlug) {
      const tRow = await one(
        `SELECT id, name, price FROM sid_treatments WHERE slug = ? OR legacy_id = ? LIMIT 1`,
        [treatmentSlug, treatmentSlug]
      );
      if (tRow) {
        treatmentId = tRow.id;
        treatmentPrice = Number(tRow.price) || 0;
      }
    }

    const apptNo = `SKF-${Date.now().toString().slice(-6)}`;
    const apptDate = finalDate || new Date().toISOString().slice(0, 10);
    const apptTime = finalTime || '11:00';

    // Prevent double bookings beyond clinic slot capacity
    const countRow = await one(
      `SELECT COUNT(*) AS total FROM sid_appointments
        WHERE clinic_id = ? AND appointment_date = ? AND appointment_time = ?
          AND status NOT IN ('cancelled', 'no_show')`,
      [clinicId, apptDate, apptTime]
    );

    const clinicRow = await one('SELECT slot_capacity FROM sid_clinics WHERE id = ?', [clinicId]);
    const maxCapacity = (clinicRow && clinicRow.slot_capacity) || 2;

    if (countRow && countRow.total >= maxCapacity) {
      throw new HttpError(409, `The requested appointment slot (${apptTime} on ${apptDate}) has reached maximum patient capacity. Please choose another slot.`);
    }

    // Automatically sync patient profile in sid_patients
    let patientId = null;
    try {
      const clean10 = cleanP.slice(-10);
      const existingPatient = await one(
        'SELECT id, name FROM sid_patients WHERE phone = ? OR phone LIKE ? LIMIT 1',
        [cleanP, `%${clean10}`]
      );
      if (existingPatient) {
        patientId = existingPatient.id;
      } else {
        const code = 'PAT-' + Math.floor(100000 + Math.random() * 900000);
        const ins = await query(
          `INSERT INTO sid_patients (patient_code, name, email, phone, gender, age)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [code, cleanText(finalName, 120), cleanText(finalEmail, 120) || null, cleanP, gender || 'Female', age ? parseInt(age, 10) : 30]
        );
        patientId = ins.insertId;
      }
    } catch (e) {
      console.warn('Patient auto-sync note:', e.message);
    }

    const insertResult = await query(
      `INSERT INTO sid_appointments (
        appointment_no, patient_id, patient_name, phone, email, gender, age, clinic_id, doctor_id,
        treatment_id, service_name, appointment_date, appointment_time, visit_type,
        amount_estimate, notes, source, coupon_code, status, ip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        apptNo,
        patientId,
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
        treatmentPrice || 1000,
        cleanText(notes, 500),
        cleanText(source || 'website-form', 80),
        cleanText(couponCode, 40),
        (req.headers['x-forwarded-for'] || req.ip || '').slice(0, 60),
      ]
    );

    // Create Notification for Clinic Reception & Doctors
    await createNotification({
      type: 'appointment_new',
      title: 'New Online Booking Received',
      message: `${finalName} booked for ${finalService || 'Consultation'} on ${apptDate} at ${apptTime}`,
      link: '/appointments.html',
      channel: 'in_app',
    });

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
    const { type = 'contact', name, phone, email, city, location, subject, service, message, source, extra } = req.body;
    const finalCity = city || location;
    const finalSubject = subject || service;

    if (!name) throw new HttpError(400, 'Name is required');
    if (!phone) throw new HttpError(400, 'Phone is required');

    const cleanP = cleanPhone(phone);
    if (!cleanP) throw new HttpError(400, 'Valid 10-digit phone number is required');

    const enqNo = `ENQ-${Date.now().toString().slice(-6)}`;

    const insertResult = await query(
      `INSERT INTO sid_enquiries (
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

    // Create Notification for Clinic Staff
    await createNotification({
      type: 'enquiry_new',
      title: `New ${type.toUpperCase()} Lead Received`,
      message: `${name} (${cleanP}) submitted enquiry: ${finalSubject || 'General Inquiry'}`,
      link: '/enquiries.html',
      channel: 'in_app',
    });

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

/**
 * GET /api/public/homepage
 * Complete section-wise dynamic homepage content
 */
router.get(
  '/homepage',
  asyncHandler(async (req, res) => {
    setPublicCache(res);

    // 1. Sections metadata
    const secRows = await query('SELECT * FROM sid_homepage_sections WHERE is_active = 1 ORDER BY display_order ASC');
    const sections = {};
    secRows.forEach(s => {
      sections[s.section_key] = {
        title: s.title,
        subtitle: s.subtitle,
        badgeText: s.badge_text,
        description: s.description,
        mediaUrl: s.media_url,
        mediaAlt: s.media_alt,
        buttonText: s.button_text,
        buttonUrl: s.button_url,
        secondaryButtonText: s.secondary_button_text,
        secondaryButtonUrl: s.secondary_button_url,
        extra: parseJson(s.extra_json, {})
      };
    });

    // 2. Section items (trust ticker, pillars, etc.)
    const itemRows = await query('SELECT * FROM sid_homepage_items WHERE is_active = 1 ORDER BY display_order ASC');
    const items = {};
    itemRows.forEach(i => {
      items[i.section_key] = items[i.section_key] || [];
      items[i.section_key].push({
        id: String(i.id),
        title: i.title,
        subtitle: i.subtitle,
        description: i.description,
        icon: i.icon,
        imageUrl: i.image_url,
        linkUrl: i.link_url,
        badge: i.badge,
        extra: parseJson(i.extra_data, {})
      });
    });

    // 3. Hero Banners
    const banners = await query('SELECT id, desktop_image, mobile_image, display_order FROM sid_banners WHERE is_active = 1 ORDER BY display_order ASC');

    // 4. Clinics
    const clinics = await query('SELECT * FROM sid_clinics WHERE is_active = 1 ORDER BY display_order ASC');

    res.json({
      success: true,
      data: {
        sections,
        items,
        banners: banners.map(b => ({
          id: String(b.id),
          desktopImage: b.desktop_image,
          mobileImage: b.mobile_image || b.desktop_image,
          displayOrder: b.display_order,
        })),
        trustTicker: items['trust_ticker'] || [],
        aboutClinic: {
          ...(sections['about_clinic'] || {}),
          pillars: items['about_clinic_pillars'] || []
        },
        doctorFounder: sections['doctor_founder'] || {},
        diagnosticTools: sections['diagnostic_tools'] || {},
        franchiseBanner: sections['franchise_banner'] || {},
        clinics: clinics.map(c => ({
          id: String(c.id),
          slug: c.slug,
          city: c.city,
          title: c.title,
          address: c.address,
          phones: parseJson(c.phones, []),
          email: c.email,
          hours: c.hours,
          mapEmbedUrl: c.map_embed_url,
          image: c.image
        }))
      }
    });
  })
);

/**
 * GET /api/public/doctors/:slug
 */
router.get(
  '/doctors/:slug',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const { slug } = req.params;
    const d = await one('SELECT * FROM sid_doctors WHERE (slug = ? OR id = ?) AND is_active = 1 LIMIT 1', [slug, slug]);
    if (!d) throw new HttpError(404, 'Doctor profile not found');

    // Associated treatments
    let associatedTreatments = [];
    if (d.associated_treatments) {
      const trtIds = parseJson(d.associated_treatments, []);
      if (trtIds.length > 0) {
        associatedTreatments = await query(
          `SELECT id, name, slug, price, banner_image, duration FROM sid_treatments WHERE id IN (?) AND is_active = 1`,
          [trtIds]
        );
      }
    }

    res.json({
      success: true,
      data: {
        id: String(d.id),
        slug: d.slug,
        name: d.name,
        role: d.role,
        qualifications: d.qualifications,
        specialty: d.specialty,
        experience: d.experience,
        image: d.image,
        profileBanner: d.profile_banner,
        bio: d.bio,
        achievements: parseJson(d.achievements, []),
        certifications: parseJson(d.certifications, []),
        videoUrl: d.video_url,
        consultationFee: Number(d.consultation_fee) || 1200,
        availableLocations: parseJson(d.available_locations, ['Noida', 'Gurgaon']),
        availability: d.availability,
        associatedTreatments
      }
    });
  })
);

/**
 * GET /api/public/services
 */
router.get(
  '/services',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const rows = await query(`
      SELECT s.*, c.name AS category_name, c.slug AS category_slug
        FROM sid_services s
        LEFT JOIN sid_service_categories c ON c.id = s.category_id
       WHERE s.is_active = 1
       ORDER BY s.display_order ASC, s.id ASC
    `);

    res.json({
      success: true,
      data: rows.map(s => ({
        id: String(s.id),
        name: s.name,
        slug: s.slug,
        categoryName: s.category_name,
        categorySlug: s.category_slug,
        shortDesc: s.short_desc,
        fullDesc: s.full_desc,
        image: s.image,
        benefits: parseJson(s.benefits, []),
        procedureSteps: parseJson(s.procedure_steps, []),
        ctaText: s.cta_text,
        ctaUrl: s.cta_url
      }))
    });
  })
);

/**
 * GET /api/public/services/:slug
 */
router.get(
  '/services/:slug',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const { slug } = req.params;
    const s = await one(`
      SELECT s.*, c.name AS category_name, c.slug AS category_slug
        FROM sid_services s
        LEFT JOIN sid_service_categories c ON c.id = s.category_id
       WHERE (s.slug = ? OR s.id = ?) AND s.is_active = 1 LIMIT 1
    `, [slug, slug]);
    if (!s) throw new HttpError(404, 'Service not found');

    res.json({
      success: true,
      data: {
        id: String(s.id),
        name: s.name,
        slug: s.slug,
        categoryName: s.category_name,
        categorySlug: s.category_slug,
        shortDesc: s.short_desc,
        fullDesc: s.full_desc,
        image: s.image,
        additionalImages: parseJson(s.additional_images, []),
        benefits: parseJson(s.benefits, []),
        procedureSteps: parseJson(s.procedure_steps, []),
        faqs: parseJson(s.faqs, []),
        ctaText: s.cta_text,
        ctaUrl: s.cta_url,
        seoTitle: s.seo_title,
        seoDesc: s.seo_desc
      }
    });
  })
);

/**
 * GET /api/public/locations
 */
router.get(
  '/locations',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const rows = await query('SELECT * FROM sid_clinics WHERE is_active = 1 ORDER BY display_order ASC');
    res.json({
      success: true,
      data: rows.map(c => ({
        id: String(c.id),
        slug: c.slug,
        city: c.city,
        title: c.title,
        address: c.address,
        landmark: c.landmark,
        pincode: c.pincode,
        phones: parseJson(c.phones, []),
        email: c.email,
        whatsapp: c.whatsapp,
        hours: c.hours,
        mapEmbedUrl: c.map_embed_url,
        mapLink: c.map_link,
        highlights: parseJson(c.highlights, []),
        image: c.image,
        bannerImage: c.banner_image,
        seoTitle: c.seo_title,
        seoDesc: c.seo_desc
      }))
    });
  })
);

/**
 * GET /api/public/locations/:slug
 */
router.get(
  '/locations/:slug',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const { slug } = req.params;
    const c = await one('SELECT * FROM sid_clinics WHERE (slug = ? OR id = ?) AND is_active = 1 LIMIT 1', [slug, slug]);
    if (!c) throw new HttpError(404, 'Clinic location not found');

    // Resident doctors at this branch
    const doctors = await query(`
      SELECT id, name, slug, role, qualifications, specialty, experience, image, consultation_fee
        FROM sid_doctors
       WHERE is_active = 1 AND available_locations LIKE ?
       ORDER BY display_order ASC
    `, [`%${c.city}%`]);

    // Available treatments
    const treatments = await query(`
      SELECT id, name, slug, price, original_price, discount_badge, banner_image, duration
        FROM sid_treatments
       WHERE is_active = 1
       ORDER BY display_order ASC LIMIT 12
    `);

    res.json({
      success: true,
      data: {
        id: String(c.id),
        slug: c.slug,
        city: c.city,
        title: c.title,
        address: c.address,
        landmark: c.landmark,
        pincode: c.pincode,
        phones: parseJson(c.phones, []),
        email: c.email,
        whatsapp: c.whatsapp,
        hours: c.hours,
        mapEmbedUrl: c.map_embed_url,
        mapLink: c.map_link,
        highlights: parseJson(c.highlights, []),
        image: c.image,
        bannerImage: c.banner_image,
        seoTitle: c.seo_title,
        seoDesc: c.seo_desc,
        metaKeywords: c.meta_keywords,
        schemaMarkup: c.schema_markup,
        residentDoctors: doctors.map(d => ({
          id: String(d.id),
          name: d.name,
          slug: d.slug,
          role: d.role,
          qualifications: d.qualifications,
          specialty: d.specialty,
          image: d.image,
          fee: d.consultation_fee
        })),
        availableTreatments: treatments.map(t => ({
          id: String(t.id),
          name: t.name,
          slug: t.slug,
          price: t.price,
          originalPrice: t.original_price,
          discountBadge: t.discount_badge,
          bannerImage: t.banner_image,
          duration: t.duration
        }))
      }
    });
  })
);

/**
 * GET /api/public/pages/:slug
 */
router.get(
  '/pages/:slug',
  asyncHandler(async (req, res) => {
    setPublicCache(res);
    const { slug } = req.params;
    const p = await one('SELECT * FROM sid_pages WHERE (slug = ? OR id = ?) AND is_active = 1 LIMIT 1', [slug, slug]);
    if (!p) throw new HttpError(404, 'Page not found');

    const sections = await query('SELECT * FROM sid_page_sections WHERE page_id = ? AND is_active = 1 ORDER BY display_order ASC', [p.id]);

    res.json({
      success: true,
      data: {
        id: String(p.id),
        title: p.title,
        slug: p.slug,
        subtitle: p.subtitle,
        bannerImage: p.banner_image,
        content: p.content,
        seoTitle: p.seo_title,
        seoDesc: p.seo_desc,
        seoKeywords: p.seo_keywords,
        sections: sections.map(s => ({
          id: String(s.id),
          type: s.section_type,
          title: s.title,
          subtitle: s.subtitle,
          content: s.content,
          mediaUrl: s.media_url,
          extra: parseJson(s.extra_json, {})
        }))
      }
    });
  })
);

module.exports = router;
