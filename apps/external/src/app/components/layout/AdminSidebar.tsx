'use client';

import { AdminsService } from '@shared/api';
import AppSidebar from '@shared/components/AppSidebar';
import {
  BellDot,
  Calendar,
  CheckSquare,
  Clock,
  LayoutDashboard,
  ListTodo,
  MapPin,
  PaintRoller,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { signOut } from '../../store/sessionStore';

export default function AdminSidebar() {
  const [hasWedding, setHasWedding] = useState<boolean>(true); // Default to true to avoid flickering

  useEffect(() => {
    const checkWedding = async () => {
      try {
        const { mainWeddingId } = await AdminsService.adminControllerGetMyMainWedding();
        setHasWedding(mainWeddingId !== null);
      } catch (error) {
        console.error('Error checking wedding:', error);
        setHasWedding(false);
      }
    };

    checkWedding();
  }, []);

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
          disabled: !hasWedding,
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
