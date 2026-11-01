const express = require('express');
const { query, one } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');
const { slugify } = require('../utils/slug');
const { parseJson } = require('../utils/helpers');

const router = express.Router();

/**
 * GET /api/blogs
 * Admin blogs list
 */
router.get(
  '/',
  requirePermission('blogs.view'),
  asyncHandler(async (req, res) => {
    const { q, category, isPublished } = req.query;
    const where = ['1=1'];
    const params = [];

    if (q) {
      where.push('(title LIKE ? OR excerpt LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }
    if (category) {
      where.push('category = ?');
      params.push(category);
    }
    if (isPublished !== undefined && isPublished !== '') {
      where.push('is_published = ?');
      params.push(isPublished === '1' || isPublished === 'true' ? 1 : 0);
    }

    const rows = await query(
      `SELECT * FROM sid_blogs WHERE ${where.join(' AND ')} ORDER BY created_at DESC`,
      params
    );

    res.json({
      success: true,
      data: rows.map((b) => ({
        id: String(b.id),
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        featuredImage: b.featured_image,
        category: b.category,
        authorName: b.author_name,
        tags: parseJson(b.tags, []),
        viewsCount: b.views_count,
        isPublished: Boolean(b.is_published),
        publishedAt: b.published_at,
        createdAt: b.created_at,
      })),
    });
  })
);

/**
 * GET /api/blogs/:id
 */
router.get(
  '/:id',
  requirePermission('blogs.view'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const b = await one('SELECT * FROM sid_blogs WHERE id = ?', [id]);
    if (!b) throw new HttpError(404, 'Article not found');

    res.json({
      success: true,
      data: {
        id: String(b.id),
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        featuredImage: b.featured_image,
        category: b.category,
        authorName: b.author_name,
        tags: parseJson(b.tags, []),
        viewsCount: b.views_count,
        isPublished: Boolean(b.is_published),
        publishedAt: b.published_at,
        createdAt: b.created_at,
      },
    });
  })
);

/**
 * POST /api/blogs
 */
router.post(
  '/',
  requirePermission('blogs.create'),
  asyncHandler(async (req, res) => {
    const { title, slug, excerpt, content, featuredImage, category, authorName, tags, metaTitle, metaDescription, metaKeywords, canonicalUrl, isPublished = 1 } = req.body;
    if (!title) throw new HttpError(400, 'Article title is required');

    const cleanSlug = slug ? slugify(slug) : slugify(title);
    const existing = await one('SELECT id FROM sid_blogs WHERE slug = ?', [cleanSlug]);
    if (existing) {
      throw new HttpError(409, `An article with slug "${cleanSlug}" already exists.`);
    }

    const r = await query(
      `INSERT INTO sid_blogs (
        slug, title, excerpt, content, featured_image, category, meta_title, meta_description, meta_keywords, canonical_url, author_name, tags, is_published, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanSlug,
        title.trim(),
        excerpt || null,
        content || null,
        featuredImage || '/images/treatments/banner-acne.webp',
        category || 'Dermatology Tips',
        metaTitle || null,
        metaDescription || null,
        metaKeywords || null,
        canonicalUrl || null,
        authorName || 'Dr. Ipshita Johri',
        tags ? JSON.stringify(Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : null,
        isPublished ? 1 : 0,
        isPublished ? new Date() : null,
      ]
    );

    await audit(req, {
      action: 'create',
      entity: 'blogs',
      entityId: r.insertId,
      summary: `Created clinical blog article: ${title}`,
    });

    res.status(201).json({
      success: true,
      message: 'Article published successfully',
      data: { id: String(r.insertId), slug: cleanSlug },
    });
  })
);

/**
 * PUT /api/blogs/:id
 */
router.put(
  '/:id',
  requirePermission('blogs.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, slug, excerpt, content, featuredImage, category, authorName, tags, metaTitle, metaDescription, metaKeywords, canonicalUrl, isPublished } = req.body;

    const existing = await one('SELECT * FROM sid_blogs WHERE id = ?', [id]);
    if (!existing) throw new HttpError(404, 'Article not found');

    const cleanSlug = slug ? slugify(slug) : existing.slug;

    await query(
      `UPDATE sid_blogs SET
         title = COALESCE(?, title),
         slug = ?,
         excerpt = COALESCE(?, excerpt),
         content = COALESCE(?, content),
         featured_image = COALESCE(?, featured_image),
         category = COALESCE(?, category),
         meta_title = COALESCE(?, meta_title),
         meta_description = COALESCE(?, meta_description),
         meta_keywords = COALESCE(?, meta_keywords),
         canonical_url = COALESCE(?, canonical_url),
         author_name = COALESCE(?, author_name),
         tags = COALESCE(?, tags),
         is_published = COALESCE(?, is_published),
         updated_at = NOW()
       WHERE id = ?`,
      [
        title || null,
        cleanSlug,
        excerpt !== undefined ? excerpt : existing.excerpt,
        content !== undefined ? content : existing.content,
        featuredImage !== undefined ? featuredImage : existing.featured_image,
        category || null,
        metaTitle !== undefined ? metaTitle : existing.meta_title,
        metaDescription !== undefined ? metaDescription : existing.meta_description,
        metaKeywords !== undefined ? metaKeywords : existing.meta_keywords,
        canonicalUrl !== undefined ? canonicalUrl : existing.canonical_url,
        authorName || null,
        tags ? JSON.stringify(Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : existing.tags,
        isPublished !== undefined ? (isPublished ? 1 : 0) : existing.is_published,
        id,
      ]
    );

    await audit(req, {
      action: 'update',
      entity: 'blogs',
      entityId: id,
      summary: `Updated article: ${existing.title}`,
    });

    res.json({ success: true, message: 'Article updated successfully' });
  })
);

/**
 * DELETE /api/blogs/:id
 */
router.delete(
  '/:id',
  requirePermission('blogs.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await one('SELECT title FROM sid_blogs WHERE id = ?', [id]);
    if (!existing) throw new HttpError(404, 'Article not found');

    await query('DELETE FROM sid_blogs WHERE id = ?', [id]);

    await audit(req, {
      action: 'delete',
      entity: 'blogs',
      entityId: id,
      summary: `Deleted article: ${existing.title}`,
    });

    res.json({ success: true, message: 'Article deleted successfully' });
  })
);

module.exports = router;
