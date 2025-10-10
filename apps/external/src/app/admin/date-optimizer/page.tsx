'use client';

import { useState } from 'react';

import { useDateOptimizer } from '../../hooks/useDateOptimizer';
import { DatePreferencesCard } from './componenets/DatePreferencesCard';
import { DateRecommendationsSection } from './componenets/DateRecommendationsSection';
import { GuestSearchModal } from './componenets/GuestSearchModal';
import { KeyAttendeesCard } from './componenets/KeyAttendeesCard';
import { MainCoupleCalendarCard } from './componenets/MainCoupleCalendarCard';
import { Button, DeleteConfirmationModal, PageHeader } from '@shared/components';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { Clock } from 'lucide-react';

export default function DateOptimizerPage() {
  const isMobile = useIsMobileScreen();
  const [attendeeToDelete, setAttendeeToDelete] = useState<{ id: number; name: string } | null>(
    null,
  );

  const {
    // Data
    guests,
    keyAttendees,
    mainCouple,
    loading,
    hasRunAnalysis,
    preferredDays,
    dateRecommendations,
    earliestDate,
    latestDate,

    // Modal states
    isAddAttendeeModalOpen,

    // Handlers
    handleRunAnalysis,
    handleAddKeyAttendee,
    handleRemoveKeyAttendee,
    handleRequestCalendarAccess,
    setPreferredDays,
    setEarliestDate,
    setLatestDate,

    // Modal controls
    openAddAttendeeModal,
    closeAddAttendeeModal,
  } = useDateOptimizer();

  const handleDeleteClick = (attendee: { id: number; name: string }) => {
    setAttendeeToDelete(attendee);
  };

  const handleConfirmDelete = async () => {
    if (attendeeToDelete) {
      await handleRemoveKeyAttendee(attendeeToDelete.id);
      setAttendeeToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setAttendeeToDelete(null);
  };

  const handleDateChange = (newStartDate: string | undefined, newEndDate: string | undefined) => {
    const today = new Date().toISOString().split('T')[0];
    const finalStartDate = newStartDate || today;
    setEarliestDate(finalStartDate);
    setLatestDate(newEndDate || '');

    if (newEndDate && finalStartDate > newEndDate) {
      setLatestDate(finalStartDate);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
      {!isMobile && <div className="mt-6 w-full"></div>}

      <div className="container mx-auto px-4 pt-4 md:pt-6 pb-8">
        <PageHeader
          title="AI Date Optimizer"
          description="Find the perfect date for your wedding using AI-powered calendar analysis"
        />

        {/* Configuration Section */}
        <div className="grid gap-6 mb-6">
          <DatePreferencesCard
            earliestDate={earliestDate}
            latestDate={latestDate}
            preferredDays={preferredDays}
            onEarliestDateChange={setEarliestDate}
            onLatestDateChange={setLatestDate}
            onPreferredDaysChange={setPreferredDays}
          />

          <MainCoupleCalendarCard
            partners={mainCouple}
            onRequestAccess={(partner) => handleRequestCalendarAccess(partner, true)}
          />

          <KeyAttendeesCard
            attendees={keyAttendees}
            loading={loading}
            onRequestAccess={(attendee) => handleRequestCalendarAccess(attendee)}
            onRemoveClick={handleDeleteClick}
            onAddClick={openAddAttendeeModal}
          />
        </div>

        {/* Guest Search Modal */}
        <GuestSearchModal
          isOpen={isAddAttendeeModalOpen}
          onClose={closeAddAttendeeModal}
          guests={guests}
          onSelectGuest={handleAddKeyAttendee}
          excludedGuestIds={keyAttendees.map((a) => a.id)}
        />

        {/* Run Analysis Button */}
        <div className="flex justify-center mb-8">
          <Button size="lg" onClick={handleRunAnalysis} className="px-8">
            <Clock className="mr-2 h-5 w-5" />
            Run AI Analysis
          </Button>
        </div>

        <DateRecommendationsSection
          hasRunAnalysis={hasRunAnalysis}
          dateRecommendations={dateRecommendations}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={!!attendeeToDelete}
          onOpenChange={(open) => !open && handleCancelDelete()}
          title="Remove Key Attendee"
          itemName={attendeeToDelete?.name || ''}
          description={`Are you sure you want to remove ${attendeeToDelete?.name} from key attendees? Their calendar will be disconnected and will no longer be considered in the date analysis.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmButtonText="Remove"
        />
      </div>
    </div>
  );
}
