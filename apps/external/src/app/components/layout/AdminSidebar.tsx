'use client';

import { signOut, useWeddingStore } from '../../store/sessionStore';
import AppSidebar from '@shared/components/AppSidebar';
import {
  BellDot,
  Calendar,
  Camera,
  CheckSquare,
  Clock,
  LayoutDashboard,
  ListTodo,
  MapPin,
  PaintRoller,
  ShoppingCart,
  Users,
} from 'lucide-react';

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
          title: 'Checklist',
          href: '/checklist',
          icon: CheckSquare,
        },
        {
          title: 'Guest List',
          href: '/guest-list',
          icon: Users,
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
        {
          title: 'Tasks',
          href: '/tasks',
          icon: ListTodo,
          disabled: !hasWedding,
        },
      ],
    },
  ];

  return <AppSidebar tabs={tabs} signOut={() => signOut()} basePath="admin" />;
}
