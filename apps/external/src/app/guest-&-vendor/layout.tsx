'use client';

import ResponsiveMenubar from '@shared/components/responsive-menubar';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';

export default function GuestVendorLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobileScreen();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100">
      <ResponsiveMenubar />
      {!isMobile && <div className="mt-[72px] w-full" />}
      {children}
    </div>
  );
}
