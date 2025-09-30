import { useState } from 'react';

import { MicrositeResponseDto } from '@shared/api';
import FormField from '@shared/components/FormField';
import { Button } from '@shared/components/ui/button';

export default function MicrositeLogin({
  micrositeData,
  decodedPlanName,
  handleMicrositeLogin,
}: {
  micrositeData: MicrositeResponseDto | null;
  decodedPlanName: string;
  handleMicrositeLogin: (
    firstNameInput: string,
    lastNameInput: string,
    passwordInput: string,
    decodedPlanName: string,
    setPasswordError: (error: string | null) => void,
    setNameError: (error: string | null) => void,
  ) => Promise<void>;
}) {
  // Local form state
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isValidatingAuth, setIsValidatingAuth] = useState(false);

  // Handle form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidatingAuth(true);

    try {
      await handleMicrositeLogin(
        firstNameInput,
        lastNameInput,
        passwordInput,
        decodedPlanName,
        setPasswordError,
        setNameError,
      );
    } finally {
      setIsValidatingAuth(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-md">
        <div className="text-center mb-6">
          <p className="text-sm uppercase tracking-wider text-brand-600 mb-2">Wedding Microsite</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{micrositeData?.coupleName}</h1>
          <p className="text-gray-600">
            Please enter your details to access{' '}
            <span className="font-medium text-brand-600">{decodedPlanName}</span>
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="First Name"
              id="firstName"
              type="text"
              value={firstNameInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFirstNameInput(e.target.value)
              }
              placeholder="First name"
              required
            />
            <FormField
              label="Last Name"
              id="lastName"
              type="text"
              value={lastNameInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLastNameInput(e.target.value)
              }
              placeholder="Last name"
              required
            />
          </div>
          {nameError && <p className="text-sm text-red-600">{nameError}</p>}

          <div className="gap-2 flex flex-col">
            <FormField
              label="Password"
              id="password"
              type="password"
              value={passwordInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPasswordInput(e.target.value)
              }
              placeholder="Enter microsite password"
              required
            />
            {passwordError && <p className="text-sm text-red-600 mt-1">{passwordError}</p>}
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isValidatingAuth}>
            {isValidatingAuth ? 'Verifying...' : 'Access Microsite'}
          </Button>
        </form>
      </div>
    </div>
  );
}
