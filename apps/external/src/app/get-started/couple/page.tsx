"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "../../store/sessionStore";
import { Button } from "@shared/components/ui/button";
import { Label } from "@shared/components/ui/label";
import { useHandleSession } from "../../hooks/useHandleSession";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@shared/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";


export default function GetStartedCouplePage() {
  const router = useRouter();
  const { name, email, password } = useSessionStore();

  // Redirect if onboarding data is missing
  if (!name || !email || !password) {
    router.replace("/get-started");
    return null;
  }

  const { handleSignUpAdmin } = useHandleSession();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6">
      
    </div>
  );
}