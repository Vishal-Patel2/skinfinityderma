const path = require('path');
const fs = require('fs');
const multer = require('multer');
const config = require('../config/env');
const { query, one } = require('../config/db');

// Root uploads directory from configuration (e.g. Render Persistent Disk mount or local ./uploads)
const uploadsRoot = path.resolve(config.uploadsDir);

// Standardized core category folders
const ALLOWED_CATEGORIES = [
  'banners',
  'treatments',
  'doctors',
  'blogs',
  'offers',
  'gallery',
  'patients',
  'website',
];

/**
 * Ensure the uploads and primary category directories exist on disk
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
      } catch {}
    }
  }
}

// Ensure directories on module load
ensureDirectories();

/**
 * Sanitize category/folder string
 */
function sanitizeCategory(folder) {
  if (!folder || typeof folder !== 'string') return '';
  const clean = folder
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-z0-9_\-\/]/gi, '')
    .toLowerCase();

  const root = clean.split('/')[0];
  const matched = ALLOWED_CATEGORIES.find((c) => c === root || c === clean);
  return matched || root || '';
}

/**
 * Generate a clean, unique filename without prepending folder/category names
 */
function generateFilename(originalName) {
  const ext = path.extname(originalName || '').toLowerCase() || '.jpg';
  const rawBase = path.basename(originalName || 'image', ext);
  const cleanBase = rawBase
    .replace(/[^a-z0-9_-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'image';

  const timestamp = Date.now();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `${cleanBase}-${timestamp}-${rand}${ext}`;
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
  const { deleteFromMediaTable = true } = options;

  if (!fileUrlOrPath || typeof fileUrlOrPath !== 'string') {
    return { success: false, reason: 'Empty path', path: fileUrlOrPath };
  }

  // If it's an external URL (not our local host / domain) or static asset, skip disk deletion
  if (
    fileUrlOrPath.startsWith('http://') ||
    fileUrlOrPath.startsWith('https://') ||
    fileUrlOrPath.startsWith('/images/') ||
    fileUrlOrPath.startsWith('images/') ||
    fileUrlOrPath.startsWith('data:')
  ) {
    try {
      const parsed = new URL(fileUrlOrPath);
      if (parsed.pathname.includes('/uploads/')) {
        fileUrlOrPath = path.basename(parsed.pathname);
      } else {
        return { success: false, reason: 'External or static asset', path: fileUrlOrPath };
      }
    } catch {
      return { success: false, reason: 'External or static asset', path: fileUrlOrPath };
    }
  }

  const filename = path.basename(fileUrlOrPath.trim());
  if (!filename || !filename.includes('.')) {
    return { success: false, reason: 'Invalid filename', path: fileUrlOrPath };
  }

  // Candidate locations on disk
  const candidates = [
    path.join(uploadsRoot, filename),
    path.join(uploadsRoot, 'banners', filename),
    path.join(uploadsRoot, 'banners', 'desktop', filename),
    path.join(uploadsRoot, 'banners', 'mobile', filename),
    path.join(uploadsRoot, 'treatments', filename),
    path.join(uploadsRoot, 'doctors', filename),
    path.join(uploadsRoot, 'offers', filename),
    path.join(uploadsRoot, 'blogs', filename),
    path.join(uploadsRoot, 'gallery', filename),
    path.join(uploadsRoot, 'patients', filename),
    path.join(uploadsRoot, 'articles', filename),
  ];

  const safeRel = normalizeToUploadRel(fileUrlOrPath);
  if (safeRel) {
    candidates.unshift(path.join(uploadsRoot, safeRel));
  }

  let fileUnlinked = false;
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        fs.unlinkSync(candidate);
        fileUnlinked = true;
        console.log('🗑️ Physically deleted file from folder:', candidate);
      }
    } catch (err) {
      console.warn('Could not delete candidate file:', candidate, err.message);
    }
  }

  if (deleteFromMediaTable) {
    try {
      await query('DELETE FROM sid_media_files WHERE filename = ? OR url LIKE ?', [
        filename,
        `%${filename}%`,
      ]);
    } catch {
      // Ignore
    }
  }

  return { success: fileUnlinked, fileUnlinked, filename };
}

/**
 * Multer Storage Engine configured for category folders
 * Saves banner images into uploads/banners/, treatment images into uploads/treatments/, etc.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const rawFolder = req.query.folder || (req.body && req.body.folder) || '';
    const category = sanitizeCategory(rawFolder);

    let targetDir = uploadsRoot;
    if (category) {
      targetDir = path.join(uploadsRoot, category);
    }
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    file.targetCategory = category;
    file.targetDir = targetDir;
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const filename = generateFilename(file.originalname);
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
  const filename = file.filename;
  const relCategory = file.targetCategory || '';
  const relativeUrl = relCategory
    ? `/uploads/${relCategory}/${filename}`
    : `/uploads/${filename}`;
  const absoluteUrl = getAbsolutePublicUrl(relativeUrl);

  return {
    success: true,
    filename: filename,
    url: filename, // Returns pure filename for database storage
    category: relCategory,
    relativeUrl: relativeUrl,
    absoluteUrl: absoluteUrl,
    originalName: file.originalname,
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
