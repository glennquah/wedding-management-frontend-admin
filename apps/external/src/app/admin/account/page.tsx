'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { UserRole } from '@shared/api';
import { PageHeader } from '@shared/components';
import EditProfile from '@shared/components/EditProfile';

export const dynamic = 'force-dynamic';

export default function AccountPage() {
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<UserRole | undefined>();
  const [userId, setUserId] = useState<number | undefined>();

  useEffect(() => {
    if (session?.user) {
      setUserRole(session.user.role as UserRole);
      setUserId(session.user.id);
    }
  }, [session]);

  const handleProfileUpdate = () => {
    // Optionally refresh session or perform other updates
    console.log('Profile updated successfully');
  };

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
          userId={userId}
          userRole={userRole}
          onProfileUpdate={handleProfileUpdate}
        />
      </div>
    </div>
  );
}