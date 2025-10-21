'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { VendorsService } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function StripeCompletePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyStripeStatus = async () => {
      if (!session?.user?.id) {
        router.push('/vendor');
        return;
      }

      try {
        // Sync the Stripe status with Stripe to get the latest info
        await VendorsService.vendorControllerSyncVendorStripeStatus(session.user.id);

        // Get the updated Stripe status
        const stripeStatus = await VendorsService.vendorControllerGetVendorStripeStatus(
          session.user.id
        );

        if (stripeStatus.stripeAccountOnboardingComplete) {
          setIsComplete(true);
          // Redirect to vendor dashboard after 2 seconds
          setTimeout(() => {
            router.push('/vendor');
          }, 2000);
        } else {
          setError(
            'Your Stripe onboarding is still being processed. This may take a few moments.'
          );
          // Redirect anyway after showing the message
          setTimeout(() => {
            router.push('/vendor');
          }, 3000);
        }
      } catch (error) {
        console.error('Error verifying Stripe status:', error);
        setError('Failed to verify your Stripe status. Please try again.');
        setTimeout(() => {
          router.push('/vendor');
        }, 3000);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyStripeStatus();
  }, [session, router]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-500" />
          <p className="text-gray-600">Verifying your Stripe account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full bg-amber-50 border-2 border-amber-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Almost There!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/vendor')} className="bg-brand-500 hover:bg-brand-600">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Stripe Setup Complete!</h2>
        <p className="text-gray-600 mb-4">
          Your Stripe account has been successfully set up. You can now receive payments from your
          clients.
        </p>
        <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
