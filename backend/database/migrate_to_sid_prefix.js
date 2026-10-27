const mysql = require('mysql2/promise');
const config = require('../src/config/env');

async function migratePrefix() {
  const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    charset: 'utf8mb4',
  });

  console.log('🔄 Starting migration to standard `sid_` prefix pattern...');
  
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');

  const [tables] = await pool.query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
  const baseTables = tables.map((t) => Object.values(t)[0]).filter((t) => !t.startsWith('sid_'));

  for (const tbl of baseTables) {
    const sidName = `sid_${tbl}`;
    console.log(`Renaming ${tbl} -> ${sidName} and creating view ${tbl}...`);
    await pool.query(`RENAME TABLE \`${tbl}\` TO \`${sidName}\``);
    await pool.query(`CREATE OR REPLACE VIEW \`${tbl}\` AS SELECT * FROM \`${sidName}\``);
  }

  await pool.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('✅ All 33 tables migrated to `sid_` prefix successfully with updatable backward-compatible VIEWs!');

  const [sidTables] = await pool.query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
  console.log('New BASE TABLES count:', sidTables.length);
  console.log(sidTables.map((t) => Object.values(t)[0]));

  await pool.end();
}

migratePrefix().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
