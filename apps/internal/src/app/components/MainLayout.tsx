"use client";

import { useSession } from "next-auth/react";
import { SidebarProvider, SidebarTrigger } from "@shared/components/ui/sidebar";
import SuperAdminSidebar from "./SuperAdminSidebar";
import { Toaster } from "@shared/components/ui/sonner";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div>Loading...</div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex flex-1 flex-col overflow-y-auto">
        {children}
        <Toaster />
      </main>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
        <SuperAdminSidebar />
        <main className="relative flex-1 overflow-y-auto">
          <div className="absolute left-2 top-4 z-50">
            <SidebarTrigger />
          </div>
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      <Toaster />
    </SidebarProvider>
  );
}