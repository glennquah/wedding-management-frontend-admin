import { useCallback, useEffect, useRef, useState } from 'react';

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

  // Use ref to access latest session without triggering re-renders
  const sessionRef = useRef(session);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Authentication setup - stable function
  const setupAuth = useCallback(() => {
    if (sessionRef.current?.backendTokens?.accessToken) {
      OpenAPI.TOKEN = sessionRef.current.backendTokens.accessToken;
    }
  }, []);

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
        // Set the main wedding ID if we got one from the API
        if (fetchedMainWeddingId) {
          setMainWeddingId(fetchedMainWeddingId);
        }

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
  // Use a ref to track if we've already initialized to prevent infinite loops
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (status === 'authenticated' && session && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchWedding();
    }
  }, [status, session]); // Remove fetchWedding from dependencies to prevent loop

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
