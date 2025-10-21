'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { VendorsService } from '@shared/api';
import { Loader2 } from 'lucide-react';

export default function StripeRefreshPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const refreshStripeLink = async () => {
      if (!session?.user?.id) {
        router.push('/vendor');
        return;
      }

      try {
        // Get a fresh Stripe onboarding link
        const response = await VendorsService.vendorControllerGenerateStripeOnboardingLink(
          session.user.id
        );

        if (response.accountLinkUrl) {
          // Redirect to the new Stripe onboarding link
          window.location.href = response.accountLinkUrl;
        } else {
          // If we can't get a new link, redirect back to vendor page
          router.push('/vendor');
        }
      } catch (error) {
        console.error('Error refreshing Stripe link:', error);
        router.push('/vendor');
      }
    };

    refreshStripeLink();
  }, [session, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-500" />
        <p className="text-gray-600">Refreshing your Stripe onboarding link...</p>
      </div>
    </div>
  );
}