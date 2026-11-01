const fs = require('fs');
const db = require('../config/db');

// Helper to convert treatment name to slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Generate realistic pricing based on category & treatment
function getPricing(cat, name) {
  const n = name.toLowerCase();
  if (cat === 'Wedding Packages') {
    if (n.includes('bronze')) return { price: 14999, original: 22000, duration: '2 - 3 Sessions', discount: '32% OFF' };
    if (n.includes('silver')) return { price: 24999, original: 35000, duration: '4 - 5 Sessions', discount: '28% OFF' };
    if (n.includes('gold')) return { price: 39999, original: 55000, duration: '6 - 8 Sessions', discount: '27% OFF' };
    if (n.includes('platinum')) return { price: 59999, original: 85000, duration: 'Comprehensive Bridal Package', discount: '30% OFF' };
    if (n.includes('groom')) return { price: 29999, original: 42000, duration: 'Groom Aesthetic Package', discount: '28% OFF' };
    return { price: 34999, original: 49999, duration: 'Bridal Glow Package', discount: '30% OFF' };
  }
  if (cat === 'Laser Treatments') {
    if (n.includes('full body')) return { price: 39999, original: 55000, duration: '90 mins', discount: '27% OFF' };
    if (n.includes('beard') || n.includes('facial')) return { price: 3999, original: 6000, duration: '30 mins', discount: '33% OFF' };
    if (n.includes('tattoo')) return { price: 4999, original: 7500, duration: '45 mins', discount: '33% OFF' };
    if (n.includes('mole') || n.includes('wart') || n.includes('skin tag') || n.includes('corn')) return { price: 2499, original: 3500, duration: '30 mins', discount: '28% OFF' };
    return { price: 5999, original: 8500, duration: '45 mins', discount: '29% OFF' };
  }
  if (cat === 'Hair Treatments') {
    if (n.includes('transplant')) return { price: 45000, original: 65000, duration: '3 - 4 hours', discount: '30% OFF' };
    if (n.includes('patch') || n.includes('replacement')) return { price: 18999, original: 26000, duration: '90 mins', discount: '27% OFF' };
    if (n.includes('gfc')) return { price: 6999, original: 9999, duration: '45 mins', discount: '30% OFF' };
    if (n.includes('prp')) return { price: 4999, original: 7500, duration: '45 mins', discount: '33% OFF' };
    return { price: 3999, original: 5500, duration: '45 mins', discount: '27% OFF' };
  }
  if (cat === 'Body Treatments') {
    if (n.includes('hifu')) return { price: 14999, original: 22000, duration: '60 mins', discount: '32% OFF' };
    if (n.includes('double chin')) return { price: 7999, original: 12000, duration: '45 mins', discount: '33% OFF' };
    return { price: 9999, original: 15000, duration: '60 mins', discount: '33% OFF' };
  }
  // Skin Treatments
  if (n.includes('profhilo') || n.includes('viscoderm')) return { price: 22000, original: 28000, duration: '45 mins', discount: '21% OFF' };
  if (n.includes('botox')) return { price: 12999, original: 18000, duration: '30 mins', discount: '28% OFF' };
  if (n.includes('fillers')) return { price: 18000, original: 25000, duration: '45 mins', discount: '28% OFF' };
  if (n.includes('hydrafacial')) return { price: 4999, original: 7500, duration: '60 mins', discount: '33% OFF' };
  if (n.includes('glutathione')) return { price: 5499, original: 8000, duration: '45 mins', discount: '31% OFF' };
  if (n.includes('peel')) return { price: 2999, original: 4500, duration: '30 mins', discount: '33% OFF' };
  return { price: 3499, original: 5000, duration: '45 mins', discount: '30% OFF' };
}

function getCategoryBanner(cat) {
  switch (cat) {
    case 'Skin Treatments': return '/images/treatments/banner-acne.webp';
    case 'Hair Treatments': return '/images/treatments/banner-hairloss.webp';
    case 'Laser Treatments': return '/images/treatments/banner-laser.webp';
    case 'Body Treatments': return '/images/offers/fat-loss.webp';
    case 'Wedding Packages': return '/images/offers/bridal-package.webp';
    default: return '/images/treatments/banner-acne.webp';
  }
}

function getBodyArea(cat, name) {
  const n = name.toLowerCase();
  if (cat === 'Hair Treatments' || n.includes('scalp')) return 'Scalp';
  if (cat === 'Body Treatments' || n.includes('body')) return 'Full Body';
  if (cat === 'Wedding Packages') return 'Full Body';
  if (n.includes('under-eye') || n.includes('lip') || n.includes('beard') || n.includes('chin') || n.includes('face') || n.includes('facial')) return 'Face';
  return 'Face & Neck';
}

async function syncAll() {
  console.log('--- 1. Configuring Clean 5 Categories ---');

  // Delete legacy categories (id < 10)
  await db.query('DELETE FROM sid_categories WHERE id < 10');

  // Define the canonical 5 categories
  const categoriesDef = [
    {
      name: 'Skin Treatments',
      slug: 'skin-treatments',
      description: 'Doctor-guided clinical skin treatments, HydraFacials, medical peels, skin tightening, anti-aging, profhilo, botox, and glow therapies.',
      thumbnail: '/images/treatments/banner-acne.webp',
      display_order: 1
    },
    {
      name: 'Hair Treatments',
      slug: 'hair-treatments',
      description: 'Advanced regenerative hair loss solutions including PRP, GFC therapy, hair transplant, QR678, and scalp therapies.',
      thumbnail: '/images/treatments/banner-hairloss.webp',
      display_order: 2
    },
    {
      name: 'Laser Treatments',
      slug: 'laser-treatments',
      description: 'US-FDA triple-wavelength laser hair reduction, tattoo removal, skin resurfacing, mole/wart removal, and Q-Switch Nd:YAG laser treatments.',
      thumbnail: '/images/treatments/banner-laser.webp',
      display_order: 3
    },
    {
      name: 'Body Treatments',
      slug: 'body-treatments',
      description: 'Non-surgical body contouring, fat reduction, double chin reduction, HIFU sculpting, and targeted slimming.',
      thumbnail: '/images/offers/fat-loss.webp',
      display_order: 4
    },
    {
      name: 'Wedding Packages',
      slug: 'wedding-packages',
      description: 'Comprehensive bridal and groom pre-wedding aesthetic skin, laser, and glow transformations tailored for your special day.',
      thumbnail: '/images/offers/bridal-package.webp',
      display_order: 5
    }
  ];

  const catMap = {}; // slug -> id

  for (const cat of categoriesDef) {
    const existing = await db.one('SELECT id FROM sid_categories WHERE slug = ? OR name = ?', [cat.slug, cat.name]);
    let catId;
    if (existing) {
      catId = existing.id;
      await db.query(
        'UPDATE sid_categories SET name = ?, slug = ?, description = ?, thumbnail = ?, display_order = ?, is_active = 1 WHERE id = ?',
        [cat.name, cat.slug, cat.description, cat.thumbnail, cat.display_order, catId]
      );
    } else {
      const res = await db.query(
        'INSERT INTO sid_categories (name, slug, description, thumbnail, display_order, is_active) VALUES (?, ?, ?, ?, ?, 1)',
        [cat.name, cat.slug, cat.description, cat.thumbnail, cat.display_order]
      );
      catId = res.insertId;
    }
    catMap[cat.name] = catId;
    catMap[cat.slug] = catId;
    console.log(`Category "${cat.name}" => ID ${catId}`);
  }

  // Deactivate or delete any other category
  const allowedIds = Object.values(catMap);
  await db.query(`UPDATE sid_categories SET is_active = 0 WHERE id NOT IN (${allowedIds.join(',')})`);

  console.log('--- 2. Parsing Sheet CSV Treatments ---');
  const csvContent = fs.readFileSync('backend/src/scripts/sheet_data.csv', 'utf8');
  const lines = csvContent.split('\n').filter(l => l.trim().length > 0);

  let currentCategory = 'Skin Treatments';
  const rawItems = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = [];
    let cur = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        parts.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    parts.push(cur.trim());

    let [cat, name, contentText, ytLink] = parts;
    if (cat && cat.length > 0) {
      currentCategory = cat.replace(/"/g, '').trim();
      if (currentCategory.toLowerCase() === 'wedding packages') {
        currentCategory = 'Wedding Packages';
      }
    }
    if (!name || name.trim().length === 0) continue;

    name = name.replace(/^"|"$/g, '').trim();
    contentText = (contentText || name).replace(/^"|"$/g, '').trim();
    ytLink = (ytLink || '').replace(/^"|"$/g, '').trim();

    let ytId = null;
    if (ytLink) {
      const m = ytLink.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
      if (m) ytId = m[1];
    }

    rawItems.push({
      category: currentCategory,
      name,
      content: contentText,
      ytLink,
      ytId
    });
  }

  console.log(`Found ${rawItems.length} treatments to sync.`);

  // Purge old treatments that are not in the new sheet list
  await db.query('DELETE FROM sid_treatments');
  console.log('Cleared previous sid_treatments table.');

  let orderCounter = 1;
  for (const item of rawItems) {
    const catId = catMap[item.category] || catMap['Skin Treatments'];
    const baseSlug = slugify(item.name);
    const slug = baseSlug || `treatment-${orderCounter}`;
    const pricing = getPricing(item.category, item.name);
    const bodyArea = getBodyArea(item.category, item.name);
    const bannerImage = getCategoryBanner(item.category);
    const videoThumbnail = item.ytId ? `https://img.youtube.com/vi/${item.ytId}/hqdefault.jpg` : null;

    const shortDesc = `${item.name} performed by board-certified senior dermatologists at Skinfinity Derma clinics in Noida and Gurgaon. Customized clinical protocols with US-FDA approved technology.`;
    const fullDesc = `Experience visible, clinically-proven transformation with our doctor-led ${item.name}. Under the expert supervision of Dr. Ipshita Johri, our specialized medical dermatology protocol targets root causes with customized clinical energy, active serums, and strict sterilization standards. Ideal for patients seeking safe, radiant, and long-lasting results.`;

    const cardHighlights = [
      `US-FDA approved clinical protocol tailored by senior MD dermatologists.`,
      `Zero downtime or minimal recovery with long-lasting aesthetic outcomes.`,
      `Safe for Indian skin tones with personalized pre-and-post care guidance.`
    ];

    const howItWorks = [
      { stepNumber: "01", title: "Clinical Skin & Health Analysis", desc: "Digital dermoscopy and doctor consultation to evaluate tissue depth and indications.", image: bannerImage },
      { stepNumber: "02", title: "Targeted Cleansing & Prep", desc: "Sterile pre-treatment medical prep and application of numbing cream if indicated.", image: bannerImage },
      { stepNumber: "03", title: "Precision Clinical Protocol", desc: `Execution of ${item.name} utilizing calibrated parameters for maximum safety.`, image: bannerImage },
      { stepNumber: "04", title: "Post-Treatment Soothing Infusion", desc: "Cooling soothing barrier serum and broad-spectrum sunscreen application.", image: bannerImage },
      { stepNumber: "05", title: "Doctor Review & Home Care Plan", desc: "Detailed aftercare instructions and personalized skincare regimen.", image: bannerImage }
    ];

    const idealFor = [
      `Patients seeking effective, doctor-certified ${item.name}.`,
      `Individuals with persistent skin or hair concerns requiring medical aesthetic care.`,
      `All Indian Fitzpatrick skin types looking for zero or minimal downtime.`
    ];

    const notIdealFor = [
      "Active open skin lesions or untreated infections in the target area.",
      "Pregnant or breastfeeding patients without prior physician clearance."
    ];

    const beforeTreatment = [
      "Avoid strong active acids (retinoids, AHA/BHA) 48 hours prior to treatment.",
      "Stay well-hydrated and arrive with a clean face or scalp.",
      "Avoid direct harsh sunbathing or tanning 5 days prior."
    ];

    const afterTreatment = [
      "Apply broad-spectrum SPF 50 sunscreen every 3 to 4 hours.",
      "Avoid steam rooms, saunas, and hot baths for 24 to 48 hours.",
      "Keep the treated area well-hydrated with recommended barrier repair cream."
    ];

    const faqs = [
      {
        question: `How many sessions of ${item.name} are recommended?`,
        answer: `Most patients see initial improvement after just 1 session. For sustained and optimal clinical results, our dermatologists recommend a personalized protocol of 3 to 6 sessions spaced 3–4 weeks apart.`
      },
      {
        question: `Is ${item.name} painful or uncomfortable?`,
        answer: `Our procedures are designed for maximum comfort. Depending on the modality, topical numbing or advanced cooling mechanisms are utilized to ensure the session is virtually painless.`
      },
      {
        question: `Why choose Skinfinity Derma for ${item.name}?`,
        answer: `At Skinfinity Derma, every single protocol is planned and supervised by certified MD dermatologists using genuine US-FDA approved technology and hospital-grade sanitization.`
      }
    ];

    const galleryImages = [
      { src: bannerImage, caption: item.name },
      ...(videoThumbnail ? [{ src: videoThumbnail, caption: `${item.name} Clinical Demonstration` }] : [])
    ];

    const tags = ["US-FDA APPROVED", "DOCTOR SUPERVISED", "0% EMI"];

    await db.query(
      `INSERT INTO sid_treatments (
        legacy_id, slug, aliases, name, category_id, body_area, tags,
        rating, reviews_count, duration, price, original_price, discount_badge,
        emi_months, emi_monthly, sessions_info, card_highlights,
        explained_subtitle, short_desc, full_desc, banner_image, gallery_images,
        how_it_works, ideal_frequency, ideal_for, not_ideal_for,
        before_treatment, after_treatment, youtube_video_id, video_url,
        video_title, video_thumbnail, faqs, seo_title, seo_description,
        display_order, is_active, is_featured
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, 1, ?
      )`,
      [
        slug,
        slug,
        JSON.stringify([baseSlug]),
        item.name,
        catId,
        bodyArea,
        JSON.stringify(tags),
        4.92,
        Math.floor(120 + Math.random() * 300),
        pricing.duration,
        pricing.price,
        pricing.original,
        pricing.discount,
        6,
        Math.round(pricing.price / 6),
        pricing.duration.includes('Session') ? pricing.duration : '1 Clinical Session',
        JSON.stringify(cardHighlights),
        `Doctor-Supervised Clinical Excellence by Dr. Ipshita Johri`,
        shortDesc,
        fullDesc,
        bannerImage,
        JSON.stringify(galleryImages),
        JSON.stringify(howItWorks),
        'Every 3 to 4 weeks or as prescribed by consulting dermatologist',
        JSON.stringify(idealFor),
        JSON.stringify(notIdealFor),
        JSON.stringify(beforeTreatment),
        JSON.stringify(afterTreatment),
        item.ytId,
        item.ytLink,
        `${item.name} | Skinfinity Derma Clinic`,
        videoThumbnail,
        JSON.stringify(faqs),
        `${item.name} in Noida & Gurgaon | Skinfinity Derma`,
        `Book ${item.name} with Dr. Ipshita Johri at Skinfinity Derma. US-FDA approved technologies, top dermatologists, and customized aesthetic results.`,
        orderCounter,
        orderCounter <= 3 ? 1 : 0
      ]
    );

    orderCounter++;
  }

  console.log(`--- Sync Complete! Inserted ${orderCounter - 1} treatments into sid_treatments. ---`);

  // Verify counts
  const finalCats = await db.query('SELECT id, name, slug, (SELECT COUNT(*) FROM sid_treatments WHERE category_id = sid_categories.id) as treatment_count FROM sid_categories WHERE is_active = 1 ORDER BY display_order ASC');
  console.log('Categories breakdown:');
  console.table(finalCats);

  process.exit(0);
}

syncAll().catch(e => {
  console.error('Sync failed:', e);
  process.exit(1);
});
