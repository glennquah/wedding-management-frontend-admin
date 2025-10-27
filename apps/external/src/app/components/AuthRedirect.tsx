'use client';

import { useEffect } from 'react';

import { UserRole } from '@shared/api';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

export function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while session is loading
    if (status === 'loading') {
      return;
    }

    if (session?.user) {
      // Define public paths that should not trigger role-based redirects
      const publicPaths = ['/', '/login', '/forgot-password', '/reset-password', '/get-started', '/essentials', '/the-big-day', '/for-businesses', '/guest-&-vendor'];

      // Check if pathname matches public paths or starts with /cashgift
      if (pathname && (publicPaths.includes(pathname) || pathname.startsWith('/cashgift'))) {
        return;
      }

      if (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.VENDOR) {
        return router.push('/login');
      }

      if (pathname && !pathname.startsWith(`/${session.user.role.toLowerCase()}`) && !pathname.startsWith('/cashgift')) {
        return router.push(`/${session.user.role.toLowerCase()}`);
      }
    }
  }, [session, status, pathname, router]);

  return null;
}
