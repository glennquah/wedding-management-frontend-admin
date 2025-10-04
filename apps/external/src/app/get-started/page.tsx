'use client';

import { useState } from 'react';

import { UserRole } from '@shared/api';
import FormField from '@shared/components/FormField';
import ResponsiveMenubar from '@shared/components/responsive-menubar';
import { Button } from '@shared/components/ui/button';
import RoleSelection from '@shared/components/ui/form/roleSelection';
import { useHandleSession } from '../hooks/useHandleSession';

export default function GetStartedPage() {
  // User Specific Fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>();

  // Vendor specific fields (optional, can be filled later)
  const [vendorWebsite, setVendorWebsite] = useState<string>('');
  const [uenNumber, setUenNumber] = useState<string>('');

  const { handleSignUpVendor, handleSignUpAdmin } = useHandleSession();

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6'>
      <ResponsiveMenubar />
      <div className='w-full max-w-lg bg-white p-8 rounded-2xl my-[100px] shadow-md'>
        <h2 className='text-3xl font-bold text-center mb-8'>Create an account</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (role === UserRole.ADMIN) {
              handleSignUpAdmin(
                e,
                {
                  email,
                  password,
                  name,
                },
                setLoading
              );
            } else if (role === UserRole.VENDOR) {
              // Format vendorWebsite to include https:// if missing
              const formattedVendorWebsite = vendorWebsite?.trim()
                ? /^https?:\/\//i.test(vendorWebsite)
                  ? vendorWebsite
                  : `https://${vendorWebsite}`
                : '';

              handleSignUpVendor(
                e,
                {
                  email,
                  password,
                  role,
                  name,
                  vendorWebsite: formattedVendorWebsite, // use formatted version
                  uenNumber,
                },
                setLoading
              );
            }
          }}
          className='space-y-4'
        >
          <FormField
            label='Name'
            id='name'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Enter your name'
          />
          <FormField
            label='Email'
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Enter your email'
          />
          <FormField
            label='Password'
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Enter your password'
          />
          {/* Role selection */}
          <RoleSelection role={role} setRole={setRole} />
          {/* Vendor fields */}
          {role === UserRole.VENDOR && (
            <>
            {/* Vendor Website Field */}
            <FormField
              label='Vendor Website'
              id='vendorWebsite'
              type='text' // use type=text for UX since users do not need to type https://
              value={vendorWebsite}
              onChange={(e) => setVendorWebsite(e.target.value)}
              placeholder='Enter your website'
            />
            {/* UEN Number Field */}
            <FormField
              label='UEN Number'
              id='uenNumber'
              type='text'
              value={uenNumber}
              onChange={(e) => setUenNumber(e.target.value)}
              placeholder='Enter your UEN number'
            />
            </>
          )}
          <Button
            type='submit'
            className='w-full mt-4'
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </Button>
        </form>
        <p className='text-center text-sm text-gray-500 mt-4'>
          Already have an account?{' '}
          <a href='/login' className='text-brand-600 font-medium'>
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
