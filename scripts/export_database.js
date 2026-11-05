const fs = require('fs');
const path = require('path');
const { pool } = require('../backend/src/config/db');

async function exportDatabase() {
  console.log('📦 Starting Full MySQL Database Export...');

  const [tables] = await pool.query('SHOW TABLES');
  const tableNames = tables.map((r) => Object.values(r)[0]);

  let dump = `-- ========================================================\n`;
  dump += `-- SKINFINITY DERMA - COMPLETE PRODUCTION DATABASE DUMP\n`;
  dump += `-- Generated: ${new Date().toISOString()}\n`;
  dump += `-- Includes: Core CMS, Catalog, Appointments, CRM, Patient Dossiers, Cart, Orders & Payments\n`;
  dump += `-- ========================================================\n\n`;
  dump += `SET FOREIGN_KEY_CHECKS = 0;\n`;
  dump += `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\n`;
  dump += `SET NAMES utf8mb4;\n\n`;

  for (const tableName of tableNames) {
    console.log(`Exporting table: ${tableName}...`);

    // DDL
    const [[createRow]] = await pool.query(`SHOW CREATE TABLE \`${tableName}\``);
    dump += `-- --------------------------------------------------------\n`;
    dump += `-- Table structure for table \`${tableName}\`\n`;
    dump += `-- --------------------------------------------------------\n`;
    dump += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
    dump += `${createRow['Create Table']};\n\n`;

    // Data
    const [rows] = await pool.query(`SELECT * FROM \`${tableName}\``);
    if (rows.length > 0) {
      dump += `-- Dumping data for table \`${tableName}\` (${rows.length} rows)\n`;

      const columns = Object.keys(rows[0]).map((c) => `\`${c}\``).join(', ');

      // Batch insert in chunks of 50
      const chunkSize = 50;
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        const valuesList = chunk.map((row) => {
          const vals = Object.values(row).map((val) => {
            if (val === null || val === undefined) return 'NULL';
            if (typeof val === 'number') return val;
            if (typeof val === 'boolean') return val ? 1 : 0;
            if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
            if (typeof val === 'object') return `'${JSON.stringify(val).replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
              switch (char) {
                case "\0": return "\\0";
                case "\x08": return "\\b";
                case "\x09": return "\\t";
                case "\x1a": return "\\z";
                case "\n": return "\\n";
                case "\r": return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%": return "\\" + char;
                default: return char;
              }
            })}'`;
            const str = String(val).replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
              switch (char) {
                case "\0": return "\\0";
                case "\x08": return "\\b";
                case "\x09": return "\\t";
                case "\x1a": return "\\z";
                case "\n": return "\\n";
                case "\r": return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%": return "\\" + char;
                default: return char;
              }
            });
            return `'${str}'`;
          });
          return `(${vals.join(', ')})`;
        });

        dump += `INSERT INTO \`${tableName}\` (${columns}) VALUES\n${valuesList.join(',\n')};\n`;
      }
      dump += `\n`;
    }
  }

  dump += `SET FOREIGN_KEY_CHECKS = 1;\n`;
  dump += `-- End of dump\n`;

  const destPath1 = path.resolve(__dirname, '../backend/database/skinfinity_derma_complete.sql');
  const destPath2 = path.resolve(__dirname, '../skinfinity_database.sql');

  fs.writeFileSync(destPath1, dump, 'utf8');
  fs.writeFileSync(destPath2, dump, 'utf8');

  console.log(`\n🎉 Database export successfully saved to:`);
  console.log(`  - ${destPath1} (${(Buffer.byteLength(dump) / 1024).toFixed(1)} KB)`);
  console.log(`  - ${destPath2} (${(Buffer.byteLength(dump) / 1024).toFixed(1)} KB)`);

  process.exit(0);
}

exportDatabase().catch((err) => {
  console.error('Export error:', err);
  process.exit(1);
});
