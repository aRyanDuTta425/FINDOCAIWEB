/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['tesseract.js', 'canvas'],
    // Disable build optimization that might trigger micromatch issues
    optimizePackageImports: [],
  },
  // Remove output: 'standalone' as it can cause build trace issues
  // output: 'standalone',
  
  // Explicitly configure webpack to avoid micromatch issues
  webpack: (config, { isServer }) => {
    // Ignore specific patterns that might cause micromatch recursion
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.next/**',
        '**/public/eng.traineddata',
        '**/*.traineddata',
        '**/temp/**',
        '**/tmp/**',
        '**/.cache/**',
      ],
    }
    
    return config
  },
}

module.exports = nextConfig
