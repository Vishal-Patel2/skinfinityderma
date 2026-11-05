const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requirePermission } = require('../middleware/auth');
const { asyncHandler, HttpError } = require('../middleware/error');
const config = require('../config/env');
const { query, one } = require('../config/db');
const { parseJson } = require('../utils/helpers');

const router = express.Router();

const uploadDir = config.uploadsDir;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Treatments subfolder
const treatmentsDir = path.join(uploadDir, 'treatments');
if (!fs.existsSync(treatmentsDir)) {
  fs.mkdirSync(treatmentsDir, { recursive: true });
}

/**
 * Safe file deletion helper to physically remove an uploaded file from disk.
 * Returns true if deleted, false otherwise.
 */
function deleteUploadedFile(fileUrlOrPath) {
  if (!fileUrlOrPath || typeof fileUrlOrPath !== 'string') return false;

  let rel = fileUrlOrPath.trim();
  if (rel.startsWith('http://') || rel.startsWith('https://')) {
    try {
      const parsed = new URL(rel);
      rel = parsed.pathname;
    } catch (e) {
      return false;
    }
  }

  // Only remove files within /uploads/
  if (rel.startsWith('/uploads/')) {
    rel = rel.replace(/^\/uploads\//, '');
  } else if (rel.startsWith('uploads/')) {
    rel = rel.replace(/^uploads\//, '');
  } else {
    // Ignore static /images/ or external URLs
    return false;
  }

  // Prevent path traversal
  const safeRel = path.normalize(rel).replace(/^(\.\.[\/\\])+/, '');
  const absPath = path.join(uploadDir, safeRel);

  // Security check: Must reside within uploadDir
  const normalizedUploadDir = path.normalize(uploadDir);
  const normalizedAbsPath = path.normalize(absPath);
  if (!normalizedAbsPath.startsWith(normalizedUploadDir)) {
    console.warn('⚠️ Path traversal attempt blocked for delete:', fileUrlOrPath);
    return false;
  }

  if (fs.existsSync(normalizedAbsPath)) {
    try {
      fs.unlinkSync(normalizedAbsPath);
      console.log('🗑️ Physically deleted file from uploads folder:', normalizedAbsPath);
      return true;
    } catch (err) {
      console.error('❌ Failed to unlink file:', normalizedAbsPath, err.message);
      return false;
    }
  }
  return false;
}

/**
 * Removes an image reference from sid_treatments database columns
 */
async function removeImageFromTreatment(treatmentId, targetPath) {
  if (!treatmentId || !targetPath) return;
  const t = await one(
    'SELECT id, banner_image, sub_image_1, sub_image_2, sub_image_3, gallery_images FROM sid_treatments WHERE id = ?',
    [treatmentId]
  );
  if (!t) return;

  const banner = t.banner_image === targetPath ? null : t.banner_image;
  const sub1 = t.sub_image_1 === targetPath ? null : t.sub_image_1;
  const sub2 = t.sub_image_2 === targetPath ? null : t.sub_image_2;
  const sub3 = t.sub_image_3 === targetPath ? null : t.sub_image_3;

  let gallery = parseJson(t.gallery_images, []);
  if (Array.isArray(gallery)) {
    gallery = gallery.filter((g) => {
      const src = g && typeof g === 'object' ? g.src : g;
      return src !== targetPath;
    });
  }

  await query(
    `UPDATE sid_treatments
        SET banner_image = ?, sub_image_1 = ?, sub_image_2 = ?, sub_image_3 = ?, gallery_images = ?
      WHERE id = ?`,
    [
      banner,
      sub1,
      sub2,
      sub3,
      gallery.length ? JSON.stringify(gallery) : null,
      treatmentId,
    ]
  );
  console.log(`✅ Removed image reference from treatment #${treatmentId}:`, targetPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = (req.query.folder || (req.body && req.body.folder) || '').replace(/[^a-z0-9_-]/gi, '');
    let target = uploadDir;
    if (folder) {
      target = path.join(uploadDir, folder);
      if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
      }
    }
    cb(null, target);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e4)}`;

    const treatmentId = req.query.treatmentId || (req.body && req.body.treatmentId);
    let prefix = '';
    if (treatmentId) {
      prefix = `treatment-${treatmentId}-`;
    } else if (req.query.folder === 'treatments' || (req.body && req.body.folder === 'treatments')) {
      prefix = 'treatment-';
    }

    cb(null, `${prefix}${cleanBase}-${unique}${ext}`);
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
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter,
});

/**
 * POST /api/upload
 */
router.post(
  '/',
  requirePermission('media.create'),
  upload.any(),
  asyncHandler(async (req, res) => {
    const file = req.files && req.files.length ? req.files[0] : req.file;
    if (!file) throw new HttpError(400, 'No file uploaded');

    const folder = (req.query.folder || (req.body && req.body.folder) || '').replace(/[^a-z0-9_-]/gi, '');
    const relativeUrl = folder ? `/uploads/${folder}/${file.filename}` : `/uploads/${file.filename}`;
    const absoluteUrl = `${config.publicBaseUrl}${relativeUrl}`;

    res.json({
      success: true,
      url: relativeUrl,
      absoluteUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
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

    const folder = (req.query.folder || (req.body && req.body.folder) || '').replace(/[^a-z0-9_-]/gi, '');
    const files = req.files.map((f) => {
      const rel = folder ? `/uploads/${folder}/${f.filename}` : `/uploads/${f.filename}`;
      return {
        url: rel,
        absoluteUrl: `${config.publicBaseUrl}${rel}`,
        filename: f.filename,
        originalName: f.originalname,
        size: f.size,
      };
    });

    res.json({ success: true, data: files });
  })
);

/**
 * POST /api/upload/delete
 * Physically deletes an uploaded file from disk and updates DB reference if treatmentId is provided.
 */
router.post(
  '/delete',
  requirePermission('media.delete'),
  asyncHandler(async (req, res) => {
    const { url, filePath, filename, treatmentId } = req.body;
    const targetPath = url || filePath || filename;
    if (!targetPath) throw new HttpError(400, 'File path or URL is required');

    const deletedFromDisk = deleteUploadedFile(targetPath);

    if (treatmentId) {
      await removeImageFromTreatment(treatmentId, targetPath);
    }

    res.json({
      success: true,
      message: 'File deleted from server folder and treatment reference updated',
      deletedFromDisk,
    });
  })
);

module.exports = router;
module.exports.deleteUploadedFile = deleteUploadedFile;
module.exports.removeImageFromTreatment = removeImageFromTreatment;
