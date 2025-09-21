'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { VendorResponseDto, VendorsService, UserRole } from '@shared/api';

interface VendorSessionContextType {
  vendorData: VendorResponseDto | null;
  vendorId: number | null;
  isLoading: boolean;
  error: string | null;
  refetchVendorData: () => Promise<void>;
}

const VendorSessionContext = createContext<VendorSessionContextType | undefined>(undefined);

interface VendorSessionProviderProps {
  children: ReactNode;
}

export function VendorSessionProvider({ children }: VendorSessionProviderProps) {
  const { data: session } = useSession();
  const [vendorData, setVendorData] = useState<VendorResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendorData = async () => {
    if (!session?.user?.id || session.user.role !== UserRole.VENDOR) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch vendor data using the user ID from session
      const vendor = await VendorsService.vendorControllerGetVendor(session.user.id);
      setVendorData(vendor);
    } catch (err) {
      console.error('Error fetching vendor data:', err);
      setError('Failed to load vendor information');
      setVendorData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchVendorData = async () => {
    await fetchVendorData();
  };

  useEffect(() => {
    fetchVendorData();
  }, [session?.user?.id, session?.user?.role]);

  const contextValue: VendorSessionContextType = {
    vendorData,
    vendorId: vendorData?.id || null,
    isLoading,
    error,
    refetchVendorData,
  };

  return (
    <VendorSessionContext.Provider value={contextValue}>
      {children}
    </VendorSessionContext.Provider>
  );
}

export function useVendorSession(): VendorSessionContextType {
  const context = useContext(VendorSessionContext);

  if (context === undefined) {
    throw new Error('useVendorSession must be used within a VendorSessionProvider');
  }

  return context;
}