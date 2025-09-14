import React from 'react';

import { getEditAdminFormFields } from '../../apps/internal/src/app/components/formFields/AdminManagement';
import { DataTable, DeleteConfirmationModal } from './index';
import { FormDialog } from './ui/form/form-dialog';
import { getAdminColumns } from '@shared/columns/admin-columns';
import { AdminResponseDto, UpdateAdminDto, WeddingService } from '@wedding/api-types';

interface AdminTableProps {
  // Data
  admins: AdminResponseDto[];
  isLoading: boolean;

  // Edit Modal State
  isEditingAdmin: boolean;
  editAdmin: Partial<UpdateAdminDto & { id?: number }>;
  setEditAdmin: React.Dispatch<React.SetStateAction<Partial<UpdateAdminDto & { id?: number }>>>;
  isSubmitting: boolean;

  // Delete Modal State
  deleteConfirmAdmin: AdminResponseDto | null;

  // Handlers
  onEditAdmin: (admin: AdminResponseDto) => void;
  onDeleteAdmin: (admin: AdminResponseDto) => void;
  handleEditAdmin: () => Promise<void>;
  handleEditPasswordGenerate: () => void;
  handleEditServiceToggle: (service: WeddingService) => void;
  closeEditAdminModal: () => void;
  confirmDeleteAdmin: () => Promise<void>;
  closeDeleteConfirmModal: () => void;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  isLoading,
  isEditingAdmin,
  editAdmin,
  setEditAdmin,
  isSubmitting,
  deleteConfirmAdmin,
  onEditAdmin,
  onDeleteAdmin,
  handleEditAdmin,
  handleEditPasswordGenerate,
  handleEditServiceToggle,
  closeEditAdminModal,
  confirmDeleteAdmin,
  closeDeleteConfirmModal,
}) => {
  const columns = getAdminColumns({
    onEditAdmin,
    onDeleteAdmin,
  });

  return (
    <div className="flex flex-col">
      {/* Admin List Table */}
      <div className="w-full">
        <DataTable
          data={admins}
          columns={columns}
          searchableColumns={[
            { id: 'name', placeholder: 'Search by name...' },
            { id: 'email', placeholder: 'Search by email...' },
          ]}
          enableSelection={false}
          enableColumnVisibility={true}
          enablePagination={true}
          defaultPageSize={10}
          title={`Admins (${admins.length})`}
          isLoading={isLoading}
          loadingMessage="Loading admins..."
          emptyMessage="No admins added yet."
          emptyDescription='Add an admin using the "Add Admin" button.'
        />
      </div>

      {/* Edit Admin Modal */}
      <FormDialog
        open={isEditingAdmin}
        onOpenChange={closeEditAdminModal}
        title="Edit Admin"
        isSubmitting={isSubmitting}
        onSubmit={handleEditAdmin}
        onCancel={closeEditAdminModal}
        submitButtonText="Update Admin"
        formFields={getEditAdminFormFields({
          admin: editAdmin,
          setAdmin: setEditAdmin,
          handleGeneratePassword: handleEditPasswordGenerate,
          handleServiceToggle: handleEditServiceToggle,
        })}
        noOfColumns={2}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deleteConfirmAdmin}
        onOpenChange={closeDeleteConfirmModal}
        itemName={deleteConfirmAdmin?.name || 'this admin'}
        description={
          deleteConfirmAdmin && (
            <>
              Are you sure you want to delete {deleteConfirmAdmin.name}? This action cannot be
              undone and will permanently remove their access to the system.
            </>
          )
        }
        onConfirm={confirmDeleteAdmin}
        onCancel={closeDeleteConfirmModal}
      />
    </div>
  );
};
