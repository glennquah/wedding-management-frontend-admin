import dotenv from 'dotenv';
import type { NextConfig } from 'next';
import path from 'path';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.resolve(__dirname, '.env') });
} else {
  dotenv.config({ path: path.resolve(__dirname, '.env.production') });
}

// Debug: Log environment variables to verify they're loaded
console.log('🔍 Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXTAUTH_SECRET present:', !!process.env.NEXTAUTH_SECRET);
console.log('NEXT_PUBLIC_NEXTAUTH_URL:', process.env.NEXT_PUBLIC_NEXTAUTH_URL);

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
