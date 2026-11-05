import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: { qualities: [75, 85] },
  experimental: { agentUpgrade: 'security' },
}

export default nextConfig
