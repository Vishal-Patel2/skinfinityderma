const mysql = require('../backend/node_modules/mysql2/promise');

const REPLACEMENTS = [
  ['ΓÇô', '–'],
  ['ΓÇö', '—'],
  ['Γÿà', '★'],
  ['ΓÇÖ', '’'],
  ['ΓÇ£', '“'],
  ['ΓÇ¥', '”'],
];

const TARGETS = [
  { table: 'sid_treatments', cols: ['name', 'short_desc', 'full_desc', 'faqs', 'benefits', 'procedure_steps'] },
  { table: 'sid_settings', cols: ['setting_value'] },
  { table: 'sid_homepage_items', cols: ['title', 'description', 'highlight'] },
  { table: 'sid_content_blocks', cols: ['title', 'content', 'description'] },
  { table: 'sid_blogs', cols: ['title', 'content', 'excerpt'] },
  { table: 'sid_faqs', cols: ['question', 'answer'] },
  { table: 'sid_clinics', cols: ['name', 'address', 'description'] }
];

async function main() {
  const conn = await mysql.createConnection('mysql://root:SOZfHmKNxIuKxkNljWGqNMAlDCXMZyrx@sakura.proxy.rlwy.net:58637/railway');
  console.log('Connected to Railway MySQL.');

  for (const target of TARGETS) {
    try {
      const [tableCols] = await conn.execute(`DESCRIBE \`${target.table}\``);
      const existingCols = tableCols.map(c => c.Field);
      
      for (const col of target.cols) {
        if (!existingCols.includes(col)) continue;
        for (const [bad, good] of REPLACEMENTS) {
          const [res] = await conn.execute(
            `UPDATE \`${target.table}\` SET \`${col}\` = REPLACE(\`${col}\`, ?, ?) WHERE \`${col}\` LIKE ?`,
            [bad, good, `%${bad}%`]
          );
          if (res.affectedRows > 0) {
            console.log(`Updated ${res.affectedRows} rows in ${target.table}.${col} for "${bad}" -> "${good}".`);
          }
        }
      }
    } catch (e) {
      console.log(`Table ${target.table} check error:`, e.message);
    }
  }

  // Now clean <p> and </p> tags from sid_treatments faqs and full_desc
  console.log('Cleaning <p> tags from sid_treatments...');
  const [rows] = await conn.execute('SELECT id, slug, faqs, full_desc FROM sid_treatments');
  let cleanedCount = 0;
  for (const r of rows) {
    let changed = false;
    let newFaqs = r.faqs;
    let newDesc = r.full_desc;

    if (newFaqs && (newFaqs.includes('<p>') || newFaqs.includes('</p>'))) {
      try {
        let parsed = JSON.parse(newFaqs);
        if (Array.isArray(parsed)) {
          parsed = parsed.map(f => ({
            ...f,
            answer: (f.answer || '')
              .replace(/<\/?p>/gi, '')
              .replace(/<\/?span[^>]*>/gi, '')
              .replace(/&amp;/g, '&')
              .trim()
          }));
          newFaqs = JSON.stringify(parsed);
          changed = true;
        }
      } catch (err) {
        newFaqs = newFaqs.replace(/<\/?p>/gi, '').trim();
        changed = true;
      }
    }

    if (newDesc && (newDesc.includes('<p>') || newDesc.includes('</p>'))) {
      // Remove opening and closing <p> tags but preserve clean paragraphs with \n\n
      newDesc = newDesc
        .replace(/<p>/gi, '')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .replace(/&amp;/g, '&')
        .trim();
      changed = true;
    }

    if (changed) {
      await conn.execute('UPDATE sid_treatments SET faqs = ?, full_desc = ? WHERE id = ?', [newFaqs, newDesc, r.id]);
      cleanedCount++;
    }
  }
  console.log(`Cleaned <p> tags in ${cleanedCount} treatments.`);

  await conn.end();
  console.log('All DB text fixes complete!');
}

main().catch(console.error);
