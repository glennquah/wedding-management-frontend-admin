

"use client";

export const dynamic = 'force-dynamic'

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session?.user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background font-sans p-8 gap-8">
      <div className="flex flex-col items-center gap-6 bg-white/80 rounded-xl shadow-lg p-10">
        <h1 className="text-3xl font-bold mb-2">Internal Portal Landing Page</h1>
      </div>
    </div>
  );
}
