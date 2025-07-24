import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",

  // Better handling of intercepting routes and modal components
  experimental: {
    optimizePackageImports: ["next-intl"],
    // Force proper route resolution for intercepting routes
    optimizeServerReact: false,
  },
  
  // Ensure proper route generation for intercepting routes
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "back.firststep-app.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "development.firststep-app.com",
        port: "",
      },
    ],
  },

  // Configure webpack for better chunk handling in GCP
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure consistent chunk naming for better caching
      config.output.chunkFilename = "static/chunks/[name].[contenthash].js";

      // Optimize chunk splitting for containerized environments
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // Vendor chunks for node_modules
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
          },
          // Common chunks for shared code
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 5,
            reuseExistingChunk: true,
          },
          // Next.js specific chunks
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "framework",
            chunks: "all",
            priority: 40,
          },
        },
      };

      // Improve module resolution for better reliability
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Add proper headers for static assets and API routes
  async headers() {
    return [
      {
        // Static assets caching
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Images caching
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Security headers for all pages
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Optimize for production deployment
  compress: true,
  poweredByHeader: false,

  // Better error handling in production
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
