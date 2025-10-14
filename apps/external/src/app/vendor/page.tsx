'use client';

import { useEffect, useState } from 'react';

import VendorDashboardModule from '../components/dashboards/VendorDashboardModule';
import { VendorsService } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { AlertCircle, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VendorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasVendorDetails, setHasVendorDetails] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    const checkVendorDetails = async () => {
      try {
        if (!session?.user?.id) return;

        // Fetch vendor profile to check if they have service details
        const vendor = await VendorsService.vendorControllerGetVendor(session.user.id);

        // Check if vendor has completed their profile with service details
        const hasDetails = !!(
          vendor.serviceOffered &&
          vendor.styleOffered &&
          vendor.weddingTypes?.length
        );
        setHasVendorDetails(hasDetails);
      } catch (error) {
        console.error('Error checking vendor details:', error);
        setHasVendorDetails(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkVendorDetails();
  }, [status, session]);

  if (status === 'loading' || isLoading) {
    return <p className="text-center mt-16">Loading...</p>;
  }

  if (!session) {
    return <p className="text-center mt-16">Loading...</p>;
  }

  // If no vendor details, show only the setup banner
  if (hasVendorDetails === false) {
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
                Complete Your Vendor Profile
              </h2>
              <p className="text-gray-700 mb-2">
                Hello,{' '}
                <span className="font-semibold">{session.user?.name || session.user?.email}</span>{' '}
                👋
              </p>
              <p className="text-gray-600 mt-4">
                Before you can access your dashboard and start creating listings, we need you to
                complete your vendor profile. This includes your service offerings, style
                preferences, and the types of weddings you cater to!
              </p>
            </div>
            <Button
              onClick={() => router.push('/vendor/account')}
              size="lg"
              className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold shadow-md hover:shadow-xl transition-all px-8 py-6 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Complete Your Profile Now
            </Button>
            <p className="text-sm text-gray-500">
              Update your vendor details in{' '}
              <button
                onClick={() => router.push('/vendor/account')}
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
    <div className="mx-auto">
      <VendorDashboardModule />
    </div>
  );
}
