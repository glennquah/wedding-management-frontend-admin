'use client';

import { useState } from 'react';

import { UserRole, WeddingService, WeddingStyle, WeddingType } from '@shared/api';
import FormField from '@shared/components/FormField';
import ResponsiveMenubar from '@shared/components/responsive-menubar';
import { TextInputWithAI } from '@shared/components/textInputWithAI';
import { Button } from '@shared/components/ui/button';
import { MultiSelectDropdown } from '@shared/components/ui/form/multiSelectDropdown';
import RoleSelection from '@shared/components/ui/form/roleSelection';
import { SingleSelectDropdown } from '@shared/components/ui/form/singleSelectDropdown';
import { useRouter } from 'next/navigation';
import { useHandleSession } from '../hooks/useHandleSession';
import { useSessionStore } from '../store/sessionStore';

export default function GetStartedPage() {
  const router = useRouter();
  // User Specific Fields
  const { name: savedName, email: savedEmail, password: savedPassword } = useSessionStore();

  const [name, setName] = useState<string>(savedName || '');
  const [email, setEmail] = useState<string>(savedEmail || '');
  const [password, setPassword] = useState<string>(savedPassword || '');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>();

  // Vendor specific fields
  const [vendorWebsite, setVendorWebsite] = useState<string>('');
  const [uenNumber, setUenNumber] = useState<string>('');
  const [serviceOffered, setServiceOffered] = useState<WeddingService>();
  const [styleOffered, setStyleOffered] = useState<WeddingStyle>();
  const [weddingTypes, setWeddingTypes] = useState<WeddingType[]>([]);
  const [bio, setBio] = useState<string>('');
  
  const { handleSignUpVendor } = useHandleSession();

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6'>
      <ResponsiveMenubar />
      <div className='w-full max-w-lg bg-white p-8 rounded-2xl my-[100px] shadow-md'>
        <h2 className='text-3xl font-bold text-center mb-8'>Create an account</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();

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
                serviceOffered,
                styleOffered,
                weddingTypes,
                vendorWebsite: formattedVendorWebsite, // use formatted version
                uenNumber,
                bio,
              },
              setLoading
            );
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
          {role === 'vendor' && (
            <>
            {/* Wedding Type (multi select) */}
            <MultiSelectDropdown
              label='Wedding Type*'
              options={Object.values(WeddingType)}
              selected={weddingTypes}
              setSelected={setWeddingTypes}
              placeholder='Select wedding types'
            />
            {/* Services Offered (single-select) */}
            <SingleSelectDropdown
              label='Service Offered*'
              options={Object.values(WeddingService)}
              selected={serviceOffered}
              setSelected={setServiceOffered}
              placeholder='Select service'
            />
            {/* Style Offered (single select) */}
            <SingleSelectDropdown
              label='Style Offered*'
              options={Object.values(WeddingStyle)}
              selected={styleOffered}
              setSelected={setStyleOffered}
              placeholder='Select style'
            />
            {/* Short Bio Field */}
            <TextInputWithAI
                label='Short Bio'
                placeholder='Tell us about your company...'
                value={bio}
                setValue={setBio}
                message={`Create or refine a vendor bio for a wedding platform.
                  ${weddingTypes ? ` Wedding type: ${weddingTypes}.` : ''}${
                    serviceOffered ? ` Services: ${serviceOffered}.` : ''
                  }
                  ${styleOffered ? ` Style: ${styleOffered}.` : ''}${
                    bio ? ` Existing bio: '${bio}'.` : ''
                  }
                  Keep it concise and professional. Max 50 words. DO NOT wrap the response in quotes.`}
              />
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
          {role === 'admin' ? (
            <Button
              type='button'
              className='w-full mt-4'
              disabled={loading}
              onClick={() => {
                useSessionStore.getState().setEmail(email);
                useSessionStore.getState().setName(name);
                useSessionStore.getState().setPassword(password);
                router.push('/get-started/couple');
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              type='submit'
              className='w-full mt-4'
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </Button>
          )}
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
