/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // THIS IS CRITICAL FOR DOCKER
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable Next.js image optimisation (WebP/AVIF conversion + proper sizing)
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  // Security headers: CSP, HSTS, COOP, XFO — addresses Lighthouse Best Practices
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "media-src 'self' https:",
              "frame-src https://www.youtube.com https://youtube.com",
              "connect-src 'self' https://api.yusrflow.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig