'use client';

import { useEffect, useState } from 'react';

import { useGuestManager } from '../../apps/external/src/app/hooks/useGuestManager';
import {
  AdminResponseDto,
  AdminsService,
  AuthService,
  BudgetBucket,
  GuestCountBucket,
  RequestResetPasswordDto,
  UserRole,
  VendorResponseDto,
  WeddingService,
  WeddingStyle,
  WeddingType,
  WeddingsService,
} from '../api';
import { useEditProfile } from '../hooks/useEditProfile';
import { useWeddingProfile } from '../hooks/useWeddingProfile';
import { TextInputWithAI } from './textInputWithAI';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DeleteConfirmationModal } from './ui/delete-confirmation-modal';
import { Input } from './ui/form/input';
import { MultiSelectDropdown } from './ui/form/multiSelectDropdown';
import { SingleSelectDropdown } from './ui/form/singleSelectDropdown';
import { Skeleton } from './ui/skeleton';
import { ChevronDown, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface EditProfileProps {
  userId?: number;
  userRole?: UserRole;
  onProfileUpdate?: () => void;
}

type Collaborator = {
  id: number;
  name: string;
  email: string;
  accountCreated: boolean;
};

export default function EditProfile({ userId, userRole, onProfileUpdate }: EditProfileProps) {
  // Use custom hooks for profile and wedding management
  const {
    isLoading,
    isEditing,
    isSaving,
    validationErrors,
    showDeleteModal,
    isDeletingProfile,
    userData,
    formData,
    setIsEditing,
    setShowDeleteModal,
    fetchUserData,
    handleInputChange,
    handleSubmit,
    handleCancel,
    handleDeleteProfile,
    handleCancelDelete,
  } = useEditProfile({ userId, userRole, onProfileUpdate });

  const {
    weddingData,
    weddingFormData,
    fetchMainWedding,
    handleWeddingInputChange,
    updateWeddingProfile,
    resetWeddingForm,
  } = useWeddingProfile();

  const { guests } = useGuestManager();

  // Partner state
  const [partner, setPartner] = useState<Collaborator | null>(null);
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [isInvitingPartner, setIsInvitingPartner] = useState(false);
  const [partnerPendingRemoval, setPartnerPendingRemoval] = useState<Collaborator | null>(null);
  const [isRemovingPartner, setIsRemovingPartner] = useState(false);

  // Collaborator state
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isInvitingCollaborator, setIsInvitingCollaborator] = useState(false);
  const [collaboratorName, setCollaboratorName] = useState('');
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [collaboratorsToRemove, setCollaboratorsToRemove] = useState<number[]>([]);

  const [collaboratorPendingRemoval, setCollaboratorPendingRemoval] = useState<Collaborator | null>(
    null,
  );
  // Determine the actual user ID and role to fetch
  const targetUserId = userId;
  const targetUserRole = userRole;

  useEffect(() => {
    if (targetUserId && targetUserRole) {
      fetchUserData();
    }
  }, [targetUserId, targetUserRole, fetchUserData]);

  useEffect(() => {
    // Fetch main wedding if admin has one
    if (targetUserRole === UserRole.ADMIN && userData) {
      const adminData = userData as AdminResponseDto;
      if (adminData.weddings && adminData.weddings.length > 0) {
        fetchMainWedding();
      }
    }
  }, [targetUserRole, userData, fetchMainWedding]);

  // Reusable function to fetch partner
  const fetchPartner = async () => {
    if (weddingData?.id && userData) {
      try {
        const mainCouple = await WeddingsService.weddingControllerGetMainCouple(weddingData.id);
        // Filter out the current user to get the partner
        const partnerData = mainCouple.find((member) => member.id !== userData.id);
        if (partnerData && partnerData.id && partnerData.name && partnerData.email) {
          setPartner({
            id: partnerData.id,
            name: partnerData.name,
            email: partnerData.email,
            accountCreated: true,
          });
        } else {
          setPartner(null);
        }
      } catch (error) {
        console.error('Error fetching partner:', error);
      }
    }
  };

  // Reusable function to fetch collaborators
  const fetchCollaborators = async () => {
    if (weddingData?.id) {
      try {
        const collaboratorsList = await AdminsService.adminControllerGetCollaborators(
          weddingData.id,
        );
        // Filter out the partner from collaborators list
        const filteredCollaborators = collaboratorsList.filter(
          (c) => !partner || c.id !== partner.id,
        );
        setCollaborators(
          filteredCollaborators.map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            accountCreated: true, // If they're in the system, account exists
          })),
        );
      } catch (error) {
        console.error('Error fetching collaborators:', error);
      }
    }
  };

  // Fetch partner (main couple) when wedding data is loaded
  useEffect(() => {
    fetchPartner();
  }, [weddingData?.id, userData]);

  // Fetch collaborators when wedding data is loaded
  useEffect(() => {
    fetchCollaborators();
  }, [weddingData?.id, partner]);

  // Enhanced submit handler that also updates wedding data
  const handleEnhancedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // First handle the profile update with wedding validation
    const isProfileUpdateSuccessful = await handleSubmit(e, weddingFormData);

    // Only update wedding data if profile update was successful and user is admin with wedding data
    if (isProfileUpdateSuccessful && targetUserRole === UserRole.ADMIN && weddingData) {
      try {
        await updateWeddingProfile();

        // Remove collaborators that were marked for deletion
        if (collaboratorsToRemove.length > 0) {
          for (const collaboratorId of collaboratorsToRemove) {
            try {
              await AdminsService.adminControllerRemoveCollaborator(weddingData.id, collaboratorId);
            } catch (error) {
              console.error(`Error removing collaborator ${collaboratorId}:`, error);
              toast.error('Failed to remove some collaborators. Please try again.');
            }
          }
          setCollaboratorsToRemove([]);
          toast.success('Changes saved successfully');
        }
      } catch (error) {
        console.error('Error updating wedding profile:', error);
        toast.error('Failed to update wedding details');
      }
    }
  };

  // Enhanced cancel handler that also resets wedding form
  const handleEnhancedCancel = () => {
    handleCancel();
    resetWeddingForm();
    // Reset partner to remove
    setPartnerPendingRemoval(null);
    // Reset partner input fields
    setPartnerName('');
    setPartnerEmail('');
    // Reset collaborators to remove list and refetch original collaborators
    setCollaboratorsToRemove([]);
    // Restore partner and collaborators list by refetching
    if (weddingData?.id && userData) {
      fetchPartner();
      fetchCollaborators();
    }
  };

  // Handle password reset request
  const sendResetPasswordEmail = async () => {
    if (!userData?.email) {
      toast.error('No email address found for this user');
      return;
    }

    try {
      const requestData: RequestResetPasswordDto = {
        email: userData.email,
      };

      await AuthService.authControllerRequestPasswordReset(requestData);
      toast.success('Password reset email sent successfully');
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      toast.error('Failed to send password reset email. Please try again.');
    }
  };

  const handleRemoveCollaboratorClick = (collaborator: Collaborator) => {
    setCollaboratorPendingRemoval(collaborator);
  };

  const closeCollaboratorRemovalModal = () => {
    setCollaboratorPendingRemoval(null);
  };

  const handleConfirmRemoveCollaborator = () => {
    if (!collaboratorPendingRemoval) return;

    // Mark collaborator for removal (will be removed on save)
    setCollaboratorsToRemove([...collaboratorsToRemove, collaboratorPendingRemoval.id]);
    // Remove from local state immediately for UI feedback
    setCollaborators(collaborators.filter((c) => c.id !== collaboratorPendingRemoval.id));

    closeCollaboratorRemovalModal();
  };

  const handleCancelRemoveCollaborator = () => {
    closeCollaboratorRemovalModal();
  };

  // Handle partner invitation
  const handleInvitePartner = async () => {
    // Prevent double-clicking
    if (isInvitingPartner) {
      return;
    }

    // Check if partner already exists
    if (partner) {
      toast.error('You already have a partner. Please remove the existing partner first.');
      return;
    }

    // Validate inputs
    if (!partnerName.trim()) {
      toast.error('Partner name is required');
      return;
    }

    if (!partnerEmail.trim()) {
      toast.error('Partner email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(partnerEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!weddingData?.id) {
      toast.error('No wedding found');
      return;
    }

    setIsInvitingPartner(true);

    try {
      const response = await AdminsService.adminControllerInvitePartner({
        email: partnerEmail.trim(),
        name: partnerName.trim(),
        weddingId: weddingData.id,
      });

      const newPartner: Collaborator = {
        id: response.id,
        name: response.name,
        email: response.email,
        accountCreated: response.accountCreated,
      };

      setPartner(newPartner);
      setPartnerName('');
      setPartnerEmail('');

      if (response.existingAccount) {
        toast.success(`${partnerName} has been added as your partner (existing account)`);
      } else {
        toast.success(
          `Account created for ${partnerName}. An invitation email will be sent shortly.`,
        );
      }
    } catch (error) {
      console.error('Error inviting partner:', error);
      toast.error('Failed to invite partner. Please try again.');
    } finally {
      setIsInvitingPartner(false);
    }
  };

  // Handle collaborator invitation
  const handleInviteCollaborator = async () => {
    // Prevent double-clicking
    if (isInvitingCollaborator) {
      return;
    }

    if (!collaboratorName.trim()) {
      toast.error('Collaborator name is required');
      return;
    }
    if (!collaboratorEmail.trim()) {
      toast.error('Collaborator email is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(collaboratorEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Check if already added
    if (collaborators.some((c) => c.email === collaboratorEmail)) {
      toast.error('This person is already a collaborator.');
      return;
    }

    // Check if it's the partner's email
    if (partner && partner.email === collaboratorEmail) {
      toast.error('This person is already the partner.');
      return;
    }

    // Check if it's the current user's email
    if (userData && userData.email === collaboratorEmail) {
      toast.error('You cannot add yourself as a collaborator.');
      return;
    }

    if (!weddingData?.id) {
      toast.error('No wedding found');
      return;
    }

    setIsInvitingCollaborator(true);

    try {
      const response = await AdminsService.adminControllerInviteCollaborator({
        email: collaboratorEmail.trim(),
        name: collaboratorName.trim(),
        weddingId: weddingData.id,
      });

      const newCollaborator: Collaborator = {
        id: response.id,
        name: response.name,
        email: response.email,
        accountCreated: response.accountCreated,
      };

      setCollaborators([...collaborators, newCollaborator]);
      setCollaboratorName('');
      setCollaboratorEmail('');

      if (response.existingAccount) {
        toast.success(`${collaboratorName} has been added as a collaborator (existing account)`);
      } else {
        toast.success(
          `Account created for ${collaboratorName}. An invitation email will be sent shortly.`,
        );
      }
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      toast.error('Failed to invite collaborator. Please try again.');
    } finally {
      setIsInvitingCollaborator(false);
    }
  };

  const handleRemovePartner = (partnerToRemove: Collaborator) => {
    setPartnerPendingRemoval(partnerToRemove);
  };

  const closePartnerRemovalModal = () => {
    setPartnerPendingRemoval(null);
  };

  const handleConfirmRemovePartner = () => {
    if (!weddingData?.id || !partnerPendingRemoval) {
      return;
    }

    setIsRemovingPartner(true);
    const partnerId = partnerPendingRemoval.id;

    void (async () => {
      try {
        await AdminsService.adminControllerRemovePartner(weddingData.id, partnerId);
        toast.success('Partner removed successfully');
        setPartner(null);
        closePartnerRemovalModal();
      } catch (error) {
        console.error(`Error removing partner ${partnerId}:`, error);
        toast.error('Failed to remove partner. Please try again.');
      } finally {
        setIsRemovingPartner(false);
      }
    })();
  };

  const handleCancelRemovePartner = () => {
    if (isRemovingPartner) {
      return;
    }

    closePartnerRemovalModal();
  };

  const handlePartnerRemovalModalChange = (open: boolean) => {
    if (!open) {
      handleCancelRemovePartner();
    }
  };

  // Filter guests based on search

  const renderUserFields = () => {
    if (!userData) return null;

    return (
      <>
        {/* Base User Fields */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Name*</label>
          {isEditing ? (
            <>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your name"
                className={validationErrors.name ? 'border-red-500' : ''}
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm">{validationErrors.name}</p>
              )}
            </>
          ) : (
            <p className="p-3 bg-muted rounded-md">{userData.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email*</label>
          {isEditing ? (
            <>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className={validationErrors.email ? 'border-red-500' : ''}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm">{validationErrors.email}</p>
              )}
            </>
          ) : (
            <p className="p-3 bg-muted rounded-md">{userData.email}</p>
          )}
        </div>

        {isEditing && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter new password (leave blank to keep current)"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to keep your current password
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Re-enter new password"
                disabled={!formData.password.trim()}
                className={validationErrors.confirmPassword ? 'border-red-500' : ''}
              />
              {validationErrors.confirmPassword && (
                <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <p className="p-3 bg-muted rounded-md capitalize">
            {userData.role.toLowerCase().replace('_', ' ')}
          </p>
        </div>

        {/* Admin-specific Fields */}
        {targetUserRole === UserRole.ADMIN && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Onboarded Date</label>
              <p className="p-3 bg-muted rounded-md">
                {new Date((userData as AdminResponseDto).onboardedDate).toLocaleDateString()}
              </p>
            </div>
          </>
        )}

        {/* Vendor-specific Fields */}
        {targetUserRole === UserRole.VENDOR && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              {isEditing ? (
                <Input
                  type="url"
                  value={formData.vendorWebsite}
                  onChange={(e) => handleInputChange('vendorWebsite', e.target.value)}
                  placeholder="Enter your website URL"
                />
              ) : (
                <p className="p-3 bg-muted rounded-md">
                  {(userData as VendorResponseDto).vendorWebsite || 'Not set'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">UEN Number</label>
              {isEditing ? (
                <Input
                  value={formData.uenNumber}
                  onChange={(e) => handleInputChange('uenNumber', e.target.value)}
                  placeholder="Enter your UEN number"
                />
              ) : (
                <p className="p-3 bg-muted rounded-md">
                  {(userData as VendorResponseDto).uenNumber || 'Not set'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              {isEditing ? (
                <TextInputWithAI
                  value={formData.bio}
                  setValue={(value) => handleInputChange('bio', value)}
                  placeholder="Tell us about your business"
                  label="Bio"
                  message={`Create or refine a vendor bio for a wedding platform.
                  ${formData.weddingTypes ? ` Wedding types: ${formData.weddingTypes.join(', ')}.` : ''}${
                    formData.serviceOffered ? ` Services: ${formData.serviceOffered}.` : ''
                  }
                  ${formData.styleOffered ? ` Style: ${formData.styleOffered}.` : ''}${
                    formData.bio ? ` Existing bio: '${formData.bio}'.` : ''
                  }
                  Keep it concise and professional. Max 50 words. DO NOT wrap the response in quotes.`}
                />
              ) : (
                <>
                  <label className="text-sm font-medium">Bio</label>
                  <p className="p-3 bg-muted rounded-md min-h-[80px]">
                    {(userData as VendorResponseDto).bio || 'No bio set'}
                  </p>
                </>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Service Offered*</label>
              {isEditing ? (
                <>
                  <SingleSelectDropdown
                    options={Object.values(WeddingService)}
                    selected={formData.serviceOffered}
                    setSelected={(selected) =>
                      handleInputChange('serviceOffered', selected as WeddingService)
                    }
                    placeholder="Select Wedding Service"
                  />
                  {validationErrors.serviceOffered && (
                    <p className="text-red-500 text-sm">{validationErrors.serviceOffered}</p>
                  )}
                </>
              ) : (
                <div className="relative rounded-md p-3 h-9 w-full text-left bg-muted flex items-center justify-between">
                  <span>
                    {((userData as VendorResponseDto).serviceOffered || 'Not set')
                      .charAt(0)
                      .toUpperCase() +
                      ((userData as VendorResponseDto).serviceOffered || 'Not set').slice(1)}
                  </span>
                  <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Style Offered*</label>
              {isEditing ? (
                <>
                  <SingleSelectDropdown
                    options={Object.values(WeddingStyle)}
                    selected={formData.styleOffered}
                    setSelected={(selected) =>
                      handleInputChange('styleOffered', selected as WeddingStyle)
                    }
                    placeholder="Select Wedding Style"
                  />
                  {validationErrors.styleOffered && (
                    <p className="text-red-500 text-sm">{validationErrors.styleOffered}</p>
                  )}
                </>
              ) : (
                <div className="relative rounded-md p-3 h-9 w-full text-left bg-muted flex items-center justify-between">
                  <span>
                    {((userData as VendorResponseDto).styleOffered || 'Not set')
                      .charAt(0)
                      .toUpperCase() +
                      ((userData as VendorResponseDto).styleOffered || 'Not set').slice(1)}
                  </span>
                  <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Wedding Types*</label>
              {isEditing ? (
                <>
                  <MultiSelectDropdown
                    options={Object.values(WeddingType)}
                    selected={formData.weddingTypes}
                    setSelected={(selected) =>
                      handleInputChange('weddingTypes', selected as WeddingType[])
                    }
                    placeholder="Select Wedding Types"
                  />
                  {validationErrors.weddingTypes && (
                    <p className="text-red-500 text-sm">{validationErrors.weddingTypes}</p>
                  )}
                </>
              ) : (
                <div className="relative rounded-md p-3 min-h-[36px] w-full text-left bg-muted flex items-center justify-between">
                  <span>
                    {(userData as VendorResponseDto).weddingTypes &&
                    (userData as VendorResponseDto).weddingTypes!.length > 0
                      ? (userData as VendorResponseDto)
                          .weddingTypes!.map((type) => type.charAt(0).toUpperCase() + type.slice(1))
                          .join(', ')
                      : 'Not set'}
                  </span>
                  <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>

            {formData.serviceOffered === WeddingService.VENUE && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity</label>
                {isEditing ? (
                  <>
                    <Input
                      type="number"
                      value={formData.capacity || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'capacity',
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                      placeholder="Enter capacity"
                      className={validationErrors.capacity ? 'border-red-500' : ''}
                    />
                    {validationErrors.capacity && (
                      <p className="text-sm text-red-500">{validationErrors.capacity}</p>
                    )}
                  </>
                ) : (
                  <p className="p-3 bg-muted rounded-md">
                    {(userData as VendorResponseDto).capacity || 'Not set'}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <p className="p-3 bg-muted rounded-md">
                {(userData as VendorResponseDto).rating?.toFixed(1) || '0.0'} / 5.0
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Onboarding Status</label>
              <p className="p-3 bg-muted rounded-md capitalize">
                {(userData as VendorResponseDto).onboardingStatus}
              </p>
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Member Since</label>
          <p className="p-3 bg-muted rounded-md">
            {new Date(userData.createdAt).toLocaleDateString()}
          </p>
        </div>
      </>
    );
  };

  const renderWeddingFields = () => {
    if (targetUserRole !== UserRole.ADMIN) return null;

    // If admin has no wedding, show a prompt to create one
    if (!weddingData) {
      return (
        <Card className="mt-6 bg-gradient-to-br from-brand-50 to-pink-50 border-2 border-brand-300 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-brand-700">
              ✨ Your Dream Wedding Awaits! ✨
            </CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700 font-medium">
                Let's bring your special day to life!
              </p>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Share your wedding details with us and unlock personalized vendor recommendations,
                smart budgeting tools, and everything you need to plan the perfect celebration.
              </p>
              <Button
                onClick={() => {
                  window.location.href = '/admin/create-wedding';
                }}
                className="mx-auto mt-4 px-8 py-6 text-lg font-semibold bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-700 hover:to-pink-700 shadow-md hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                🎉 Start Planning Your Wedding
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mt-6 bg-outline border-primary">
        <CardHeader>
          <CardTitle>Wedding Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Wedding Name*</label>
            {isEditing ? (
              <>
                <Input
                  value={weddingFormData.name}
                  onChange={(e) => handleWeddingInputChange('name', e.target.value)}
                  placeholder="Enter wedding name"
                />
                {validationErrors.weddingName && (
                  <p className="text-red-500 text-sm">{validationErrors.weddingName}</p>
                )}
              </>
            ) : (
              <p className="p-3 bg-muted rounded-md">{weddingData.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Wedding Date</label>
            {isEditing ? (
              <Input
                type="date"
                value={weddingFormData.date}
                onChange={(e) => handleWeddingInputChange('date', e.target.value)}
              />
            ) : (
              <p className="p-3 bg-muted rounded-md">
                {weddingData.date
                  ? new Date(weddingData.date).toLocaleDateString('en-GB')
                  : 'Not set'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            {isEditing ? (
              <Input
                value={weddingFormData.location}
                onChange={(e) => handleWeddingInputChange('location', e.target.value)}
                placeholder="Enter wedding location"
              />
            ) : (
              <p className="p-3 bg-muted rounded-md">{weddingData.location || 'Not set'}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Wedding Type*</label>
            {isEditing ? (
              <>
                <SingleSelectDropdown
                  options={Object.values(WeddingType)}
                  selected={weddingFormData.weddingType}
                  setSelected={(selected) =>
                    handleWeddingInputChange('weddingType', selected as WeddingType)
                  }
                  placeholder="Select Wedding Type"
                />
                {validationErrors.weddingType && (
                  <p className="text-red-500 text-sm">{validationErrors.weddingType}</p>
                )}
              </>
            ) : (
              <div className="relative rounded-md p-3 h-9 w-full text-left bg-muted flex items-center justify-between">
                <span>
                  {(weddingData.weddingType || 'Not set').charAt(0).toUpperCase() +
                    (weddingData.weddingType || 'Not set').slice(1)}
                </span>
                <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Budget Range*</label>
            {isEditing ? (
              <>
                <SingleSelectDropdown
                  options={Object.values(BudgetBucket)}
                  selected={weddingFormData.budgetBucket}
                  setSelected={(selected) =>
                    handleWeddingInputChange('budgetBucket', selected as BudgetBucket)
                  }
                  placeholder="Select Budget Range"
                />
                {validationErrors.budgetBucket && (
                  <p className="text-red-500 text-sm">{validationErrors.budgetBucket}</p>
                )}
              </>
            ) : (
              <div className="relative rounded-md p-3 h-9 w-full text-left bg-muted flex items-center justify-between">
                <span>
                  {(weddingData.budgetBucket || 'Not set').charAt(0).toUpperCase() +
                    (weddingData.budgetBucket || 'Not set').slice(1)}
                </span>
                <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Allocated Budget*</label>
            {isEditing ? (
              <>
                <Input
                  type="number"
                  value={weddingFormData.allocatedBudget || ''}
                  onChange={(e) =>
                    handleWeddingInputChange('allocatedBudget', parseFloat(e.target.value) || 0)
                  }
                  placeholder="Enter your allocated budget"
                  min="0"
                  step="100"
                />
                {validationErrors.allocatedBudget && (
                  <p className="text-red-500 text-sm">{validationErrors.allocatedBudget}</p>
                )}
              </>
            ) : (
              <p className="p-3 bg-muted rounded-md">
                ${weddingData.allocatedBudget ? weddingData.allocatedBudget.toLocaleString() : '0'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Guest Count*</label>
            {isEditing ? (
              <>
                <SingleSelectDropdown
                  options={Object.values(GuestCountBucket)}
                  selected={weddingFormData.guestCountBucket}
                  setSelected={(selected) =>
                    handleWeddingInputChange('guestCountBucket', selected as GuestCountBucket)
                  }
                  placeholder="Select Guest Count Range"
                />
                {validationErrors.guestCountBucket && (
                  <p className="text-red-500 text-sm">{validationErrors.guestCountBucket}</p>
                )}
              </>
            ) : (
              <div className="relative rounded-md p-3 h-9 w-full text-left bg-muted flex items-center justify-between">
                <span>
                  {(weddingData.guestCountBucket || 'Not set').charAt(0).toUpperCase() +
                    (weddingData.guestCountBucket || 'Not set').slice(1)}
                </span>
                <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred Style*</label>
            {isEditing ? (
              <>
                <SingleSelectDropdown
                  options={Object.values(WeddingStyle)}
                  selected={weddingFormData.preferredStyle}
                  setSelected={(selected) =>
                    handleWeddingInputChange('preferredStyle', selected as WeddingStyle)
                  }
                  placeholder="Select Wedding Style"
                />
                {validationErrors.preferredStyle && (
                  <p className="text-red-500 text-sm">{validationErrors.preferredStyle}</p>
                )}
              </>
            ) : (
              <div className="relative rounded-md p-3 h-9 w-full text-left bg-muted flex items-center justify-between">
                <span>
                  {(weddingData.preferredStyle || 'Not set').charAt(0).toUpperCase() +
                    (weddingData.preferredStyle || 'Not set').slice(1)}
                </span>
                <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred Services*</label>
            {isEditing ? (
              <>
                <MultiSelectDropdown
                  options={Object.values(WeddingService)}
                  selected={weddingFormData.preferredServices}
                  setSelected={(selected) =>
                    handleWeddingInputChange('preferredServices', selected as WeddingService[])
                  }
                  placeholder="Select Preferred Services"
                />
                {validationErrors.preferredServices && (
                  <p className="text-red-500 text-sm">{validationErrors.preferredServices}</p>
                )}
              </>
            ) : (
              <div className="relative rounded-md p-3 min-h-[36px] w-full text-left bg-muted flex items-center justify-between">
                <span>
                  {weddingData.preferredServices && weddingData.preferredServices.length > 0
                    ? weddingData.preferredServices
                        .map((service) => service.charAt(0).toUpperCase() + service.slice(1))
                        .join(', ')
                    : 'Not set'}
                </span>
                <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Partner</label>

            {isEditing && !partner && (
              <div className="space-y-3">
                <div>
                  <Input
                    type="text"
                    placeholder="Partner's name"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="text-sm"
                    disabled={isInvitingPartner}
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Partner's email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    className="text-sm"
                    disabled={isInvitingPartner}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleInvitePartner}
                  disabled={isInvitingPartner || !partnerName.trim() || !partnerEmail.trim()}
                  className="w-full"
                  size="sm"
                >
                  {isInvitingPartner ? 'Adding Partner...' : 'Add Partner'}
                </Button>
              </div>
            )}

            {!partner && !isEditing && (
              <p className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
                No partner added yet
              </p>
            )}

            {partner && (
              <div className="border rounded-md">
                <div className="flex items-center justify-between p-3 hover:bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{partner.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{partner.email}</p>
                  </div>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleRemovePartner(partner)}
                      disabled={isRemovingPartner}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Collaborators</label>

            {isEditing && (
              <div className="space-y-3">
                <div>
                  <Input
                    type="text"
                    placeholder="Collaborator's name"
                    value={collaboratorName}
                    onChange={(e) => setCollaboratorName(e.target.value)}
                    className="text-sm"
                    disabled={isInvitingCollaborator}
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Collaborator's email"
                    value={collaboratorEmail}
                    onChange={(e) => setCollaboratorEmail(e.target.value)}
                    className="text-sm"
                    disabled={isInvitingCollaborator}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleInviteCollaborator}
                  disabled={
                    isInvitingCollaborator || !collaboratorName.trim() || !collaboratorEmail.trim()
                  }
                  className="w-full"
                  size="sm"
                >
                  {isInvitingCollaborator ? 'Adding Collaborator...' : 'Add Collaborator'}
                </Button>
              </div>
            )}

            {collaborators.length === 0 ? (
              <p className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
                No collaborators added yet
              </p>
            ) : (
              <div className="border rounded-md divide-y">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-3 hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{collaborator.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                    </div>
                    {isEditing && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleRemoveCollaboratorClick(collaborator)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Failed to load profile data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {isEditing ? (
        <form onSubmit={handleEnhancedSubmit} className="space-y-4">
          {renderUserFields()}
          {renderWeddingFields()}

          <div className="absolute top-0 right-4 flex gap-3">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="darkOutline"
              onClick={handleEnhancedCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {renderUserFields()}
          {renderWeddingFields()}

          <div className="absolute top-0 right-4 flex gap-3">
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
            {targetUserRole !== UserRole.SUPERADMIN && (
              <>
                <Button type="button" variant="secondary" onClick={() => sendResetPasswordEmail()}>
                  Reset Password
                </Button>
                <Button
                  type="button"
                  className="bg-destructive text-base-white"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Profile
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        open={partnerPendingRemoval !== null}
        onOpenChange={handlePartnerRemovalModalChange}
        title="Remove Partner"
        itemName={partnerPendingRemoval ? partnerPendingRemoval.name : 'this partner'}
        description="Removing this partner will revoke their access to your shared wedding planning workspace."
        onConfirm={handleConfirmRemovePartner}
        onCancel={handleCancelRemovePartner}
        isLoading={isRemovingPartner}
      />

      <DeleteConfirmationModal
        open={collaboratorPendingRemoval !== null}
        onOpenChange={(open) => !open && handleCancelRemoveCollaborator()}
        title="Remove Collaborator"
        itemName={collaboratorPendingRemoval ? collaboratorPendingRemoval.name : ''}
        description={`Are you sure you want to remove ${collaboratorPendingRemoval?.name} from this wedding? Their access will be revoked.`}
        onConfirm={handleConfirmRemoveCollaborator}
        onCancel={handleCancelRemoveCollaborator}
      />

      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelDelete();
          }
        }}
        title="Delete Profile"
        itemName="your profile"
        onConfirm={handleDeleteProfile}
        onCancel={handleCancelDelete}
        requirePasswordConfirmation={true}
        confirmButtonText="Delete Profile"
        cancelButtonText="Cancel"
        isLoading={isDeletingProfile}
      />
    </div>
  );
}
