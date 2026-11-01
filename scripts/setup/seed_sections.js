const db = require('../config/db');

async function seedInitial() {
  const aboutExtra = JSON.stringify({
    stats: [
      { value: '1,00,000+', label: 'Patients Treated' },
      { value: '15+', label: 'US-FDA Lasers' },
      { value: '4.5★', label: '4,500+ Reviews' },
      { value: 'CMO', label: 'Govt. Licensed' }
    ],
    award: 'No.1 Skin Clinic Noida',
    locationChip: 'Noida Sec 36 & Gurgaon Sec 28',
    accreditation: 'NABH Standards'
  });

  await db.query(`
    UPDATE sid_homepage_sections
    SET subtitle = 'Where Clinical Expertise Meets Patient Luxury',
        badge_text = 'Complete Medical Infrastructure',
        description = '<p>At Skinfinity Derma, we believe patient outcomes begin with medical integrity and immaculate hygiene. From individual diagnosis chambers to sterile procedure operatories, every aspect of our clinic is engineered to deliver safe, predictable, and life-changing skin and hair transformations.</p>',
        media_url = '/images/custom/clinic-reception.jpg',
        media_alt = 'Skinfinity Derma Luxury Clinic Reception — Noida & Gurgaon',
        button_text = 'Book Clinic Consultation',
        button_url = '/contact-us#appointment_form',
        secondary_button_text = 'Explore Full Facilities',
        secondary_button_url = '/about-clinic',
        extra_json = ?,
        is_active = 1
    WHERE section_key = 'about_clinic'
  `, [aboutExtra]);

  const founderExtra = JSON.stringify({
    qualifications: 'MBBS, DDV | PG Dip. Clinical Dermatology (Cardiff University, U.K.)',
    experience: '12+ Years Clinical Experience in Delhi NCR',
    subDescription: '<p>Her signature medical philosophy rests on four core pillars: Accurate Diagnosis, Root-Cause Eradication, Prevention of Recurrence, and Empowered Patient Education. Under her leadership, Skinfinity Derma has treated over 1,00,000 satisfied patients across India and internationally.</p>',
    missCurvy: {
      title: 'Ms. India Curvy 2020',
      subtitle: 'Runner Up & Pageant Icon',
      tagline: 'Empowering Body Positivity',
      image: '/images/doctors/dr-ipshita-miss-curvy.jpg'
    },
    highlights: [
      'Pioneer of Sugarcane HydraFacial',
      'Advanced Laser Hair Reduction Specialist',
      'Non-Surgical Facial Contouring & Botox',
      'Evidence-Based Acne & Scar Protocols'
    ]
  });

  await db.query(`
    UPDATE sid_homepage_sections
    SET title = 'Dr. Ipshita Johri',
        subtitle = 'Founder, Medical Director & Celebrity Dermatologist',
        badge_text = 'Chief Medical Officer',
        description = '<p>Dr. Ipshita Johri is a prominent medical cosmetologist and laser specialist with over 14 years of aesthetic experience. Official dermatologist partner for Miss Curvy Queen India and featured in Vogue, Elle, and Grazia.</p>',
        media_url = '/images/doctors/dr-ipshita-johri.webp',
        media_alt = 'Dr. Ipshita Johri - Founder & Celebrity Dermatologist',
        button_text = 'Read Full Biography & Philosophy',
        button_url = '/about-clinic',
        secondary_button_text = 'Consult with Dr. Ipshita',
        secondary_button_url = '#consultation',
        extra_json = ?,
        is_active = 1
    WHERE section_key = 'doctor_founder'
  `, [founderExtra]);

  console.log('Seeded homepage sections successfully');
  process.exit(0);
}

seedInitial().catch(e => { console.error(e); process.exit(1); });
