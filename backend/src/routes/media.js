const express = require('express');
const path = require('path');
const fs = require('fs');
const { query, one } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');
const config = require('../config/env');
const {
  uploadsRoot,
  deleteManagedFile,
  uploadMiddleware,
  formatUploadResponse,
  recordMediaMetadata,
} = require('../services/imageStorageService');
const { scanStorageAudit } = require('../utils/safe-media');

const router = express.Router();

/**
 * GET /api/media/storage-audit
 * Returns physical disk storage statistics, module breakdown, and orphan files.
 */
router.get(
  '/storage-audit',
  requirePermission('media.view'),
  asyncHandler(async (req, res) => {
    const auditData = await scanStorageAudit();
    res.json({
      success: true,
      data: auditData,
    });
  })
);

/**
 * POST /api/media/cleanup-orphans
 * Safely removes confirmed orphan physical files from disk.
 */
router.post(
  '/cleanup-orphans',
  requirePermission('media.delete'),
  asyncHandler(async (req, res) => {
    const { filePaths } = req.body; // Array of relPaths or null to clean all
    const auditData = await scanStorageAudit();
    const targets = Array.isArray(filePaths) && filePaths.length > 0
      ? auditData.orphanFiles.filter((f) => filePaths.includes(f.relPath) || filePaths.includes(f.url))
      : auditData.orphanFiles;

    let deletedCount = 0;
    let freedBytes = 0;
    const failures = [];

    for (const target of targets) {
      try {
        const delRes = await safeDeleteFile(target.url, { force: true });
        if (delRes.success) {
          deletedCount++;
          freedBytes += target.sizeBytes;
        } else {
          failures.push({ file: target.name, reason: delRes.reason });
        }
      } catch (err) {
        failures.push({ file: target.name, reason: err.message });
      }
    }

    await audit(req, {
      action: 'cleanup',
      entity: 'media_storage',
      summary: `Cleaned up ${deletedCount} orphan files (${(freedBytes / 1024).toFixed(1)} KB freed)`,
    });

    res.json({
      success: true,
      message: `Cleaned up ${deletedCount} orphan files`,
      deletedCount,
      freedBytes,
      freedFormatted: freedBytes > 1048576 
        ? `${(freedBytes / 1048576).toFixed(2)} MB` 
        : `${(freedBytes / 1024).toFixed(1)} KB`,
      failures,
    });
  })
);

/**
 * GET /api/media
 * Search and paginate media files with module & fileType filters
 */
router.get(
  '/',
  requirePermission('media.view'),
  asyncHandler(async (req, res) => {
    const { q, module: modFilter, fileType, page = 1, limit = 50 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const where = ['1=1'];
    const params = [];

    if (q) {
      where.push('(filename LIKE ? OR original_name LIKE ? OR alt_text LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (modFilter && modFilter !== 'all') {
      where.push('(url LIKE ? OR filename LIKE ?)');
      params.push(`%/uploads/${modFilter}/%`, `${modFilter}%`);
    }

    if (fileType && fileType !== 'all') {
      if (fileType === 'image') {
        where.push('mime_type LIKE "image/%"');
      } else if (fileType === 'video') {
        where.push('mime_type LIKE "video/%"');
      } else if (fileType === 'document') {
        where.push('(mime_type LIKE "%pdf%" OR mime_type LIKE "%document%" OR mime_type LIKE "%sheet%")');
      }
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
      data: rows.map((m) => {
        const isDoc = (m.mime_type || '').includes('pdf') || (m.filename || '').endsWith('.pdf');
        const isVid = (m.mime_type || '').startsWith('video/');
        return {
          id: String(m.id),
          filename: m.filename,
          originalName: m.original_name,
          url: m.url,
          absoluteUrl: m.url.startsWith('http') ? m.url : `${config.publicBaseUrl}${m.url}`,
          mimeType: m.mime_type,
          fileType: isVid ? 'video' : (isDoc ? 'document' : 'image'),
          sizeBytes: m.size_bytes,
          sizeFormatted: m.size_bytes > 1048576 
            ? `${(m.size_bytes / 1048576).toFixed(2)} MB` 
            : `${(m.size_bytes / 1024).toFixed(1)} KB`,
          altText: m.alt_text || '',
          createdAt: m.created_at,
        };
      }),
    });
  })
);

/**
 * POST /api/media/upload
 */
router.post(
  '/upload',
  requirePermission('media.create'),
  uploadMiddleware.any(),
  asyncHandler(async (req, res) => {
    const file = req.files && req.files.length ? req.files[0] : req.file;
    if (!file) throw new HttpError(400, 'No file provided');

    const formatted = formatUploadResponse(file, req);
    const altText = req.body.altText || formatted.originalName.replace(/[-_]/g, ' ');

    const mediaId = await recordMediaMetadata(
      {
        filename: formatted.filename,
        originalName: formatted.originalName,
        url: formatted.url,
        mimeType: formatted.mimeType,
        size: formatted.size,
        altText,
      },
      req.user?.id || null
    );

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: mediaId ? String(mediaId) : undefined,
        url: formatted.url,
        absoluteUrl: formatted.absoluteUrl,
        filename: formatted.filename,
        originalName: formatted.originalName,
        size: formatted.size,
        altText,
      },
      // Top-level aliases for backwards compatibility with diverse admin clients
      url: formatted.url,
      absoluteUrl: formatted.absoluteUrl,
      fileUrl: formatted.url,
      filename: formatted.filename,
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
 * Safe database-to-folder synchronized deletion.
 */
router.delete(
  '/:id',
  requirePermission('media.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const fileRow = await one('SELECT * FROM sid_media_files WHERE id = ?', [id]);
    if (!fileRow) throw new HttpError(404, 'File not found');

    const result = await deleteManagedFile(fileRow.url, { force: req.query.force === 'true' });
    if (!result.success && result.reason && result.reason.includes('actively referenced')) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete: this file is actively used by other clinical or catalog items.',
        references: result.references,
      });
    }

    await query('DELETE FROM sid_media_files WHERE id = ?', [id]);

    await audit(req, {
      action: 'delete',
      entity: 'media',
      entityId: id,
      summary: `Deleted media file: ${fileRow.filename}`,
    });

    res.json({ success: true, message: 'Media file removed successfully from database and server storage.' });
  })
);

module.exports = router;
