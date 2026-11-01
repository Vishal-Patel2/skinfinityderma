const db = require('../config/db');

async function updateDoctors() {
  await db.query(`
    UPDATE sid_doctors SET image = '/images/doctors/dr-ipshita-johri.webp', display_order = 1, is_active = 1 WHERE slug = 'dr-ipshita-johri'
  `);
  await db.query(`
    UPDATE sid_doctors SET image = '/images/doctors/dr-sukriti-agarwal.webp', display_order = 2, is_active = 1 WHERE slug = 'dr-sukriti-agarwal'
  `);
  await db.query(`
    UPDATE sid_doctors SET image = '/images/doctors/dr-anchal-bansal.webp', display_order = 3, is_active = 1 WHERE slug = 'dr-anchal-bansal'
  `);
  await db.query(`
    UPDATE sid_doctors SET image = '/images/doctors/dr-neha-sharma.webp', display_order = 4, is_active = 1 WHERE slug = 'dr-neha-sharma'
  `);
  await db.query(`
    UPDATE sid_doctors SET image = '/images/doctors/dr-shradha-saxena.webp', display_order = 5, is_active = 1 WHERE slug = 'dr-shradha-saxena'
  `);
  console.log('Updated doctor image paths in DB');
  const doctors = await db.query('SELECT id, name, slug, image, is_active FROM sid_doctors');
  console.log(doctors);
  process.exit(0);
}

updateDoctors().catch(e => { console.error(e); process.exit(1); });
