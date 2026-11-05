const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { pool, query, one, tx } = require('../src/config/db');
const { MODULES, ALL_PERMISSIONS, ROLE_PRESETS } = require('../src/config/permissions');
const { slugify } = require('../src/utils/slug');

async function seed() {
  console.log('🚀 Starting Skinfinity Derma Database Seed...');

  // 1. Roles & Permissions
  console.log('1️⃣ Seeding Roles & Permissions...');
  for (const perm of ALL_PERMISSIONS) {
    await query(
      `INSERT INTO sid_permissions (code, module, action, label)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE module=VALUES(module), action=VALUES(action), label=VALUES(label)`,
      [perm.code, perm.module, perm.action, perm.label]
    );
  }

  const permRows = await query('SELECT id, code FROM sid_permissions');
  const permMap = new Map(permRows.map((r) => [r.code, r.id]));

  const roleMap = new Map();
  for (const preset of ROLE_PRESETS) {
    await query(
      `INSERT INTO sid_roles (slug, name, description, is_system)
       VALUES (?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description)`,
      [preset.slug, preset.name, preset.description]
    );
    const roleRow = await one('SELECT id, slug FROM sid_roles WHERE slug = ?', [preset.slug]);
    roleMap.set(preset.slug, roleRow.id);

    // Link permissions
    await query('DELETE FROM sid_role_permissions WHERE role_id = ?', [roleRow.id]);
    const pIds = preset.permissions.map((code) => permMap.get(code)).filter(Boolean);
    for (const pid of pIds) {
      await query('INSERT IGNORE INTO sid_role_permissions (role_id, permission_id) VALUES (?, ?)', [
        roleRow.id,
        pid,
      ]);
    }
  }

  // 2. Staff Users with RBAC
  console.log('2️⃣ Seeding Staff Users with Dedicated Roles...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);

  const users = [
    {
      name: 'Dr. Ipshita Johri (Founder)',
      email: 'superadmin@skinfinityderma.com',
      phone: '+91 9871941444',
      role_slug: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1594824813637-230cb233b47c?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Clinic Operations Admin',
      email: 'admin@skinfinityderma.com',
      phone: '+91 8929765785',
      role_slug: 'admin',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'SEO & Growth Manager',
      email: 'seo@skinfinityderma.com',
      phone: '+91 9811122233',
      role_slug: 'seo_executive',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Lead Web Developer',
      email: 'dev@skinfinityderma.com',
      phone: '+91 9877788899',
      role_slug: 'developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Reception & Patient Coordinator',
      email: 'reception@skinfinityderma.com',
      phone: '+91 9871941445',
      role_slug: 'front_desk',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  ];

  for (const u of users) {
    const roleId = roleMap.get(u.role_slug) || roleMap.get('admin');
    await query(
      `INSERT INTO sid_users (name, email, phone, password_hash, role_id, avatar, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')
       ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone), password_hash=VALUES(password_hash), role_id=VALUES(role_id), avatar=VALUES(avatar)`,
      [u.name, u.email, u.phone, passwordHash, roleId, u.avatar]
    );
  }

  // 3. Settings
  console.log('3️⃣ Seeding Clinic Settings...');
  const clinicSettings = {
    general: {
      clinicName: 'Skinfinity Derma',
      tagline: 'Premier Aesthetic Dermatology & Trichology Clinic',
      phone: '+91 9871941444',
      alternatePhone: '+91 8929765785',
      whatsapp: '+91 9871941444',
      email: 'skinfinityderma@gmail.com',
      workingHours: 'Mon - Sun: 10:00 AM – 08:00 PM',
      logo: '/images/logo.webp',
      favicon: '/favicon.png',
      socialLinks: {
        instagram: 'https://instagram.com/skinfinityderma',
        facebook: 'https://facebook.com/skinfinityderma',
        youtube: 'https://youtube.com/@skinfinityderma',
      },
    },
    seo: {
      defaultTitle: 'Best Dermatologist in Noida & Gurgaon | No.1 Skin Clinic | Skinfinity Derma',
      defaultDescription:
        'Award-winning Dermatology & Aesthetic Laser clinic led by Dr. Ipshita Johri. 4,500+ Verified reviews with 4.5 rating. US-FDA approved technologies.',
      keywords: 'Dermatologist in Noida, Skin Specialist Gurgaon, Laser Hair Removal Noida, HydraFacial Noida, Dr Ipshita Johri',
      ogImage: '/images/hero/hero-banner.webp',
      siteUrl: 'https://www.skinfinityderma.com',
    },
    reviews: {
      rating: 4.5,
      reviewCount: '4,500+',
      writeReviewUrl: 'https://g.page/r/skinfinityderma/review',
    },
    stats: {
      reviewsCount: '4,500+',
      rating: '4.5',
      yearsOfExcellence: '10+',
      totalPatients: '1,00,000+',
      expertDermatologists: '6+',
      successfulProcedures: '50,000+',
      safetyStandards: '100% US-FDA Approved',
    },
    scripts: {
      head: '<!-- Google Tag Manager / Analytics Scripts configured by Developer -->',
      body: '<!-- Pixel Scripts -->',
    },
  };

  for (const [group, value] of Object.entries(clinicSettings)) {
    await query(
      `INSERT INTO sid_settings (setting_key, setting_value, group_name)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)`,
      [group, JSON.stringify(value), group]
    );
  }

  // 4. Clinics
  console.log('4️⃣ Seeding Clinic Branches...');
  const clinics = [
    {
      slug: 'noida-sector-36',
      city: 'Noida',
      title: 'Skinfinity Derma — Noida Clinic (HQ)',
      address: 'Basement Floor, House B1, Sector 36',
      landmark: 'Near Logix City Centre Mall & Wave City Center Metro',
      pincode: '201303',
      phones: ['+91 9871941444', '+91 8929765785'],
      email: 'skinfinityderma@gmail.com',
      whatsapp: '+91 9871941444',
      hours: 'Mon - Sun: 10:00 AM – 08:00 PM',
      map_embed_url:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.9449753!2d77.3473269149!3d28.5714399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a555555555%3A0x1017377320914!2sSkinfinity%20Derma%20Noida!5e0!3m2!1sen!2sin!4v166313',
      map_link: 'https://maps.google.com/?q=Skinfinity+Derma+Noida',
      highlights: ['2 Min Walk from Metro', 'In-House Diagnostic Lab & Pharmacy', 'Full MD Dermatologist Team On-Site'],
      image: '/images/clinic/interior-1.jpg',
      latitude: 28.5714399,
      longitude: 77.3473269,
      display_order: 1,
    },
    {
      slug: 'gurgaon-golf-course-road',
      city: 'Gurgaon',
      title: 'Skinfinity Derma — Gurgaon Clinic',
      address: '2nd Floor, SP1, Sector 28, Golf Course Road',
      landmark: 'Opposite Mega Mall & Near Phase 1 Metro',
      pincode: '122002',
      phones: ['+91 8591110110', '+91 9871941444'],
      email: 'skinfinityderma@gmail.com',
      whatsapp: '+91 8591110110',
      hours: 'Mon - Sun: 10:00 AM – 08:00 PM',
      map_embed_url:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.2891!2d77.0987!3d28.4721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI4JzE5LjYiTiA3N8KwMDUnNTUuMyJF!5e0!3m2!1sen!2sin!4v166313',
      map_link: 'https://maps.google.com/?q=Skinfinity+Derma+Gurgaon',
      highlights: ['Prime Golf Course Road Location', 'Valet Parking Available', 'Private Executive Procedure Suites'],
      image: '/images/clinic/interior-2.jpg',
      latitude: 28.4721,
      longitude: 77.0987,
      display_order: 2,
    },
  ];

  for (const c of clinics) {
    await query(
      `INSERT INTO sid_clinics (slug, city, title, address, landmark, pincode, phones, email, whatsapp, hours, map_embed_url, map_link, highlights, image, latitude, longitude, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE title=VALUES(title), address=VALUES(address), phones=VALUES(phones), hours=VALUES(hours), highlights=VALUES(highlights)`,
      [
        c.slug,
        c.city,
        c.title,
        c.address,
        c.landmark,
        c.pincode,
        JSON.stringify(c.phones),
        c.email,
        c.whatsapp,
        c.hours,
        c.map_embed_url,
        c.map_link,
        JSON.stringify(c.highlights),
        c.image,
        c.latitude,
        c.longitude,
        c.display_order,
      ]
    );
  }

  // 5. Doctors
  console.log('5️⃣ Seeding Doctors...');
  const doctors = [
    {
      slug: 'dr-ipshita-johri',
      name: 'Dr. Ipshita Johri',
      role: 'Founder, Medical Director & Chief Dermatologist',
      qualifications: 'MBBS, DDV | PG Dip. Clinical Dermatology (Cardiff University, U.K.)',
      specialty: 'Celebrity Dermatologist, Advanced Anti-Ageing, Facial Sculpting & Aesthetic Lasers',
      experience: '12+ Years Clinical Experience',
      image: '/images/doctors/dr-ipshita-johri.jpg',
      bio: 'Dr. Ipshita Johri is the visionary founder and medical director of Skinfinity Derma clinics in Noida and Gurgaon. An internationally trained clinical dermatologist holding prestigious credentials from Cardiff University UK, she is renowned for her holistic, root-cause aesthetic medical approach.',
      consultation_fee: 1200,
      available_locations: ['Noida', 'Gurgaon'],
      availability: 'Mon, Wed, Fri, Sat (10:00 AM - 07:00 PM)',
      display_order: 1,
    },
    {
      slug: 'dr-sukriti-agarwal',
      name: 'Dr. Sukriti Agarwal',
      role: 'Senior Consultant Dermatologist & Trichologist',
      qualifications: 'MBBS, MD - Dermatology, Venereology & Leprosy',
      specialty: 'Acne Scar Subcision, Chemical Peels, Melasma Revision & Laser Hair Reduction',
      experience: '8+ Years Clinical Experience',
      image: '/images/doctors/dr-sukriti-agarwal.jpg',
      bio: 'Dr. Sukriti Agarwal is an acclaimed board-certified MD dermatologist specializing in clinical dermatology, medical trichology and scar revision protocols.',
      consultation_fee: 1000,
      available_locations: ['Noida'],
      availability: 'Mon - Sat (10:30 AM - 06:30 PM)',
      display_order: 2,
    },
    {
      slug: 'dr-anchal-bansal',
      name: 'Dr. Anchal Bansal',
      role: 'Consultant Dermatologist & Aesthetic Physician',
      qualifications: 'MBBS, DNB - Dermatology & Venereology',
      specialty: 'Medi-Facials, Anti-Ageing Injectables, Skin Glow Therapies & Hair Restoration',
      experience: '7+ Years Clinical Experience',
      image: '/images/doctors/dr-anchal-bansal.jpg',
      bio: 'Dr. Anchal Bansal brings extensive expertise in modern aesthetic procedures, precision laser protocols, and non-invasive facial rejuvenation.',
      consultation_fee: 1000,
      available_locations: ['Gurgaon'],
      availability: 'Tue, Thu, Sat, Sun (11:00 AM - 07:30 PM)',
      display_order: 3,
    },
    {
      slug: 'dr-neha-sharma',
      name: 'Dr. Neha Sharma',
      role: 'Consultant Aesthetic Physician',
      qualifications: 'MBBS, FAM (Fellowship in Aesthetic Medicine)',
      specialty: 'Laser Hair Reduction, Pigmentation Resurfacing & Body Contouring',
      experience: '6+ Years Clinical Experience',
      image: '/images/doctors/dr-neha-sharma.jpg',
      bio: 'Dr. Neha specializes in clinical laser procedures with custom wavelengths calibrated for diverse Indian Fitzpatrick skin types.',
      consultation_fee: 900,
      available_locations: ['Noida'],
      availability: 'Mon - Fri (10:00 AM - 06:00 PM)',
      display_order: 4,
    },
    {
      slug: 'dr-shradha-saxena',
      name: 'Dr. Shradha Saxena',
      role: 'Senior Trichology & Regenerative Hair Specialist',
      qualifications: 'MBBS, Fellowship in Hair Restoration & Regenerative Medicine',
      specialty: 'GFC / PRP Therapy, Female Pattern Thinning, Alopecia Areata & Scalp Health',
      experience: '7+ Years Experience',
      image: '/images/doctors/dr-shradha.jpg',
      bio: 'Specialist in growth-factor hair regeneration and personalized clinical scalp therapies with high success rates.',
      consultation_fee: 1000,
      available_locations: ['Gurgaon', 'Noida'],
      availability: 'Wed - Sun (11:00 AM - 07:00 PM)',
      display_order: 5,
    },
  ];

  for (const d of doctors) {
    await query(
      `INSERT INTO sid_doctors (slug, name, role, qualifications, specialty, experience, image, bio, consultation_fee, available_locations, availability, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role), specialty=VALUES(specialty), consultation_fee=VALUES(consultation_fee)`,
      [
        d.slug,
        d.name,
        d.role,
        d.qualifications,
        d.specialty,
        d.experience,
        d.image,
        d.bio,
        d.consultation_fee,
        JSON.stringify(d.available_locations),
        d.availability,
        d.display_order,
      ]
    );
  }

  // 6. Categories & Concerns
  console.log('6️⃣ Seeding Categories & Concerns...');
  const categories = [
    { name: 'Laser Hair Reduction', slug: 'laser-hair-reduction', description: 'Pain-free permanent hair reduction with US-FDA Soprano Titanium', thumbnail: '/images/treatments/banner-laser.webp', display_order: 1 },
    { name: 'Medi-Facials & Glow', slug: 'medi-facials-and-glow', description: 'Doctor-formulated clinical facials, HydraFacial MD & peel infusions', thumbnail: '/images/treatments/banner-hydrafacial.webp', display_order: 2 },
    { name: 'Acne & Scar Revision', slug: 'acne-and-scar-revision', description: 'Targeted MNRF, subcision, CO2 laser and medical peel protocols', thumbnail: '/images/treatments/banner-acne.webp', display_order: 3 },
    { name: 'Pigmentation & Lasers', slug: 'pigmentation-and-lasers', description: 'Q-Switched & Picosecond laser therapies for melasma, freckles & dark spots', thumbnail: '/images/treatments/banner-pigmentation.webp', display_order: 4 },
    { name: 'Hair Restoration', slug: 'hair-restoration', description: 'GFC, PRP and regenerative scalp stimulation therapies for hair fall', thumbnail: '/images/treatments/banner-hair.webp', display_order: 5 },
    { name: 'Anti-Ageing & Contouring', slug: 'anti-ageing-and-contouring', description: 'Botox, dermal fillers, Morpheus8 RF and skin tightening treatments', thumbnail: '/images/treatments/banner-antiaging.webp', display_order: 6 },
  ];

  const catIdMap = new Map();
  for (const cat of categories) {
    await query(
      `INSERT INTO sid_categories (name, slug, description, thumbnail, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE description=VALUES(description), thumbnail=VALUES(thumbnail)`,
      [cat.name, cat.slug, cat.description, cat.thumbnail, cat.display_order]
    );
    const row = await one('SELECT id FROM sid_categories WHERE slug = ?', [cat.slug]);
    catIdMap.set(cat.slug, row.id);
  }

  const concerns = [
    { name: 'Acne & Pimples', slug: 'acne-pimples', description: 'Active cystic breakouts, hormonal acne, blackheads & whiteheads', thumbnail: '/images/results/acne-before.jpg', display_order: 1 },
    { name: 'Acne Scars', slug: 'acne-scars', description: 'Deep boxcar, rolling and ice-pick atrophic acne scars', thumbnail: '/images/results/acne-after.jpg', display_order: 2 },
    { name: 'Pigmentation & Melasma', slug: 'pigmentation-melasma', description: 'Stubborn dark spots, tanning, sun damage and hyperpigmentation', thumbnail: '/images/results/pigmentation-after.jpg', display_order: 3 },
    { name: 'Hair Fall & Thinning', slug: 'hair-fall-thinning', description: 'Excessive hair shedding, receding hairline and low scalp density', thumbnail: '/images/results/hair-after.jpg', display_order: 4 },
    { name: 'Fine Lines & Wrinkles', slug: 'fine-lines-wrinkles', description: "Forehead lines, crow's feet, sagging skin and loss of volume", thumbnail: '/images/treatments/banner-antiaging.webp', display_order: 5 },
    { name: 'Unwanted Body Hair', slug: 'unwanted-hair', description: 'Facial and body hair removal for smooth, ingrown-free skin', thumbnail: '/images/treatments/banner-laser.webp', display_order: 6 },
    { name: 'Skin Dullness & Open Pores', slug: 'dullness-open-pores', description: 'Enlarged pores, congestion, dead skin buildup and lackluster complexion', thumbnail: '/images/treatments/banner-hydrafacial.webp', display_order: 7 },
  ];

  const conIdMap = new Map();
  for (const con of concerns) {
    await query(
      `INSERT INTO sid_concerns (name, slug, description, thumbnail, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE description=VALUES(description), thumbnail=VALUES(thumbnail)`,
      [con.name, con.slug, con.description, con.thumbnail, con.display_order]
    );
    const row = await one('SELECT id FROM sid_concerns WHERE slug = ?', [con.slug]);
    conIdMap.set(con.slug, row.id);
  }

  // 7. Treatments Catalog
  console.log('7️⃣ Seeding Comprehensive Treatments Catalog...');
  const treatments = [
    {
      legacy_id: 'full-body-lhr',
      slug: 'laser-hair-removal-noida',
      aliases: ['laser-hair-reduction-noida', 'full-body-laser-hair-reduction'],
      name: 'Full Body Laser Hair Reduction',
      category_slug: 'laser-hair-reduction',
      body_area: 'Full Body',
      tags: ['US-FDA SOPRANO TITANIUM', 'PAINLESS ICE-COOL'],
      rating: 4.94,
      reviews_count: 1420,
      duration: '90 mins',
      price: 16999,
      original_price: 19999,
      discount_badge: '30% OFF',
      emi_months: 6,
      emi_monthly: 11167,
      sessions_info: '1 Full Body Session (6-Session Package @ ₹39,999)',
      card_highlights: [
        '90%–95% permanent reduction in hair growth over 6–8 sessions',
        'Covers full body including face, arms, underarms, legs, back & bikini',
        'US-FDA approved triple-wavelength diode with -4°C sapphire ice cooling',
      ],
      explained_subtitle: 'Painless, Permanent, Triple-Wavelength US-FDA Protocol',
      short_desc:
        'Triple-wavelength diode and Alexandrite laser hair reduction with advanced sapphire contact cooling for pain-free, permanent full-body smoothness.',
      full_desc:
        "Eliminate unwanted facial and body hair permanently with Skinfinity Derma's gold-standard Full Body Laser Hair Reduction. Powered by US-FDA approved triple-wavelength (755nm + 810nm + 1064nm) Soprano Titanium technology and continuous -4°C ICE Plus contact cooling, our protocol targets deep follicular melanin while keeping the epidermis completely cool and comfortable.",
      banner_image: '/images/treatments/banner-laser.webp',
      gallery_images: [
        { src: '/images/treatments/banner-laser.webp', caption: 'US-FDA Triple-Wavelength Painless Laser Hair Reduction' },
        { src: '/images/results/laser-after.jpg', caption: 'Smooth, Ingrown-Free Skin After Clinical Laser Sessions' },
      ],
      how_it_works: [
        { stepNumber: '01', title: 'Clinical Skin & Hair Profiling', desc: 'Dermatologist examines follicle depth, hair thickness and Fitzpatrick skin type.', image: '/images/clinic/interior-1.jpg' },
        { stepNumber: '02', title: 'Hygiene Prep & Cooling Gel', desc: 'Target area sanitized, precision shaved and coated with chilling ultrasound gel.', image: '/images/clinic/interior-2.jpg' },
        { stepNumber: '03', title: 'Triple-Wavelength Laser Gliding', desc: 'In-motion laser pulses gradually heat follicles to disabling temperatures.', image: '/images/treatments/banner-laser.webp' },
        { stepNumber: '04', title: 'Calming Aloe-Zinc Barrier', desc: 'Post-laser soothing balm and SPF application with detailed home care instructions.', image: '/images/clinic/interior-3.jpg' },
      ],
      ideal_frequency: 'Every 4 to 6 weeks for optimal hair growth cycle targeting',
      ideal_for: ['Coarse unwanted body hair', 'Frequent ingrown hair & razor burns', 'PCOS-induced hirsutism'],
      not_ideal_for: ['Active sunburns', 'White/grey hairs lacking melanin', 'Open wounds'],
      before_treatment: ['Shave 24 hours prior', 'Avoid waxing/threading for 4 weeks', 'Skip direct sunbathing for 5 days'],
      after_treatment: ['Apply broad-spectrum SPF 50', 'Avoid hot showers & saunas for 24h', 'Moisturize twice daily'],
      youtube_video_id: '1WmieekXjG4',
      faqs: [
        { question: 'Does laser hair reduction hurt?', answer: 'Not at all. With our -4°C sapphire cooling tip, patients feel only a soothing warm sensation like a hot stone massage.' },
        { question: 'How many sessions are required?', answer: 'Usually 6 to 8 sessions achieve 90%–95% permanent reduction due to hair growth cycles.' },
      ],
      seo_title: 'Full Body Laser Hair Removal in Noida & Gurgaon | Skinfinity Derma',
      seo_description: 'Pain-free Full Body Laser Hair Reduction in Noida using US-FDA Soprano Titanium. Book your free patch test with senior MD Dermatologists.',
      display_order: 1,
      is_featured: 1,
      concern_slugs: ['unwanted-hair'],
    },
    {
      legacy_id: 'hydrafacial-elite',
      slug: 'sugarcane-hydrafacial-noida',
      aliases: ['hydrafacial-noida', 'signature-hydrafacial-md'],
      name: 'Signature Sugarcane HydraFacial MD Glass Glow',
      category_slug: 'medi-facials-and-glow',
      body_area: 'Face',
      tags: ['INSTANT GLASS GLOW', 'ZERO DOWNTIME', 'MD PROTOCOL'],
      rating: 4.96,
      reviews_count: 2150,
      duration: '60 mins',
      price: 3499,
      original_price: 5500,
      discount_badge: '36% OFF',
      emi_months: 3,
      emi_monthly: 1166,
      sessions_info: '1 Clinical Session (Package of 3 @ ₹8,999)',
      card_highlights: [
        'Instant Korean glass-skin hydration with zero downtime',
        'Vortex vacuum extraction cleans congested blackheads & sebum',
        'Custom antioxidant cocktail infused with organic sugarcane AHA',
      ],
      explained_subtitle: 'Medical-Grade 7-Step Hydradermabrasion & Antioxidant Infusion',
      short_desc:
        'Patented 7-step medical hydradermabrasion infusing sugarcane glycolic acid, hyaluronic peptides, and active botanical antioxidants for glowing skin.',
      full_desc:
        'The authentic Signature Sugarcane HydraFacial MD at Skinfinity Derma is a medical-grade hydradermabrasion therapy combining clinical deep-pore cleansing, gentle chemical exfoliation, painless vortex sebum suction, and deep transdermal infusion of hyaluronic acid, peptides, and organic sugarcane extracts.',
      banner_image: '/images/treatments/banner-hydrafacial.webp',
      gallery_images: [
        { src: '/images/treatments/banner-hydrafacial.webp', caption: 'Vortex-Fusion Antioxidant Infusion' },
        { src: '/images/results/acne-after.jpg', caption: 'Immediate Dewy Radiance After Treatment' },
      ],
      how_it_works: [
        { stepNumber: '01', title: 'Deep Vortex Cleanse', desc: 'Lactic acid solution sweeps away dead surface cells.', image: '/images/clinic/interior-1.jpg' },
        { stepNumber: '02', title: 'Sugarcane Glycolic Peel', desc: 'Mild chemical peel loosens deep comedones without irritation.', image: '/images/clinic/interior-2.jpg' },
        { stepNumber: '03', title: 'Painless Vacuum Extraction', desc: 'Vortex suction clears pores painlessly.', image: '/images/treatments/banner-hydrafacial.webp' },
        { stepNumber: '04', title: 'Antioxidant & Peptide Saturation', desc: 'Serums drenched with Hyaluronic Acid and Peptides infused.', image: '/images/clinic/interior-4.jpg' },
      ],
      ideal_frequency: 'Once every 4 weeks for long-term skin health and glow',
      ideal_for: ['Clogged pores & blackheads', 'Dull and tired complexion', 'Pre-event bridal radiance'],
      not_ideal_for: ['Severe active cystic acne flare-ups', 'Open eczema or cold sores'],
      before_treatment: ['Stop retinoids 48 hours before', 'Avoid bleach/waxing for 3 days'],
      after_treatment: ['Apply sunscreen SPF 50', 'No heavy makeup for 6 hours', 'Enjoy instant dewy skin'],
      youtube_video_id: '1WmieekXjG4',
      faqs: [
        { question: 'Is there any peeling or downtime?', answer: 'None at all. Your skin looks instantly radiant and plump right after the 60-minute session.' },
      ],
      seo_title: 'HydraFacial in Noida & Gurgaon | Glass Skin Facial | Skinfinity Derma',
      seo_description: 'Authentic 7-step Signature HydraFacial MD in Noida for instant glass skin glow. Doctor-supervised hydradermabrasion at best price.',
      display_order: 2,
      is_featured: 1,
      concern_slugs: ['dullness-open-pores'],
    },
    {
      legacy_id: 'acne-scar-mnrf',
      slug: 'acne-pimple-treatment-noida',
      aliases: ['acne-scar-treatment-noida', 'mnrf-subcision-acne-scars'],
      name: 'Advanced Acne & Scar Revision (MNRF + Subcision)',
      category_slug: 'acne-and-scar-revision',
      body_area: 'Face',
      tags: ['GOLD STANDARD SCAR REVISION', 'DOCTOR-PERFORMED'],
      rating: 4.91,
      reviews_count: 980,
      duration: '75 mins',
      price: 4999,
      original_price: 7500,
      discount_badge: '33% OFF',
      emi_months: 6,
      emi_monthly: 2500,
      sessions_info: '1 Session (Recommended Protocol: 4 Sessions)',
      card_highlights: [
        'Breaks fibrous tethered bands with precision surgical subcision',
        'Stimulates deep neocollagenesis using micro-insulated gold needles',
        'Visible 70%–85% reduction in atrophic and rolling scar depth',
      ],
      explained_subtitle: 'Dual Action: Fibrous Band Release + Micro-Needling Radiofrequency',
      short_desc:
        'Synergistic combination of subcision to release deep scar tethering and gold-plated MNRF to rebuild collagen from within.',
      full_desc:
        'Our flagship Acne Scar Revision protocol is formulated by Dr. Ipshita Johri to systematically address rolling, boxcar, and ice-pick scars. Combining subcision with gold-insulated Microneedling Radiofrequency (MNRF), it breaks down tough fibrotic scar bands and triggers vigorous dermal remodeling.',
      banner_image: '/images/treatments/banner-acne.webp',
      gallery_images: [
        { src: '/images/treatments/banner-acne.webp', caption: 'Gold-Plated MNRF for Scar Remodeling' },
        { src: '/images/results/acne-after.jpg', caption: 'Smoother Texture and Even Tone After 4 Sessions' },
      ],
      how_it_works: [
        { stepNumber: '01', title: 'Topical Numbing', desc: 'High-strength clinical numbing cream applied for 45 minutes.', image: '/images/clinic/interior-1.jpg' },
        { stepNumber: '02', title: 'Precision Subcision', desc: 'Dermatologist inserts specialized cannula to free tethered scar tissue.', image: '/images/clinic/interior-2.jpg' },
        { stepNumber: '03', title: 'Gold-Plated MNRF Delivery', desc: 'Micro-needles penetrate precisely delivering RF heat energy into the dermis.', image: '/images/treatments/banner-acne.webp' },
        { stepNumber: '04', title: 'Cryo-Soothing & Growth Factor Mask', desc: 'Calming sheet mask locks in hydration and reduces redness.', image: '/images/clinic/interior-3.jpg' },
      ],
      ideal_frequency: 'Every 4 to 6 weeks for 3 to 5 sessions',
      ideal_for: ['Rolling and boxcar acne scars', 'Large open pores', 'Post-acne textural irregularity'],
      not_ideal_for: ['Severe active bacterial cystic infection (treat active acne first)'],
      before_treatment: ['Avoid blood-thinning supplements 3 days prior', 'Come with clean, makeup-free skin'],
      after_treatment: ['Mild pinkness settles within 24–48 hours', 'Use gentle hydrating cleanser and SPF 50'],
      youtube_video_id: '1WmieekXjG4',
      faqs: [
        { question: 'How soon will I see results?', answer: 'Collagen remodeling begins immediately and improves progressively over 8 to 12 weeks.' },
      ],
      seo_title: 'Acne Scar Treatment in Noida & Gurgaon | MNRF & Subcision | Skinfinity Derma',
      seo_description: 'Best acne scar revision in Noida using Subcision and US-FDA MNRF. 80%+ visible improvement in pitted scars. Book doctor consult.',
      display_order: 3,
      is_featured: 1,
      concern_slugs: ['acne-pimples', 'acne-scars'],
    },
    {
      legacy_id: 'gfc-hair-therapy',
      slug: 'gfc-hair-growth-therapy-noida',
      aliases: ['hair-prp-treatment-noida', 'growth-factor-concentrate-hair'],
      name: 'GFC (Growth Factor Concentrate) Hair Restoration',
      category_slug: 'hair-restoration',
      body_area: 'Scalp',
      tags: ['NEXT-GEN PRP', '100% AUTOLOGOUS', 'HIGH CONCENTRATION'],
      rating: 4.93,
      reviews_count: 1120,
      duration: '45 mins',
      price: 5999,
      original_price: 9000,
      discount_badge: '33% OFF',
      emi_months: 6,
      emi_monthly: 2999,
      sessions_info: '1 Session (Recommended Protocol: 3 to 4 Sessions)',
      card_highlights: [
        '5x higher concentration of PDGF, VEGF, EGF than traditional PRP',
        'Completely acellular, sterile, non-pyrogenic with minimal pain',
        'Stops active hair fall and strengthens dormant miniaturized follicles',
      ],
      explained_subtitle: 'Advanced Autologous Growth Factors for Follicular Reactivation',
      short_desc:
        'Pure autologous growth factor concentrate extracted from your own blood to awaken dormant follicles, reverse miniaturization and boost hair thickness.',
      full_desc:
        'GFC (Growth Factor Concentrate) is the next generation of regenerative hair therapy, superior to traditional PRP. By utilizing dedicated vacuum tubes, high concentrations of natural growth factors (PDGF, VEGF, EGF, IGF-1) are extracted from blood platelets in an acellular form, ensuring zero pain, zero clot risk, and maximum follicular stimulation.',
      banner_image: '/images/treatments/banner-hair.webp',
      gallery_images: [
        { src: '/images/treatments/banner-hair.webp', caption: 'Precision Scalp Mesotherapy with GFC' },
        { src: '/images/results/hair-after.jpg', caption: 'Significant Increase in Hair Density and Crown Coverage' },
      ],
      how_it_works: [
        { stepNumber: '01', title: 'Blood Draw', desc: '10ml of blood collected in specialized GFC tubes.', image: '/images/clinic/interior-1.jpg' },
        { stepNumber: '02', title: 'Incubation & Centrifugation', desc: '30-minute incubation releases maximum growth factors from platelets.', image: '/images/clinic/interior-2.jpg' },
        { stepNumber: '03', title: 'Micro-Injection Delivery', desc: 'Acellular GFC injected with ultra-fine 32G micro-needles across thinning scalp zones.', image: '/images/treatments/banner-hair.webp' },
        { stepNumber: '04', title: 'Laser Hair Stimulation', desc: 'Low-Level Laser Light therapy (LLLT) accelerates absorption and scalp microcirculation.', image: '/images/clinic/interior-4.jpg' },
      ],
      ideal_frequency: 'Once every 3 to 4 weeks for 3 to 4 sessions',
      ideal_for: ['Male & female pattern hair thinning', 'Telogen effluvium post-COVID / post-stress', 'Early-stage baldness'],
      not_ideal_for: ['Completely scarred hairless scalp patches'],
      before_treatment: ['Wash hair thoroughly before the visit', 'Stay well hydrated'],
      after_treatment: ['Do not wash hair for 12 hours', 'Avoid vigorous workouts for 24 hours'],
      youtube_video_id: '1WmieekXjG4',
      faqs: [
        { question: 'Is GFC better than regular PRP?', answer: 'Yes. GFC is completely acellular with no RBCs or WBCs, resulting in less pain, zero inflammation and up to 5x higher growth factor concentration.' },
      ],
      seo_title: 'GFC Hair Loss Treatment in Noida & Gurgaon | Hair PRP | Skinfinity Derma',
      seo_description: 'Best GFC Hair Restoration therapy in Noida. Reverse hair thinning and stop hair fall with pure autologous growth factor therapy.',
      display_order: 4,
      is_featured: 1,
      concern_slugs: ['hair-fall-thinning'],
    },
    {
      legacy_id: 'q-switched-laser',
      slug: 'pigmentation-laser-treatment-noida',
      aliases: ['q-switch-nd-yag-laser', 'melasma-laser-treatment'],
      name: 'Q-Switched Nd:YAG Laser Melasma & Pigmentation Revision',
      category_slug: 'pigmentation-and-lasers',
      body_area: 'Face',
      tags: ['US-FDA PICO/Q-SWITCH', 'TARGETED MELANIN CLEARANCE'],
      rating: 4.89,
      reviews_count: 870,
      duration: '45 mins',
      price: 4499,
      original_price: 6500,
      discount_badge: '30% OFF',
      emi_months: 3,
      emi_monthly: 1499,
      sessions_info: '1 Session (Package of 4 Sessions @ ₹14,999)',
      card_highlights: [
        'Shatters epidermal & dermal pigment particles into microscopic dust',
        'Targets stubborn melasma, sun freckles and post-inflammatory hyperpigmentation',
        'Zero peeling or social downtime with immediate skin brightening',
      ],
      explained_subtitle: 'Acoustic Shockwave Melanin Fragmentation with Zero Heat Damage',
      short_desc:
        'Gold-standard 1064nm photo-acoustic laser that shatters stubborn dermal melanin particles without harming the surrounding skin barrier.',
      full_desc:
        'Skinfinity Derma utilizes the US-FDA approved Q-Switched Nd:YAG laser system delivering nanosecond pulses. It breaks deep melanin deposits into tiny fragments naturally cleared by the immune system, successfully treating melasma, sun spots, and uneven tan.',
      banner_image: '/images/treatments/banner-pigmentation.webp',
      gallery_images: [
        { src: '/images/treatments/banner-pigmentation.webp', caption: 'Targeted Laser Pigment Resurfacing' },
        { src: '/images/results/pigmentation-after.jpg', caption: 'Clearer, Even-Toned Complexion After Laser Sessions' },
      ],
      how_it_works: [
        { stepNumber: '01', title: 'Diagnostic Wood’s Lamp Analysis', desc: 'Identifies whether pigment is epidermal, dermal, or mixed.', image: '/images/clinic/interior-1.jpg' },
        { stepNumber: '02', title: 'Laser Energy Calibration', desc: 'Wavelength and spot size calibrated for Indian skin.', image: '/images/treatments/banner-pigmentation.webp' },
        { stepNumber: '03', title: 'Photo-Acoustic Toning', desc: 'Rapid nanosecond pulses fragment melanin clusters.', image: '/images/clinic/interior-2.jpg' },
        { stepNumber: '04', title: 'Cooling Serum & Sun Barrier', desc: 'Soothing post-laser serum and mineral SPF applied.', image: '/images/clinic/interior-3.jpg' },
      ],
      ideal_frequency: 'Every 3 to 4 weeks for 4 to 6 sessions',
      ideal_for: ['Hormonal melasma patches', 'Stubborn sun tanning', 'Post-acne dark marks (PIH)'],
      not_ideal_for: ['Active sunburn within past 48 hours'],
      before_treatment: ['Avoid direct tanning and bleach for 7 days'],
      after_treatment: ['Strict daily broad-spectrum SPF 50 reapplication every 3 hours'],
      youtube_video_id: '1WmieekXjG4',
      faqs: [
        { question: 'Will pigmentation return after laser?', answer: 'With regular sunscreen use and our doctor-prescribed maintenance regimen, results are long-lasting and prevent recurrence.' },
      ],
      seo_title: 'Pigmentation & Melasma Treatment in Noida | Laser Toning | Skinfinity Derma',
      seo_description: 'Best Melasma and Pigmentation laser treatment in Noida with Q-Switched Nd:YAG laser. Safe for Indian skin tones. Consult MD Dermatologist.',
      display_order: 5,
      is_featured: 1,
      concern_slugs: ['pigmentation-melasma'],
    },
  ];

  for (const t of treatments) {
    const catId = catIdMap.get(t.category_slug) || null;
    await query(
      `INSERT INTO sid_treatments (
        legacy_id, slug, aliases, name, category_id, body_area, tags, rating, reviews_count,
        duration, price, original_price, discount_badge, emi_months, emi_monthly, sessions_info,
        card_highlights, explained_subtitle, short_desc, full_desc, banner_image, gallery_images,
        how_it_works, ideal_frequency, ideal_for, not_ideal_for, before_treatment, after_treatment,
        youtube_video_id, faqs, seo_title, seo_description, display_order, is_active, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
      ON DUPLICATE KEY UPDATE
        name=VALUES(name), price=VALUES(price), original_price=VALUES(original_price),
        card_highlights=VALUES(card_highlights), short_desc=VALUES(short_desc), full_desc=VALUES(full_desc),
        is_featured=VALUES(is_featured)`,
      [
        t.legacy_id,
        t.slug,
        JSON.stringify(t.aliases),
        t.name,
        catId,
        t.body_area,
        JSON.stringify(t.tags),
        t.rating,
        t.reviews_count,
        t.duration,
        t.price,
        t.original_price,
        t.discount_badge,
        t.emi_months,
        t.emi_monthly,
        t.sessions_info,
        JSON.stringify(t.card_highlights),
        t.explained_subtitle,
        t.short_desc,
        t.full_desc,
        t.banner_image,
        JSON.stringify(t.gallery_images),
        JSON.stringify(t.how_it_works),
        t.ideal_frequency,
        JSON.stringify(t.ideal_for),
        JSON.stringify(t.not_ideal_for),
        JSON.stringify(t.before_treatment),
        JSON.stringify(t.after_treatment),
        t.youtube_video_id,
        JSON.stringify(t.faqs),
        t.seo_title,
        t.seo_description,
        t.display_order,
        t.is_featured,
      ]
    );

    const treatRow = await one('SELECT id FROM sid_treatments WHERE slug = ?', [t.slug]);
    if (treatRow && t.concern_slugs) {
      await query('DELETE FROM sid_treatment_concerns WHERE treatment_id = ?', [treatRow.id]);
      for (const cs of t.concern_slugs) {
        const conId = conIdMap.get(cs);
        if (conId) {
          await query('INSERT IGNORE INTO sid_treatment_concerns (treatment_id, concern_id) VALUES (?, ?)', [
            treatRow.id,
            conId,
          ]);
        }
      }
    }
  }

  // 8. Banners
  console.log('8️⃣ Seeding Banners...');
  const banners = [
    {
      title: 'Advanced Clinical Dermatology & Aesthetic Care',
      subtitle: 'US-FDA approved technologies tailored for Indian skin & hair with bespoke doctor-led protocols.',
      desktop_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&auto=format&fit=crop&q=80',
      mobile_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
      alt_text: 'Skinfinity Derma Luxury Clinic consultation room',
      button_text: 'Book Consultation',
      button_url: '/contact-us',
      location: 'Homepage Hero',
      display_order: 1,
    },
    {
      title: 'Pain-Free Full Body Laser Hair Reduction',
      subtitle: 'Soprano Titanium US-FDA triple-wavelength technology with -4°C continuous sapphire cooling.',
      desktop_image: 'https://images.unsplash.com/photo-1512290900672-1f0219ad0246?w=1600&auto=format&fit=crop&q=80',
      mobile_image: 'https://images.unsplash.com/photo-1512290900672-1f0219ad0246?w=600&auto=format&fit=crop&q=80',
      alt_text: 'Laser hair reduction session at Skinfinity Derma',
      button_text: 'Explore Laser Packages',
      button_url: '/laser-hair-removal-noida',
      location: 'Homepage Hero',
      display_order: 2,
    },
    {
      title: 'Signature Sugarcane HydraFacial MD',
      subtitle: 'Instant Korean glass-skin hydration, deep pore vortex cleansing and antioxidant infusion with zero downtime.',
      desktop_image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&auto=format&fit=crop&q=80',
      mobile_image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80',
      alt_text: 'HydraFacial procedure in progress',
      button_text: 'Claim Glow Offer',
      button_url: '/sugarcane-hydrafacial-noida',
      location: 'Homepage Hero',
      display_order: 3,
    },
  ];

  for (const b of banners) {
    await query(
      `INSERT INTO sid_banners (title, subtitle, desktop_image, mobile_image, alt_text, button_text, button_url, location, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [b.title, b.subtitle, b.desktop_image, b.mobile_image, b.alt_text, b.button_text, b.button_url, b.location, b.display_order]
    );
  }

  // 9. Coupons & Offers
  console.log('9️⃣ Seeding Marketing Coupons & Promotional Offers...');
  const coupons = [
    {
      code: 'DERMA10',
      title: '10% Clinical Discount',
      description: 'Get 10% discount on all dermatologist treatments and clinical facials.',
      discount_type: 'percent',
      discount_value: 10,
      max_discount: 2500,
      min_order: 1000,
      applies_to: 'all',
      usage_limit: 1000,
    },
    {
      code: 'SKIN10',
      title: '10% Off Skin Therapies',
      description: 'Applicable on HydraFacials, Chemical Peels, and Pigmentation lasers.',
      discount_type: 'percent',
      discount_value: 10,
      max_discount: 2000,
      min_order: 2000,
      applies_to: 'categories',
    },
    {
      code: 'VIP20',
      title: '20% VIP Club Privilege',
      description: '20% discount on total booking value above ₹10,000.',
      discount_type: 'percent',
      discount_value: 20,
      max_discount: 5000,
      min_order: 10000,
      applies_to: 'all',
      usage_limit: 500,
    },
    {
      code: 'LASER30',
      title: '30% Off Laser Hair Reduction',
      description: 'Exclusive 30% savings on Soprano Titanium Full Body Laser packages.',
      discount_type: 'percent',
      discount_value: 30,
      max_discount: 15000,
      min_order: 15000,
      applies_to: 'treatments',
    },
    {
      code: 'GLOW500',
      title: 'Flat ₹500 Off HydraFacial',
      description: 'Flat ₹500 discount on your first Signature Sugarcane HydraFacial MD session.',
      discount_type: 'flat',
      discount_value: 500,
      min_order: 3000,
      applies_to: 'treatments',
    },
  ];

  const couponIdMap = new Map();
  for (const cp of coupons) {
    await query(
      `INSERT INTO sid_coupons (code, title, description, discount_type, discount_value, max_discount, min_order, applies_to, usage_limit, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE title=VALUES(title), discount_value=VALUES(discount_value), min_order=VALUES(min_order)`,
      [cp.code, cp.title, cp.description, cp.discount_type, cp.discount_value, cp.max_discount, cp.min_order, cp.applies_to, cp.usage_limit]
    );
    const row = await one('SELECT id FROM sid_coupons WHERE code = ?', [cp.code]);
    couponIdMap.set(cp.code, row.id);
  }

  // Link LASER30 to laser treatment
  const laserTrt = await one('SELECT id FROM sid_treatments WHERE slug = "laser-hair-removal-noida"');
  if (laserTrt && couponIdMap.get('LASER30')) {
    await query('INSERT IGNORE INTO sid_coupon_treatments (coupon_id, treatment_id) VALUES (?, ?)', [
      couponIdMap.get('LASER30'),
      laserTrt.id,
    ]);
  }
  const hydraTrt = await one('SELECT id FROM sid_treatments WHERE slug = "sugarcane-hydrafacial-noida"');
  if (hydraTrt && couponIdMap.get('GLOW500')) {
    await query('INSERT IGNORE INTO sid_coupon_treatments (coupon_id, treatment_id) VALUES (?, ?)', [
      couponIdMap.get('GLOW500'),
      hydraTrt.id,
    ]);
  }

  // Offers (19 Promotional Packages from Google Drive)
  const offers = [
    {
      legacy_id: 'offer-1',
      title: 'Free Doctor Skin & Hair Consultation',
      category: 'Skin',
      badge: 'Limited Period',
      description: 'Comprehensive digital skin analysis and consultation with our senior MD Dermatologists at zero consultation fee.',
      image: '/images/offers/skinfinity-offer-1.png',
      link_text: 'Claim Consultation',
      slug: '/contact-us#appointment_form',
      coupon_id: couponIdMap.get('DERMA10'),
      display_order: 1,
    },
    {
      legacy_id: 'offer-2',
      title: 'Full Body Laser Hair Reduction @ 30% OFF',
      category: 'Laser',
      badge: 'Bestseller',
      description: 'US-FDA Soprano Titanium painless laser hair removal with continuous -4°C contact cooling for full body smoothness.',
      image: '/images/offers/skinfinity-offer-2.png',
      link_text: 'View Package',
      slug: '/laser-hair-removal-noida',
      coupon_id: couponIdMap.get('LASER30'),
      display_order: 2,
    },
    {
      legacy_id: 'offer-3',
      title: 'Signature Sugarcane HydraFacial MD @ ₹3,499',
      category: 'Skin',
      badge: 'Instant Glass Glow',
      description: '7-step clinical hydradermabrasion infusing organic sugarcane AHA, peptides & hyaluronic acid.',
      image: '/images/offers/skinfinity-offer-3.png',
      link_text: 'Book HydraFacial',
      slug: '/sugarcane-hydrafacial-noida',
      coupon_id: couponIdMap.get('GLOW500'),
      display_order: 3,
    },
    {
      legacy_id: 'offer-4',
      title: 'GFC Regenerative Hair Regrowth Package',
      category: 'Hair',
      badge: 'Hair Fall Special',
      description: '3 sessions of advanced growth factor concentrate mesotherapy with complimentary scalp micro-needling.',
      image: '/images/offers/skinfinity-offer-4.png',
      link_text: 'Explore Hair Care',
      slug: '/gfc-hair-growth-therapy-noida',
      coupon_id: couponIdMap.get('DERMA10'),
      display_order: 4,
    },
    {
      legacy_id: 'offer-5',
      title: 'Body Wellness Packages',
      category: 'Body',
      badge: 'Holistic Care',
      description: 'Complete body toning, skin firming and lymphatic drainage packages designed for holistic wellness.',
      image: '/images/offers/skinfinity-offer-5.png',
      link_text: 'Explore Wellness',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 5,
    },
    {
      legacy_id: 'offer-6',
      title: 'Bridal Skin Preparation Luxury Package',
      category: 'Bridal',
      badge: 'Bridal Special',
      description: 'Customized 60-day bridal skin glow ritual with HydraFacial MD, carbon laser peel & collagen boost.',
      image: '/images/offers/skinfinity-offer-6.png',
      link_text: 'Book Bridal Consult',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 6,
    },
    {
      legacy_id: 'offer-7',
      title: 'Special Bridal Luxury Packages',
      category: 'Bridal',
      badge: 'Exclusive Glow',
      description: 'Curated pre-wedding dermatological sessions for brides and grooms with personalized skin therapists.',
      image: '/images/offers/skinfinity-offer-7.png',
      link_text: 'View Bridal Package',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 7,
    },
    {
      legacy_id: 'offer-8',
      title: 'Medical Facial Offers',
      category: 'Skin',
      badge: 'Deep Cleansing',
      description: 'Clinical grade hydra-dermabrasion and customized medical facials targeted for acne, pores and pigmentation.',
      image: '/images/offers/skinfinity-offer-8.png',
      link_text: 'Claim Facial Offer',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 8,
    },
    {
      legacy_id: 'offer-9',
      title: 'Signature Facial Packages',
      category: 'Skin',
      badge: 'Instant Glow',
      description: 'Multi-session medical facial packages infused with antioxidants, peptides and hyaluronic acid.',
      image: '/images/offers/skinfinity-offer-9.png',
      link_text: 'Explore Packages',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 9,
    },
    {
      legacy_id: 'offer-10',
      title: 'Fat Loss & Skin Tightening Treatment Plan',
      category: 'Body',
      badge: 'Body Contouring',
      description: 'Non-invasive US-FDA radiofrequency body contouring, stubborn fat reduction and skin tightening.',
      image: '/images/offers/skinfinity-offer-10.png',
      link_text: 'View Plan Details',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 10,
    },
    {
      legacy_id: 'offer-11',
      title: 'Festive Hair Care Packages',
      category: 'Hair',
      badge: 'Root Defense',
      description: 'Comprehensive festive packages for thinning hair, hair loss prevention and scalp rejuvenation.',
      image: '/images/offers/skinfinity-offer-11.png',
      link_text: 'Book Hair Consult',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 11,
    },
    {
      legacy_id: 'offer-12',
      title: 'Skinfinity All-In-One Festive Package',
      category: 'Skin',
      badge: 'All-In-One',
      description: 'Full festive rejuvenation bundle combining laser toning, medical facial and vitamin infusion.',
      image: '/images/offers/skinfinity-offer-12.png',
      link_text: 'Claim Festive Bundle',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 12,
    },
    {
      legacy_id: 'offer-13',
      title: 'Dermal Fillers Festive Packages',
      category: 'Skin',
      badge: 'Youth Restore',
      description: 'Precision hyaluronic acid dermal fillers for cheek contouring, lip enhancement and smile lines.',
      image: '/images/offers/skinfinity-offer-13.png',
      link_text: 'Book Consultation',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 13,
    },
    {
      legacy_id: 'offer-14',
      title: 'Dermal Fillers Special Offers',
      category: 'Skin',
      badge: 'Natural Contour',
      description: 'US-FDA approved dermal fillers administered by certified senior dermatologists at special festive rates.',
      image: '/images/offers/skinfinity-offer-14.png',
      link_text: 'View Filler Offers',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 14,
    },
    {
      legacy_id: 'offer-15',
      title: 'GFC Therapy Festive Offer',
      category: 'Hair',
      badge: 'Growth Booster',
      description: 'Pure autologous growth factor concentrate therapy for active hair regrowth and follicle strengthening.',
      image: '/images/offers/skinfinity-offer-15.png',
      link_text: 'Claim GFC Offer',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 15,
    },
    {
      legacy_id: 'offer-16',
      title: 'Hair Fall Control Festive Packages',
      category: 'Hair',
      badge: 'Anti Hair Fall',
      description: 'Clinical protocols targeting DHT reduction, follicle stimulation and scalp cellular therapy.',
      image: '/images/offers/skinfinity-offer-16.png',
      link_text: 'Book Package',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 16,
    },
    {
      legacy_id: 'offer-17',
      title: 'US-FDA Laser Festive Offer',
      category: 'Laser',
      badge: 'Painless ICE',
      description: 'Triple-wavelength Soprano Titanium laser hair reduction at special seasonal rates.',
      image: '/images/offers/skinfinity-offer-17.png',
      link_text: 'Claim Laser Offer',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 17,
    },
    {
      legacy_id: 'offer-18',
      title: 'Laser Hair Reduction Festive Packages',
      category: 'Laser',
      badge: 'Permanent Reduction',
      description: 'Full body and combo laser hair removal packages with permanent follicle reduction.',
      image: '/images/offers/skinfinity-offer-18.png',
      link_text: 'Claim Package',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 18,
    },
    {
      legacy_id: 'offer-19',
      title: 'Hair Regain Booster Exclusive Offers',
      category: 'Hair',
      badge: 'Cellular Boost',
      description: 'Multi-session hair regrowth booster packages with microneedling and peptide serums.',
      image: '/images/offers/skinfinity-offer-19.png',
      link_text: 'Book Regain Booster',
      slug: '/contact-us#appointment_form',
      coupon_id: null,
      display_order: 19,
    },
  ];

  for (const o of offers) {
    await query(
      `INSERT INTO sid_offers (legacy_id, title, category, badge, description, image, link_text, slug, coupon_id, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), badge=VALUES(badge), description=VALUES(description), image=VALUES(image), coupon_id=VALUES(coupon_id)`,
      [o.legacy_id, o.title, o.category, o.badge, o.description, o.image, o.link_text, o.slug, o.coupon_id, o.display_order]
    );
  }

  // 10. Reviews & Before/After
  console.log('🔟 Seeding Verified Reviews, Results & Testimonials...');
  const reviews = [
    {
      legacy_id: 'rev-1',
      reviewer_name: 'Sirjana Grewal',
      initials: 'SG',
      rating: 5,
      review_text:
        'I have been getting Laser hair removal from here. Great services and hygiene has been consistently maintained throughout the duration of my entire process here. I would blindly recommend this to anyone. Getting laser removal from here has been one of the best decisions I have ever made.',
      treatment_tag: 'Laser Hair Removal',
      branch: 'Noida HQ Clinic',
      source: 'google',
      verified: 1,
      review_date: '2026-02-10',
      display_order: 1,
    },
    {
      legacy_id: 'rev-2',
      reviewer_name: 'Kavita Sharma',
      initials: 'KS',
      rating: 5,
      review_text:
        "My dermatology visit with Dr. Ipshita's clinic exceeded all my expectations. Not only did I leave with a clear understanding of my skin concerns, but I also felt empowered to take control of my skincare regimen. Truly exceptional team!",
      treatment_tag: 'Acne Scar Revision',
      branch: 'Noida HQ Clinic',
      source: 'google',
      verified: 1,
      review_date: '2026-02-12',
      display_order: 2,
    },
    {
      legacy_id: 'rev-3',
      reviewer_name: 'Rohan Malhotra',
      initials: 'RM',
      rating: 5,
      review_text:
        'Took 3 sessions of GFC for acute hair thinning. The density improvement on my crown within 2 months has been unbelievable. Very transparent and medical-grade approach without any unnecessary products.',
      treatment_tag: 'GFC Hair Regrowth',
      branch: 'Gurgaon Clinic',
      source: 'google',
      verified: 1,
      review_date: '2026-02-15',
      display_order: 3,
    },
    {
      legacy_id: 'rev-4',
      reviewer_name: 'Aishwarya Sen',
      initials: 'AS',
      rating: 5,
      review_text:
        'The Signature Sugarcane HydraFacial gave my skin an instant glass finish! Zero irritation or redness, and my stubborn blackheads on the nose were completely vacuumed away. Worth every penny.',
      treatment_tag: 'HydraFacial MD',
      branch: 'Noida HQ Clinic',
      source: 'google',
      verified: 1,
      review_date: '2026-02-18',
      display_order: 4,
    },
  ];

  for (const r of reviews) {
    await query(
      `INSERT INTO sid_reviews (legacy_id, reviewer_name, initials, rating, review_text, treatment_tag, branch, source, verified, review_date, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE review_text=VALUES(review_text), rating=VALUES(rating)`,
      [r.legacy_id, r.reviewer_name, r.initials, r.rating, r.review_text, r.treatment_tag, r.branch, r.source, r.verified, r.review_date, r.display_order]
    );
  }

  // Before & After
  const results = [
    {
      legacy_id: 'result-1',
      patient_name: 'Patient A',
      treatment: 'Acne Scar Revision & Skin Clarity',
      treatment_id: laserTrt ? laserTrt.id : null,
      description: 'Significant reduction in deep acne scar craters and post-inflammatory pigmentation after 4 sessions of MNRF and targeted peels.',
      before_image: '/images/results/acne-before.jpg',
      after_image: '/images/results/acne-after.jpg',
      results_type: 'Acne & Scars',
      timeframe: '3 Months (4 Sessions)',
      has_patient_consent: 1,
      approval_status: 'Approved',
      display_order: 1,
    },
    {
      legacy_id: 'result-2',
      patient_name: 'Patient B',
      treatment: 'GFC Hair Density Restoration',
      description: 'Notable reversal of crown hair thinning and thicker follicular density over 4 GFC sessions.',
      before_image: '/images/results/hair-before.jpg',
      after_image: '/images/results/hair-after.jpg',
      results_type: 'Hair Restoration',
      timeframe: '4 Months (4 Sessions)',
      has_patient_consent: 1,
      approval_status: 'Approved',
      display_order: 2,
    },
    {
      legacy_id: 'result-3',
      patient_name: 'Patient C',
      treatment: 'Dermal Melasma & Sun Damage Clearance',
      description: '80% clearance of stubborn melasma and pigmentation with Q-Switched laser toning and medical depigmentation therapy.',
      before_image: '/images/results/pigmentation-before.jpg',
      after_image: '/images/results/pigmentation-after.jpg',
      results_type: 'Pigmentation',
      timeframe: '8 Weeks (3 Sessions)',
      has_patient_consent: 1,
      approval_status: 'Approved',
      display_order: 3,
    },
  ];

  for (const res of results) {
    await query(
      `INSERT INTO sid_before_after_cases (legacy_id, patient_name, treatment, treatment_id, description, before_image, after_image, results_type, timeframe, has_patient_consent, approval_status, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE description=VALUES(description), approval_status=VALUES(approval_status)`,
      [
        res.legacy_id,
        res.patient_name,
        res.treatment,
        res.treatment_id,
        res.description,
        res.before_image,
        res.after_image,
        res.results_type,
        res.timeframe,
        res.has_patient_consent,
        res.approval_status,
        res.display_order,
      ]
    );
  }

  // 11. FAQs
  console.log('1️⃣1️⃣ Seeding FAQs...');
  const faqs = [
    {
      scope: 'home',
      question: 'Why choose Skinfinity Derma over commercial salons or beauty clinics?',
      answer: 'At Skinfinity Derma, all consultations, laser settings, and clinical procedures are directly diagnosed and supervised by board-certified MD Dermatologists utilizing authentic US-FDA approved technologies in hospital-grade sterile environments.',
      display_order: 1,
    },
    {
      scope: 'home',
      question: 'Is laser hair reduction permanent and safe for Indian skin?',
      answer: 'Yes. We utilize the Soprano Titanium triple-wavelength system with integrated -4°C sapphire contact cooling, specifically calibrated to treat melanin-rich Indian Fitzpatrick skin tones safely without burns or rebound hyperpigmentation.',
      display_order: 2,
    },
    {
      scope: 'home',
      question: 'Do you offer No-Cost EMI options for treatment packages?',
      answer: 'Yes! We provide 0% interest No-Cost EMI options for 3, 6, and 9 months through our financial partners with instant paperless digital approval.',
      display_order: 3,
    },
    {
      scope: 'home',
      question: 'How do I book an appointment with Dr. Ipshita Johri?',
      answer: 'You can book directly through our online appointment portal, call our helpline at +91 9871941444, or WhatsApp our patient care desk for immediate slot confirmation.',
      display_order: 4,
    },
  ];

  for (const f of faqs) {
    await query(
      `INSERT INTO sid_faqs (scope, question, answer, display_order, is_active)
       VALUES (?, ?, ?, ?, 1)`,
      [f.scope, f.question, f.answer, f.display_order]
    );
  }

  // 12. Sample Appointments & Enquiries
  console.log('1️⃣2️⃣ Seeding Sample Appointments & Enquiries...');
  const sampleAppts = [
    {
      appointment_no: 'SKF-APP-1001',
      patient_name: 'Pooja Verma',
      phone: '+91 9876543210',
      email: 'pooja.verma@example.com',
      gender: 'Female',
      age: 28,
      service_name: 'Full Body Laser Hair Reduction',
      appointment_date: '2026-11-05',
      appointment_time: '11:30',
      visit_type: 'new',
      coupon_code: 'DERMA10',
      discount_amount: 1699,
      amount_estimate: 15300,
      status: 'confirmed',
      notes: 'Patch test requested before full session.',
      source: 'website_modal',
    },
    {
      appointment_no: 'SKF-APP-1002',
      patient_name: 'Vikram Mehta',
      phone: '+91 9811223344',
      email: 'vikram.m@example.com',
      gender: 'Male',
      age: 34,
      service_name: 'GFC Hair Restoration',
      appointment_date: '2026-11-06',
      appointment_time: '15:00',
      visit_type: 'new',
      coupon_code: null,
      discount_amount: 0,
      amount_estimate: 5999,
      status: 'pending',
      notes: 'Suffering from active crown thinning post-COVID.',
      source: 'quick_book',
    },
  ];

  for (const a of sampleAppts) {
    await query(
      `INSERT INTO sid_appointments (appointment_no, patient_name, phone, email, gender, age, service_name, appointment_date, appointment_time, visit_type, coupon_code, discount_amount, amount_estimate, status, notes, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status=VALUES(status)`,
      [a.appointment_no, a.patient_name, a.phone, a.email, a.gender, a.age, a.service_name, a.appointment_date, a.appointment_time, a.visit_type, a.coupon_code, a.discount_amount, a.amount_estimate, a.status, a.notes, a.source]
    );
  }

  const sampleEnquiries = [
    {
      enquiry_no: 'ENQ-2026-001',
      type: 'franchise',
      name: 'Sunil Choudhary',
      phone: '+91 9822334455',
      email: 'sunil.c@investgroup.in',
      city: 'Chandigarh',
      subject: 'FICO Franchise Model Inquiry',
      message: 'Looking to invest ₹1.8 Crore for a franchise clinic in Tricity region with prime commercial space available.',
      status: 'qualified',
      priority: 'high',
      source: 'franchise_page',
    },
    {
      enquiry_no: 'ENQ-2026-002',
      type: 'emi',
      name: 'Ritu Sen',
      phone: '+91 9833445566',
      email: 'ritu.sen@gmail.com',
      city: 'Noida',
      subject: '6-Month Zero Cost EMI for Laser Package',
      message: 'Requested pre-approval for ₹39,999 laser hair reduction package on Bajaj Finserv.',
      status: 'contacted',
      priority: 'normal',
      source: 'emi_modal',
    },
    {
      enquiry_no: 'ENQ-2026-003',
      type: 'contact',
      name: 'Ananya Roy',
      phone: '+91 9844556677',
      email: 'ananya.roy@example.com',
      city: 'Gurgaon',
      subject: 'Doctor Consultation Callback',
      message: 'Need urgent appointment with Dr. Ipshita for hormonal adult cystic acne breakout.',
      status: 'new',
      priority: 'high',
      source: 'contact_page',
    },
  ];

  for (const eq of sampleEnquiries) {
    await query(
      `INSERT INTO sid_enquiries (enquiry_no, type, name, phone, email, city, subject, message, status, priority, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status=VALUES(status)`,
      [eq.enquiry_no, eq.type, eq.name, eq.phone, eq.email, eq.city, eq.subject, eq.message, eq.status, eq.priority, eq.source]
    );
  }

  // 13. Menus & Content Blocks
  console.log('1️⃣3️⃣ Seeding Navigation Menus & Content Blocks...');
  const headerMenus = [
    { label: 'Home', url: '/', display_order: 1 },
    { label: 'About Clinic', url: '/about-clinic', display_order: 2 },
    { label: 'Treatments', url: '/treatments', display_order: 3 },
    { label: 'Doctors', url: '/about-us', display_order: 4 },
    { label: 'Real Results', url: '/results', display_order: 5 },
    { label: 'Offers', url: '/latest-offer', badge: 'Special', display_order: 6 },
    { label: 'Franchise', url: '/franchise', display_order: 7 },
    { label: 'Contact Us', url: '/contact-us', display_order: 8 },
  ];

  for (const m of headerMenus) {
    await query(
      `INSERT INTO sid_menu_items (menu_key, label, url, badge, display_order, is_active)
       VALUES ('header_main', ?, ?, ?, ?, 1)`,
      [m.label, m.url, m.badge || null, m.display_order]
    );
  }

  // Content Blocks for sections
  const blocks = [
    {
      block_key: 'home.brand_journey',
      title: 'Brand Journey Milestones',
      description: 'Timeline of Skinfinity Derma clinic excellence since inception',
      content: [
        { year: '2017', title: 'The Genesis', description: 'Founded by Dr. Ipshita Johri in Noida with a focus on holistic, results-oriented clinical care.', color: 'from-brand-700 to-teal-600', badge: 'Foundation', image: '/images/journey/journey-2017.jpg' },
        { year: '2019', title: 'Technology Upgrade', description: 'Introduced US-FDA approved Soprano Titanium laser and authentic HydraFacial MD systems.', color: 'from-teal-600 to-emerald-600', badge: 'Innovation', image: '/images/journey/journey-2019.jpg' },
        { year: '2022', title: 'Gurgaon Flagship', description: 'Launched state-of-the-art clinic center on Golf Course Road, Gurugram.', color: 'from-emerald-600 to-teal-700', badge: 'Expansion', image: '/images/journey/journey-2022.jpg' },
        { year: '2026', title: '1,00,000+ Happy Patients', description: 'Crossed landmark milestone of 1,00,000 satisfied patient journeys across Delhi-NCR.', color: 'from-brand-800 to-teal-900', badge: 'Milestone', image: '/images/journey/journey-2024.jpg' },
      ],
    },
    {
      block_key: 'home.top_treatments',
      title: 'Top 25 Curated Treatments',
      description: 'Quick links list featured in the services and footer sections',
      content: [
        'Acne & Pimple Treatment', 'Acne Scar Subcision', 'Full Body Laser Hair Reduction', 'HydraFacial MD Glass Glow',
        'GFC Hair Regrowth Therapy', 'Chemical Peels', 'Q-Switched Pigmentation Laser', 'Dermal Fillers & Botox',
        'Morpheus8 MNRF Tightening', 'Glutathione Radiance Drip', 'Beard Shaping Laser for Men', 'Tattoo Removal Laser'
      ],
    },
    {
      block_key: 'home.franchise_overview',
      title: 'Franchise Partner Overview',
      description: 'Franchise stats and investment model overview for entrepreneurs',
      content: {
        brandStats: { experience: '10+ Years', patients: '1,00,000+', reviews: '4,500+ (4.5 ★)', clinics: 'Flagship Centers in Noida & Gurgaon', investmentRange: '₹1.5 crore – ₹2 crore' },
        headline: 'Partner with India’s Fastest Growing Doctor-Led Dermatology Brand',
        subheadline: 'High ROI, turnkey setup, doctor recruitment support, and centralized marketing drive.',
      },
    },
  ];

  for (const blk of blocks) {
    await query(
      `INSERT INTO sid_content_blocks (block_key, title, description, content, is_active)
       VALUES (?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE content=VALUES(content), title=VALUES(title)`,
      [blk.block_key, blk.title, blk.description, JSON.stringify(blk.content)]
    );
  }

  // 14. SEO Pages
  console.log('1️⃣4️⃣ Seeding Dynamic SEO Metadata Pages...');
  const seoPages = [
    {
      path: '/',
      name: 'Homepage',
      meta_title: 'Best Dermatologist in Noida & Gurgaon | No.1 Skin Clinic | Skinfinity Derma',
      meta_description: 'Award-winning Dermatology & Aesthetic Laser clinic led by Dr. Ipshita Johri. 4,500+ Verified reviews with 4.5 Rating. 5 Senior MD Dermatologists.',
      meta_keywords: 'Dermatologist in Noida, Skin specialist Gurgaon, Laser hair removal Noida, HydraFacial Noida, Dr Ipshita Johri',
      og_image: '/images/hero/hero-banner.webp',
      canonical_url: 'https://www.skinfinityderma.com/',
      sitemap_priority: 1.0,
      sitemap_changefreq: 'daily',
    },
    {
      path: '/treatments',
      name: 'Treatments Catalog',
      meta_title: 'Dermatology & Laser Treatments in Noida & Gurgaon | Skinfinity Derma',
      meta_description: 'Explore full catalog of doctor-led skin, hair, laser, anti-ageing and medi-facial treatments at transparent clinical pricing.',
      meta_keywords: 'Skin treatments price list, Laser hair reduction cost Noida, HydraFacial price Noida, Acne scar doctor',
      canonical_url: 'https://www.skinfinityderma.com/treatments/',
      sitemap_priority: 0.9,
      sitemap_changefreq: 'weekly',
    },
    {
      path: '/about-clinic',
      name: 'About Clinic',
      meta_title: 'About Skinfinity Derma Clinic | Vision, Doctors & Technology',
      meta_description: 'Learn about Skinfinity Derma’s decade-long medical heritage, founder Dr. Ipshita Johri, and hospital-grade aesthetic care standards.',
      canonical_url: 'https://www.skinfinityderma.com/about-clinic/',
      sitemap_priority: 0.8,
      sitemap_changefreq: 'monthly',
    },
    {
      path: '/contact-us',
      name: 'Contact & Clinic Locations',
      meta_title: 'Book Appointment & Clinic Locations | Skinfinity Derma Noida & Gurgaon',
      meta_description: 'Schedule your consultation with senior MD Dermatologists. Get clinic directions, phone numbers, WhatsApp, and consultation timings.',
      canonical_url: 'https://www.skinfinityderma.com/contact-us/',
      sitemap_priority: 0.8,
      sitemap_changefreq: 'monthly',
    },
  ];

  for (const sp of seoPages) {
    await query(
      `INSERT INTO sid_seo_pages (path, name, meta_title, meta_description, meta_keywords, og_image, canonical_url, sitemap_priority, sitemap_changefreq, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE meta_title=VALUES(meta_title), meta_description=VALUES(meta_description), meta_keywords=VALUES(meta_keywords)`,
      [sp.path, sp.name, sp.meta_title, sp.meta_description, sp.meta_keywords, sp.og_image, sp.canonical_url, sp.sitemap_priority, sp.sitemap_changefreq]
    );
  }

  console.log('✅ Skinfinity Derma Database Seed Completed Successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed Failed:', err);
  process.exit(1);
});
