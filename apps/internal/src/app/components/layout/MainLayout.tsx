'use client';

import NavigationBar from '../../../../../../shared/components/NavigationBar';
import SuperAdminSidebar from './SuperAdminSidebar';
import { cn } from '@shared/components/lib/utils';
import { SidebarProvider, useSidebar } from '@shared/components/ui/sidebar';
import { Toaster } from '@shared/components/ui/sonner';
import { UserRole } from '@wedding/api-types';
import { useSession } from 'next-auth/react';

function MainContent({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar();

  return (
    <main
      className={cn(
        'flex-1 overflow-y-auto transition-all duration-300',
        sidebar.open ? 'max-w-[calc(100vw-16rem-16px)]' : 'max-w-[calc(100vw-2rem)]',
      )}
    >
      {children}
    </main>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div>Loading...</div>
      </main>
    );
  }

  if (!session?.user || session.user.role !== UserRole.SUPER_ADMIN) {
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
        <NavigationBar session={session} platform="internal" />
        <MainContent>{children}</MainContent>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
