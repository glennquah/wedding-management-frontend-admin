import { useCallback, useEffect, useState } from 'react';

import { useWeddingStore } from '@/app/store/sessionStore';
import { AdminsService, OpenAPI, WeddingResponseDto, WeddingsService } from '@shared/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export function useWeddingManager() {
  const { data: session, status } = useSession();
  const {
    selectedWeddingId,
    mainWeddingId,
    weddings,
    setSelectedWeddingId,
    setMainWeddingId,
    setWeddings,
  } = useWeddingStore();

  const [wedding, setWedding] = useState<WeddingResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authentication setup
  const setupAuth = useCallback(() => {
    if (session?.backendTokens?.accessToken) {
      OpenAPI.TOKEN = session.backendTokens.accessToken;
    }
  }, [session]);

  // Fetch all user weddings
  const fetchUserWeddings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      setupAuth();
      const userWeddings = await AdminsService.adminControllerGetMyWeddings();
      setWeddings(userWeddings);
    } catch (err) {
      setError('Failed to fetch weddings');
      console.error('Error fetching weddings:', err);
      toast.error('Failed to fetch weddings');
    } finally {
      setLoading(false);
    }
  }, [setupAuth, setWeddings]);

  // Fetch user's main wedding and set it as selected
  const fetchUserMainWedding = useCallback(async () => {
    try {
      setupAuth();
      const { mainWeddingId: fetchedMainWeddingId } =
        await AdminsService.adminControllerGetMyMainWedding();

      if (fetchedMainWeddingId) {
        setMainWeddingId(fetchedMainWeddingId);
        setSelectedWeddingId(fetchedMainWeddingId);

        // Fetch the wedding details using the main wedding ID
        const mainWedding = await WeddingsService.weddingControllerFindOne(fetchedMainWeddingId);
        setWedding(mainWedding);
      } else {
        // No main wedding set on the server
        setMainWeddingId(null);
      }
    } catch (err) {
      console.error('Error fetching main wedding:', err);
      toast.error('Failed to fetch main wedding');
    }
  }, [setupAuth, setMainWeddingId, setSelectedWeddingId]);

  // Select a specific wedding
  const selectWedding = useCallback(
    (weddingId: number) => {
      setSelectedWeddingId(weddingId);
      const selectedWedding = weddings.find((w) => w.id === weddingId);
      if (selectedWedding) {
        setWedding(selectedWedding);
      }
    },
    [setSelectedWeddingId, weddings],
  );

  // Fetch the currently selected wedding
  const fetchWedding = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      setupAuth();

      // First, get the main wedding ID from the API
      const { mainWeddingId: fetchedMainWeddingId } =
        await AdminsService.adminControllerGetMyMainWedding();

      // Fetch all weddings
      const userWeddings = await AdminsService.adminControllerGetMyWeddings();
      setWeddings(userWeddings);

      if (userWeddings.length > 0) {
        // Reflect server truth for main wedding: set to actual id, else null
        setMainWeddingId(fetchedMainWeddingId ?? null);

        // Use selected wedding if available, otherwise use main wedding, otherwise use first wedding as fallback
        let targetWedding;
        if (selectedWeddingId) {
          targetWedding = userWeddings.find((w) => w.id === selectedWeddingId);
        }

        if (!targetWedding && fetchedMainWeddingId) {
          targetWedding = userWeddings.find((w) => w.id === fetchedMainWeddingId);
          setSelectedWeddingId(fetchedMainWeddingId);
        }

        if (!targetWedding) {
          targetWedding = userWeddings[0];
          setSelectedWeddingId(targetWedding.id);
          // Do NOT promote first wedding to main; keep mainWeddingId as null when server has none
        }

        setWedding(targetWedding);
      } else {
        setError('No wedding found for this user');
      }
    } catch (err) {
      setError('Failed to fetch wedding information');
      console.error('Error fetching wedding:', err);
      toast.error('Failed to fetch wedding information');
    } finally {
      setLoading(false);
    }
  }, [setupAuth, selectedWeddingId, setMainWeddingId, setSelectedWeddingId, setWeddings]);

  // Initialize when session is available
  useEffect(() => {
    if (status === 'authenticated' && session) {
      fetchWedding();
    }
  }, [status, session, fetchWedding]);

  return {
    wedding,
    loading,
    error,
    weddings,
    selectedWeddingId,
    mainWeddingId,
    fetchUserWeddings,
    fetchUserMainWedding,
    selectWedding,
    refetch: fetchWedding,
    // Legacy props for backward compatibility
    isLoading: loading,
  };
}
