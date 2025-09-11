import { CreateGuestDto, GuestResponseDto, GuestsService, UpdateGuestDto } from "@shared/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type GuestFormData = Partial<CreateGuestDto & { accompanyingGuestNames: string[] }>;

type GuestFormSetter = (guest: GuestFormData) => void;

const defaultNewGuest: GuestFormData = {
  name: "",
  email: "",
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
  const [guests, setGuests] = useState<GuestResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Partial<CreateGuestDto & { id?: number; accompanyingGuestNames?: string[] }> | null>(null);
  const [deleteConfirmGuest, setDeleteConfirmGuest] = useState<GuestResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailModalGuest, setEmailModalGuest] = useState<{ name: string; email: string } | null>(null);
  
  // Validation states
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    group?: string;
  }>({});
  

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
    // First delete any accompanying guests before deleting the primary guest
    const accompanyingGuests = guests.filter(g => g.primaryGuestId === id);
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
      groupCheck: !guestData.group?.trim()
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
        confirmationStatus: CreateGuestDto.confirmationStatus.PENDING,
        weddingId: newGuest.weddingId || 1,
        primaryGuestId: undefined,
      };

      const accompanyingGuestsData: CreateGuestDto[] = [];
      if (newGuest.accompanyingGuestNames) {
        const validAccompanyingNames = newGuest.accompanyingGuestNames.filter(name => name.trim());
        accompanyingGuestsData.push(...validAccompanyingNames.map(name => ({
          name: name.trim(),
          email: "",
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
      
      // Show email modal for the newly added guest
      setEmailModalGuest({
        name: primaryGuestData.name!,
        email: primaryGuestData.email!
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
          email: "",
          allergies: editingGuest.allergies,
          group: editingGuest.group,
          confirmationStatus: editingGuest.confirmationStatus || CreateGuestDto.confirmationStatus.PENDING,
          weddingId: editingGuest.weddingId || 1,
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

  const handleEditGuest = (guest: GuestResponseDto) => {
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
  const primaryGuests = guests.filter(guest => !guest.primaryGuestId);
  const existingGroups = Array.from(new Set(guests.filter(g => g.group?.trim()).map(g => g.group!))).sort();

  useEffect(() => {
    fetchGuests();
  }, []);

  return {
    // Core data
    guests,
    primaryGuests,
    existingGroups,
    isLoading,
    error,
    setError,
    
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
    openEmailModal,
    closeEmailModal,
    handleSendEmail,
  };
}