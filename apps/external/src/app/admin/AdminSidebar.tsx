'use client';

import AppSidebar from '@shared/components/AppSidebar';
import { Calendar, CheckSquare, Clock, LayoutDashboard, ListTodo, Users } from 'lucide-react';

const tabs = [
  {
    sectionHeader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Progress Tracker',
        href: '/admin/progress-tracker',
        icon: Clock,
      },
    ],
  },
  {
    sectionHeader: 'Planning',
    items: [
      {
        title: 'Checklist',
        href: '/admin/checklist',
        icon: CheckSquare,
      },
      {
        title: 'Guest List',
        href: '/admin/guest-list',
        icon: Users,
      },
      {
        title: 'Timeline',
        href: '/admin/timeline',
        icon: Calendar,
      },
      {
        title: 'Tasks',
        href: '/admin/tasks',
        icon: ListTodo,
      },
    ],
  },
];

export default function AdminSidebar() {
  return <AppSidebar tabs={tabs} />;
}
