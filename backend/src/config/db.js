const mysql = require('mysql2/promise');
const config = require('./env');

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  decimalNumbers: true, // DECIMAL columns come back as numbers
  dateStrings: ['DATE'], // keep DATE columns as 'YYYY-MM-DD'
});

// Configure high max_allowed_packet on startup
(async function initDbConfig() {
  try {
    await pool.query('SET GLOBAL max_allowed_packet = 67108864');
  } catch (e) {
    // Ignore if permission denied
  }
})();

/** Run a query and return the rows. */
async function query(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

/** Run a query and return the first row (or null). */
async function one(sql, params) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

/**
 * Run `fn(q)` inside a transaction. `q(sql, params)` runs on the transaction connection.
 */
async function tx(fn) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const q = async (sql, params) => {
      const [rows] = await conn.query(sql, params);
      return rows;
    };
    const result = await fn(q);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { pool, query, one, tx };
