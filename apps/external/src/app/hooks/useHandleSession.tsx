import {
  AuthService,
  BudgetBucket,
  CreateAdminDto,
  CreateVendorDto,
  GuestCountBucket,
  UserRole,
  WeddingService,
  WeddingStyle,
  WeddingType,
  WeddingsService,
} from '@shared/api';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useHandleSession() {
  const router = useRouter();

  const handleSignUpAdmin = async (
    e: React.FormEvent,
    {
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    },
    setLoading: (loading: boolean) => void,
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create admin without wedding details (can be added later)
      await AuthService.authControllerRegisterAdmin({
        email,
        password,
        name,
        role: UserRole.ADMIN,
      } as CreateAdminDto);

      toast.success('Signup Successful.');
      const signin_res = await signIn('credentials', {
        username: email,
        password,
        redirect: false,
      });
      if (signin_res?.error) {
        toast.error('Login failed after signup: ' + signin_res.error);
      } else {
        router.push('/admin');
      }
    } catch (err) {
      console.log(err);
      let errorMessage = 'An unknown error occurred';

      try {
        if (err instanceof Error) {
          const bodyStart = err.message.indexOf('{');
          if (bodyStart !== -1) {
            const bodyString = err.message.slice(bodyStart);
            const body = JSON.parse(bodyString);
            if (body.message) {
              errorMessage = body.message;
            }
          }
        } else if (typeof err == 'string') {
          errorMessage = err;
        }
      } catch {
        // fallback to full message if parsing fails
        errorMessage = errorMessage;
      }

      toast.error(`Signup Failed. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpVendor = async (
    e: React.FormEvent,
    {
      email,
      password,
      role,
      name,
      vendorWebsite,
      uenNumber,
    }: {
      email: string;
      password: string;
      role: UserRole | undefined;
      name: string;
      vendorWebsite: string;
      uenNumber: string;
    },
    setLoading: (loading: boolean) => void,
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!role) {
        throw new Error('Missing field.');
      }
      await AuthService.authControllerRegisterVendor({
        email,
        password,
        role,
        name,
        vendorWebsite,
        uenNumber,
        onboardedDate: new Date().toISOString(),
      } as CreateVendorDto);

      toast.success('Signup Successful.');
      const signin_res = await signIn('credentials', {
        username: email,
        password,
        redirect: false,
      });
      if (signin_res?.error) {
        toast.error('Login failed after signup: ' + signin_res.error);
      } else {
        router.push('/vendor');
      }
    } catch (err) {
      console.log(err);
      let errorMessage = 'An unknown error occurred';

      try {
        if (err instanceof Error) {
          const bodyStart = err.message.indexOf('{');
          if (bodyStart !== -1) {
            const bodyString = err.message.slice(bodyStart);
            const body = JSON.parse(bodyString);
            if (body.message) {
              errorMessage = body.message;
            }
          }
        } else if (typeof err == 'string') {
          errorMessage = err;
        }
      } catch {
        // fallback to full message if parsing fails
        errorMessage = errorMessage;
      }

      toast.error(`Signup Failed. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (
    e: React.FormEvent,
    { username, password }: { username: string; password: string },
    setLoading: (loading: boolean) => void,
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });
      if (!res?.ok) throw new Error('Signin failed');
      toast('Successfully Login.');
      router.push('/user');
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return { handleSignUpAdmin, handleSignUpVendor, handleSignIn };
}
