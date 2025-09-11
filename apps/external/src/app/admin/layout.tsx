"use client";

import { useSession } from "next-auth/react";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@shared/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen">
        <AdminSidebar/>

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
