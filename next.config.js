/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['tesseract.js', 'canvas'],
  },
  // Use webpack configuration to avoid file tracing issues
  webpack: (config) => {
    // Disable webpack watch options that can cause issues with file patterns
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**']
    }
    return config
  },
}

module.exports = nextConfig
