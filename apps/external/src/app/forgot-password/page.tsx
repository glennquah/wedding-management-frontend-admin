'use client';

import { useState } from 'react';

import { AuthService, RequestResetPasswordDto } from '@shared/api';
import ResponsiveMenubar from '@shared/components/responsive-menubar';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/form/input';
import { Label } from '@shared/components/ui/form/label';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const requestData: RequestResetPasswordDto = {
        email: email.trim().toLowerCase(),
      };

      await AuthService.authControllerRequestPasswordReset(requestData);

      setEmailSent(true);
      toast.success('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error('Password reset request error:', error);

      // Show success message even if there's an error to prevent email enumeration
      setEmailSent(true);
      toast.success(
        'If an account with that email exists, we have sent password reset instructions.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6">
        <ResponsiveMenubar />
        <div className="w-full max-w-lg bg-white p-8 mt-[72px] rounded-2xl shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We have sent password reset instructions to <strong>{email}</strong>.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Did not receive the email? Check your spam folder or try again.
            </p>
            <div className="space-y-3">
              <Button onClick={() => setEmailSent(false)} variant="outline" className="w-full">
                Try Different Email
              </Button>
              <Button onClick={() => router.push('/login')} className="w-full">
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6">
      <ResponsiveMenubar />
      <div className="w-full max-w-lg bg-white p-8 mt-[72px] rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Forgot Your Password?</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email address and we will send you instructions to reset your password.
        </p>

        <form onSubmit={handleRequestReset} className="space-y-4">
          <div className="mt-4 gap-2 flex flex-col">
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              autoComplete="email"
            />
          </div>

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{' '}
          <a href="/login" className="text-brand-600 font-medium">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
