'use client';

import { useEffect, useState } from 'react';

import { VendorsService } from '@shared/api';
import AppSidebar from '@shared/components/AppSidebar';
import {
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  FileSpreadsheet,
  LayoutDashboard
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function VendorSidebar() {
  const { data: session } = useSession();
  const [hasVendorDetails, setHasVendorDetails] = useState<boolean>(true); // Default to true to avoid flickering

  useEffect(() => {
    const checkVendorDetails = async () => {
      try {
        if (!session?.user?.id) return;

        const vendor = await VendorsService.vendorControllerGetVendor(session.user.id);
        const hasDetails = !!(
          vendor.serviceOffered &&
          vendor.styleOffered &&
          vendor.weddingTypes?.length
        );
        setHasVendorDetails(hasDetails);
      } catch (error) {
        console.error('Error checking vendor details:', error);
        setHasVendorDetails(false);
      }
    };

    checkVendorDetails();
  }, [session]);

  const tabs = [
    {
      sectionHeader: 'Overview',
      items: [
        {
          title: 'Dashboard',
          href: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Listings',
          href: '/listing',
          icon: FileSpreadsheet,
          disabled: !hasVendorDetails,
        },
        {
          title: 'Revenue',
          href: '/revenue',
          icon: CircleDollarSign,
          disabled: !hasVendorDetails,
        },
      ],
    },
    {
      sectionHeader: 'Management',
      items: [
        {
          title: 'Manage Orders',
          href: '/orders',
          icon: ClipboardList,
          disabled: !hasVendorDetails,
        },
        {
          title: 'Services',
          href: '/services',
          icon: FileSpreadsheet,
          disabled: !hasVendorDetails,
        },
        {
          title: 'Calendar',
          href: '/calendar',
          icon: CalendarDays,
          disabled: !hasVendorDetails,
        },
      ],
    },
  ];

  return (
    <AppSidebar
      tabs={tabs}
      signOut={() => signOut({ callbackUrl: window.location.origin, redirect: false })}
      basePath="vendor"
    />
  );
}
