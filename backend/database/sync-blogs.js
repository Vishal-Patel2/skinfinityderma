const db = require('./src/config/db');

async function syncBlogs() {
  console.log('Fetching live blogs from https://www.skinfinityderma.com/api/blogs ...');
  const res = await fetch('https://www.skinfinityderma.com/api/blogs', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const text = await res.text();
  const cleanJson = text.substring(0, text.lastIndexOf('}') + 1);
  const data = JSON.parse(cleanJson);
  const blogs = data.blogs || [];
  console.log(`Fetched ${blogs.length} blogs. Syncing into sid_blogs...`);

  let synced = 0;
  for (const b of blogs) {
    const slug = (b.url || b.blog_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
    const title = b.blog_name || 'Dermatology Insights';
    const excerpt = b.short_desc || (b.blog_description ? b.blog_description.replace(/<[^>]+>/g, '').slice(0, 220) : '');
    const content = b.blog_description || '';
    const coverImage = b.blog_image ? ('https://www.skinfinityderma.com/assets/blog/' + b.blog_image) : (b.blog_home_image ? ('https://www.skinfinityderma.com/assets/blog/' + b.blog_home_image) : null);
    const publishedAt = b.date ? (b.date + ' 10:00:00') : (b.creation_date || new Date().toISOString().slice(0, 19).replace('T', ' '));
    const tagsArr = b.tags ? b.tags.split(',').map(s => s.trim()).filter(Boolean) : [];
    const tagsJson = JSON.stringify(tagsArr);
    const category = tagsArr[0] || 'Skin & Hair Care';
    const author = b.reviewed_by || 'Dr. Ipshita Johri';
    const metaTitle = b.title_tag || b.blog_name || null;
    const metaDesc = b.description_tag || b.short_desc || null;
    const metaKeywords = b.keyword_tag || b.tags || null;
    const canonicalUrl = b.canonical_tag || null;

    await db.query(
      `INSERT INTO sid_blogs (slug, title, excerpt, content, featured_image, category, meta_title, meta_description, meta_keywords, canonical_url, author_name, tags, is_published, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         excerpt = VALUES(excerpt),
         content = VALUES(content),
         featured_image = VALUES(featured_image),
         category = VALUES(category),
         meta_title = VALUES(meta_title),
         meta_description = VALUES(meta_description),
         meta_keywords = VALUES(meta_keywords),
         canonical_url = VALUES(canonical_url),
         author_name = VALUES(author_name),
         tags = VALUES(tags),
         published_at = VALUES(published_at)`,
      [slug, title, excerpt, content, coverImage, category, metaTitle, metaDesc, metaKeywords, canonicalUrl, author, tagsJson, publishedAt]
    );
    synced++;
    if (synced % 50 === 0 || synced === blogs.length) {
      console.log(`Synced ${synced}/${blogs.length} blogs...`);
    }
  }
  console.log(`✓ All ${synced} blogs successfully synced into sid_blogs!`);
  process.exit(0);
}

syncBlogs().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
