'use client';

import { useEffect, useMemo, useState } from 'react';

import { GuestCountBucket as SeatingGuestCountBucket } from '../../../lib/seating';
import { useGuestManager } from '../../hooks/useGuestManager';
import { useSeatingManager } from '../../hooks/useSeatingManager';
import { useWeddingManager } from '../../hooks/useWeddingManager';
import { useWeddingStore } from '../../store/sessionStore';
import { PriorityRankingDialog } from './components/PriorityRankingDialog';
import { SeatingVisualization } from './components/SeatingVisualization';
import { ConfirmationStatus, GuestCountBucket } from '@shared/api';
import { PageHeader } from '@shared/components';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { Settings2 } from 'lucide-react';

// Mapping from API GuestCountBucket to Seating GuestCountBucket
const mapGuestCountBucket = (bucket: GuestCountBucket): SeatingGuestCountBucket => {
  switch (bucket) {
    case GuestCountBucket.SMALL:
      return SeatingGuestCountBucket.SMALL;
    case GuestCountBucket.MEDIUM:
      return SeatingGuestCountBucket.MEDIUM;
    case GuestCountBucket.LARGE:
      return SeatingGuestCountBucket.LARGE;
    default:
      return SeatingGuestCountBucket.SMALL;
  }
};

export default function SeatingArrangementPage() {
  const isMobile = useIsMobileScreen();
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);

  const { guests } = useGuestManager();
  const { wedding, isLoading: isLoadingWedding } = useWeddingManager();
  const selectedWeddingId = useWeddingStore((state) => state.selectedWeddingId);
  const {
    guestCountBucket,
    setGuestCountBucket,
    layout,
    seatingResult,
    seatingArrangement,
    isOptimizing,
    isLoadingLayout,
    optimizeSeating,
    loadLayout,
    loadSeatingArrangementWithLayout,
    saveGroupPriorities,
    moveGuest,
  } = useSeatingManager(selectedWeddingId!);

  // Get group priorities from seating arrangement or initialize empty
  const groupPriorities = seatingArrangement?.groupPriorities || null;

  // Filter confirmed guests only
  const confirmedGuests = guests.filter(
    (guest) => guest.confirmationStatus === ConfirmationStatus.CONFIRMED,
  );

  // Separate primary and accompanying confirmed guests for clarity
  const confirmedPrimaryGuests = confirmedGuests.filter((guest) => !guest.primaryGuestId);
  const confirmedAccompanyingGuests = confirmedGuests.filter((guest) => guest.primaryGuestId);

  // Calculate stats
  const totalConfirmed = confirmedGuests.length;
  const availableSeats = layout ? layout.tables.length * 10 : 0;

  const { guestRequests, orphanedAccompanyingGuests, primaryRequestsById } = useMemo(() => {
    const primaryGuestIds = new Set(confirmedPrimaryGuests.map((g) => g.id));
    const accompanyingMap = confirmedAccompanyingGuests.reduce<Record<number, string[]>>(
      (acc, guest) => {
        const primaryId = guest.primaryGuestId;
        if (primaryId && primaryGuestIds.has(primaryId)) {
          if (!acc[primaryId]) {
            acc[primaryId] = [];
          }
          acc[primaryId].push(guest.name);
        }
        return acc;
      },
      {},
    );

    const orphaned = confirmedAccompanyingGuests.filter(
      (guest) => guest.primaryGuestId && !primaryGuestIds.has(guest.primaryGuestId),
    );

    const primaryRequests = confirmedPrimaryGuests.map((guest) => ({
      name: guest.name,
      group: guest.group || 'Others',
      plus_ones: accompanyingMap[guest.id] || [],
    }));

    const primaryRequestMap: Record<number, (typeof primaryRequests)[number]> = {};
    confirmedPrimaryGuests.forEach((guest, index) => {
      primaryRequestMap[guest.id] = primaryRequests[index];
    });

    const orphanedRequests = orphaned.map((guest) => ({
      name: guest.name,
      group: guest.group || 'Others',
      plus_ones: [],
    }));

    const allRequests = [...primaryRequests, ...orphanedRequests];
    const seats = allRequests.reduce((sum, req) => sum + 1 + req.plus_ones.length, 0);

    return {
      guestRequests: allRequests,
      totalSeatCount: seats,
      orphanedAccompanyingGuests: orphaned,
      accompanyingByPrimary: accompanyingMap,
      primaryRequestsById: primaryRequestMap,
    };
  }, [confirmedPrimaryGuests, confirmedAccompanyingGuests]);

  // Auto-set guest count bucket from wedding data and load seating arrangement with layout
  useEffect(() => {
    if (wedding?.guestCountBucket && !guestCountBucket) {
      const mappedBucket = mapGuestCountBucket(wedding.guestCountBucket);
      setGuestCountBucket(mappedBucket);
      // Load both seating arrangement and layout together to ensure proper visualization
      loadSeatingArrangementWithLayout(mappedBucket);
    }
  }, [wedding, guestCountBucket, setGuestCountBucket, loadSeatingArrangementWithLayout]);

  // Auto-load layout when guest count bucket is available (fallback for when no seating arrangement exists)
  useEffect(() => {
    if (guestCountBucket && !seatingArrangement) {
      loadLayout(guestCountBucket);
    }
  }, [guestCountBucket, loadLayout, seatingArrangement]);

  const handleOptimizeSeating = async () => {
    if (!guestCountBucket || confirmedPrimaryGuests.length === 0) return;

    // Always show priority dialog when generate seating is clicked
    setShowPriorityDialog(true);
  };

  const handlePrioritySet = async (priorities: Record<string, number>) => {
    try {
      await saveGroupPriorities(priorities);
      setShowPriorityDialog(false);

      if (!guestCountBucket) return;

      if (orphanedAccompanyingGuests.length > 0) {
        // Check what happened to their primary guests
        const orphanedPrimaryIds = [
          ...new Set(orphanedAccompanyingGuests.map((g) => g.primaryGuestId)),
        ];
        orphanedPrimaryIds.forEach((primaryId) => {
          guests.find((g) => g.id === primaryId);
        });
      }

      // Also check if any primary guests have no accompanying guests when they should
      confirmedPrimaryGuests.forEach((primaryGuest) => {
        const req = primaryRequestsById[primaryGuest.id];
        if (!req) {
          return;
        }
      });

      const request = {
        guests: guestRequests,
        guest_count_bucket: guestCountBucket,
        group_priorities: priorities,
      };

      await optimizeSeating(request);
    } catch (error) {
      console.error('Error saving priorities:', error);
      // You might want to show a toast notification here
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
      {!isMobile && <div className="mt-6 w-full"></div>}

      <div className="container mx-auto px-4 pt-4 md:pt-6 pb-8">
        <PageHeader
          title="Seating Arrangement"
          description="Generate optimal seating arrangements for your wedding guests"
          buttonText="Generate Seating"
          onButtonClick={handleOptimizeSeating}
          buttonIcon={<Settings2 className="w-4 h-4" />}
          isButtonDisabled={
            isOptimizing ||
            !guestCountBucket ||
            confirmedPrimaryGuests.length === 0 ||
            isLoadingLayout ||
            isLoadingWedding
          }
        />

        {/* Seating Visualization */}
        {layout && (
          <SeatingVisualization
            layout={layout}
            seatingResult={seatingResult}
            isLoading={isOptimizing || isLoadingLayout}
            onGuestMove={moveGuest}
          />
        )}

        {/* Warnings and Info Messages */}
        {totalConfirmed > availableSeats && availableSeats > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              ⚠️ Warning: You have {totalConfirmed} confirmed guests but only {availableSeats}{' '}
              available seats. Consider upgrading your guest count bucket or adjusting your guest
              list.
            </p>
          </div>
        )}

        {confirmedPrimaryGuests.length === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ℹ️ No confirmed guests found. Make sure to confirm your guests in the Guest List page
              first.
            </p>
          </div>
        )}

        {/* Priority Ranking Dialog */}
        <PriorityRankingDialog
          open={showPriorityDialog}
          guests={confirmedGuests}
          currentPriorities={groupPriorities}
          onSave={handlePrioritySet}
          onClose={() => setShowPriorityDialog(false)}
        />
      </div>
    </div>
  );
}
