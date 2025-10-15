'use client';

import AppSidebar from '@shared/components/AppSidebar';
import {
  BellDot,
  BookOpenText,
  Calendar,
  Camera,
  CheckSquare,
  ClipboardList,
  Clock,
  LayoutDashboard,
  ListTodo,
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
        {
          title: 'Tasks',
          href: '/tasks',
          icon: ListTodo,
          disabled: !hasWedding,
        },
        {
          title: 'Attendance',
          href: '/attendance',
          icon: ClipboardList,
          disabled: !hasWedding,
        },
      ],
    },
    {
      sectionHeader: 'Post Wedding',
      items: [
        {
          title: 'Gratitude Card',
          href: '/gratitude',
          icon: BookOpenText,
        },
      ],
    },
  ];

  return <AppSidebar tabs={tabs} signOut={() => signOut()} basePath="admin" />;
}
