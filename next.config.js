/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracing: false,
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['tesseract.js', 'canvas', '@prisma/client', 'prisma'],
  },
  
  // Explicitly configure webpack to avoid issues
  webpack: (config, { isServer }) => {
    // Add externals for server-side only
    if (isServer) {
      config.externals.push('@prisma/client')
    }
    
    return config
  },
}

module.exports = nextConfig
