'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminsService } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { AlertCircle, Sparkles } from 'lucide-react';

export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasWedding, setHasWedding] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    const checkWedding = async () => {
      try {
        const { mainWeddingId } = await AdminsService.adminControllerGetMyMainWedding();
        setHasWedding(mainWeddingId !== null);
      } catch (error) {
        console.error('Error checking wedding:', error);
        setHasWedding(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkWedding();
  }, [status, session]);

  if (status === 'loading' || isLoading) {
    return <p className="text-center mt-16">Loading...</p>;
  }

  if (!session) {
    return <p className="text-center mt-16">Loading...</p>;
  }

  // If no wedding, show only the setup banner
  if (hasWedding === false) {
    return (
      <main className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="max-w-2xl w-full bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-8 shadow-lg">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                Welcome! Let's Set Up Your Wedding
              </h2>
              <p className="text-gray-700 mb-2">
                Hello, <span className="font-semibold">{session.user?.name || session.user?.email}</span> 👋
              </p>
              <p className="text-gray-600 mt-4">
                Before you can access your dashboard and planning tools, we need to set up your wedding details. This will help us provide personalized vendor recommendations, budget planning, guest management, and much more!
              </p>
            </div>
            <Button
              onClick={() => router.push('/admin/create-wedding')}
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-md hover:shadow-xl transition-all px-8 py-6 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create Your Wedding Now
            </Button>
            <p className="text-sm text-gray-500">
              Or update your profile in{' '}
              <button
                onClick={() => router.push('/admin/account')}
                className="text-amber-600 hover:text-amber-700 underline font-medium"
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
    <main className="max-w-4xl mx-auto mt-8 p-8">
      {/* Dashboard Content */}
      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard!</h1>
        <p className="mb-2">
          Hello, <span className="font-semibold">{session.user?.name || session.user?.email}</span> 👋
        </p>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Your Dummy Stats</h2>
          <ul className="list-disc pl-6">
            <li>Events planned: 3</li>
            <li>Vendors contacted: 7</li>
            <li>Tasks completed: 12</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
