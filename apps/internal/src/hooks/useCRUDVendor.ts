import { CreateVendorDto, UpdateVendorDto, VendorResponseDto, VendorsService } from "@shared/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type VendorFormData = Partial<UpdateVendorDto>;

type VendorFormSetter = (vendor: VendorFormData) => void;

// const defaultNewGuest: GuestFormData = {
//   name: "",
//   email: "",
//   allergies: "",
//   group: "",
//   confirmationStatus: CreateGuestDto.confirmationStatus.PENDING,
//   weddingId: 1,
//   primaryGuestId: undefined,
//   accompanyingGuestNames: [""],
// };

// const confirmationStatusOptions = [
//   { value: CreateGuestDto.confirmationStatus.PENDING, label: 'Pending' },
//   { value: CreateGuestDto.confirmationStatus.CONFIRMED, label: 'Confirmed' },
//   { value: CreateGuestDto.confirmationStatus.REJECTED, label: 'Rejected' }
// ];

export function useVendorManager() {
  // Core vendor data
  const [vendors, setVendors] = useState<VendorResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [editingVendor, setEditingVendor] = useState<UpdateVendorDto | null>(null);
  const [deleteConfirmVendor, setDeleteConfirmVendor] = useState<VendorResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailModalVendor, setEmailModalVendor] = useState<{ name: string; email: string } | null>(null);
  
  // Validation states
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    // vendorWebsite?: string;
    // uenNumber?: string;
    // bio?: string;
  }>({});
  

  // Form data
  // const [newGuest, setNewGuest] = useState<GuestFormData>(defaultNewGuest);

  // Core CRUD operations
  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedVendors = await VendorsService.vendorControllerGetAllVendors();
      setVendors(fetchedVendors);
    } catch (err) {
      setError('Failed to fetch vendors. Please try again.');
      console.error('Error fetching vendors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addVendor = async (
    vendorData: CreateVendorDto,
  ) => {
    const createdVendor = await VendorsService.vendorControllerCreate(vendorData);

    await fetchVendors();
    return createdVendor;
  };

  const updateVendor = async (
    vendorId: number,
    updateData: UpdateVendorDto,
  ) => {
    await VendorsService.vendorControllerUpdate(vendorId, updateData)

    await fetchVendors();
  };

  const deleteVendor = async (id: number) => {
    await VendorsService.vendorControllerDelete(id);
    await fetchVendors();
  };

  // Validation
  const validateVendorData = (vendorData: VendorFormData) => {
    const errors: { name?: string, email?: string, 
      // vendorWebsite?: string, uenNumber?: string, bio?: string; 
    } = {};
    
    // Debug logging
    console.log('Validating vendor data:', {
      name: vendorData.name,
      email: vendorData.email,
      vendorWebsite: vendorData.vendorWebsite,
      uenNumber: vendorData.uenNumber,
      bio: vendorData.bio,
      nameCheck: !vendorData.name?.trim(),
      emailCheck: !vendorData.email?.trim(),
      vendorWebsiteCheck: !vendorData.vendorWebsite?.trim(),
      uenNumberCheck: !vendorData.uenNumber?.trim(),
      bioCheck: !vendorData.bio?.trim()
    });
    
    if (!vendorData.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!vendorData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(vendorData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // if (!vendorData.vendorWebsite?.trim()) {
    //   errors.vendorWebsite = 'Website is required';
    // }

    // if (!vendorData.uenNumber?.trim()) {
    //   errors.uenNumber = 'UEN number is required';
    // }

    // if (!vendorData.bio?.trim()) {
    //   errors.bio = 'Bio is required';
    // }
    
    console.log('Validation errors:', errors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handler functions
  // const handleAddGuest = async () => {
  //   if (!validateGuestData(newGuest)) {
  //     toast.error('Please fill in all required fields');
  //     return;
  //   }

  //   try {
  //     setIsSubmitting(true);

  //     const primaryGuestData: CreateGuestDto = {
  //       name: newGuest.name!,
  //       email: newGuest.email!,
  //       allergies: newGuest.allergies || undefined,
  //       group: newGuest.group!,
  //       confirmationStatus: CreateGuestDto.confirmationStatus.PENDING,
  //       weddingId: newGuest.weddingId || 1,
  //       primaryGuestId: undefined,
  //     };

  //     const accompanyingGuestsData: CreateGuestDto[] = [];
  //     if (newGuest.accompanyingGuestNames) {
  //       const validAccompanyingNames = newGuest.accompanyingGuestNames.filter(name => name.trim());
  //       accompanyingGuestsData.push(...validAccompanyingNames.map(name => ({
  //         name: name.trim(),
  //         email: "",
  //         allergies: newGuest.allergies || undefined,
  //         group: newGuest.group,
  //         confirmationStatus: CreateGuestDto.confirmationStatus.PENDING,
  //         weddingId: newGuest.weddingId || 1,
  //         primaryGuestId: undefined,
  //       })));
  //     }

  //     await addGuest(primaryGuestData, accompanyingGuestsData);

  //     setNewGuest(defaultNewGuest);
  //     setIsAddingGuest(false);
      
  //     // Show email modal for the newly added guest
  //     setEmailModalGuest({
  //       name: primaryGuestData.name!,
  //       email: primaryGuestData.email!
  //     });
      
  //     toast.success('Guest added successfully!');
  //   } catch (err) {
  //     toast.error('Failed to add guest. Please try again.');
  //     console.error('Error adding guest:', err);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleUpdateVendor = async () => {
    if (!editingVendor) return;
    
    if (!validateVendorData(editingVendor)) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);

      const updateData: UpdateVendorDto = {
        name: editingVendor.name,
        vendorWebsite: editingVendor.vendorWebsite,
        uenNumber: editingVendor.uenNumber,
        bio: editingVendor.bio,
        role: editingVendor.role // might be potential bug
      };

      // TODO: uncomment once DTO aligned and updated
      // if (!editingVendor.id) {
      //   toast.error('Cannot update vendor without ID');
      //   return;
      // }
      // await updateVendor(editingVendor.id, updateData);
      setEditingVendor(null);
      toast.success('Vendor updated successfully!');
    } catch (err) {
      toast.error('Failed to update vendor. Please try again.');
      console.error('Error updating vendor:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVendor = async (id: number) => {
    try {
      await deleteVendor(id);
      setDeleteConfirmVendor(null);
      toast.success('Vendor deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete vendor. Please try again.');
      console.error('Error deleting vendor:', err);
    }
  };

  const confirmDeleteVendor = () => {
    if (deleteConfirmVendor && deleteConfirmVendor.id) {
      handleDeleteVendor(deleteConfirmVendor.id);
    }
  };

  const handleEditVendor = (vendor: VendorResponseDto) => {
    if (!vendor.id) {
      toast.error('Cannot edit vendor without ID');
      return;
    }
    
    setEditingVendor(vendor);
  };

  const clearValidationErrors = () => setValidationErrors({});

  // const openAddGuestModal = () => {
  //   setIsAddingGuest(true);
  //   clearValidationErrors();
  // };
  const closeEditVendorModal = () => {
    setEditingVendor(null);
    clearValidationErrors();
  };
  const openDeleteConfirmModal = (vendor: VendorResponseDto) => setDeleteConfirmVendor(vendor);
  const closeDeleteConfirmModal = () => setDeleteConfirmVendor(null);
  const openEmailModal = (vendor: { name: string; email: string }) => setEmailModalVendor(vendor);
  const closeEmailModal = () => setEmailModalVendor(null);

  const handleSendEmail = () => {
    if (emailModalVendor) {
      // Here you would integrate with your email service
      toast.success(`Email sent to ${emailModalVendor.name}!`);
      closeEmailModal();
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return {
    // Core data
    vendors,
    isLoading,
    error,
    setError,
    
    // Modal states
    isAddingVendor,
    editingVendor,
    deleteConfirmVendor,
    isSubmitting,
    emailModalVendor,
    
    // Validation
    validationErrors,
    clearValidationErrors,
    
    
    // Form data
    // newGuest,
    // setNewGuest,
    setEditingVendor,
    
    // Constants
    // confirmationStatusOptions,
    
    // CRUD operations
    fetchVendors,
    addVendor,
    updateVendor,
    deleteVendor,
    
    // Handlers
    // handleAddVendor,
    handleUpdateVendor,
    handleDeleteVendor,
    confirmDeleteVendor,
    handleEditVendor,
    
    
    // Modal controls
    // openAddGuestModal,
    // closeAddGuestModal,
    closeEditVendorModal,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
    openEmailModal,
    closeEmailModal,
    handleSendEmail,
  };
}