const mysql = require('../backend/node_modules/mysql2/promise');

const REPLACEMENTS = [
  ['ΓÇô', '–'],
  ['ΓÇö', '—'],
  ['Γÿà', '★'],
  ['ΓÇÖ', '’'],
  ['ΓÇ£', '“'],
  ['ΓÇ¥', '”'],
];

async function main() {
  const conn = await mysql.createConnection('mysql://root:SOZfHmKNxIuKxkNljWGqNMAlDCXMZyrx@sakura.proxy.rlwy.net:58637/railway');
  console.log('Connected to Railway MySQL.');

  const [tables] = await conn.execute('SHOW TABLES');
  const tableNames = tables.map(r => Object.values(r)[0]);
  console.log('Tables found:', tableNames.length);

  for (const tbl of tableNames) {
    const [cols] = await conn.execute(`DESCRIBE \`${tbl}\``);
    const textCols = cols
      .filter(c => /varchar|text|longtext|mediumtext|json/i.test(c.Type))
      .map(c => c.Field);

    for (const col of textCols) {
      for (const [bad, good] of REPLACEMENTS) {
        try {
          const [check] = await conn.execute(
            `SELECT COUNT(*) as cnt FROM \`${tbl}\` WHERE \`${col}\` LIKE ?`,
            [`%${bad}%`]
          );
          if (check[0].cnt > 0) {
            console.log(`Found ${check[0].cnt} occurrences of "${bad}" in ${tbl}.${col}. Updating...`);
            await conn.execute(
              `UPDATE \`${tbl}\` SET \`${col}\` = REPLACE(\`${col}\`, ?, ?) WHERE \`${col}\` LIKE ?`,
              [bad, good, `%${bad}%`]
            );
            console.log(`Fixed ${tbl}.${col} with "${good}".`);
          }
        } catch (err) {
          // Skip columns where REPLACE doesn't apply (e.g. invalid JSON)
        }
      }
    }
  }

  // Also check sid_treatments for FAQs where answer has raw <p> and </p> tags
  console.log('\nChecking FAQs in sid_treatments for cleaning...');
  const [treatments] = await conn.execute('SELECT id, slug, faqs, full_desc FROM sid_treatments');
  let faqCleanCount = 0;
  let descCleanCount = 0;

  for (const t of treatments) {
    let updated = false;
    let newFaqs = t.faqs;
    let newDesc = t.full_desc;

    if (t.faqs && typeof t.faqs === 'string' && (t.faqs.includes('<p>') || t.faqs.includes('</p>'))) {
      try {
        let parsed = JSON.parse(t.faqs);
        if (Array.isArray(parsed)) {
          parsed = parsed.map(f => ({
            ...f,
            answer: (f.answer || '')
              .replace(/<p>/gi, '')
              .replace(/<\/p>/gi, '\n\n')
              .replace(/\n\s*\n/g, '\n\n')
              .trim()
          }));
          newFaqs = JSON.stringify(parsed);
          updated = true;
          faqCleanCount++;
        }
      } catch (e) {
        // Fallback string replacement
        newFaqs = t.faqs.replace(/<p>/gi, '').replace(/<\/p>/gi, '');
        updated = true;
        faqCleanCount++;
      }
    }

    if (updated) {
      await conn.execute('UPDATE sid_treatments SET faqs = ? WHERE id = ?', [newFaqs, t.id]);
    }
  }
  console.log(`Cleaned FAQ <p> tags for ${faqCleanCount} treatments in database.`);

  await conn.end();
  console.log('Finished mojibake & FAQ cleanup.');
}

main().catch(err => {
  console.error('Error running cleanup:', err);
  process.exit(1);
});
