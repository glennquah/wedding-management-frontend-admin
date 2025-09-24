import { config } from 'dotenv';
import type { NextConfig } from 'next';
import path from 'path';

// Load .env from app's root directory
const envPath = path.resolve(__dirname, '.env');
console.log('🔍 Loading .env from:', envPath);
const result = config({ path: envPath });
if (result.error) {
  console.error('❌ Failed to load .env:', result.error);
} else {
  console.log('✅ .env loaded successfully');
  console.log('🔑 NEXTAUTH_SECRET present:', !!process.env.NEXTAUTH_SECRET);
}

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
