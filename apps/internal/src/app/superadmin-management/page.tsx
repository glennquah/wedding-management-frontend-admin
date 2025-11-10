'use client';

import { useEffect, useState } from 'react';

import { getSuperAdminColumns } from '../../../../../shared/columns/superadmin-columns';
import { Button, DataTable, DeleteConfirmationModal, PageHeader } from '@shared/components';
import FormField from '@shared/components/FormField';
import { FormDialog } from '@shared/components/ui/form/form-dialog';
import {
  CreateSuperAdminDto,
  SuperAdminResponseDto,
  SuperAdminsService,
  UserRole,
} from '@wedding/api-types';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

export default function SuperAdminManagementPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Core data
  const [superAdmins, setSuperAdmins] = useState<SuperAdminResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isAddingSuperAdmin, setIsAddingSuperAdmin] = useState(false);
  const [deleteConfirmSuperAdmin, setDeleteConfirmSuperAdmin] =
    useState<SuperAdminResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [newSuperAdmin, setNewSuperAdmin] = useState<
    Partial<CreateSuperAdminDto & { id?: number }>
  >({});

  // Fetch super admins data
  useEffect(() => {
    const fetchSuperAdmins = async () => {
      try {
        setIsLoading(true);
        const superAdminsData = await SuperAdminsService.superAdminControllerGetAllAdmins();
        setSuperAdmins(superAdminsData);
      } catch (error) {
        console.error('Failed to fetch super admins:', error);
        toast.error('Failed to load super admins');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuperAdmins();
  }, [session?.user, router]);

  // Modal controls
  const openAddSuperAdminModal = () => {
    setNewSuperAdmin({
      role: UserRole.SUPERADMIN,
    });
    setIsAddingSuperAdmin(true);
  };

  const closeAddSuperAdminModal = () => {
    setIsAddingSuperAdmin(false);
    setNewSuperAdmin({});
  };

  const openDeleteConfirmModal = (superAdmin: SuperAdminResponseDto) => {
    setDeleteConfirmSuperAdmin(superAdmin);
  };

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmSuperAdmin(null);
  };

  // Handlers
  const handleAddSuperAdmin = async () => {
    setIsSubmitting(true);
    try {
      if (!newSuperAdmin.name || !newSuperAdmin.email) {
        toast.error('Please fill in all required fields');
        return;
      }

      const superAdminData: CreateSuperAdminDto = {
        name: newSuperAdmin.name,
        email: newSuperAdmin.email,
        role: UserRole.SUPERADMIN,
      };

      await SuperAdminsService.superAdminControllerCreate(superAdminData);
      toast.success(
        `Account created for ${newSuperAdmin.name}. A password reset email has been sent to ${newSuperAdmin.email}.`,
      );
      closeAddSuperAdminModal();
      // Refresh super admins list
      const superAdminsData = await SuperAdminsService.superAdminControllerGetAllAdmins();
      setSuperAdmins(superAdminsData);
    } catch (error) {
      console.error('Failed to add super admin:', error);
      toast.error('Failed to add super admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteSuperAdmin = async () => {
    if (!deleteConfirmSuperAdmin?.id) return;

    setIsSubmitting(true);
    try {
      await SuperAdminsService.superAdminControllerDelete(deleteConfirmSuperAdmin.id);
      toast.success('Super admin deleted successfully!');
      closeDeleteConfirmModal();
      // Refresh super admins list
      const superAdminsData = await SuperAdminsService.superAdminControllerGetAllAdmins();
      setSuperAdmins(superAdminsData);
    } catch (error) {
      console.error('Failed to delete super admin:', error);
      toast.error('Failed to delete super admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add Super Admin Form Fields
  const superAdminFormFields = (
    superAdmin: Partial<CreateSuperAdminDto & { id?: number }>,
    setSuperAdmin: React.Dispatch<
      React.SetStateAction<Partial<CreateSuperAdminDto & { id?: number }>>
    >,
  ) => [
    <div key="name" className="md:col-span-2">
      <FormField
        label="Name *"
        id="name"
        type="text"
        value={superAdmin.name || ''}
        onChange={(e) => setSuperAdmin({ ...superAdmin, name: e.target.value })}
        required
        placeholder="Super Admin Name"
      />
    </div>,

    <div key="email" className="md:col-span-2">
      <FormField
        label="Email *"
        id="email"
        type="email"
        value={superAdmin.email || ''}
        onChange={(e) => setSuperAdmin({ ...superAdmin, email: e.target.value })}
        required
        placeholder="Email address"
      />
      <p className="text-xs text-gray-500 mt-3">
        An email will be sent to this address with instructions to set up their password.
      </p>
    </div>,
  ];

  // Column definitions for DataTable using superadmin columns
  const columns = getSuperAdminColumns({
    onDeleteSuperAdmin: openDeleteConfirmModal,
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
      <div className="w-full max-w-full px-4 py-8 min-w-0 overflow-x-hidden">
        <div className="flex items-center justify-between">
        <PageHeader
          title="Super Admin Management"
          description="Manage super admins and their access levels"
        />
        <Button onClick={openAddSuperAdminModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Super Admin
        </Button>
      </div>

      {/* Add Super Admin Modal */}
      <FormDialog
        open={isAddingSuperAdmin}
        onOpenChange={closeAddSuperAdminModal}
        title="Add Super Admin"
        isSubmitting={isSubmitting}
        onSubmit={handleAddSuperAdmin}
        onCancel={closeAddSuperAdminModal}
        submitButtonText="Add Super Admin"
        formFields={superAdminFormFields(newSuperAdmin, setNewSuperAdmin)}
        noOfColumns={2}
      />

      {/* Super Admin List Table */}
      <div className="w-full">
        <DataTable
          data={superAdmins}
          columns={columns}
          searchableColumns={[
            { id: 'name', placeholder: 'Search by name...' },
            { id: 'email', placeholder: 'Search by email...' },
          ]}
          enableSelection={false}
          enableColumnVisibility={true}
          enablePagination={true}
          defaultPageSize={10}
          title={`Super Admins (${superAdmins.length})`}
          isLoading={isLoading}
          loadingMessage="Loading super admins..."
          emptyMessage="No super admins added yet."
          emptyDescription='Add a super admin using the "Add Super Admin" button.'
          className="w-full h-full"
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deleteConfirmSuperAdmin}
        onOpenChange={closeDeleteConfirmModal}
        itemName={deleteConfirmSuperAdmin?.name || 'this super admin'}
        description={
          deleteConfirmSuperAdmin && (
            <>
              Are you sure you want to delete {deleteConfirmSuperAdmin.name}? This action cannot be
              undone and will permanently remove their access to the system.
            </>
          )
        }
        onConfirm={confirmDeleteSuperAdmin}
        onCancel={closeDeleteConfirmModal}
      />
      </div>
    </div>
  );
}
