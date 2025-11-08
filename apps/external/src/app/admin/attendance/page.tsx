'use client';

import { ConfirmationStatus } from '@shared/api';
import { Button, DataTable, DeleteConfirmationModal, PageHeader } from '@shared/components';
import { EmailModal } from '@shared/components/EmailModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import { FormDialog } from '@shared/components/ui/form/form-dialog';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { Download, QrCode } from 'lucide-react';
import Image from 'next/image';
import QRCode from 'qrcode';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useGuestManager } from '../../hooks/useGuestManager';
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

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);

  // Guest management hook
  const {
    guests,
    wedding,
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

  const handleGenerateQrClick = async () => {
    if (!wedding || !wedding.id) {
      toast.error('Wedding data is not loaded yet.');
      return;
    }

    setIsLoadingQr(true);

    try {
      const fullUrl = `${window.location.origin}/self-attendance/${wedding.id}`;

      // generate the QR code
      const dataUrl = await QRCode.toDataURL(fullUrl, {
        width: 256,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });

      setQrCodeDataUrl(dataUrl);
      setIsQrModalOpen(true);
    } catch (err) {
      console.error('Failed to generate QR code', err);
      toast.error('Failed to generate QR code. Please try again.');
    } finally {
      setIsLoadingQr(false);
    }
  };

  const handleDownloadQr = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeDataUrl;

    link.download = 'wedding-attendance-qr.png';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Memoized capacity information
  const capacityInfo = useMemo(() => getGuestCapacityInfo(), [getGuestCapacityInfo]);

  // Memoized filtered guest lists
  const confirmedGuests = useMemo(
    () => guests.filter((guest) => guest.confirmationStatus === ConfirmationStatus.CONFIRMED),
    [guests],
  );

  // Attendance management hook
  const {
    attendanceChanges,
    showConfirmDialog,
    isApplyingChanges,
    handleToggleAttendance,
    hasAttendanceChange,
    handleApplyChanges,
    openConfirmDialog,
    closeConfirmDialog,
  } = useAttendanceManager(confirmedGuests, fetchGuests);

  // Memoized column definitions
  const columns = useMemo(
    () =>
      getAttendanceColumns({
        onToggleAttendance: handleToggleAttendance,
        hasAttendanceChange,
      }),
    [handleToggleAttendance, hasAttendanceChange],
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

  const editGuestFormFields = useEditGuestFormFields(
    editingGuest || ({} as GuestFormData),
    setEditingGuest as React.Dispatch<React.SetStateAction<GuestFormData>>,
    existingGroups,
    capacityInfo,
    addAccompanyingGuestField,
    removeAccompanyingGuestField,
    updateAccompanyingGuest,
  );

  // Memoized statistics
  const attendanceStats = useMemo(
    () => calculateAttendanceStats(confirmedGuests),
    [confirmedGuests],
  );

  // Memoized page description
  const pageDescription = useMemo(() => {
    if (wedding) {
      return ATTENDANCE_MESSAGES.DESCRIPTION_WITH_CAPACITY(
        capacityInfo.current,
        capacityInfo.limit,
      );
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
    <div className="to-brand-100 text-foreground min-h-screen w-full bg-gradient-to-b from-white">
      {!isMobile && <div className="mt-6 w-full"></div>}

      <div className="container mx-auto px-4 pt-4 md:pt-6">
        <PageHeader
          title={ATTENDANCE_MESSAGES.TITLE}
          description={pageDescription}
          buttonText="Attendance QR"
          onButtonClick={handleGenerateQrClick}
          isButtonDisabled={isLoading || isSubmitting || isLoadingQr}
          buttonIcon={<QrCode className="h-4 w-4" />}
        />

        {/* Attendance QR Code Modal */}
        <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Scan for Self-Attendance</DialogTitle>
              <DialogDescription>
                Scan this code with your phone&apos;s camera to check in and find your table.
                We&apos;re so excited you&apos;re here!
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center p-4">
              {qrCodeDataUrl ? (
                <Image src={qrCodeDataUrl} alt="Self-attendance QR Code" width={256} height={256} />
              ) : (
                <p>Generating QR Code...</p>
              )}
            </div>

            <DialogFooter className="sm:justify-center">
              <Button type="button" onClick={handleDownloadQr} disabled={!qrCodeDataUrl}>
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
            <Button onClick={openConfirmDialog}>
              {BUTTON_LABELS.APPLY_CHANGES(attendanceChanges.size)}
            </Button>
          </div>
        )}

        {/* Guest List Table */}
        <DataTable
          data={confirmedGuests}
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
          title="Confirm Changes"
          itemName="attendance changes"
          description={ATTENDANCE_MESSAGES.APPLY_CHANGES_CONFIRMATION(attendanceChanges.size)}
          onConfirm={handleApplyChanges}
          onCancel={closeConfirmDialog}
          confirmButtonText={isApplyingChanges ? BUTTON_LABELS.APPLYING : BUTTON_LABELS.CONFIRM}
        />
      </div>
    </div>
  );
}
