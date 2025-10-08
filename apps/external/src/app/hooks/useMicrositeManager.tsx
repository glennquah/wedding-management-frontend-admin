'use client';

import { useCallback, useState } from 'react';

import { GuestResponseDto, MicrositeResponseDto, MicrositeService } from '@shared/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UseMicrositeManagerReturn {
  // State
  micrositeData: MicrositeResponseDto | null;
  isLoadingMicrosite: boolean;
  micrositeError: string | null;
  guestDetails: GuestResponseDto | null;
  isValidatingAuth: boolean;
  hasAccess: boolean;
  isWeddingLive: boolean;

  // Functions
  fetchMicrositeData: (decodedPlanName: string) => Promise<void>;
  handleMicrositeLogin: (
    firstNameInput: string,
    lastNameInput: string,
    passwordInput: string,
    decodedPlanName: string,
    setPasswordError: (error: string | null) => void,
    setNameError: (error: string | null) => void,
  ) => Promise<void>;
  handleConfirmGuestAttendance: (allergies?: string[]) => Promise<void>;
  checkWeddingStatus: () => void;

  // State setters
  setMicrositeData: (data: MicrositeResponseDto | null) => void;
  setGuestDetails: (details: GuestResponseDto | null) => void;
  setHasAccess: (access: boolean) => void;
}

export const useMicrositeManager = (): UseMicrositeManagerReturn => {
  const router = useRouter();

  // State
  const [micrositeData, setMicrositeData] = useState<MicrositeResponseDto | null>(null);
  const [isLoadingMicrosite, setIsLoadingMicrosite] = useState(true);
  const [micrositeError, setMicrositeError] = useState<string | null>(null);
  const [guestDetails, setGuestDetails] = useState<GuestResponseDto | null>(null);
  const [isValidatingAuth, setIsValidatingAuth] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isWeddingLive, setIsWeddingLive] = useState(false);

  const fetchMicrositeData = useCallback(
    async (decodedPlanName: string) => {
      try {
        setIsLoadingMicrosite(true);
        const response =
          await MicrositeService.micrositeControllerGetMicrositeDetails(decodedPlanName);
        setMicrositeData(response);
        setMicrositeError(null);
      } catch (err: unknown) {
        console.error('Error fetching microsite data:', err);
        const status = (() => {
          if (typeof err === 'object' && err !== null) {
            const maybe = (err as Record<string, unknown>).status;
            return typeof maybe === 'number' ? maybe : undefined;
          }
          return undefined;
        })();
        if (status === 404) {
          router.replace('/microsite/not-found');
          return;
        }
        setMicrositeError('Failed to load microsite data.');
      } finally {
        setIsLoadingMicrosite(false);
      }
    },
    [router],
  );

  const handleMicrositeLogin = useCallback(
    async (
      firstNameInput: string,
      lastNameInput: string,
      passwordInput: string,
      decodedPlanName: string,
      setPasswordError: (error: string | null) => void,
      setNameError: (error: string | null) => void,
    ) => {
      setIsValidatingAuth(true);
      setPasswordError(null);
      setNameError(null);

      try {
        if (!firstNameInput.trim() || !lastNameInput.trim()) {
          setNameError('Please enter both first and last name.');
          return;
        }
        if (!passwordInput.trim()) {
          setPasswordError('Please enter the password.');
          return;
        }

        // Step 1: Check if guest exists
        const capitalizeFirstLetter = (str: string) =>
          str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

        const formattedFirstName = capitalizeFirstLetter(firstNameInput.trim());
        const formattedLastName = capitalizeFirstLetter(lastNameInput.trim());
        const guestName = `${formattedFirstName} ${formattedLastName}`;

        // Use the API to get guest details for RSVP lookup
        const response = await MicrositeService.micrositeControllerGetGuestDetails({
          fullName: guestName,
          micrositeSlug: decodedPlanName,
        });

        // Convert API response to expected format
        setGuestDetails({
          id: response.id,
          name: response.name,
          email: response.email || '',
          group: response.group || 'General',
          accompanyingGuests: Array.isArray(response.accompanyingGuests)
            ? response.accompanyingGuests
            : [],
          weddingId: response.weddingId,
          weddingName: response.weddingName,
          confirmationStatus: response.confirmationStatus,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
        });

        // Step 2: Validate password
        const passwordResponse = await MicrositeService.micrositeControllerValidatePassword({
          slug: decodedPlanName,
          password: passwordInput.trim(),
        });

        // Check if password is actually valid
        if (!passwordResponse.isValid) {
          setPasswordError('Invalid password. Please try again.');
          return;
        }

        setHasAccess(true);
        setPasswordError(null);
        setNameError(null);
      } catch (err: unknown) {
        console.error('Authentication error:', err);
        const status = (() => {
          if (typeof err === 'object' && err !== null) {
            const maybe = (err as Record<string, unknown>).status;
            return typeof maybe === 'number' ? maybe : undefined;
          }
          return undefined;
        })();
        if (status === 404) {
          setNameError('Guest not found. Please check your name spelling.');
        } else if (status === 401) {
          setPasswordError('Invalid password. Please try again.');
        } else {
          setPasswordError('Authentication failed. Please try again.');
        }
      } finally {
        setIsValidatingAuth(false);
      }
    },
    [],
  );

  const handleConfirmGuestAttendance = useCallback(
    async (allergies?: string[]) => {
      if (!guestDetails || !micrositeData) return;

      try {
        await MicrositeService.micrositeControllerConfirmGuest({
          guestId: guestDetails.id,
          weddingId: micrositeData.weddingId!,
          allergies: allergies && allergies.length > 0 ? allergies.join(',') : undefined,
        });

        toast.success('Thanks for confirming your attendance!');
      } catch (err: unknown) {
        console.error('Error confirming attendance:', err);
        toast.error(
          typeof err === 'string' ? err : err instanceof Error ? err.message : 'An error occurred',
        );
      }
    },
    [guestDetails, micrositeData],
  );

  const checkWeddingStatus = () => {
    if (!micrositeData?.weddingDate) return;

    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const weddingDate = new Date(micrositeData.weddingDate);
    const weddingDateOnly = new Date(
      weddingDate.getFullYear(),
      weddingDate.getMonth(),
      weddingDate.getDate(),
    );

    const isLive = todayDateOnly >= weddingDateOnly;

    setIsWeddingLive(isLive);
    return isLive;
  };

  return {
    // State
    micrositeData,
    isLoadingMicrosite,
    micrositeError,
    guestDetails,
    isValidatingAuth,
    hasAccess,
    isWeddingLive,

    // Functions
    fetchMicrositeData,
    handleMicrositeLogin,
    handleConfirmGuestAttendance,
    checkWeddingStatus,

    // State setters
    setMicrositeData,
    setGuestDetails,
    setHasAccess,
  };
};
