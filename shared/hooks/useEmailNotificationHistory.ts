'use client';

import { useState, useEffect, useCallback } from 'react';
import { EmailNotificationHistoryResponseDto, NotificationDetailsService } from '../api';

interface UseEmailNotificationHistoryReturn {
  data: EmailNotificationHistoryResponseDto[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useEmailNotificationHistory = (): UseEmailNotificationHistoryReturn => {
  const [data, setData] = useState<EmailNotificationHistoryResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmailNotificationHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const history = await NotificationDetailsService.notificationDetailsControllerGetAllEmailNotificationHistory();
      setData(history);
    } catch (err) {
      console.error('Error fetching email notification history:', err);
      setError('Failed to load email notification history');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchEmailNotificationHistory();
  }, [fetchEmailNotificationHistory]);

  useEffect(() => {
    fetchEmailNotificationHistory();
  }, [fetchEmailNotificationHistory]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};