'use client';

import { useEffect, useState } from 'react';

import VendorDashboardModule from '../components/dashboards/VendorDashboardModule';
import { VendorsService } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { AlertCircle, Sparkles, CreditCard, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface StripeStatus {
  stripeConnectAccountId: string | null;
  stripeAccountOnboardingComplete: boolean;
  stripeChargesEnabled: boolean;
  stripePayoutsEnabled: boolean;
  stripeDetailsSubmitted: boolean;
}

export default function VendorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasVendorDetails, setHasVendorDetails] = useState<boolean | null>(null);
  const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);

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

        // Fetch Stripe status
        const stripeInfo = await VendorsService.vendorControllerGetVendorStripeStatus(
          session.user.id
        );

        setStripeStatus(stripeInfo as StripeStatus);
      } catch (error) {
        console.error('Error checking vendor details:', error);
        setHasVendorDetails(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkVendorDetails();
  }, [status, session]);

  const handleStripeOnboarding = async () => {
    if (!session?.user?.id) return;

    setIsLoadingStripe(true);
    try {
      // Sync Stripe status first to get the latest info
      await VendorsService.vendorControllerSyncVendorStripeStatus(session.user.id);

      // Get the onboarding link
      const response = await VendorsService.vendorControllerGenerateStripeOnboardingLink(
        session.user.id
      );

      if (response.accountLinkUrl) {
        // Redirect to Stripe onboarding
        window.location.href = response.accountLinkUrl;
      } else {
        toast.error('Failed to generate Stripe onboarding link');
      }
    } catch (error) {
      console.error('Error starting Stripe onboarding:', error);
      toast.error('Failed to start Stripe onboarding. Please try again.');
    } finally {
      setIsLoadingStripe(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return <p className="text-center mt-16">Loading...</p>;
  }

  if (!session) {
    return <p className="text-center mt-16">Loading...</p>;
  }

  // Check if Stripe onboarding is incomplete
  const needsStripeOnboarding =
    stripeStatus &&
    !stripeStatus.stripeAccountOnboardingComplete;

  // If either vendor details or Stripe onboarding is incomplete, show setup banner
  if (hasVendorDetails === false || needsStripeOnboarding) {
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
                Complete Your Setup
              </h2>
              <p className="text-gray-700 mb-2">
                Hello,{' '}
                <span className="font-semibold">{session.user?.name || session.user?.email}</span>{' '}
                👋
              </p>
              <p className="text-gray-600 mt-4">
                Before you can access your dashboard and start creating listings, please complete
                the following:
              </p>
            </div>

            {/* Setup checklist */}
            <div className="w-full bg-white rounded-lg p-6 text-left space-y-4">
              {/* Stripe Onboarding Check */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    stripeStatus?.stripeAccountOnboardingComplete
                      ? 'bg-green-100 text-green-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  {stripeStatus?.stripeAccountOnboardingComplete ? '✓' : '!'}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Stripe Connect Onboarding
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {stripeStatus?.stripeAccountOnboardingComplete
                      ? 'Your Stripe account is fully set up and ready to receive payments!'
                      : 'Complete your Stripe onboarding to receive payments from clients.'}
                  </p>
                  {!stripeStatus?.stripeAccountOnboardingComplete && (
                      <Button
                        onClick={handleStripeOnboarding}
                        disabled={isLoadingStripe}
                        size="sm"
                        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {isLoadingStripe ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Complete Stripe Setup
                          </>
                        )}
                      </Button>
                    )}
                </div>
              </div>

              {/* Vendor Details Check */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    hasVendorDetails
                      ? 'bg-green-100 text-green-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  {hasVendorDetails ? '✓' : '!'}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Vendor Profile Details
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {hasVendorDetails
                      ? 'Your vendor profile is complete with all service details.'
                      : 'Add your service offerings, style preferences, and wedding types.'}
                  </p>
                  {!hasVendorDetails && (
                    <Button
                      onClick={() => router.push('/vendor/account')}
                      size="sm"
                      className="mt-2 bg-brand-500 hover:bg-brand-600 text-white"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Complete Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Complete all steps above to unlock your full vendor dashboard.
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
