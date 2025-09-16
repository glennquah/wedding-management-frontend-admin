'use client';

import VendorSidebar from './VendorSidebar';
import { SidebarProvider, SidebarTrigger } from '@shared/components/ui/sidebar';
import { useSession } from 'next-auth/react';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (!session || session.user.role !== 'vendor') {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <VendorSidebar />
        <main className="relative flex-1 overflow-auto min-w-0">
          <div className="absolute left-2 top-4 z-50">
            <SidebarTrigger />
          </div>
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
