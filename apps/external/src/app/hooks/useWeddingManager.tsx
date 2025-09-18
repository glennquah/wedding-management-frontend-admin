import { useCallback, useEffect, useState } from 'react';

import { useWeddingStore } from '@/app/store/sessionStore';
import { OpenAPI, WeddingResponseDto, WeddingsService } from '@shared/api';
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
    setWeddings
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
      const userWeddings = await WeddingsService.weddingControllerFindAll();
      setWeddings(userWeddings);

      if (userWeddings.length > 0 && !mainWeddingId) {
        // Set first wedding as main wedding if not set
        setMainWeddingId(userWeddings[0].id);
      }
    } catch (err) {
      setError('Failed to fetch weddings');
      console.error('Error fetching weddings:', err);
      toast.error('Failed to fetch weddings');
    } finally {
      setLoading(false);
    }
  }, [setupAuth, setWeddings, mainWeddingId, setMainWeddingId]);

  // Fetch user's main wedding and set it as selected
  const fetchUserMainWedding = useCallback(async () => {
    try {
      setupAuth();
      const userWeddings = await WeddingsService.weddingControllerFindAll();

      if (userWeddings.length > 0) {
        const mainWedding = userWeddings[0];
        setMainWeddingId(mainWedding.id);
        setSelectedWeddingId(mainWedding.id);
        setWedding(mainWedding);
      }
    } catch (err) {
      console.error('Error fetching main wedding:', err);
      toast.error('Failed to fetch main wedding');
    }
  }, [setupAuth, setMainWeddingId, setSelectedWeddingId]);

  // Select a specific wedding
  const selectWedding = useCallback((weddingId: number) => {
    setSelectedWeddingId(weddingId);
    const selectedWedding = weddings.find(w => w.id === weddingId);
    if (selectedWedding) {
      setWedding(selectedWedding);
    }
  }, [setSelectedWeddingId, weddings]);

  // Legacy fetch wedding function for backward compatibility
  const fetchWedding = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      setupAuth();
      const userWeddings = await WeddingsService.weddingControllerFindAll();

      if (userWeddings.length > 0) {
        setWedding(userWeddings[0]);
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
  }, [setupAuth]);

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
