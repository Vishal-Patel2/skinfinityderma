/** @type {import('next').NextConfig} */

// The public API (Express + MariaDB) also serves uploaded media from `/uploads/**`.
// Derive the media host from NEXT_PUBLIC_API_URL so production hosts work without code changes.
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000/api/public';

function apiRemotePatterns() {
  const patterns = [
    { protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/uploads/**' },
    { protocol: 'http', hostname: '127.0.0.1', port: '4000', pathname: '/uploads/**' },
  ];
  try {
    const u = new URL(API_URL);
    const protocol = u.protocol.replace(':', '');
    const exists = patterns.some((p) => p.hostname === u.hostname && (p.port || '') === (u.port || ''));
    if (!exists) {
      patterns.push({
        protocol,
        hostname: u.hostname,
        ...(u.port ? { port: u.port } : {}),
        pathname: '/uploads/**',
      });
    }
  } catch {
    /* ignore malformed URL */
  }
  return patterns;
}

const IMMUTABLE = 'public, max-age=31536000, immutable';

const nextConfig = {
  output: process.env.VERCEL ? undefined : 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Routes are served without a trailing slash (canonical URLs, sitemap and links all match).
  trailingSlash: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.skinfinityderma.com',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      ...apiRemotePatterns(),
    ],
  },
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
      {
        source: '/favicon.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: IMMUTABLE }],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
