'use client';

import { Button } from '@shared/components/ui/button';
import { SidebarTrigger } from '@shared/components/ui/sidebar';
import { Bell } from 'lucide-react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface NavigationBarProps {
  session: Session | null;
  platform?: 'internal' | 'external';
}

const NavigationBar = ({ session, platform = 'external' }: NavigationBarProps) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full bg-sidebar text-sidebar-foreground border-gray-600 shadow-sm px-4 md:px-6">
      <div className="flex h-14 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => router.push('/notifications')}
          >
            <Bell size={16} />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User menu */}
          {/* {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2 px-2">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                    <User size={14} />
                  </div>
                  <span className="text-sm text-foreground ">{session.user.name}</span>
                  <ChevronsUpDown size={14} className="text-muted-foreground/80" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem disabled>Role: {session.user.role}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User size={16} className="mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings size={16} className="mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() =>
                    platform === 'internal'
                      ? signOut({ callbackUrl: window.location.origin, redirect: false })
                      : signOut({ callbackUrl: window.location.origin })
                  }
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )} */}
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
