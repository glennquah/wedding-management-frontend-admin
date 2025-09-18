'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  AdminResponseDto,
  AdminsService,
  BudgetBucket,
  GuestCountBucket,
  SuperAdminResponseDto,
  SuperAdminsService,
  UpdateAdminDto,
  UpdateSuperAdminDto,
  UpdateVendorDto,
  UpdateWeddingDto,
  UserRole,
  VendorResponseDto,
  VendorsService,
  WeddingResponseDto,
  WeddingService,
  WeddingsService,
  WeddingStyle,
  WeddingType
} from '../api';
import { TextInputWithAI } from './textInputWithAi';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/form/input';
import { MultiSelectDropdown } from './ui/form/multiSelectDropdown';
import { SingleSelectDropdown } from './ui/form/singleSelectDropdown';
import { Skeleton } from './ui/skeleton';

interface EditProfileProps {
  userId?: number;
  userRole?: UserRole;
  onProfileUpdate?: () => void;
}

type UserData = AdminResponseDto | SuperAdminResponseDto | VendorResponseDto;

export default function EditProfile({ userId, userRole, onProfileUpdate }: EditProfileProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [weddingData, setWeddingData] = useState<WeddingResponseDto | null>(null);
  const [isLoadingWedding, setIsLoadingWedding] = useState(false);

  // Base form data for all user types
  const [formData, setFormData] = useState({
    // Base User fields
    name: '',
    email: '',
    password: '',

    // Admin-specific fields
    isSuspended: false,
    mainWeddingId: null as number | null,

    // Vendor-specific fields
    vendorWebsite: '',
    uenNumber: '',
    bio: '',
    serviceOffered: WeddingService.VENUE,
    styleOffered: WeddingStyle.MODERN,
    weddingTypes: [] as WeddingType[],
    capacity: null as number | null,
  });

  // Wedding form data for admins
  const [weddingFormData, setWeddingFormData] = useState({
    name: '',
    date: '',
    location: '',
    weddingType: WeddingType.WESTERN,
    budgetBucket: BudgetBucket.MEDIUM,
    guestCountBucket: GuestCountBucket.MEDIUM,
    preferredStyle: WeddingStyle.MODERN,
    preferredServices: [] as WeddingService[],
  });

  // Determine the actual user ID and role to fetch
  const targetUserId = userId;
  const targetUserRole = userRole;

  useEffect(() => {
    if (targetUserId && targetUserRole) {
      fetchUserData();
    }
  }, [targetUserId, targetUserRole]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      let data: UserData;

      if (targetUserRole === UserRole.ADMIN) {
        data = await AdminsService.adminControllerGetAdmin(targetUserId!);
        // Also fetch main wedding if admin has one
        if ((data as AdminResponseDto).weddings && (data as AdminResponseDto).weddings!.length > 0) {
          fetchMainWedding();
        }
      } else if (targetUserRole === UserRole.SUPER_ADMIN) {
        data = await SuperAdminsService.superAdminControllerGetAdmin(targetUserId!);
      } else if (targetUserRole === UserRole.VENDOR) {
        data = await VendorsService.vendorControllerGetVendor(targetUserId!);
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
  };

  const fetchMainWedding = async () => {
    try {
      setIsLoadingWedding(true);
      const mainWeddingResponse = await AdminsService.adminControllerGetMyMainWedding();

      if (mainWeddingResponse.mainWeddingId) {
        const mainWedding = await WeddingsService.weddingControllerFindOne(
          mainWeddingResponse.mainWeddingId
        );

        if (mainWedding) {
          setWeddingData(mainWedding);
          populateWeddingFormData(mainWedding);
        }
      }
    } catch (error) {
      console.error("Error fetching wedding data:", error);
    } finally {
      setIsLoadingWedding(false);
    }
  };

  const populateFormData = (data: UserData) => {
    setFormData({
      name: data.name || '',
      email: data.email || '',
      password: '',

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
  };

  const populateWeddingFormData = (wedding: WeddingResponseDto) => {
    setWeddingFormData({
      name: wedding.name || '',
      date: wedding.date || '',
      location: wedding.location || '',
      weddingType: wedding.weddingType,
      budgetBucket: wedding.budgetBucket,
      guestCountBucket: wedding.guestCountBucket,
      preferredStyle: wedding.preferredStyle,
      preferredServices: wedding.preferredServices || [],
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWeddingInputChange = (field: string, value: any) => {
    setWeddingFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      // Update user profile
      await updateUserProfile();

      // Update wedding data if admin and wedding exists
      if (targetUserRole === UserRole.ADMIN && weddingData) {
        await updateWeddingProfile();
      }

      setIsEditing(false);
      toast.success('Profile updated successfully');
      onProfileUpdate?.();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const updateUserProfile = async () => {
    const updateData: any = {
      role: targetUserRole!,
    };

    // Add changed fields
    if (formData.name !== userData?.name) updateData.name = formData.name;
    if (formData.email !== userData?.email) updateData.email = formData.email;
    if (formData.password.trim()) updateData.password = formData.password;

    // Role-specific fields
    if (targetUserRole === UserRole.ADMIN) {
      const adminData = userData as AdminResponseDto;
      if (formData.isSuspended !== adminData.isSuspended) {
        updateData.isSuspended = formData.isSuspended;
      }
    } else if (targetUserRole === UserRole.VENDOR) {
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
      if (formData.capacity !== vendorData.capacity) {
        updateData.capacity = formData.capacity;
      }
    }

    // Only update if there are changes
    if (Object.keys(updateData).length > 1) { // More than just role
      let updatedData;
      if (targetUserRole === UserRole.ADMIN) {
        updatedData = await AdminsService.adminControllerUpdate(targetUserId!, updateData as UpdateAdminDto);
      } else if (targetUserRole === UserRole.SUPER_ADMIN) {
        updatedData = await SuperAdminsService.superAdminControllerUpdate(targetUserId!, updateData as UpdateSuperAdminDto);
      } else if (targetUserRole === UserRole.VENDOR) {
        updatedData = await VendorsService.vendorControllerUpdate(targetUserId!, updateData as UpdateVendorDto);
      }

      if (updatedData) {
        setUserData(updatedData);
        populateFormData(updatedData);
      }
    }
  };

  const updateWeddingProfile = async () => {
    if (!weddingData) return;

    const updateData: UpdateWeddingDto = {};

    // Add changed wedding fields
    if (weddingFormData.name !== weddingData.name) updateData.name = weddingFormData.name;
    if (weddingFormData.date !== weddingData.date) updateData.date = weddingFormData.date;
    if (weddingFormData.location !== weddingData.location) updateData.location = weddingFormData.location;
    if (weddingFormData.weddingType !== weddingData.weddingType) updateData.weddingType = weddingFormData.weddingType;
    if (weddingFormData.budgetBucket !== weddingData.budgetBucket) updateData.budgetBucket = weddingFormData.budgetBucket;
    if (weddingFormData.guestCountBucket !== weddingData.guestCountBucket) updateData.guestCountBucket = weddingFormData.guestCountBucket;
    if (weddingFormData.preferredStyle !== weddingData.preferredStyle) updateData.preferredStyle = weddingFormData.preferredStyle;
    if (JSON.stringify(weddingFormData.preferredServices) !== JSON.stringify(weddingData.preferredServices)) {
      updateData.preferredServices = weddingFormData.preferredServices;
    }

    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      const updatedWedding = await WeddingsService.weddingControllerUpdate(weddingData.id, updateData);
      setWeddingData(updatedWedding);
      populateWeddingFormData(updatedWedding);
    }
  };

  const handleCancel = () => {
    if (userData) populateFormData(userData);
    if (weddingData) populateWeddingFormData(weddingData);
    setIsEditing(false);
  };

  const renderUserFields = () => {
    if (!userData) return null;

    return (
      <>
        {/* Base User Fields */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          {isEditing ? (
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your name"
            />
          ) : (
            <p className="p-3 bg-muted rounded-md">{userData.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          {isEditing ? (
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
            />
          ) : (
            <p className="p-3 bg-muted rounded-md">{userData.email}</p>
          )}
        </div>

        {isEditing && (
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
                  type='url'
                  value={formData.vendorWebsite}
                  onChange={(e) => handleInputChange('vendorWebsite', e.target.value)}
                  placeholder="Enter your website URL"
                />
              ) : (
                <p className="p-3 bg-muted rounded-md">{(userData as VendorResponseDto).vendorWebsite || 'Not set'}</p>
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
                <p className="p-3 bg-muted rounded-md">{(userData as VendorResponseDto).uenNumber || 'Not set'}</p>
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
                  <p className="p-3 bg-muted rounded-md min-h-[80px]">{(userData as VendorResponseDto).bio || 'No bio set'}</p>
                </>
              )}
            </div>

            <div className="space-y-2">
              <SingleSelectDropdown
                label="Service Offered"
                options={Object.values(WeddingService)}
                selected={isEditing ? formData.serviceOffered : (userData as VendorResponseDto).serviceOffered}
                setSelected={(selected) => handleInputChange('serviceOffered', selected as WeddingService)}
                placeholder="Select Wedding Service"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <SingleSelectDropdown
                label="Style Offered"
                options={Object.values(WeddingStyle)}
                selected={isEditing ? formData.styleOffered : (userData as VendorResponseDto).styleOffered}
                setSelected={(selected) => handleInputChange('styleOffered', selected as WeddingStyle)}
                placeholder="Select Wedding Style"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <MultiSelectDropdown
                label="Wedding Types"
                options={Object.values(WeddingType)}
                selected={isEditing ? formData.weddingTypes : (userData as VendorResponseDto).weddingTypes ?? []}
                setSelected={(selected) => handleInputChange('weddingTypes', selected as WeddingType[])}
                placeholder="Select Wedding Types"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Capacity</label>
              {isEditing ? (
                <Input
                  type="number"
                  value={formData.capacity || ''}
                  onChange={(e) => handleInputChange('capacity', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Enter capacity"
                />
              ) : (
                <p className="p-3 bg-muted rounded-md">{(userData as VendorResponseDto).capacity || 'Not set'}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <p className="p-3 bg-muted rounded-md">{(userData as VendorResponseDto).rating?.toFixed(1) || '0.0'} / 5.0</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Onboarding Status</label>
              <p className="p-3 bg-muted rounded-md capitalize">{(userData as VendorResponseDto).onboardingStatus}</p>
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
    if (targetUserRole !== UserRole.ADMIN || !weddingData) return null;

    return (
      <Card className="mt-6 bg-outline border-primary">
        <CardHeader>
          <CardTitle>Wedding Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Wedding Name</label>
            {isEditing ? (
              <Input
                value={weddingFormData.name}
                onChange={(e) => handleWeddingInputChange('name', e.target.value)}
                placeholder="Enter wedding name"
              />
            ) : (
              <p className="p-3 bg-muted rounded-md">{weddingData.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Wedding Date</label>
            {isEditing ? (
              <Input
                type="datetime-local"
                value={weddingFormData.date}
                onChange={(e) => handleWeddingInputChange('date', e.target.value)}
              />
            ) : (
              <p className="p-3 bg-muted rounded-md">
                {weddingData.date ? new Date(weddingData.date).toLocaleDateString() : 'Not set'}
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
            <SingleSelectDropdown
              label="Wedding Type"
              options={Object.values(WeddingType)}
              selected={isEditing ? weddingFormData.weddingType : weddingData.weddingType}
              setSelected={(selected) => handleWeddingInputChange('weddingType', selected as WeddingType)}
              placeholder="Select Wedding Type"
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <SingleSelectDropdown
              label="Budget Range"
              options={Object.values(BudgetBucket)}
              selected={isEditing ? weddingFormData.budgetBucket : weddingData.budgetBucket}
              setSelected={(selected) => handleWeddingInputChange('budgetBucket', selected as BudgetBucket)}
              placeholder="Select Budget Range"
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <SingleSelectDropdown
              label="Guest Count"
              options={Object.values(GuestCountBucket)}
              selected={isEditing ? weddingFormData.guestCountBucket : weddingData.guestCountBucket}
              setSelected={(selected) => handleWeddingInputChange('guestCountBucket', selected as GuestCountBucket)}
              placeholder="Select Guest Count Range"
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <SingleSelectDropdown
              label="Preferred Style"
              options={Object.values(WeddingStyle)}
              selected={isEditing ? weddingFormData.preferredStyle : weddingData.preferredStyle}
              setSelected={(selected) => handleWeddingInputChange('preferredStyle', selected as WeddingStyle)}
              placeholder="Select Wedding Style"
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <MultiSelectDropdown
              label="Preferred Services"
              options={Object.values(WeddingService)}
              selected={isEditing ? weddingFormData.preferredServices : (weddingData.preferredServices ?? [])}
              setSelected={(selected) => handleWeddingInputChange('preferredServices', selected as WeddingService[])}
              placeholder="Select Preferred Services"
              disabled={!isEditing}
            />
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderUserFields()}
          {renderWeddingFields()}

          <div className="absolute top-0 right-4 flex gap-3">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant='darkOutline' onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {renderUserFields()}
          {renderWeddingFields()}

          <div className="absolute top-0 right-4 flex gap-3">
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}