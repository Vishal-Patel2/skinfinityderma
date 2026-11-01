# 🚀 Skinfinity Derma — Complete Hostinger Deployment Guide

This guide provides a step-by-step walkthrough to deploy the entire **Skinfinity Derma** platform (Next.js Frontend, Node.js/Express Backend, Admin CMS, and MariaDB/MySQL Database) on **Hostinger**.

---

## 🏗 System Architecture Overview

| Component | Technology | Default Port | Production Role |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router, Tailwind, SSR) | `3000` | Main Website (`https://www.skinfinityderma.com`) |
| **Backend API** | Node.js / Express (REST API + Uploads) | `4000` | Public API & Admin Backend (`https://api.skinfinityderma.com`) |
| **Admin Panel** | HTML5 / Bootstrap 5 / Vanilla JS CMS | via Backend | Hosted on Backend (`/admin` or `https://api.skinfinityderma.com`) |
| **Database** | MariaDB / MySQL 8.x | `3306` | Relational Store (`skinfinity_derma_production_latest.sql`) |

---

## 🗄 STEP 1: Database Setup on Hostinger (phpMyAdmin)

1. Log in to your **Hostinger hPanel** (`hpanel.hostinger.com`).
2. Go to **Databases** $\rightarrow$ **Management**.
3. Create a new MySQL Database:
   - **Database Name**: e.g., `u123456789_skinfinity`
   - **Database Username**: e.g., `u123456789_admin`
   - **Password**: *(create a strong password and save it securely)*
4. Once created, click **Enter phpMyAdmin** next to your database.
5. In phpMyAdmin, click on your database name on the left sidebar.
6. Click the **Import** tab at the top.
7. Click **Choose File** and select:
   ```
   backend/database/skinfinity_derma_production_latest.sql
   ```
   *(This 13.3 MB export contains all 455 blogs, treatments, categories, doctor profiles, and admin roles).*
8. Click **Import** at the bottom.
9. Verify that all `sid_*` tables (`sid_blogs`, `sid_doctors`, `sid_treatments`, etc.) appear with green checkmarks.

---

## ⚙️ STEP 2: Configure Environment Variables

### A. Backend Environment (`backend/.env`)
On your Hostinger server inside the `backend/` directory, create or edit `.env`:

```env
NODE_ENV=production
PORT=4000

# Hostinger Database Credentials (from Step 1)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=u123456789_admin
DB_PASSWORD=YourStrongDatabasePasswordHere
DB_NAME=u123456789_skinfinity

# JWT Authentication Secret
JWT_SECRET=b7f22ccdf1b8299b666e5aa18f2e1482329e83a0a97d9da114b1290edc76df85ed935c346b8c0ebb2c06d045f5dc72a6
JWT_EXPIRES_IN=12h

# Allowed Origins (Include your actual production domain)
CORS_ORIGINS=https://www.skinfinityderma.com,https://skinfinityderma.com,http://localhost:3000

# Public URL of the backend API
PUBLIC_BASE_URL=https://api.skinfinityderma.com
UPLOADS_DIR=uploads
```

---

### B. Frontend Environment (`frontend/.env.production` or `.env.local`)
Inside the `frontend/` directory on the server:

```env
# Point to your production backend API domain
NEXT_PUBLIC_API_URL=https://api.skinfinityderma.com/api/public
API_URL=https://api.skinfinityderma.com/api/public

# Canonical domain
NEXT_PUBLIC_SITE_URL=https://www.skinfinityderma.com
```

---

## 🖥 STEP 3: Deployment Option A — Hostinger VPS (Recommended)

Hostinger VPS gives you maximum speed, automatic SSL, and dedicated control with PM2 and Nginx.

### 1. Connect to VPS via SSH
```bash
ssh root@your_server_ip
```

### 2. Install Node.js (v20 LTS), PM2 & Nginx
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
```

### 3. Clone or Upload the Code
```bash
cd /var/www
git clone <your-repo-url> skinfinityderma
cd skinfinityderma
```
*(Or upload the project folder via SFTP / FileZilla).*

### 4. Install Dependencies & Build
```bash
# Backend Setup
cd /var/www/skinfinityderma/backend
npm install --omit=dev

# Frontend Setup & Production Build
cd /var/www/skinfinityderma/frontend
npm install
npm run build
```

### 5. Start Both Apps with PM2
In the root directory `/var/www/skinfinityderma`:
```bash
cd /var/www/skinfinityderma
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```
Check running processes:
```bash
pm2 status
```

### 6. Configure Nginx Reverse Proxy
Edit `/etc/nginx/sites-available/skinfinityderma`:

```nginx
# 1. Main Website Frontend (Next.js on Port 3000)
server {
    server_name skinfinityderma.com www.skinfinityderma.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 2. Backend REST API & Admin CMS (Express on Port 4000)
server {
    server_name api.skinfinityderma.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site & reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/skinfinityderma /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Free SSL Certificate (Certbot Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d skinfinityderma.com -d www.skinfinityderma.com -d api.skinfinityderma.com
```

---

## 🌐 STEP 4: Deployment Option B — Hostinger Cloud / Shared Web Hosting (hPanel Node.js)

If you are using Hostinger Cloud/Shared hosting with the **Node.js** selector:

1. **Upload Files**:
   - Compress `backend/` and `frontend/` into zip files (exclude `node_modules` and `.next`).
   - In hPanel **File Manager**, upload and extract to `public_html` or designated subfolders.
2. **Setup Backend**:
   - In hPanel, go to **Websites** $\rightarrow$ **Node.js**.
   - Create App for Backend:
     - **Node version**: 20.x
     - **Application root**: `backend`
     - **Application startup file**: `src/server.js`
   - Run `npm install` via the hPanel terminal or button.
3. **Setup Frontend**:
   - Create Node.js app for `frontend`:
     - **Application root**: `frontend`
     - **Application startup file**: `node_modules/next/dist/bin/next` with argument `start`
   - Or deploy the frontend to **Vercel** (`vercel.com`) for free in 1-click while keeping your backend & DB on Hostinger!

---

## 🔒 Post-Deployment Checklist

- [ ] Database imported cleanly with 455 blogs and treatments.
- [ ] Backend running and accessible at `https://api.yourdomain.com/api/public/site`.
- [ ] Admin Dashboard login works at `https://api.yourdomain.com/index.html` (or `/admin`).
- [ ] Frontend loads with all doctor images, treatments, and blog posts.
- [ ] SSL certificate active (`https://` lock icon).
- [ ] Appointment booking test submission succeeds.
