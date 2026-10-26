# 🩺 Skinfinity Derma — Backend REST API & Database Layer

This directory contains the Node.js Express REST API and MySQL database configuration.

## ✨ Features
- **Express.js API**: Running on port `4000`.
- **MySQL/MariaDB Integration**: Connection pooling using `mysql2`.
- **JWT & RBAC Middleware**: Permission verification per role.
- **Static Admin Hosting**: Serves the Admin Dashboard at `http://localhost:4000/index.html`.
- **Multer Uploads**: File upload store at `uploads/`.

## 🗄️ Database Setup
```bash
# Import complete database schema and seed data
mysql -u root -p skinfinity_derma < database/skinfinity_derma_complete.sql
```

## 🚀 Running Locally
```bash
# Install dependencies
npm install

# Start server
node src/server.js
```
