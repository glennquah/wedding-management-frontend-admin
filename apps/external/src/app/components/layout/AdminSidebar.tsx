'use client';

import { signOut } from '../../store/sessionStore';
import AppSidebar from '@shared/components/AppSidebar';
import {
  Calendar,
  CheckSquare,
  Clock,
  LayoutDashboard,
  ListTodo,
  MapPin,
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
        href: '/admin/seating-arrangement',
        icon: MapPin,
      },
      {
        title: 'Timeline',
        href: '/timeline',
        icon: Calendar,
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
