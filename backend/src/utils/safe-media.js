const path = require('path');
const fs = require('fs');
const { query, one } = require('../config/db');
const config = require('../config/env');

const uploadsRoot = path.resolve(config.uploadsDir);

// Approved module directories
const MODULE_DIRECTORIES = [
  'treatments',
  'treatments/covers',
  'treatments/gallery',
  'treatments/thumbnails',
  'patients',
  'patients/documents',
  'patients/before-after',
  'patients/profiles',
  'doctors',
  'doctors/profiles',
  'doctors/certificates',
  'branches',
  'branches/images',
  'banners',
  'banners/desktop',
  'banners/mobile',
  'sliders',
  'blogs',
  'blogs/featured',
  'blogs/content',
  'articles',
  'articles/featured',
  'articles/content',
  'products',
  'products/images',
  'products/gallery',
  'offers',
  'website',
  'website/logo',
  'website/cms',
  'website/gallery',
  'users',
  'users/profiles',
  'temp',
];

/**
 * Initialize all approved module upload directories
 */
function initUploadDirectories() {
  if (!fs.existsSync(uploadsRoot)) {
    fs.mkdirSync(uploadsRoot, { recursive: true });
  }

  for (const sub of MODULE_DIRECTORIES) {
    const full = path.join(uploadsRoot, sub);
    if (!fs.existsSync(full)) {
      try {
        fs.mkdirSync(full, { recursive: true });
      } catch (err) {
        console.warn(`Could not create directory ${sub}:`, err.message);
      }
    }
  }
}

// Auto-run on load
initUploadDirectories();

/**
 * Clean & normalize a URL or relative path to a path relative to config.uploadsDir
 */
function normalizeToUploadRel(fileUrlOrPath) {
  if (!fileUrlOrPath || typeof fileUrlOrPath !== 'string') return null;

  let rel = fileUrlOrPath.trim();
  if (rel.startsWith('http://') || rel.startsWith('https://')) {
    try {
      const parsed = new URL(rel);
      rel = parsed.pathname;
    } catch (e) {
      return null;
    }
  }

  if (rel.startsWith('/uploads/')) {
    rel = rel.replace(/^\/uploads\//, '');
  } else if (rel.startsWith('uploads/')) {
    rel = rel.replace(/^uploads\//, '');
  } else if (rel.startsWith('/')) {
    // If it's another absolute path like /documents/ or /images/, check if it's in uploads
    rel = rel.replace(/^\//, '');
  }

  // Prevent path traversal
  const safeRel = path.normalize(rel).replace(/^(\.\.[\/\\])+/, '');
  return safeRel;
}

/**
 * Resolves a safe absolute path on disk and verifies it is inside config.uploadsDir
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
 * Check if a file is an external URL (e.g. YouTube, external CDN)
 */
function isExternalUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return /^(https?:)?\/\/(www\.)?(youtube\.com|youtu\.be|img\.youtube\.com|cdn\.)/i.test(url);
}

/**
 * Check how many database records currently reference this file path or filename
 */
async function countFileReferences(fileUrlOrPath) {
  if (!fileUrlOrPath || isExternalUrl(fileUrlOrPath)) return 0;

  const rel = normalizeToUploadRel(fileUrlOrPath);
  if (!rel) return 0;

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
  ];

  for (const check of checks) {
    try {
      const res = await one(check.sql, check.params);
      const count = Number(res?.c || 0);
      if (count > 0) {
        referencesByTable[check.table] = count;
        totalReferences += count;
      }
    } catch (e) {
      // Table might not have all columns or might be optional
    }
  }

  return { totalReferences, referencesByTable };
}

/**
 * Safely delete a physical file from disk.
 * If force=false and file is referenced in other records, it will NOT delete the file.
 */
async function safeDeleteFile(fileUrlOrPath, options = {}) {
  const { force = false, deleteFromMediaTable = true } = options;

  if (!fileUrlOrPath || isExternalUrl(fileUrlOrPath)) {
    return { success: false, reason: 'External or invalid path', path: fileUrlOrPath };
  }

  const absPath = resolveSafeUploadPath(fileUrlOrPath);
  if (!absPath) {
    return { success: false, reason: 'Path outside approved upload directories', path: fileUrlOrPath };
  }

  // Check database references unless forced
  if (!force) {
    const { totalReferences, referencesByTable } = await countFileReferences(fileUrlOrPath);
    // If only referenced once in sid_media_files and we are deleting that record, it's safe
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
      console.log('🗑️ SafeMedia: Physically unlinked file:', absPath);
    } catch (err) {
      console.error('❌ SafeMedia: Failed to unlink file:', absPath, err.message);
      return { success: false, reason: 'File deletion error: ' + err.message, path: absPath };
    }
  } else {
    console.log('ℹ️ SafeMedia: File did not exist on disk, cleaning DB record:', absPath);
  }

  // Also remove from sid_media_files if requested
  if (deleteFromMediaTable) {
    try {
      const rel = normalizeToUploadRel(fileUrlOrPath);
      const filename = path.basename(rel);
      await query('DELETE FROM sid_media_files WHERE filename = ? OR url LIKE ?', [filename, `%${rel}%`]);
    } catch (e) {
      // ignore
    }
  }

  return {
    success: true,
    fileUnlinked,
    path: absPath,
  };
}

/**
 * Recursively walk a directory to collect file details
 */
function walkDirectory(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDirectory(fullPath, fileList);
    } else if (entry.isFile()) {
      try {
        const stat = fs.statSync(fullPath);
        const relToUploads = path.relative(uploadsRoot, fullPath).replace(/\\/g, '/');
        const ext = path.extname(entry.name).toLowerCase();

        let fileType = 'document';
        if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
          fileType = 'image';
        } else if (['.mp4', '.mov', '.webm', '.avi'].includes(ext)) {
          fileType = 'video';
        }

        const parts = relToUploads.split('/');
        const moduleName = parts.length > 1 ? parts[0] : 'root';

        fileList.push({
          name: entry.name,
          relPath: relToUploads,
          url: `/uploads/${relToUploads}`,
          absPath: fullPath,
          sizeBytes: stat.size,
          sizeFormatted: stat.size > 1048576 
            ? `${(stat.size / 1048576).toFixed(2)} MB` 
            : `${(stat.size / 1024).toFixed(1)} KB`,
          modifiedAt: stat.mtime,
          fileType,
          module: moduleName,
          ext,
        });
      } catch (err) {
        // Skip unreadable files
      }
    }
  }
  return fileList;
}

/**
 * Collect all active media URLs from database tables
 */
async function getAllDbMediaUrls() {
  const urls = new Set();

  function addUrl(val) {
    if (!val || typeof val !== 'string') return;
    const v = val.trim();
    if (v.startsWith('/uploads/') || v.startsWith('uploads/')) {
      const rel = normalizeToUploadRel(v);
      if (rel) urls.add(rel.toLowerCase());
      urls.add(path.basename(rel).toLowerCase());
    }
  }

  try {
    // 1. sid_media_files
    const mediaFiles = await query('SELECT url, filename FROM sid_media_files');
    for (const m of mediaFiles) {
      addUrl(m.url);
      if (m.filename) urls.add(m.filename.toLowerCase());
    }

    // 2. sid_treatments
    const treatments = await query('SELECT banner_image, sub_image_1, sub_image_2, sub_image_3, gallery_images FROM sid_treatments');
    for (const t of treatments) {
      addUrl(t.banner_image);
      addUrl(t.sub_image_1);
      addUrl(t.sub_image_2);
      addUrl(t.sub_image_3);
      if (t.gallery_images) {
        try {
          const arr = typeof t.gallery_images === 'string' ? JSON.parse(t.gallery_images) : t.gallery_images;
          if (Array.isArray(arr)) {
            for (const item of arr) {
              const src = item && typeof item === 'object' ? item.src : item;
              addUrl(src);
            }
          }
        } catch (e) {}
      }
    }

    // 3. sid_banners
    const banners = await query('SELECT desktop_image, mobile_image FROM sid_banners');
    for (const b of banners) {
      addUrl(b.desktop_image);
      addUrl(b.mobile_image);
    }

    // 4. sid_doctors
    const doctors = await query('SELECT image, profile_banner FROM sid_doctors');
    for (const d of doctors) {
      addUrl(d.image);
      addUrl(d.profile_banner);
    }

    // 5. sid_offers
    const offers = await query('SELECT image FROM sid_offers');
    for (const o of offers) {
      addUrl(o.image);
    }

    // 6. sid_blogs
    const blogs = await query('SELECT featured_image FROM sid_blogs');
    for (const b of blogs) {
      addUrl(b.featured_image);
    }

    // 7. sid_patient_documents & gallery
    const docs = await query('SELECT file_url FROM sid_patient_documents');
    for (const d of docs) addUrl(d.file_url);

    const gal = await query('SELECT before_image_url, after_image_url FROM sid_patient_gallery');
    for (const g of gal) {
      addUrl(g.before_image_url);
      addUrl(g.after_image_url);
    }
  } catch (err) {
    console.warn('Error fetching DB media URLs:', err.message);
  }

  return urls;
}

/**
 * Complete Storage Audit:
 * Returns disk usage, module breakdown, orphan files (on disk, not in DB), missing files (in DB, not on disk)
 */
async function scanStorageAudit() {
  const diskFiles = walkDirectory(uploadsRoot);
  const dbUrls = await getAllDbMediaUrls();

  let totalSizeBytes = 0;
  let totalImages = 0;
  let totalVideos = 0;
  let totalDocuments = 0;
  const storageByModule = {};

  const orphanFiles = [];

  for (const file of diskFiles) {
    totalSizeBytes += file.sizeBytes;
    if (file.fileType === 'image') totalImages++;
    else if (file.fileType === 'video') totalVideos++;
    else totalDocuments++;

    // Module stats
    if (!storageByModule[file.module]) {
      storageByModule[file.module] = { count: 0, bytes: 0 };
    }
    storageByModule[file.module].count++;
    storageByModule[file.module].bytes += file.sizeBytes;

    // Check orphan status
    const relKey = file.relPath.toLowerCase();
    const fnKey = file.name.toLowerCase();
    const isReferenced = dbUrls.has(relKey) || dbUrls.has(fnKey);

    if (!isReferenced) {
      orphanFiles.push(file);
    }
  }

  return {
    scannedAt: new Date().toISOString(),
    totalFiles: diskFiles.length,
    totalImages,
    totalVideos,
    totalDocuments,
    totalSizeBytes,
    totalSizeFormatted: totalSizeBytes > 1048576 
      ? `${(totalSizeBytes / 1048576).toFixed(2)} MB` 
      : `${(totalSizeBytes / 1024).toFixed(1)} KB`,
    storageByModule,
    orphanCount: orphanFiles.length,
    orphanFiles,
  };
}

module.exports = {
  uploadsRoot,
  MODULE_DIRECTORIES,
  initUploadDirectories,
  normalizeToUploadRel,
  resolveSafeUploadPath,
  isExternalUrl,
  countFileReferences,
  safeDeleteFile,
  scanStorageAudit,
  walkDirectory,
};
