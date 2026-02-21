/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // ← ADD THIS LINE HERE
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

}

export default nextConfig