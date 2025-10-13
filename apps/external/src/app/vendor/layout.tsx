'use client';

import { UserRole, VendorsService } from '@shared/api';
import NavigationBar from '@shared/components/NavigationBar';
import { SidebarProvider } from '@shared/components/ui/sidebar';
import { Toaster } from '@shared/components/ui/sonner';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { VendorSessionProvider } from '../../contexts/VendorSessionContext';
import VendorSidebar from '../components/layout/VendorSidebar';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [hasVendorDetails, setHasVendorDetails] = useState<boolean | null>(null);
  const [vendorOnboardingStatus, setVendorOnboardingStatus] = useState<string | null>(null);
  const [isCheckingDetails, setIsCheckingDetails] = useState(true);

  console.log('Session status:', status, 'Session data:', session);

  useEffect(() => {
    const checkVendorDetails = async () => {
      try {
        if (!session?.user?.id) return;

        const vendor = await VendorsService.vendorControllerGetVendor(session.user.id);
        setVendorOnboardingStatus(vendor.onboardingStatus);

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

  // Route protection: prioritize PENDING/REJECTED status check over details check
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allowedRoutesWithoutDetails = ['/vendor', '/vendor/account'];

  useEffect(() => {
    // If vendor is PENDING, redirect to pending page
    if (vendorOnboardingStatus === 'PENDING' && pathname !== '/vendor/pending') {
      router.push('/vendor/pending');
      return;
    }

    // If vendor is REJECTED, sign them out
    if (vendorOnboardingStatus === 'REJECTED') {
      router.push('/login?error=vendor_rejected');
      return;
    }

    // If vendor is ONBOARDED but has no details, allow access to /vendor and /vendor/account only
    if (vendorOnboardingStatus === 'ONBOARDED' && hasVendorDetails === false && pathname && !allowedRoutesWithoutDetails.includes(pathname)) {
      router.push('/vendor');
    }
  }, [vendorOnboardingStatus, hasVendorDetails, pathname, router, allowedRoutesWithoutDetails]);

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

  // If vendor status is PENDING, only render the pending page without layout
  if (vendorOnboardingStatus === 'PENDING') {
    return <>{children}</>;
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
