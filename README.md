# 🩺 Skinfinity Derma — Full-Stack Aesthetic Dermatology Web Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=flat&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19-lightgrey?style=flat&logo=express)](https://expressjs.com/)
[![MySQL / MariaDB](https://img.shields.io/badge/Database-MySQL%20%2F%20MariaDB-blue?style=flat&logo=mysql)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat&logo=bootstrap)](https://getbootstrap.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)

A full-stack, enterprise-grade medical aesthetics and clinical dermatology portal built for **Skinfinity Derma Clinics** (Noida Sector 36 Headquarters & Gurgaon Sector 28 Golf Course Road).

The system features a **Next.js 14 App Router** public portal with 57 pre-rendered SSG routes, a high-performance **Node.js Express REST API**, a normalized **MySQL/MariaDB** database schema with 32 relational tables, and a **Role-Based Access Control (RBAC) Admin Dashboard** featuring a luxury clinic aesthetic.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Project Directory Structure](#-project-directory-structure)
- [Core Features](#-core-features)
- [Role-Based Access Control (RBAC) Matrix](#-role-based-access-control-rbac-matrix)
- [Database Architecture](#-database-architecture)
- [REST API Specifications](#-rest-api-specifications)
- [Quick Start & Local Setup](#-quick-start--local-setup)
- [Default Login Credentials](#-default-login-credentials)
- [Production Deployment](#-production-deployment)
- [License](#-license)

---

## 🏛️ Architectural Overview

```
                        ┌────────────────────────────────────────┐
                        │          Next.js 14 Frontend           │
                        │    (App Router • 57 SSG Pages • 3000)  │
                        └───────────────────┬────────────────────┘
                                            │
                                            ▼  JSON REST API
                        ┌────────────────────────────────────────┐
                        │          Express.js Backend API        │
                        │        (Port 4000 • JWT Security)      │
                        └─────────┬──────────────────────┬───────┘
                                  │                      │
                                  ▼                      ▼
        ┌───────────────────────────────────┐  ┌─────────────────────────┐
        │        MySQL / MariaDB (3306)     │  │   RBAC Admin Dashboard  │
        │   32 Relational Tables • Pooled   │  │   Bootstrap 5 • Port 4000│
        └───────────────────────────────────┘  └─────────────────────────┘
```

---

## 📂 Project Directory Structure

```
skinfinityderma/
├── frontend/                       # Public Portal (Next.js 14 App Router)
│   ├── src/
│   │   ├── app/                    # 57 Pre-rendered static/dynamic clinical routes
│   │   ├── components/             # Reusable UI widgets, interactive diagnostic tools, modals
│   │   ├── context/                # CartContext (Coupons) & AuthContext (Bookings/Leads)
│   │   ├── data/                   # Fallback data catalogs & clinic details
│   │   └── lib/                    # Typed API fetchers (api.ts) & type interfaces (types.ts)
│   ├── public/                     # Optimized images, banners, and SVGs
│   └── package.json
│
├── backend/                        # REST API Server & Database Layer
│   ├── src/
│   │   ├── config/                 # Database pool (mysql2) & environment configs
│   │   ├── middleware/             # JWT auth, RBAC permissions, audit logger, error handler
│   │   ├── routes/                 # Public endpoints, appointments, enquiries, coupons, users
│   │   └── server.js               # Express entrypoint running on port 4000
│   ├── database/
│   │   ├── schema.sql              # 32 Normalized MySQL tables with foreign keys
│   │   ├── seed.js                 # Database seeder populating all 14 datasets
│   │   └── skinfinity_derma_complete.sql # Complete 197 KB database dump
│   └── uploads/                    # Clinical media store (Multer file uploads)
│
├── admin/                          # Luxury Admin Dashboard Panel
│   ├── index.html                  # Executive clinic overview & KPI cards
│   ├── appointments.html           # Real-time appointment management & status workflow
│   ├── enquiries.html              # Leads management (Franchise, EMI, Diagnostic tools)
│   ├── coupons.html                # Offers & service-specific coupon code generator
│   ├── users.html                  # Staff accounts & RBAC role assignments
│   ├── treatments.html             # US-FDA treatments catalog management
│   ├── doctors.html                # Medical board doctor profiles
│   ├── banners.html                # Hero desktop & mobile responsive banners
│   ├── before-after.html           # Clinical patient photographic transformations
│   ├── reviews.html                # Verified Google reviews manager
│   ├── settings.html               # Global clinic configuration & SEO controls
│   └── assets/                     # CSS stylesheets, JS controllers, SVG icons
│
└── docs/                           # Architecture specifications & API references
```

---

## ✨ Core Features

### 1. Public Clinical Portal (Frontend)
- **57 Pre-rendered SSG Routes**: Treatments, doctor bios, franchise opportunities, diagnostic tools, and clinical transformations.
- **Dynamic Homepage Hero Carousel**: Dedicated high-resolution **Desktop (3:1)** and **Mobile (3:4)** banners with responsive auto-switching.
- **Interactive Diagnostic Tools**:
  - Skin Analyser (Algorithm-backed FitzPatrick skin type scoring).
  - Hair Loss & Baldness Assessment (Norwood Grade 1-7 staging).
  - Laser Hair Reduction Session Estimator.
- **Cart & Dynamic Coupon Validation**: Real-time coupon verification against active database coupons (`validateCoupon` API) supporting percentage and flat discounts.
- **Zero-Downtime Fallback Architecture**: Every data-layer fetcher resolves gracefully to local static fallbacks if the API is offline.

### 2. Luxury Admin Dashboard Panel
- **Emerald / Deep Charcoal Medical Theme**: Glassmorphism cards, KPI counters, responsive mobile drawer, and role badges.
- **Appointments Workflow**: Live status transitions (`pending` → `confirmed` → `completed` → `cancelled`) with payment transaction tracing.
- **Leads & Enquiries Management**: Filterable inbox for general contact, franchise applications, and EMI financing inquiries.
- **Promo Code Engine**: Configure promo codes with discount types (`percent` / `flat`), expiry dates, usage limits, and service-specific restrictions.

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

Permissions are enforced at both the API middleware layer and the UI navigation layer:

| Module / Permission | Super Admin | Clinic Admin | SEO Executive | Developer | Front Desk |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Executive Dashboard** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Appointments (View / Edit)** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Enquiries & Leads (View / Edit)** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Treatments Catalog (CRUD)** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Doctor Profiles (CRUD)** | ✅ | ✅ | ✅ | ❌ | View Only |
| **Coupons & Offers (CRUD)** | ✅ | ✅ | ❌ | ❌ | View Only |
| **Hero Banners (CRUD)** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Before / After Results** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Verified Reviews** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Staff & User Roles (RBAC)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Clinic System Settings** | ✅ | ✅ | ❌ | ✅ | ❌ |

---

## 🗄️ Database Architecture

The database `skinfinity_derma` contains **32 normalized relational tables**:

```sql
-- Core Catalog & Operations Tables
roles, permissions, role_permissions, users
clinics, doctors, doctor_specialties
categories, concerns, treatments, treatment_concerns
hero_banners, offers, coupons, coupon_usages
appointments, appointment_status_history
enquiries, enquiry_notes
patient_reviews, patient_stories, videos
results_transformations, results_gallery, gallery_items
faqs, media_press, site_settings, site_stats, navigation_menus, content_blocks, seo_pages
```

---

## 🔌 REST API Specifications

### Public Endpoints (`/api/public/*`)
- `GET  /api/public/site` — Global clinic settings, locations, navigation menus, and stats.
- `GET  /api/public/banners` — Active hero banners for desktop and mobile.
- `GET  /api/public/treatments` — Complete treatments catalog with category filtering.
- `GET  /api/public/doctors` — Certified dermatologists and availability.
- `GET  /api/public/reviews` — Verified patient reviews and Google rating summary.
- `POST /api/public/coupons/validate` — Validate promo code and calculate discount.
- `POST /api/public/appointments` — Book an appointment slot.
- `POST /api/public/enquiries` — Submit lead (Franchise, EMI, or Diagnostic tool).

### Protected Staff & RBAC Endpoints (`/api/*`)
- `POST /api/auth/login` — Authenticate staff account & issue JWT.
- `GET  /api/auth/me` — Retrieve current user profile and permission list.
- `GET  /api/appointments` — Query clinic bookings with search and status filters.
- `PUT  /api/appointments/:id` — Update appointment status and notes.
- `GET  /api/enquiries` — Filter incoming leads across channels.
- `GET  /api/users` — List staff accounts with assigned roles (Super Admin only).
- `POST /api/users` — Create staff account and assign RBAC role (Super Admin only).

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js 18+ installed
- MySQL or MariaDB running on port 3306

### 1. Database Setup
```bash
# Connect to MySQL and import the complete schema & seed dataset
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS skinfinity_derma;"
mysql -u root -p skinfinity_derma < backend/database/skinfinity_derma_complete.sql
```

### 2. Backend API & Admin Setup
```bash
cd backend
npm install
node src/server.js
# Backend API & Admin Dashboard will be running on http://localhost:4000
```

### 3. Frontend Portal Setup
```bash
cd frontend
npm install
npm run build
npm start
# Public Portal will be running on http://localhost:3000
```

---

## 🔐 Default Login Credentials

All accounts are pre-seeded in the database:

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@skinfinityderma.com` | `admin123` |
| **Clinic Admin** | `admin@skinfinityderma.com` | `admin123` |
| **SEO Executive** | `seo@skinfinityderma.com` | `admin123` |
| **Technical Developer** | `dev@skinfinityderma.com` | `admin123` |
| **Front Desk Reception** | `reception@skinfinityderma.com` | `admin123` |

> *Tip: Use the clickable Quick-Fill Role Pills on the [Admin Login Page](http://localhost:4000/login.html) to test each role instantly.*

---

## 📦 Production Deployment

- **Frontend**: Can be deployed on Vercel, AWS Amplify, or a standalone Node.js server using `npm run build && npm start`.
- **Backend**: Can be containerized with Docker or deployed to any Linux VPS (Ubuntu/Nginx) using PM2.
- **Database**: Compatible with AWS RDS MySQL, Google Cloud SQL, or DigitalOcean Managed MySQL.

---

## 📄 License

This repository is maintained for **Skinfinity Derma Clinics**. All clinical content, branding assets, and photography belong to their respective owners.
