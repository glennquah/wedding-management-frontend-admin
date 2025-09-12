'use client';

import AdminSidebar from './AdminSidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@shared/components/ui/sidebar';
import { useSession } from 'next-auth/react';
import { UserRole } from '@shared/api';

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
      <SidebarInset>
        <div className="absolute left-2 top-4 z-50">
          <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
