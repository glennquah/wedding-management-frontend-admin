'use client';

import { useEffect, useMemo, useState } from 'react';

import { useGuestManager } from '../../hooks/useGuestManager';
import { useSeatingManager } from '../../hooks/useSeatingManager';
import { useWeddingManager } from '../../hooks/useWeddingManager';
import { useSeatingExport } from './hooks/useSeatingExport';
import { PriorityRankingDialog } from './components/PriorityRankingDialog';
import { SeatingVisualization } from './components/SeatingVisualization';
import {
  ConfirmationStatus,
  GuestCountBucket,
  GuestCountBucket as SeatingGuestCountBucket,
} from '@shared/api';
import { PageHeader } from '@shared/components';
import { Button } from '@shared/components/ui/button';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { Settings2, FileDown, Loader2 } from 'lucide-react';

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
  const {
    guestCountBucket,
    setGuestCountBucket,
    tablesPerRow,
    layout,
    seatingResult,
    seatingArrangement,
    isOptimizing,
    isLoadingLayout,
    optimizeSeating,
    loadLayout,
    saveGroupPriorities,
    moveGuest,
    swapTables,
  } = useSeatingManager();

  // Initialize export functionality
  const { exportToPDF, isExporting, canExport } = useSeatingExport({
    layout,
    seatingResult,
    weddingDetails: {
      coupleName: wedding?.name,
      date: wedding?.date ? new Date(wedding.date).toLocaleDateString() : undefined,
    },
  });

  const additionalActionsComponent = canExport && (
    <Button
      onClick={exportToPDF}
      disabled={isExporting}
      variant="outline"
      className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white"
      data-testid="export-pdf-button"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileDown className="w-4 h-4" />
      )}
      {isExporting ? 'Exporting...' : 'Export PDF'}
    </Button>
  );

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
  const availableSeats = layout ? layout.layout.tables.length * 10 : 0;

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

  // Auto-set guest count bucket from wedding data
  useEffect(() => {
    if (wedding?.guestCountBucket && !guestCountBucket) {
      const mappedBucket = mapGuestCountBucket(wedding.guestCountBucket);
      setGuestCountBucket(mappedBucket);
    }
  }, [wedding, guestCountBucket, setGuestCountBucket]);

  // Auto-load layout when guest count bucket or tables per row changes, with guards.
  useEffect(() => {
    if (guestCountBucket) {
      const isLargeBucket = guestCountBucket === SeatingGuestCountBucket.LARGE;

      if (!isLargeBucket || (isLargeBucket && tablesPerRow)) {
        loadLayout(guestCountBucket, tablesPerRow ?? undefined);
      }
    }
  }, [guestCountBucket, tablesPerRow, loadLayout]);

  const handleOptimizeSeating = async () => {
    if (!guestCountBucket || confirmedPrimaryGuests.length === 0) return;

    // Always show priority dialog when generate seating is clicked
    setShowPriorityDialog(true);
  };

  const handlePrioritySet = async (
    priorities: Record<string, number>,
    newTablesPerRow: number | null,
  ) => {
    try {
      await saveGroupPriorities(priorities, newTablesPerRow);

      setShowPriorityDialog(false);

      if (!guestCountBucket) return;

      // Only proceed to optimize seating if a valid number of tables per row has been selected.
      if (newTablesPerRow !== null) {
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
          tables_per_row: newTablesPerRow,
        };

        await optimizeSeating(request);
      }
    } catch (error) {
      console.error('Error saving priorities:', error);
    }
  };

  const handleTableSwap = async (sourceTableId: string, targetTableId: string) => {
    try {
      await swapTables(sourceTableId, targetTableId);
    } catch (error) {
      console.error('Error in table swap:', error);
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
          additionalActions={additionalActionsComponent}
        />

        {/* Seating Visualization */}
        {layout && (
          <SeatingVisualization
            layout={layout}
            seatingResult={seatingResult}
            isLoading={isOptimizing || isLoadingLayout}
            onGuestMove={moveGuest}
            onTableSwap={handleTableSwap}
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
          guestCountBucket={guestCountBucket}
          tablesPerRow={tablesPerRow}
          onSave={handlePrioritySet}
          onClose={() => setShowPriorityDialog(false)}
        />
      </div>
    </div>
  );
}
