'use client';

import AppSidebar from '@shared/components/AppSidebar';
import {
  CalendarDays,
  CircleDollarSign,
  FileSpreadsheet,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

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
      },
      {
        title: 'Revenue',
        href: '/revenue',
        icon: CircleDollarSign,
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
      },
      {
        title: 'Services',
        href: '/services',
        icon: Settings,
      },
      {
        title: 'Calendar',
        href: '/calendar',
        icon: CalendarDays,
      },
    ],
  },
];

export default function VendorSidebar() {
  return (
    <AppSidebar
      tabs={tabs}
      signOut={() => signOut({ callbackUrl: window.location.origin, redirect: false })}
      basePath='vendor'
    />
  );
}
