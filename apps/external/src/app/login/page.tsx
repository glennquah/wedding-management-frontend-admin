'use client';

import { useState } from 'react';

import { UserRole } from '@shared/api';
import ResponsiveMenubar from '@shared/components/responsive-menubar';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/form/input';
import { Label } from '@shared/components/ui/form/label';
import { getSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });

      if (res?.error) {
        toast.error('Invalid username or password');
        return;
      }

      // Get the session to check user role
      const session = await getSession();

      if (!session?.user) {
        toast.error('Authentication failed. Please try again.');
        return;
      }

      // Check if user has admin or vendor role (NOT super admin)
      if (session.user.role === UserRole.SUPER_ADMIN) {
        toast.error('Access denied. Super admins must use the super admin portal.');
        await signOut({ redirect: false });
        return;
      }

      if (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.VENDOR) {
        toast.error('Access denied. Admin or vendor privileges required.');
        await signOut({ redirect: false });
        return;
      }

      toast.success('Successfully logged in!');
      router.push(`/${session.user.role}`);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6">
      <ResponsiveMenubar />
      <div className="w-full max-w-lg bg-white p-8 mt-[72px] rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Login to your account</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="mt-4 gap-2 flex flex-col">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="your email"
            />
          </div>
          <div className="mt-4 gap-2 flex flex-col">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{' '}
          <a href="/get-started" className="text-brand-600 font-medium">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
