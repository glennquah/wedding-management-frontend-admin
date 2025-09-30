'use client';

import { signOut } from '../../store/sessionStore';
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
  Users,
} from 'lucide-react';

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
        title: 'Progress Tracker',
        href: '/progress-tracker',
        icon: Clock,
      },
      {
        title: 'Notification Templates',
        href: '/notification-templates',
        icon: BellDot,
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
      },
      {
        title: 'Seating Arrangement',
        href: '/seating-arrangement',
        icon: MapPin,
      },
      {
        title: 'Timeline',
        href: '/timeline',
        icon: Calendar,
      },
      {
        title: 'Microsite',
        href: '/microsite',
        icon: PaintRoller,
      },
      {
        title: 'Tasks',
        href: '/tasks',
        icon: ListTodo,
      },
    ],
  },
];

export default function AdminSidebar() {
  return <AppSidebar tabs={tabs} signOut={() => signOut()} basePath="admin" />;
}
