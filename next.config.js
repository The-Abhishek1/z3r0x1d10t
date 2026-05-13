/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
    // Allow GIFs and all formats without optimization stripping animation
    unoptimized: false,
    formats: ['image/webp'],
  },
  serverExternalPackages: [],
  async rewrites() {
    return [
      { source: '/sw.js', destination: '/api/sw' },
    ]
  },
}
module.exports = nextConfig
