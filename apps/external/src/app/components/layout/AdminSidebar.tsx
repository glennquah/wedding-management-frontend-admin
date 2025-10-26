'use client';

import { signOut, useWeddingStore } from '../../store/sessionStore';
import AppSidebar from '@shared/components/AppSidebar';
import {
  BellDot,
  BookOpenText,
  Camera,
  ClipboardList,
  Clock,
  Gift,
  LayoutDashboard,
  MapPin,
  PaintRoller,
  ShoppingCart,
  Sparkles,
  Users,
  Calendar,
} from 'lucide-react';

export default function AdminSidebar() {
  const { weddings, firstPurchaseMade } = useWeddingStore();
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
          disabled: !hasWedding || !firstPurchaseMade,
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
          disabled: !hasWedding || !firstPurchaseMade,
        },
        {
          title: 'Timeline',
          href: '/timeline',
          icon: Calendar,
          disabled: !hasWedding || !firstPurchaseMade,
        },
        {
          title: 'Date Optimizer',
          href: '/date-optimizer',
          icon: Sparkles,
          disabled: !hasWedding,
        },
        {
          title: 'Microsite',
          href: '/microsite',
          icon: PaintRoller,
          disabled: !hasWedding || !firstPurchaseMade,
        },
        {
          title: 'Wishlist',
          href: '/wishlist',
          icon: Gift,
          disabled: !hasWedding,
        },
        {
          title: 'Album Invite',
          href: '/album',
          icon: Camera,
          disabled: !hasWedding || !firstPurchaseMade,
        },
        {
          title: 'Attendance',
          href: '/attendance',
          icon: ClipboardList,
          disabled: !hasWedding || !firstPurchaseMade,
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
          disabled: !hasWedding || !firstPurchaseMade,
        },
      ],
    },
  ];

  return <AppSidebar tabs={tabs} signOut={() => signOut()} basePath="admin" />;
}
