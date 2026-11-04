const mysql = require('../backend/node_modules/mysql2/promise');

(async () => {
  const conn = await mysql.createConnection('mysql://root:SOZfHmKNxIuKxkNljWGqNMAlDCXMZyrx@sakura.proxy.rlwy.net:58637/railway');
  const [rows] = await conn.execute('SELECT id, slug, name, banner_image FROM sid_treatments ORDER BY id ASC');
  console.log('Total treatments in sid_treatments:', rows.length);
  rows.forEach((r, idx) => console.log(`${idx + 1}. [${r.id}] ${r.slug} -> ${r.name}`));
  await conn.end();
})();
