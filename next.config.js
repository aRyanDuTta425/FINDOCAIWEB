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

    // Optimize chunk loading and prevent chunk errors
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      },
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

    // Improve module resolution for lucide-react and other packages
    config.resolve.alias = {
      ...config.resolve.alias,
      'lucide-react': require.resolve('lucide-react'),
    };

    // Add plugin to handle undefined modules gracefully
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.__NEXT_OPTIMIZE_FONTS': JSON.stringify(false),
      })
    );

    return config;
  },
  // Add output configuration for better chunk handling
  output: 'standalone',
  // Disable source maps in production to reduce chunk size
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
