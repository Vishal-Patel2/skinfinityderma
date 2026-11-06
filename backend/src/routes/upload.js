const express = require('express');
const { requirePermission } = require('../middleware/auth');
const { asyncHandler, HttpError } = require('../middleware/error');
const config = require('../config/env');
const { query, one } = require('../config/db');
const { parseJson } = require('../utils/helpers');
const {
  uploadMiddleware,
  formatUploadResponse,
  recordMediaMetadata,
  deleteManagedFile,
} = require('../services/imageStorageService');

const router = express.Router();

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

/**
 * POST /api/upload
 * Single file upload. Accepts 'file', 'image', or any field name.
 */
router.post(
  '/',
  requirePermission('media.create'),
  uploadMiddleware.any(),
  asyncHandler(async (req, res) => {
    const file = req.files && req.files.length ? req.files[0] : req.file;
    if (!file) throw new HttpError(400, 'No file uploaded');

    const formatted = formatUploadResponse(file, req);

    // Record in media metadata table
    const mediaId = await recordMediaMetadata(
      {
        filename: formatted.filename,
        originalName: formatted.originalName,
        url: formatted.url,
        mimeType: formatted.mimeType,
        size: formatted.size,
        altText: req.body?.altText || formatted.originalName,
      },
      req.user?.id || null
    );

    res.json({
      ...formatted,
      id: mediaId ? String(mediaId) : undefined,
    });
  })
);

/**
 * POST /api/upload/multiple
 * Multiple files upload. Accepts 'files' or 'images'.
 */
router.post(
  '/multiple',
  requirePermission('media.create'),
  uploadMiddleware.any(),
  asyncHandler(async (req, res) => {
    const files = req.files;
    if (!files || !files.length) throw new HttpError(400, 'No files uploaded');

    const results = [];
    for (const f of files) {
      const formatted = formatUploadResponse(f, req);
      const mediaId = await recordMediaMetadata(
        {
          filename: formatted.filename,
          originalName: formatted.originalName,
          url: formatted.url,
          mimeType: formatted.mimeType,
          size: formatted.size,
          altText: formatted.originalName,
        },
        req.user?.id || null
      );
      results.push({
        ...formatted,
        id: mediaId ? String(mediaId) : undefined,
      });
    }

    res.json({ success: true, data: results });
  })
);

/**
 * POST /api/upload/delete
 * Safely deletes an uploaded file from disk and updates treatment references if provided.
 */
router.post(
  '/delete',
  requirePermission('media.delete'),
  asyncHandler(async (req, res) => {
    const { url, filePath, filename, treatmentId, force } = req.body;
    const targetPath = url || filePath || filename;
    if (!targetPath) throw new HttpError(400, 'File path or URL is required');

    const result = await deleteManagedFile(targetPath, { force: force === true });

    if (!result.success && result.reason && result.reason.includes('actively referenced')) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete: this file is actively used by other catalog items.',
        references: result.references,
      });
    }

    if (treatmentId) {
      await removeImageFromTreatment(treatmentId, targetPath);
    }

    res.json({
      success: true,
      message: 'File deleted from server storage',
      deletedFromDisk: result.fileUnlinked,
    });
  })
);

module.exports = router;
module.exports.deleteUploadedFile = deleteManagedFile;
module.exports.removeImageFromTreatment = removeImageFromTreatment;
