'use client';

import { EmailModal } from '../../../../../shared/components/EmailModal';
import GuestSummaryStats from '../../../../../shared/components/guest-management/GuestSummaryStats';
import { useGuestManager } from '../hooks/useGuestManager';
import { getGuestColumns } from '@shared/columns/guest-columns';
import {
  Button,
  DataTable,
  DeleteConfirmationModal,
  GroupSelectDropdown,
  PageHeader,
} from '@shared/components';
import FormField from '@shared/components/FormField';
import { FormDialog } from '@shared/components/ui/form/form-dialog';
import { Input } from '@shared/components/ui/form/input';
import { SingleSelectDropdown } from '@shared/components/ui/form/singleSelectDropdown';
import { ConfirmationStatus, CreateGuestDto } from '@wedding/api-types';
import { Plus, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function GuestManagementPage() {
  const {
    // Core data
    guests,
    primaryGuests,
    existingGroups,
    isLoading,

    // Modal states
    editingGuest,
    deleteConfirmGuest,
    isSubmitting,
    emailModalGuest,

    // Form data
    setEditingGuest,

    // Form field management
    addAccompanyingGuestField,
    removeAccompanyingGuestField,
    updateAccompanyingGuestName,

    // Handlers
    handleUpdateGuest,
    confirmDeleteGuest,
    handleEditGuest,

    // Modal controls
    closeEditGuestModal,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
    closeEmailModal,
  } = useGuestManager();

  // Column definitions for DataTable using shared columns
  const columns = getGuestColumns({
    guests,
    onEditGuest: handleEditGuest,
    onDeleteGuest: openDeleteConfirmModal,
    includeEmail: true,
    showConfirmationIcon: true,
    detailedAccompanyingGuests: true,
  });

  // Add/Edit Guest Form Fields
  const guestFormFields = (
    guest: Partial<CreateGuestDto & { id?: number }>,
    setGuest: React.Dispatch<React.SetStateAction<Partial<CreateGuestDto & { id?: number }>>>,
  ) => [
    <div key="name" className="md:col-span-2">
      <FormField
        label="Name *"
        id="name"
        type="text"
        value={guest.name || ''}
        onChange={(e) => setGuest({ ...guest, name: e.target.value })}
        required
        placeholder="Guest Name"
      />
    </div>,

    <div key="group" className="md:col-span-2">
      <GroupSelectDropdown
        label="Group *"
        existingGroups={existingGroups}
        selected={guest.group || ''}
        setSelected={(group) => setGuest({ ...guest, group })}
        placeholder="Select or add group"
      />
    </div>,

    <div key="email" className="md:col-span-2">
      <FormField
        label="Email *"
        id="email"
        type="email"
        value={guest.email || ''}
        onChange={(e) => setGuest({ ...guest, email: e.target.value })}
        required
        placeholder="Guest email address"
      />
    </div>,

    <div key="allergies" className="md:col-span-2">
      <FormField
        label="Dietary Requirements"
        id="allergies"
        type="text"
        value={guest.allergies || ''}
        onChange={(e) => setGuest({ ...guest, allergies: e.target.value })}
        placeholder="Vegetarian, Gluten-Free, etc."
      />
    </div>,

    <div key="confirmationStatus" className="md:col-span-2">
      <SingleSelectDropdown
        label="Confirmation Status"
        options={Object.values(ConfirmationStatus)}
        selected={guest.confirmationStatus || ConfirmationStatus.PENDING}
        setSelected={(selected) =>
          setGuest({
            ...guest,
            confirmationStatus: selected as ConfirmationStatus,
          })
        }
        placeholder="Select confirmation status"
      />
    </div>,

    <div key="accompanyingGuests" className="md:col-span-2">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-foreground">Accompanying Guests</label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addAccompanyingGuestField(guest, setGuest)}
          className="text-brand-600 hover:text-brand-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Guest
        </Button>
      </div>
      <div className="space-y-2">
        {(guest.accompanyingGuestNames || ['']).map((name: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateAccompanyingGuestName(index, e.target.value, guest, setGuest)
              }
              placeholder={`Accompanying guest ${index + 1}`}
              className="flex-1"
            />
            {(guest.accompanyingGuestNames?.length || 0) > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAccompanyingGuestField(index, guest, setGuest)}
                className="text-red-600 hover:text-red-700 px-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="w-full max-w-full px-4 py-8 min-w-0 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <PageHeader title="Guest Management" description="Manage guests across all weddings" />
      </div>

      {/* Edit Guest Modal */}
      {editingGuest && (
        <FormDialog
          open={!!editingGuest}
          onOpenChange={closeEditGuestModal}
          title="Edit Guest"
          isSubmitting={isSubmitting}
          onSubmit={handleUpdateGuest}
          onCancel={closeEditGuestModal}
          submitButtonText="Update Guest"
          formFields={guestFormFields(
            {
              ...editingGuest!,
              confirmationStatus:
                editingGuest!.confirmationStatus === ConfirmationStatus.PENDING
                  ? ConfirmationStatus.PENDING
                  : editingGuest!.confirmationStatus === ConfirmationStatus.CONFIRMED
                    ? ConfirmationStatus.CONFIRMED
                    : ConfirmationStatus.REJECTED,
              accompanyingGuestNames: editingGuest!.accompanyingGuests?.map((ag) => ag.name) || [
                '',
              ],
            },
            setEditingGuest as React.Dispatch<
              React.SetStateAction<
                Partial<CreateGuestDto & { id?: number; accompanyingGuestNames?: string[] }>
              >
            >,
          )}
          noOfColumns={2}
        />
      )}

      <div className="flex-shrink-0 mb-6">
        <GuestSummaryStats
          guests={guests.map((guest) => ({
            ...guest,
            confirmationStatus:
              guest.confirmationStatus === ConfirmationStatus.PENDING
                ? ConfirmationStatus.PENDING
                : guest.confirmationStatus === ConfirmationStatus.CONFIRMED
                  ? ConfirmationStatus.CONFIRMED
                  : ConfirmationStatus.REJECTED,
          }))}
        />
      </div>

      {/* Guest List Table */}
      <div className="w-full">
        <DataTable
          data={primaryGuests.map((guest) => ({
            ...guest,
            email: guest.email || '',
          }))}
          columns={columns}
          searchableColumns={[{ id: 'name', placeholder: 'Search by name...' }]}
          enableSelection={false}
          enableColumnVisibility={true}
          enablePagination={true}
          defaultPageSize={10}
          title={`Guests (${guests.length})`}
          isLoading={isLoading}
          loadingMessage="Loading guests..."
          emptyMessage="No guests added yet."
          emptyDescription='Click "Add Guest" to get started!'
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deleteConfirmGuest}
        onOpenChange={closeDeleteConfirmModal}
        itemName={deleteConfirmGuest?.name || 'this guest'}
        description={
          deleteConfirmGuest && (
            <>
              Are you sure you want to delete {deleteConfirmGuest.name}?
              {(() => {
                const accompanyingCount = guests.filter(
                  (g) => g.primaryGuestId === deleteConfirmGuest?.id,
                ).length;
                return accompanyingCount > 0
                  ? ` This will also delete ${accompanyingCount} accompanying guest${accompanyingCount === 1 ? '' : 's'}.`
                  : '';
              })()}{' '}
              This action cannot be undone.
            </>
          )
        }
        onConfirm={confirmDeleteGuest}
        onCancel={closeDeleteConfirmModal}
      />

      {/* Email Guest Modal */}
      {emailModalGuest && (
        <EmailModal
          open={!!emailModalGuest}
          onOpenChange={closeEmailModal}
          name={emailModalGuest.name}
          email={emailModalGuest.email}
        />
      )}
    </div>
  );
}
