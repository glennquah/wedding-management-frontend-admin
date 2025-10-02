'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AppSidebar from '@shared/components/AppSidebar';
import {
  CalendarDays,
  CircleDollarSign,
  FileSpreadsheet,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { VendorsService } from '@shared/api';

export default function VendorSidebar() {
  const { data: session } = useSession();
  const [hasVendorDetails, setHasVendorDetails] = useState<boolean>(true); // Default to true to avoid flickering

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
          title: 'Customers',
          href: '/customers',
          icon: Users,
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
      basePath='vendor'
    />
  );
}
