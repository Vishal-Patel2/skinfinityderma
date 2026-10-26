# Skinfinity Derma Custom Admin Dashboard

A modern, responsive, professional administration dashboard for **Skinfinity Derma**, a premier dermatology, skin care, and hair restoration clinic.

This dashboard is built to manage selected dynamic sections of the Skinfinity Derma website without rebuilding the public website or relying on bloated CMS platforms like WordPress.

---

## 1. Brand Identity & Design System

The admin dashboard reflects Skinfinity Derma's aesthetic medical identity with a minimal, premium medical-clinic palette:

- **Primary Dark Green**: `#124432`
- **Secondary Green**: `#286B52`
- **Accent Muted Green**: `#1E5642`
- **Soft Green Backgrounds**: `#E8EFEA` & `#F0F5F2`
- **Light Page Canvas**: `#F4F7F4`
- **Pure White Cards & Surfaces**: `#FFFFFF`
- **Muted Grey-Green Borders**: `#DCE5DF`
- **Typography**: Plus Jakarta Sans / Inter modern typography
- **Subtle elevation**: `0 4px 18px rgba(18, 68, 50, 0.05)`

---

## 2. Technology Stack

- **Markup & Structure**: HTML5 semantic markup.
- **Styling**: Bootstrap 5.3 + custom CSS (`assets/css/style.css` and `assets/css/responsive.css`).
- **Scripting & DOM**: Modern JavaScript (ES6+) and jQuery 3.7.
- **Icons**: Bootstrap Icons (v1.11.3).
- **Data Tables**: DataTables with custom pagination, live search, sorting, and brand-styled controls.
- **Dialogs & Toasts**: SweetAlert2 for deletion confirmations and notification toasts.
- **Multi-Select**: Select2 with Bootstrap 5 theme for cross-concern tagging.
- **Backend API**: Node.js & Express REST API with `multer` for secure image uploads and persistent storage in `server/data/db.json`.

> **Note**: Completely free from heavy SPA frameworks (no React, Next.js, Vue, Angular, or TypeScript). Clean, modular vanilla HTML/CSS/JS.

---

## 3. Dashboard Modules & Features

### 1. Dashboard Overview (`index.html`)
- Real-time KPI summary cards populated directly from the database:
  - Total Banners (with active count)
  - Total Doctors (with active count)
  - Total Treatments (with active & featured counts)
  - Total Categories & Concerns
  - Total Gallery Items
  - Total Before & After Cases
- Quick-action action shortcuts: Add Banner, Add Doctor, Add Treatment, Upload Gallery Image, Add Before & After.
- Treatment distribution visual breakdown across categories.
- Recently updated records table with quick links.

### 2. Treatment Management (`treatments.html` & `treatment-form.html`)
- Centralized treatment catalog management.
- Multi-criteria filtering by category, concern, active status, and featured toggle.
- Searchable and sortable DataTables.
- Quick switch toggles for **Active** and **Featured** status.
- One-click **Duplicate Treatment** action (creates an editable draft copy).
- **Dedicated Treatment Editor (`treatment-form.html`)**:
  - General Info (Title, URL slug with auto-slugify and uniqueness validation, category, short & full clinical description).
  - Multi-Select Concerns using Select2.
  - Pricing (Offer price, original price, discount percentage label).
  - Session duration and genuine display rating.
  - Clinical detail repeaters (Step-by-step Procedure Steps, Suitability notes, Post-procedure Aftercare, and FAQs).
  - SEO Meta Title & Meta Description.
  - **Live Treatment Card Preview**: Right-hand sticky preview card updating in real time as the administrator types.

### 3. Categories & Concerns Taxonomy (`categories.html` & `concerns.html`)
- Configurable therapeutic categories (`Skin`, `Hair`, `Face`, `Body`, `Women`, `Men`).
- Multi-relational clinical concerns (`Acne`, `Acne Scars`, `Pigmentation`, `Hair Fall`, `Unwanted Hair`, `Ageing`, `Skin Dullness`, `Skin Texture`).
- Live badge count displaying the exact number of treatments mapped to each taxonomy item.
- **Relational Protection**: Prevents accidental deletion of any category or concern that is currently assigned to one or more active treatments, displaying a safety alert with the specific treatment names.

### 4. Doctor Management (`doctors.html`)
- Manage clinic dermatologists, trichologists, and aesthetic physicians.
- Doctor fields: Name, photo, designation, medical qualifications (e.g. MBBS, MD, FAM), specializations, associated clinic branch, short bio, full bio, and custom profile URL.
- Photo upload with live preview and validation.
- Filter by clinic location (`Safdarjung Enclave`, `Sector 18 Noida`, `Golf Course Road Gurugram`) and specialization.
- Control active/inactive visibility on the public website.

### 5. Banner Management (`banners.html`)
- Manage hero slideshows and promotional page banners.
- Dual image uploads: Desktop banner (16:9 / 21:9) and Mobile banner (portrait / 4:5).
- Placement target filtering (`Homepage Hero`, `Hair Care Page`, `Skin Care Page`, `Special Offers`).
- Call to Action button label and target URL configuration.
- Image alt text for SEO and accessibility.
- Slide reordering and visibility toggling.

### 6. Gallery Management (`gallery.html`)
- Manage clinic ambience and procedure photographs.
- Grid View and Table View toggle.
- Multi-criteria filtering by gallery category and associated treatment.
- Interactive Lightbox modal to inspect high-resolution photographs.
- Quick caption and alt text editing.

### 7. Before & After Comparisons (`before-after.html`)
- Standardized dual image upload for baseline **Before** photo and post-procedure **After** photo.
- Associated treatment and concern tags.
- Clinical observation captions.
- **Patient Consent & Legal Compliance Checklist**: Mandates patient written consent before publishing identifiable clinical photos.
- Publication approval workflow (`Approved`, `Pending Review`, `Restricted`).
- Side-by-side comparison modal with enlarged view.

### 8. Clinic Settings (`settings.html`)
- Primary phone, WhatsApp helpline, patient support email, working hours, and clinic addresses.
- Social media profile links (Instagram, Facebook, YouTube).
- Global SEO defaults (Meta title, meta description).
- Admin password change with current password verification.
- Central API base URL configuration tester.

### 9. Secure Login Portal (`login.html`)
- Medical aesthetic branded authentication screen.
- Default administrator credentials helper:
  - **Email**: `admin@skinfinityderma.com`
  - **Password**: `admin123`
- Session persistence in local browser storage with automatic session timeout and redirect protection.

---

## 4. Directory Structure

```text
skinfinity-derma-admin/
├── index.html                  # Dashboard Overview & Metrics
├── login.html                  # Admin Authentication Screen
├── banners.html                # Banner Management
├── doctors.html                # Doctor Profiles Management
├── treatments.html             # Treatment Catalog & Filters
├── treatment-form.html         # Add/Edit Treatment + Live Preview
├── categories.html             # Treatment Categories
├── concerns.html               # Clinical Concerns
├── gallery.html                # Clinic Media & Gallery
├── before-after.html           # Before & After Comparisons
├── settings.html               # Clinic & Dashboard Settings
├── package.json                # Server dependencies & scripts
├── server/
│   ├── server.js               # REST API Server & Multer upload handler
│   ├── data/
│   │   └── db.json             # Persistent JSON database (pre-seeded)
│   └── uploads/                # Directory for uploaded media assets
└── assets/
    ├── css/
    │   ├── style.css           # Brand palette, layout & custom components
    │   └── responsive.css      # Breakpoints & mobile drawer styles
    ├── js/
    │   ├── api.js              # Central jQuery AJAX service client
    │   ├── app.js              # Shell controller & SweetAlert helpers
    │   ├── login.js            # Login controller
    │   ├── dashboard.js        # Overview metrics & distribution charts
    │   ├── banners.js          # Banner CRUD
    │   ├── doctors.js          # Doctor CRUD
    │   ├── treatments.js       # Treatments listing & filters
    │   ├── treatment-form.js   # Treatment form & real-time preview
    │   ├── categories.js       # Categories CRUD & relational checks
    │   ├── concerns.js         # Concerns CRUD & relational checks
    │   ├── gallery.js          # Gallery grid/table & lightbox
    │   ├── before-after.js     # Before/After comparison & consent
    │   └── settings.js         # Settings & password update
    └── images/
        ├── logo.png            # Skinfinity Derma vector brand mark
        └── avatar-default.svg  # Doctor avatar placeholder
```

---

## 5. Setup & Running Instructions

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm

### Step 1: Install Dependencies
Open a terminal in the project directory:
```bash
npm install
```

### Step 2: Start the Backend Server & Dashboard
```bash
npm start
```
Or for automatic reload during development:
```bash
npm run dev
```

### Step 3: Open in Browser
Visit in your web browser:
```text
http://localhost:3000/
```
The server serves both the REST API endpoints (`/api/*`), uploaded files (`/uploads/*`), and the admin frontend pages.

---

## 6. Public Website Integration Guide

Your existing public HTML/CSS/JS website can easily display dynamic content managed in this dashboard by calling the REST API endpoints using standard `fetch()` or `jQuery.ajax()`:

### Fetching Active Banners on Homepage:
```javascript
fetch('http://localhost:3000/api/banners?location=Homepage Hero')
  .then(res => res.json())
  .then(response => {
    const activeBanners = response.data.filter(b => b.isActive);
    // Render banner slideshow on public homepage
  });
```

### Fetching Featured Treatments:
```javascript
fetch('http://localhost:3000/api/treatments?featured=true&status=active')
  .then(res => res.json())
  .then(response => {
    const treatments = response.data;
    // Render treatment cards
  });
```

### Fetching Verified Before & After Cases:
```javascript
fetch('http://localhost:3000/api/before-after')
  .then(res => res.json())
  .then(response => {
    // Only display cases with patient consent and publication approval
    const publicCases = response.data.filter(c => c.isActive && c.hasPatientConsent && c.approvalStatus === 'Approved');
    // Mount into interactive before-and-after image slider
  });
```

---

## 7. Security & Production Checklist

1. **Environment Variables**: Move `PORT`, admin credentials, and secret keys to `.env` using `dotenv`.
2. **Authentication**: In production, exchange the token generation with signed JWTs (`jsonwebtoken`) with expiry timestamps.
3. **Password Hashing**: Use `bcrypt` or `argon2` for storing administrator password hashes in production.
4. **CORS Configuration**: Restrict CORS in `server.js` to only allow requests originating from your public clinic domain (e.g., `https://skinfinityderma.com`).
5. **Storage**: Configure Multer to upload directly to Amazon S3, Cloudflare R2, or Google Cloud Storage for scalable CDN delivery.
6. **HTTPS**: Deploy behind a reverse proxy (such as Nginx or Caddy) with automated SSL/TLS certificates.
