import { useCallback, useEffect, useState } from 'react';

import { useWeddingManager } from './useWeddingManager';
import {
  AttendeeAvailability,
  CalendarService,
  GuestResponseDto,
  GuestsService,
  OpenAPI,
  WeddingsService,
} from '@shared/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export type KeyAttendee = {
  id: number;
  name: string;
  email: string;
  calendarConnected: boolean;
};

export function useDateOptimizer() {
  const { data: session } = useSession();
  const { selectedWeddingId } = useWeddingManager();

  // State
  const [guests, setGuests] = useState<GuestResponseDto[]>([]);
  const [keyAttendees, setKeyAttendees] = useState<KeyAttendee[]>([]);
  const [isAddAttendeeModalOpen, setIsAddAttendeeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasRunAnalysis, setHasRunAnalysis] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<AttendeeAvailability[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [preferredDays, setPreferredDays] = useState<string[]>(['Friday', 'Saturday', 'Sunday']);

  // Authentication setup
  const setupAuth = useCallback(() => {
    if (session?.backendTokens?.accessToken) {
      OpenAPI.TOKEN = session.backendTokens.accessToken;
    }
  }, [session]);

  // Check calendar connection status for an attendee
  const checkCalendarStatus = useCallback(
    async (adminId: number): Promise<boolean> => {
      if (!session?.backendTokens?.accessToken) return false;

      try {
        setupAuth();
        const data = await CalendarService.calendarControllerGetConnectionStatus(adminId);
        return data.isConnected || false;
      } catch (error) {
        console.error('Error checking calendar status:', error);
        return false;
      }
    },
    [session, setupAuth],
  );

  // Fetch collaborators, guests, and key attendees
  const fetchData = useCallback(async () => {
    if (!selectedWeddingId || !session?.backendTokens?.accessToken) return;

    try {
      setLoading(true);
      setupAuth();

      // Fetch guests
      const guestsData = await GuestsService.guestControllerGetGuestsByWedding(selectedWeddingId);
      setGuests(guestsData);

      // Fetch key attendees
      const keyAttendeesResponse =
        await WeddingsService.weddingControllerGetKeyAttendees(selectedWeddingId);
      const keyAttendeeIds = keyAttendeesResponse.keyAttendeeIds || [];

      // Convert to KeyAttendee objects - find in guests
      const attendeesPromises = keyAttendeeIds.map(async (id: number) => {
        const guest = guestsData.find((g) => g.id === id);
        if (!guest) return null;

        const isConnected = await checkCalendarStatus(id);
        return {
          id: guest.id,
          name: guest.name,
          email: guest.email,
          calendarConnected: isConnected,
        };
      });

      const attendees = (await Promise.all(attendeesPromises)).filter(Boolean) as KeyAttendee[];
      setKeyAttendees(attendees);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [selectedWeddingId, session, setupAuth, checkCalendarStatus]);

  // Check for calendar connection success from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get('calendar_connected') === 'success';

    if (isSuccess) {
      // Remove the query param immediately
      window.history.replaceState({}, '', window.location.pathname);

      // Show success toast
      toast.success('🎉 Calendar connected successfully!', {
        description: 'Your availability will now be used for date optimization',
        duration: 5000,
      });

      // Refresh all calendar statuses after a short delay
      setTimeout(async () => {
        const updatedAttendees = await Promise.all(
          keyAttendees.map(async (attendee) => {
            const isConnected = await checkCalendarStatus(attendee.id);
            return { ...attendee, calendarConnected: isConnected };
          }),
        );
        setKeyAttendees(updatedAttendees);
      }, 1000);
    }
  }, [keyAttendees, checkCalendarStatus]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch availability data for the selected month
  const fetchAvailability = useCallback(async () => {
    if (!selectedWeddingId || !session?.backendTokens?.accessToken) return;
    if (keyAttendees.length === 0) return;

    try {
      setIsLoadingAvailability(true);
      setupAuth();

      // Get start and end dates for the month (with buffer)
      const startDate = new Date(selectedMonth);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(selectedMonth);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);

      // Fetch availability for all connected key attendees
      const connectedAttendeeIds = keyAttendees.filter((a) => a.calendarConnected).map((a) => a.id);

      if (connectedAttendeeIds.length === 0) {
        setAvailabilityData([]);
        return;
      }

      const response = await CalendarService.calendarControllerCheckAvailability({
        collaboratorIds: connectedAttendeeIds,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      setAvailabilityData(response.attendees);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to fetch calendar availability');
    } finally {
      setIsLoadingAvailability(false);
    }
  }, [selectedWeddingId, session, keyAttendees, selectedMonth, setupAuth]);

  // Run analysis
  const handleRunAnalysis = useCallback(() => {
    setHasRunAnalysis(true);
    fetchAvailability();
  }, [fetchAvailability]);

  // Add key attendee
  const handleAddKeyAttendee = useCallback(
    async (attendee: GuestResponseDto) => {
      if (!selectedWeddingId || !session?.backendTokens?.accessToken) return;

      try {
        setupAuth();

        // Check if calendar is already connected
        const isConnected = await checkCalendarStatus(attendee.id);

        const newAttendee: KeyAttendee = {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          calendarConnected: isConnected,
        };

        // Save to backend
        await WeddingsService.weddingControllerAddKeyAttendee(selectedWeddingId, attendee.id);

        setKeyAttendees((prev) => [...prev, newAttendee]);
        setIsAddAttendeeModalOpen(false);
        toast.success(`${attendee.name} added as key attendee`);
      } catch (error) {
        console.error('Error adding key attendee:', error);
        toast.error('Failed to add key attendee');
      }
    },
    [selectedWeddingId, session, setupAuth, checkCalendarStatus],
  );

  // Remove key attendee
  const handleRemoveKeyAttendee = useCallback(
    async (id: number) => {
      if (!selectedWeddingId || !session?.backendTokens?.accessToken) return;

      try {
        setupAuth();

        // Remove from backend
        await WeddingsService.weddingControllerRemoveKeyAttendee(selectedWeddingId, id);

        setKeyAttendees((prev) => prev.filter((a) => a.id !== id));
        toast.success('Key attendee removed');
      } catch (error) {
        console.error('Error removing key attendee:', error);
        toast.error('Failed to remove key attendee');
      }
    },
    [selectedWeddingId, session, setupAuth],
  );

  // Request calendar access
  const handleRequestCalendarAccess = useCallback(
    async (attendee: KeyAttendee) => {
      if (!selectedWeddingId || !session?.backendTokens?.accessToken) {
        toast.error('Unable to request calendar access');
        return;
      }

      try {
        setupAuth();

        await CalendarService.calendarControllerRequestCalendarAccess({
          collaboratorId: attendee.id,
          weddingId: selectedWeddingId,
        });

        toast.success(`Calendar access request sent to ${attendee.name}`);
      } catch (error) {
        console.error('Error requesting calendar access:', error);
        toast.error('Failed to send calendar access request');
      }
    },
    [selectedWeddingId, session, setupAuth],
  );

  // Modal controls
  const openAddAttendeeModal = useCallback(() => {
    setIsAddAttendeeModalOpen(true);
  }, []);

  const closeAddAttendeeModal = useCallback(() => {
    setIsAddAttendeeModalOpen(false);
  }, []);

  // Reset analysis
  const resetAnalysis = useCallback(() => {
    setHasRunAnalysis(false);
    setAvailabilityData([]);
  }, []);

  // Month change handler
  const handleMonthChange = useCallback((newMonth: Date) => {
    setSelectedMonth(newMonth);
  }, []);

  // Refetch availability when month changes
  useEffect(() => {
    if (hasRunAnalysis) {
      fetchAvailability();
    }
  }, [selectedMonth, hasRunAnalysis, fetchAvailability]);

  return {
    // Data
    guests,
    keyAttendees,
    loading,
    hasRunAnalysis,
    availabilityData,
    isLoadingAvailability,
    selectedMonth,
    preferredDays,

    // Modal states
    isAddAttendeeModalOpen,

    // Handlers
    handleRunAnalysis,
    handleAddKeyAttendee,
    handleRemoveKeyAttendee,
    handleRequestCalendarAccess,
    resetAnalysis,
    handleMonthChange,
    setPreferredDays,

    // Modal controls
    openAddAttendeeModal,
    closeAddAttendeeModal,
  };
}
