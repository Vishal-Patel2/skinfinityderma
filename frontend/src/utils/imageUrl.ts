/**
 * Skinfinity Derma — Centralized Frontend Image URL Utility
 * 
 * Safely resolves all dynamic and static image URLs across Vercel (frontend) 
 * and Render (backend / uploads).
 */

const DEFAULT_BACKEND_URL = "https://skinfinityderma.onrender.com";

function getBackendOrigin(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
  if (envUrl) {
    try {
      return new URL(envUrl).origin;
    } catch {
      // Ignore malformed URL
    }
  }
  return DEFAULT_BACKEND_URL;
}

export const BACKEND_ORIGIN = getBackendOrigin();

export const DEFAULT_FALLBACKS = {
  treatment: "/images/treatments/banner-laser.webp",
  bannerDesktop: "/images/banners/laser-banner-desktop.png",
  bannerMobile: "/images/banners/laser-banner-mobile.png",
  doctor: "/images/doctors/dr-ipshita-johri.webp",
  blog: "/images/treatments/banner-acne.webp",
  offer: "/images/treatments/banner-hydrafacial.webp",
  general: "/images/custom/clinic-reception.jpg",
  avatar: "/images/doctors/dr-ipshita-johri.webp",
};

/**
 * Clean & construct a reliable, safe image URL for Next/Image and <img> tags.
 * 
 * @param src - Raw image path, relative backend URL, absolute CDN URL, or null
 * @param fallback - Fallback asset path if src is missing or invalid
 * @returns Fully qualified, reachable image URL string
 */
export function getImageUrl(
  src: string | null | undefined,
  fallback: string = DEFAULT_FALLBACKS.treatment
): string {
  if (!src || typeof src !== "string") {
    return fallback;
  }

  const trimmed = src.trim();
  if (!trimmed) {
    return fallback;
  }

  // Handle data URIs untouched
  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  // Handle duplicated protocol/host prefixes (e.g. https://domain.comhttps://...)
  const doubleProtocolMatch = trimmed.match(/(https?:\/\/[^\/]+)(https?:\/\/.*)/i);
  if (doubleProtocolMatch) {
    return doubleProtocolMatch[2];
  }

  // Handle absolute URLs (Cloudinary, S3, YouTube, External CDN, Render)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const parsed = new URL(trimmed);
      // In production (on Vercel), replace accidental localhost/127.0.0.1 references with actual backend
      if (
        (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") &&
        parsed.pathname.startsWith("/uploads/")
      ) {
        return `${BACKEND_ORIGIN}${parsed.pathname}${parsed.search}`;
      }
      return trimmed;
    } catch {
      return fallback;
    }
  }

  // Permanent Next.js static assets shipped inside frontend/public/
  if (trimmed.startsWith("/images/") || trimmed.startsWith("/icons/") || trimmed.startsWith("/favicon")) {
    return trimmed;
  }
  if (trimmed.startsWith("images/")) {
    return `/${trimmed}`;
  }

  // Dynamic uploads served from Backend (Render)
  if (trimmed.startsWith("/uploads/")) {
    return `${BACKEND_ORIGIN}${trimmed}`;
  }
  if (trimmed.startsWith("uploads/")) {
    return `${BACKEND_ORIGIN}/${trimmed}`;
  }

  // If filename only with common image extension, treat as upload
  if (/^[a-z0-9_\-\.]+\.(jpg|jpeg|png|webp|svg|gif|avif)$/i.test(trimmed)) {
    return `${BACKEND_ORIGIN}/uploads/${trimmed}`;
  }

  // If path contains file extension or starts with slash
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  if (/\.(jpg|jpeg|png|webp|svg|gif|avif|mp4|webm)$/i.test(trimmed)) {
    return `/${trimmed}`;
  }

  // Not an image or URL path — return fallback
  return fallback;
}

/**
 * Resolves gallery item arrays cleanly
 */
export function resolveGalleryList(
  items: Array<{ src?: string; caption?: string } | string> | null | undefined,
  fallback: string = DEFAULT_FALLBACKS.treatment
): Array<{ src: string; caption: string }> {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  return items
    .map((item) => {
      const rawSrc = typeof item === "string" ? item : item?.src;
      const caption = typeof item === "object" && item ? item.caption || "" : "";
      return {
        src: getImageUrl(rawSrc, fallback),
        caption,
      };
    })
    .filter((i) => Boolean(i.src));
}
