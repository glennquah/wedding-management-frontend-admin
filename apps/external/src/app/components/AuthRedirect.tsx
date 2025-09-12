'use client';

import { useEffect } from 'react';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

export function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session?.user && pathname && !pathname.startsWith(`/${session.user.role}`)) {
      return router.push(`/${session.user.role}`);
    }
  }, [session, status, pathname, router]);

  return null;
}
