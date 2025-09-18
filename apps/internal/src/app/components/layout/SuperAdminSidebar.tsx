'use client';

import AppSidebar from '@shared/components/AppSidebar';
import { CheckSquare, LayoutDashboard, ListTodo, Timer, User2, UserStar } from 'lucide-react';
import { signOut } from 'next-auth/react';

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
        title: 'Super Admin Management',
        href: '/superadmin-management',
        icon: UserStar,
      },
      {
        title: 'Admin Management',
        href: '/admin-management',
        icon: User2,
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
  return (
    <AppSidebar
      tabs={tabs}
      signOut={() => signOut({ callbackUrl: window.location.origin, redirect: false })}
    />
  );
}
