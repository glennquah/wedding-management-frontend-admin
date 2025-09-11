'use client';

import { useGuestManager } from '../../../hooks/useCRUDGuests';
import { EmailGuestModal } from './components/EmailGuestModal';
import GuestSummaryStats from './components/GuestSummaryStats';
import { ConfirmationStatus, CreateGuestDto } from '@shared/api';
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
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { Plus, Trash2 } from 'lucide-react';

export default function GuestListPage() {
  const isMobile = useIsMobileScreen();
  const {
    // Core data
    guests,
    primaryGuests,
    existingGroups,
    isLoading,

    // Modal states
    isAddingGuest,
    editingGuest,
    deleteConfirmGuest,
    isSubmitting,
    emailModalGuest,

    // Form data
    newGuest,
    setNewGuest,
    setEditingGuest,

    // Form field management
    addAccompanyingGuestField,
    removeAccompanyingGuestField,
    updateAccompanyingGuestName,

    // Handlers
    handleAddGuest,
    handleUpdateGuest,
    confirmDeleteGuest,
    handleEditGuest,

    // Modal controls
    openAddGuestModal,
    closeAddGuestModal,
    closeEditGuestModal,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
    closeEmailModal,
    handleSendEmail,
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
        options={Object.values(CreateGuestDto.confirmationStatus)}
        selected={guest.confirmationStatus || CreateGuestDto.confirmationStatus.PENDING}
        setSelected={(selected) =>
          setGuest({
            ...guest,
            confirmationStatus: selected as CreateGuestDto.confirmationStatus,
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
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
      {!isMobile && <div className="mt-[72px] w-full"></div>}

      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Guest List"
          description="Manage your wedding guests and track RSVPs"
          buttonText="Add Guest"
          onButtonClick={openAddGuestModal}
          buttonIcon={<Plus className="w-4 h-4" />}
          isButtonDisabled={isLoading}
        />

        {/* Add Guest Modal */}
        <FormDialog
          open={isAddingGuest}
          onOpenChange={closeAddGuestModal}
          title="Add New Guest"
          isSubmitting={isSubmitting}
          onSubmit={handleAddGuest}
          onCancel={closeAddGuestModal}
          submitButtonText="Add Guest"
          formFields={guestFormFields(newGuest, setNewGuest)}
          noOfColumns={2}
        />

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
              editingGuest!,
              setEditingGuest as React.Dispatch<
                React.SetStateAction<
                  Partial<CreateGuestDto & { id?: number; accompanyingGuestNames?: string[] }>
                >
              >,
            )}
            noOfColumns={2}
          />
        )}

        {/* Summary Stats */}
        <GuestSummaryStats
          guests={guests.map((guest) => ({
            ...guest,
            confirmationStatus:
              guest.confirmationStatus === 'pending'
                ? ConfirmationStatus.PENDING
                : guest.confirmationStatus === 'confirmed'
                  ? ConfirmationStatus.CONFIRMED
                  : ConfirmationStatus.REJECTED,
          }))}
        />

        {/* Guest List Table */}
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
          <EmailGuestModal
            open={!!emailModalGuest}
            onOpenChange={closeEmailModal}
            guestName={emailModalGuest.name}
            guestEmail={emailModalGuest.email}
            onSendEmail={handleSendEmail}
          />
        )}
      </div>
    </div>
  );
}
