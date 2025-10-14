'use client';

import AdminDashboardModule from '../components/dashboards/AdminDashboardModule';
import { useWeddingStore } from '@/app/store/sessionStore';
import { Button } from '@shared/components/ui/button';
import { AlertCircle, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { weddings, hasHydrated } = useWeddingStore();

  const hasWedding = weddings && weddings.length > 0;

  if (status === 'loading' || !hasHydrated) {
    return <p className="text-center mt-16">Loading...</p>;
  }

  if (!session) {
    return <p className="text-center mt-16">Loading...</p>;
  }

  // If no wedding, show only the setup banner
  if (!hasWedding) {
    return (
      <main className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="max-w-2xl w-full bg-gradient-to-r from-brand-25 to-brand-50 border-2 border-brand-200 rounded-lg p-8 shadow-lg">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-brand-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-brand-500" />
                Welcome! Let&apos;s Set Up Your Wedding
              </h2>
              <p className="text-gray-700 mb-2">
                Hello,{' '}
                <span className="font-semibold">{session.user?.name || session.user?.email}</span>{' '}
                👋
              </p>
              <p className="text-gray-600 mt-4">
                Before you can access your dashboard and planning tools, we need to set up your
                wedding details. This will help us provide personalized vendor recommendations,
                budget planning, guest management, and much more!
              </p>
            </div>
            <Button
              onClick={() => router.push('/admin/create-wedding')}
              size="lg"
              className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold shadow-md hover:shadow-xl transition-all px-8 py-6 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create Your Wedding Now
            </Button>
            <p className="text-sm text-gray-500">
              Or update your profile in{' '}
              <button
                onClick={() => router.push('/admin/account')}
                className="text-brand-600 hover:text-brand-700 underline font-medium"
              >
                Account Settings
              </button>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto">
      <AdminDashboardModule />
    </main>
  );
}
