import type { NextConfig } from 'next';
import path from 'path';
import { config } from 'dotenv';

// Load .env from app's root directory
config({ path: path.resolve(__dirname, '.env') });

const nextConfig: NextConfig = {
  trailingSlash: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shared': path.resolve(__dirname, '../../shared'),
    };
    return config;
  },
};

export default nextConfig;
