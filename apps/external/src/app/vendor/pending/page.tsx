'use client';

import { Badge } from '@shared/components/ui/badge';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { CheckCircle, Clock, Mail } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function VendorPendingPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-25 to-brand-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Company Logo"
            width={200}
            height={60}
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Main Card */}
        <Card className="border-brand-200">
          <CardHeader className="text-center space-y-4">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center">
                <Clock className="w-12 h-12 text-brand-600 animate-pulse" />
              </div>
            </div>

            <CardTitle className="text-3xl">Account Under Review</CardTitle>

            {/* Greeting */}
            <p className="text-gray-600">
              Hello, <span className="font-semibold text-brand-600">{session?.user?.name}</span>! 👋
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Message */}
            <Card className="bg-brand-50 border-brand-200">
              <CardContent className="pt-6">
                <p className="text-gray-700 text-center mb-4">
                  Thank you for registering with us! Your vendor account has been submitted and is currently being reviewed by our team.
                </p>
                <p className="text-gray-600 text-center text-sm">
                  We&apos;ll carefully review your information to ensure the best experience for our couples. This process typically takes 1-2 business days.
                </p>
              </CardContent>
            </Card>

            {/* Steps */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Account Created</h3>
                  <p className="text-sm text-gray-600">Your vendor account has been successfully created.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Under Review</h3>
                  <p className="text-sm text-gray-600">Our team is reviewing your application and credentials.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Notification</h3>
                  <p className="text-sm text-gray-600">
                    You&apos;ll receive an email at <span className="font-medium text-brand-600">{session?.user?.email}</span> once approved.
                  </p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <Card className="bg-brand-50 border-brand-300">
              <CardContent className="pt-6">
                <p className="text-sm text-brand-800 text-center">
                  <strong>Need help?</strong> Contact us at{' '}
                  <a href="mailto:support@knotly.com" className="underline font-medium text-brand-600 hover:text-brand-700">
                    support@knotly.com
                  </a>
                </p>
              </CardContent>
            </Card>

            {/* Sign Out Button */}
            <Button
              onClick={() => signOut({ callbackUrl: `${window.location.origin}/login` })}
              variant="outline"
              className="w-full border-brand-300 text-brand-700 hover:bg-brand-50"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-8">
          We appreciate your patience. Thank you for choosing Knotly!
        </p>
      </div>
    </div>
  );
}
