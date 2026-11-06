const path = require('path');
const fs = require('fs');
const multer = require('multer');
const config = require('../config/env');
const { query, one } = require('../config/db');

// Root uploads directory from configuration (e.g. Render Persistent Disk mount or local ./uploads)
const uploadsRoot = path.resolve(config.uploadsDir);

// Standardized categories
const ALLOWED_CATEGORIES = [
  'banners',
  'banners/desktop',
  'banners/mobile',
  'treatments',
  'treatments/covers',
  'treatments/gallery',
  'treatments/thumbnails',
  'doctors',
  'doctors/profiles',
  'doctors/certificates',
  'blogs',
  'blogs/featured',
  'blogs/content',
  'articles',
  'products',
  'offers',
  'gallery',
  'patients',
  'patients/before-after',
  'patients/documents',
  'patients/profiles',
  'branches',
  'website',
  'website/logo',
  'users',
  'temp',
];

/**
 * Ensure all approved upload directories exist on disk
 */
function ensureDirectories() {
  if (!fs.existsSync(uploadsRoot)) {
    fs.mkdirSync(uploadsRoot, { recursive: true });
  }
  for (const cat of ALLOWED_CATEGORIES) {
    const full = path.join(uploadsRoot, cat);
    if (!fs.existsSync(full)) {
      try {
        fs.mkdirSync(full, { recursive: true });
      } catch (err) {
        console.warn(`Could not create category directory ${cat}:`, err.message);
      }
    }
  }
}

// Ensure directories on module load
ensureDirectories();

/**
 * Sanitize and validate category/folder
 */
function sanitizeCategory(folder) {
  if (!folder || typeof folder !== 'string') return '';
  const clean = folder
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-z0-9_\-\/]/gi, '')
    .toLowerCase();

  // If matches an allowed category prefix or exact match
  const matched = ALLOWED_CATEGORIES.find((c) => c === clean || clean.startsWith(c + '/'));
  return matched || clean;
}

/**
 * Generate a clean, sanitized and unique filename
 */
function generateFilename(originalName, prefix = '') {
  const ext = path.extname(originalName || '').toLowerCase() || '.jpg';
  const rawBase = path.basename(originalName || 'image', ext);
  const cleanBase = rawBase
    .replace(/[^a-z0-9_-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'image';

  const cleanPrefix = prefix
    ? prefix.replace(/[^a-z0-9_-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-'
    : '';

  const timestamp = Date.now();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `${cleanPrefix}${cleanBase}-${timestamp}-${rand}${ext}`;
}

/**
 * Normalize an image URL or relative path to a path relative to uploadsRoot
 */
function normalizeToUploadRel(fileUrlOrPath) {
  if (!fileUrlOrPath || typeof fileUrlOrPath !== 'string') return null;

  let rel = fileUrlOrPath.trim();
  if (rel.startsWith('http://') || rel.startsWith('https://')) {
    try {
      const parsed = new URL(rel);
      rel = parsed.pathname;
    } catch {
      return null;
    }
  }

  if (rel.startsWith('/uploads/')) {
    rel = rel.replace(/^\/uploads\//, '');
  } else if (rel.startsWith('uploads/')) {
    rel = rel.replace(/^uploads\//, '');
  } else if (rel.startsWith('/')) {
    rel = rel.replace(/^\//, '');
  }

  // Prevent path traversal
  const safeRel = path.normalize(rel).replace(/^(\.\.[\/\\])+/, '').replace(/\\/g, '/');
  return safeRel;
}

/**
 * Resolve absolute path on disk and verify it is strictly within uploadsRoot
 */
function resolveSafeUploadPath(fileUrlOrPath) {
  const safeRel = normalizeToUploadRel(fileUrlOrPath);
  if (!safeRel) return null;

  const absPath = path.join(uploadsRoot, safeRel);
  const normalizedRoot = path.normalize(uploadsRoot);
  const normalizedAbs = path.normalize(absPath);

  if (!normalizedAbs.startsWith(normalizedRoot)) {
    console.warn('⚠️ Path traversal attempt blocked:', fileUrlOrPath);
    return null;
  }

  return normalizedAbs;
}

/**
 * Generate public URL from relative uploads path
 */
function getPublicUrl(relPath) {
  if (!relPath) return '';
  if (relPath.startsWith('http://') || relPath.startsWith('https://')) {
    return relPath;
  }
  const clean = relPath.replace(/^\/+/, '').replace(/^uploads\/+/, '');
  return `/uploads/${clean}`;
}

/**
 * Generate absolute public HTTPS URL for external clients
 */
function getAbsolutePublicUrl(relPath) {
  if (!relPath) return '';
  if (relPath.startsWith('http://') || relPath.startsWith('https://')) {
    return relPath;
  }
  const rel = getPublicUrl(relPath);
  return `${config.publicBaseUrl}${rel}`;
}

/**
 * Check if URL is an external link (e.g. YouTube, external CDN)
 */
function isExternalUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return /^(https?:)?\/\/(www\.)?(youtube\.com|youtu\.be|img\.youtube\.com|cloudinary\.com|s3\.amazonaws\.com)/i.test(url);
}

/**
 * Count database references to prevent deleting shared media
 */
async function countFileReferences(fileUrlOrPath) {
  if (!fileUrlOrPath || isExternalUrl(fileUrlOrPath)) return { totalReferences: 0, referencesByTable: {} };

  const rel = normalizeToUploadRel(fileUrlOrPath);
  if (!rel) return { totalReferences: 0, referencesByTable: {} };

  const urlPattern = `%${rel}%`;
  const filename = path.basename(rel);
  const fnPattern = `%${filename}%`;

  let totalReferences = 0;
  const referencesByTable = {};

  const checks = [
    {
      table: 'sid_media_files',
      sql: 'SELECT COUNT(*) AS c FROM sid_media_files WHERE url LIKE ? OR filename = ?',
      params: [urlPattern, filename],
    },
    {
      table: 'sid_treatments',
      sql: `SELECT COUNT(*) AS c FROM sid_treatments 
            WHERE banner_image LIKE ? 
               OR sub_image_1 LIKE ? 
               OR sub_image_2 LIKE ? 
               OR sub_image_3 LIKE ? 
               OR gallery_images LIKE ?`,
      params: [urlPattern, urlPattern, urlPattern, urlPattern, fnPattern],
    },
    {
      table: 'sid_banners',
      sql: 'SELECT COUNT(*) AS c FROM sid_banners WHERE desktop_image LIKE ? OR mobile_image LIKE ?',
      params: [urlPattern, urlPattern],
    },
    {
      table: 'sid_doctors',
      sql: 'SELECT COUNT(*) AS c FROM sid_doctors WHERE image LIKE ? OR profile_banner LIKE ?',
      params: [urlPattern, urlPattern],
    },
    {
      table: 'sid_blogs',
      sql: 'SELECT COUNT(*) AS c FROM sid_blogs WHERE featured_image LIKE ?',
      params: [urlPattern],
    },
    {
      table: 'sid_offers',
      sql: 'SELECT COUNT(*) AS c FROM sid_offers WHERE image LIKE ?',
      params: [urlPattern],
    },
    {
      table: 'sid_patient_documents',
      sql: 'SELECT COUNT(*) AS c FROM sid_patient_documents WHERE file_url LIKE ?',
      params: [urlPattern],
    },
    {
      table: 'sid_patient_gallery',
      sql: 'SELECT COUNT(*) AS c FROM sid_patient_gallery WHERE before_image_url LIKE ? OR after_image_url LIKE ?',
      params: [urlPattern, urlPattern],
    },
    {
      table: 'sid_before_after_cases',
      sql: 'SELECT COUNT(*) AS c FROM sid_before_after_cases WHERE before_image LIKE ? OR after_image LIKE ?',
      params: [urlPattern, urlPattern],
    },
    {
      table: 'sid_services',
      sql: 'SELECT COUNT(*) AS c FROM sid_services WHERE image LIKE ?',
      params: [urlPattern],
    },
    {
      table: 'sid_homepage_items',
      sql: 'SELECT COUNT(*) AS c FROM sid_homepage_items WHERE image_url LIKE ?',
      params: [urlPattern],
    },
  ];

  for (const check of checks) {
    try {
      const res = await one(check.sql, check.params);
      const count = Number(res?.c || 0);
      if (count > 0) {
        referencesByTable[check.table] = count;
        totalReferences += count;
      }
    } catch {
      // Table or column might not exist or optional
    }
  }

  return { totalReferences, referencesByTable };
}

/**
 * Safely delete a physical file from disk
 */
async function deleteManagedFile(fileUrlOrPath, options = {}) {
  const { force = false, deleteFromMediaTable = true } = options;

  if (!fileUrlOrPath || isExternalUrl(fileUrlOrPath)) {
    return { success: false, reason: 'External or invalid path', path: fileUrlOrPath };
  }

  const absPath = resolveSafeUploadPath(fileUrlOrPath);
  if (!absPath) {
    return { success: false, reason: 'Path outside approved upload directories', path: fileUrlOrPath };
  }

  if (!force) {
    const { totalReferences, referencesByTable } = await countFileReferences(fileUrlOrPath);
    const otherReferences = totalReferences - (referencesByTable['sid_media_files'] ? 1 : 0);
    if (otherReferences > 0) {
      return {
        success: false,
        reason: 'File is actively referenced by other records',
        references: referencesByTable,
        path: fileUrlOrPath,
      };
    }
  }

  let fileUnlinked = false;
  if (fs.existsSync(absPath)) {
    try {
      fs.unlinkSync(absPath);
      fileUnlinked = true;
      console.log('🗑️ ImageStorageService: Physically deleted file:', absPath);
    } catch (err) {
      console.error('❌ ImageStorageService: Failed to delete file:', absPath, err.message);
      return { success: false, reason: 'Deletion error: ' + err.message, path: absPath };
    }
  }

  if (deleteFromMediaTable) {
    try {
      const rel = normalizeToUploadRel(fileUrlOrPath);
      const filename = path.basename(rel);
      await query('DELETE FROM sid_media_files WHERE filename = ? OR url LIKE ?', [filename, `%${rel}%`]);
    } catch {
      // Ignore
    }
  }

  return { success: true, fileUnlinked, path: absPath };
}

/**
 * Multer Storage Engine configured for ImageStorageService
 * Reads folder from req.query FIRST, then falls back to req.body.folder
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Priority: query param > route default > fallback treatments
    const rawFolder = req.query.folder || (req.body && req.body.folder) || '';
    const category = sanitizeCategory(rawFolder);

    let targetDir = uploadsRoot;
    if (category) {
      targetDir = path.join(uploadsRoot, category);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
    }
    // Store resolved target on file object so route handler knows exact subfolder
    file.targetCategory = category;
    file.targetDir = targetDir;
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const treatmentId = req.query.treatmentId || (req.body && req.body.treatmentId);
    let prefix = '';
    if (treatmentId) {
      prefix = `treatment-${treatmentId}`;
    } else if (file.targetCategory) {
      const parts = file.targetCategory.split('/');
      prefix = parts[parts.length - 1];
    }
    const filename = generateFilename(file.originalname, prefix);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExts = [
    '.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif',
    '.mp4', '.mov', '.webm',
    '.pdf', '.doc', '.docx'
  ];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type (${ext}). Allowed: JPG, PNG, WEBP, SVG, GIF, MP4, PDF.`));
  }
};

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter,
});

/**
 * Register file upload into sid_media_files metadata table
 */
async function recordMediaMetadata(fileInfo, userId = null) {
  try {
    const res = await query(
      `INSERT INTO sid_media_files (filename, original_name, url, mime_type, size_bytes, alt_text, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        fileInfo.filename,
        fileInfo.originalName || fileInfo.filename,
        fileInfo.url,
        fileInfo.mimeType || 'image/jpeg',
        fileInfo.size || 0,
        fileInfo.altText || fileInfo.originalName || '',
        userId,
      ]
    );
    return res.insertId;
  } catch (e) {
    console.warn('Could not record media metadata in sid_media_files:', e.message);
    return null;
  }
}

/**
 * Build unified response object for uploaded file
 */
function formatUploadResponse(file, req) {
  // If destination set targetCategory, use it; otherwise infer from path
  let relCategory = file.targetCategory;
  if (!relCategory) {
    const relFromUploads = path.relative(uploadsRoot, file.path).replace(/\\/g, '/');
    const parts = relFromUploads.split('/');
    relCategory = parts.length > 1 ? parts.slice(0, -1).join('/') : '';
  }

  const relativeUrl = relCategory
    ? `/uploads/${relCategory}/${file.filename}`
    : `/uploads/${file.filename}`;

  const absoluteUrl = getAbsolutePublicUrl(relativeUrl);

  return {
    success: true,
    url: relativeUrl,
    absoluteUrl,
    filename: file.filename,
    originalName: file.originalname,
    category: relCategory || 'general',
    size: file.size,
    mimeType: file.mimetype,
  };
}

module.exports = {
  uploadsRoot,
  ALLOWED_CATEGORIES,
  ensureDirectories,
  sanitizeCategory,
  generateFilename,
  normalizeToUploadRel,
  resolveSafeUploadPath,
  getPublicUrl,
  getAbsolutePublicUrl,
  isExternalUrl,
  countFileReferences,
  deleteManagedFile,
  uploadMiddleware,
  recordMediaMetadata,
  formatUploadResponse,
};
