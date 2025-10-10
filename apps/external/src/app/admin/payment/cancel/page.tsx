'use client';

import { useCartStore } from '@/app/store/sessionStore';
import { PaymentsService } from '@shared/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function PaymentCancelPage() {
  const { order, clearCart } = useCartStore();
  const { data: session } = useSession();
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    setTimeout(() => {
        if (session?.user.id) {
          clearCart(session.user.id);
        }
    }, 1000);
  }, [session]);

  const handleRetryPayment = async () => {
    if (!order) {
      toast.error('No order found. Please create a new order.');
      return;
    }

    try {
      setIsRetrying(true);

      // Create checkout session and redirect to Stripe
      const checkoutData = await PaymentsService.paymentControllerCreateCheckoutSession({
        orderId: order.id,
        successUrl: `${window.location.origin}/admin/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/admin/payment/cancel`
      });

      // Redirect to Stripe Checkout
      window.location.href = checkoutData.url;
    } catch (error) {
      console.error('Error retrying payment:', error);
      toast.error('Failed to retry payment. Please try again.');
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges have been made to your account.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleRetryPayment}
            disabled={isRetrying || !order}
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isRetrying ? 'Redirecting to payment...' : 'Try Again'}
          </button>

          <Link
            href="/admin/orders"
            className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            Go to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}