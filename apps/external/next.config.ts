import dotenv from 'dotenv';
import type { NextConfig } from 'next';
import path from 'path';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.resolve(__dirname, '.env') });
} else {
  dotenv.config({ path: path.resolve(__dirname, '.env.production') });
}

const nextConfig: NextConfig = {
  experimental: {
    // Enable for better compatibility with OpenNext
    esmExternals: 'loose',
  },
  images: {
    // Configure for CloudFront/S3 compatibility
    unoptimized: process.env.NODE_ENV === 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'png.pngtree.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Ensure static assets work with CloudFront
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  trailingSlash: false,
  // Output configuration for OpenNext
  output: 'standalone',
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shared': path.resolve(__dirname, '../../shared'),
    };
    return config;
  },
};

export default nextConfig;
