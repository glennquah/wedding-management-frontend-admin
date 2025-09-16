'use client';

import AppSidebar from '@shared/components/AppSidebar';
import {
  CalendarDays,
  CircleDollarSign,
  FileSpreadsheet,
  LayoutDashboard,
  Users,
} from 'lucide-react';

const tabs = [
  {
    sectionHeader: 'Overview',
    items: [
      {
        title: 'Listings',
        href: '/vendor/listing',
        icon: LayoutDashboard,
      },
      {
        title: 'Revenue',
        href: '/vendor/revenue',
        icon: CircleDollarSign,
      },
    ],
  },
  {
    sectionHeader: 'Management',
    items: [
      {
        title: 'Customers',
        href: '/vendor/customers',
        icon: Users,
      },
      {
        title: 'Services',
        href: '/vendor/services',
        icon: FileSpreadsheet,
      },
      {
        title: 'Calendar',
        href: '/vendor/calendar',
        icon: CalendarDays,
      },
    ],
  },
];

export default function VendorSidebar() {
  return <AppSidebar tabs={tabs} />;
}
