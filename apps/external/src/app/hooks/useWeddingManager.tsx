import { useCallback, useState } from 'react';

import { useWeddingStore } from '../store/sessionStore';
import {
  AdminResponseDto,
  AdminsService,
  OpenAPI,
  WeddingResponseDto,
  WeddingsService,
} from '@shared/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export function useWeddingManager() {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const setWeddings = useWeddingStore((state) => state.setWeddings);
  const setSelectedWeddingId = useWeddingStore((state) => state.setSelectedWeddingId);
  const setMainWeddingId = useWeddingStore((state) => state.setMainWeddingId);

  // Authentication setup
  const setupAuth = useCallback(() => {
    if (session?.backendTokens?.accessToken) {
      OpenAPI.TOKEN = session.backendTokens.accessToken;
    }
  }, [session]);

  // Fetching admin's main wedding
  const fetchUserMainWedding = useCallback(async (): Promise<AdminResponseDto | null> => {
    try {
      setLoading(true);
      setupAuth();
      const mainWedding = await AdminsService.adminControllerGetMyMainWedding();
      if (mainWedding && mainWedding.mainWeddingId) {
        setMainWeddingId && setMainWeddingId(mainWedding.mainWeddingId);
        setSelectedWeddingId && setSelectedWeddingId(mainWedding.mainWeddingId);
      }
      return null;
    } catch (err) {
      console.error("Error fetching user's main wedding:", err);
      toast.error("Failed to fetch user's wedding information");
      return null;
    } finally {
      setLoading(false);
    }
  }, [setupAuth]);

  // Fetch wedding ID for the current user (use first wedding in array)
  const fetchUserWeddings = useCallback(async (): Promise<WeddingResponseDto[] | null> => {
    try {
      setLoading(true);
      setupAuth();
      const weddings = await WeddingsService.weddingControllerGetAdminWeddings();
      if (weddings.length > 0) {
        setWeddings && setWeddings(weddings);
      }
      return null;
    } catch (err) {
      console.error('Error fetching user wedding:', err);
      toast.error('Failed to fetch wedding information');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setupAuth]);

  const selectWedding = useCallback(
    (weddingId: number | null) => {
      setSelectedWeddingId && setSelectedWeddingId(weddingId);
    },
    [setSelectedWeddingId],
  );

  return {
    loading,
    fetchUserMainWedding,
    fetchUserWeddings,
    selectWedding,
  };
}
