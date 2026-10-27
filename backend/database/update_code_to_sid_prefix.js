const fs = require('fs');
const path = require('path');

const targetTables = [
  'appointments',
  'audit_logs',
  'banners',
  'before_after_cases',
  'categories',
  'clinics',
  'concerns',
  'content_blocks',
  'coupon_categories',
  'coupon_redemptions',
  'coupon_treatments',
  'coupons',
  'doctors',
  'enquiries',
  'faqs',
  'gallery_items',
  'lead_notes',
  'media_files',
  'membership_plans',
  'menu_items',
  'offer_treatments',
  'offers',
  'permissions',
  'press_mentions',
  'reviews',
  'role_permissions',
  'roles',
  'seo_pages',
  'settings',
  'treatment_concerns',
  'treatments',
  'users',
  'videos'
];

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const tbl of targetTables) {
    // Match FROM, INTO, UPDATE, JOIN, TABLE with optional backticks
    const regex = new RegExp(`\\b(FROM|INTO|UPDATE|JOIN|TABLE|TABLE IF NOT EXISTS|REFERENCES)\\s+(\`?)` + tbl + `(\`?)\\b`, 'gi');
    content = content.replace(regex, (match, verb, b1, b2) => {
      return `${verb} ${b1}sid_${tbl}${b2}`;
    });
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated SQL queries in ${filePath}`);
  } else {
    console.log(`ℹ️ No changes needed in ${filePath}`);
  }
}

const files = [
  path.join(__dirname, '../src/routes/admin-crud.js'),
  path.join(__dirname, '../src/routes/public.js'),
  path.join(__dirname, '../src/routes/appointments.js'),
  path.join(__dirname, '../src/routes/auth.js'),
  path.join(__dirname, '../src/routes/users.js'),
  path.join(__dirname, '../src/routes/coupons.js'),
  path.join(__dirname, '../src/routes/enquiries.js'),
  path.join(__dirname, '../src/middleware/auth.js'),
  path.join(__dirname, '../src/middleware/audit.js'),
  path.join(__dirname, 'seed.js'),
  path.join(__dirname, 'schema.sql'),
];

files.forEach(f => {
  if (fs.existsSync(f)) updateFile(f);
});
