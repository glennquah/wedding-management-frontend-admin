'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import VendorSidebar from '../components/layout/VendorSidebar';
import { VendorSessionProvider } from '../../contexts/VendorSessionContext';
import { UserRole, VendorsService } from '@shared/api';
import NavigationBar from '@shared/components/NavigationBar';
import { SidebarProvider } from '@shared/components/ui/sidebar';
import { Toaster } from '@shared/components/ui/sonner';
import { useSession } from 'next-auth/react';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [hasVendorDetails, setHasVendorDetails] = useState<boolean | null>(null);
  const [isCheckingDetails, setIsCheckingDetails] = useState(true);

  console.log('Session status:', status, 'Session data:', session);

  useEffect(() => {
    const checkVendorDetails = async () => {
      try {
        if (!session?.user?.id) return;

        const vendor = await VendorsService.vendorControllerGetVendor(session.user.id);
        const hasDetails = !!(vendor.serviceOffered && vendor.styleOffered && vendor.weddingTypes?.length);
        setHasVendorDetails(hasDetails);
      } catch (error) {
        console.error('Error checking vendor details:', error);
        setHasVendorDetails(false);
      } finally {
        setIsCheckingDetails(false);
      }
    };

    if (session?.user?.id) {
      checkVendorDetails();
    }
  }, [session]);

  // Route protection: redirect to dashboard if no vendor details and trying to access protected routes
  const allowedRoutesWithoutDetails = ['/vendor', '/vendor/account'];

  useEffect(() => {
    if (hasVendorDetails === false && !allowedRoutesWithoutDetails.includes(pathname)) {
      router.push('/vendor');
    }
  }, [hasVendorDetails, pathname, router]);

  if (status === 'loading' || isCheckingDetails) {
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
    <VendorSessionProvider>
      <SidebarProvider defaultOpen={true}>
        <VendorSidebar />
        <div className="flex w-full h-screen overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0">
            <NavigationBar notificationRoute="/vendor/notifications" />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </VendorSessionProvider>
  );
}
