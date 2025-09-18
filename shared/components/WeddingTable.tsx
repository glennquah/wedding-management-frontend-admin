import React from 'react';

import { DataTable, DeleteConfirmationModal } from './index';
import { FormDialog } from './ui/form/form-dialog';
import { getWeddingColumns } from '@shared/columns/wedding-columns';
import { UpdateWeddingDto, WeddingResponseDto } from '@wedding/api-types';

interface WeddingTableProps {
  // Data
  weddings: WeddingResponseDto[];
  isLoading: boolean;

  // Edit Modal State
  isEditingWedding: boolean;
  editWedding: Partial<UpdateWeddingDto & { id?: number }>;
  setEditWedding: React.Dispatch<React.SetStateAction<Partial<UpdateWeddingDto & { id?: number }>>>;
  isSubmitting: boolean;

  // Delete Modal State
  deleteConfirmWedding: WeddingResponseDto | null;

  // Handlers
  onEditWedding: (wedding: WeddingResponseDto) => void;
  onDeleteWedding: (wedding: WeddingResponseDto) => void;
  handleEditWedding: () => Promise<void>;
  closeEditWeddingModal: () => void;
  confirmDeleteWedding: () => Promise<void>;
  closeDeleteConfirmModal: () => void;

  // Form fields for editing
  editFormFields: any[];
}

export const WeddingTable: React.FC<WeddingTableProps> = ({
  weddings,
  isLoading,
  isEditingWedding,
  isSubmitting,
  deleteConfirmWedding,
  onEditWedding,
  onDeleteWedding,
  handleEditWedding,
  closeEditWeddingModal,
  confirmDeleteWedding,
  closeDeleteConfirmModal,
  editFormFields,
}) => {
  const columns = getWeddingColumns({
    onEditWedding,
    onDeleteWedding,
  });

  return (
    <div className="flex flex-col">
      {/* Wedding List Table */}
      <div className="w-full">
        <DataTable
          data={weddings}
          columns={columns}
          searchableColumns={[
            { id: 'name', placeholder: 'Search by wedding name...' },
            { id: 'location', placeholder: 'Search by location...' },
          ]}
          enableSelection={false}
          enableColumnVisibility={true}
          enablePagination={true}
          defaultPageSize={10}
          title={`Weddings (${weddings.length})`}
          isLoading={isLoading}
          loadingMessage="Loading weddings..."
          emptyMessage="No weddings added yet."
          emptyDescription='Add a wedding using the "Add Wedding" button.'
        />
      </div>

      {/* Edit Wedding Modal */}
      <FormDialog
        open={isEditingWedding}
        onOpenChange={closeEditWeddingModal}
        title="Edit Wedding"
        isSubmitting={isSubmitting}
        onSubmit={handleEditWedding}
        onCancel={closeEditWeddingModal}
        submitButtonText="Update Wedding"
        formFields={editFormFields}
        noOfColumns={2}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deleteConfirmWedding}
        onOpenChange={closeDeleteConfirmModal}
        itemName={deleteConfirmWedding?.name || 'this wedding'}
        description={
          deleteConfirmWedding && (
            <>
              Are you sure you want to delete {deleteConfirmWedding.name}? This action cannot be
              undone and will permanently remove the wedding data and all associated information.
            </>
          )
        }
        onConfirm={confirmDeleteWedding}
        onCancel={closeDeleteConfirmModal}
      />
    </div>
  );
};
