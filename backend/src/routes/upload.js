const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requirePermission } = require('../middleware/auth');
const { asyncHandler, HttpError } = require('../middleware/error');
const config = require('../config/env');

const router = express.Router();

const uploadDir = config.uploadsDir;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    cb(null, `${cleanBase}-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new HttpError(400, 'Only image files (jpg, jpeg, png, webp, svg, gif) are allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

/**
 * POST /api/upload
 */
router.post(
  '/',
  requirePermission('media.create'),
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new HttpError(400, 'No file uploaded');

    const relativeUrl = `/uploads/${req.file.filename}`;
    const absoluteUrl = `${config.publicBaseUrl}${relativeUrl}`;

    res.json({
      success: true,
      url: relativeUrl,
      absoluteUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  })
);

/**
 * POST /api/upload/multiple
 */
router.post(
  '/multiple',
  requirePermission('media.create'),
  upload.array('files', 10),
  asyncHandler(async (req, res) => {
    if (!req.files || !req.files.length) throw new HttpError(400, 'No files uploaded');

    const files = req.files.map((f) => ({
      url: `/uploads/${f.filename}`,
      absoluteUrl: `${config.publicBaseUrl}/uploads/${f.filename}`,
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
    }));

    res.json({ success: true, data: files });
  })
);

module.exports = router;
