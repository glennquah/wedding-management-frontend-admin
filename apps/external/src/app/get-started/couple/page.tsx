"use client";

import { useRouter } from "next/navigation";
import { useHandleSession } from "../../hooks/useHandleSession";
import { useSessionStore } from "../../store/sessionStore";


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