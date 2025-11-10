'use client';

import AppSidebar from '@shared/components/AppSidebar';
import {
  Bell,
  CheckSquare,
  DollarSign,
  LayoutDashboard,
  ListTodo,
  MailCheckIcon,
  Package,
  ShoppingCart,
  User2,
  UserStar,
  Users,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const tabs = [
  {
    sectionHeader: '',
    items: [
      {
        title: 'Main Dashboard',
        href: '/',
        icon: LayoutDashboard,
      },
      {
        title: 'Notification Templates',
        href: '/notification-templates',
        icon: MailCheckIcon,
      },
    ],
  },
  {
    sectionHeader: 'Management',
    items: [
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
      {
        title: 'Wedding Management',
        href: '/wedding-management',
        icon: Users,
      },
      {
        title: 'Listing Management',
        href: '/listing-management',
        icon: Package,
      },
      {
        title: 'Order Management',
        href: '/order-management',
        icon: ShoppingCart,
      },
      {
        title: 'Notifications Management',
        href: '/notifications-management',
        icon: Bell,
      },
    ],
  },
  {
    sectionHeader: 'Analytics',
    items: [
      {
        title: 'Revenue & Payouts',
        href: '/revenue',
        icon: DollarSign,
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
