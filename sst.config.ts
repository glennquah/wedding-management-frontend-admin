/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'wedding-management',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    };
  },
  async run() {
    if (!process.env.NEXTAUTH_SECRET) {
      throw new Error('NEXTAUTH_SECRET must be set before deployment');
    }
    // External app (public-facing) - knotly.app
    const external = new sst.aws.Nextjs('WeddingExternal', {
      path: './apps/external',
      domain: {
        name: 'knotly.app',
        dns: sst.aws.dns({
          zone: 'Z04357572KS9QV60MMS6H',
        }),
      },
      environment: {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
        NEXTAUTH_URL: 'https://knotly.app',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        GITHUB_ID: process.env.GITHUB_ID || '',
        GITHUB_SECRET: process.env.GITHUB_SECRET || '',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
        NEXT_PUBLIC_CLOUDINARY_PRESET_NAME:
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || '',
      },
    });

    // Internal app (admin/management) - core.knotly.app
    const internal = new sst.aws.Nextjs('WeddingInternal', {
      path: './apps/internal',
      domain: {
        name: 'core.knotly.app',
        dns: sst.aws.dns({
          zone: 'Z04357572KS9QV60MMS6H',
        }),
      },
      environment: {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
        NEXTAUTH_URL: 'https://core.knotly.app',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        GITHUB_ID: process.env.GITHUB_ID || '',
        GITHUB_SECRET: process.env.GITHUB_SECRET || '',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
        NEXT_PUBLIC_CLOUDINARY_PRESET_NAME:
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || '',
      },
    });

    return {
      external: external.url,
      internal: internal.url,
    };
  },
});
