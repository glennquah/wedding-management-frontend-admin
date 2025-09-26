import { useCallback, useEffect, useState } from 'react';

import {
  ConfirmationStatus,
  CreateGuestDto,
  GuestResponseDto,
  GuestsService,
  UpdateGuestDto,
} from '@wedding/api-types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type GuestFormData = Partial<CreateGuestDto> & {
  id?: number;
  accompanyingGuestNames?: string[];
};

export function useGuestManager() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Core data
  const [guests, setGuests] = useState<GuestResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [editingGuest, setEditingGuest] = useState<GuestResponseDto | null>(null);
  const [deleteConfirmGuest, setDeleteConfirmGuest] = useState<GuestResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailModalGuest, setEmailModalGuest] = useState<GuestResponseDto | null>(null);

  // Derived data
  const existingGroups = Array.from(
    new Set(guests.filter((g) => g.group?.trim()).map((g) => g.group!)),
  ).sort();

  // Fetch guests data
  const fetchGuests = useCallback(async () => {
    try {
      setIsLoading(true);
      const guestsData = await GuestsService.guestControllerGetAllGuests();
      setGuests(guestsData);
    } catch (error) {
      console.error('Failed to fetch guests:', error);
      toast.error('Failed to load guests');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get primary guests (guests who are not accompanying someone else)
  const primaryGuests = guests.filter((guest) => !guest.primaryGuestId);

  // Update guest
  const updateGuest = async (guestId: number, updateData: UpdateGuestDto) => {
    await GuestsService.guestControllerUpdate(guestId, updateData);
    await fetchGuests();
  };

  // Delete guest and all accompanying guests
  const deleteGuest = async (id: number) => {
    // Find all accompanying guests for this primary guest
    const accompanyingGuests = guests.filter((guest) => guest.primaryGuestId === id);

    // Delete all accompanying guests first
    for (const accompanyingGuest of accompanyingGuests) {
      await GuestsService.guestControllerDelete(accompanyingGuest.id);
    }

    // Then delete the primary guest
    await GuestsService.guestControllerDelete(id);

    await fetchGuests();
  };

  // Handlers
  const handleUpdateGuest = async () => {
    if (!editingGuest?.id) return;

    setIsSubmitting(true);
    try {
      if (!editingGuest.name || !editingGuest.email || !editingGuest.group) {
        toast.error('Please fill in all required fields');
        return;
      }

      const updateData: UpdateGuestDto = {
        name: editingGuest.name,
        email: editingGuest.email,
        group: editingGuest.group,
        allergies: editingGuest.allergies || '',
        confirmationStatus:
          editingGuest.confirmationStatus === ConfirmationStatus.PENDING
            ? ConfirmationStatus.PENDING
            : editingGuest.confirmationStatus === ConfirmationStatus.CONFIRMED
              ? ConfirmationStatus.CONFIRMED
              : ConfirmationStatus.REJECTED,
      };

      await updateGuest(editingGuest.id, updateData);
      toast.success('Guest updated successfully!');
      closeEditGuestModal();
    } catch (error) {
      console.error('Failed to update guest:', error);
      toast.error('Failed to update guest');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteGuest = async () => {
    if (!deleteConfirmGuest?.id) return;

    setIsSubmitting(true);
    try {
      await deleteGuest(deleteConfirmGuest.id);
      toast.success('Guest deleted successfully!');
      closeDeleteConfirmModal();
    } catch (error) {
      console.error('Failed to delete guest:', error);
      toast.error('Failed to delete guest');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditGuest = (guest: GuestResponseDto) => {
    setEditingGuest(guest);
  };

  const handleSendEmail = () => {
    toast.info('Email functionality coming soon!');
    closeEmailModal();
  };

  // Modal controls
  const closeEditGuestModal = () => {
    setEditingGuest(null);
  };

  const openDeleteConfirmModal = (guest: GuestResponseDto) => {
    setDeleteConfirmGuest(guest);
  };

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmGuest(null);
  };

  const closeEmailModal = () => {
    setEmailModalGuest(null);
  };

  // Form field management functions
  const addAccompanyingGuestField = (
    guest: Partial<CreateGuestDto & { id?: number }>,
    setGuest: React.Dispatch<React.SetStateAction<Partial<CreateGuestDto & { id?: number }>>>,
  ) => {
    const currentNames = guest.accompanyingGuestNames || [''];
    setGuest({ ...guest, accompanyingGuestNames: [...currentNames, ''] });
  };

  const removeAccompanyingGuestField = (
    index: number,
    guest: Partial<CreateGuestDto & { id?: number }>,
    setGuest: React.Dispatch<React.SetStateAction<Partial<CreateGuestDto & { id?: number }>>>,
  ) => {
    const currentNames = guest.accompanyingGuestNames || [];
    const updatedNames = currentNames.filter((_, i) => i !== index);
    setGuest({ ...guest, accompanyingGuestNames: updatedNames });
  };

  const updateAccompanyingGuestName = (
    index: number,
    value: string,
    guest: Partial<CreateGuestDto & { id?: number }>,
    setGuest: React.Dispatch<React.SetStateAction<Partial<CreateGuestDto & { id?: number }>>>,
  ) => {
    const currentNames = guest.accompanyingGuestNames || [];
    const updatedNames = [...currentNames];
    updatedNames[index] = value;
    setGuest({ ...guest, accompanyingGuestNames: updatedNames });
  };

  // Initialize data - only fetch if user is authenticated and authorized
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'SUPERADMIN') {
      fetchGuests();
    }
  }, [fetchGuests, session?.user?.role, status]);

  return {
    // Core data
    guests,
    primaryGuests,
    existingGroups,
    isLoading,

    // Modal states
    editingGuest,
    deleteConfirmGuest,
    isSubmitting,
    emailModalGuest,

    // Form data
    setEditingGuest,

    // CRUD operations
    fetchGuests,
    updateGuest,
    deleteGuest,

    // Form field management
    addAccompanyingGuestField,
    removeAccompanyingGuestField,
    updateAccompanyingGuestName,

    // Handlers
    handleUpdateGuest,
    confirmDeleteGuest,
    handleEditGuest,
    handleSendEmail,

    // Modal controls
    closeEditGuestModal,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
    closeEmailModal,
  };
}
