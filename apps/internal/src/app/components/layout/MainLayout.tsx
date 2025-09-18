'use client';

import NavigationBar from '../../../../../../shared/components/NavigationBar';
import SuperAdminSidebar from './SuperAdminSidebar';
import { UserRole } from '@shared/api';
import { cn } from '@shared/components/lib/utils';
import { SidebarProvider, useSidebar } from '@shared/components/ui/sidebar';
import { Toaster } from '@shared/components/ui/sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  if (status === 'loading') {
    return (
      <>
        <main className="flex min-h-screen items-center justify-center p-4">
          <div>Loading...</div>
        </main>
        <Toaster />
      </>
    );
  }

  if (!session?.user || session.user.role !== UserRole.SUPER_ADMIN) {
    console.log('Access denied - Session:', session);
    router.push('/login');
    return (
      <>
        <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
        <Toaster />
      </>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col">
        <NavigationBar session={session} />
        <MainContent>{children}</MainContent>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
