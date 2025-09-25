import { useCallback, useEffect, useState } from 'react';

import { useWeddingStore } from '../store/sessionStore';
import {
  ApiError,
  GuestCountBucket,
  HallLayoutDto,
  SeatingArrangementResponseDto,
  SeatingArrangementsService,
  SeatingRequestDto,
  SeatingResultDto,
  UpdateSeatingArrangementDto,
} from '@shared/api';

export function useSeatingManager() {
  const currentWeddingId = useWeddingStore((state) => state.selectedWeddingId);
  const [guestCountBucket, setGuestCountBucket] = useState<GuestCountBucket | null>(null);

  const [tablesPerRow, setTablesPerRow] = useState<number | null>(null);
  const [layout, setLayout] = useState<HallLayoutDto | null>(null);
  const [seatingResult, setSeatingResult] = useState<SeatingResultDto | null>(null);
  const [seatingArrangement, setSeatingArrangement] =
    useState<SeatingArrangementResponseDto | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isLoadingLayout, setIsLoadingLayout] = useState(false);
  const [isLoadingArrangement, setIsLoadingArrangement] = useState(false);

  const loadSeatingArrangement = useCallback(async () => {
    if (!currentWeddingId) return;

    setIsLoadingArrangement(true);
    try {
      const arrangement =
        await SeatingArrangementsService.seatingArrangementControllerFindOne(currentWeddingId);
      setSeatingArrangement(arrangement);

      // Load tablesPerRow from the seating arrangement
      if (arrangement?.tablesPerRow) {
        setTablesPerRow(arrangement.tablesPerRow);
      }

      // If arrangement exists and has tables, create seating result for visualization
      if (arrangement?.tables && arrangement.tables.length > 0) {
        const seatingMap: Record<number, string[]> = {};
        arrangement.tables.forEach((tableGuests: string[], index: number) => {
          seatingMap[index + 1] = tableGuests; // index 0 = table 1, index 1 = table 2, etc.
        });

        setSeatingResult({
          success: true,
          message: 'Seating arrangement loaded from database',
          seating_arrangement: seatingMap,
        });
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setSeatingArrangement(null);
      } else {
        console.error('Error loading seating arrangement:', error);
      }
    } finally {
      setIsLoadingArrangement(false);
    }
  }, [currentWeddingId]);

  // Load existing seating arrangement when currentWeddingId is available
  useEffect(() => {
    if (currentWeddingId) {
      loadSeatingArrangement();
    }
  }, [currentWeddingId, loadSeatingArrangement]);

  const loadLayout = useCallback(
    async (bucket: GuestCountBucket, tablesPerRowParam?: number) => {
      if (!bucket || !currentWeddingId) return;

      setIsLoadingLayout(true);
      try {
        const layoutData =
          await SeatingArrangementsService.seatingArrangementControllerGetHallLayout(
            currentWeddingId,
            bucket,
            typeof tablesPerRowParam === 'number' ? tablesPerRowParam : undefined,
          );
        setLayout(layoutData);
      } catch (error) {
        console.error('Error loading layout:', error);
      } finally {
        setIsLoadingLayout(false);
      }
    },
    [currentWeddingId],
  );

  const saveGroupPriorities = useCallback(
    async (priorities: Record<string, number>, tablesPerRowValue?: number | null) => {
      if (!currentWeddingId) return;

      try {
        const updateData: UpdateSeatingArrangementDto = { groupPriorities: priorities };
        if (tablesPerRowValue != null) {
          updateData.tablesPerRow = tablesPerRowValue;
        }

        if (seatingArrangement) {
          // Update existing arrangement
          const updated = await SeatingArrangementsService.seatingArrangementControllerUpdate(
            currentWeddingId,
            updateData,
          );
          setSeatingArrangement(updated);

          // Update local tablesPerRow state
          if (tablesPerRowValue !== undefined) {
            setTablesPerRow(tablesPerRowValue);
          }
        } else {
          // Try to create new arrangement, but handle case where one already exists
          try {
            const response = await SeatingArrangementsService.seatingArrangementControllerCreate(
              currentWeddingId,
              updateData,
            );

            setSeatingArrangement(response);

            // Update local tablesPerRow state
            if (tablesPerRowValue !== undefined) {
              setTablesPerRow(tablesPerRowValue);
            }
          } catch (createError) {
            // If creation fails due to existing arrangement (409), try to update instead
            if (createError instanceof ApiError && createError.status === 409) {
              const response = await SeatingArrangementsService.seatingArrangementControllerUpdate(
                currentWeddingId,
                updateData,
              );

              setSeatingArrangement(response);

              // Update local tablesPerRow state
              if (tablesPerRowValue !== undefined) {
                setTablesPerRow(tablesPerRowValue);
              }
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
    [currentWeddingId, seatingArrangement],
  );

  const optimizeSeating = useCallback(
    async (request: SeatingRequestDto) => {
      if (!currentWeddingId) return;

      setIsOptimizing(true);
      setSeatingResult(null);

      try {
        // First, save/update group priorities and tablesPerRow
        await saveGroupPriorities(request.group_priorities, request.tables_per_row);

        const response: SeatingResultDto =
          await SeatingArrangementsService.seatingArrangementControllerOptimizeSeating(
            currentWeddingId,
            request,
          );

        // Convert response to local format
        const result: SeatingResultDto = response as unknown as SeatingResultDto;
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

          // Save tables to database. The { tables } object conforms to the UpdateSeatingArrangementDto
          const updatedResponse =
            await SeatingArrangementsService.seatingArrangementControllerUpdate(currentWeddingId, {
              tables,
            });

          // Convert response to local format
          const updatedArrangement: SeatingArrangementResponseDto = {
            id: updatedResponse.id,
            weddingId: updatedResponse.weddingId,
            groupPriorities: updatedResponse.groupPriorities,
            tables: updatedResponse.tables as string[][],
            createdAt: updatedResponse.createdAt,
            updatedAt: updatedResponse.updatedAt,
          };
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
    [currentWeddingId, saveGroupPriorities],
  );

  // Function to load seating arrangement and ensure layout is loaded for visualization
  const loadSeatingArrangementWithLayout = useCallback(
    async (bucket: GuestCountBucket, tablesPerRowParam?: number) => {
      if (!currentWeddingId || !bucket) return;

      setIsLoadingArrangement(true);
      setIsLoadingLayout(true);

      try {
        // Load both the arrangement and layout in parallel
        const [arrangement, layoutData] = await Promise.all([
          SeatingArrangementsService.seatingArrangementControllerFindOne(currentWeddingId),
          SeatingArrangementsService.seatingArrangementControllerGetHallLayout(
            currentWeddingId,
            bucket,
            typeof tablesPerRowParam === 'number' ? tablesPerRowParam : undefined,
          ),
        ]);

        setSeatingArrangement(arrangement);
        setLayout(layoutData);

        // Load tablesPerRow from the seating arrangement
        if (arrangement?.tablesPerRow) {
          setTablesPerRow(arrangement.tablesPerRow);
        }

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
    [currentWeddingId],
  );

  // Function to move a guest between tables
  const moveGuest = useCallback(
    async (guestName: string, fromTable: string, toTable: string) => {
      if (!seatingResult?.seating_arrangement) return;

      // Update the local seating result immediately for optimistic UI
      const updatedArrangement = { ...seatingResult.seating_arrangement };

      // Remove guest from source table
      const fromTableId = parseInt(fromTable);
      const toTableId = parseInt(toTable);

      if (updatedArrangement[fromTableId]) {
        updatedArrangement[fromTableId] = updatedArrangement[fromTableId].filter(
          (guest: string) => guest !== guestName,
        );
      }

      // Add guest to destination table
      if (!updatedArrangement[toTableId]) {
        updatedArrangement[toTableId] = [];
      }
      updatedArrangement[toTableId].push(guestName);

      // Update the seating result state
      setSeatingResult({
        ...seatingResult,
        seating_arrangement: updatedArrangement,
      });

      // Convert back to tables array format and save to database
      try {
        const tables: string[][] = [];
        const maxTableId = Math.max(...Object.keys(updatedArrangement).map(Number));

        for (let i = 1; i <= maxTableId; i++) {
          tables[i - 1] = updatedArrangement[i] || [];
        }

        if (currentWeddingId) {
          const updatedSeatingArrangementResponseDto =
            await SeatingArrangementsService.seatingArrangementControllerUpdate(currentWeddingId, {
              tables,
            });
          setSeatingArrangement(updatedSeatingArrangementResponseDto);
        }
      } catch (error) {
        console.error('Error saving guest move:', error);
        const revertedArrangement = { ...seatingResult.seating_arrangement };
        if (!revertedArrangement[fromTableId]) {
          revertedArrangement[fromTableId] = [];
        }
        revertedArrangement[fromTableId].push(guestName);
        revertedArrangement[toTableId] = revertedArrangement[toTableId].filter(
          (guest: string) => guest !== guestName,
        );

        setSeatingResult({
          ...seatingResult,
          seating_arrangement: revertedArrangement,
        });
      }
    },
    [seatingResult, currentWeddingId],
  );

  // Function to swap all guests between two tables
  const swapTables = useCallback(
    async (sourceTableId: string, targetTableId: string) => {
      if (!seatingResult?.seating_arrangement || !currentWeddingId || !layout) return;

      const sourceTableIdNum = parseInt(sourceTableId);
      const targetTableIdNum = parseInt(targetTableId);

      // Find table capacities from layout
      const sourceTable = layout.layout?.tables.find((t) => t.id === sourceTableIdNum);
      const targetTable = layout.layout?.tables.find((t) => t.id === targetTableIdNum);

      if (!sourceTable || !targetTable) {
        console.error('Table not found in layout');
        return;
      }

      // Get current guests for both tables
      const sourceGuests = [...(seatingResult.seating_arrangement[sourceTableIdNum] || [])];
      const targetGuests = [...(seatingResult.seating_arrangement[targetTableIdNum] || [])];

      // Validate capacity limits
      if (
        sourceGuests.length > targetTable.capacity ||
        targetGuests.length > sourceTable.capacity
      ) {
        console.warn(
          `Swap would exceed capacity limits. Source: ${sourceGuests.length}/${sourceTable.capacity}, Target: ${targetGuests.length}/${targetTable.capacity}`,
        );
        // Still allow the swap but log a warning - the user might want to do this intentionally
      }

      try {
        // Update the local seating result immediately for optimistic UI
        const updatedArrangement = { ...seatingResult.seating_arrangement };

        // Swap the guests directly
        updatedArrangement[sourceTableIdNum] = targetGuests;
        updatedArrangement[targetTableIdNum] = sourceGuests;

        // Update the seating result state immediately
        setSeatingResult({
          ...seatingResult,
          seating_arrangement: updatedArrangement,
        });

        // Convert to tables array format for database persistence
        const tables: string[][] = [];
        const maxTableId = Math.max(...Object.keys(updatedArrangement).map(Number));

        for (let i = 1; i <= maxTableId; i++) {
          tables[i - 1] = updatedArrangement[i] || [];
        }

        // Save to database
        const updatedSeatingArrangementResponseDto =
          await SeatingArrangementsService.seatingArrangementControllerUpdate(currentWeddingId, {
            tables,
          });

        // Update the seating arrangement state
        setSeatingArrangement(updatedSeatingArrangementResponseDto);
      } catch (error) {
        console.error('Error swapping tables:', error);

        // Revert the optimistic update on error
        const revertedArrangement = { ...seatingResult.seating_arrangement };
        revertedArrangement[sourceTableIdNum] = sourceGuests;
        revertedArrangement[targetTableIdNum] = targetGuests;

        setSeatingResult({
          ...seatingResult,
          seating_arrangement: revertedArrangement,
        });
        throw error;
      }
    },
    [seatingResult, currentWeddingId, layout],
  );

  return {
    guestCountBucket,
    setGuestCountBucket,
    tablesPerRow,
    setTablesPerRow,
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
    moveGuest,
    swapTables,
  };
}
