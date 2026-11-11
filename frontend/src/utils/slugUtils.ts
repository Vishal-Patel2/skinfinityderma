/**
 * Utility for parsing treatment slugs and extracting base slug and dynamic location name.
 * 
 * Supports:
 * - /acne-pimple-treatment -> base: "acne-pimple-treatment", location: "", suffix: ""
 * - /acne-pimple-treatment-in-noida -> base: "acne-pimple-treatment", location: "Noida", suffix: "in Noida"
 * - /acne-pimple-treatment-in-gurugram -> base: "acne-pimple-treatment", location: "Gurugram", suffix: "in Gurugram"
 * - /acne-pimple-treatment-in-gurgaon -> base: "acne-pimple-treatment", location: "Gurgaon", suffix: "in Gurgaon"
 * - /acne-pimple-treatment-noida -> base: "acne-pimple-treatment", location: "Noida", suffix: "in Noida"
 * - /acne-pimple-treatment-gurugram -> base: "acne-pimple-treatment", location: "Gurugram", suffix: "in Gurugram"
 * - /acne-pimple-treatment-gurgaon -> base: "acne-pimple-treatment", location: "Gurgaon", suffix: "in Gurgaon"
 */

export interface ParsedTreatmentSlug {
  baseSlug: string;
  cityName: string;
  locationSuffix: string;
  isLocation: boolean;
}

export function formatCityName(raw: string): string {
  if (!raw) return "";
  const lower = raw.trim().toLowerCase();
  if (lower === "noida") return "Noida";
  if (lower === "gurugram") return "Gurugram";
  if (lower === "gurgaon") return "Gurgaon";
  if (lower === "delhi") return "Delhi";
  return raw
    .trim()
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function parseTreatmentSlug(slug: string): ParsedTreatmentSlug {
  if (!slug) {
    return { baseSlug: "", cityName: "", locationSuffix: "", isLocation: false };
  }

  const normalized = slug.trim().toLowerCase();

  // Pattern 1: <baseSlug>-in-<city> (e.g. acne-pimple-treatment-in-noida)
  const inMatch = normalized.match(/^(.*?)-in-([a-z0-9-]+)$/i);
  if (inMatch) {
    const baseSlug = inMatch[1];
    const rawCity = inMatch[2];
    const cityName = formatCityName(rawCity);
    return {
      baseSlug,
      cityName,
      locationSuffix: `in ${cityName}`,
      isLocation: true,
    };
  }

  // Pattern 2: <baseSlug>-<city> where city is noida, gurugram, gurgaon (e.g. acne-pimple-treatment-noida)
  const cityMatch = normalized.match(/^(.*?)-(noida|gurugram|gurgaon)$/i);
  if (cityMatch) {
    const baseSlug = cityMatch[1];
    const rawCity = cityMatch[2];
    const cityName = formatCityName(rawCity);
    return {
      baseSlug,
      cityName,
      locationSuffix: `in ${cityName}`,
      isLocation: true,
    };
  }

  return {
    baseSlug: normalized,
    cityName: "",
    locationSuffix: "",
    isLocation: false,
  };
}

/**
 * Normalizes a treatment name by removing any previous location suffix and appending the new one.
 */
export function formatDynamicTreatmentName(originalName: string, locationSuffix?: string): string {
  if (!originalName) return "";
  const cleanName = originalName
    .replace(/\s+in\s+(Noida|Gurgaon|Gurugram|[A-Za-z]+)$/i, "")
    .trim();
  if (!locationSuffix) {
    return cleanName;
  }
  return `${cleanName} ${locationSuffix}`.trim();
}
