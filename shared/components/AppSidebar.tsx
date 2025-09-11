"use client";

import { CheckSquare, ChevronUp, ListTodo, LogOut, Settings, Timer, User, UserCircle } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "./ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/components/ui/form/dropdown-menu";
import { Button } from "./ui/button";
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
} from "./ui/sidebar";

const tabs = [
    {
        sectionHeader: "Management",
        items: [
            {
                title: "Admin Management",
                href: "/admin-management",
                icon: Timer,
            },
            {
                title: "Vendor Management",
                href: "/vendor-management",
                icon: CheckSquare,
            },
            {
                title: "Guest Management",
                href: "/guest-management",
                icon: ListTodo,
            },
        ]
    },
    {
        sectionHeader: "Analytics",
        items: [
            {
                title: "Dashboard",
                href: "/dashboard",
                icon: Timer,
            },
            {
                title: "Reports",
                href: "/reports",
                icon: CheckSquare,
            }
        ]
    }
];

// Profile dropdown items
const profileItems = [
  {
    title: "Account",
    href: "/admin/account",
    icon: User,
  },
  {
    title: "Billing",
    href: "/admin/billing",
    icon: Settings,
  },
];

export default function AppSidebar(
    {tabs} : {
      tabs: Array<{
        sectionHeader: string, 
        items: Array<{
          title: string, 
          href: string, 
          icon: React.ComponentType<{className?: string}>
        }>
      }>
    }
) {
    const { data: session } = useSession();
  return (
        <Sidebar>
          <SidebarHeader className="flex items-center justify-center p-4 relative">
            <Image
              src="/images/logo.png"
              alt="Company Logo"
              width={150}
              height={40}
              style={{ objectFit: "contain" }}
            />
            <div className="absolute right-5 bottom-[1px] text-primary italic font-montserrat font-black text-[8px]">Tie the Knot, Stress Not.</div>
          </SidebarHeader>

          <SidebarContent>
            {tabs.map((section, index) => (
              <SidebarGroup key={section.sectionHeader}>
                <SidebarGroupLabel>{section.sectionHeader}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
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
                <Button variant="ghost" className="flex items-center justify-between w-full no-underline">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-6 w-6" />
                    <span>{session ? session.user?.name : "Your Profile"}</span>
                  </div>
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {profileItems.map((item) => (
                  <DropdownMenuItem key={item.title} asChild>
                    <Link href={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <Separator className="my-2" />
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => signOut()}
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
