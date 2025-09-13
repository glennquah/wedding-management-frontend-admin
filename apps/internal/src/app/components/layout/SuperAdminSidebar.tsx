'use client';

import AppSidebar from '@shared/components/AppSidebar';
import { CheckSquare, LayoutDashboard, ListTodo, Timer, User } from 'lucide-react';

const tabs = [
  {
    sectionHeader: 'Management',
    items: [
      {
        title: 'Main Dashboard',
        href: '/admin-dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Admin Management',
        href: '/admin-management',
        icon: User,
      },
      {
        title: 'Vendor Management',
        href: '/vendor-management',
        icon: CheckSquare,
      },
      {
        title: 'Guest Management',
        href: '/guest-management',
        icon: ListTodo,
      },
    ],
  },
  {
    sectionHeader: 'Analytics',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Timer,
      },
      {
        title: 'Reports',
        href: '/reports',
        icon: CheckSquare,
      },
    ],
  },
];

export default function SuperAdminSidebar() {
  return <AppSidebar tabs={tabs} />;
}
