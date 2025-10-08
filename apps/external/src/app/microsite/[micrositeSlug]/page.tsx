'use client';

import { use, useEffect, useMemo, useRef, useState } from 'react';

import { useMicrositeManager } from '../../hooks/useMicrositeManager';
import MicrositeLogin from '../components/MicrositeLogin';
import TemplateOne from '../components/templates/templateOne';
import TemplateThree from '../components/templates/templateThree';
import TemplateTwo from '../components/templates/templateTwo';
import { useRouter } from 'next/navigation';

export type PageProps = {
  params: Promise<{ micrositeSlug: string }>;
};

export default function MicrositePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const decodedPlanName = useMemo(
    () => decodeURIComponent(resolvedParams.micrositeSlug),
    [resolvedParams.micrositeSlug],
  );
  const router = useRouter();

  // Use the microsite manager hook
  const {
    micrositeData,
    isLoadingMicrosite,
    micrositeError,
    guestDetails,
    hasAccess,
    fetchMicrositeData,
    handleMicrositeLogin,
    handleConfirmGuestAttendance,
    setHasAccess,
  } = useMicrositeManager();

  // Local UI state
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // Fetch microsite data on mount
  useEffect(() => {
    setIsCheckingAccess(false);
    setHasAccess(false);
    fetchMicrositeData(decodedPlanName);
  }, [decodedPlanName, fetchMicrositeData, setHasAccess]);

  const rsvpRef = useRef<HTMLDivElement | null>(null);

  if (isCheckingAccess || isLoadingMicrosite) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        {isLoadingMicrosite ? 'Loading microsite...' : 'Checking access...'}
      </div>
    );
  }

  if (micrositeError) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        {micrositeError}
      </div>
    );
  }

  if (!micrositeData) {
    router.replace('/microsite/not-found');
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Redirecting to not found page...
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <MicrositeLogin
        micrositeData={micrositeData}
        decodedPlanName={decodedPlanName}
        handleMicrositeLogin={handleMicrositeLogin}
      />
    );
  }

  return micrositeData.templateNumber === 1 ? (
    <TemplateOne
      micrositeData={micrositeData}
      rsvpRef={rsvpRef}
      guestDetails={guestDetails}
      handleConfirmGuestAttendance={handleConfirmGuestAttendance}
    />
  ) : micrositeData.templateNumber === 2 ? (
    <TemplateTwo
      micrositeData={micrositeData}
      rsvpRef={rsvpRef}
      guestDetails={guestDetails}
      handleConfirmGuestAttendance={handleConfirmGuestAttendance}
    />
  ) : (
    <TemplateThree
      micrositeData={micrositeData}
      rsvpRef={rsvpRef}
      guestDetails={guestDetails}
      handleConfirmGuestAttendance={handleConfirmGuestAttendance}
    />
  );
}
