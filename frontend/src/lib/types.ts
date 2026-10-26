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
