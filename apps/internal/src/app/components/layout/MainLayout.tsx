'use client';

import NavigationBar from './NavigationBar';
import SuperAdminSidebar from './SuperAdminSidebar';
import { SidebarProvider } from '@shared/components/ui/sidebar';
import { Toaster } from '@shared/components/ui/sonner';
import { useSession } from 'next-auth/react';

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
      <main className="relative flex-1 overflow-y-auto">
        <NavigationBar />
        <div className="h-full w-full">{children}</div>
      </main>
      <Toaster />
    </SidebarProvider>
  );
}
