'use client';

import { Button } from '@shared/components/ui/button';
import { SidebarTrigger } from '@shared/components/ui/sidebar';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NavigationBarProps {
  notificationRoute?: string;
  additionalTabs?: React.ReactNode;
}

const NavigationBar = ({ notificationRoute, additionalTabs }: NavigationBarProps) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full bg-sidebar text-sidebar-foreground border-gray-600 shadow-sm px-4 md:px-6">
      <div className="flex h-14 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>

        {/* Right side */}
        {notificationRoute && (
          <div className="flex items-center gap-4">
            {/* Notification */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => router.push(notificationRoute)}
            >
              <Bell size={16} />
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        )}
        {additionalTabs}
      </div>
    </header>
  );
};

export default NavigationBar;
