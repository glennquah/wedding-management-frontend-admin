'use client';

import { useEffect, useState } from 'react';

import { AuthService, ResetPasswordDto } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/form/input';
import { Label } from '@shared/components/ui/form/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    // Get token from URL parameters
    const urlToken = searchParams ? searchParams.get('token') : null;
    setToken(urlToken);
    setIsCheckingToken(false);

    if (!urlToken) {
      toast.error('Invalid reset link. Please contact support.');
    }
  }, [searchParams]);

  const validateForm = () => {
    if (!newPassword) {
      toast.error('Please enter a new password');
      return false;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const resetData: ResetPasswordDto = {
        token,
        newPassword,
      };

      await AuthService.authControllerResetPassword(resetData);

      toast.success('Password set successfully! You can now log in with your new password.');
      router.push('/login');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Password reset error:', error);

      if (error?.status === 401) {
        toast.error('Invalid or expired reset token. Please contact support.');
      } else {
        toast.error('Failed to set password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6">
        <div className="w-full max-w-lg bg-white p-8 mt-[72px] rounded-2xl shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Loading...</h2>
            <p className="text-gray-600">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6">
        <div className="w-full max-w-lg bg-white p-8 mt-[72px] rounded-2xl shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">The password reset link is invalid or has expired.</p>
            <Button onClick={() => router.push('/login')} className="w-full">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6">
      <div className="w-full max-w-lg bg-white p-8 mt-[72px] rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Set Your Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Welcome to the Super Admin portal. Please set your password below.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="mt-4 gap-2 flex flex-col">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter your new password"
              minLength={8}
            />
          </div>

          <div className="mt-4 gap-2 flex flex-col">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your new password"
              minLength={8}
            />
          </div>

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? 'Setting Password...' : 'Set Password'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have a password?{' '}
          <a href="/login" className="text-brand-600 font-medium">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
