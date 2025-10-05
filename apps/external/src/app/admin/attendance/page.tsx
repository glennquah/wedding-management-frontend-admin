'use client';

import { ConfirmationStatus, CreateGuestDto, GuestsService, GuestResponseDto } from '@shared/api';
import {
  Button,
  DataTable,
  DeleteConfirmationModal,
  GroupSelectDropdown,
  PageHeader,
} from '@shared/components';
import { EmailModal } from '@shared/components/EmailModal';
import FormField from '@shared/components/FormField';
import { FormDialog } from '@shared/components/ui/form/form-dialog';
import { SingleSelectDropdown } from '@shared/components/ui/form/singleSelectDropdown';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useGuestManager } from '../../hooks/useGuestManager';
import { getAttendanceColumns } from './components/attendance-columns';

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
  const router = useRouter();
  const isMobile = useIsMobileScreen();
  const {
    // Core data
    guests,
    wedding,
    primaryGuests,
    existingGroups,
    isLoading,

    // Capacity management
    getGuestCapacityInfo,

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

    // CRUD operations
    fetchGuests,

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
  } = useGuestManager();

  // Get capacity information
  const capacityInfo = getGuestCapacityInfo();

  // Filter to only show confirmed guests (both primary and accompanying)
  const confirmedGuests = guests.filter(
    (guest) => guest.confirmationStatus === ConfirmationStatus.CONFIRMED,
  );

  const confirmedPrimaryGuests = primaryGuests.filter(
    (guest) => guest.confirmationStatus === ConfirmationStatus.CONFIRMED,
  );

  // State for tracking attendance changes
  const [attendanceChanges, setAttendanceChanges] = useState<Set<number>>(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isApplyingChanges, setIsApplyingChanges] = useState(false);

  // Handler to toggle attendance locally (without backend call)
  const handleToggleAttendance = (guest: GuestResponseDto) => {
    setAttendanceChanges((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(guest.id)) {
        newSet.delete(guest.id);
      } else {
        newSet.add(guest.id);
      }
      return newSet;
    });
  };

  // Handler to apply attendance changes
  const handleApplyChanges = async () => {
    setIsApplyingChanges(true);
    try {
      // Call backend for each guest with attendance change
      await Promise.all(
        Array.from(attendanceChanges).map((guestId) =>
          GuestsService.guestControllerMarkAttendance(guestId)
        )
      );
      // Clear changes and close dialog
      setAttendanceChanges(new Set());
      setShowConfirmDialog(false);
      // Refetch guests to show updated attendance
      await fetchGuests();
    } catch (error) {
      console.error('Failed to apply attendance changes:', error);
    } finally {
      setIsApplyingChanges(false);
    }
  };

  // Check if guest has pending attendance change
  const hasAttendanceChange = (guestId: number) => attendanceChanges.has(guestId);

  // Column definitions for DataTable using attendance columns
  const columns = getAttendanceColumns({
    guests: confirmedGuests,
    onEditGuest: handleEditGuest,
    onDeleteGuest: openDeleteConfirmModal,
    onToggleAttendance: handleToggleAttendance,
    hasAttendanceChange,
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
          disabled={capacityInfo.isAtCapacity}
          title={capacityInfo.isAtCapacity ? 'Guest limit reached' : 'Add accompanying guest'}
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
          disabled={capacityInfo.isAtCapacity}
          title={capacityInfo.isAtCapacity ? 'Guest limit reached' : 'Add accompanying guest'}
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
      {!isMobile && <div className="mt-6 w-full"></div>}

      <div className="container mx-auto px-4 pt-4 md:pt-6">
        <PageHeader
          title="Attendance"
          description={
            wedding
              ? `Manage your wedding guests attendance (${capacityInfo.current}/${capacityInfo.limit} guests)\nOnly confirmed guests will be in the list.`
              : 'Manage your wedding guests attendance\nOnly confirmed guests will be in the list.'
          }
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-transparent border-brand-200 rounded-lg border p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-brand-600">
              {confirmedGuests.length}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Total Confirmed Guests</div>
          </div>
          <div className="bg-transparent border-brand-200 rounded-lg border p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {confirmedGuests.filter((g) => g.attendance).length}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Present (Marked)</div>
          </div>
          <div className="bg-transparent border-brand-200 rounded-lg border p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {confirmedGuests.filter((g) => !g.attendance).length}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Not Present (Unmarked)</div>
          </div>
        </div>

        {/* Apply Changes Button */}
        {attendanceChanges.size > 0 && (
          <div className="mb-4 flex justify-end">
            <Button
              onClick={() => setShowConfirmDialog(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white"
            >
              Apply Changes ({attendanceChanges.size})
            </Button>
          </div>
        )}

        {/* Guest List Table */}
        <DataTable
          data={confirmedPrimaryGuests}
          columns={columns}
          searchableColumns={[{ id: 'name', placeholder: 'Search by name...' }]}
          enableSelection={false}
          enableColumnVisibility={true}
          enablePagination={true}
          defaultPageSize={10}
          title={`Confirmed Guests (${confirmedGuests.length})`}
          isLoading={isLoading}
          loadingMessage="Loading guests..."
          emptyMessage="No confirmed guests yet."
          emptyDescription="Guests will appear here once they confirm their attendance."
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
          />
        )}

        {/* Confirm Apply Changes Modal */}
        <DeleteConfirmationModal
          open={showConfirmDialog}
          onOpenChange={() => setShowConfirmDialog(false)}
          itemName="attendance changes"
          description={`Are you sure you want to mark attendance for ${attendanceChanges.size} guest${attendanceChanges.size === 1 ? '' : 's'}?`}
          onConfirm={handleApplyChanges}
          onCancel={() => setShowConfirmDialog(false)}
          confirmButtonText={isApplyingChanges ? 'Applying...' : 'Confirm'}
        />
      </div>
    </div>
  );
}
