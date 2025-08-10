/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 420, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: 'https', hostname: 'ekransitesi.com' },
      { protocol: 'https', hostname: 'www.ekransitesi.com' },
    ],
  },
  // Optional: Hook bundle analyzer via env ANALYZE=true without affecting prod behavior
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/brands',
        destination: '/markalar',
        permanent: true,
      },
      {
        source: '/brands/:path*',
        destination: '/markalar/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      // HSTS sadece production'da anlamlı; burada ekliyoruz, dev ortamda etkisiz olabilir.
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self';",
      },
    ];

    return [
      // Global güvenlik başlıkları
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Statik varlıklar için uzun süreli önbellek
      {
        source: '/screens/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/site_logo/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/marka_logo/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/uploads/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

module.exports = nextConfig;



