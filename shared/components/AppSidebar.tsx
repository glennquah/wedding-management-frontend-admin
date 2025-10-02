'use client';

import { ChevronUp, LogOut, Settings, User, UserCircle } from 'lucide-react';
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
    title: 'Billing',
    href: '/billing',
    icon: Settings,
  },
];

export default function AppSidebar({
  tabs,
  signOut,
  basePath = "",
}: {
  tabs: Array<{
    sectionHeader: string;
    items: Array<{
      title: string;
      href: string;
      icon: React.ComponentType<{ className?: string }>;
      disabled?: boolean;
    }>;
  }>;
  signOut?: () => void;
  basePath?: string;
}) {
  const { data: session } = useSession();
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4 relative">
        <Image
          src="/images/logo.png"
          alt="Company Logo"
          width={150}
          height={40}
          style={{ objectFit: 'contain' }}
        />
        <div className="absolute right-5 bottom-[1px] text-primary italic font-montserrat font-black text-[8px]">
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
                    <SidebarMenuButton asChild={!item.disabled} disabled={item.disabled} className={item.disabled ? 'bg-gray-200 opacity-60' : ''}>
                      {item.disabled ? (
                        <div className="cursor-not-allowed flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                      ) : (
                        <Link href={basePath ? `/${basePath}${item.href}` : item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
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
              className="flex items-center justify-between w-full no-underline"
            >
              <div className="flex items-center gap-2">
                <UserCircle className="h-6 w-6" />
                <span>{session ? session.user?.name : 'Your Profile'}</span>
              </div>
              <ChevronUp className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52">
            <DropdownMenuItem disabled>Role: {session?.user.role}</DropdownMenuItem>
            {profileItems.map((item) => (
              <DropdownMenuItem key={item.title} asChild>
                <Link href={basePath ? `/${basePath}${item.href}` : item.href} className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </DropdownMenuItem>
            ))}
            <Separator className="my-2" />
            <DropdownMenuItem asChild className="text-red-600">
              <button
                onClick={() => signOut && signOut()}
                className="flex w-full items-center text-bold"
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
