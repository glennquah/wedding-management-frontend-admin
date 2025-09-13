'use client';

import VendorSidebar from './VendorSidebar';
import NavigationBar from '@shared/components/NavigationBar';
import { SidebarProvider } from '@shared/components/ui/sidebar';
import { Toaster } from '@shared/components/ui/sonner';
import { useSession } from 'next-auth/react';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (!session || session.user.role !== 'vendor') {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <VendorSidebar />
      <div className="flex-1 flex flex-col">
        <NavigationBar session={session} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
