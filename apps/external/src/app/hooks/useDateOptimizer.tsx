import { useCallback, useEffect, useState } from 'react';

import { useWeddingManager } from './useWeddingManager';
import {
  AttendeeAvailability,
  CalendarConnectionStatusDto,
  CalendarService,
  DateRecommendationDto,
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
  accessStatus?: CalendarConnectionStatusDto.accessStatus;
};

export type MainCouplePartner = {
  id: number;
  name: string;
  email: string;
  calendarConnected: boolean;
  accessStatus?: CalendarConnectionStatusDto.accessStatus;
};

export type DateRecommendation = DateRecommendationDto;

export function useDateOptimizer() {
  const { data: session } = useSession();
  const { selectedWeddingId } = useWeddingManager();

  // State
  const [guests, setGuests] = useState<GuestResponseDto[]>([]);
  const [keyAttendees, setKeyAttendees] = useState<KeyAttendee[]>([]);
  const [mainCouple, setMainCouple] = useState<MainCouplePartner[]>([]);
  const [isAddAttendeeModalOpen, setIsAddAttendeeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasRunAnalysis, setHasRunAnalysis] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<AttendeeAvailability[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [preferredDays, setPreferredDays] = useState<string[]>([]);
  const [dateRecommendations, setDateRecommendations] = useState<DateRecommendation[]>([]);
  const [earliestDate, setEarliestDate] = useState<string>('');
  const [latestDate, setLatestDate] = useState<string>('');

  // Authentication setup
  const setupAuth = useCallback(() => {
    if (session?.backendTokens?.accessToken) {
      OpenAPI.TOKEN = session.backendTokens.accessToken;
    }
  }, [session]);

  // Check calendar connection status for an attendee or admin
  const checkCalendarStatus = useCallback(
    async (
      userId: number,
      isAdmin: boolean = false,
    ): Promise<{
      isConnected: boolean;
      accessStatus: CalendarConnectionStatusDto.accessStatus;
    }> => {
      if (!session?.backendTokens?.accessToken) {
        return {
          isConnected: false,
          accessStatus: CalendarConnectionStatusDto.accessStatus.NOT_REQUESTED,
        };
      }

      try {
        setupAuth();
        const data = await CalendarService.calendarControllerGetConnectionStatus(userId, isAdmin);
        return {
          isConnected: data.isConnected || false,
          accessStatus: data.accessStatus || CalendarConnectionStatusDto.accessStatus.NOT_REQUESTED,
        };
      } catch (error) {
        console.error('Error checking calendar status:', error);
        return {
          isConnected: false,
          accessStatus: CalendarConnectionStatusDto.accessStatus.NOT_REQUESTED,
        };
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

      // Fetch main couple
      const mainCoupleResponse =
        await WeddingsService.weddingControllerGetMainCouple(selectedWeddingId);
      const mainCouplePromises = mainCoupleResponse.map(async (partner) => {
        if (!partner.id || !partner.name || !partner.email) {
          throw new Error('Invalid partner data');
        }
        const status = await checkCalendarStatus(partner.id, true);
        return {
          id: partner.id,
          name: partner.name,
          email: partner.email,
          calendarConnected: status.isConnected,
          accessStatus: status.accessStatus,
        };
      });
      const mainCoupleData = await Promise.all(mainCouplePromises);
      setMainCouple(mainCoupleData);

      // Fetch key attendees
      const keyAttendeesResponse =
        await WeddingsService.weddingControllerGetKeyAttendees(selectedWeddingId);
      const keyAttendeeIds = keyAttendeesResponse.keyAttendeeIds || [];

      // Convert to KeyAttendee objects - find in guests
      const attendeesPromises = keyAttendeeIds.map(async (id: number) => {
        const guest = guestsData.find((g) => g.id === id);
        if (!guest) return null;

        const status = await checkCalendarStatus(id);
        return {
          id: guest.id,
          name: guest.name,
          email: guest.email,
          calendarConnected: status.isConnected,
          accessStatus: status.accessStatus,
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

  // Fetch saved preferences
  const fetchPreferences = useCallback(async () => {
    if (!selectedWeddingId || !session?.backendTokens?.accessToken) return;

    try {
      setupAuth();
      const prefs =
        await WeddingsService.weddingControllerGetDateOptimizerPreferences(selectedWeddingId);

      // Always load saved preferences
      setEarliestDate(prefs.earliestDate || '2025-05-01');
      setLatestDate(prefs.latestDate || '2025-12-31');
      setPreferredDays(
        prefs.preferredDays && prefs.preferredDays.length > 0
          ? prefs.preferredDays
          : ['Friday', 'Saturday', 'Sunday'],
      );

      if (prefs.lastResults !== undefined && prefs.lastResults !== null) {
        setDateRecommendations(prefs.lastResults.recommendations || []);
        setHasRunAnalysis(true);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      // Set defaults if no preferences saved
      setEarliestDate('2025-05-01');
      setLatestDate('2025-12-31');
      setPreferredDays(['Friday', 'Saturday', 'Sunday']);
    }
  }, [selectedWeddingId, session, setupAuth]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
    fetchPreferences();
  }, [fetchData, fetchPreferences]);

  // Auto-save preferences when they change (debounced)
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useEffect(() => {
    // Mark as loaded after initial fetch
    if (earliestDate && latestDate && preferredDays.length > 0 && !preferencesLoaded) {
      setPreferencesLoaded(true);
      return;
    }

    // Don't save until preferences are initially loaded
    if (!preferencesLoaded || !selectedWeddingId || !session?.backendTokens?.accessToken) return;

    // Save preferences after a delay to avoid excessive API calls
    const timeoutId = setTimeout(async () => {
      try {
        setupAuth();
        await WeddingsService.weddingControllerUpdateDateOptimizerPreferences(selectedWeddingId, {
          earliestDate,
          latestDate,
          preferredDays,
          lastResults:
            dateRecommendations.length > 0
              ? {
                  success: true,
                  message: 'Saved recommendations',
                  recommendations: dateRecommendations,
                }
              : undefined,
        });
      } catch (error) {
        console.error('Error auto-saving preferences:', error);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [
    earliestDate,
    latestDate,
    preferredDays,
    selectedWeddingId,
    session,
    setupAuth,
    dateRecommendations,
    preferencesLoaded,
  ]);

  // Fetch availability data for the selected month
  const fetchAvailability = useCallback(
    async (startDate?: string, endDate?: string) => {
      if (!selectedWeddingId || !session?.backendTokens?.accessToken) return [];
      if (keyAttendees.length === 0 && mainCouple.length === 0) return [];

      try {
        setIsLoadingAvailability(true);
        setupAuth();

        // Use provided dates or default to selected month
        let start: Date;
        let end: Date;

        if (startDate && endDate) {
          start = new Date(startDate);
          end = new Date(endDate);
        } else {
          // Get start and end dates for the month (with buffer)
          start = new Date(selectedMonth);
          start.setDate(1);
          start.setHours(0, 0, 0, 0);

          end = new Date(selectedMonth);
          end.setMonth(end.getMonth() + 1);
          end.setDate(0);
          end.setHours(23, 59, 59, 999);
        }

        // Fetch availability for all connected key attendees and main couple
        const connectedMainCoupleIds = mainCouple
          .filter((p) => p.calendarConnected)
          .map((p) => p.id);
        const connectedAttendeeIds = keyAttendees
          .filter((a) => a.calendarConnected)
          .map((a) => a.id);
        const allConnectedIds = [...connectedMainCoupleIds, ...connectedAttendeeIds];

        if (allConnectedIds.length === 0) {
          setAvailabilityData([]);
          return [];
        }

        const response = await CalendarService.calendarControllerCheckAvailability({
          attendeeIds: allConnectedIds,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        });

        setAvailabilityData(response.attendees);
        return response.attendees;
      } catch (error) {
        console.error('Error fetching availability:', error);
        toast.error('Failed to fetch calendar availability');
        return [];
      } finally {
        setIsLoadingAvailability(false);
      }
    },
    [selectedWeddingId, session, keyAttendees, mainCouple, selectedMonth, setupAuth],
  );

  // Run analysis
  const handleRunAnalysis = useCallback(async () => {
    if (!selectedWeddingId || !session?.backendTokens?.accessToken) return;

    setHasRunAnalysis(true);
    setIsLoadingAvailability(true);

    try {
      setupAuth();

      // Fetch availability for the entire date range (not just selected month)
      const freshAvailabilityData = await fetchAvailability(earliestDate, latestDate);

      // Build unavailability map from busy slots
      const unavailabilityMap: Record<number, string[]> = {};

      for (const attendee of freshAvailabilityData) {
        const unavailableDates = attendee.busySlots
          .map((slot) => {
            // Extract date part only (YYYY-MM-DD)
            return slot.start?.split('T')[0] || '';
          })
          .filter(Boolean);
        // Remove duplicates
        unavailabilityMap[attendee.attendeeId] = [...new Set(unavailableDates)];
      }

      // Separate main couple and key attendees
      const mainCoupleUnavailability = mainCouple.map((partner) => ({
        id: partner.id,
        name: partner.name,
        unavailable_dates: unavailabilityMap[partner.id] || [],
        is_main_couple: true,
      }));

      const keyAttendeesUnavailability = keyAttendees.map((attendee) => ({
        id: attendee.id,
        name: attendee.name,
        unavailable_dates: unavailabilityMap[attendee.id] || [],
        is_main_couple: false,
      }));

      // Call AI backend for date optimization
      const response = await CalendarService.calendarControllerOptimizeWeddingDate({
        start_date: earliestDate,
        end_date: latestDate,
        main_couple_unavailability: mainCoupleUnavailability,
        key_attendees_unavailability: keyAttendeesUnavailability,
        preferred_days: preferredDays,
        top_n: 5,
      });

      if (response.success && response.recommendations) {
        setDateRecommendations(response.recommendations);

        // Show success toast
        if (response.recommendations.length > 0) {
          toast.success(
            `Successfully generated ${response.recommendations.length} date recommendation${response.recommendations.length === 1 ? '' : 's'}`,
          );
        } else {
          toast.info('No viable dates found for your criteria');
        }

        // Save preferences and results
        try {
          await WeddingsService.weddingControllerUpdateDateOptimizerPreferences(selectedWeddingId, {
            earliestDate,
            latestDate,
            preferredDays,
            lastResults: response,
          });
        } catch (saveError) {
          console.error('Error saving preferences:', saveError);
        }
      } else {
        // Clear recommendations when there are no viable dates and save
        setDateRecommendations([]);
        toast.info('No viable dates found for your criteria');
        try {
          await WeddingsService.weddingControllerUpdateDateOptimizerPreferences(selectedWeddingId, {
            earliestDate,
            latestDate,
            preferredDays,
            lastResults: response,
          });
        } catch (saveError) {
          console.error('Error saving preferences:', saveError);
        }
      }
    } catch (error) {
      console.error('Error running analysis:', error);
      toast.error('Failed to run date analysis');
    } finally {
      setIsLoadingAvailability(false);
    }
  }, [
    selectedWeddingId,
    session,
    setupAuth,
    fetchAvailability,
    mainCouple,
    keyAttendees,
    earliestDate,
    latestDate,
    preferredDays,
  ]);

  // Add key attendee
  const handleAddKeyAttendee = useCallback(
    async (attendee: GuestResponseDto) => {
      if (!selectedWeddingId || !session?.backendTokens?.accessToken) return;

      try {
        setupAuth();

        // Check if calendar is already connected
        const status = await checkCalendarStatus(attendee.id, false);

        const newAttendee: KeyAttendee = {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          calendarConnected: status.isConnected,
          accessStatus: status.accessStatus,
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

        // Find the attendee to check if calendar is connected
        const attendee = keyAttendees.find((a) => a.id === id);

        // Disconnect calendar if connected
        if (attendee?.calendarConnected) {
          try {
            await CalendarService.calendarControllerDisconnectUserCalendar(id, false);
          } catch (disconnectError) {
            console.error('Error disconnecting calendar:', disconnectError);
            // Continue with removal even if disconnect fails
          }
        }

        // Remove from backend
        await WeddingsService.weddingControllerRemoveKeyAttendee(selectedWeddingId, id);

        setKeyAttendees((prev) => prev.filter((a) => a.id !== id));
        toast.success('Key attendee removed');
      } catch (error) {
        console.error('Error removing key attendee:', error);
        toast.error('Failed to remove key attendee');
      }
    },
    [selectedWeddingId, session, setupAuth, keyAttendees],
  );

  // Request calendar access
  const handleRequestCalendarAccess = useCallback(
    async (attendee: KeyAttendee | MainCouplePartner, isAdmin: boolean = false) => {
      if (!selectedWeddingId || !session?.backendTokens?.accessToken) {
        toast.error('Unable to request calendar access');
        return;
      }

      try {
        setupAuth();

        await CalendarService.calendarControllerRequestCalendarAccess({
          attendeeId: attendee.id,
          weddingId: selectedWeddingId,
          isAdmin,
        });

        // Update the local state to mark as requested
        if (isAdmin) {
          setMainCouple((prev) =>
            prev.map((partner) =>
              partner.id === attendee.id
                ? {
                    ...partner,
                    accessStatus: CalendarConnectionStatusDto.accessStatus.REQUESTED,
                  }
                : partner,
            ),
          );
        } else {
          setKeyAttendees((prev) =>
            prev.map((att) =>
              att.id === attendee.id
                ? { ...att, accessStatus: CalendarConnectionStatusDto.accessStatus.REQUESTED }
                : att,
            ),
          );
        }

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
    setDateRecommendations([]);
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
    mainCouple,
    loading,
    hasRunAnalysis,
    availabilityData,
    isLoadingAvailability,
    selectedMonth,
    preferredDays,
    dateRecommendations,
    earliestDate,
    latestDate,

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
    setEarliestDate,
    setLatestDate,

    // Modal controls
    openAddAttendeeModal,
    closeAddAttendeeModal,
  };
}
