/**
 * Data layer for the public website.
 *
 * - Server + client safe typed fetch helpers for `GET /api/public/*`.
 * - Every helper resolves to `null` on ANY failure (network error, timeout, non-2xx, malformed JSON)
 *   so callers can fall back to the static data that ships with the app. The UI is therefore
 *   pixel-identical whether the API is up (seeded data) or unreachable.
 * - Server reads use ISR (`next: { revalidate: 60 }`); browser writes (forms, coupons, slots) never throw.
 */
import type { RichTreatment } from "@/data/treatmentsCatalog";
import type { Doctor, RealResult } from "@/data/clinicData";
import type {
  ApiBanner,
  ApiClinic,
  ApiFaq,
  ApiOffer,
  ApiPress,
  ApiReview,
  ApiSeo,
  ApiVideo,
  AppointmentPayload,
  CouponResult,
  EnquiryPayload,
  ReviewStats,
  SitemapEntry,
  SiteData,
  SlotsResponse,
  HomepageData,
  DynamicPage,
  DedicatedService,
  ApiBlog,
  BlogListResponse,
} from "./types";

const DEFAULT_API = "http://localhost:4000/api/public";

const SERVER_BASE = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API).replace(/\/+$/, "");
const PUBLIC_BASE = (process.env.NEXT_PUBLIC_API_URL || SERVER_BASE).replace(/\/+$/, "");

/** Base URL used by the current runtime (server => internal URL, browser => public URL). */
export const API_BASE = typeof window === "undefined" ? SERVER_BASE : PUBLIC_BASE;

export const REVALIDATE_SECONDS = 60;
const TIMEOUT_MS = 6000;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.skinfinityderma.com").replace(/\/+$/, "");

/* ------------------------------------------------------------------------- */
/* Media URL handling                                                        */
/* ------------------------------------------------------------------------- */

let MEDIA_ORIGIN = "";
try {
  MEDIA_ORIGIN = new URL(PUBLIC_BASE).origin;
} catch {
  MEDIA_ORIGIN = "http://localhost:4000";
}

/** `/uploads/x.webp` lives on the API host; `/images/..` and absolute URLs are returned untouched. */
export function mediaUrl<T>(src: T): T {
  if (typeof src === "string" && src.startsWith("/uploads/")) {
    return (MEDIA_ORIGIN + src) as unknown as T;
  }
  return src;
}

function normalizeMedia<T>(value: T): T {
  if (typeof value === "string") return mediaUrl(value);
  if (Array.isArray(value)) return value.map((v) => normalizeMedia(v)) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = normalizeMedia(v);
    return out as T;
  }
  return value;
}

/* ------------------------------------------------------------------------- */
/* Core request helper                                                       */
/* ------------------------------------------------------------------------- */

interface ApiResult<T> {
  data: T;
  meta?: Record<string, any>;
}

async function request<T>(
  path: string,
  init: { method?: "GET" | "POST"; body?: unknown; revalidate?: number; timeout?: number } = {}
): Promise<ApiResult<T> | null> {
  const method = init.method || "GET";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), init.timeout ?? TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: method === "POST" ? { "Content-Type": "application/json", Accept: "application/json" } : { Accept: "application/json" },
      body: method === "POST" ? JSON.stringify(init.body ?? {}) : undefined,
      signal: controller.signal,
      ...(method === "GET"
        ? (init.revalidate === 0
            ? { cache: "no-store" as RequestCache }
            : { next: { revalidate: init.revalidate ?? REVALIDATE_SECONDS } })
        : { cache: "no-store" as RequestCache }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json || json.success === false) return null;
    return { data: normalizeMedia(json.data) as T, meta: json.meta };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function qs(params: Record<string, string | number | undefined | null>): string {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return q ? `?${q}` : "";
}

const num = (v: unknown, fallback = 0): number => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : fallback;
};
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/* ------------------------------------------------------------------------- */
/* Normalisers (MariaDB DECIMALs may arrive as strings, JSON columns may be null) */
/* ------------------------------------------------------------------------- */

export function normalizeTreatment(t: any): RichTreatment {
  return {
    ...t,
    id: String(t.id ?? t.slug),
    aliases: arr<string>(t.aliases),
    tags: arr<string>(t.tags),
    rating: num(t.rating, 4.9),
    reviewsCount: num(t.reviewsCount),
    price: num(t.price),
    emiMonths: num(t.emiMonths, 6),
    cardHighlights: arr<string>(t.cardHighlights),
    galleryImages: arr(t.galleryImages),
    howItWorksSteps: arr(t.howItWorksSteps),
    idealFor: arr<string>(t.idealFor),
    notIdealFor: arr<string>(t.notIdealFor),
    beforeTreatment: arr<string>(t.beforeTreatment),
    afterTreatment: arr<string>(t.afterTreatment),
    faqs: arr(t.faqs),
  } as RichTreatment;
}

export function normalizeDoctor(d: any): Doctor {
  const locations = arr<string>(d.availableLocations);
  return {
    ...d,
    id: String(d.id ?? d.slug),
    slug: String(d.slug ?? d.id),
    consultationFee: num(d.consultationFee, 1000),
    availableLocations: (locations.length ? locations : ["Noida", "Gurgaon"]) as Doctor["availableLocations"],
  } as Doctor;
}

function normalizeClinic(c: any): ApiClinic {
  return {
    ...c,
    phones: arr<string>(c.phones),
    highlights: arr<string>(c.highlights),
  } as ApiClinic;
}

function normalizeSite(raw: any): SiteData {
  return {
    settings: (raw?.settings || {}) as SiteData["settings"],
    stats: (raw?.stats || {}) as SiteData["stats"],
    clinics: arr<any>(raw?.clinics).map(normalizeClinic),
    menus: Object.fromEntries(
      Object.entries(raw?.menus || {}).map(([k, v]) => [k, arr(v)])
    ) as SiteData["menus"],
    blocks: (raw?.blocks || {}) as SiteData["blocks"],
  };
}

/* ------------------------------------------------------------------------- */
/* Server-side readers (ISR, null on failure)                                */
/* ------------------------------------------------------------------------- */

export async function getSite(): Promise<SiteData | null> {
  const r = await request<any>("/site");
  return r ? normalizeSite(r.data) : null;
}

export async function getBanners(location?: string): Promise<ApiBanner[] | null> {
  const r = await request<ApiBanner[]>(`/banners`, { revalidate: 0 });
  return r && Array.isArray(r.data) ? r.data : null;
}

export async function getCategories(): Promise<{ id: string; name: string; slug: string; description?: string; thumbnail?: string; displayOrder?: number }[] | null> {
  const r = await request<any[]>("/categories", { revalidate: 0 });
  return r && Array.isArray(r.data) ? r.data : null;
}

export async function getTrustBadges(): Promise<{ id: string; title: string; icon: string; displayOrder: number }[] | null> {
  const r = await request<{ id: string; title: string; icon: string; displayOrder: number }[]>(`/trust-badges`, { revalidate: 0 });
  return r && Array.isArray(r.data) ? r.data : null;
}

export async function getTreatments(params: { category?: string; featured?: boolean; limit?: number } = {}): Promise<RichTreatment[] | null> {
  const r = await request<any[]>(
    `/treatments${qs({ category: params.category, featured: params.featured ? 1 : undefined, limit: params.limit })}`
  );
  return r && Array.isArray(r.data) ? r.data.map(normalizeTreatment) : null;
}

export async function getTreatment(slug: string): Promise<{ treatment: RichTreatment; related: RichTreatment[] } | null> {
  const r = await request<any>(`/treatments/${encodeURIComponent(slug)}`);
  if (!r || !r.data) return null;
  const { related, ...rest } = r.data;
  return { treatment: normalizeTreatment(rest), related: arr<any>(related).map(normalizeTreatment) };
}

export async function getDoctors(): Promise<Doctor[] | null> {
  const r = await request<any[]>("/doctors");
  return r && Array.isArray(r.data) && r.data.length ? r.data.map(normalizeDoctor) : null;
}

export async function getReviews(): Promise<{ reviews: ApiReview[]; stats: ReviewStats | null } | null> {
  const r = await request<any[]>("/reviews");
  if (!r || !Array.isArray(r.data)) return null;
  return {
    reviews: r.data.map((x) => ({ ...x, rating: num(x.rating, 5), verified: x.verified !== false && x.verified !== 0 })),
    stats: (r.meta?.stats as ReviewStats) || null,
  };
}

export async function getResults(): Promise<RealResult[] | null> {
  const r = await request<RealResult[]>("/results");
  return r && Array.isArray(r.data) ? r.data : null;
}

export async function getVideos(type?: "doctor_video" | "patient_story" | "short"): Promise<ApiVideo[] | null> {
  const r = await request<ApiVideo[]>(`/videos${qs({ type })}`);
  return r && Array.isArray(r.data) ? r.data : null;
}

export async function getOffers(): Promise<ApiOffer[] | null> {
  const r = await request<ApiOffer[]>("/offers");
  return r && Array.isArray(r.data) ? r.data : null;
}

export async function getPress(): Promise<ApiPress[] | null> {
  const r = await request<ApiPress[]>("/press");
  return r && Array.isArray(r.data) ? r.data : null;
}

export async function getFaqs(scope = "home"): Promise<ApiFaq[] | null> {
  const r = await request<ApiFaq[]>(`/faqs${qs({ scope })}`);
  return r && Array.isArray(r.data) ? r.data : null;
}

export async function getSeo(path: string): Promise<ApiSeo | null> {
  const r = await request<ApiSeo | null>(`/seo${qs({ path })}`);
  return r && r.data && typeof r.data === "object" ? r.data : null;
}

export async function getBlock<T = any>(key: string): Promise<T | null> {
  const r = await request<T>(`/blocks/${encodeURIComponent(key)}`);
  return r && r.data !== undefined && r.data !== null ? r.data : null;
}

/** Fetches several blocks in parallel; missing / failing keys are simply omitted. */
export async function getBlocks(keys: string[]): Promise<Record<string, any>> {
  const entries = await Promise.all(keys.map(async (k) => [k, await getBlock(k)] as const));
  return Object.fromEntries(entries.filter(([, v]) => v !== null));
}

export async function getSitemap(): Promise<SitemapEntry[] | null> {
  const r = await request<SitemapEntry[]>("/sitemap", { timeout: 4000 });
  return r && Array.isArray(r.data) && r.data.length ? r.data : null;
}

export async function getGallery(): Promise<any[] | null> {
  const r = await request<any[]>("/gallery");
  return r && Array.isArray(r.data) ? r.data : null;
}

export async function getHomepageData(): Promise<HomepageData | null> {
  const r = await request<HomepageData>("/homepage");
  return r && r.data ? r.data : null;
}

export async function getLocations(): Promise<ApiClinic[] | null> {
  const r = await request<ApiClinic[]>("/locations");
  return r && Array.isArray(r.data) ? r.data.map(normalizeClinic) : null;
}

export async function getLocation(slug: string): Promise<any | null> {
  const r = await request<any>(`/locations/${encodeURIComponent(slug)}`);
  return r && r.data ? r.data : null;
}

export async function getDedicatedServices(): Promise<DedicatedService[] | null> {
  const r = await request<DedicatedService[]>("/services");
  return r && Array.isArray(r.data) ? r.data : null;
}

export async function getDedicatedService(slug: string): Promise<DedicatedService | null> {
  const r = await request<DedicatedService>(`/services/${encodeURIComponent(slug)}`);
  return r && r.data ? r.data : null;
}

export async function getDynamicPage(slug: string): Promise<DynamicPage | null> {
  const r = await request<DynamicPage>(`/pages/${encodeURIComponent(slug)}`);
  return r && r.data ? r.data : null;
}

export async function getBlogs(params: {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<BlogListResponse | null> {
  const queryStr = qs({
    category: params.category,
    tag: params.tag,
    search: params.search,
    page: params.page,
    limit: params.limit,
  });
  const r = await request<ApiBlog[]>(`/blogs${queryStr}`, { revalidate: 60 });
  if (r && Array.isArray(r.data)) {
    return {
      blogs: r.data,
      total: r.meta?.total || r.data.length,
      page: r.meta?.page || 1,
      limit: r.meta?.limit || params.limit || 30,
      totalPages: r.meta?.totalPages || 1,
    };
  }
  return null;
}

export async function getBlog(slug: string): Promise<ApiBlog | null> {
  const r = await request<ApiBlog>(`/blogs/${encodeURIComponent(slug)}`, { revalidate: 60 });
  return r && r.data ? r.data : null;
}

/* ------------------------------------------------------------------------- */
/* Client writers (never throw, never block the UI)                          */
/* ------------------------------------------------------------------------- */

export async function postAppointment(
  payload: AppointmentPayload
): Promise<{ appointmentNo: string; status: string; discountAmount?: number } | null> {
  const r = await request<{ appointmentNo: string; status: string; discountAmount?: number }>("/appointments", {
    method: "POST",
    body: payload,
    timeout: 6000,
  });
  return r ? r.data : null;
}

export async function postEnquiry(payload: EnquiryPayload): Promise<{ enquiryNo: string } | null> {
  const r = await request<{ enquiryNo: string }>("/enquiries", { method: "POST", body: payload, timeout: 6000 });
  return r ? r.data : null;
}

export async function validateCoupon(body: {
  code: string;
  treatmentSlugs?: string[];
  subtotal?: number;
}): Promise<CouponResult | null> {
  const r = await request<CouponResult>("/coupons/validate", { method: "POST", body, timeout: 4000 });
  return r ? r.data : null;
}

export async function getSlots(clinicId: number | string, date: string): Promise<SlotsResponse | null> {
  const r = await request<SlotsResponse>(`/appointments/slots${qs({ clinicId, date })}`, { revalidate: 0, timeout: 4000 });
  return r ? r.data : null;
}

/* ------------------------------------------------------------------------- */
/* Small shared helpers                                                      */
/* ------------------------------------------------------------------------- */

/** "11:30 AM" / "01:00 PM" -> "11:30" / "13:00" (API expects 24h HH:mm). */
export function to24h(label: string): string {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec((label || "").trim());
  if (!m) return label;
  let h = parseInt(m[1], 10);
  const mer = (m[3] || "").toUpperCase();
  if (mer === "PM" && h < 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}
