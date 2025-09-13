'use client';

import { useEffect, useState } from 'react';

import { getUserColumns } from '@shared/columns/user-columns';
import { DataTable, PageHeader } from '@shared/components';
import { UserResponseDto, UsersService } from '@wedding/api-types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

export default function AdminManagementPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchusers = async () => {
      try {
        setIsLoading(true);
        const userData = await UsersService.userControllerGetAllUsers();
        setUsers(userData);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchusers();
  }, [session?.user, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="User Management" description="Manage users across all weddings" />
      <DataTable
        data={users.map((User) => ({
          ...User,
        }))}
        columns={getUserColumns({
          onEditUser: (user) => console.log('Edit user:', user),
          onDeleteUser: (user) => console.log('Delete user:', user),
        })}
        searchableColumns={[{ id: 'name', placeholder: 'Search by name...' }]}
        enableSelection={false}
        enableColumnVisibility={true}
        enablePagination={true}
        defaultPageSize={10}
        title={`users (${users.length})`}
        isLoading={isLoading}
        loadingMessage="Loading users..."
        emptyMessage="No users added yet."
        emptyDescription='Click "Add User" to get started!'
      />
    </div>
  );
}
