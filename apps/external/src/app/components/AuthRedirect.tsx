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
    if (session?.user) {
      // Define public paths that should not trigger role-based redirects
      const publicPaths = ['/login', '/forgot-password', '/reset-password'];

      if (pathname && publicPaths.includes(pathname)) {
        return;
      }

      if (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.VENDOR) {
        return router.push('/login');
      }

      if (pathname && !pathname.startsWith(`/${session.user.role}`)) {
        return router.push(`/${session.user.role}`);
      }
    }
  }, [session, status, pathname, router]);

  return null;
}
