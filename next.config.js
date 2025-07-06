/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['tesseract.js', 'canvas'],
    // Temporarily disable webpackBuildWorker to fix build issues
    // webpackBuildWorker: true,
  },
  webpack: (config, { isServer }) => {
    // Allow WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Add rule for WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Add fallback for Node.js modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
  // Optimize for Vercel deployment
  output: 'standalone',
  poweredByHeader: false,
  trailingSlash: false,
}

module.exports = nextConfig
