import { useEffect, useState } from 'react';

import {
  CreateVendorDto,
  UpdateVendorDto,
  UserRole,
  VendorResponseDto,
  VendorsService,
  WeddingService,
} from '@shared/api';
import { toast } from 'sonner';

type VendorFormData = Partial<UpdateVendorDto>;

export function useVendorManager() {
  // Core vendor data
  const [vendors, setVendors] = useState<VendorResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [editingVendor, setEditingVendor] = useState<Partial<
    UpdateVendorDto & { id?: number }
  > | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<VendorResponseDto | null>(null);
  const [deleteConfirmVendor, setDeleteConfirmVendor] = useState<VendorResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailModalVendor, setEmailModalVendor] = useState<{ name: string; email: string } | null>(
    null,
  );

  // Validation states
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    capacity?: string;
  }>({});

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

  const addVendor = async (vendorData: CreateVendorDto) => {
    const createdVendor = await VendorsService.vendorControllerCreate(vendorData);

    await fetchVendors();
    return createdVendor;
  };

  const updateVendor = async (vendorId: number, updateData: UpdateVendorDto) => {
    const updatedVendor = await VendorsService.vendorControllerUpdate(vendorId, updateData);

    await fetchVendors();
    return updatedVendor;
  };

  const deleteVendor = async (id: number) => {
    await VendorsService.vendorControllerDelete(id);
    await fetchVendors();
  };

  const rejectOnboarding = async (id: number) => {
    await VendorsService.vendorControllerRejectVendor(id);
    await fetchVendors();
  };

  const approveOnboarding = async (id: number) => {
    await VendorsService.vendorControllerOnboardVendor(id);
    await fetchVendors();
  };

  const suspendVendor = async (id: number) => {
    await VendorsService.vendorControllerSuspendVendor(id);
    await fetchVendors();
  };

  const unsuspendVendor = async (id: number) => {
    await VendorsService.vendorControllerUnsuspendVendor(id);
    await fetchVendors();
  };

  // Validation
  const validateVendorData = (vendorData: VendorFormData) => {
    const errors: { name?: string; email?: string; capacity?: string } = {};

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
      bioCheck: !vendorData.bio?.trim(),
    });

    if (!vendorData.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!vendorData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(vendorData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (vendorData.capacity == 0) {
      errors.capacity = 'Venue capacity cannot be 0';
    }

    console.log('Validation errors:', errors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handler functions
  const handleUpdateVendor = async () => {
    if (!editingVendor) return;

    if (!validateVendorData(editingVendor)) {
      const errorMessages = Object.values(validationErrors).filter(Boolean).join(',\n');
      toast.error(errorMessages);
      return;
    }

    try {
      setIsSubmitting(true);

      const updateData: UpdateVendorDto = {
        name: editingVendor.name,
        vendorWebsite: editingVendor.vendorWebsite,
        uenNumber: editingVendor.uenNumber,
        bio: editingVendor.bio,
        role: UserRole.VENDOR,
        serviceOffered: editingVendor.serviceOffered,
        styleOffered: editingVendor.styleOffered,
        weddingTypes: editingVendor.weddingTypes,
        capacity: editingVendor.serviceOffered == WeddingService.VENUE ? editingVendor.capacity : 0,
      };

      if (!editingVendor.id) {
        toast.error('Cannot update vendor without ID');
        return;
      }
      const updatedVendor = await updateVendor(editingVendor.id, updateData);
      setSelectedVendor(updatedVendor);
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
      setSelectedVendor(null);
      toast.success('Vendor deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete vendor. Please try again.');
      console.error('Error deleting vendor:', err);
    }
  };

  const handleRejectOnboarding = async (vendor: VendorResponseDto) => {
    try {
      await rejectOnboarding(vendor.id);

      setEmailModalVendor({
        name: vendor.name!,
        email: vendor.email!,
      });

      setSelectedVendor(null);

      toast.success('Vendor onboarding rejected');
    } catch (err) {
      toast.error('Failed to reject vendor onboarding. Please try again.');
      console.error('Error rejecting vendor onboarding:', err);
    }
  };

  const handleApproveOnboarding = async (vendor: VendorResponseDto) => {
    try {
      await approveOnboarding(vendor.id);

      setEmailModalVendor({
        name: vendor.name!,
        email: vendor.email!,
      });

      setSelectedVendor(null);

      toast.success('Vendor onboarding approved');
    } catch (err) {
      toast.error('Failed to approve vendor onboarding. Please try again.');
      console.error('Error approving vendor onboarding:', err);
    }
  };

  const handleSuspendVendor = async (vendor: VendorResponseDto) => {
    try {
      await suspendVendor(vendor.id);

      setEmailModalVendor({
        name: vendor.name!,
        email: vendor.email!,
      });

      setSelectedVendor(null);

      toast.success('Vendor suspended');
    } catch (err) {
      toast.error('Failed to suspend vendor. Please try again.');
      console.error('Error suspending vendor:', err);
    }
  };

  const handleUnsuspendVendor = async (vendor: VendorResponseDto) => {
    try {
      await unsuspendVendor(vendor.id);

      setEmailModalVendor({
        name: vendor.name!,
        email: vendor.email!,
      });

      setSelectedVendor(null);

      toast.success('Vendor unsuspended');
    } catch (err) {
      toast.error('Failed to unsuspend vendor. Please try again.');
      console.error('Error unsuspending vendor:', err);
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

  const handleSendEmail = () => {
    if (emailModalVendor) {
      // Here you would integrate with your email service
      toast.success(`Email sent to ${emailModalVendor.name}!`);
      closeEmailModal();
    }
  };
  const clearValidationErrors = () => setValidationErrors({});

  const closeEditVendorModal = () => {
    setEditingVendor(null);
    clearValidationErrors();
  };

  const openDeleteConfirmModal = (vendor: VendorResponseDto) => setDeleteConfirmVendor(vendor);
  const closeDeleteConfirmModal = () => setDeleteConfirmVendor(null);
  const openEmailModal = (vendor: { name: string; email: string }) => setEmailModalVendor(vendor);
  const closeEmailModal = () => setEmailModalVendor(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  return {
    // Core data
    vendors,
    selectedVendor,
    isLoading,
    error,
    setError,

    // Modal states
    editingVendor,
    deleteConfirmVendor,
    isSubmitting,
    emailModalVendor,

    // Validation
    validationErrors,
    clearValidationErrors,

    // Form data
    setSelectedVendor,
    setEditingVendor,

    // CRUD operations
    fetchVendors,
    addVendor,
    updateVendor,
    deleteVendor,
    suspendVendor,
    unsuspendVendor,

    // Handlers
    handleUpdateVendor,
    handleDeleteVendor,
    confirmDeleteVendor,
    handleEditVendor,
    handleRejectOnboarding,
    handleApproveOnboarding,
    handleSuspendVendor,
    handleUnsuspendVendor,

    // Modal controls
    closeEditVendorModal,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
    openEmailModal,
    closeEmailModal,
    handleSendEmail,
  };
}
