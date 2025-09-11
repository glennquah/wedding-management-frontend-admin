"use client";

import VendorSidebar from "./VendorSidebar"
import { useSession } from "next-auth/react";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@shared/components/ui/sidebar";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { data: session } = useSession();

  if (!session || session.user.role !== 'vendor') {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen">
        <VendorSidebar />
        <main className="relative flex-1 overflow-auto">
          <div className="absolute left-2 top-4 z-50">
            <SidebarTrigger />
          </div> 
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
