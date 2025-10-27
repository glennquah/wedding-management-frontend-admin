'use client';

import { useCallback, useState } from 'react';

import { toast } from 'sonner';
import {
  AdminResponseDto,
  AdminsService,
  SuperAdminResponseDto,
  SuperAdminsService,
  UpdateAdminDto,
  UpdateSuperAdminDto,
  UpdateVendorDto,
  UserRole,
  VendorResponseDto,
  VendorsService,
  WeddingService,
  WeddingStyle,
  WeddingType,
} from '../api';

type UserData = AdminResponseDto | SuperAdminResponseDto | VendorResponseDto;

interface FormData {
  // Base User fields
  name: string;
  email: string;
  password: string;
  confirmPassword: string;

  // Admin-specific fields
  isSuspended: boolean;
  mainWeddingId: number | null;

  // Vendor-specific fields
  vendorWebsite: string;
  uenNumber: string;
  bio: string;
  serviceOffered: WeddingService;
  styleOffered: WeddingStyle;
  weddingTypes: WeddingType[];
  capacity: number | null;
}

interface UseEditProfileProps {
  userId?: number;
  userRole?: UserRole;
  onProfileUpdate?: () => void;
}

export const useEditProfile = ({ userId, userRole, onProfileUpdate }: UseEditProfileProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingProfile, setIsDeletingProfile] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [formData, setFormData] = useState<FormData>({
    // Base User fields
    name: '',
    email: '',
    password: '',
    confirmPassword: '',

    // Admin-specific fields
    isSuspended: false,
    mainWeddingId: null,

    // Vendor-specific fields
    vendorWebsite: '',
    uenNumber: '',
    bio: '',
    serviceOffered: WeddingService.VENUE,
    styleOffered: WeddingStyle.MODERN,
    weddingTypes: [],
    capacity: null,
  });

  const fetchUserData = useCallback(async () => {
    if (!userId || !userRole) return;

    try {
      setIsLoading(true);
      let data: UserData;

      if (userRole === UserRole.ADMIN) {
        data = await AdminsService.adminControllerGetAdmin(userId);
      } else if (userRole === UserRole.SUPERADMIN) {
        data = await SuperAdminsService.superAdminControllerGetAdmin(userId);
      } else if (userRole === UserRole.VENDOR) {
        data = await VendorsService.vendorControllerGetVendor(userId);
      } else {
        throw new Error('Unsupported user role for profile editing');
      }

      setUserData(data);
      populateFormData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  }, [userId, userRole]);

  const populateFormData = useCallback((data: UserData) => {
    setFormData({
      name: data.name || '',
      email: data.email || '',
      password: '',
      confirmPassword: '',

      // Admin-specific
      isSuspended: (data as AdminResponseDto).isSuspended || false,
      mainWeddingId: null,

      // Vendor-specific
      vendorWebsite: (data as VendorResponseDto).vendorWebsite || '',
      uenNumber: (data as VendorResponseDto).uenNumber || '',
      bio: (data as VendorResponseDto).bio || '',
      serviceOffered: (data as VendorResponseDto).serviceOffered || WeddingService.VENUE,
      styleOffered: (data as VendorResponseDto).styleOffered || WeddingStyle.MODERN,
      weddingTypes: (data as VendorResponseDto).weddingTypes || [],
      capacity: (data as VendorResponseDto).capacity || null,
    });
  }, []);

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => {
        const newData = {
          ...prev,
          [field]: value,
        };

        // If service changes from venue to another service, clear capacity
        if (
          field === 'serviceOffered' &&
          prev.serviceOffered === WeddingService.VENUE &&
          value !== WeddingService.VENUE
        ) {
          newData.capacity = null;
        }

        return newData;
      });

      // Clear validation errors for the field being changed
      if (validationErrors[field]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [validationErrors],
  );

  const validateForm = useCallback((weddingFormData?: any) => {
    const errors: { [key: string]: string } = {};

    // Validate required user fields
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    }

    // Validate wedding fields if wedding data is provided (for admin users)
    if (userRole === UserRole.ADMIN && weddingFormData) {
      if (!weddingFormData.name?.trim()) {
        errors.weddingName = 'Wedding name is required';
      }

      if (!weddingFormData.preferredServices || weddingFormData.preferredServices.length === 0) {
        errors.preferredServices = 'At least one preferred service must be selected';
      }

      if (!weddingFormData.weddingType) {
        errors.weddingType = 'Wedding type is required';
      }

      if (!weddingFormData.budgetBucket) {
        errors.budgetBucket = 'Budget range is required';
      }

      if (!weddingFormData.guestCountBucket) {
        errors.guestCountBucket = 'Guest count is required';
      }

      if (!weddingFormData.preferredStyle) {
        errors.preferredStyle = 'Preferred style is required';
      }
    }

    // Validate vendor required fields
    if (userRole === UserRole.VENDOR) {
      if (!formData.serviceOffered) {
        errors.serviceOffered = 'Service offered is required';
      }

      if (!formData.styleOffered) {
        errors.styleOffered = 'Style offered is required';
      }

      if (!formData.weddingTypes || formData.weddingTypes.length === 0) {
        errors.weddingTypes = 'At least one wedding type must be selected';
      }
    }

    // Validate venue capacity
    if (userRole === UserRole.VENDOR && formData.serviceOffered === WeddingService.VENUE) {
      if (!formData.capacity || formData.capacity <= 0) {
        errors.capacity = 'Capacity is required and must be greater than 0 for venue services';
      }
    }

    // Validate password confirmation
    if (formData.password.trim() && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [userRole, formData]);

  const updateUserProfile = useCallback(async () => {
    if (!userId || !userRole || !userData) return;

    const updateData: any = {
      role: userRole,
    };

    // Add changed fields
    if (formData.name !== userData.name) updateData.name = formData.name;
    if (formData.email !== userData.email) updateData.email = formData.email;
    if (formData.password.trim()) updateData.password = formData.password;

    // Role-specific fields
    if (userRole === UserRole.ADMIN) {
      const adminData = userData as AdminResponseDto;
      if (formData.isSuspended !== adminData.isSuspended) {
        updateData.isSuspended = formData.isSuspended;
      }
    } else if (userRole === UserRole.VENDOR) {
      const vendorData = userData as VendorResponseDto;
      if (formData.vendorWebsite !== vendorData.vendorWebsite) {
        updateData.vendorWebsite = formData.vendorWebsite;
      }
      if (formData.uenNumber !== vendorData.uenNumber) {
        updateData.uenNumber = formData.uenNumber;
      }
      if (formData.bio !== vendorData.bio) {
        updateData.bio = formData.bio;
      }
      if (formData.serviceOffered !== vendorData.serviceOffered) {
        updateData.serviceOffered = formData.serviceOffered;
      }
      if (formData.styleOffered !== vendorData.styleOffered) {
        updateData.styleOffered = formData.styleOffered;
      }
      if (JSON.stringify(formData.weddingTypes) !== JSON.stringify(vendorData.weddingTypes)) {
        updateData.weddingTypes = formData.weddingTypes;
      }
      // Only update capacity if service is venue, otherwise set to 0
      const capacityValue =
        formData.serviceOffered === WeddingService.VENUE ? formData.capacity : 0;
      if (capacityValue !== vendorData.capacity) {
        updateData.capacity = capacityValue;
      }
    }

    // Only update if there are changes
    if (Object.keys(updateData).length > 1) {
      // More than just role
      let updatedData;
      if (userRole === UserRole.ADMIN) {
        updatedData = await AdminsService.adminControllerUpdate(
          userId,
          updateData as UpdateAdminDto,
        );
      } else if (userRole === UserRole.SUPERADMIN) {
        updatedData = await SuperAdminsService.superAdminControllerUpdate(
          userId,
          updateData as UpdateSuperAdminDto,
        );
      } else if (userRole === UserRole.VENDOR) {
        updatedData = await VendorsService.vendorControllerUpdate(
          userId,
          updateData as UpdateVendorDto,
        );
      }

      if (updatedData) {
        setUserData(updatedData);
        populateFormData(updatedData);
      }
    }
  }, [userId, userRole, userData, formData, populateFormData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent, weddingFormData?: any, silentSuccess?: boolean): Promise<boolean> => {
      e.preventDefault();

      if (!validateForm(weddingFormData)) {
        toast.error(validationErrors ? 'Please fix the validation errors before submitting' : 'Please fix the validation errors');
        return false;
      }

      try {
        setIsSaving(true);
        await updateUserProfile();
        setIsEditing(false);
        setValidationErrors({});
        if (!silentSuccess) {
          toast.success('Profile updated successfully');
        }
        onProfileUpdate?.();
        return true;
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [validateForm, updateUserProfile, onProfileUpdate],
  );

  const handleCancel = useCallback(() => {
    if (userData) populateFormData(userData);
    setValidationErrors({});
    setIsEditing(false);
  }, [userData, populateFormData]);

  const handleDeleteProfile = useCallback(
    async (password?: string) => {
      if (!password || !userId || !userRole) return;

      try {
        setIsDeletingProfile(true);

        if (userRole === UserRole.ADMIN) {
          await AdminsService.adminControllerDeleteSelf({ password });
        } else if (userRole === UserRole.VENDOR) {
          await VendorsService.vendorControllerDeleteSelf({ password });
        }

        setShowDeleteModal(false);
        toast.success('Profile deleted successfully. Thanks for using Knotly!');
        onProfileUpdate?.();

        const { signOut } = await import('next-auth/react');
        await signOut({ callbackUrl: `${window.location.origin}/login`, redirect: true });
      } catch (error: any) {
        console.error('Error deleting profile:', error);

        if (error?.status === 401 || error?.status === 403) {
          toast.error('Invalid password. Please try again.');
        } else {
          toast.error('Failed to delete profile. Please try again.');
        }
      } finally {
        setIsDeletingProfile(false);
      }
    },
    [userId, userRole, onProfileUpdate],
  );

  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  return {
    // State
    isLoading,
    isEditing,
    isSaving,
    validationErrors,
    showDeleteModal,
    isDeletingProfile,
    userData,
    formData,

    // Actions
    setIsEditing,
    setShowDeleteModal,
    fetchUserData,
    handleInputChange,
    handleSubmit,
    handleCancel,
    handleDeleteProfile,
    handleCancelDelete,
  };
};
