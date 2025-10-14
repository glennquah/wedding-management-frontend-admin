'use client';

import AppSidebar from '@shared/components/AppSidebar';
import {
  BellDot,
  Calendar,
  Camera,
  ClipboardList,
  Clock,
  LayoutDashboard,
  MapPin,
  PaintRoller,
  ShoppingCart,
  Sparkles,
  Users,
} from 'lucide-react';
import { signOut, useWeddingStore } from '../../store/sessionStore';

export default function AdminSidebar() {
  const { weddings } = useWeddingStore();
  const hasWedding = weddings && weddings.length > 0;

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
          title: 'Shop',
          href: '/ecommerce',
          icon: ShoppingCart,
          disabled: !hasWedding,
        },
        {
          title: 'Progress Tracker',
          href: '/progress-tracker',
          icon: Clock,
          disabled: !hasWedding,
        },
        {
          title: 'Notification Templates',
          href: '/notification-templates',
          icon: BellDot,
          disabled: !hasWedding,
        },
      ],
    },
    {
      sectionHeader: 'Planning',
      items: [
        {
          title: 'Guest List',
          href: '/guest-list',
          icon: Users,
          disabled: !hasWedding,
        },
        {
          title: 'Orders',
          href: '/orders',
          icon: ClipboardList,
          disabled: !hasWedding,
        },
        {
          title: 'Seating Arrangement',
          href: '/seating-arrangement',
          icon: MapPin,
          disabled: !hasWedding,
        },
        {
          title: 'Timeline',
          href: '/timeline',
          icon: Calendar,
          disabled: !hasWedding,
        },
        {
          title: 'Date Optimizer',
          href: '/date-optimizer',
          icon: Sparkles,
        },
        {
          title: 'Microsite',
          href: '/microsite',
          icon: PaintRoller,
          disabled: !hasWedding,
        },
        {
          title: 'Album Invite',
          href: '/album',
          icon: Camera,
          disabled: !hasWedding,
        },
      ],
    },
  ];

  return <AppSidebar tabs={tabs} signOut={() => signOut()} basePath="admin" />;
}
