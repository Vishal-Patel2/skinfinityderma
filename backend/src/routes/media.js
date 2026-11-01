const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query, one } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');
const config = require('../config/env');

const router = express.Router();

const uploadDir = config.uploadsDir;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    cb(null, `${cleanBase}-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.mp4', '.mov'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new HttpError(400, 'Unsupported media format. Allowed: JPG, PNG, WEBP, SVG, GIF, MP4.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter,
});

/**
 * GET /api/media
 * Search and paginate media files
 */
router.get(
  '/',
  requirePermission('media.view'),
  asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 50 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const where = ['1=1'];
    const params = [];

    if (q) {
      where.push('(filename LIKE ? OR original_name LIKE ? OR alt_text LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    const countRow = await one(
      `SELECT COUNT(*) AS total FROM sid_media_files WHERE ${where.join(' AND ')}`,
      params
    );

    const rows = await query(
      `SELECT * FROM sid_media_files WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), offset]
    );

    res.json({
      success: true,
      total: countRow.total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      data: rows.map((m) => ({
        id: String(m.id),
        filename: m.filename,
        originalName: m.original_name,
        url: m.url,
        absoluteUrl: m.url.startsWith('http') ? m.url : `${config.publicBaseUrl}${m.url}`,
        mimeType: m.mime_type,
        sizeBytes: m.size_bytes,
        sizeFormatted: (m.size_bytes / 1024).toFixed(1) + ' KB',
        altText: m.alt_text || '',
        createdAt: m.created_at,
      })),
    });
  })
);

/**
 * POST /api/media/upload
 */
router.post(
  '/upload',
  requirePermission('media.create'),
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new HttpError(400, 'No file provided');

    const relativeUrl = `/uploads/${req.file.filename}`;
    const altText = req.body.altText || req.file.originalname.replace(/[-_]/g, ' ');

    const r = await query(
      `INSERT INTO sid_media_files (filename, original_name, url, mime_type, size_bytes, alt_text, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.file.filename,
        req.file.originalname,
        relativeUrl,
        req.file.mimetype,
        req.file.size,
        altText,
        req.user?.id || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: String(r.insertId),
        url: relativeUrl,
        absoluteUrl: `${config.publicBaseUrl}${relativeUrl}`,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        altText,
      },
    });
  })
);

/**
 * PUT /api/media/:id
 */
router.put(
  '/:id',
  requirePermission('media.create'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { altText } = req.body;

    await query('UPDATE sid_media_files SET alt_text = ? WHERE id = ?', [altText || null, id]);
    res.json({ success: true, message: 'Media metadata updated successfully' });
  })
);

/**
 * DELETE /api/media/:id
 */
router.delete(
  '/:id',
  requirePermission('media.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const fileRow = await one('SELECT * FROM sid_media_files WHERE id = ?', [id]);
    if (!fileRow) throw new HttpError(404, 'File not found');

    const filePath = path.join(uploadDir, fileRow.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn('Could not unlink local file:', err.message);
      }
    }

    await query('DELETE FROM sid_media_files WHERE id = ?', [id]);

    await audit(req, {
      action: 'delete',
      entity: 'media',
      entityId: id,
      summary: `Deleted media file: ${fileRow.filename}`,
    });

    res.json({ success: true, message: 'Media file removed successfully' });
  })
);

module.exports = router;
