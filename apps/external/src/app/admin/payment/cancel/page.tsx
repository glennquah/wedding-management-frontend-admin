'use client';

import Link from 'next/link';

export default function PaymentCancelPage() {
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
          <Link
            href="/admin/payment"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>

          <Link
            href="/admin/dashboard"
            className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}