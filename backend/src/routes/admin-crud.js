const express = require('express');
const { query, one, tx } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');
const { slugify } = require('../utils/slug');
const { parseJson } = require('../utils/helpers');

const router = express.Router();

/**
 * GET /api/dashboard/stats
 */
router.get(
  '/dashboard/stats',
  requirePermission('dashboard.view'),
  asyncHandler(async (req, res) => {
    const [banners, doctors, treatments, categories, concerns, appts, enqs, reviews] = await Promise.all([
      one('SELECT COUNT(*) AS total, SUM(is_active) AS active FROM banners'),
      one('SELECT COUNT(*) AS total, SUM(is_active) AS active FROM doctors'),
      one('SELECT COUNT(*) AS total, SUM(is_active) AS active, SUM(is_featured) AS featured FROM treatments'),
      one('SELECT COUNT(*) AS total FROM categories'),
      one('SELECT COUNT(*) AS total FROM concerns'),
      one('SELECT COUNT(*) AS total, SUM(CASE WHEN status="pending" THEN 1 ELSE 0 END) AS pending FROM appointments'),
      one('SELECT COUNT(*) AS total, SUM(CASE WHEN status="new" THEN 1 ELSE 0 END) AS newCount FROM enquiries'),
      one('SELECT COUNT(*) AS total FROM reviews'),
    ]);

    const recentAppts = await query(
      `SELECT a.id, a.appointment_no, a.patient_name, a.phone, a.service_name, a.appointment_date, a.appointment_time, a.status
         FROM appointments a ORDER BY a.created_at DESC LIMIT 5`
    );

    const recentEnqs = await query(
      `SELECT e.id, e.enquiry_no, e.name, e.phone, e.type, e.status, e.created_at
         FROM enquiries e ORDER BY e.created_at DESC LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        totalBanners: banners.total || 0,
        activeBanners: banners.active || 0,
        totalDoctors: doctors.total || 0,
        activeDoctors: doctors.active || 0,
        totalTreatments: treatments.total || 0,
        activeTreatments: treatments.active || 0,
        featuredTreatments: treatments.featured || 0,
        totalCategories: categories.total || 0,
        totalConcerns: concerns.total || 0,
        totalAppointments: appts.total || 0,
        pendingAppointments: appts.pending || 0,
        totalEnquiries: enqs.total || 0,
        newEnquiries: enqs.newCount || 0,
        totalReviews: reviews.total || 0,
        recentAppointments: recentAppts,
        recentEnquiries: recentEnqs,
      },
    });
  })
);

// -------------------------------------------------------------
// Banners CRUD
// -------------------------------------------------------------
router.get(
  '/banners',
  requirePermission('banners.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM banners ORDER BY display_order ASC, id DESC');
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
        displayLocation: r.location,
        location: r.location,
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
    const { title, subtitle, desktopImage, mobileImage, altText, buttonText, buttonUrl, location = 'Homepage Hero', displayOrder = 1, isActive = 1 } = req.body;
    if (!title) throw new HttpError(400, 'Banner title is required');

    const r = await query(
      `INSERT INTO banners (title, subtitle, desktop_image, mobile_image, alt_text, button_text, button_url, location, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, subtitle || null, desktopImage || null, mobileImage || null, altText || null, buttonText || null, buttonUrl || null, location, displayOrder, isActive ? 1 : 0]
    );

    await audit(req, { action: 'create', entity: 'banners', entityId: r.insertId, summary: `Added banner "${title}"` });
    res.status(201).json({ success: true, id: String(r.insertId), message: 'Banner created successfully' });
  })
);

router.put(
  '/banners/:id',
  requirePermission('banners.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, desktopImage, mobileImage, altText, buttonText, buttonUrl, location, displayLocation, displayOrder, isActive } = req.body;

    const b = await one('SELECT * FROM banners WHERE id = ?', [id]);
    if (!b) throw new HttpError(404, 'Banner not found');

    await query(
      `UPDATE banners
          SET title = ?, subtitle = ?, desktop_image = ?, mobile_image = ?, alt_text = ?,
              button_text = ?, button_url = ?, location = ?, display_order = ?, is_active = ?
        WHERE id = ?`,
      [
        title || b.title,
        subtitle !== undefined ? subtitle : b.subtitle,
        desktopImage || b.desktop_image,
        mobileImage !== undefined ? mobileImage : b.mobile_image,
        altText !== undefined ? altText : b.alt_text,
        buttonText !== undefined ? buttonText : b.button_text,
        buttonUrl !== undefined ? buttonUrl : b.button_url,
        location || displayLocation || b.location,
        displayOrder !== undefined ? displayOrder : b.display_order,
        isActive !== undefined ? (isActive ? 1 : 0) : b.is_active,
        id,
      ]
    );

    await audit(req, { action: 'update', entity: 'banners', entityId: id, summary: `Updated banner "${title || b.title}"` });
    res.json({ success: true, message: 'Banner updated successfully' });
  })
);

router.patch(
  '/banners/:id/toggle-status',
  requirePermission('banners.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const b = await one('SELECT is_active, title FROM banners WHERE id = ?', [id]);
    if (!b) throw new HttpError(404, 'Banner not found');

    const next = b.is_active ? 0 : 1;
    await query('UPDATE banners SET is_active = ? WHERE id = ?', [next, id]);
    res.json({ success: true, isActive: Boolean(next), message: `Banner is now ${next ? 'active' : 'inactive'}` });
  })
);

router.delete(
  '/banners/:id',
  requirePermission('banners.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM banners WHERE id = ?', [id]);
    res.json({ success: true, message: 'Banner deleted successfully' });
  })
);

// -------------------------------------------------------------
// Doctors CRUD
// -------------------------------------------------------------
router.get(
  '/doctors',
  requirePermission('doctors.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM doctors ORDER BY display_order ASC, id ASC');
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
      `INSERT INTO doctors (name, slug, role, qualifications, specialty, experience, image, bio, consultation_fee, available_locations, availability, display_order, is_active)
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

    const d = await one('SELECT * FROM doctors WHERE id = ?', [id]);
    if (!d) throw new HttpError(404, 'Doctor not found');

    const locs = availableLocations || (clinicCity ? clinicCity.split(',').map((s) => s.trim()) : parseJson(d.available_locations, []));

    await query(
      `UPDATE doctors
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
    const d = await one('SELECT is_active FROM doctors WHERE id = ?', [id]);
    if (!d) throw new HttpError(404, 'Doctor not found');
    const next = d.is_active ? 0 : 1;
    await query('UPDATE doctors SET is_active = ? WHERE id = ?', [next, id]);
    res.json({ success: true, isActive: Boolean(next), message: `Doctor is now ${next ? 'active' : 'inactive'}` });
  })
);

router.delete(
  '/doctors/:id',
  requirePermission('doctors.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM doctors WHERE id = ?', [id]);
    res.json({ success: true, message: 'Doctor profile deleted' });
  })
);

// -------------------------------------------------------------
// Treatments CRUD
// -------------------------------------------------------------
router.get(
  '/treatments',
  requirePermission('treatments.view'),
  asyncHandler(async (req, res) => {
    const rows = await query(
      `SELECT t.*, c.name AS category_name, c.slug AS category_slug
         FROM treatments t
         LEFT JOIN categories c ON c.id = t.category_id
        ORDER BY t.display_order ASC, t.id ASC`
    );

    res.json({
      success: true,
      data: rows.map((t) => ({
        id: String(t.id),
        slug: t.slug,
        name: t.name,
        categoryId: t.category_id ? String(t.category_id) : '',
        categoryName: t.category_name,
        category: t.category_name,
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
         FROM treatments t
         LEFT JOIN categories c ON c.id = t.category_id
        WHERE t.id = ? LIMIT 1`,
      [id]
    );
    if (!t) throw new HttpError(404, 'Treatment not found');

    const concernRows = await query(
      `SELECT concern_id FROM treatment_concerns WHERE treatment_id = ?`,
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
        price: Number(t.price),
        originalPrice: Number(t.original_price),
        discountLabel: t.discount_badge,
        estimatedDuration: t.duration,
        displayRating: Number(t.rating),
        shortDescription: t.short_desc,
        fullDescription: t.full_desc,
        featuredImage: t.banner_image,
        galleryImages: parseJson(t.gallery_images, []),
        process: parseJson(t.how_it_works, []),
        suitability: t.ideal_for ? parseJson(t.ideal_for, []).join('\n') : '',
        aftercare: t.after_treatment ? parseJson(t.after_treatment, []).join('\n') : '',
        faqs: parseJson(t.faqs, []),
        seoTitle: t.seo_title,
        seoDescription: t.seo_description,
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
    const { name, slug, categoryId, concernIds = [], price = 0, originalPrice, discountLabel, estimatedDuration, displayRating = 4.9, shortDescription, fullDescription, featuredImage, galleryImages, process, suitability, aftercare, faqs, seoTitle, seoDescription, isFeatured = 0, isActive = 1, displayOrder = 1 } = req.body;

    if (!name) throw new HttpError(400, 'Treatment name is required');
    const trtSlug = slug || slugify(name);

    const r = await query(
      `INSERT INTO treatments (
        name, slug, category_id, price, original_price, discount_badge, duration, rating,
        short_desc, full_desc, banner_image, gallery_images, how_it_works, ideal_for,
        after_treatment, faqs, seo_title, seo_description, is_featured, is_active, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        trtSlug,
        categoryId ? parseInt(categoryId, 10) : null,
        price,
        originalPrice || null,
        discountLabel || null,
        estimatedDuration || '60 mins',
        displayRating,
        shortDescription || null,
        fullDescription || null,
        featuredImage || '/images/treatments/banner-laser.webp',
        galleryImages ? JSON.stringify(galleryImages) : null,
        process ? JSON.stringify(process) : null,
        suitability ? JSON.stringify(Array.isArray(suitability) ? suitability : suitability.split('\n').filter(Boolean)) : null,
        aftercare ? JSON.stringify(Array.isArray(aftercare) ? aftercare : aftercare.split('\n').filter(Boolean)) : null,
        faqs ? JSON.stringify(faqs) : null,
        seoTitle || null,
        seoDescription || null,
        isFeatured ? 1 : 0,
        isActive ? 1 : 0,
        displayOrder,
      ]
    );

    const treatmentId = r.insertId;
    if (concernIds && concernIds.length) {
      for (const cid of concernIds) {
        await query('INSERT IGNORE INTO treatment_concerns (treatment_id, concern_id) VALUES (?, ?)', [
          treatmentId,
          parseInt(cid, 10),
        ]);
      }
    }

    await audit(req, { action: 'create', entity: 'treatments', entityId: treatmentId, summary: `Added treatment "${name}"` });
    res.status(201).json({ success: true, id: String(treatmentId), message: 'Treatment created' });
  })
);

router.put(
  '/treatments/:id',
  requirePermission('treatments.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, slug, categoryId, concernIds, price, originalPrice, discountLabel, estimatedDuration, displayRating, shortDescription, fullDescription, featuredImage, galleryImages, process, suitability, aftercare, faqs, seoTitle, seoDescription, isFeatured, isActive, displayOrder } = req.body;

    const t = await one('SELECT * FROM treatments WHERE id = ?', [id]);
    if (!t) throw new HttpError(404, 'Treatment not found');

    await query(
      `UPDATE treatments
          SET name = ?, slug = ?, category_id = ?, price = ?, original_price = ?, discount_badge = ?,
              duration = ?, rating = ?, short_desc = ?, full_desc = ?, banner_image = ?,
              gallery_images = ?, how_it_works = ?, ideal_for = ?, after_treatment = ?, faqs = ?,
              seo_title = ?, seo_description = ?, is_featured = ?, is_active = ?, display_order = ?
        WHERE id = ?`,
      [
        name || t.name,
        slug || t.slug,
        categoryId !== undefined ? (categoryId ? parseInt(categoryId, 10) : null) : t.category_id,
        price !== undefined ? price : t.price,
        originalPrice !== undefined ? originalPrice : t.original_price,
        discountLabel !== undefined ? discountLabel : t.discount_badge,
        estimatedDuration !== undefined ? estimatedDuration : t.duration,
        displayRating !== undefined ? displayRating : t.rating,
        shortDescription !== undefined ? shortDescription : t.short_desc,
        fullDescription !== undefined ? fullDescription : t.full_desc,
        featuredImage || t.banner_image,
        galleryImages !== undefined ? JSON.stringify(galleryImages) : t.gallery_images,
        process !== undefined ? JSON.stringify(process) : t.how_it_works,
        suitability !== undefined ? JSON.stringify(Array.isArray(suitability) ? suitability : suitability.split('\n').filter(Boolean)) : t.ideal_for,
        aftercare !== undefined ? JSON.stringify(Array.isArray(aftercare) ? aftercare : aftercare.split('\n').filter(Boolean)) : t.after_treatment,
        faqs !== undefined ? JSON.stringify(faqs) : t.faqs,
        seoTitle !== undefined ? seoTitle : t.seo_title,
        seoDescription !== undefined ? seoDescription : t.seo_description,
        isFeatured !== undefined ? (isFeatured ? 1 : 0) : t.is_featured,
        isActive !== undefined ? (isActive ? 1 : 0) : t.is_active,
        displayOrder !== undefined ? displayOrder : t.display_order,
        id,
      ]
    );

    if (concernIds !== undefined) {
      await query('DELETE FROM treatment_concerns WHERE treatment_id = ?', [id]);
      for (const cid of concernIds) {
        await query('INSERT IGNORE INTO treatment_concerns (treatment_id, concern_id) VALUES (?, ?)', [
          id,
          parseInt(cid, 10),
        ]);
      }
    }

    res.json({ success: true, message: 'Treatment updated successfully' });
  })
);

router.patch(
  '/treatments/:id/toggle-status',
  requirePermission('treatments.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const t = await one('SELECT is_active FROM treatments WHERE id = ?', [id]);
    if (!t) throw new HttpError(404, 'Treatment not found');
    const next = t.is_active ? 0 : 1;
    await query('UPDATE treatments SET is_active = ? WHERE id = ?', [next, id]);
    res.json({ success: true, isActive: Boolean(next), message: `Treatment is now ${next ? 'active' : 'inactive'}` });
  })
);

router.patch(
  '/treatments/:id/toggle-featured',
  requirePermission('treatments.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const t = await one('SELECT is_featured FROM treatments WHERE id = ?', [id]);
    if (!t) throw new HttpError(404, 'Treatment not found');
    const next = t.is_featured ? 0 : 1;
    await query('UPDATE treatments SET is_featured = ? WHERE id = ?', [next, id]);
    res.json({ success: true, isFeatured: Boolean(next), message: `Treatment featured status changed` });
  })
);

router.delete(
  '/treatments/:id',
  requirePermission('treatments.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM treatments WHERE id = ?', [id]);
    res.json({ success: true, message: 'Treatment deleted successfully' });
  })
);

// -------------------------------------------------------------
// Categories & Concerns CRUD
// -------------------------------------------------------------
router.get(
  '/categories',
  requirePermission('categories.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM categories ORDER BY display_order ASC, id ASC');
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

router.get(
  '/concerns',
  requirePermission('concerns.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM concerns ORDER BY display_order ASC, id ASC');
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

// -------------------------------------------------------------
// Settings & Audit Logs
// -------------------------------------------------------------
router.get(
  '/settings',
  requirePermission('settings.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT setting_key, setting_value FROM settings');
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

    const existingGeneral = await one('SELECT setting_value FROM settings WHERE setting_key = "general"');
    const general = existingGeneral ? parseJson(existingGeneral.setting_value, {}) : {};

    if (body.clinicName) general.clinicName = body.clinicName;
    if (body.tagline !== undefined) general.tagline = body.tagline;
    if (body.phone) general.phone = body.phone;
    if (body.alternatePhone !== undefined) general.alternatePhone = body.alternatePhone;
    if (body.email) general.email = body.email;
    if (body.workingHours !== undefined) general.workingHours = body.workingHours;
    if (body.address !== undefined) general.address = body.address;
    if (body.socialLinks) general.socialLinks = body.socialLinks;

    await query(
      `INSERT INTO settings (setting_key, setting_value, group_name) VALUES ('general', ?, 'general')
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [JSON.stringify(general)]
    );

    if (body.seo) {
      const existingSeo = await one('SELECT setting_value FROM settings WHERE setting_key = "seo"');
      const seo = existingSeo ? parseJson(existingSeo.setting_value, {}) : {};
      if (body.seo.defaultTitle) seo.defaultTitle = body.seo.defaultTitle;
      if (body.seo.defaultMetaDescription) seo.defaultDescription = body.seo.defaultMetaDescription;
      await query(
        `INSERT INTO settings (setting_key, setting_value, group_name) VALUES ('seo', ?, 'seo')
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [JSON.stringify(seo)]
      );
    }

    await audit(req, { action: 'update', entity: 'settings', summary: 'Updated clinic settings' });
    res.json({ success: true, message: 'Settings saved successfully' });
  })
);

router.get(
  '/audit-logs',
  requirePermission('audit_logs.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, data: rows });
  })
);

module.exports = router;
