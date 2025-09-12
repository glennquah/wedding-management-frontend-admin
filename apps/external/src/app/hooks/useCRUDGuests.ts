import { ConfirmationStatus, CreateGuestDto, GuestResponseDto, GuestsService, OpenAPI, UpdateGuestDto, WeddingsService } from '@shared/api';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type GuestFormData = Partial<CreateGuestDto & { accompanyingGuestNames: string[] }>;

type GuestFormSetter = (guest: GuestFormData) => void;

const getDefaultNewGuest = (weddingId: number): GuestFormData => ({
  name: '',
  email: '',
  allergies: '',
  group: '',
  confirmationStatus: ConfirmationStatus.PENDING,
  weddingId,
  primaryGuestId: undefined,
  accompanyingGuestNames: [''],
});

const confirmationStatusOptions = [
  { value: ConfirmationStatus.PENDING, label: 'Pending' },
  { value: ConfirmationStatus.CONFIRMED, label: 'Confirmed' },
  { value: ConfirmationStatus.REJECTED, label: 'Rejected' }
];

export function useGuestManager() {
  const { data: session, status } = useSession();
  
  // Core guest data
  const [guests, setGuests] = useState<GuestResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeddingId, setCurrentWeddingId] = useState<number | null>(null);

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
  const [newGuest, setNewGuest] = useState<GuestFormData>(getDefaultNewGuest(1));

  // Authentication setup
  const setupAuth = useCallback(() => {
    if (session?.backendTokens?.accessToken) {
      OpenAPI.TOKEN = session.backendTokens.accessToken;
    }
  }, [session]);

  // Fetch wedding ID for the current user (use first wedding in array)
  const fetchUserWeddingId = useCallback(async (): Promise<number | null> => {
    try {
      setupAuth();
      const weddings = await WeddingsService.weddingControllerFindAll();
      if (weddings.length > 0) {
        return weddings[0].id;
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
      
      // Get wedding ID if not already set
      let weddingId = currentWeddingId;
      if (!weddingId) {
        weddingId = await fetchUserWeddingId();
        setCurrentWeddingId(weddingId);
      }
      
      if (!weddingId) {
        throw new Error('No wedding found for this user');
      }
      
      const fetchedGuests = await GuestsService.guestControllerGetGuestsByWedding(weddingId);
      setGuests(fetchedGuests);
    } catch (err) {
      setError('Failed to fetch guests. Please try again.');
      console.error('Error fetching guests:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWeddingId, fetchUserWeddingId, setupAuth]);

  const addGuest = async (
    primaryGuestData: CreateGuestDto,
    accompanyingGuestsData: CreateGuestDto[]
  ) => {
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
    accompanyingGuestsData: CreateGuestDto[]
  ) => {
    setupAuth();
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
    setupAuth();
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
      accompanyingGuestNames: [...currentNames, '']
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
        confirmationStatus: ConfirmationStatus.PENDING,
        weddingId: currentWeddingId || 1,
        primaryGuestId: undefined,
      };

      const accompanyingGuestsData: CreateGuestDto[] = [];
      if (newGuest.accompanyingGuestNames) {
        const validAccompanyingNames = newGuest.accompanyingGuestNames.filter(name => name.trim());
        accompanyingGuestsData.push(...validAccompanyingNames.map(name => ({
          name: name.trim(),
          email: '',
          allergies: newGuest.allergies || undefined,
          group: newGuest.group,
          confirmationStatus: ConfirmationStatus.PENDING,
          weddingId: currentWeddingId || 1,
          primaryGuestId: undefined,
        })));
      }

      await addGuest(primaryGuestData, accompanyingGuestsData);

      setNewGuest(getDefaultNewGuest(currentWeddingId || 1));
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
      if (editingGuest.accompanyingGuestNames) {
        const validAccompanyingNames = editingGuest.accompanyingGuestNames.filter(name => name.trim());
        accompanyingGuestsData.push(...validAccompanyingNames.map(name => ({
          name: name.trim(),
          email: '',
          allergies: editingGuest.allergies,
          group: editingGuest.group,
          confirmationStatus: editingGuest.confirmationStatus || ConfirmationStatus.PENDING,
          weddingId: currentWeddingId || 1,
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
      : [''];
    
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

  // Initialize wedding ID when session is available
  useEffect(() => {
    if (status === 'authenticated' && session && !currentWeddingId) {
      const initWeddingId = async () => {
        const weddingId = await fetchUserWeddingId();
        if (weddingId) {
          setCurrentWeddingId(weddingId);
          setNewGuest(getDefaultNewGuest(weddingId));
        }
      };
      initWeddingId();
    }
  }, [status, session, currentWeddingId, fetchUserWeddingId]);

  useEffect(() => {
    if (currentWeddingId) {
      fetchGuests();
    }
  }, [currentWeddingId, fetchGuests]);

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