'use client';

import { ChevronUp, ClipboardList, LogOut, User, UserCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/form/dropdown-menu';
import { Separator } from './ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';

// Profile dropdown items
const profileItems = [
  {
    title: 'Account',
    href: '/account',
    icon: User,
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: ClipboardList,
  },
];

export default function AppSidebar({
  tabs,
  signOut,
  basePath = '',
}: {
  tabs: Array<{
    sectionHeader: string;
    items: Array<{
      title: string;
      href: string;
      icon: React.ComponentType<{ className?: string }>;
      disabled?: boolean;
      badge?: number; // Add badge support for notification count
    }>;
  }>;
  signOut?: () => void;
  basePath?: string;
}) {
  const { data: session } = useSession();
  return (
    <Sidebar>
      <SidebarHeader className="relative flex items-center justify-center p-4">
        <Image
          src="/images/logo.png"
          alt="Company Logo"
          width={150}
          height={40}
          style={{ objectFit: 'contain' }}
        />
        <div className="text-primary font-montserrat absolute right-5 bottom-[1px] text-[8px] font-black italic">
          Stress Not, Tie the Knot.
        </div>
      </SidebarHeader>

      <SidebarContent>
        {tabs.map((section, index) => (
          <SidebarGroup key={section.sectionHeader}>
            <SidebarGroupLabel>{section.sectionHeader}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild={!item.disabled}
                      disabled={item.disabled}
                      className={item.disabled ? 'bg-gray-200 opacity-60' : ''}
                    >
                      {item.disabled ? (
                        <div className="flex cursor-not-allowed items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                      ) : (
                        <Link
                          href={basePath ? `/${basePath}${item.href}` : item.href}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                          {item.badge && item.badge > 0 && (
                            <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                              {item.badge > 99 ? '99+' : item.badge}
                            </div>
                          )}
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex w-full items-center justify-between no-underline"
            >
              <div className="flex items-center gap-2">
                <UserCircle className="h-6 w-6" />
                <span>{session ? session.user?.name : 'Your Profile'}</span>
              </div>
              <ChevronUp className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52">
            <DropdownMenuItem disabled>
              Role: {(session?.user as { role?: string })?.role || 'User'}
            </DropdownMenuItem>
            {profileItems.map((item) => (
              <DropdownMenuItem key={item.title} asChild>
                <Link
                  href={basePath ? `/${basePath}${item.href}` : item.href}
                  className="flex items-center"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </DropdownMenuItem>
            ))}
            <Separator className="my-2" />
            <DropdownMenuItem asChild className="text-red-600">
              <button
                onClick={() => signOut && signOut()}
                className="text-bold flex w-full items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
