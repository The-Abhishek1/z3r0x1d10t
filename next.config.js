/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  serverExternalPackages: [],
  async rewrites() {
    return [
      { source: '/sw.js', destination: '/api/sw' },
    ]
  },
}
module.exports = nextConfig