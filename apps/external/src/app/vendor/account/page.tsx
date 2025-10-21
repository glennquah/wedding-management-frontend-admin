'use client';

import { useVendorSession } from '../../../contexts/VendorSessionContext';
import { UserRole } from '@shared/api';
import { PageHeader } from '@shared/components';
import EditProfile from '@shared/components/EditProfile';

export const dynamic = 'force-dynamic';

export default function AccountPage() {
  const { vendorId, isLoading } = useVendorSession();

  const handleProfileUpdate = () => {
    // Force a full page reload to refresh the sidebar and all vendor-related data
    console.log('Profile updated successfully');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-8">
        <div className="flex items-center justify-center">
          <div>Loading vendor information...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Account Settings"
          description="Manage your profile information and settings"
        />
      </div>

      <div>
        <EditProfile
          userId={vendorId || undefined}
          userRole={UserRole.VENDOR}
          onProfileUpdate={handleProfileUpdate}
        />
      </div>
    </div>
  );
}
