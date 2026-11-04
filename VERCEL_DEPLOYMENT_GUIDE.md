# 🚀 Vercel Deployment Guide — Skinfinity Derma

This project is now structured and fully optimized for zero-config or dashboard deployment to **Vercel**.

---

## ⚡ Option 1: Direct Vercel Deployment (Recommended)

### Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** → **"Project"**.
3. Import your Git repository (`skinfinityderma`).

### Step 2: Configure Project Settings
- **Framework Preset**: Next.js (automatically detected)
- **Root Directory**: Select `frontend` (or leave default `/` since root `vercel.json` and `package.json` are now configured).
- **Build Command**: `next build` (or default)
- **Output Directory**: `.next` (or default)

### Step 3: Environment Variables
Add the following in the **Environment Variables** section:

| Variable | Description | Example Value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical public website URL | `https://www.skinfinityderma.com` (or your Vercel URL) |
| `NEXT_PUBLIC_API_URL` | Express Backend REST API endpoint | `https://api.skinfinityderma.com/api/public` (or leave empty to use static catalogs) |

> 💡 **Self-Contained Fallback Mode:**
> The Next.js frontend has built-in offline data catalogues for all 57+ clinical treatments, doctors, reviews, before/after cases, and clinic locations. Even if the backend API is temporarily offline, the site compiles and renders 100% of all pages cleanly without broken links.

---

## ⚡ Option 2: Deploying via Vercel CLI

If you use the Vercel CLI from your terminal:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy directly from repository root
vercel

# Deploy to production
vercel --prod
```

---

## 📁 Clean Repository Structure

```
skinfinityderma/
├── frontend/               # Next.js 14 App Router (57+ pre-rendered SSG pages)
│   ├── src/                # React components, pages, data layer
│   ├── public/             # Static clinical assets, logos, and sitemaps
│   └── vercel.json         # Vercel Next.js framework configuration
├── backend/                # Express.js REST API & MySQL Database Layer
│   ├── src/                # Controllers, auth, middleware & routes
│   └── database/           # Clean schema and database seed scripts
├── admin/                  # Clinic RBAC Dashboard (Bootstrap 5)
├── package.json            # Root workspace scripts for Vercel build
├── vercel.json             # Root Vercel build configuration
└── .gitignore              # Cleaned & optimized ignore rules
```
