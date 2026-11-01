/**
 * Shared types for the public-website API payloads (see docs/PUBLIC_API.md).
 * Payload shapes deliberately mirror the static data in `@/data/clinicData` and `@/data/treatmentsCatalog`.
 */

export interface MenuItem {
  id?: number | string;
  label: string;
  url: string;
  icon?: string | null;
  badge?: string | null;
  newTab?: boolean;
  meta?: Record<string, any> | null;
  children?: MenuItem[];
}

export interface SiteSettings {
  clinicName: string;
  tagline: string;
  phone: string;
  altPhone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  logo: string;
  favicon: string;
  social: {
    instagram: string;
    facebook: string;
    youtube: string;
    twitter: string;
    linkedin: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
    ogImage: string;
    siteUrl: string;
  };
  reviews: {
    rating: number | string;
    reviewCount: string;
    writeReviewUrl: string;
  };
  scripts: { head: string; body: string };
}

export interface ApiClinic {
  id?: number | string;
  slug?: string;
  city: string;
  title: string;
  address: string;
  landmark: string;
  pincode: string;
  phones: string[];
  email: string;
  hours: string;
  mapEmbedUrl: string;
  highlights: string[];
  whatsapp?: string;
  mapLink?: string;
  image?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
}

export interface SiteStats {
  reviewsCount: string;
  rating: string;
  yearsOfExcellence: string;
  totalPatients: string;
  expertDermatologists: string;
  successfulProcedures: string;
  safetyStandards: string;
  [key: string]: string;
}

export interface SiteData {
  settings: SiteSettings;
  stats: SiteStats;
  clinics: ApiClinic[];
  menus: Record<string, MenuItem[]>;
  blocks: Record<string, any>;
}

export interface ApiBanner {
  id?: number | string;
  title?: string;
  subtitle?: string;
  desktopImage: string;
  mobileImage: string;
  altText?: string;
  buttonText?: string;
  buttonUrl?: string;
  linkUrl?: string;
  location?: string;
  displayOrder?: number;
  meta?: Record<string, any> | null;
}

export interface ApiReview {
  id: number | string;
  patientName: string;
  treatment: string;
  rating: number;
  clinicLocation: string;
  reviewText: string;
  verified: boolean;
  initials?: string;
  avatar?: string;
  source?: string;
  reviewDate?: string;
}

export interface ReviewStats {
  rating: number | string;
  reviewCount: string;
  writeReviewUrl?: string;
}

export interface ApiVideo {
  id: number | string;
  title: string;
  category: string;
  videoId: string;
  thumbnail?: string;
  doctor: string;
  type?: "doctor_video" | "patient_story" | "short" | string;
  quote?: string;
  rating?: number;
}

export interface ApiOffer {
  id: number | string;
  title: string;
  badge: string;
  desc: string;
  image: string;
  linkText: string;
  slug: string;
  couponCode?: string | null;
  validTo?: string | null;
  treatmentSlugs?: string[];
  category?: string;
}

export interface ApiPress {
  title: string;
  outlet: string;
  date: string;
  doctor: string;
  type: string;
  image: string;
  thumbnail: string;
  link: string;
  videoId: string;
  shortDesc?: string;
}

export interface ApiFaq {
  id?: number | string;
  scope?: string;
  question: string;
  answer: string;
}

export interface ApiSeo {
  title?: string;
  description?: string;
  keywords?: string | string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  robots?: string;
  schema?: any;
}

export interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

export interface SlotsResponse {
  date: string;
  clinicId: number | string;
  closed: boolean;
  slots: { time: string; label: string; available: boolean }[];
}

export interface AppointmentPayload {
  name?: string;
  patientName?: string;
  phone?: string;
  patientPhone?: string;
  email?: string;
  patientEmail?: string;
  gender?: string;
  age?: number;
  clinic?: string;
  clinicBranch?: string;
  clinicId?: number | string;
  doctor?: string;
  doctorName?: string;
  treatmentSlug?: string;
  service?: string;
  treatmentName?: string;
  date?: string;
  appointmentDate?: string;
  time?: string;
  timeSlot?: string;
  visitType?: string;
  notes?: string;
  couponCode?: string;
  source?: string;
  paymentStatus?: string;
  transactionId?: string;
  amount?: number;
}

export type EnquiryType =
  | "contact"
  | "appointment_callback"
  | "emi"
  | "franchise"
  | "membership"
  | "skin_analysis"
  | "hair_graft"
  | "laser_estimate"
  | "other";

export interface EnquiryPayload {
  type: EnquiryType;
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  location?: string;
  subject?: string;
  message?: string;
  service?: string;
  treatmentSlug?: string;
  source?: string;
  extra?: Record<string, any>;
}

export interface CouponResult {
  valid: boolean;
  code: string;
  discountType?: string;
  discountValue?: number;
  discountPercent?: number;
  discountAmount?: number;
  finalAmount?: number;
  message?: string;
}

export interface HomepageSection {
  title: string;
  subtitle?: string | null;
  badgeText?: string | null;
  description?: string | null;
  mediaUrl?: string | null;
  mediaAlt?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonUrl?: string | null;
  extra?: Record<string, any>;
}

export interface HomepageItem {
  id: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  statValue?: string | null;
  statLabel?: string | null;
  tag?: string | null;
  linkUrl?: string | null;
  displayOrder?: number;
}

export interface HomepageData {
  sections?: Record<string, HomepageSection>;
  trustBadges?: HomepageItem[];
  aboutClinic?: {
    title?: string;
    subtitle?: string;
    badgeText?: string;
    description?: string;
    mediaUrl?: string;
    mediaAlt?: string;
    buttonText?: string;
    buttonUrl?: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
    extra?: any;
    isActive?: boolean;
    stats?: { value: string; label: string }[];
    pillars?: HomepageItem[];
    section?: HomepageSection;
  } | null;
  doctorFounder?: {
    title?: string;
    subtitle?: string;
    badgeText?: string;
    description?: string;
    mediaUrl?: string;
    mediaAlt?: string;
    buttonText?: string;
    buttonUrl?: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
    extra?: any;
    isActive?: boolean;
    qualifications?: string;
    experience?: string;
    subDescription?: string;
    missCurvy?: {
      title?: string;
      subtitle?: string;
      tagline?: string;
      image?: string;
    };
    highlights?: string[];
    founder?: any;
    doctors?: any[];
    awards?: HomepageItem[];
  } | null;
  diagnosticTools?: HomepageSection | null;
  franchiseBanner?: HomepageSection | null;
  clinics?: ApiClinic[];
}

export interface DynamicPage {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  bannerImage?: string;
  content?: string;
  metaTitle?: string;
  metaDesc?: string;
  sections?: {
    id: number;
    title: string;
    sectionType: string;
    content?: string;
    mediaUrl?: string;
    displayOrder: number;
  }[];
}

export interface DedicatedService {
  id: number;
  slug: string;
  title: string;
  shortDesc?: string;
  fullDesc?: string;
  categoryName?: string;
  bannerImage?: string;
  icon?: string;
  priceStarting?: number;
  benefits?: string[];
  procedureSteps?: string[];
  primaryCtaText?: string;
  primaryCtaUrl?: string;
}

export interface ApiBlog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  featuredImage?: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  authorName?: string;
  tags?: string[];
  publishedAt?: string;
  createdAt?: string;
}

export interface BlogListResponse {
  blogs: ApiBlog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

