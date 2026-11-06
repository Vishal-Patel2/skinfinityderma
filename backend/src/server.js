const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const config = require('./config/env');
const { pool } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error');

const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const rolesRoutes = require('./routes/roles');
const appointmentsRoutes = require('./routes/appointments');
const patientsRoutes = require('./routes/patients');
const enquiriesRoutes = require('./routes/enquiries');
const blogsRoutes = require('./routes/blogs');
const mediaRoutes = require('./routes/media');
const notificationsRoutes = require('./routes/notifications');
const couponsRoutes = require('./routes/coupons');
const uploadRoutes = require('./routes/upload');
const cartRoutes = require('./routes/cart');
const adminCrudRoutes = require('./routes/admin-crud');

const app = express();

// Security & Performance
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(compression());

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      const isAllowed =
        config.corsOrigins.includes(origin) ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1');
      if (isAllowed) return callback(null, true);
      return callback(null, true); // Dev convenience
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static uploads directory
if (!fs.existsSync(config.uploadsDir)) {
  fs.mkdirSync(config.uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(config.uploadsDir, { maxAge: '1d' }));

// Static frontend public directory for images, banners, icons
const frontendPublicDir = [
  path.resolve(__dirname, '../../frontend/public'),
  path.resolve(process.cwd(), 'frontend/public'),
  path.resolve(process.cwd(), 'public'),
].find((p) => fs.existsSync(p));
if (frontendPublicDir) {
  app.use(express.static(frontendPublicDir));
  const imagesDir = path.join(frontendPublicDir, 'images');
  if (fs.existsSync(imagesDir)) {
    app.use('/images', express.static(imagesDir));
  }
}

// Resilient fallback for /uploads (recovers from legacy subfolder / root naming differences)
app.use('/uploads', (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();

  const reqRelPath = decodeURIComponent(req.path.replace(/^\/+/, ''));
  const filename = path.basename(reqRelPath);
  if (!filename || !filename.includes('.')) return next();

  // Search candidate locations on disk
  const candidates = [
    path.join(config.uploadsDir, filename),
    path.join(config.uploadsDir, 'banners', filename),
    path.join(config.uploadsDir, 'banners', 'desktop', filename),
    path.join(config.uploadsDir, 'banners', 'mobile', filename),
    path.join(config.uploadsDir, 'treatments', filename),
    path.join(config.uploadsDir, 'doctors', filename),
    path.join(config.uploadsDir, 'offers', filename),
    path.join(config.uploadsDir, 'blogs', filename),
    path.join(config.uploadsDir, 'gallery', filename),
    path.join(config.uploadsDir, 'website', filename),
    path.join(config.uploadsDir, 'patients', 'before-after', filename),
    path.join(config.uploadsDir, 'patients', 'documents', filename),
  ];

  if (frontendPublicDir) {
    candidates.push(
      path.join(frontendPublicDir, 'uploads', filename),
      path.join(frontendPublicDir, 'images', filename),
      path.join(frontendPublicDir, 'images', 'banners', filename),
      path.join(frontendPublicDir, 'images', 'treatments', filename),
      path.join(frontendPublicDir, 'images', 'doctors', filename)
    );
  }

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.sendFile(candidate);
      }
    } catch {
      // Ignore filesystem permission or parsing error
    }
  }

  next();
});

// Static Admin Dashboard Panel (served at root and at /admin)
if (fs.existsSync(config.adminDir)) {
  app.use(express.static(config.adminDir));
  app.use('/admin', express.static(config.adminDir));
}

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', time: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'error', database: err.message });
  }
});

// API Routes
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', adminCrudRoutes);

// Fallback for Admin SPA or HTML pages
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.includes('.')) {
    return next();
  }
  const adminIndex = path.join(config.adminDir, 'index.html');
  if (fs.existsSync(adminIndex)) {
    return res.sendFile(adminIndex);
  }
  next();
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start Server
if (require.main === module) {
  app.listen(config.port, () => {
    console.log('================================================================');
    console.log(` 🩺 Skinfinity Derma Backend & Admin API Server Active!`);
    console.log(` 🌐 Server URL:        http://localhost:${config.port}`);
    console.log(` 🔗 Public REST API:   http://localhost:${config.port}/api/public/site`);
    console.log(` 🛡️ Admin Dashboard:   http://localhost:${config.port}/index.html`);
    console.log(` 📁 Uploads Directory: ${config.uploadsDir}`);
    console.log('================================================================');
  });
}

module.exports = app;
