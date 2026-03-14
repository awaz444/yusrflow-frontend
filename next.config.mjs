/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // THIS IS CRITICAL FOR DOCKER
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig