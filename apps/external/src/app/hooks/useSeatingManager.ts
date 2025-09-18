import { useCallback, useEffect, useState } from 'react';

import {
  GuestCountBucket,
  HallLayout,
  SeatingAPI,
  SeatingArrangement,
  SeatingRequest,
  SeatingResult,
} from '../../lib/seating';

export function useSeatingManager(weddingId?: number) {
  const [guestCountBucket, setGuestCountBucket] = useState<GuestCountBucket | null>(null);
  const [layout, setLayout] = useState<HallLayout | null>(null);
  const [seatingResult, setSeatingResult] = useState<SeatingResult | null>(null);
  const [seatingArrangement, setSeatingArrangement] = useState<SeatingArrangement | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isLoadingLayout, setIsLoadingLayout] = useState(false);
  const [isLoadingArrangement, setIsLoadingArrangement] = useState(false);

  // Load existing seating arrangement when weddingId is available
  useEffect(() => {
    if (weddingId) {
      loadSeatingArrangement();
    }
  }, [weddingId]);

  const loadSeatingArrangement = useCallback(async () => {
    if (!weddingId) return;

    setIsLoadingArrangement(true);
    try {
      const arrangement = await SeatingAPI.getSeatingArrangement(weddingId);
      setSeatingArrangement(arrangement);

      // If arrangement exists and has tables, create seating result for visualization
      if (arrangement?.tables && arrangement.tables.length > 0) {
        const seatingMap: Record<number, string[]> = {};
        arrangement.tables.forEach((tableGuests, index) => {
          seatingMap[index + 1] = tableGuests; // index 0 = table 1, index 1 = table 2, etc.
        });

        setSeatingResult({
          success: true,
          message: 'Seating arrangement loaded from database',
          seating_arrangement: seatingMap,
        });
      }
    } catch (error) {
      console.error('Error loading seating arrangement:', error);
    } finally {
      setIsLoadingArrangement(false);
    }
  }, [weddingId]);

  const loadLayout = useCallback(
    async (bucket: GuestCountBucket) => {
      if (!bucket) return;

      setIsLoadingLayout(true);
      try {
        const layoutData = await SeatingAPI.getHallLayout(bucket);
        setLayout(layoutData);
      } catch (error) {
        console.error('Error loading layout:', error);
      } finally {
        setIsLoadingLayout(false);
      }
    },
    [weddingId],
  );

  const saveGroupPriorities = useCallback(
    async (priorities: Record<string, number>) => {
      if (!weddingId) return;

      try {
        if (seatingArrangement) {
          // Update existing arrangement
          const updated = await SeatingAPI.updateSeatingArrangement(weddingId, {
            groupPriorities: priorities,
          });
          setSeatingArrangement(updated);
        } else {
          // Try to create new arrangement, but handle case where one already exists
          try {
            const created = await SeatingAPI.createSeatingArrangement(weddingId, {
              groupPriorities: priorities,
            });
            setSeatingArrangement(created);
          } catch (createError) {
            // If creation fails due to existing arrangement (409), try to update instead
            if (createError instanceof Error && createError.message.includes('already exists')) {
              const updated = await SeatingAPI.updateSeatingArrangement(weddingId, {
                groupPriorities: priorities,
              });
              setSeatingArrangement(updated);
            } else {
              throw createError;
            }
          }
        }
      } catch (error) {
        console.error('Error saving group priorities:', error);
        throw error;
      }
    },
    [weddingId, seatingArrangement],
  );

  const optimizeSeating = useCallback(
    async (request: SeatingRequest) => {
      if (!weddingId) return;

      setIsOptimizing(true);
      setSeatingResult(null);

      try {
        // First, save/update group priorities
        await saveGroupPriorities(request.group_priorities);

        // Then optimize seating via FastAPI, using custom layout if available
        const customLayout = seatingArrangement?.customLayout;
        const result = await SeatingAPI.optimizeSeating(request);
        setSeatingResult(result);

        // If optimization was successful, save the tables
        if (result.success && result.seating_arrangement) {
          // Convert the seating_arrangement object to tables array
          const tables: string[][] = [];
          const sortedTableNumbers = Object.keys(result.seating_arrangement)
            .map(Number)
            .sort((a, b) => a - b);

          sortedTableNumbers.forEach((tableNumber) => {
            const tableIndex = tableNumber - 1; // table 1 -> index 0, table 2 -> index 1
            tables[tableIndex] = result.seating_arrangement![tableNumber];
          });

          // Save tables to database
          const updatedArrangement = await SeatingAPI.setTables(weddingId, tables);
          setSeatingArrangement(updatedArrangement);
        }
      } catch (error) {
        console.error('Error optimizing seating:', error);
        setSeatingResult({
          success: false,
          message: `Optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      } finally {
        setIsOptimizing(false);
      }
    },
    [weddingId, saveGroupPriorities],
  );

  // Function to load seating arrangement and ensure layout is loaded for visualization
  const loadSeatingArrangementWithLayout = useCallback(
    async (bucket: GuestCountBucket) => {
      if (!weddingId || !bucket) return;

      setIsLoadingArrangement(true);
      setIsLoadingLayout(true);

      try {
        // Load both the arrangement and layout in parallel
        const [arrangement, layoutData] = await Promise.all([
          SeatingAPI.getSeatingArrangement(weddingId),
          SeatingAPI.getHallLayout(bucket),
        ]);

        setSeatingArrangement(arrangement);
        setLayout(layoutData);

        // If arrangement exists and has tables, create seating result for visualization
        if (arrangement?.tables && arrangement.tables.length > 0) {
          const seatingMap: Record<number, string[]> = {};
          arrangement.tables.forEach((tableGuests, index) => {
            seatingMap[index + 1] = tableGuests; // index 0 = table 1, index 1 = table 2, etc.
          });

          setSeatingResult({
            success: true,
            message: 'Seating arrangement loaded from database',
            seating_arrangement: seatingMap,
          });
        }
      } catch (error) {
        console.error('Error loading seating arrangement and layout:', error);
      } finally {
        setIsLoadingArrangement(false);
        setIsLoadingLayout(false);
      }
    },
    [weddingId],
  );

  return {
    guestCountBucket,
    setGuestCountBucket,
    layout,
    seatingResult,
    seatingArrangement,
    isOptimizing,
    isLoadingLayout,
    isLoadingArrangement,
    optimizeSeating,
    loadLayout,
    loadSeatingArrangement,
    loadSeatingArrangementWithLayout,
    saveGroupPriorities,
  };
}
