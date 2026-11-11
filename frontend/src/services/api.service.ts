/**
 * Centralized API Client Service
 */

const RAW_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? `http://${window.location.hostname}:4000/api`
    : "http://localhost:4000/api");

export const API_BASE = RAW_API_BASE.replace(/\/+$/, "");

/**
 * Generic Fetch Wrapper with resilient error catching and JSON decoding
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    return json?.data !== undefined ? json.data : json;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[apiFetch] Request to ${url} failed:`, error);
    }
    return null;
  }
}
