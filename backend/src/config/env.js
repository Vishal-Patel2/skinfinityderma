const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const get = (key, fallback) =>
  process.env[key] !== undefined && process.env[key] !== '' ? process.env[key] : fallback;

const nodeEnv = get('NODE_ENV', 'development');

const config = {
  nodeEnv,
  isProd: nodeEnv === 'production',
  port: parseInt(get('PORT', '4000'), 10),
  db: {
    host: get('DB_HOST', '127.0.0.1'),
    port: parseInt(get('DB_PORT', '3306'), 10),
    user: get('DB_USER', 'root'),
    password: get('DB_PASSWORD', ''),
    database: get('DB_NAME', 'skinfinity_derma'),
  },
  jwt: {
    secret: get('JWT_SECRET', 'dev-only-secret-change-me'),
    expiresIn: get('JWT_EXPIRES_IN', '12h'),
  },
  corsOrigins: get('CORS_ORIGINS', 'http://localhost:3000')
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

if (config.isProd && config.jwt.secret.startsWith('dev-only')) {
  throw new Error('JWT_SECRET must be set in production');
}

module.exports = config;
