'use client';

import NavigationBar from '../../../../../../shared/components/NavigationBar';
import SuperAdminSidebar from './SuperAdminSidebar';
import { SidebarProvider } from '@shared/components/ui/sidebar';
import { Toaster } from '@shared/components/ui/sonner';
import { signOut, useSession } from 'next-auth/react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div>Loading...</div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex flex-1 flex-col overflow-y-auto">
        {children}
        <Toaster />
      </main>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col">
        <NavigationBar session={session} signOut={() => signOut()} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
