import { useCallback, useEffect, useState } from 'react';

import { useWeddingStore } from '../store/sessionStore';
import {
  ConfirmationStatus,
  CreateGuestDto,
  GuestCountBucket,
  GuestResponseDto,
  GuestsService,
  OpenAPI,
  UpdateGuestDto,
  WeddingResponseDto,
  WeddingsService,
} from '@shared/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

type AccompanyingGuestData = {
  name: string;
  allergies?: string;
  confirmationStatus: ConfirmationStatus;
};

type GuestFormData = Partial<CreateGuestDto> & {
  id?: number;
  accompanyingGuests?: AccompanyingGuestData[];
};

type GuestFormSetter = (guest: GuestFormData) => void;

const getDefaultNewGuest = (weddingId: number): GuestFormData => ({
  name: '',
  email: '',
  allergies: '',
  group: '',
  confirmationStatus: ConfirmationStatus.PENDING,
  weddingId,
  primaryGuestId: undefined,
  accompanyingGuests: [],
});

// Guest count bucket capacity mappings
const GUEST_COUNT_LIMITS = {
  [GuestCountBucket.SMALL]: 50,
  [GuestCountBucket.MEDIUM]: 150,
  [GuestCountBucket.LARGE]: 500,
};

const confirmationStatusOptions = [
  { value: ConfirmationStatus.PENDING, label: 'Pending' },
  { value: ConfirmationStatus.CONFIRMED, label: 'Confirmed' },
  { value: ConfirmationStatus.REJECTED, label: 'Rejected' },
];

export function useGuestManager() {
  const { data: session, status } = useSession();
  const currentWeddingId = useWeddingStore((state) => state.selectedWeddingId);
  const setSelectedWeddingId = useWeddingStore((state) => state.setSelectedWeddingId);

  // Core guest data
  const [guests, setGuests] = useState<GuestResponseDto[]>([]);
  const [wedding, setWedding] = useState<WeddingResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestFormData | null>(null);
  const [deleteConfirmGuest, setDeleteConfirmGuest] = useState<GuestResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailModalGuest, setEmailModalGuest] = useState<{ name: string; email: string } | null>(
    null,
  );

  // Validation states
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    group?: string;
  }>({});

  // Form data
  const [newGuest, setNewGuest] = useState<GuestFormData>(
    getDefaultNewGuest(currentWeddingId || 1),
  );

  // Authentication setup
  const setupAuth = useCallback(() => {
    if (session?.backendTokens?.accessToken) {
      OpenAPI.TOKEN = session.backendTokens.accessToken;
    }
  }, [session]);

  // Fetch wedding data for the current user (use first wedding in array)
  const fetchUserWedding = useCallback(async (): Promise<WeddingResponseDto | null> => {
    try {
      setupAuth();
      const weddings = await WeddingsService.weddingControllerFindAll();
      if (weddings.length > 0) {
        const weddingData = weddings[0];
        setWedding(weddingData);
        return weddingData;
      }
      return null;
    } catch (err) {
      console.error('Error fetching user wedding:', err);
      toast.error('Failed to fetch wedding information');
      return null;
    }
  }, [setupAuth]);

  // Core CRUD operations
  const fetchGuests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Setup authentication
      setupAuth();

      // Get wedding data if not already set
      let weddingId = currentWeddingId;
      if (!weddingId || !wedding) {
        const weddingData = await fetchUserWedding();
        if (weddingData) {
          setSelectedWeddingId(weddingData.id);
          weddingId = weddingData.id;
        }
      }

      if (!weddingId) {
        throw new Error('No wedding found for this user');
      }

      const fetchedGuests = await GuestsService.guestControllerGetGuestsByWedding(weddingId!);
      setGuests(fetchedGuests);
    } catch (err) {
      setError('Failed to fetch guests. Please try again.');
      console.error('Error fetching guests:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWeddingId, wedding, fetchUserWedding, setupAuth, setSelectedWeddingId]);

  // Guest capacity validation
  const getGuestCapacityInfo = useCallback(() => {
    if (!wedding?.guestCountBucket) {
      return { limit: 0, current: guests.length, available: 0, isAtCapacity: false };
    }

    const limit = GUEST_COUNT_LIMITS[wedding.guestCountBucket];
    const current = guests.length;
    const available = Math.max(0, limit - current);
    const isAtCapacity = current >= limit;

    return { limit, current, available, isAtCapacity };
  }, [wedding, guests]);

  const validateGuestCapacity = useCallback(
    (additionalGuestCount: number = 1) => {
      const capacityInfo = getGuestCapacityInfo();

      if (capacityInfo.isAtCapacity) {
        toast.error(
          `Guest count exceeded! Your ${wedding?.guestCountBucket.toLowerCase()} plan allows up to ${capacityInfo.limit} guests.`,
        );
        return false;
      }

      if (capacityInfo.available < additionalGuestCount) {
        toast.error(
          `Cannot add ${additionalGuestCount} guest(s). Only ${capacityInfo.available} slot(s) remaining in your ${wedding?.guestCountBucket.toLowerCase()} plan.`,
        );
        return false;
      }

      return true;
    },
    [getGuestCapacityInfo, wedding],
  );

  const addGuest = async (
    primaryGuestData: CreateGuestDto,
    accompanyingGuestsData: CreateGuestDto[],
  ) => {
    // Validate capacity before adding guests
    const totalNewGuests = 1 + accompanyingGuestsData.length;
    if (!validateGuestCapacity(totalNewGuests)) {
      return;
    }

    setupAuth();
    const createdPrimaryGuest = await GuestsService.guestControllerCreate(primaryGuestData);

    if (accompanyingGuestsData.length > 0) {
      for (const guestData of accompanyingGuestsData) {
        await GuestsService.guestControllerCreate({
          ...guestData,
          primaryGuestId: createdPrimaryGuest.id,
        });
      }
    }

    await fetchGuests();
    return createdPrimaryGuest;
  };

  const updateGuest = async (
    guestId: number,
    updateData: UpdateGuestDto,
    accompanyingGuestsData: CreateGuestDto[],
  ) => {
    setupAuth();
    await GuestsService.guestControllerUpdate(guestId, updateData);

    // Delete existing accompanying guests
    const existingAccompanyingGuests = guests.filter((g) => g.primaryGuestId === guestId);
    for (const guest of existingAccompanyingGuests) {
      await GuestsService.guestControllerDelete(guest.id);
    }

    // Create new accompanying guests
    if (accompanyingGuestsData.length > 0) {
      for (const guestData of accompanyingGuestsData) {
        await GuestsService.guestControllerCreate({
          ...guestData,
          primaryGuestId: guestId,
        });
      }
    }

    await fetchGuests();
  };

  const deleteGuest = async (id: number) => {
    setupAuth();
    // First delete any accompanying guests before deleting the primary guest
    const accompanyingGuests = guests.filter((g) => g.primaryGuestId === id);
    for (const guest of accompanyingGuests) {
      await GuestsService.guestControllerDelete(guest.id);
    }
    // Then delete the primary guest
    await GuestsService.guestControllerDelete(id);
    await fetchGuests();
  };

  // Validation
  const validateGuestData = (guestData: GuestFormData) => {
    const errors: { name?: string; email?: string; group?: string } = {};

    // Debug logging
    console.log('Validating guest data:', {
      name: guestData.name,
      email: guestData.email,
      group: guestData.group,
      nameCheck: !guestData.name?.trim(),
      emailCheck: !guestData.email?.trim(),
      groupCheck: !guestData.group?.trim(),
    });

    if (!guestData.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!guestData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(guestData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!guestData.group?.trim()) {
      errors.group = 'Group is required';
    }

    console.log('Validation errors:', errors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form field management
  const addAccompanyingGuestField = (guest: GuestFormData, setGuest: GuestFormSetter) => {
    const currentGuests = guest.accompanyingGuests || [];
    const desiredAccompanyingCount = currentGuests.length + 1;
    const capacityInfo = getGuestCapacityInfo();

    let seatsNeeded: number;

    if (guest.id) {
      const existingAccompanyingCount = guests.filter((g) => g.primaryGuestId === guest.id).length;
      const additionalAccompanying = Math.max(0, desiredAccompanyingCount - existingAccompanyingCount);
      seatsNeeded = additionalAccompanying;
    } else {
      seatsNeeded = 1 + desiredAccompanyingCount;
    }

    if (seatsNeeded > capacityInfo.available) {
      const seatLabel = capacityInfo.available === 1 ? 'seat' : 'seats';
      toast.error(
        capacityInfo.available > 0
          ? `Not enough seats available. You only have ${capacityInfo.available} ${seatLabel} remaining in your plan.`
          : 'Guest limit reached—no seats remaining in your plan.',
      );
      return;
    }

    setGuest({
      ...guest,
      accompanyingGuests: [
        ...currentGuests,
        { name: '', allergies: '', confirmationStatus: ConfirmationStatus.PENDING },
      ],
    });
  };

  const removeAccompanyingGuestField = (
    index: number,
    guest: GuestFormData,
    setGuest: GuestFormSetter,
  ) => {
    const currentGuests = guest.accompanyingGuests || [];
    if (currentGuests.length > 1) {
      const newGuests = currentGuests.filter((_, i) => i !== index);
      setGuest({
        ...guest,
        accompanyingGuests: newGuests,
      });
    }
  };

  const updateAccompanyingGuest = (
    index: number,
    field: keyof AccompanyingGuestData,
    value: string | ConfirmationStatus,
    guest: GuestFormData,
    setGuest: GuestFormSetter,
  ) => {
    const currentGuests = guest.accompanyingGuests || [];
    const newGuests = [...currentGuests];
    newGuests[index] = { ...newGuests[index], [field]: value };
    setGuest({
      ...guest,
      accompanyingGuests: newGuests,
    });
  };

  // Handler functions
  const handleAddGuest = async () => {
    if (!validateGuestData(newGuest)) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);

      const primaryGuestData: CreateGuestDto = {
        name: newGuest.name!,
        email: newGuest.email!,
        allergies: newGuest.allergies || undefined,
        group: newGuest.group!,
        confirmationStatus: ConfirmationStatus.PENDING,
        weddingId: currentWeddingId || 1,
        primaryGuestId: undefined,
      };

      const accompanyingGuestsData: CreateGuestDto[] = [];
      if (newGuest.accompanyingGuests) {
        const validAccompanyingGuests = newGuest.accompanyingGuests.filter((guest) =>
          guest.name.trim(),
        );
        accompanyingGuestsData.push(
          ...validAccompanyingGuests.map((guestData) => ({
            name: guestData.name.trim(),
            email: '',
            allergies: guestData.allergies || undefined,
            group: newGuest.group,
            confirmationStatus: guestData.confirmationStatus,
            weddingId: currentWeddingId || 1,
            primaryGuestId: undefined,
          })),
        );
      }

      const createdPrimaryGuest = await addGuest(primaryGuestData, accompanyingGuestsData);

      if (!createdPrimaryGuest) {
        return;
      }

      setNewGuest(getDefaultNewGuest(currentWeddingId || 1));
      setIsAddingGuest(false);

      // Show email modal for the newly added guest
      setEmailModalGuest({
        name: primaryGuestData.name!,
        email: primaryGuestData.email!,
      });

      toast.success('Guest added successfully!');
    } catch (err) {
      toast.error('Failed to add guest. Please try again.');
      console.error('Error adding guest:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateGuest = async () => {
    if (!editingGuest) return;

    if (!validateGuestData(editingGuest)) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);

      // const mapConfirmationStatus = (status: ConfirmationStatus | undefined): UpdateGuestDto.confirmationStatus | undefined => {
      //   if (!status) return undefined;
      //   switch (status) {
      //     case ConfirmationStatus.PENDING:
      //       return UpdateGuestDto.confirmationStatus.PENDING;
      //     case ConfirmationStatus.CONFIRMED:
      //       return UpdateGuestDto.confirmationStatus.CONFIRMED;
      //     case ConfirmationStatus.REJECTED:
      //       return UpdateGuestDto.confirmationStatus.REJECTED;
      //     default:
      //       return undefined;
      //   }
      // };

      const updateData: UpdateGuestDto = {
        name: editingGuest.name,
        allergies: editingGuest.allergies || undefined,
        group: editingGuest.group,
        confirmationStatus: editingGuest.confirmationStatus || undefined,
      };

      const accompanyingGuestsData: CreateGuestDto[] = [];
      if (editingGuest.accompanyingGuests) {
        const validAccompanyingGuests = editingGuest.accompanyingGuests.filter((guest) =>
          guest.name.trim(),
        );
        accompanyingGuestsData.push(
          ...validAccompanyingGuests.map((guestData) => ({
            name: guestData.name.trim(),
            email: '',
            allergies: guestData.allergies || undefined,
            group: editingGuest.group,
            confirmationStatus: guestData.confirmationStatus,
            weddingId: currentWeddingId || 1,
            primaryGuestId: undefined,
          })),
        );
      }

      if (!editingGuest.id) {
        toast.error('Cannot update guest without ID');
        return;
      }
      await updateGuest(editingGuest.id, updateData, accompanyingGuestsData);
      setEditingGuest(null);
      toast.success('Guest updated successfully!');
    } catch (err) {
      toast.error('Failed to update guest. Please try again.');
      console.error('Error updating guest:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGuest = async (id: number) => {
    try {
      await deleteGuest(id);
      setDeleteConfirmGuest(null);
      toast.success('Guest deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete guest. Please try again.');
      console.error('Error deleting guest:', err);
    }
  };

  const confirmDeleteGuest = () => {
    if (deleteConfirmGuest && deleteConfirmGuest.id) {
      handleDeleteGuest(deleteConfirmGuest.id);
    }
  };

  const handleEditGuest = (guest: GuestResponseDto) => {
    if (!guest.id) {
      toast.error('Cannot edit guest without ID');
      return;
    }
    // Get accompanying guests for this primary guest
    const accompanyingGuests = guests.filter((g) => g.primaryGuestId === guest.id);
    const accompanyingGuestData: AccompanyingGuestData[] = accompanyingGuests.map((g) => ({
      name: g.name,
      allergies: g.allergies || '',
      confirmationStatus: g.confirmationStatus,
    }));

    // Map the confirmation status from GuestResponseDto to ConfirmationStatus
    const mapResponseConfirmationStatus = (status: ConfirmationStatus): ConfirmationStatus => {
      switch (status) {
        case ConfirmationStatus.PENDING:
          return ConfirmationStatus.PENDING;
        case ConfirmationStatus.CONFIRMED:
          return ConfirmationStatus.CONFIRMED;
        case ConfirmationStatus.REJECTED:
          return ConfirmationStatus.REJECTED;
        default:
          return ConfirmationStatus.PENDING;
      }
    };

    setEditingGuest({
      ...guest,
      confirmationStatus: mapResponseConfirmationStatus(guest.confirmationStatus),
      accompanyingGuests: accompanyingGuestData,
    });
  };

  const clearValidationErrors = () => setValidationErrors({});

  const openAddGuestModal = () => {
    setIsAddingGuest(true);
    clearValidationErrors();
  };
  const closeAddGuestModal = () => {
    setIsAddingGuest(false);
    clearValidationErrors();
  };
  const closeEditGuestModal = () => {
    setEditingGuest(null);
    clearValidationErrors();
  };
  const openDeleteConfirmModal = (guest: GuestResponseDto) => setDeleteConfirmGuest(guest);
  const closeDeleteConfirmModal = () => setDeleteConfirmGuest(null);
  const openEmailModal = (guest: { name: string; email: string }) => setEmailModalGuest(guest);
  const closeEmailModal = () => setEmailModalGuest(null);

  const handleSendEmail = () => {
    if (emailModalGuest) {
      // Here you would integrate with your email service
      toast.success(`Email sent to ${emailModalGuest.name}!`);
      closeEmailModal();
    }
  };

  // Derived data
  const primaryGuests = guests.filter((guest) => !guest.primaryGuestId);
  const existingGroups = Array.from(
    new Set(guests.filter((g) => g.group?.trim()).map((g) => g.group!)),
  ).sort();

  // Initialize wedding data when session is available
  useEffect(() => {
    if (status === 'authenticated' && session && !currentWeddingId) {
      const initWedding = async () => {
        const weddingData = await fetchUserWedding();
        if (weddingData) {
          setSelectedWeddingId(weddingData.id);
          setNewGuest(getDefaultNewGuest(weddingData.id));
        }
      };
      initWedding();
    }
  }, [status, session, currentWeddingId, fetchUserWedding, setSelectedWeddingId]);

  useEffect(() => {
    if (currentWeddingId) {
      setNewGuest(getDefaultNewGuest(currentWeddingId));
      fetchGuests();
    }
  }, [currentWeddingId, fetchGuests]);

  return {
    // Core data
    guests,
    wedding,
    primaryGuests,
    existingGroups,
    isLoading,
    error,
    setError,

    // Capacity management
    getGuestCapacityInfo,
    validateGuestCapacity,

    // Modal states
    isAddingGuest,
    editingGuest,
    deleteConfirmGuest,
    isSubmitting,
    emailModalGuest,

    // Validation
    validationErrors,
    clearValidationErrors,

    // Form data
    newGuest,
    setNewGuest,
    setEditingGuest,

    // Constants
    confirmationStatusOptions,

    // CRUD operations
    fetchGuests,
    addGuest,
    updateGuest,
    deleteGuest,

    // Form field management
    addAccompanyingGuestField,
    removeAccompanyingGuestField,
    updateAccompanyingGuest,

    // Handlers
    handleAddGuest,
    handleUpdateGuest,
    handleDeleteGuest,
    confirmDeleteGuest,
    handleEditGuest,

    // Modal controls
    openAddGuestModal,
    closeAddGuestModal,
    closeEditGuestModal,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
    openEmailModal,
    closeEmailModal,
    handleSendEmail,
  };
}
