/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['tesseract.js', 'canvas'],
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

    // Fix module resolution for problematic packages
    config.resolve.alias = {
      ...config.resolve.alias,
      'lucide-react': require.resolve('lucide-react'),
      'framer-motion': require.resolve('framer-motion'),
    };

    // Add specific module resolution to prevent circular dependency issues
    config.resolve.modules = [
      'node_modules',
      ...config.resolve.modules || []
    ];

    // Ensure ESM compatibility
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      '.js': ['.js', '.jsx', '.ts', '.tsx'],
    };

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
}

module.exports = nextConfig
