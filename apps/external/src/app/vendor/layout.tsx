'use client';

import VendorSidebar from '../components/layout/VendorSidebar';
import { UserRole } from '@shared/api';
import NavigationBar from '@shared/components/NavigationBar';
import { SidebarProvider } from '@shared/components/ui/sidebar';
import { Toaster } from '@shared/components/ui/sonner';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log('Session status:', status, 'Session data:', session);

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div>Loading...</div>
      </main>
    );
  }

  if (!session || session.user.role !== UserRole.VENDOR) {
    console.log('Access denied - Session:', session);
    router.push('/login');
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <VendorSidebar />
      <div className="flex w-full h-screen overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <NavigationBar session={session} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
