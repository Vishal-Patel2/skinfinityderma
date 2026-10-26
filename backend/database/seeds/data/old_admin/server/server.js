const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static assets and frontend
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(path.join(__dirname, '..')));

// Helper to read DB
function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return {
      admin: {},
      settings: {},
      categories: [],
      concerns: [],
      doctors: [],
      treatments: [],
      banners: [],
      gallery: [],
      beforeAfter: [],
      googleReviewStats: { rating: 4.7, reviewCount: "2500+", writeReviewUrl: "" },
      googleReviews: [],
      videoTestimonials: []
    };
  }
}

// Helper to write DB
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing db.json:', err);
    return false;
  }
}

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, SVG, and GIF image files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Single File Upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded or invalid file type' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

// Multiple Files Upload
app.post('/api/upload-multiple', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  const files = req.files.map(f => ({
    url: `/uploads/${f.filename}`,
    filename: f.filename,
    size: f.size
  }));
  res.json({ success: true, files });
});

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  if (email === db.admin.email && password === db.admin.passwordHash) {
    const token = 'skf_admin_token_' + Buffer.from(Date.now().toString()).toString('base64');
    return res.json({
      success: true,
      token: token,
      admin: {
        id: db.admin.id,
        name: db.admin.name,
        email: db.admin.email,
        role: db.admin.role,
        avatar: db.admin.avatar
      }
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid email or password' });
});

app.get('/api/auth/me', (req, res) => {
  const db = readDB();
  res.json({
    success: true,
    admin: {
      id: db.admin.id,
      name: db.admin.name,
      email: db.admin.email,
      role: db.admin.role,
      avatar: db.admin.avatar
    }
  });
});

app.post('/api/auth/update-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const db = readDB();

  if (currentPassword !== db.admin.passwordHash) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
  }

  db.admin.passwordHash = newPassword;
  writeDB(db);
  res.json({ success: true, message: 'Password updated successfully' });
});

// ==========================================
// 2. DASHBOARD STATS ROUTE
// ==========================================
app.get('/api/dashboard/stats', (req, res) => {
  const db = readDB();

  // Calculate genuine statistics
  const totalBanners = db.banners.length;
  const activeBanners = db.banners.filter(b => b.isActive).length;

  const totalDoctors = db.doctors.length;
  const activeDoctors = db.doctors.filter(d => d.isActive).length;

  const totalTreatments = db.treatments.length;
  const activeTreatments = db.treatments.filter(t => t.isActive).length;
  const featuredTreatments = db.treatments.filter(t => t.isFeatured).length;

  const totalCategories = db.categories.length;
  const totalConcerns = db.concerns.length;
  const totalGallery = db.gallery.length;
  const totalBeforeAfter = db.beforeAfter.length;
  const totalReviews = (db.googleReviews || []).length;
  const activeReviews = (db.googleReviews || []).filter(r => r.isActive).length;
  const totalVideoTestimonials = (db.videoTestimonials || []).length;
  const activeVideoTestimonials = (db.videoTestimonials || []).filter(v => v.isActive).length;

  // Treatment distribution by category
  const treatmentsByCategory = db.categories.map(cat => {
    const count = db.treatments.filter(t => t.categoryId === cat.id).length;
    return {
      categoryId: cat.id,
      categoryName: cat.name,
      count: count
    };
  });

  // Recent activity / updates
  const recentItems = [];
  db.treatments.forEach(t => {
    recentItems.push({
      type: 'Treatment',
      name: t.name,
      updatedAt: t.updatedAt || t.createdAt,
      status: t.isActive ? 'Active' : 'Inactive',
      url: `/treatments.html`
    });
  });
  db.doctors.forEach(d => {
    recentItems.push({
      type: 'Doctor',
      name: d.name,
      updatedAt: d.updatedAt || d.createdAt,
      status: d.isActive ? 'Active' : 'Inactive',
      url: `/doctors.html`
    });
  });
  db.banners.forEach(b => {
    recentItems.push({
      type: 'Banner',
      name: b.title,
      updatedAt: b.updatedAt || b.createdAt,
      status: b.isActive ? 'Active' : 'Inactive',
      url: `/banners.html`
    });
  });
  (db.beforeAfter || []).forEach(ba => {
    recentItems.push({
      type: 'Before & After',
      name: ba.title,
      updatedAt: ba.createdAt,
      status: ba.approvalStatus || 'Approved',
      url: `/before-after.html`
    });
  });
  (db.googleReviews || []).forEach(gr => {
    recentItems.push({
      type: 'Google Review',
      name: `${gr.reviewerName} (${gr.rating}★)`,
      updatedAt: gr.reviewDate || gr.createdAt,
      status: gr.isActive ? 'Active' : 'Inactive',
      url: `/reviews.html`
    });
  });
  (db.videoTestimonials || []).forEach(vt => {
    recentItems.push({
      type: 'Video Story',
      name: vt.title,
      updatedAt: vt.createdAt,
      status: vt.isActive ? 'Active' : 'Inactive',
      url: `/video-testimonials.html`
    });
  });

  recentItems.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  res.json({
    success: true,
    stats: {
      totalBanners,
      activeBanners,
      totalDoctors,
      activeDoctors,
      totalTreatments,
      activeTreatments,
      featuredTreatments,
      totalCategories,
      totalConcerns,
      totalGallery,
      totalBeforeAfter,
      totalReviews,
      activeReviews,
      totalVideoTestimonials,
      activeVideoTestimonials
    },
    treatmentsByCategory,
    recentActivity: recentItems.slice(0, 8)
  });
});

// ==========================================
// 3. CATEGORIES ROUTES
// ==========================================
app.get('/api/categories', (req, res) => {
  const db = readDB();
  // Include dynamic treatment count for each category
  const enrichedCategories = db.categories.map(cat => {
    const count = db.treatments.filter(t => t.categoryId === cat.id).length;
    return { ...cat, treatmentCount: count };
  });
  enrichedCategories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  res.json({ success: true, data: enrichedCategories });
});

app.post('/api/categories', (req, res) => {
  const db = readDB();
  const { name, slug, description, thumbnail, displayOrder, isActive } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ success: false, message: 'Category name and slug are required' });
  }

  const existingSlug = db.categories.find(c => c.slug.toLowerCase() === slug.toLowerCase());
  if (existingSlug) {
    return res.status(400).json({ success: false, message: 'Slug already in use by another category' });
  }

  const newCategory = {
    id: 'cat_' + Date.now(),
    name: name.trim(),
    slug: slug.trim().toLowerCase(),
    type: 'Category',
    description: description || '',
    thumbnail: thumbnail || '',
    displayOrder: parseInt(displayOrder) || db.categories.length + 1,
    isActive: isActive !== false,
    createdAt: new Date().toISOString()
  };

  db.categories.push(newCategory);
  writeDB(db);
  res.json({ success: true, data: newCategory, message: 'Category created successfully' });
});

app.put('/api/categories/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const { name, slug, description, thumbnail, displayOrder, isActive } = req.body;

  const idx = db.categories.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  if (slug) {
    const existing = db.categories.find(c => c.id !== id && c.slug.toLowerCase() === slug.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Slug already in use by another category' });
    }
  }

  db.categories[idx] = {
    ...db.categories[idx],
    name: name !== undefined ? name.trim() : db.categories[idx].name,
    slug: slug !== undefined ? slug.trim().toLowerCase() : db.categories[idx].slug,
    description: description !== undefined ? description : db.categories[idx].description,
    thumbnail: thumbnail !== undefined ? thumbnail : db.categories[idx].thumbnail,
    displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : db.categories[idx].displayOrder,
    isActive: isActive !== undefined ? isActive : db.categories[idx].isActive,
    updatedAt: new Date().toISOString()
  };

  writeDB(db);
  res.json({ success: true, data: db.categories[idx], message: 'Category updated successfully' });
});

app.delete('/api/categories/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;

  // Prevent accidental deletion of categories that are in use by treatments!
  const treatmentsUsingCategory = db.treatments.filter(t => t.categoryId === id);
  if (treatmentsUsingCategory.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete category: It is currently assigned to ${treatmentsUsingCategory.length} treatment(s) (${treatmentsUsingCategory.map(t => t.name).join(', ')}). Please reassign or delete these treatments first.`
    });
  }

  db.categories = db.categories.filter(c => c.id !== id);
  writeDB(db);
  res.json({ success: true, message: 'Category deleted successfully' });
});

// ==========================================
// 4. CONCERNS ROUTES
// ==========================================
app.get('/api/concerns', (req, res) => {
  const db = readDB();
  const enrichedConcerns = db.concerns.map(con => {
    const count = db.treatments.filter(t => Array.isArray(t.concernIds) && t.concernIds.includes(con.id)).length;
    return { ...con, treatmentCount: count };
  });
  enrichedConcerns.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  res.json({ success: true, data: enrichedConcerns });
});

app.post('/api/concerns', (req, res) => {
  const db = readDB();
  const { name, slug, description, thumbnail, displayOrder, isActive } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ success: false, message: 'Concern name and slug are required' });
  }

  const existingSlug = db.concerns.find(c => c.slug.toLowerCase() === slug.toLowerCase());
  if (existingSlug) {
    return res.status(400).json({ success: false, message: 'Slug already in use by another concern' });
  }

  const newConcern = {
    id: 'con_' + Date.now(),
    name: name.trim(),
    slug: slug.trim().toLowerCase(),
    type: 'Concern',
    description: description || '',
    thumbnail: thumbnail || '',
    displayOrder: parseInt(displayOrder) || db.concerns.length + 1,
    isActive: isActive !== false,
    createdAt: new Date().toISOString()
  };

  db.concerns.push(newConcern);
  writeDB(db);
  res.json({ success: true, data: newConcern, message: 'Concern created successfully' });
});

app.put('/api/concerns/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const { name, slug, description, thumbnail, displayOrder, isActive } = req.body;

  const idx = db.concerns.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Concern not found' });
  }

  if (slug) {
    const existing = db.concerns.find(c => c.id !== id && c.slug.toLowerCase() === slug.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Slug already in use by another concern' });
    }
  }

  db.concerns[idx] = {
    ...db.concerns[idx],
    name: name !== undefined ? name.trim() : db.concerns[idx].name,
    slug: slug !== undefined ? slug.trim().toLowerCase() : db.concerns[idx].slug,
    description: description !== undefined ? description : db.concerns[idx].description,
    thumbnail: thumbnail !== undefined ? thumbnail : db.concerns[idx].thumbnail,
    displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : db.concerns[idx].displayOrder,
    isActive: isActive !== undefined ? isActive : db.concerns[idx].isActive,
    updatedAt: new Date().toISOString()
  };

  writeDB(db);
  res.json({ success: true, data: db.concerns[idx], message: 'Concern updated successfully' });
});

app.delete('/api/concerns/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;

  const treatmentsUsingConcern = db.treatments.filter(t => Array.isArray(t.concernIds) && t.concernIds.includes(id));
  if (treatmentsUsingConcern.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete concern: It is associated with ${treatmentsUsingConcern.length} treatment(s) (${treatmentsUsingConcern.map(t => t.name).join(', ')}). Please remove this concern from those treatments first.`
    });
  }

  db.concerns = db.concerns.filter(c => c.id !== id);
  writeDB(db);
  res.json({ success: true, message: 'Concern deleted successfully' });
});

// ==========================================
// 5. TREATMENTS ROUTES
// ==========================================
app.get('/api/treatments', (req, res) => {
  const db = readDB();
  let list = db.treatments.map(t => {
    const category = db.categories.find(c => c.id === t.categoryId);
    const concerns = (t.concernIds || []).map(cid => db.concerns.find(c => c.id === cid)).filter(Boolean);
    return {
      ...t,
      categoryName: category ? category.name : 'Unassigned',
      concerns: concerns
    };
  });

  // Query filters
  if (req.query.category) {
    list = list.filter(t => t.categoryId === req.query.category);
  }
  if (req.query.concern) {
    list = list.filter(t => (t.concernIds || []).includes(req.query.concern));
  }
  if (req.query.status !== undefined && req.query.status !== '') {
    const isActive = req.query.status === 'active' || req.query.status === 'true';
    list = list.filter(t => t.isActive === isActive);
  }
  if (req.query.featured !== undefined && req.query.featured !== '') {
    const isFeatured = req.query.featured === 'true';
    list = list.filter(t => t.isFeatured === isFeatured);
  }

  list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  res.json({ success: true, data: list });
});

app.get('/api/treatments/:id', (req, res) => {
  const db = readDB();
  const treatment = db.treatments.find(t => t.id === req.params.id);
  if (!treatment) {
    return res.status(404).json({ success: false, message: 'Treatment not found' });
  }
  const category = db.categories.find(c => c.id === treatment.categoryId);
  const concerns = (treatment.concernIds || []).map(cid => db.concerns.find(c => c.id === cid)).filter(Boolean);
  res.json({
    success: true,
    data: {
      ...treatment,
      categoryName: category ? category.name : '',
      concerns: concerns
    }
  });
});

app.post('/api/treatments', (req, res) => {
  const db = readDB();
  const treatmentData = req.body;

  if (!treatmentData.name || !treatmentData.slug) {
    return res.status(400).json({ success: false, message: 'Treatment name and slug are required' });
  }

  const existing = db.treatments.find(t => t.slug.toLowerCase() === treatmentData.slug.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'Treatment URL slug must be unique' });
  }

  const newTreatment = {
    id: 'trt_' + Date.now(),
    name: treatmentData.name.trim(),
    slug: treatmentData.slug.trim().toLowerCase(),
    featuredImage: treatmentData.featuredImage || '',
    galleryImages: Array.isArray(treatmentData.galleryImages) ? treatmentData.galleryImages : [],
    shortDescription: treatmentData.shortDescription || '',
    fullDescription: treatmentData.fullDescription || '',
    categoryId: treatmentData.categoryId || '',
    concernIds: Array.isArray(treatmentData.concernIds) ? treatmentData.concernIds : [],
    price: treatmentData.price !== undefined && treatmentData.price !== '' ? Number(treatmentData.price) : null,
    originalPrice: treatmentData.originalPrice !== undefined && treatmentData.originalPrice !== '' ? Number(treatmentData.originalPrice) : null,
    discountLabel: treatmentData.discountLabel || '',
    estimatedDuration: treatmentData.estimatedDuration || '',
    displayRating: treatmentData.displayRating ? Number(treatmentData.displayRating) : null,
    displayOrder: parseInt(treatmentData.displayOrder) || db.treatments.length + 1,
    isActive: treatmentData.isActive !== false,
    isFeatured: treatmentData.isFeatured === true,
    seoH1: treatmentData.seoH1 || '',
    seoUrl: treatmentData.seoUrl || '',
    seoTitle: treatmentData.seoTitle || '',
    seoDescription: treatmentData.seoDescription || '',
    seoKeywords: treatmentData.seoKeywords || '',
    seoRobots: treatmentData.seoRobots || 'index, follow',
    ogTitle: treatmentData.ogTitle || '',
    ogType: treatmentData.ogType || 'website',
    ogSiteName: treatmentData.ogSiteName || 'Skinfinity Derma',
    ogUrl: treatmentData.ogUrl || '',
    ogImage: treatmentData.ogImage || '',
    ogDescription: treatmentData.ogDescription || '',
    schemaType: treatmentData.schemaType || 'MedicalProcedure',
    schemaMarkup: treatmentData.schemaMarkup || '',
    process: Array.isArray(treatmentData.process) ? treatmentData.process : [],
    suitability: treatmentData.suitability || '',
    aftercare: treatmentData.aftercare || '',
    faqs: Array.isArray(treatmentData.faqs) ? treatmentData.faqs : [],
    relatedTreatmentIds: Array.isArray(treatmentData.relatedTreatmentIds) ? treatmentData.relatedTreatmentIds : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.treatments.push(newTreatment);
  writeDB(db);
  res.json({ success: true, data: newTreatment, message: 'Treatment created successfully' });
});

app.put('/api/treatments/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const updateData = req.body;

  const idx = db.treatments.findIndex(t => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Treatment not found' });
  }

  if (updateData.slug) {
    const existing = db.treatments.find(t => t.id !== id && t.slug.toLowerCase() === updateData.slug.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Treatment URL slug must be unique' });
    }
  }

  db.treatments[idx] = {
    ...db.treatments[idx],
    ...updateData,
    id: id,
    price: updateData.price !== undefined && updateData.price !== '' ? Number(updateData.price) : null,
    originalPrice: updateData.originalPrice !== undefined && updateData.originalPrice !== '' ? Number(updateData.originalPrice) : null,
    displayRating: updateData.displayRating !== undefined && updateData.displayRating !== '' ? Number(updateData.displayRating) : null,
    displayOrder: updateData.displayOrder !== undefined ? parseInt(updateData.displayOrder) : db.treatments[idx].displayOrder,
    isActive: updateData.isActive !== undefined ? Boolean(updateData.isActive) : db.treatments[idx].isActive,
    isFeatured: updateData.isFeatured !== undefined ? Boolean(updateData.isFeatured) : db.treatments[idx].isFeatured,
    updatedAt: new Date().toISOString()
  };

  writeDB(db);
  res.json({ success: true, data: db.treatments[idx], message: 'Treatment updated successfully' });
});

// Duplicate Treatment
app.post('/api/treatments/:id/duplicate', (req, res) => {
  const db = readDB();
  const original = db.treatments.find(t => t.id === req.params.id);
  if (!original) {
    return res.status(404).json({ success: false, message: 'Original treatment not found' });
  }

  const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
  const duplicate = {
    ...JSON.parse(JSON.stringify(original)),
    id: 'trt_' + Date.now(),
    name: `${original.name} (Copy)`,
    slug: newSlug,
    displayOrder: db.treatments.length + 1,
    isActive: false, // inactive by default until reviewed
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.treatments.push(duplicate);
  writeDB(db);
  res.json({ success: true, data: duplicate, message: 'Treatment duplicated successfully as draft' });
});

// Toggle Status / Featured
app.patch('/api/treatments/:id/toggle-status', (req, res) => {
  const db = readDB();
  const treatment = db.treatments.find(t => t.id === req.params.id);
  if (!treatment) {
    return res.status(404).json({ success: false, message: 'Treatment not found' });
  }
  treatment.isActive = !treatment.isActive;
  treatment.updatedAt = new Date().toISOString();
  writeDB(db);
  res.json({ success: true, isActive: treatment.isActive, message: `Treatment marked as ${treatment.isActive ? 'Active' : 'Inactive'}` });
});

app.patch('/api/treatments/:id/toggle-featured', (req, res) => {
  const db = readDB();
  const treatment = db.treatments.find(t => t.id === req.params.id);
  if (!treatment) {
    return res.status(404).json({ success: false, message: 'Treatment not found' });
  }
  treatment.isFeatured = !treatment.isFeatured;
  treatment.updatedAt = new Date().toISOString();
  writeDB(db);
  res.json({ success: true, isFeatured: treatment.isFeatured, message: `Treatment ${treatment.isFeatured ? 'marked as Featured' : 'unmarked from Featured'}` });
});

app.delete('/api/treatments/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.treatments = db.treatments.filter(t => t.id !== id);

  // Clean up gallery & before/after associations if needed
  db.gallery.forEach(g => {
    if (g.treatmentId === id) g.treatmentId = '';
  });
  db.beforeAfter.forEach(ba => {
    if (ba.treatmentId === id) ba.treatmentId = '';
  });

  writeDB(db);
  res.json({ success: true, message: 'Treatment deleted successfully' });
});

// ==========================================
// 6. DOCTORS ROUTES
// ==========================================
app.get('/api/doctors', (req, res) => {
  const db = readDB();
  let list = [...db.doctors];
  if (req.query.clinic) {
    list = list.filter(d => (d.clinicCity || '').toLowerCase().includes(req.query.clinic.toLowerCase()));
  }
  if (req.query.specialization) {
    list = list.filter(d => (d.specialization || '').toLowerCase().includes(req.query.specialization.toLowerCase()));
  }
  list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  res.json({ success: true, data: list });
});

app.get('/api/doctors/:id', (req, res) => {
  const db = readDB();
  const doctor = db.doctors.find(d => d.id === req.params.id);
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
  res.json({ success: true, data: doctor });
});

app.post('/api/doctors', (req, res) => {
  const db = readDB();
  const { name, photo, designation, qualifications, specialization, shortBio, fullBio, clinicCity, profileUrl, displayOrder, isActive } = req.body;

  if (!name || !designation) {
    return res.status(400).json({ success: false, message: 'Doctor name and designation are required' });
  }

  const newDoc = {
    id: 'doc_' + Date.now(),
    name: name.trim(),
    photo: photo || '',
    designation: designation.trim(),
    qualifications: qualifications ? qualifications.trim() : '',
    specialization: specialization ? specialization.trim() : '',
    shortBio: shortBio || '',
    fullBio: fullBio || '',
    clinicCity: clinicCity || '',
    profileUrl: profileUrl || '',
    displayOrder: parseInt(displayOrder) || db.doctors.length + 1,
    isActive: isActive !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.doctors.push(newDoc);
  writeDB(db);
  res.json({ success: true, data: newDoc, message: 'Doctor added successfully' });
});

app.put('/api/doctors/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = db.doctors.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Doctor not found' });

  db.doctors[idx] = {
    ...db.doctors[idx],
    ...req.body,
    id: id,
    displayOrder: req.body.displayOrder !== undefined ? parseInt(req.body.displayOrder) : db.doctors[idx].displayOrder,
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : db.doctors[idx].isActive,
    updatedAt: new Date().toISOString()
  };

  writeDB(db);
  res.json({ success: true, data: db.doctors[idx], message: 'Doctor updated successfully' });
});

app.patch('/api/doctors/:id/toggle-status', (req, res) => {
  const db = readDB();
  const doctor = db.doctors.find(d => d.id === req.params.id);
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
  doctor.isActive = !doctor.isActive;
  doctor.updatedAt = new Date().toISOString();
  writeDB(db);
  res.json({ success: true, isActive: doctor.isActive, message: `Doctor ${doctor.isActive ? 'activated' : 'deactivated'}` });
});

app.delete('/api/doctors/:id', (req, res) => {
  const db = readDB();
  db.doctors = db.doctors.filter(d => d.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Doctor profile deleted successfully' });
});

// ==========================================
// 7. BANNERS ROUTES
// ==========================================
app.get('/api/banners', (req, res) => {
  const db = readDB();
  let list = [...db.banners];
  if (req.query.location) {
    list = list.filter(b => b.displayLocation === req.query.location);
  }
  list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  res.json({ success: true, data: list });
});

app.get('/api/banners/:id', (req, res) => {
  const db = readDB();
  const banner = db.banners.find(b => b.id === req.params.id);
  if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
  res.json({ success: true, data: banner });
});

app.post('/api/banners', (req, res) => {
  const db = readDB();
  const { title, subtitle, desktopImage, mobileImage, altText, buttonText, buttonUrl, displayLocation, displayOrder, isActive } = req.body;

  if (!title || !desktopImage) {
    return res.status(400).json({ success: false, message: 'Banner title and desktop image are required' });
  }

  const newBanner = {
    id: 'ban_' + Date.now(),
    title: title.trim(),
    subtitle: subtitle || '',
    desktopImage: desktopImage,
    mobileImage: mobileImage || '',
    altText: altText || title,
    buttonText: buttonText || '',
    buttonUrl: buttonUrl || '',
    displayLocation: displayLocation || 'Homepage Hero',
    displayOrder: parseInt(displayOrder) || db.banners.length + 1,
    isActive: isActive !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.banners.push(newBanner);
  writeDB(db);
  res.json({ success: true, data: newBanner, message: 'Banner created successfully' });
});

app.put('/api/banners/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = db.banners.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Banner not found' });

  db.banners[idx] = {
    ...db.banners[idx],
    ...req.body,
    id: id,
    displayOrder: req.body.displayOrder !== undefined ? parseInt(req.body.displayOrder) : db.banners[idx].displayOrder,
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : db.banners[idx].isActive,
    updatedAt: new Date().toISOString()
  };

  writeDB(db);
  res.json({ success: true, data: db.banners[idx], message: 'Banner updated successfully' });
});

app.patch('/api/banners/:id/toggle-status', (req, res) => {
  const db = readDB();
  const banner = db.banners.find(b => b.id === req.params.id);
  if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
  banner.isActive = !banner.isActive;
  banner.updatedAt = new Date().toISOString();
  writeDB(db);
  res.json({ success: true, isActive: banner.isActive, message: `Banner ${banner.isActive ? 'published' : 'unpublished'}` });
});

app.delete('/api/banners/:id', (req, res) => {
  const db = readDB();
  db.banners = db.banners.filter(b => b.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Banner deleted successfully' });
});

// Reorder banners
app.post('/api/banners/reorder', (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) return res.status(400).json({ success: false, message: 'Invalid orderedIds' });
  const db = readDB();
  orderedIds.forEach((id, index) => {
    const banner = db.banners.find(b => b.id === id);
    if (banner) banner.displayOrder = index + 1;
  });
  writeDB(db);
  res.json({ success: true, message: 'Banners reordered successfully' });
});

// ==========================================
// 8. GALLERY ROUTES
// ==========================================
app.get('/api/gallery', (req, res) => {
  const db = readDB();
  let list = db.gallery.map(g => {
    const treatment = db.treatments.find(t => t.id === g.treatmentId);
    return {
      ...g,
      treatmentName: treatment ? treatment.name : 'General'
    };
  });

  if (req.query.treatmentId) {
    list = list.filter(g => g.treatmentId === req.query.treatmentId);
  }
  if (req.query.category) {
    list = list.filter(g => g.category === req.query.category);
  }

  list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  res.json({ success: true, data: list });
});

app.post('/api/gallery', (req, res) => {
  const db = readDB();
  const { image, title, altText, treatmentId, category, displayOrder, isActive } = req.body;

  if (!image) {
    return res.status(400).json({ success: false, message: 'Image URL or file is required' });
  }

  const newGal = {
    id: 'gal_' + Date.now(),
    image: image,
    title: title || '',
    altText: altText || title || 'Skinfinity Derma gallery image',
    treatmentId: treatmentId || '',
    category: category || 'General',
    displayOrder: parseInt(displayOrder) || db.gallery.length + 1,
    isActive: isActive !== false,
    createdAt: new Date().toISOString()
  };

  db.gallery.push(newGal);
  writeDB(db);
  res.json({ success: true, data: newGal, message: 'Gallery image added successfully' });
});

app.put('/api/gallery/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = db.gallery.findIndex(g => g.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Gallery item not found' });

  db.gallery[idx] = {
    ...db.gallery[idx],
    ...req.body,
    id: id,
    displayOrder: req.body.displayOrder !== undefined ? parseInt(req.body.displayOrder) : db.gallery[idx].displayOrder,
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : db.gallery[idx].isActive
  };

  writeDB(db);
  res.json({ success: true, data: db.gallery[idx], message: 'Gallery item updated successfully' });
});

app.patch('/api/gallery/:id/toggle-status', (req, res) => {
  const db = readDB();
  const gal = db.gallery.find(g => g.id === req.params.id);
  if (!gal) return res.status(404).json({ success: false, message: 'Gallery item not found' });
  gal.isActive = !gal.isActive;
  writeDB(db);
  res.json({ success: true, isActive: gal.isActive, message: `Gallery item ${gal.isActive ? 'activated' : 'deactivated'}` });
});

app.delete('/api/gallery/:id', (req, res) => {
  const db = readDB();
  db.gallery = db.gallery.filter(g => g.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Gallery item deleted successfully' });
});

// ==========================================
// 9. BEFORE & AFTER ROUTES
// ==========================================
app.get('/api/before-after', (req, res) => {
  const db = readDB();
  let list = db.beforeAfter.map(ba => {
    const treatment = db.treatments.find(t => t.id === ba.treatmentId);
    return {
      ...ba,
      treatmentName: treatment ? treatment.name : 'General'
    };
  });

  if (req.query.treatmentId) {
    list = list.filter(ba => ba.treatmentId === req.query.treatmentId);
  }

  list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  res.json({ success: true, data: list });
});

app.post('/api/before-after', (req, res) => {
  const db = readDB();
  const { title, beforeImage, afterImage, treatmentId, categoryOrConcern, caption, beforeAltText, afterAltText, hasPatientConsent, approvalStatus, displayOrder, isActive } = req.body;

  if (!title || !beforeImage || !afterImage) {
    return res.status(400).json({ success: false, message: 'Title, Before Image, and After Image are all required' });
  }

  const newBA = {
    id: 'ba_' + Date.now(),
    title: title.trim(),
    beforeImage: beforeImage,
    afterImage: afterImage,
    treatmentId: treatmentId || '',
    categoryOrConcern: categoryOrConcern || '',
    caption: caption || '',
    beforeAltText: beforeAltText || `${title} - Before`,
    afterAltText: afterAltText || `${title} - After`,
    hasPatientConsent: Boolean(hasPatientConsent),
    approvalStatus: approvalStatus || (hasPatientConsent ? 'Approved' : 'Pending Review'),
    displayOrder: parseInt(displayOrder) || db.beforeAfter.length + 1,
    isActive: isActive !== false,
    createdAt: new Date().toISOString()
  };

  db.beforeAfter.push(newBA);
  writeDB(db);
  res.json({ success: true, data: newBA, message: 'Before & After comparison created successfully' });
});

app.put('/api/before-after/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = db.beforeAfter.findIndex(ba => ba.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Before & After record not found' });

  db.beforeAfter[idx] = {
    ...db.beforeAfter[idx],
    ...req.body,
    id: id,
    hasPatientConsent: req.body.hasPatientConsent !== undefined ? Boolean(req.body.hasPatientConsent) : db.beforeAfter[idx].hasPatientConsent,
    displayOrder: req.body.displayOrder !== undefined ? parseInt(req.body.displayOrder) : db.beforeAfter[idx].displayOrder,
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : db.beforeAfter[idx].isActive
  };

  writeDB(db);
  res.json({ success: true, data: db.beforeAfter[idx], message: 'Before & After record updated successfully' });
});

app.patch('/api/before-after/:id/toggle-status', (req, res) => {
  const db = readDB();
  const ba = db.beforeAfter.find(b => b.id === req.params.id);
  if (!ba) return res.status(404).json({ success: false, message: 'Record not found' });
  ba.isActive = !ba.isActive;
  writeDB(db);
  res.json({ success: true, isActive: ba.isActive, message: `Record ${ba.isActive ? 'published' : 'hidden'}` });
});

app.delete('/api/before-after/:id', (req, res) => {
  const db = readDB();
  db.beforeAfter = db.beforeAfter.filter(ba => ba.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Before & After record deleted successfully' });
});

// ==========================================
// 10. SETTINGS ROUTES
// ==========================================
app.get('/api/settings', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.settings });
});

app.post('/api/settings', (req, res) => {
  const db = readDB();
  db.settings = {
    ...db.settings,
    ...req.body
  };
  writeDB(db);
  res.json({ success: true, data: db.settings, message: 'Settings saved successfully' });
});

// ==========================================
// 11. GOOGLE REVIEWS ROUTES
// ==========================================
app.get('/api/reviews/stats', (req, res) => {
  const db = readDB();
  res.json({
    success: true,
    data: db.googleReviewStats || { rating: 4.7, reviewCount: '2500+', writeReviewUrl: 'https://g.page/r/skinfinityderma/review' }
  });
});

app.post('/api/reviews/stats', (req, res) => {
  const db = readDB();
  db.googleReviewStats = {
    ...db.googleReviewStats,
    ...req.body
  };
  writeDB(db);
  res.json({ success: true, data: db.googleReviewStats, message: 'Google Review stats updated successfully' });
});

app.get('/api/reviews', (req, res) => {
  const db = readDB();
  let list = db.googleReviews || [];

  if (req.query.treatmentTag) {
    list = list.filter(r => (r.treatmentTag || '').toLowerCase() === req.query.treatmentTag.toLowerCase());
  }
  if (req.query.rating) {
    list = list.filter(r => r.rating === Number(req.query.rating));
  }
  if (req.query.status !== undefined && req.query.status !== '') {
    const isActive = req.query.status === 'active' || req.query.status === 'true';
    list = list.filter(r => r.isActive === isActive);
  }
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    list = list.filter(r => (r.reviewerName || '').toLowerCase().includes(q) || (r.reviewText || '').toLowerCase().includes(q));
  }

  list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  res.json({ success: true, data: list });
});

app.get('/api/reviews/:id', (req, res) => {
  const db = readDB();
  const review = (db.googleReviews || []).find(r => r.id === req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  res.json({ success: true, data: review });
});

app.post('/api/reviews', (req, res) => {
  const db = readDB();
  if (!db.googleReviews) db.googleReviews = [];

  const { reviewerName, initials, avatar, rating, reviewText, treatmentTag, branch, reviewDate, displayOrder, isActive } = req.body;

  if (!reviewerName || !reviewText) {
    return res.status(400).json({ success: false, message: 'Reviewer name and review text are required' });
  }

  // Derive initials if not provided
  const computedInitials = initials || reviewerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const newReview = {
    id: 'rev_' + Date.now(),
    reviewerName: reviewerName.trim(),
    initials: computedInitials,
    avatar: avatar || '',
    rating: parseInt(rating) || 5,
    reviewText: reviewText.trim(),
    treatmentTag: treatmentTag || 'Skin Treatment',
    branch: branch || 'Safdarjung Enclave, New Delhi',
    reviewDate: reviewDate || new Date().toISOString(),
    displayOrder: parseInt(displayOrder) || db.googleReviews.length + 1,
    isActive: isActive !== false,
    createdAt: new Date().toISOString()
  };

  db.googleReviews.push(newReview);
  writeDB(db);
  res.json({ success: true, data: newReview, message: 'Google review added successfully' });
});

app.put('/api/reviews/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = (db.googleReviews || []).findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Review not found' });

  const existing = db.googleReviews[idx];
  const reviewerName = req.body.reviewerName !== undefined ? req.body.reviewerName.trim() : existing.reviewerName;
  const computedInitials = req.body.initials || reviewerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  db.googleReviews[idx] = {
    ...existing,
    ...req.body,
    id: id,
    reviewerName: reviewerName,
    initials: computedInitials,
    rating: req.body.rating !== undefined ? parseInt(req.body.rating) : existing.rating,
    displayOrder: req.body.displayOrder !== undefined ? parseInt(req.body.displayOrder) : existing.displayOrder,
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : existing.isActive,
    updatedAt: new Date().toISOString()
  };

  writeDB(db);
  res.json({ success: true, data: db.googleReviews[idx], message: 'Review updated successfully' });
});

app.patch('/api/reviews/:id/toggle-status', (req, res) => {
  const db = readDB();
  const review = (db.googleReviews || []).find(r => r.id === req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  review.isActive = !review.isActive;
  writeDB(db);
  res.json({ success: true, isActive: review.isActive, message: `Review ${review.isActive ? 'published' : 'hidden'}` });
});

app.delete('/api/reviews/:id', (req, res) => {
  const db = readDB();
  db.googleReviews = (db.googleReviews || []).filter(r => r.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Google review deleted successfully' });
});

// ==========================================
// 12. VIDEO TESTIMONIALS (PATIENT STORIES)
// ==========================================
app.get('/api/testimonials', (req, res) => {
  const db = readDB();
  let list = (db.videoTestimonials || []).map(vt => {
    const treatment = (db.treatments || []).find(t => t.id === vt.treatmentId);
    return {
      ...vt,
      treatmentName: vt.treatmentName || (treatment ? treatment.name : 'General Clinic')
    };
  });

  if (req.query.treatmentId) {
    list = list.filter(v => v.treatmentId === req.query.treatmentId);
  }
  if (req.query.status !== undefined && req.query.status !== '') {
    const isActive = req.query.status === 'active' || req.query.status === 'true';
    list = list.filter(v => v.isActive === isActive);
  }
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    list = list.filter(v => (v.title || '').toLowerCase().includes(q) || (v.patientName || '').toLowerCase().includes(q));
  }

  list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  res.json({ success: true, data: list });
});

app.get('/api/testimonials/:id', (req, res) => {
  const db = readDB();
  const item = (db.videoTestimonials || []).find(v => v.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Testimonial not found' });
  res.json({ success: true, data: item });
});

app.post('/api/testimonials', (req, res) => {
  const db = readDB();
  if (!db.videoTestimonials) db.videoTestimonials = [];

  const { patientName, title, journeyTag, videoUrl, thumbnailUrl, treatmentId, treatmentName, quote, rating, displayOrder, isActive } = req.body;

  if (!title || !videoUrl) {
    return res.status(400).json({ success: false, message: 'Story title and video URL are required' });
  }

  const newTestimonial = {
    id: 'vt_' + Date.now(),
    patientName: patientName ? patientName.trim() : 'Skinfinity Patient',
    title: title.trim(),
    journeyTag: journeyTag || 'PATIENT STORY',
    videoUrl: videoUrl.trim(),
    thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    treatmentId: treatmentId || '',
    treatmentName: treatmentName || '',
    quote: quote ? quote.trim() : '',
    rating: parseInt(rating) || 5,
    displayOrder: parseInt(displayOrder) || db.videoTestimonials.length + 1,
    isActive: isActive !== false,
    createdAt: new Date().toISOString()
  };

  db.videoTestimonials.push(newTestimonial);
  writeDB(db);
  res.json({ success: true, data: newTestimonial, message: 'Video testimonial added successfully' });
});

app.put('/api/testimonials/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = (db.videoTestimonials || []).findIndex(v => v.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Testimonial not found' });

  db.videoTestimonials[idx] = {
    ...db.videoTestimonials[idx],
    ...req.body,
    id: id,
    rating: req.body.rating !== undefined ? parseInt(req.body.rating) : db.videoTestimonials[idx].rating,
    displayOrder: req.body.displayOrder !== undefined ? parseInt(req.body.displayOrder) : db.videoTestimonials[idx].displayOrder,
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : db.videoTestimonials[idx].isActive,
    updatedAt: new Date().toISOString()
  };

  writeDB(db);
  res.json({ success: true, data: db.videoTestimonials[idx], message: 'Video testimonial updated successfully' });
});

app.patch('/api/testimonials/:id/toggle-status', (req, res) => {
  const db = readDB();
  const item = (db.videoTestimonials || []).find(v => v.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Testimonial not found' });
  item.isActive = !item.isActive;
  writeDB(db);
  res.json({ success: true, isActive: item.isActive, message: `Video story ${item.isActive ? 'published' : 'hidden'}` });
});

app.delete('/api/testimonials/:id', (req, res) => {
  const db = readDB();
  db.videoTestimonials = (db.videoTestimonials || []).filter(v => v.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Video testimonial deleted successfully' });
});

// Fallback for SPA routing if needed
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.includes('.')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Skinfinity Derma Admin Backend API Server Running!`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Static Admin Panel: http://localhost:${PORT}/index.html`);
  console.log(`====================================================`);
});
