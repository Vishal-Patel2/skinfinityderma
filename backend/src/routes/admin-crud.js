const express = require('express');
const { query, one, tx } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');
const { slugify } = require('../utils/slug');
const { parseJson } = require('../utils/helpers');

const router = express.Router();

/* ========================================================================== */
/* 1. DASHBOARD OVERVIEW & REAL-TIME STATISTICS                               */
/* ========================================================================== */

router.get(
  '/dashboard/stats',
  requirePermission('dashboard.view'),
  asyncHandler(async (req, res) => {
    const today = new Date().toISOString().slice(0, 10);

    const [
      appts,
      todayAppts,
      completedAppts,
      patients,
      enqs,
      convertedEnqs,
      banners,
      doctors,
      treatments,
      reviews,
      memberships,
      coupons,
    ] = await Promise.all([
      one('SELECT COUNT(*) AS total, SUM(CASE WHEN status="pending" THEN 1 ELSE 0 END) AS pending FROM sid_appointments'),
      one('SELECT COUNT(*) AS todayCount FROM sid_appointments WHERE appointment_date = ?', [today]),
      one('SELECT COUNT(*) AS completedCount FROM sid_appointments WHERE status="completed"'),
      one('SELECT COUNT(*) AS totalPatients FROM sid_patients'),
      one('SELECT COUNT(*) AS total, SUM(CASE WHEN status="new" THEN 1 ELSE 0 END) AS newCount FROM sid_enquiries'),
      one('SELECT COUNT(*) AS converted FROM sid_enquiries WHERE status="converted"'),
      one('SELECT COUNT(*) AS total, SUM(is_active) AS active FROM sid_banners'),
      one('SELECT COUNT(*) AS total, SUM(is_active) AS active FROM sid_doctors'),
      one('SELECT COUNT(*) AS total, SUM(is_active) AS active, SUM(is_featured) AS featured FROM sid_treatments'),
      one('SELECT COUNT(*) AS total FROM sid_reviews'),
      one('SELECT COUNT(*) AS total, SUM(subscribers_count) AS subscribers FROM sid_membership_plans'),
      one('SELECT COUNT(*) AS total, SUM(is_active) AS active, SUM(used_count) AS total_uses FROM sid_coupons'),
    ]);

    // Monthly appointment trends (last 6 months)
    const monthlyTrends = await query(`
      SELECT DATE_FORMAT(appointment_date, '%b %Y') AS month_label,
             COUNT(*) AS count
        FROM sid_appointments
       WHERE appointment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(appointment_date, '%Y-%m'), month_label
       ORDER BY DATE_FORMAT(appointment_date, '%Y-%m') ASC
    `);

    // Popular treatments based on bookings
    const popularTreatments = await query(`
      SELECT t.id, t.name, t.price, COUNT(a.id) AS booking_count
        FROM sid_treatments t
        LEFT JOIN sid_appointments a ON a.treatment_id = t.id OR a.service_name = t.name
       GROUP BY t.id, t.name, t.price
       ORDER BY booking_count DESC, t.id ASC
       LIMIT 5
    `);

    // Recent Bookings
    const recentAppts = await query(`
      SELECT a.id, a.appointment_no, a.patient_name, a.phone, a.service_name, a.appointment_date, a.appointment_time, a.status
        FROM sid_appointments a
       ORDER BY a.created_at DESC LIMIT 5
    `);

    // Recent Enquiries
    const recentEnqs = await query(`
      SELECT e.id, e.enquiry_no, e.name, e.phone, e.type, e.status, e.created_at
        FROM sid_enquiries e
       ORDER BY e.created_at DESC LIMIT 5
    `);

    // Recent Activities (Audit Log)
    const recentActivities = await query(`
      SELECT id, user_name, action, entity, summary, created_at
        FROM sid_audit_logs
       ORDER BY created_at DESC LIMIT 6
    `);

    const convRate = enqs.total > 0 ? ((convertedEnqs.converted / enqs.total) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        totalAppointments: appts.total || 0,
        pendingAppointments: appts.pending || 0,
        todayAppointments: todayAppts ? todayAppts.todayCount || 0 : 0,
        completedAppointments: completedAppts ? completedAppts.completedCount || 0 : 0,
        totalPatients: patients ? patients.totalPatients || 0 : 0,
        totalEnquiries: enqs.total || 0,
        newEnquiries: enqs.newCount || 0,
        conversionRate: convRate,
        totalBanners: banners.total || 0,
        activeBanners: banners.active || 0,
        totalDoctors: doctors.total || 0,
        activeDoctors: doctors.active || 0,
        totalTreatments: treatments.total || 0,
        activeTreatments: treatments.active || 0,
        featuredTreatments: treatments.featured || 0,
        totalReviews: reviews.total || 0,
        totalMemberships: memberships ? memberships.total || 0 : 0,
        totalSubscribers: memberships ? memberships.subscribers || 0 : 0,
        totalCoupons: coupons ? coupons.total || 0 : 0,
        activeCoupons: coupons ? coupons.active || 0 : 0,
        totalCouponUses: coupons ? coupons.total_uses || 0 : 0,
        monthlyTrends: monthlyTrends.length ? monthlyTrends : [
          { month_label: 'Nov 2026', count: appts.total || 3 }
        ],
        popularTreatments: popularTreatments.map((pt) => ({
          id: String(pt.id),
          name: pt.name,
          price: Number(pt.price),
          bookingCount: pt.booking_count || 0,
        })),
        recentAppointments: recentAppts,
        recentEnquiries: recentEnqs,
        recentActivities: recentActivities,
      },
    });
  })
);

/* ========================================================================== */
/* 2. BANNERS CRUD                                                            */
/* ========================================================================== */

router.get(
  '/banners',
  requirePermission('banners.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT id, desktop_image, mobile_image, display_order, is_active FROM sid_banners ORDER BY display_order ASC, id DESC');
    res.json({
      success: true,
      data: rows.map((r) => ({
        id: String(r.id),
        desktopImage: r.desktop_image,
        mobileImage: r.mobile_image,
        displayOrder: r.display_order,
        isActive: Boolean(r.is_active),
      })),
    });
  })
);

router.post(
  '/banners',
  requirePermission('banners.create'),
  asyncHandler(async (req, res) => {
    const { desktopImage, mobileImage, displayOrder = 1, isActive = 1 } = req.body;
    if (!desktopImage) throw new HttpError(400, 'Desktop banner image is required');

    const r = await query(
      `INSERT INTO sid_banners (desktop_image, mobile_image, display_order, is_active)
       VALUES (?, ?, ?, ?)`,
      [desktopImage, mobileImage || null, displayOrder, isActive ? 1 : 0]
    );

    await audit(req, { action: 'create', entity: 'banners', entityId: r.insertId, summary: `Added banner #${r.insertId}` });
    res.status(201).json({ success: true, id: String(r.insertId), message: 'Banner created successfully' });
  })
);

router.post(
  '/banners/reorder',
  requirePermission('banners.edit'),
  asyncHandler(async (req, res) => {
    const { orderList } = req.body;
    if (Array.isArray(orderList)) {
      for (let i = 0; i < orderList.length; i++) {
        const item = orderList[i];
        const id = typeof item === 'object' ? item.id : item;
        const order = typeof item === 'object' && item.displayOrder !== undefined ? item.displayOrder : (i + 1);
        await query('UPDATE sid_banners SET display_order = ? WHERE id = ?', [order, id]);
      }
    }
    res.json({ success: true, message: 'Banner display order updated' });
  })
);

router.put(
  '/banners/:id',
  requirePermission('banners.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { desktopImage, mobileImage, displayOrder, isActive } = req.body;

    const b = await one('SELECT * FROM sid_banners WHERE id = ?', [id]);
    if (!b) throw new HttpError(404, 'Banner not found');

    await query(
      `UPDATE sid_banners
          SET desktop_image = ?, mobile_image = ?, display_order = ?, is_active = ?
        WHERE id = ?`,
      [
        desktopImage !== undefined ? desktopImage : b.desktop_image,
        mobileImage !== undefined ? mobileImage : b.mobile_image,
        displayOrder !== undefined ? displayOrder : b.display_order,
        isActive !== undefined ? (isActive ? 1 : 0) : b.is_active,
        id,
      ]
    );

    res.json({ success: true, message: 'Banner updated successfully' });
  })
);

router.patch(
  '/banners/:id/toggle-status',
  requirePermission('banners.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const b = await one('SELECT is_active FROM sid_banners WHERE id = ?', [id]);
    if (!b) throw new HttpError(404, 'Banner not found');
    const next = b.is_active ? 0 : 1;
    await query('UPDATE sid_banners SET is_active = ? WHERE id = ?', [next, id]);
    res.json({ success: true, isActive: Boolean(next), message: `Banner is now ${next ? 'active' : 'inactive'}` });
  })
);

router.delete(
  '/banners/:id',
  requirePermission('banners.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_banners WHERE id = ?', [id]);
    res.json({ success: true, message: 'Banner deleted successfully' });
  })
);

/* ========================================================================== */
/* 3. DOCTORS CRUD                                                            */
/* ========================================================================== */

router.get(
  '/doctors',
  requirePermission('doctors.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM sid_doctors ORDER BY display_order ASC, id ASC');
    res.json({
      success: true,
      data: rows.map((d) => ({
        id: String(d.id),
        slug: d.slug,
        name: d.name,
        role: d.role,
        designation: d.role,
        qualifications: d.qualifications,
        specialty: d.specialty,
        specialization: d.specialty,
        experience: d.experience,
        photo: d.image,
        image: d.image,
        bio: d.bio,
        shortBio: d.bio ? d.bio.slice(0, 160) : '',
        fullBio: d.bio,
        consultationFee: Number(d.consultation_fee),
        clinicCity: (parseJson(d.available_locations, []) || []).join(', '),
        availableLocations: parseJson(d.available_locations, []),
        availability: d.availability,
        displayOrder: d.display_order,
        isActive: Boolean(d.is_active),
      })),
    });
  })
);

router.post(
  '/doctors',
  requirePermission('doctors.create'),
  asyncHandler(async (req, res) => {
    const { name, slug, role, designation, qualifications, specialty, specialization, experience, image, photo, bio, shortBio, fullBio, consultationFee = 1000, clinicCity, availableLocations, availability, displayOrder = 1, isActive = 1 } = req.body;
    if (!name) throw new HttpError(400, 'Doctor name is required');

    const doctorSlug = slug || slugify(name);
    const locs = availableLocations || (clinicCity ? clinicCity.split(',').map((s) => s.trim()) : ['Noida']);

    const r = await query(
      `INSERT INTO sid_doctors (name, slug, role, qualifications, specialty, experience, image, bio, consultation_fee, available_locations, availability, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        doctorSlug,
        role || designation || 'Consultant Dermatologist',
        qualifications || null,
        specialty || specialization || 'General Dermatology',
        experience || '5+ Years',
        image || photo || '/images/doctors/dr-ipshita-johri.jpg',
        bio || fullBio || shortBio || null,
        consultationFee,
        JSON.stringify(locs),
        availability || 'Mon - Sat',
        displayOrder,
        isActive ? 1 : 0,
      ]
    );

    await audit(req, { action: 'create', entity: 'doctors', entityId: r.insertId, summary: `Added doctor profile "${name}"` });
    res.status(201).json({ success: true, id: String(r.insertId), message: 'Doctor profile created' });
  })
);

router.put(
  '/doctors/:id',
  requirePermission('doctors.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, slug, role, designation, qualifications, specialty, specialization, experience, image, photo, bio, fullBio, consultationFee, clinicCity, availableLocations, availability, displayOrder, isActive } = req.body;

    const d = await one('SELECT * FROM sid_doctors WHERE id = ?', [id]);
    if (!d) throw new HttpError(404, 'Doctor not found');

    const locs = availableLocations || (clinicCity ? clinicCity.split(',').map((s) => s.trim()) : parseJson(d.available_locations, []));

    await query(
      `UPDATE sid_doctors
          SET name = ?, slug = ?, role = ?, qualifications = ?, specialty = ?, experience = ?,
              image = ?, bio = ?, consultation_fee = ?, available_locations = ?, availability = ?,
              display_order = ?, is_active = ?
        WHERE id = ?`,
      [
        name || d.name,
        slug || d.slug,
        role || designation || d.role,
        qualifications !== undefined ? qualifications : d.qualifications,
        specialty || specialization || d.specialty,
        experience !== undefined ? experience : d.experience,
        image || photo || d.image,
        bio || fullBio || d.bio,
        consultationFee !== undefined ? consultationFee : d.consultation_fee,
        JSON.stringify(locs),
        availability !== undefined ? availability : d.availability,
        displayOrder !== undefined ? displayOrder : d.display_order,
        isActive !== undefined ? (isActive ? 1 : 0) : d.is_active,
        id,
      ]
    );

    res.json({ success: true, message: 'Doctor profile updated' });
  })
);

router.patch(
  '/doctors/:id/toggle-status',
  requirePermission('doctors.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const d = await one('SELECT is_active FROM sid_doctors WHERE id = ?', [id]);
    if (!d) throw new HttpError(404, 'Doctor not found');
    const next = d.is_active ? 0 : 1;
    await query('UPDATE sid_doctors SET is_active = ? WHERE id = ?', [next, id]);
    res.json({ success: true, isActive: Boolean(next), message: `Doctor is now ${next ? 'active' : 'inactive'}` });
  })
);

router.delete(
  '/doctors/:id',
  requirePermission('doctors.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_doctors WHERE id = ?', [id]);
    res.json({ success: true, message: 'Doctor profile deleted' });
  })
);

/* ========================================================================== */
/* 4. DYNAMIC TREATMENTS CRUD (Multi-Step 1-6 Engine)                         */
/* ========================================================================== */

router.get(
  '/treatments',
  requirePermission('treatments.view'),
  asyncHandler(async (req, res) => {
    const rows = await query(
      `SELECT t.*, c.name AS category_name, c.slug AS category_slug
         FROM sid_treatments t
         LEFT JOIN sid_categories c ON c.id = t.category_id
        ORDER BY t.display_order ASC, t.id ASC`
    );

    res.json({
      success: true,
      data: rows.map((t) => ({
        id: String(t.id),
        slug: t.slug,
        name: t.name,
        categoryId: t.category_id ? String(t.category_id) : '',
        categoryName: t.category_name || 'General Dermatology',
        category: t.category_name || 'General Dermatology',
        bodyArea: t.body_area,
        price: Number(t.price),
        originalPrice: Number(t.original_price),
        discountBadge: t.discount_badge,
        discountLabel: t.discount_badge,
        estimatedDuration: t.duration,
        duration: t.duration,
        displayRating: Number(t.rating),
        shortDescription: t.short_desc,
        fullDescription: t.full_desc,
        featuredImage: t.banner_image,
        bannerImage: t.banner_image,
        subImage1: t.sub_image_1,
        subImage2: t.sub_image_2,
        subImage3: t.sub_image_3,
        videoUrl: t.video_url || t.youtube_video_id,
        videoTitle: t.video_title,
        galleryImages: parseJson(t.gallery_images, []),
        process: parseJson(t.how_it_works, []),
        suitability: parseJson(t.ideal_for, []),
        aftercare: parseJson(t.after_treatment, []),
        faqs: parseJson(t.faqs, []),
        displayOrder: t.display_order,
        isActive: Boolean(t.is_active),
        isFeatured: Boolean(t.is_featured),
        seoTitle: t.seo_title,
        seoDescription: t.seo_description,
      })),
    });
  })
);

router.get(
  '/treatments/:id',
  requirePermission('treatments.view'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const t = await one(
      `SELECT t.*, c.name AS category_name
         FROM sid_treatments t
         LEFT JOIN sid_categories c ON c.id = t.category_id
        WHERE t.id = ? LIMIT 1`,
      [id]
    );
    if (!t) throw new HttpError(404, 'Treatment not found');

    const concernRows = await query(
      `SELECT concern_id FROM sid_treatment_concerns WHERE treatment_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        id: String(t.id),
        slug: t.slug,
        name: t.name,
        categoryId: t.category_id ? String(t.category_id) : '',
        categoryName: t.category_name,
        concernIds: concernRows.map((r) => String(r.concern_id)),
        bodyArea: t.body_area || 'Full Body',
        tags: parseJson(t.tags, []),
        price: Number(t.price),
        originalPrice: Number(t.original_price),
        discountLabel: t.discount_badge,
        discountBadge: t.discount_badge,
        estimatedDuration: t.duration,
        duration: t.duration,
        displayRating: Number(t.rating),
        shortDescription: t.short_desc,
        fullDescription: t.full_desc,
        explainedSubtitle: t.explained_subtitle,
        sessionsInfo: t.sessions_info,
        emiMonths: t.emi_months,
        emiMonthly: t.emi_monthly,
        cardHighlights: parseJson(t.card_highlights, []),
        featuredImage: t.banner_image,
        bannerImage: t.banner_image,
        imageAltText: t.image_alt_text,
        subImage1: t.sub_image_1,
        subImage2: t.sub_image_2,
        subImage3: t.sub_image_3,
        videoUrl: t.video_url || t.youtube_video_id,
        videoTitle: t.video_title,
        videoThumbnail: t.video_thumbnail,
        youtubeVideoId: t.youtube_video_id,
        galleryImages: parseJson(t.gallery_images, []),
        benefits: parseJson(t.benefits, []),
        process: parseJson(t.how_it_works, []),
        howItWorksSteps: parseJson(t.how_it_works, []),
        suitability: t.ideal_for ? (Array.isArray(parseJson(t.ideal_for, [])) ? parseJson(t.ideal_for, []).join('\n') : t.ideal_for) : '',
        idealFor: parseJson(t.ideal_for, []),
        notIdealFor: parseJson(t.not_ideal_for, []),
        beforeTreatment: parseJson(t.before_treatment, []),
        aftercare: t.after_treatment ? (Array.isArray(parseJson(t.after_treatment, [])) ? parseJson(t.after_treatment, []).join('\n') : t.after_treatment) : '',
        afterTreatment: parseJson(t.after_treatment, []),
        expectedResults: t.expected_results,
        recoveryInfo: t.recovery_info,
        precautions: t.precautions,
        faqs: parseJson(t.faqs, []),
        relatedTreatmentIds: parseJson(t.related_treatment_ids, []),
        seoTitle: t.seo_title,
        seoDescription: t.seo_description,
        seoKeywords: t.seo_keywords,
        canonicalUrl: t.canonical_url,
        ogImage: t.og_image,
        isActive: Boolean(t.is_active),
        isFeatured: Boolean(t.is_featured),
        displayOrder: t.display_order,
      },
    });
  })
);

router.post(
  '/treatments',
  requirePermission('treatments.create'),
  asyncHandler(async (req, res) => {
    const {
      name,
      slug,
      categoryId,
      concernIds = [],
      bodyArea,
      tags,
      price = 0,
      originalPrice,
      discountLabel,
      discountBadge,
      estimatedDuration,
      duration,
      displayRating = 4.9,
      shortDescription,
      fullDescription,
      explainedSubtitle,
      sessionsInfo,
      emiMonths,
      emiMonthly,
      cardHighlights,
      featuredImage,
      bannerImage,
      imageAltText,
      subImage1,
      subImage2,
      subImage3,
      videoUrl,
      videoTitle,
      videoThumbnail,
      youtubeVideoId,
      galleryImages,
      benefits,
      process,
      howItWorksSteps,
      suitability,
      idealFor,
      notIdealFor,
      beforeTreatment,
      aftercare,
      afterTreatment,
      expectedResults,
      recoveryInfo,
      precautions,
      faqs,
      relatedTreatmentIds,
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      ogImage,
      isFeatured = 0,
      isActive = 1,
      displayOrder = 1,
    } = req.body;

    if (!name) throw new HttpError(400, 'Treatment name is required');
    const trtSlug = slug ? slugify(slug) : slugify(name);

    // Build unified galleryImages array if sub-images provided
    let finalGallery = galleryImages || [];
    if (!Array.isArray(finalGallery)) finalGallery = [];
    if (subImage1 && !finalGallery.some((g) => g.src === subImage1)) {
      finalGallery.push({ src: subImage1, caption: 'Sub-image 1' });
    }
    if (subImage2 && !finalGallery.some((g) => g.src === subImage2)) {
      finalGallery.push({ src: subImage2, caption: 'Sub-image 2' });
    }
    if (subImage3 && !finalGallery.some((g) => g.src === subImage3)) {
      finalGallery.push({ src: subImage3, caption: 'Sub-image 3' });
    }

    // Extract YouTube ID if full URL provided
    let ytId = youtubeVideoId || null;
    if (!ytId && videoUrl) {
      const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) ytId = match[1];
      else if (videoUrl.length === 11) ytId = videoUrl;
    }

    const r = await query(
      `INSERT INTO sid_treatments (
        name, slug, category_id, body_area, tags, price, original_price, discount_badge,
        duration, rating, short_desc, full_desc, explained_subtitle, sessions_info, emi_months, emi_monthly,
        card_highlights, banner_image, image_alt_text, sub_image_1, sub_image_2, sub_image_3,
        gallery_images, video_url, video_title, video_thumbnail, youtube_video_id,
        benefits, how_it_works, ideal_for, not_ideal_for, before_treatment, after_treatment,
        expected_results, recovery_info, precautions, faqs, related_treatment_ids,
        seo_title, seo_description, seo_keywords, canonical_url, og_image,
        is_featured, is_active, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        trtSlug,
        categoryId ? parseInt(categoryId, 10) : null,
        bodyArea || null,
        tags ? JSON.stringify(Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : null,
        Number(price) || 0,
        originalPrice ? Number(originalPrice) : null,
        discountLabel || discountBadge || null,
        estimatedDuration || duration || '60 mins',
        displayRating,
        shortDescription || null,
        fullDescription || null,
        explainedSubtitle || null,
        sessionsInfo || null,
        emiMonths ? parseInt(emiMonths, 10) : null,
        emiMonthly ? Number(emiMonthly) : null,
        cardHighlights ? JSON.stringify(cardHighlights) : null,
        featuredImage || bannerImage || null, // All media optional!
        imageAltText || null,
        subImage1 || null,
        subImage2 || null,
        subImage3 || null,
        finalGallery.length ? JSON.stringify(finalGallery) : null,
        videoUrl || null,
        videoTitle || null,
        videoThumbnail || null,
        ytId,
        benefits ? JSON.stringify(benefits) : null,
        (process || howItWorksSteps) ? JSON.stringify(process || howItWorksSteps) : null,
        suitability ? JSON.stringify(Array.isArray(suitability) ? suitability : suitability.split('\n').filter(Boolean)) : (idealFor ? JSON.stringify(idealFor) : null),
        notIdealFor ? JSON.stringify(notIdealFor) : null,
        beforeTreatment ? JSON.stringify(beforeTreatment) : null,
        aftercare ? JSON.stringify(Array.isArray(aftercare) ? aftercare : aftercare.split('\n').filter(Boolean)) : (afterTreatment ? JSON.stringify(afterTreatment) : null),
        expectedResults || null,
        recoveryInfo || null,
        precautions || null,
        faqs ? JSON.stringify(faqs) : null,
        relatedTreatmentIds ? JSON.stringify(relatedTreatmentIds) : null,
        seoTitle || null,
        seoDescription || null,
        seoKeywords || null,
        canonicalUrl || null,
        ogImage || null,
        isFeatured ? 1 : 0,
        isActive ? 1 : 0,
        displayOrder,
      ]
    );

    const treatmentId = r.insertId;
    if (concernIds && concernIds.length) {
      for (const cid of concernIds) {
        await query('INSERT IGNORE INTO sid_treatment_concerns (treatment_id, concern_id) VALUES (?, ?)', [
          treatmentId,
          parseInt(cid, 10),
        ]);
      }
    }

    await audit(req, { action: 'create', entity: 'treatments', entityId: treatmentId, summary: `Added treatment "${name}"` });
    res.status(201).json({ success: true, id: String(treatmentId), slug: trtSlug, message: 'Treatment created successfully' });
  })
);

router.put(
  '/treatments/:id',
  requirePermission('treatments.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    const t = await one('SELECT * FROM sid_treatments WHERE id = ?', [id]);
    if (!t) throw new HttpError(404, 'Treatment not found');

    const name = body.name || t.name;
    const slug = body.slug ? slugify(body.slug) : t.slug;

    // Build unified galleryImages array if sub-images provided
    let finalGallery = body.galleryImages !== undefined ? body.galleryImages : parseJson(t.gallery_images, []);
    if (!Array.isArray(finalGallery)) finalGallery = [];
    if (body.subImage1 && !finalGallery.some((g) => g.src === body.subImage1)) {
      finalGallery.push({ src: body.subImage1, caption: 'Sub-image 1' });
    }
    if (body.subImage2 && !finalGallery.some((g) => g.src === body.subImage2)) {
      finalGallery.push({ src: body.subImage2, caption: 'Sub-image 2' });
    }
    if (body.subImage3 && !finalGallery.some((g) => g.src === body.subImage3)) {
      finalGallery.push({ src: body.subImage3, caption: 'Sub-image 3' });
    }

    let ytId = body.youtubeVideoId !== undefined ? body.youtubeVideoId : t.youtube_video_id;
    if (body.videoUrl) {
      const match = body.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) ytId = match[1];
      else if (body.videoUrl.length === 11) ytId = body.videoUrl;
    }

    await query(
      `UPDATE sid_treatments
          SET name = ?, slug = ?, category_id = ?, body_area = COALESCE(?, body_area),
              price = ?, original_price = ?, discount_badge = ?, duration = ?, rating = ?,
              short_desc = ?, full_desc = ?, explained_subtitle = COALESCE(?, explained_subtitle),
              sessions_info = COALESCE(?, sessions_info), emi_months = COALESCE(?, emi_months),
              emi_monthly = COALESCE(?, emi_monthly), banner_image = ?, image_alt_text = COALESCE(?, image_alt_text),
              sub_image_1 = COALESCE(?, sub_image_1), sub_image_2 = COALESCE(?, sub_image_2), sub_image_3 = COALESCE(?, sub_image_3),
              gallery_images = ?, video_url = COALESCE(?, video_url), video_title = COALESCE(?, video_title),
              video_thumbnail = COALESCE(?, video_thumbnail), youtube_video_id = ?,
              benefits = COALESCE(?, benefits), how_it_works = ?, ideal_for = ?, not_ideal_for = COALESCE(?, not_ideal_for),
              before_treatment = COALESCE(?, before_treatment), after_treatment = ?, expected_results = COALESCE(?, expected_results),
              recovery_info = COALESCE(?, recovery_info), precautions = COALESCE(?, precautions), faqs = ?,
              related_treatment_ids = COALESCE(?, related_treatment_ids),
              seo_title = ?, seo_description = ?, seo_keywords = COALESCE(?, seo_keywords),
              canonical_url = COALESCE(?, canonical_url), og_image = COALESCE(?, og_image),
              is_featured = ?, is_active = ?, display_order = ?
        WHERE id = ?`,
      [
        name,
        slug,
        body.categoryId !== undefined ? (body.categoryId ? parseInt(body.categoryId, 10) : null) : t.category_id,
        body.bodyArea || null,
        body.price !== undefined ? Number(body.price) : t.price,
        body.originalPrice !== undefined ? (body.originalPrice ? Number(body.originalPrice) : null) : t.original_price,
        body.discountLabel !== undefined ? body.discountLabel : (body.discountBadge !== undefined ? body.discountBadge : t.discount_badge),
        body.estimatedDuration !== undefined ? body.estimatedDuration : (body.duration !== undefined ? body.duration : t.duration),
        body.displayRating !== undefined ? body.displayRating : t.rating,
        body.shortDescription !== undefined ? body.shortDescription : t.short_desc,
        body.fullDescription !== undefined ? body.fullDescription : t.full_desc,
        body.explainedSubtitle || null,
        body.sessionsInfo || null,
        body.emiMonths !== undefined ? (body.emiMonths ? parseInt(body.emiMonths, 10) : null) : null,
        body.emiMonthly !== undefined ? (body.emiMonthly ? Number(body.emiMonthly) : null) : null,
        body.featuredImage !== undefined ? body.featuredImage : (body.bannerImage !== undefined ? body.bannerImage : t.banner_image),
        body.imageAltText || null,
        body.subImage1 || null,
        body.subImage2 || null,
        body.subImage3 || null,
        finalGallery.length ? JSON.stringify(finalGallery) : null,
        body.videoUrl || null,
        body.videoTitle || null,
        body.videoThumbnail || null,
        ytId,
        body.benefits ? JSON.stringify(body.benefits) : null,
        (body.process || body.howItWorksSteps) !== undefined ? JSON.stringify(body.process || body.howItWorksSteps) : t.how_it_works,
        body.suitability !== undefined ? JSON.stringify(Array.isArray(body.suitability) ? body.suitability : body.suitability.split('\n').filter(Boolean)) : (body.idealFor ? JSON.stringify(body.idealFor) : t.ideal_for),
        body.notIdealFor ? JSON.stringify(body.notIdealFor) : null,
        body.beforeTreatment ? JSON.stringify(body.beforeTreatment) : null,
        body.aftercare !== undefined ? JSON.stringify(Array.isArray(body.aftercare) ? body.aftercare : body.aftercare.split('\n').filter(Boolean)) : (body.afterTreatment ? JSON.stringify(body.afterTreatment) : t.after_treatment),
        body.expectedResults || null,
        body.recoveryInfo || null,
        body.precautions || null,
        body.faqs !== undefined ? JSON.stringify(body.faqs) : t.faqs,
        body.relatedTreatmentIds ? JSON.stringify(body.relatedTreatmentIds) : null,
        body.seoTitle !== undefined ? body.seoTitle : t.seo_title,
        body.seoDescription !== undefined ? body.seoDescription : t.seo_description,
        body.seoKeywords || null,
        body.canonicalUrl || null,
        body.ogImage || null,
        body.isFeatured !== undefined ? (body.isFeatured ? 1 : 0) : t.is_featured,
        body.isActive !== undefined ? (body.isActive ? 1 : 0) : t.is_active,
        body.displayOrder !== undefined ? body.displayOrder : t.display_order,
        id,
      ]
    );

    if (body.concernIds !== undefined) {
      await query('DELETE FROM sid_treatment_concerns WHERE treatment_id = ?', [id]);
      for (const cid of body.concernIds) {
        await query('INSERT IGNORE INTO sid_treatment_concerns (treatment_id, concern_id) VALUES (?, ?)', [
          id,
          parseInt(cid, 10),
        ]);
      }
    }

    await audit(req, { action: 'update', entity: 'treatments', entityId: id, summary: `Updated treatment "${name}"` });
    res.json({ success: true, message: 'Treatment updated successfully' });
  })
);

router.post(
  '/treatments/:id/duplicate',
  requirePermission('treatments.create'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const t = await one('SELECT * FROM sid_treatments WHERE id = ?', [id]);
    if (!t) throw new HttpError(404, 'Treatment not found');

    const newName = `${t.name} (Copy)`;
    const newSlug = slugify(newName) + '-' + Math.floor(1000 + Math.random() * 9000);

    const r = await query(
      `INSERT INTO sid_treatments (
        name, slug, category_id, body_area, tags, price, original_price, discount_badge,
        duration, rating, short_desc, full_desc, banner_image, sub_image_1, sub_image_2, sub_image_3,
        gallery_images, video_url, video_title, how_it_works, ideal_for, after_treatment,
        faqs, seo_title, seo_description, is_featured, is_active, display_order
      ) SELECT ?, ?, category_id, body_area, tags, price, original_price, discount_badge,
               duration, rating, short_desc, full_desc, banner_image, sub_image_1, sub_image_2, sub_image_3,
               gallery_images, video_url, video_title, how_it_works, ideal_for, after_treatment,
               faqs, seo_title, seo_description, 0, 0, display_order + 1
          FROM sid_treatments WHERE id = ?`,
      [newName, newSlug, id]
    );

    res.status(201).json({ success: true, id: String(r.insertId), slug: newSlug, message: 'Treatment cloned successfully' });
  })
);

router.patch(
  '/treatments/:id/toggle-status',
  requirePermission('treatments.publish'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const t = await one('SELECT is_active FROM sid_treatments WHERE id = ?', [id]);
    if (!t) throw new HttpError(404, 'Treatment not found');
    const next = t.is_active ? 0 : 1;
    await query('UPDATE sid_treatments SET is_active = ? WHERE id = ?', [next, id]);
    res.json({ success: true, isActive: Boolean(next), message: `Treatment is now ${next ? 'published' : 'draft'}` });
  })
);

router.patch(
  '/treatments/:id/toggle-featured',
  requirePermission('treatments.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const t = await one('SELECT is_featured FROM sid_treatments WHERE id = ?', [id]);
    if (!t) throw new HttpError(404, 'Treatment not found');
    const next = t.is_featured ? 0 : 1;
    await query('UPDATE sid_treatments SET is_featured = ? WHERE id = ?', [next, id]);
    res.json({ success: true, isFeatured: Boolean(next), message: `Treatment featured status changed` });
  })
);

router.delete(
  '/treatments/:id',
  requirePermission('treatments.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_treatments WHERE id = ?', [id]);
    res.json({ success: true, message: 'Treatment deleted successfully' });
  })
);

/* ========================================================================== */
/* 5. CATEGORIES & CONCERNS CRUD                                              */
/* ========================================================================== */

router.get(
  '/categories',
  requirePermission('categories.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM sid_categories ORDER BY display_order ASC, id ASC');
    res.json({
      success: true,
      data: rows.map((c) => ({
        id: String(c.id),
        name: c.name,
        slug: c.slug,
        description: c.description,
        thumbnail: c.thumbnail,
        displayOrder: c.display_order,
        isActive: Boolean(c.is_active),
      })),
    });
  })
);

router.post(
  '/categories',
  requirePermission('categories.create'),
  asyncHandler(async (req, res) => {
    const { name, slug, description, thumbnail, displayOrder = 1, isActive = 1 } = req.body;
    if (!name) throw new HttpError(400, 'Category name is required');
    const catSlug = slug ? slugify(slug) : slugify(name);

    const r = await query(
      `INSERT INTO sid_categories (name, slug, description, thumbnail, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, catSlug, description || null, thumbnail || null, displayOrder, isActive ? 1 : 0]
    );

    res.status(201).json({ success: true, id: String(r.insertId), message: 'Category created' });
  })
);

router.put(
  '/categories/:id',
  requirePermission('categories.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, slug, description, thumbnail, displayOrder, isActive } = req.body;
    const c = await one('SELECT * FROM sid_categories WHERE id = ?', [id]);
    if (!c) throw new HttpError(404, 'Category not found');

    await query(
      `UPDATE sid_categories SET name = ?, slug = ?, description = ?, thumbnail = ?, display_order = ?, is_active = ? WHERE id = ?`,
      [
        name || c.name,
        slug ? slugify(slug) : c.slug,
        description !== undefined ? description : c.description,
        thumbnail !== undefined ? thumbnail : c.thumbnail,
        displayOrder !== undefined ? displayOrder : c.display_order,
        isActive !== undefined ? (isActive ? 1 : 0) : c.is_active,
        id,
      ]
    );

    res.json({ success: true, message: 'Category updated successfully' });
  })
);

router.delete(
  '/categories/:id',
  requirePermission('categories.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_categories WHERE id = ?', [id]);
    res.json({ success: true, message: 'Category deleted successfully' });
  })
);

router.get(
  '/concerns',
  requirePermission('concerns.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM sid_concerns ORDER BY display_order ASC, id ASC');
    res.json({
      success: true,
      data: rows.map((c) => ({
        id: String(c.id),
        name: c.name,
        slug: c.slug,
        description: c.description,
        thumbnail: c.thumbnail,
        displayOrder: c.display_order,
        isActive: Boolean(c.is_active),
      })),
    });
  })
);

router.post(
  '/concerns',
  requirePermission('concerns.create'),
  asyncHandler(async (req, res) => {
    const { name, slug, description, thumbnail, displayOrder = 1, isActive = 1 } = req.body;
    if (!name) throw new HttpError(400, 'Concern name is required');
    const conSlug = slug ? slugify(slug) : slugify(name);

    const r = await query(
      `INSERT INTO sid_concerns (name, slug, description, thumbnail, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, conSlug, description || null, thumbnail || null, displayOrder, isActive ? 1 : 0]
    );

    res.status(201).json({ success: true, id: String(r.insertId), message: 'Concern created' });
  })
);

router.put(
  '/concerns/:id',
  requirePermission('concerns.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, slug, description, thumbnail, displayOrder, isActive } = req.body;
    const c = await one('SELECT * FROM sid_concerns WHERE id = ?', [id]);
    if (!c) throw new HttpError(404, 'Concern not found');

    await query(
      `UPDATE sid_concerns SET name = ?, slug = ?, description = ?, thumbnail = ?, display_order = ?, is_active = ? WHERE id = ?`,
      [
        name || c.name,
        slug ? slugify(slug) : c.slug,
        description !== undefined ? description : c.description,
        thumbnail !== undefined ? thumbnail : c.thumbnail,
        displayOrder !== undefined ? displayOrder : c.display_order,
        isActive !== undefined ? (isActive ? 1 : 0) : c.is_active,
        id,
      ]
    );

    res.json({ success: true, message: 'Concern updated successfully' });
  })
);

router.delete(
  '/concerns/:id',
  requirePermission('concerns.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_concerns WHERE id = ?', [id]);
    res.json({ success: true, message: 'Concern deleted successfully' });
  })
);

/* ========================================================================== */
/* 6. PATIENT & GOOGLE REVIEWS CRUD                                           */
/* ========================================================================== */

router.get(
  '/reviews',
  requirePermission('reviews.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM sid_reviews ORDER BY display_order ASC, id DESC');
    res.json({
      success: true,
      data: rows.map((r) => ({
        id: String(r.id),
        patientName: r.reviewer_name,
        reviewerName: r.reviewer_name,
        initials: r.initials,
        avatar: r.avatar,
        rating: r.rating,
        reviewText: r.review_text,
        treatmentTag: r.treatment_tag,
        branch: r.branch,
        source: r.source,
        verified: Boolean(r.verified),
        reviewDate: r.review_date,
        displayOrder: r.display_order,
        isActive: Boolean(r.is_active),
      })),
    });
  })
);

router.get(
  '/reviews/stats',
  requirePermission('reviews.view'),
  asyncHandler(async (req, res) => {
    const s = await one('SELECT setting_value FROM sid_settings WHERE setting_key = "reviews"');
    const stats = s ? parseJson(s.setting_value, {}) : { rating: 4.5, reviewCount: '4,500+', writeReviewUrl: 'https://g.page/r/skinfinityderma/review' };
    res.json({ success: true, data: stats });
  })
);

router.post(
  '/reviews/stats',
  requirePermission('reviews.edit'),
  asyncHandler(async (req, res) => {
    const body = req.body;
    await query(
      `INSERT INTO sid_settings (setting_key, setting_value, group_name) VALUES ('reviews', ?, 'reviews')
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [JSON.stringify(body)]
    );
    res.json({ success: true, message: 'Review statistics updated successfully' });
  })
);

router.post(
  '/reviews',
  requirePermission('reviews.create'),
  asyncHandler(async (req, res) => {
    const { patientName, reviewerName, rating = 5, reviewText, treatmentTag, branch = 'Noida HQ', source = 'google', verified = 1, reviewDate, displayOrder = 1, isActive = 1 } = req.body;
    const finalName = patientName || reviewerName;
    if (!finalName || !reviewText) throw new HttpError(400, 'Reviewer name and review text are required');

    const initials = finalName.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

    const r = await query(
      `INSERT INTO sid_reviews (reviewer_name, initials, rating, review_text, treatment_tag, branch, source, verified, review_date, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [finalName, initials, parseInt(rating, 10), reviewText, treatmentTag || null, branch, source, verified ? 1 : 0, reviewDate || new Date(), displayOrder, isActive ? 1 : 0]
    );

    res.status(201).json({ success: true, id: String(r.insertId), message: 'Review added' });
  })
);

router.put(
  '/reviews/:id',
  requirePermission('reviews.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { patientName, reviewerName, rating, reviewText, treatmentTag, branch, source, verified, reviewDate, displayOrder, isActive } = req.body;

    const r = await one('SELECT * FROM sid_reviews WHERE id = ?', [id]);
    if (!r) throw new HttpError(404, 'Review not found');

    const finalName = patientName || reviewerName || r.reviewer_name;
    const initials = finalName.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

    await query(
      `UPDATE sid_reviews
          SET reviewer_name = ?, initials = ?, rating = ?, review_text = ?, treatment_tag = ?,
              branch = ?, source = ?, verified = ?, review_date = ?, display_order = ?, is_active = ?
        WHERE id = ?`,
      [
        finalName,
        initials,
        rating !== undefined ? parseInt(rating, 10) : r.rating,
        reviewText !== undefined ? reviewText : r.review_text,
        treatmentTag !== undefined ? treatmentTag : r.treatment_tag,
        branch !== undefined ? branch : r.branch,
        source !== undefined ? source : r.source,
        verified !== undefined ? (verified ? 1 : 0) : r.verified,
        reviewDate !== undefined ? reviewDate : r.review_date,
        displayOrder !== undefined ? displayOrder : r.display_order,
        isActive !== undefined ? (isActive ? 1 : 0) : r.is_active,
        id,
      ]
    );

    res.json({ success: true, message: 'Review updated successfully' });
  })
);

router.patch(
  '/reviews/:id/toggle-status',
  requirePermission('reviews.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const r = await one('SELECT is_active FROM sid_reviews WHERE id = ?', [id]);
    if (!r) throw new HttpError(404, 'Review not found');
    const next = r.is_active ? 0 : 1;
    await query('UPDATE sid_reviews SET is_active = ? WHERE id = ?', [next, id]);
    res.json({ success: true, isActive: Boolean(next), message: `Review is now ${next ? 'visible' : 'hidden'}` });
  })
);

router.delete(
  '/reviews/:id',
  requirePermission('reviews.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_reviews WHERE id = ?', [id]);
    res.json({ success: true, message: 'Review deleted successfully' });
  })
);

/* ========================================================================== */
/* 7. CLINICAL BEFORE & AFTER TRANSFORMATIONS CRUD                            */
/* ========================================================================== */

router.get(
  '/before-after',
  requirePermission('before_after.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM sid_before_after_cases ORDER BY display_order ASC, id DESC');
    res.json({
      success: true,
      data: rows.map((b) => ({
        id: String(b.id),
        patientName: b.patient_name || 'Verified Patient',
        treatment: b.treatment,
        treatmentId: b.treatment_id ? String(b.treatment_id) : null,
        description: b.description,
        beforeImage: b.before_image,
        afterImage: b.after_image,
        resultsType: b.results_type,
        timeframe: b.timeframe,
        hasPatientConsent: Boolean(b.has_patient_consent),
        approvalStatus: b.approval_status,
        displayOrder: b.display_order,
        isActive: Boolean(b.is_active),
      })),
    });
  })
);

router.post(
  '/before-after',
  requirePermission('before_after.create'),
  asyncHandler(async (req, res) => {
    const { patientName, treatment, treatmentId, description, beforeImage, afterImage, resultsType, timeframe, hasPatientConsent = 1, approvalStatus = 'Approved', displayOrder = 1, isActive = 1 } = req.body;
    if (!treatment || !afterImage) throw new HttpError(400, 'Treatment name and After image are required');

    const r = await query(
      `INSERT INTO sid_before_after_cases (
        patient_name, treatment, treatment_id, description, before_image, after_image,
        results_type, timeframe, has_patient_consent, approval_status, display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientName || 'Verified Patient',
        treatment,
        treatmentId ? parseInt(treatmentId, 10) : null,
        description || null,
        beforeImage || null,
        afterImage,
        resultsType || null,
        timeframe || '6 Weeks',
        hasPatientConsent ? 1 : 0,
        approvalStatus,
        displayOrder,
        isActive ? 1 : 0,
      ]
    );

    res.status(201).json({ success: true, id: String(r.insertId), message: 'Transformation case added' });
  })
);

router.put(
  '/before-after/:id',
  requirePermission('before_after.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    const b = await one('SELECT * FROM sid_before_after_cases WHERE id = ?', [id]);
    if (!b) throw new HttpError(404, 'Case not found');

    await query(
      `UPDATE sid_before_after_cases
          SET patient_name = ?, treatment = ?, treatment_id = ?, description = ?,
              before_image = ?, after_image = ?, results_type = ?, timeframe = ?,
              has_patient_consent = ?, approval_status = ?, display_order = ?, is_active = ?
        WHERE id = ?`,
      [
        body.patientName !== undefined ? body.patientName : b.patient_name,
        body.treatment !== undefined ? body.treatment : b.treatment,
        body.treatmentId !== undefined ? (body.treatmentId ? parseInt(body.treatmentId, 10) : null) : b.treatment_id,
        body.description !== undefined ? body.description : b.description,
        body.beforeImage !== undefined ? body.beforeImage : b.before_image,
        body.afterImage !== undefined ? body.afterImage : b.after_image,
        body.resultsType !== undefined ? body.resultsType : b.results_type,
        body.timeframe !== undefined ? body.timeframe : b.timeframe,
        body.hasPatientConsent !== undefined ? (body.hasPatientConsent ? 1 : 0) : b.has_patient_consent,
        body.approvalStatus !== undefined ? body.approvalStatus : b.approval_status,
        body.displayOrder !== undefined ? body.displayOrder : b.display_order,
        body.isActive !== undefined ? (body.isActive ? 1 : 0) : b.is_active,
        id,
      ]
    );

    res.json({ success: true, message: 'Transformation case updated' });
  })
);

router.patch(
  '/before-after/:id/toggle-status',
  requirePermission('before_after.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const b = await one('SELECT is_active FROM sid_before_after_cases WHERE id = ?', [id]);
    if (!b) throw new HttpError(404, 'Case not found');
    const next = b.is_active ? 0 : 1;
    await query('UPDATE sid_before_after_cases SET is_active = ? WHERE id = ?', [next, id]);
    res.json({ success: true, isActive: Boolean(next), message: `Case is now ${next ? 'visible' : 'hidden'}` });
  })
);

router.delete(
  '/before-after/:id',
  requirePermission('before_after.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_before_after_cases WHERE id = ?', [id]);
    res.json({ success: true, message: 'Transformation case deleted' });
  })
);

/* ========================================================================== */
/* 8. PHOTO GALLERY CRUD                                                      */
/* ========================================================================== */

router.get(
  '/gallery',
  requirePermission('gallery.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM sid_gallery_items ORDER BY display_order ASC, id DESC');
    res.json({
      success: true,
      data: rows.map((g) => ({
        id: String(g.id),
        image: g.image,
        title: g.title,
        altText: g.alt_text,
        category: g.category,
        treatmentId: g.treatment_id ? String(g.treatment_id) : null,
        displayOrder: g.display_order,
        isActive: Boolean(g.is_active),
      })),
    });
  })
);

router.post(
  '/gallery',
  requirePermission('gallery.create'),
  asyncHandler(async (req, res) => {
    const { image, title, altText, category, treatmentId, displayOrder = 1, isActive = 1 } = req.body;
    if (!image) throw new HttpError(400, 'Image is required');

    const r = await query(
      `INSERT INTO sid_gallery_items (image, title, alt_text, category, treatment_id, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [image, title || null, altText || title || null, category || 'Clinic Ambiance', treatmentId ? parseInt(treatmentId, 10) : null, displayOrder, isActive ? 1 : 0]
    );

    res.status(201).json({ success: true, id: String(r.insertId), message: 'Gallery item added' });
  })
);

router.put(
  '/gallery/:id',
  requirePermission('gallery.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { image, title, altText, category, treatmentId, displayOrder, isActive } = req.body;
    const g = await one('SELECT * FROM sid_gallery_items WHERE id = ?', [id]);
    if (!g) throw new HttpError(404, 'Gallery item not found');

    await query(
      `UPDATE sid_gallery_items SET image = ?, title = ?, alt_text = ?, category = ?, treatment_id = ?, display_order = ?, is_active = ? WHERE id = ?`,
      [
        image || g.image,
        title !== undefined ? title : g.title,
        altText !== undefined ? altText : g.alt_text,
        category !== undefined ? category : g.category,
        treatmentId !== undefined ? (treatmentId ? parseInt(treatmentId, 10) : null) : g.treatment_id,
        displayOrder !== undefined ? displayOrder : g.display_order,
        isActive !== undefined ? (isActive ? 1 : 0) : g.is_active,
        id,
      ]
    );

    res.json({ success: true, message: 'Gallery item updated' });
  })
);

router.patch(
  '/gallery/:id/toggle-status',
  requirePermission('gallery.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const g = await one('SELECT is_active FROM sid_gallery_items WHERE id = ?', [id]);
    if (!g) throw new HttpError(404, 'Gallery item not found');
    const next = g.is_active ? 0 : 1;
    await query('UPDATE sid_gallery_items SET is_active = ? WHERE id = ?', [next, id]);
    res.json({ success: true, isActive: Boolean(next), message: `Gallery item is now ${next ? 'visible' : 'hidden'}` });
  })
);

router.delete(
  '/gallery/:id',
  requirePermission('gallery.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_gallery_items WHERE id = ?', [id]);
    res.json({ success: true, message: 'Gallery item deleted' });
  })
);

/* ========================================================================== */
/* 9. VIDEO TESTIMONIALS & STORIES CRUD                                       */
/* ========================================================================== */

router.get(
  '/video-testimonials',
  requirePermission('videos.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM sid_videos ORDER BY display_order ASC, id DESC');
    res.json({
      success: true,
      data: rows.map((v) => ({
        id: String(v.id),
        title: v.title,
        category: v.category,
        youtubeId: v.youtube_id,
        videoUrl: `https://www.youtube.com/watch?v=${v.youtube_id}`,
        doctorName: v.doctor_name,
        type: v.type,
        thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`,
        quote: v.quote,
        rating: v.rating,
        displayOrder: v.display_order,
        isActive: Boolean(v.is_active),
      })),
    });
  })
);

router.post(
  '/video-testimonials',
  requirePermission('videos.create'),
  asyncHandler(async (req, res) => {
    const { title, category, youtubeId, videoUrl, doctorName, type = 'doctor_video', thumbnail, quote, rating = 5, displayOrder = 1, isActive = 1 } = req.body;
    if (!title) throw new HttpError(400, 'Video title is required');

    let ytId = youtubeId || '';
    if (!ytId && videoUrl) {
      const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) ytId = match[1];
      else ytId = videoUrl;
    }
    if (!ytId) throw new HttpError(400, 'Valid YouTube Video ID or URL is required');

    const r = await query(
      `INSERT INTO sid_videos (title, category, youtube_id, doctor_name, type, thumbnail, quote, rating, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, category || 'Clinical Talk', ytId, doctorName || 'Dr. Ipshita Johri', type, thumbnail || null, quote || null, parseInt(rating, 10), displayOrder, isActive ? 1 : 0]
    );

    res.status(201).json({ success: true, id: String(r.insertId), message: 'Video added' });
  })
);

router.put(
  '/video-testimonials/:id',
  requirePermission('videos.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, category, youtubeId, videoUrl, doctorName, type, thumbnail, quote, rating, displayOrder, isActive } = req.body;

    const v = await one('SELECT * FROM sid_videos WHERE id = ?', [id]);
    if (!v) throw new HttpError(404, 'Video not found');

    let ytId = youtubeId || v.youtube_id;
    if (videoUrl) {
      const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) ytId = match[1];
    }

    await query(
      `UPDATE sid_videos
          SET title = ?, category = ?, youtube_id = ?, doctor_name = ?, type = ?,
              thumbnail = ?, quote = ?, rating = ?, display_order = ?, is_active = ?
        WHERE id = ?`,
      [
        title || v.title,
        category !== undefined ? category : v.category,
        ytId,
        doctorName !== undefined ? doctorName : v.doctor_name,
        type || v.type,
        thumbnail !== undefined ? thumbnail : v.thumbnail,
        quote !== undefined ? quote : v.quote,
        rating !== undefined ? parseInt(rating, 10) : v.rating,
        displayOrder !== undefined ? displayOrder : v.display_order,
        isActive !== undefined ? (isActive ? 1 : 0) : v.is_active,
        id,
      ]
    );

    res.json({ success: true, message: 'Video updated successfully' });
  })
);

router.patch(
  '/video-testimonials/:id/toggle-status',
  requirePermission('videos.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const v = await one('SELECT is_active FROM sid_videos WHERE id = ?', [id]);
    if (!v) throw new HttpError(404, 'Video not found');
    const next = v.is_active ? 0 : 1;
    await query('UPDATE sid_videos SET is_active = ? WHERE id = ?', [next, id]);
    res.json({ success: true, isActive: Boolean(next), message: `Video is now ${next ? 'visible' : 'hidden'}` });
  })
);

router.delete(
  '/video-testimonials/:id',
  requirePermission('videos.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_videos WHERE id = ?', [id]);
    res.json({ success: true, message: 'Video deleted' });
  })
);

/* ========================================================================== */
/* 10. CLINICAL FAQS CRUD                                                     */
/* ========================================================================== */

router.get(
  '/faqs',
  requirePermission('faqs.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM sid_faqs ORDER BY display_order ASC, id ASC');
    res.json({
      success: true,
      data: rows.map((f) => ({
        id: String(f.id),
        scope: f.scope,
        question: f.question,
        answer: f.answer,
        displayOrder: f.display_order,
        isActive: Boolean(f.is_active),
      })),
    });
  })
);

router.post(
  '/faqs',
  requirePermission('faqs.create'),
  asyncHandler(async (req, res) => {
    const { question, answer, scope = 'home', displayOrder = 1, isActive = 1 } = req.body;
    if (!question || !answer) throw new HttpError(400, 'Question and answer are required');

    const r = await query(
      `INSERT INTO sid_faqs (question, answer, scope, display_order, is_active) VALUES (?, ?, ?, ?, ?)`,
      [question, answer, scope, displayOrder, isActive ? 1 : 0]
    );

    res.status(201).json({ success: true, id: String(r.insertId), message: 'FAQ created' });
  })
);

router.put(
  '/faqs/:id',
  requirePermission('faqs.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { question, answer, scope, displayOrder, isActive } = req.body;
    const f = await one('SELECT * FROM sid_faqs WHERE id = ?', [id]);
    if (!f) throw new HttpError(404, 'FAQ not found');

    await query(
      `UPDATE sid_faqs SET question = ?, answer = ?, scope = ?, display_order = ?, is_active = ? WHERE id = ?`,
      [
        question || f.question,
        answer || f.answer,
        scope || f.scope,
        displayOrder !== undefined ? displayOrder : f.display_order,
        isActive !== undefined ? (isActive ? 1 : 0) : f.is_active,
        id,
      ]
    );

    res.json({ success: true, message: 'FAQ updated successfully' });
  })
);

router.delete(
  '/faqs/:id',
  requirePermission('faqs.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_faqs WHERE id = ?', [id]);
    res.json({ success: true, message: 'FAQ deleted' });
  })
);

/* ========================================================================== */
/* 11. WEBSITE SETTINGS & SEO CONTROLS                                        */
/* ========================================================================== */

router.get(
  '/settings',
  requirePermission('settings.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT setting_key, setting_value FROM sid_settings');
    const out = {};
    rows.forEach((r) => {
      out[r.setting_key] = parseJson(r.setting_value, r.setting_value);
    });

    const general = out.general || {};
    const seo = out.seo || {};

    res.json({
      success: true,
      data: {
        clinicName: general.clinicName || 'Skinfinity Derma',
        tagline: general.tagline || '',
        phone: general.phone || '',
        alternatePhone: general.alternatePhone || '',
        whatsapp: general.whatsapp || '',
        email: general.email || '',
        workingHours: general.workingHours || '',
        address: general.address || '',
        socialLinks: general.socialLinks || {},
        seo: {
          defaultTitle: seo.defaultTitle || '',
          defaultMetaDescription: seo.defaultDescription || '',
        },
      },
    });
  })
);

router.post(
  '/settings',
  requirePermission('settings.edit'),
  asyncHandler(async (req, res) => {
    const body = req.body;

    const existingGeneral = await one('SELECT setting_value FROM sid_settings WHERE setting_key = "general"');
    const general = existingGeneral ? parseJson(existingGeneral.setting_value, {}) : {};

    if (body.clinicName) general.clinicName = body.clinicName;
    if (body.tagline !== undefined) general.tagline = body.tagline;
    if (body.phone) general.phone = body.phone;
    if (body.alternatePhone !== undefined) general.alternatePhone = body.alternatePhone;
    if (body.whatsapp !== undefined) general.whatsapp = body.whatsapp;
    if (body.email) general.email = body.email;
    if (body.workingHours !== undefined) general.workingHours = body.workingHours;
    if (body.address !== undefined) general.address = body.address;
    if (body.socialLinks) general.socialLinks = body.socialLinks;

    await query(
      `INSERT INTO sid_settings (setting_key, setting_value, group_name) VALUES ('general', ?, 'general')
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [JSON.stringify(general)]
    );

    if (body.seo) {
      const existingSeo = await one('SELECT setting_value FROM sid_settings WHERE setting_key = "seo"');
      const seo = existingSeo ? parseJson(existingSeo.setting_value, {}) : {};
      if (body.seo.defaultTitle) seo.defaultTitle = body.seo.defaultTitle;
      if (body.seo.defaultMetaDescription) seo.defaultDescription = body.seo.defaultMetaDescription;
      await query(
        `INSERT INTO sid_settings (setting_key, setting_value, group_name) VALUES ('seo', ?, 'seo')
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [JSON.stringify(seo)]
      );
    }

    await audit(req, { action: 'update', entity: 'settings', summary: 'Updated clinic settings' });
    res.json({ success: true, message: 'Settings saved successfully' });
  })
);

/* ========================================================================== */
/* 12. VIP MEMBERSHIPS CRUD                                                   */
/* ========================================================================== */

router.get(
  '/memberships',
  requirePermission('treatments.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM sid_membership_plans ORDER BY display_order ASC, id ASC');
    res.json({
      success: true,
      data: rows.map((m) => ({
        id: String(m.id),
        slug: m.slug,
        name: m.name,
        price: Number(m.price),
        priceFormatted: m.price ? `₹${Number(m.price).toLocaleString('en-IN')}` : m.price_formatted,
        period: m.period,
        validity: m.validity,
        tagline: m.tagline,
        isPopular: Boolean(m.is_popular),
        features: parseJson(m.features, []),
        cardBg: m.card_bg,
        passGradient: m.pass_gradient,
        badgeStyle: m.badge_style,
        buttonStyle: m.button_style,
        accentText: m.accent_text,
        displayOrder: m.display_order,
        isActive: Boolean(m.is_active),
        subscribersCount: m.subscribers_count || 0,
        createdAt: m.created_at,
        updatedAt: m.updated_at,
      })),
    });
  })
);

router.post(
  '/memberships',
  requirePermission('treatments.create'),
  asyncHandler(async (req, res) => {
    const { name, slug, price, priceFormatted, period = '/ year', validity = '12 Months Validity', tagline, isPopular = 0, features = [], displayOrder = 0, isActive = 1 } = req.body;
    if (!name) throw new HttpError(400, 'Plan name is required');
    const finalSlug = slug || slugify(name);
    const numPrice = Number(price) || 0;
    const finalPriceFormatted = priceFormatted || `₹${numPrice.toLocaleString('en-IN')}`;

    const result = await query(
      `INSERT INTO sid_membership_plans (slug, name, price, price_formatted, period, validity, tagline, is_popular, features, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [finalSlug, name, numPrice, finalPriceFormatted, period, validity, tagline || null, isPopular ? 1 : 0, JSON.stringify(Array.isArray(features) ? features : [features]), Number(displayOrder) || 0, isActive ? 1 : 0]
    );

    res.status(201).json({ success: true, message: 'Membership plan created', data: { id: String(result.insertId) } });
  })
);

router.put(
  '/memberships/:id',
  requirePermission('treatments.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const existing = await one('SELECT * FROM sid_membership_plans WHERE id = ?', [id]);
    if (!existing) throw new HttpError(404, 'Plan not found');

    const numPrice = body.price !== undefined ? Number(body.price) : Number(existing.price);
    const formatted = body.priceFormatted || (body.price !== undefined ? `₹${numPrice.toLocaleString('en-IN')}` : existing.price_formatted);

    await query(
      `UPDATE sid_membership_plans SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        price = ?,
        price_formatted = ?,
        period = COALESCE(?, period),
        validity = COALESCE(?, validity),
        tagline = COALESCE(?, tagline),
        is_popular = COALESCE(?, is_popular),
        features = COALESCE(?, features),
        display_order = COALESCE(?, display_order),
        is_active = COALESCE(?, is_active),
        subscribers_count = COALESCE(?, subscribers_count)
      WHERE id = ?`,
      [
        body.name || null,
        body.slug || null,
        numPrice,
        formatted,
        body.period || null,
        body.validity || null,
        body.tagline || null,
        body.isPopular !== undefined ? (body.isPopular ? 1 : 0) : null,
        body.features !== undefined ? JSON.stringify(body.features) : null,
        body.displayOrder !== undefined ? Number(body.displayOrder) : null,
        body.isActive !== undefined ? (body.isActive ? 1 : 0) : null,
        body.subscribersCount !== undefined ? Number(body.subscribersCount) : null,
        id,
      ]
    );

    res.json({ success: true, message: 'Membership plan updated' });
  })
);

router.delete(
  '/memberships/:id',
  requirePermission('treatments.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_membership_plans WHERE id = ?', [id]);
    res.json({ success: true, message: 'Membership plan deleted' });
  })
);

/* ========================================================================== */
/* 13. AUDIT LOGS                                                             */
/* ========================================================================== */

router.get(
  '/audit-logs',
  requirePermission('audit_logs.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM sid_audit_logs ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, data: rows });
  })
);

/* ========================================================================== */
/* 14. HOMEPAGE SECTION-BY-SECTION CMS                                        */
/* ========================================================================== */

router.get(
  '/homepage',
  requirePermission('banners.view'),
  asyncHandler(async (req, res) => {
    const sections = await query('SELECT * FROM sid_homepage_sections ORDER BY display_order ASC');
    const items = await query('SELECT * FROM sid_homepage_items ORDER BY display_order ASC');

    const groupedItems = {};
    items.forEach(i => {
      groupedItems[i.section_key] = groupedItems[i.section_key] || [];
      groupedItems[i.section_key].push({
        id: String(i.id),
        title: i.title,
        subtitle: i.subtitle,
        description: i.description,
        icon: i.icon,
        imageUrl: i.image_url,
        linkUrl: i.link_url,
        badge: i.badge,
        extra: parseJson(i.extra_data, {}),
        displayOrder: i.display_order,
        isActive: Boolean(i.is_active)
      });
    });

    res.json({
      success: true,
      data: {
        sections: sections.map(s => ({
          id: String(s.id),
          sectionKey: s.section_key,
          sectionName: s.section_name,
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
          extra: parseJson(s.extra_json, {}),
          displayOrder: s.display_order,
          isActive: Boolean(s.is_active),
          items: groupedItems[s.section_key] || []
        }))
      }
    });
  })
);

router.put(
  '/homepage/:key',
  requirePermission('banners.edit'),
  asyncHandler(async (req, res) => {
    const { key } = req.params;
    const {
      title, subtitle, badgeText, description, mediaUrl, mediaAlt,
      buttonText, buttonUrl, secondaryButtonText, secondaryButtonUrl,
      extra, isActive
    } = req.body;

    const sec = await one('SELECT id FROM sid_homepage_sections WHERE section_key = ?', [key]);
    if (!sec) throw new HttpError(404, 'Homepage section not found');

    await query(
      `UPDATE sid_homepage_sections
          SET title = ?, subtitle = ?, badge_text = ?, description = ?,
              media_url = ?, media_alt = ?, button_text = ?, button_url = ?,
              secondary_button_text = ?, secondary_button_url = ?,
              extra_json = ?, is_active = ?
        WHERE section_key = ?`,
      [
        title || null,
        subtitle || null,
        badgeText || null,
        description || null,
        mediaUrl || null,
        mediaAlt || null,
        buttonText || null,
        buttonUrl || null,
        secondaryButtonText || null,
        secondaryButtonUrl || null,
        extra ? JSON.stringify(extra) : null,
        isActive !== undefined ? (isActive ? 1 : 0) : 1,
        key
      ]
    );

    await audit(req, { action: 'update', entity: 'homepage_sections', entityId: sec.id, summary: `Updated homepage section "${key}"` });
    res.json({ success: true, message: `Homepage section "${key}" updated successfully` });
  })
);

router.post(
  '/homepage/:key/items',
  requirePermission('banners.create'),
  asyncHandler(async (req, res) => {
    const { key } = req.params;
    const { title, subtitle, description, icon, imageUrl, linkUrl, badge, extra, displayOrder = 1 } = req.body;
    if (!title) throw new HttpError(400, 'Item title is required');

    const r = await query(
      `INSERT INTO sid_homepage_items (section_key, title, subtitle, description, icon, image_url, link_url, badge, extra_data, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [key, title, subtitle || null, description || null, icon || null, imageUrl || null, linkUrl || null, badge || null, extra ? JSON.stringify(extra) : null, displayOrder]
    );

    res.status(201).json({ success: true, id: String(r.insertId), message: 'Section item added' });
  })
);

router.delete(
  '/homepage/items/:id',
  requirePermission('banners.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_homepage_items WHERE id = ?', [id]);
    res.json({ success: true, message: 'Section item deleted' });
  })
);

/* ========================================================================== */
/* 15. DEDICATED SERVICES CRUD                                                */
/* ========================================================================== */

router.get(
  '/services',
  requirePermission('treatments.view'),
  asyncHandler(async (req, res) => {
    const rows = await query(`
      SELECT s.*, c.name AS category_name
        FROM sid_services s
        LEFT JOIN sid_service_categories c ON c.id = s.category_id
       ORDER BY s.display_order ASC, s.id ASC
    `);

    res.json({
      success: true,
      data: rows.map(s => ({
        id: String(s.id),
        categoryId: s.category_id ? String(s.category_id) : '',
        categoryName: s.category_name,
        name: s.name,
        slug: s.slug,
        shortDesc: s.short_desc,
        fullDesc: s.full_desc,
        image: s.image,
        benefits: parseJson(s.benefits, []),
        procedureSteps: parseJson(s.procedure_steps, []),
        ctaText: s.cta_text,
        ctaUrl: s.cta_url,
        displayOrder: s.display_order,
        isActive: Boolean(s.is_active),
        seoTitle: s.seo_title,
        seoDesc: s.seo_desc
      }))
    });
  })
);

router.post(
  '/services',
  requirePermission('treatments.create'),
  asyncHandler(async (req, res) => {
    const { categoryId, name, slug, shortDesc, fullDesc, image, benefits, procedureSteps, ctaText, ctaUrl, displayOrder = 1, isActive = 1, seoTitle, seoDesc } = req.body;
    if (!name) throw new HttpError(400, 'Service name is required');

    const sSlug = slug ? slug.toLowerCase().replace(/[\s\W-]+/g, '-') : name.toLowerCase().replace(/[\s\W-]+/g, '-');

    const r = await query(
      `INSERT INTO sid_services (category_id, name, slug, short_desc, full_desc, image, benefits, procedure_steps, cta_text, cta_url, display_order, is_active, seo_title, seo_desc)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        categoryId || null,
        name,
        sSlug,
        shortDesc || null,
        fullDesc || null,
        image || null,
        benefits ? JSON.stringify(benefits) : null,
        procedureSteps ? JSON.stringify(procedureSteps) : null,
        ctaText || 'Book Consultation',
        ctaUrl || '/treatments',
        displayOrder,
        isActive ? 1 : 0,
        seoTitle || null,
        seoDesc || null
      ]
    );

    await audit(req, { action: 'create', entity: 'services', entityId: r.insertId, summary: `Created clinical service "${name}"` });
    res.status(201).json({ success: true, id: String(r.insertId), message: 'Service created successfully' });
  })
);

router.put(
  '/services/:id',
  requirePermission('treatments.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { categoryId, name, slug, shortDesc, fullDesc, image, benefits, procedureSteps, ctaText, ctaUrl, displayOrder, isActive, seoTitle, seoDesc } = req.body;

    const s = await one('SELECT id FROM sid_services WHERE id = ?', [id]);
    if (!s) throw new HttpError(404, 'Service not found');

    await query(
      `UPDATE sid_services
          SET category_id = ?, name = ?, slug = ?, short_desc = ?, full_desc = ?,
              image = ?, benefits = ?, procedure_steps = ?, cta_text = ?, cta_url = ?,
              display_order = ?, is_active = ?, seo_title = ?, seo_desc = ?
        WHERE id = ?`,
      [
        categoryId || null,
        name,
        slug,
        shortDesc || null,
        fullDesc || null,
        image || null,
        benefits ? JSON.stringify(benefits) : null,
        procedureSteps ? JSON.stringify(procedureSteps) : null,
        ctaText || 'Book Consultation',
        ctaUrl || '/treatments',
        displayOrder !== undefined ? displayOrder : 1,
        isActive !== undefined ? (isActive ? 1 : 0) : 1,
        seoTitle || null,
        seoDesc || null,
        id
      ]
    );

    res.json({ success: true, message: 'Service updated successfully' });
  })
);

router.delete(
  '/services/:id',
  requirePermission('treatments.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_services WHERE id = ?', [id]);
    res.json({ success: true, message: 'Service deleted successfully' });
  })
);

/* ========================================================================== */
/* 16. LOCATIONS / CLINIC BRANCHES CRUD                                       */
/* ========================================================================== */

router.get(
  '/locations',
  requirePermission('settings.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM sid_clinics ORDER BY display_order ASC, id ASC');
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
        image: c.image,
        bannerImage: c.banner_image,
        seoTitle: c.seo_title,
        seoDesc: c.seo_desc,
        metaKeywords: c.meta_keywords,
        displayOrder: c.display_order,
        isActive: Boolean(c.is_active)
      }))
    });
  })
);

router.post(
  '/locations',
  requirePermission('settings.edit'),
  asyncHandler(async (req, res) => {
    const { city, title, slug, address, landmark, pincode, phones, email, whatsapp, hours, mapEmbedUrl, mapLink, image, bannerImage, seoTitle, seoDesc, metaKeywords, displayOrder = 1, isActive = 1 } = req.body;
    if (!title || !city) throw new HttpError(400, 'Clinic title and city are required');

    const lSlug = slug ? slug.toLowerCase().replace(/[\s\W-]+/g, '-') : `${city}-${title}`.toLowerCase().replace(/[\s\W-]+/g, '-');

    const r = await query(
      `INSERT INTO sid_clinics (slug, city, title, address, landmark, pincode, phones, email, whatsapp, hours, map_embed_url, map_link, image, banner_image, seo_title, seo_desc, meta_keywords, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lSlug,
        city,
        title,
        address || '',
        landmark || null,
        pincode || null,
        phones ? JSON.stringify(Array.isArray(phones) ? phones : [phones]) : '[]',
        email || null,
        whatsapp || null,
        hours || '10:00 AM - 8:00 PM',
        mapEmbedUrl || null,
        mapLink || null,
        image || null,
        bannerImage || null,
        seoTitle || null,
        seoDesc || null,
        metaKeywords || null,
        displayOrder,
        isActive ? 1 : 0
      ]
    );

    res.status(201).json({ success: true, id: String(r.insertId), message: 'Clinic location created' });
  })
);

router.put(
  '/locations/:id',
  requirePermission('settings.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { city, title, slug, address, landmark, pincode, phones, email, whatsapp, hours, mapEmbedUrl, mapLink, image, bannerImage, seoTitle, seoDesc, metaKeywords, displayOrder, isActive } = req.body;

    const loc = await one('SELECT id FROM sid_clinics WHERE id = ?', [id]);
    if (!loc) throw new HttpError(404, 'Clinic location not found');

    await query(
      `UPDATE sid_clinics
          SET city = ?, title = ?, slug = ?, address = ?, landmark = ?, pincode = ?,
              phones = ?, email = ?, whatsapp = ?, hours = ?, map_embed_url = ?, map_link = ?,
              image = ?, banner_image = ?, seo_title = ?, seo_desc = ?, meta_keywords = ?,
              display_order = ?, is_active = ?
        WHERE id = ?`,
      [
        city,
        title,
        slug,
        address || '',
        landmark || null,
        pincode || null,
        phones ? JSON.stringify(Array.isArray(phones) ? phones : [phones]) : '[]',
        email || null,
        whatsapp || null,
        hours || '10:00 AM - 8:00 PM',
        mapEmbedUrl || null,
        mapLink || null,
        image || null,
        bannerImage || null,
        seoTitle || null,
        seoDesc || null,
        metaKeywords || null,
        displayOrder !== undefined ? displayOrder : 1,
        isActive !== undefined ? (isActive ? 1 : 0) : 1,
        id
      ]
    );

    res.json({ success: true, message: 'Clinic location updated successfully' });
  })
);

router.delete(
  '/locations/:id',
  requirePermission('settings.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_clinics WHERE id = ?', [id]);
    res.json({ success: true, message: 'Clinic location deleted' });
  })
);

/* ========================================================================== */
/* 17. DYNAMIC PAGES BUILDER CRUD                                             */
/* ========================================================================== */

router.get(
  '/pages',
  requirePermission('settings.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM sid_pages ORDER BY display_order ASC, id ASC');
    res.json({
      success: true,
      data: rows.map(p => ({
        id: String(p.id),
        title: p.title,
        slug: p.slug,
        subtitle: p.subtitle,
        bannerImage: p.banner_image,
        content: p.content,
        seoTitle: p.seo_title,
        seoDesc: p.seo_desc,
        seoKeywords: p.seo_keywords,
        displayOrder: p.display_order,
        isActive: Boolean(p.is_active)
      }))
    });
  })
);

router.post(
  '/pages',
  requirePermission('settings.edit'),
  asyncHandler(async (req, res) => {
    const { title, slug, subtitle, bannerImage, content, seoTitle, seoDesc, seoKeywords, displayOrder = 1, isActive = 1 } = req.body;
    if (!title) throw new HttpError(400, 'Page title is required');

    const pSlug = slug ? slug.toLowerCase().replace(/[\s\W-]+/g, '-') : title.toLowerCase().replace(/[\s\W-]+/g, '-');

    const r = await query(
      `INSERT INTO sid_pages (title, slug, subtitle, banner_image, content, seo_title, seo_desc, seo_keywords, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, pSlug, subtitle || null, bannerImage || null, content || null, seoTitle || null, seoDesc || null, seoKeywords || null, displayOrder, isActive ? 1 : 0]
    );

    res.status(201).json({ success: true, id: String(r.insertId), message: 'Page created successfully' });
  })
);

router.put(
  '/pages/:id',
  requirePermission('settings.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, slug, subtitle, bannerImage, content, seoTitle, seoDesc, seoKeywords, displayOrder, isActive } = req.body;

    const p = await one('SELECT id FROM sid_pages WHERE id = ?', [id]);
    if (!p) throw new HttpError(404, 'Page not found');

    await query(
      `UPDATE sid_pages
          SET title = ?, slug = ?, subtitle = ?, banner_image = ?, content = ?,
              seo_title = ?, seo_desc = ?, seo_keywords = ?, display_order = ?, is_active = ?
        WHERE id = ?`,
      [
        title,
        slug,
        subtitle || null,
        bannerImage || null,
        content || null,
        seoTitle || null,
        seoDesc || null,
        seoKeywords || null,
        displayOrder !== undefined ? displayOrder : 1,
        isActive !== undefined ? (isActive ? 1 : 0) : 1,
        id
      ]
    );

    res.json({ success: true, message: 'Page updated successfully' });
  })
);

router.delete(
  '/pages/:id',
  requirePermission('settings.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM sid_pages WHERE id = ?', [id]);
    res.json({ success: true, message: 'Page deleted successfully' });
  })
);

module.exports = router;
