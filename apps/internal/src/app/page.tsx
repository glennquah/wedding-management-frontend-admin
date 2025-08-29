

"use client";

export const dynamic = 'force-dynamic'

import ResponsiveMenubar from "@shared/components/responsive-menubar";
import { Button } from "@shared/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DummyLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (role: "admin" | "vendor") => {
    setLoading(true);
    setTimeout(() => {
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/vendors");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background font-sans p-8 gap-8">
      <ResponsiveMenubar />
      <div className="flex flex-col items-center gap-6 bg-white/80 rounded-xl shadow-lg p-10">
        <h1 className="text-3xl font-bold mb-2">Internal Portal Login</h1>
        <p className="mb-4 text-secondary-foreground">Choose your role to continue:</p>
        <div className="flex gap-6">
          <Button
            variant="default"
            size="lg"
            disabled={loading}
            onClick={() => handleLogin("admin")}
          >
            Login as Admin
          </Button>
          <Button
            variant="secondary"
            size="lg"
            disabled={loading}
            onClick={() => handleLogin("vendor")}
          >
            Login as Vendor
          </Button>
        </div>
      </div>
    </div>
  );
}
