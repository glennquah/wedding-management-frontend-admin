'use client';

import { useGuestManager } from '../../hooks/useGuestManager';
import { ConfirmationStatus, CreateGuestDto } from '@shared/api';
import { getGuestColumns } from '@shared/columns/guest-columns';
import {
  Button,
  DataTable,
  DeleteConfirmationModal,
  GroupSelectDropdown,
  PageHeader,
} from '@shared/components';
import { EmailModal } from '@shared/components/EmailModal';
import FormField from '@shared/components/FormField';
import GuestSummaryStats from '@shared/components/guest-management/GuestSummaryStats';
import { FormDialog } from '@shared/components/ui/form/form-dialog';
import { SingleSelectDropdown } from '@shared/components/ui/form/singleSelectDropdown';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { Plus, Trash2 } from 'lucide-react';

type AccompanyingGuestData = {
  name: string;
  allergies?: string;
  confirmationStatus: ConfirmationStatus;
};

type GuestFormData = Partial<CreateGuestDto> & {
  id?: number;
  accompanyingGuests?: AccompanyingGuestData[];
};

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
    updateAccompanyingGuest,

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

  // Add Guest Form Fields (without dietary requirements and confirmation status)
  const addGuestFormFields = (
    guest: GuestFormData,
    setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
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

    <div key="accompanyingGuests" className="md:col-span-2">
      <div className="flex justify-between items-center">
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
      <div className="space-y-4">
        {guest.accompanyingGuests &&
          guest.accompanyingGuests.map(
            (accompanyingGuest: AccompanyingGuestData, index: number) => (
              <div key={index} className="rounded-lg ">
                <div className="flex items-end gap-1">
                  <div className="flex-1">
                    <FormField
                      label="Name"
                      id={`accompanying-name-${index}`}
                      type="text"
                      value={accompanyingGuest.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateAccompanyingGuest(index, 'name', e.target.value, guest, setGuest)
                      }
                      placeholder={`Guest ${index + 1} name`}
                    />
                  </div>
                  {(guest.accompanyingGuests?.length || 0) > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAccompanyingGuestField(index, guest, setGuest)}
                      className="text-red-600 hover:text-red-700 px-2 mb-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ),
          )}
      </div>
    </div>,
  ];

  // Edit Guest Form Fields (with all fields including dietary requirements and confirmation status)
  const editGuestFormFields = (
    guest: GuestFormData,
    setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
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
      <div className="space-y-4">
        {guest.accompanyingGuests &&
          guest.accompanyingGuests.map(
            (accompanyingGuest: AccompanyingGuestData, index: number) => (
              <div key={index} className="rounded-lg ">
                <div className="flex items-center justify-end">
                  {(guest.accompanyingGuests?.length || 0) > 1 && (
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <FormField
                      label="Name"
                      id={`accompanying-name-${index}`}
                      type="text"
                      value={accompanyingGuest.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateAccompanyingGuest(index, 'name', e.target.value, guest, setGuest)
                      }
                      placeholder={`Guest ${index + 1} name`}
                    />
                  </div>
                  <div>
                    <FormField
                      label="Dietary Requirements"
                      id={`accompanying-allergies-${index}`}
                      type="text"
                      value={accompanyingGuest.allergies || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateAccompanyingGuest(index, 'allergies', e.target.value, guest, setGuest)
                      }
                      placeholder="Dietary requirements"
                    />
                  </div>
                  <div>
                    <SingleSelectDropdown
                      label="Confirmation Status"
                      options={Object.values(ConfirmationStatus)}
                      selected={accompanyingGuest.confirmationStatus || ConfirmationStatus.PENDING}
                      setSelected={(selected) =>
                        updateAccompanyingGuest(
                          index,
                          'confirmationStatus',
                          selected as ConfirmationStatus,
                          guest,
                          setGuest,
                        )
                      }
                      placeholder="Select status"
                      className="mt-4"
                    />
                  </div>
                </div>
              </div>
            ),
          )}
      </div>
    </div>,
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
      {!isMobile && <div className="mt-[72px] w-full"></div>}

      <div className="container mx-auto px-4 pt-4 md:pt-6">
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
          formFields={addGuestFormFields(newGuest, setNewGuest)}
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
            formFields={editGuestFormFields(
              editingGuest!,
              setEditingGuest as React.Dispatch<React.SetStateAction<GuestFormData>>,
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
          data={primaryGuests}
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
          <EmailModal
            open={!!emailModalGuest}
            onOpenChange={closeEmailModal}
            name={emailModalGuest.name}
            email={emailModalGuest.email}
            onSendEmail={handleSendEmail}
          />
        )}
      </div>
    </div>
  );
}
