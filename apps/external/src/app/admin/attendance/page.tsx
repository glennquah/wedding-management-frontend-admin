'use client';

import { ConfirmationStatus } from '@shared/api';
import { Button, DataTable, DeleteConfirmationModal, PageHeader } from '@shared/components';
import { EmailModal } from '@shared/components/EmailModal';
import { FormDialog } from '@shared/components/ui/form/form-dialog';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import React, { useMemo } from 'react';
import { useGuestManager } from '../../hooks/useGuestManager';
import { AccompanyingGuestAttendanceDialog } from './components/accompanying-guest-attendance-dialog';
import { getAttendanceColumns } from './components/attendance-columns';
import { AttendanceStats } from './components/AttendanceStats';
import { useAddGuestFormFields, useEditGuestFormFields } from './components/GuestFormFields';
import {
  ATTENDANCE_MESSAGES,
  ATTENDANCE_PAGE_CONSTANTS,
  BUTTON_LABELS,
  DIALOG_TITLES,
} from './constants';
import { useAttendanceManager } from './hooks/useAttendanceManager';
import { GuestFormData } from './types';
import { calculateAttendanceStats, getAccompanyingGuestCount } from './utils';

export default function GuestListPage() {
  const isMobile = useIsMobileScreen();

  // Guest management hook
  const {
    guests,
    wedding,
    primaryGuests,
    existingGroups,
    isLoading,
    getGuestCapacityInfo,
    isAddingGuest,
    editingGuest,
    deleteConfirmGuest,
    isSubmitting,
    emailModalGuest,
    newGuest,
    setNewGuest,
    setEditingGuest,
    addAccompanyingGuestField,
    removeAccompanyingGuestField,
    updateAccompanyingGuest,
    fetchGuests,
    handleAddGuest,
    handleUpdateGuest,
    confirmDeleteGuest,
    closeAddGuestModal,
    closeEditGuestModal,
    closeDeleteConfirmModal,
    closeEmailModal,
  } = useGuestManager();

  // Memoized capacity information
  const capacityInfo = useMemo(() => getGuestCapacityInfo(), [getGuestCapacityInfo]);

  // Memoized filtered guest lists
  const confirmedGuests = useMemo(
    () => guests.filter((guest) => guest.confirmationStatus === ConfirmationStatus.CONFIRMED),
    [guests],
  );

  const confirmedPrimaryGuests = useMemo(
    () => primaryGuests.filter((guest) => guest.confirmationStatus === ConfirmationStatus.CONFIRMED),
    [primaryGuests],
  );

  // Attendance management hook
  const {
    attendanceChanges,
    showConfirmDialog,
    isApplyingChanges,
    accompanyingGuestDialog,
    handleToggleAttendance,
    hasAttendanceChange,
    handleApplyChanges,
    handleOpenAccompanyingGuestDialog,
    handleCloseAccompanyingGuestDialog,
    handleApplyAccompanyingGuestChanges,
    openConfirmDialog,
    closeConfirmDialog,
  } = useAttendanceManager(confirmedGuests, fetchGuests);

  // Memoized column definitions
  const columns = useMemo(
    () =>
      getAttendanceColumns({
        guests: confirmedGuests,
        onToggleAttendance: handleToggleAttendance,
        hasAttendanceChange,
        onOpenAccompanyingGuestDialog: handleOpenAccompanyingGuestDialog,
      }),
    [confirmedGuests, handleToggleAttendance, hasAttendanceChange, handleOpenAccompanyingGuestDialog],
  );

  // Memoized form fields
  const addGuestFormFields = useAddGuestFormFields(
    newGuest,
    setNewGuest,
    existingGroups,
    capacityInfo,
    addAccompanyingGuestField,
    removeAccompanyingGuestField,
    updateAccompanyingGuest,
  );

  const editGuestFormFields = editingGuest
    ? useEditGuestFormFields(
        editingGuest,
        setEditingGuest as React.Dispatch<React.SetStateAction<GuestFormData>>,
        existingGroups,
        capacityInfo,
        addAccompanyingGuestField,
        removeAccompanyingGuestField,
        updateAccompanyingGuest,
      )
    : [];

  // Memoized statistics
  const attendanceStats = useMemo(
    () => calculateAttendanceStats(confirmedGuests),
    [confirmedGuests],
  );

  // Memoized page description
  const pageDescription = useMemo(() => {
    if (wedding) {
      return ATTENDANCE_MESSAGES.DESCRIPTION_WITH_CAPACITY(capacityInfo.current, capacityInfo.limit);
    }
    return ATTENDANCE_MESSAGES.DESCRIPTION_WITHOUT_CAPACITY;
  }, [wedding, capacityInfo]);

  // Memoized delete confirmation message
  const deleteConfirmationMessage = useMemo(() => {
    if (!deleteConfirmGuest) return '';
    const accompanyingCount = getAccompanyingGuestCount(guests, deleteConfirmGuest.id);
    return ATTENDANCE_MESSAGES.DELETE_CONFIRMATION(deleteConfirmGuest.name, accompanyingCount);
  }, [deleteConfirmGuest, guests]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
      {!isMobile && <div className="mt-6 w-full"></div>}

      <div className="container mx-auto px-4 pt-4 md:pt-6">
        <PageHeader title={ATTENDANCE_MESSAGES.TITLE} description={pageDescription} />

        {/* Add Guest Modal */}
        <FormDialog
          open={isAddingGuest}
          onOpenChange={closeAddGuestModal}
          title={DIALOG_TITLES.ADD_GUEST}
          isSubmitting={isSubmitting}
          onSubmit={handleAddGuest}
          onCancel={closeAddGuestModal}
          submitButtonText={BUTTON_LABELS.ADD_GUEST}
          formFields={addGuestFormFields}
          noOfColumns={2}
        />

        {/* Edit Guest Modal */}
        {editingGuest && (
          <FormDialog
            open={!!editingGuest}
            onOpenChange={closeEditGuestModal}
            title={DIALOG_TITLES.EDIT_GUEST}
            isSubmitting={isSubmitting}
            onSubmit={handleUpdateGuest}
            onCancel={closeEditGuestModal}
            submitButtonText={BUTTON_LABELS.UPDATE_GUEST}
            formFields={editGuestFormFields}
            noOfColumns={2}
          />
        )}

        {/* Summary Stats */}
        <AttendanceStats stats={attendanceStats} />

        {/* Apply Changes Button */}
        {attendanceChanges.size > 0 && (
          <div className="mb-4 flex justify-end">
            <Button onClick={openConfirmDialog} className="bg-brand-600 hover:bg-brand-700 text-white">
              {BUTTON_LABELS.APPLY_CHANGES(attendanceChanges.size)}
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
          defaultPageSize={ATTENDANCE_PAGE_CONSTANTS.DEFAULT_PAGE_SIZE}
          title={`Confirmed Guests (${confirmedGuests.length})`}
          isLoading={isLoading}
          loadingMessage={ATTENDANCE_MESSAGES.LOADING}
          emptyMessage={ATTENDANCE_MESSAGES.EMPTY_MESSAGE}
          emptyDescription={ATTENDANCE_MESSAGES.EMPTY_DESCRIPTION}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={!!deleteConfirmGuest}
          onOpenChange={closeDeleteConfirmModal}
          itemName={deleteConfirmGuest?.name || 'this guest'}
          description={deleteConfirmationMessage}
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
          onOpenChange={closeConfirmDialog}
          itemName="attendance changes"
          description={ATTENDANCE_MESSAGES.APPLY_CHANGES_CONFIRMATION(attendanceChanges.size)}
          onConfirm={handleApplyChanges}
          onCancel={closeConfirmDialog}
          confirmButtonText={isApplyingChanges ? BUTTON_LABELS.APPLYING : BUTTON_LABELS.CONFIRM}
        />

        {/* Accompanying Guest Attendance Dialog */}
        <AccompanyingGuestAttendanceDialog
          open={accompanyingGuestDialog.open}
          onOpenChange={handleCloseAccompanyingGuestDialog}
          accompanyingGuests={accompanyingGuestDialog.guests}
          onApplyChanges={handleApplyAccompanyingGuestChanges}
          isApplying={isApplyingChanges}
        />
      </div>
    </div>
  );
}
