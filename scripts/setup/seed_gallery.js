const { pool } = require('../../backend/src/config/db');

const GALLERY_ITEMS = [
  // ── 1. CLINIC INFRASTRUCTURE & SUITES (GURGAON & NOIDA) ──
  {
    image: '/images/gallery/skinfinity-gurgaon-1.webp',
    title: 'Gurgaon Flagship Reception & Patient Lounge',
    description: 'Opulent reception area with dedicated concierge, private sanitized seating lounges, and luxury aesthetic ambience.',
    category: 'Clinic',
    badge: 'Gurgaon Sector 28',
    location: 'Gurgaon',
    display_order: 1
  },
  {
    image: '/images/gallery/skinfinity-gurgaon-2.webp',
    title: 'Sterile Dermatology Laser Procedure Suite',
    description: 'State-of-the-art procedure room equipped with US-FDA laser platforms and hospital-grade sterilization protocols.',
    category: 'Clinic',
    badge: 'Clinical Operatory',
    location: 'Gurgaon',
    display_order: 2
  },
  {
    image: '/images/gallery/skinfinity-gurgaon-3.webp',
    title: 'VIP Aesthetic Consultation Chamber',
    description: 'Private consultation room with polarized digital dermoscopy and root-cause diagnostic stations for personalized care.',
    category: 'Clinic',
    badge: 'Doctor Chamber',
    location: 'Gurgaon',
    display_order: 3
  },
  {
    image: '/images/gallery/skinfinity-gurgaon-4.webp',
    title: 'Advanced Laser Hair Reduction Operatory',
    description: 'Equipped with Alma Soprano Titanium triple-wavelength laser and chilled contact sapphire cooling for pain-free treatment.',
    category: 'Clinic',
    badge: 'Laser Operatory',
    location: 'Gurgaon',
    display_order: 4
  },
  {
    image: '/images/gallery/skinfinity-gurgaon-5.webp',
    title: 'Medical Facial & Hydra Dermabrasion Chamber',
    description: 'Dedicated room for original HydraFacial MD, medical chemical peels, and non-invasive glow infusions.',
    category: 'Clinic',
    badge: 'Facial Suite',
    location: 'Gurgaon',
    display_order: 5
  },
  {
    image: '/images/gallery/skinfinity-gurgaon-6.webp',
    title: 'Clinical Examination & Dermoscopy Zone',
    description: 'High-magnification polarized optical analyzer for follicular unit density and epidermal pigment mapping.',
    category: 'Clinic',
    badge: 'Diagnostic Suite',
    location: 'Gurgaon',
    display_order: 6
  },
  {
    image: '/images/gallery/skinfinity-gurgaon-7.webp',
    title: 'Private Recovery & Post-Procedure Lounge',
    description: 'Quiet soothing post-treatment recovery lounge ensuring complete patient privacy and clinical aftercare monitoring.',
    category: 'Clinic',
    badge: 'Patient Comfort',
    location: 'Gurgaon',
    display_order: 7
  },
  {
    image: '/images/gallery/skinfinity-gurgaon-8.webp',
    title: 'In-House Dermatological Pharmacy Counter',
    description: 'Temperature-controlled authentic actives, prescription dermatological formulations, and clinical sunscreens.',
    category: 'Clinic',
    badge: 'Cold-Chain Pharmacy',
    location: 'Gurgaon',
    display_order: 8
  },
  {
    image: '/images/gallery/skinfinity-gurgaon-9.webp',
    title: 'Executive Injectables & Anti-Aging Suite',
    description: 'Dedicated suite for Botox, Juvederm dermal fillers, Profhilo, and thread lifts performed by certified MD dermatologists.',
    category: 'Clinic',
    badge: 'Anti-Aging Suite',
    location: 'Gurgaon',
    display_order: 9
  },
  {
    image: '/images/gallery/skinfinity-gurgaon-10.webp',
    title: 'Skinfinity Clinic Exterior & Welcome Entrance',
    description: 'Conveniently located on Golf Course Road, Sector 28 Gurugram with dedicated valet parking and prime accessibility.',
    category: 'Clinic',
    badge: 'Prime Location',
    location: 'Gurgaon',
    display_order: 10
  },
  {
    image: '/images/custom/clinic-reception.jpg',
    title: 'Noida Flagship Reception & Welcome Lounge',
    description: 'NABH-standard flagship reception with private consultation lounges, warm architectural finishes, and seamless digital check-in.',
    category: 'Clinic',
    badge: 'Noida Sector 36',
    location: 'Noida',
    display_order: 11
  },
  {
    image: '/images/clinic/interior-1.jpg',
    title: 'Noida Advanced Procedure Suite & Sterilization Bay',
    description: 'Sterile operatory with US-FDA approved technologies, disposable single-patient hygiene kits, and strict medical SOPs.',
    category: 'Clinic',
    badge: 'Noida Sector 36',
    location: 'Noida',
    display_order: 12
  },
  {
    image: '/images/clinic/interior-2.jpg',
    title: 'Senior MD Dermatologist Consultation Suite',
    description: 'Consultation chamber led by Dr. Ipshita Johri and senior clinical board for deep dermatological assessment.',
    category: 'Clinic',
    badge: 'Noida Sector 36',
    location: 'Noida',
    display_order: 13
  },
  {
    image: '/images/clinic/interior-3.jpg',
    title: 'Noida VIP Aesthetics & Laser Lounge',
    description: 'Quiet luxury consultation suite for comprehensive anti-aging and facial transformation planning.',
    category: 'Clinic',
    badge: 'Noida Sector 36',
    location: 'Noida',
    display_order: 14
  },

  // ── 2. US-FDA MACHINES & ADVANCED TECHNOLOGY ──
  {
    image: '/images/treatments/banner-laser.webp',
    title: 'US-FDA Soprano Titanium Triple-Wavelength Laser',
    description: 'Painless permanent hair reduction with -4°C ICE Plus continuous sapphire contact cooling, calibrated for Indian skin tones.',
    category: 'Machines',
    badge: '755nm + 810nm + 1064nm',
    location: 'Noida & Gurgaon',
    display_order: 15
  },
  {
    image: '/images/clinic/interior-4.jpg',
    title: 'Q-Switched Nd:YAG 1064nm Nanosecond Laser',
    description: 'Photoacoustic melanin shattering technology for stubborn melasma, sun spots, carbon laser peels, and epidermal brightening.',
    category: 'Machines',
    badge: 'Melasma & Pigment Toning',
    location: 'Noida & Gurgaon',
    display_order: 16
  },
  {
    image: '/images/treatments/banner-acne.webp',
    title: 'Gold-Insulated Fractional MNRF Platform',
    description: 'Precision microneedling radiofrequency system that delivers controlled dermal thermal energy for deep acne scar elevation.',
    category: 'Machines',
    badge: 'Collagen Scar Remodeling',
    location: 'Noida & Gurgaon',
    display_order: 17
  },
  {
    image: '/images/treatments/banner-hydrafacial.webp',
    title: 'Vortex-Fusion Sugarcane HydraFacial MD System',
    description: 'Medical vacuum extraction and botanical glycolic-hyaluronic infusion platform with integrated phototherapy.',
    category: 'Machines',
    badge: 'Hydro-Dermabrasion & LED',
    location: 'Noida & Gurgaon',
    display_order: 18
  },
  {
    image: '/images/results/facial-after.jpg',
    title: '4D HIFU SMAS Ultrasound Lifting System',
    description: 'Non-surgical focused ultrasound targeting the foundational SMAS layer for jawline contouring and double-chin reduction.',
    category: 'Machines',
    badge: '1.5mm • 3.0mm • 4.5mm Depth',
    location: 'Noida & Gurgaon',
    display_order: 19
  },
  {
    image: '/images/clinic/interior-2.jpg',
    title: '200x Digital Video Dermoscope & Trichoscope',
    description: 'High-magnification polarized optical analyzer for follicular unit density mapping and epidermal pigment depth grading.',
    category: 'Machines',
    badge: 'AI-Assisted Diagnostics',
    location: 'Noida & Gurgaon',
    display_order: 20
  },

  // ── 3. DIAGNOSTIC LABS & PHARMACY ──
  {
    image: '/images/clinic/interior-6.jpg',
    title: 'On-Site Orange Health Pathology Collection Lab',
    description: 'Same-day hormonal, PCOS, thyroid (T3/T4/TSH), ferritin, and vitamin D3/B12 blood panels to diagnose internal root causes.',
    category: 'Labs',
    badge: 'NABL Certified Diagnostics',
    location: 'Noida & Gurgaon',
    display_order: 21
  },
  {
    image: '/images/treatments/banner-hairloss.webp',
    title: 'Sterile Autologous GFC & PRP Cellular Lab',
    description: 'Hospital-grade laminar hygiene zone for isolating 10x concentrated autologous growth factors from patient blood samples.',
    category: 'Labs',
    badge: 'Closed-System Centrifugation',
    location: 'Noida & Gurgaon',
    display_order: 22
  },
  {
    image: '/images/clinic/interior-2.jpg',
    title: "Wood's Lamp & Microscopic Trichology Lab",
    description: "Differentiates epidermal vs. dermal melasma and evaluates hair bulb anagen-to-telogen ratios prior to treatment.",
    category: 'Labs',
    badge: 'Root-Cause Evaluation',
    location: 'Noida & Gurgaon',
    display_order: 23
  },
  {
    image: '/images/clinic/interior-1.jpg',
    title: 'In-House Cold-Chain Dermatological Pharmacy',
    description: 'Temperature-controlled storage for authentic Allergan biologics, peptide serums, medical peels, and prescription topicals.',
    category: 'Labs',
    badge: '100% Batch-Verified Actives',
    location: 'Noida & Gurgaon',
    display_order: 24
  }
];

async function seed() {
  try {
    console.log('Seeding gallery items into sid_gallery_items...');
    // Clear any old items
    await pool.query('DELETE FROM sid_gallery_items');

    for (const item of GALLERY_ITEMS) {
      await pool.query(
        `INSERT INTO sid_gallery_items 
          (image, title, description, category, badge, location, alt_text, display_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          item.image,
          item.title,
          item.description,
          item.category,
          item.badge,
          item.location,
          item.title,
          item.display_order
        ]
      );
    }

    console.log(`Successfully seeded ${GALLERY_ITEMS.length} gallery items!`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
