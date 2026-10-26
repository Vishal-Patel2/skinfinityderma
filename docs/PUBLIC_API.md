# Skinfinity Derma — Public Website API (contract)

Base URL (dev): `http://localhost:4000/api/public`
All responses: `{ "success": true, "data": <payload>, "meta"?: {...} }`
Errors: `{ "success": false, "message": "..." }` with a proper HTTP status.
All `GET`s send `Cache-Control: public, max-age=60, stale-while-revalidate=300`.
Only **active** records are ever returned. Uploaded media lives under `http://localhost:4000/uploads/...`
(image fields may therefore be absolute URLs, `/uploads/...`, or `/images/...` paths that exist in `frontend/public`).

The payload shapes deliberately **mirror the existing static data in `frontend/src/data/clinicData.ts` and
`frontend/src/data/treatmentsCatalog.ts`**, so components can swap the static import for API data with no UI change.

| Endpoint | Payload shape |
|---|---|
| `GET /site` | `{ settings, stats, clinics, menus, blocks }` (see below) |
| `GET /banners?location=Homepage Hero` | `Banner[]` |
| `GET /categories` | `{id,name,slug,description,thumbnail}[]` |
| `GET /treatments?category=&featured=1&limit=` | `RichTreatment[]` (exactly the `RichTreatment` interface + `seoTitle,seoDescription,seoKeywords,ogImage,categoryId,isFeatured`) |
| `GET /treatments/:slug` | one `RichTreatment` (slug **or any alias** resolves) + `related: RichTreatment[]` (404 if none) |
| `GET /doctors` | `Doctor[]` (interface `Doctor` in clinicData.ts, `image` may be `/uploads/..`) |
| `GET /reviews` | `{id,patientName,treatment,rating,clinicLocation,reviewText,verified,initials,avatar,source,reviewDate}[]` ; `meta.stats = {rating,reviewCount,writeReviewUrl}` |
| `GET /results` | `RealResult[]` (only consent-approved before/after cases) |
| `GET /videos?type=doctor_video\|patient_story\|short` | `{id,title,category,videoId,thumbnail,doctor,type,quote,rating}[]` (`videoId` = YouTube id) |
| `GET /offers` | `{id,title,badge,desc,image,linkText,slug,couponCode,validTo,treatmentSlugs[]}[]` (`SPECIAL_OFFERS` shape + coupon info) |
| `GET /press` | `MEDIA_PRESS` item shape `{title,outlet,date,doctor,type,image,thumbnail,link,videoId}[]` |
| `GET /faqs?scope=home` | `{id,scope,question,answer}[]` |
| `GET /gallery` | `{id,image,title,altText,category}[]` |
| `GET /seo?path=/treatments` | `{title,description,keywords,ogTitle,ogDescription,ogImage,canonical,robots,schema}` or `null` |
| `GET /sitemap` | `{path,lastmod,changefreq,priority}[]` (static SEO pages + all active treatments `/<slug>`) |
| `GET /blocks/:key` | the JSON content of one content block |
| `GET /appointments/slots?clinicId=1&date=2026-11-05` | `{date,clinicId,closed,slots:[{time:"10:00",label:"10:00 AM",available:true}]}` |
| `POST /appointments` | body below → `{appointmentNo,status,discountAmount}` |
| `POST /enquiries` | body below → `{enquiryNo}` |
| `POST /coupons/validate` | body below → `{valid,code,discountType,discountValue,discountAmount,finalAmount,message}` |

## `GET /site`
```jsonc
{
  "settings": {
    "clinicName": "", "tagline": "", "phone": "", "altPhone": "", "whatsapp": "", "email": "",
    "address": "", "workingHours": "", "logo": "", "favicon": "",
    "social": { "instagram": "", "facebook": "", "youtube": "", "twitter": "", "linkedin": "" },
    "seo": { "defaultTitle": "", "defaultDescription": "", "keywords": ["..."], "ogImage": "", "siteUrl": "https://www.skinfinityderma.com" },
    "reviews": { "rating": 4.5, "reviewCount": "4,500+", "writeReviewUrl": "" },
    "scripts": { "head": "", "body": "" }          // analytics / pixels managed by developer role
  },
  "stats": { /* CLINIC_STATS shape */ },
  "clinics": [ /* ClinicLocation shape + id, slug, whatsapp, mapLink, image, latitude, longitude */ ],
  "menus": { "header_main": [MenuItem], "footer_company": [MenuItem], "footer_treatments": [MenuItem], "footer_legal": [MenuItem] },
  "blocks": { "home.brand_journey": [...], "home.membership_plans": [...], "home.partners": [...], "home.top_treatments": [...], "home.franchise": {...}, "home.blog_posts": [...] }
}
// MenuItem = { id, label, url, icon, badge, newTab, meta, children: MenuItem[] }
```
Menu keys and block keys are open-ended — the admin dashboard can create more. The frontend should always **fall back to its
current hard-coded value** when a key is missing or the API is unreachable.

## POST bodies
```jsonc
// POST /appointments
{ "name": "", "phone": "", "email": "", "gender": "Female", "age": 30,
  "clinic": "Noida" /* or clinic id / slug */, "doctor": "Dr. Ipshita Johri" /* name or slug, optional */,
  "treatmentSlug": "laser-hair-removal-noida" /* optional */, "service": "free text if no slug",
  "date": "2026-11-05", "time": "11:30", "visitType": "new", "notes": "", "couponCode": "", "source": "website-modal" }

// POST /enquiries   (contact form, EMI, franchise, membership, tools)
{ "type": "contact|appointment_callback|emi|franchise|membership|skin_analysis|hair_graft|laser_estimate|other",
  "name": "", "phone": "", "email": "", "city": "", "subject": "", "message": "",
  "treatmentSlug": "", "source": "page path or component", "extra": { /* any JSON, e.g. EMI amount, tool answers */ } }

// POST /coupons/validate
{ "code": "DERMA10", "treatmentSlugs": ["..."], "subtotal": 39999 }
```

## Seed files the frontend integration must produce
Put JSON in `backend/database/seeds/data/` (UTF-8). The backend seeder loads whichever exist:

* `menus.json` — `{ "header_main": [ {label,url,icon?,badge?,newTab?,meta?,children:[...]} ], "footer_company": [...], ... }`
  (taken **verbatim** from the current hard-coded Header/Footer so the dynamic site is identical on day one)
* `banners.json` — `[ {title,subtitle,desktopImage,mobileImage,altText,buttonText,buttonUrl,location,displayOrder,isActive,meta?} ]`
  (hero slides currently hard-coded in `HeroBannerCarousel`/`Hero`)
* `faqs.json` — `[ {scope,question,answer,displayOrder} ]`
* `site-blocks.json` — `{ "<block_key>": <any JSON> }` for every other hard-coded content section you turn dynamic
  (footer about text / copyright / contact strip, why-choose-us, services section copy, news strip, etc.)
* `settings-extra.json` — `{ "<setting_key>": <value> }` only if you need extra settings keys.
