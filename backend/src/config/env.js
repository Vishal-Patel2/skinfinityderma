const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const get = (key, fallback) =>
  process.env[key] !== undefined && process.env[key] !== '' ? process.env[key] : fallback;

const nodeEnv = get('NODE_ENV', 'development');

let dbConfig = {
  host: get('DB_HOST', '127.0.0.1'),
  port: parseInt(get('DB_PORT', '3306'), 10),
  user: get('DB_USER', 'root'),
  password: get('DB_PASSWORD', ''),
  database: get('DB_NAME', 'skinfinity_derma'),
};

const cloudDbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQLDATABASE_URL || process.env.JAWSDB_URL;
if (cloudDbUrl) {
  try {
    const parsed = new URL(cloudDbUrl);
    dbConfig = {
      host: parsed.hostname,
      port: parseInt(parsed.port || '3306', 10),
      user: decodeURIComponent(parsed.username || 'root'),
      password: decodeURIComponent(parsed.password || ''),
      database: (parsed.pathname || '/skinfinity_derma').replace(/^\//, ''),
    };
  } catch (e) {
    console.warn('Failed to parse cloud database URL:', e);
  }
}

const config = {
  nodeEnv,
  isProd: nodeEnv === 'production',
  port: parseInt(get('PORT', '4000'), 10),
  db: dbConfig,
  jwt: {
    secret: get('JWT_SECRET', 'skf-production-jwt-token-secret-2026-medical-crm'),
    expiresIn: get('JWT_EXPIRES_IN', '12h'),
  },
  corsOrigins: get('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000,https://www.skinfinityderma.com,https://skinfinityderma.vercel.app,https://skinfinityderma.onrender.com')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  publicBaseUrl: get('PUBLIC_BASE_URL', 'http://localhost:4000').replace(/\/$/, ''),
  uploadsDir: path.resolve(__dirname, '..', '..', get('UPLOADS_DIR', 'uploads')),
  adminDir: [
    path.resolve(__dirname, '..', '..', '..', 'admin'),
    path.resolve(__dirname, '..', '..', 'admin'),
    path.resolve(process.cwd(), 'admin'),
    path.resolve(process.cwd(), 'public', 'admin'),
  ].find((p) => fs.existsSync(p)) || path.resolve(__dirname, '..', '..', '..', 'admin'),
};

module.exports = config;
