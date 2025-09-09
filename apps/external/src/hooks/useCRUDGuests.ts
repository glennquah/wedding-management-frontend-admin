import { CreateGuestDto, GuestsService, UpdateGuestDto } from "@shared/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Guest = {
  id: number;
  name: string;
  allergies?: string;
  group?: string;
  confirmationStatus: CreateGuestDto.confirmationStatus;
  weddingId: number;
  primaryGuestId?: number;
};

type GuestFormData = Partial<CreateGuestDto & { accompanyingGuestNames: string[] }>;

type GuestFormSetter = (guest: GuestFormData) => void;

const defaultNewGuest: GuestFormData = {
  name: "",
  allergies: "",
  group: "",
  confirmationStatus: CreateGuestDto.confirmationStatus.PENDING,
  weddingId: 1,
  primaryGuestId: undefined,
  accompanyingGuestNames: [""],
};

const confirmationStatusOptions = [
  { value: CreateGuestDto.confirmationStatus.PENDING, label: 'Pending' },
  { value: CreateGuestDto.confirmationStatus.CONFIRMED, label: 'Confirmed' },
  { value: CreateGuestDto.confirmationStatus.REJECTED, label: 'Rejected' }
];

export function useGuestManager() {
  // Core guest data
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [editingGuest, setEditingGuest] = useState<(CreateGuestDto & { accompanyingGuestNames?: string[] }) | null>(null);
  const [deleteConfirmGuest, setDeleteConfirmGuest] = useState<CreateGuestDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [newGuest, setNewGuest] = useState<GuestFormData>(defaultNewGuest);

  // Core CRUD operations
  const fetchGuests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedGuests = await GuestsService.guestControllerGetGuestsByWedding(1);
      setGuests(fetchedGuests);
    } catch (err) {
      setError('Failed to fetch guests. Please try again.');
      console.error('Error fetching guests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addGuest = async (
    primaryGuestData: CreateGuestDto,
    accompanyingGuestsData: CreateGuestDto[]
  ) => {
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
    accompanyingGuestsData: CreateGuestDto[]
  ) => {
    await GuestsService.guestControllerUpdate(guestId, updateData);

    // Delete existing accompanying guests
    const existingAccompanyingGuests = guests.filter(g => g.primaryGuestId === guestId);
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
    await GuestsService.guestControllerDelete(id);
    // Also delete any accompanying guests
    const accompanyingGuests = guests.filter(g => g.primaryGuestId === id);
    for (const guest of accompanyingGuests) {
      await GuestsService.guestControllerDelete(guest.id);
    }
    await fetchGuests();
  };

  // Form field management
  const addAccompanyingGuestField = (
    guest: GuestFormData,
    setGuest: GuestFormSetter
  ) => {
    const currentNames = guest.accompanyingGuestNames || [];
    setGuest({
      ...guest,
      accompanyingGuestNames: [...currentNames, ""]
    });
  };

  const removeAccompanyingGuestField = (
    index: number,
    guest: GuestFormData,
    setGuest: GuestFormSetter
  ) => {
    const currentNames = guest.accompanyingGuestNames || [];
    if (currentNames.length > 1) {
      const newNames = currentNames.filter((_, i) => i !== index);
      setGuest({
        ...guest,
        accompanyingGuestNames: newNames
      });
    }
  };

  const updateAccompanyingGuestName = (
    index: number,
    value: string,
    guest: GuestFormData,
    setGuest: GuestFormSetter
  ) => {
    const currentNames = guest.accompanyingGuestNames || [];
    const newNames = [...currentNames];
    newNames[index] = value;
    setGuest({
      ...guest,
      accompanyingGuestNames: newNames
    });
  };

  // Handler functions
  const handleAddGuest = async () => {
    if (!newGuest.name || !newGuest.group) return;

    try {
      setIsSubmitting(true);

      const primaryGuestData: CreateGuestDto = {
        name: newGuest.name,
        allergies: newGuest.allergies || undefined,
        group: newGuest.group,
        confirmationStatus: CreateGuestDto.confirmationStatus.PENDING,
        weddingId: newGuest.weddingId || 1,
        primaryGuestId: undefined,
      };

      const accompanyingGuestsData: CreateGuestDto[] = [];
      if (newGuest.accompanyingGuestNames) {
        const validAccompanyingNames = newGuest.accompanyingGuestNames.filter(name => name.trim());
        accompanyingGuestsData.push(...validAccompanyingNames.map(name => ({
          name: name.trim(),
          allergies: newGuest.allergies || undefined,
          group: newGuest.group,
          confirmationStatus: CreateGuestDto.confirmationStatus.PENDING,
          weddingId: newGuest.weddingId || 1,
          primaryGuestId: undefined,
        })));
      }

      await addGuest(primaryGuestData, accompanyingGuestsData);

      setNewGuest(defaultNewGuest);
      setIsAddingGuest(false);
      toast.success('Guest added successfully!');
    } catch (err) {
      toast.error('Failed to add guest. Please try again.');
      console.error('Error adding guest:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateGuest = async () => {
    if (!editingGuest || !editingGuest.name || !editingGuest.group) return;

    try {
      setIsSubmitting(true);

      const updateData: UpdateGuestDto = {
        name: editingGuest.name,
        allergies: editingGuest.allergies || undefined,
        group: editingGuest.group,
        confirmationStatus: editingGuest.confirmationStatus,
      };

      const accompanyingGuestsData: CreateGuestDto[] = [];
      if (editingGuest.accompanyingGuestNames) {
        const validAccompanyingNames = editingGuest.accompanyingGuestNames.filter(name => name.trim());
        accompanyingGuestsData.push(...validAccompanyingNames.map(name => ({
          name: name.trim(),
          allergies: editingGuest.allergies || undefined,
          group: editingGuest.group,
          confirmationStatus: editingGuest.confirmationStatus,
          weddingId: editingGuest.weddingId,
          primaryGuestId: undefined,
        })));
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

  const handleEditGuest = (guest: CreateGuestDto) => {
    if (!guest.id) {
      toast.error('Cannot edit guest without ID');
      return;
    }
    // Get accompanying guests for this primary guest
    const accompanyingGuests = guests.filter(g => g.primaryGuestId === guest.id);
    const accompanyingNames = accompanyingGuests.length > 0 
      ? accompanyingGuests.map(g => g.name)
      : [""];
    
    setEditingGuest({
      ...guest,
      accompanyingGuestNames: accompanyingNames
    });
  };

  const openAddGuestModal = () => setIsAddingGuest(true);
  const closeAddGuestModal = () => setIsAddingGuest(false);
  const closeEditGuestModal = () => setEditingGuest(null);
  const openDeleteConfirmModal = (guest: CreateGuestDto) => setDeleteConfirmGuest(guest);
  const closeDeleteConfirmModal = () => setDeleteConfirmGuest(null);

  // Derived data
  const primaryGuests = guests.filter(guest => !guest.primaryGuestId);

  useEffect(() => {
    fetchGuests();
  }, []);

  return {
    // Core data
    guests,
    primaryGuests,
    isLoading,
    error,
    setError,
    
    // Modal states
    isAddingGuest,
    editingGuest,
    deleteConfirmGuest,
    isSubmitting,
    
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
    updateAccompanyingGuestName,
    
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
  };
}

export const useGuestForm = () => {
  const manager = useGuestManager();
  return {
    addAccompanyingGuestField: manager.addAccompanyingGuestField,
    removeAccompanyingGuestField: manager.removeAccompanyingGuestField,
    updateAccompanyingGuestName: manager.updateAccompanyingGuestName,
  };
};