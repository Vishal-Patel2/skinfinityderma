# 🩺 Skinfinity Derma — Frontend Portal (Next.js 14)

This directory contains the public clinical portal built using **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**.

## ✨ Features
- **57 SSG Pages**: Pre-rendered clinical treatments, doctor bios, and results.
- **Dynamic Banners**: Device-aware desktop (3:1) and mobile (3:4) hero banners.
- **Interactive Tools**: Skin Analyser, Hair Loss Assessment, Laser Cost Estimator.
- **Cart & Promo Engine**: Real-time coupon validation against database API.
- **Data Layer**: Clean typed fetchers (`src/lib/api.ts`) with zero-downtime static fallbacks.

## 🚀 Running Locally
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build

# Start production server (port 3000)
npm run start -- -p 3000
```
