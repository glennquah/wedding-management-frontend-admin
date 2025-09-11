'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function GuestManagementPage() {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session?.user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background font-sans p-8 gap-8">
      <div className="flex flex-col items-center gap-6 bg-white/80 rounded-xl shadow-lg p-10">
        <h1 className="text-3xl font-bold mb-2">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse eum itaque sint illum
          incidunt voluptate quisquam, veniam, quos molestiae libero excepturi repellendus, quod
          dolorum labore impedit! Vel totam placeat eum.
        </h1>
      </div>
    </div>
  );
}
