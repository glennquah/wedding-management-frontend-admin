'use client';

import { useEffect } from 'react';

import SuperAdminDashboardModule from './components/SuperAdminDashboardModule';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
    }
  }, [session?.user, router]);

  if (!session?.user) {
    return null;
  }

  return <SuperAdminDashboardModule />;
}
