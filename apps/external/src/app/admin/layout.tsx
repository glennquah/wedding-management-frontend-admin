'use client';

import AdminSidebar from './AdminSidebar';
import { UserRole } from '@shared/api';
import NavigationBar from '@shared/components/NavigationBar';
import { SidebarProvider } from '@shared/components/ui/sidebar';
import { signOut, useSession } from 'next-auth/react';
import { Toaster } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  console.log('Session status:', status, 'Session data:', session);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== UserRole.ADMIN) {
    console.log('Access denied - Session:', session);
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <NavigationBar session={session} signOut={() => signOut()} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
