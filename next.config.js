/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  // API routes configuration is handled differently in app directory
  experimental: {
    serverComponentsExternalPackages: ['tesseract.js', 'canvas'],
  },
  // Configure WebAssembly support
  webpack: (config, { isServer, webpack }) => {
    // Allow WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Add rule for WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    return config;
  },
}

module.exports = nextConfig
