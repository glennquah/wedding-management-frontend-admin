import { useMemo } from 'react';
import { ChecklistItem } from '../store/progressTrackerStore';
import { WeddingResponseDto } from '@shared/api';

export interface UrgentItemsCount {
  overdueCount: number;
  currentMonthCount: number;
  totalUrgentCount: number;
  overdueItems: ChecklistItem[];
  currentMonthItems: ChecklistItem[];
}

/**
 * Hook to calculate urgent checklist items (overdue + current month incomplete)
 */
export function useUrgentChecklistItems(
  checklist: ChecklistItem[],
  selectedWedding: WeddingResponseDto | null,
): UrgentItemsCount {
  return useMemo(() => {
    if (!selectedWedding?.date || !checklist || checklist.length === 0) {
      return {
        overdueCount: 0,
        currentMonthCount: 0,
        totalUrgentCount: 0,
        overdueItems: [],
        currentMonthItems: [],
      };
    }

    const weddingDate = new Date(selectedWedding.date);
    const currentDate = new Date();

    // Calculate months until wedding using calendar month boundaries
    const monthsUntilWedding =
      (weddingDate.getFullYear() - currentDate.getFullYear()) * 12 +
      (weddingDate.getMonth() - currentDate.getMonth());

    const overdueItems: ChecklistItem[] = [];
    const currentMonthItems: ChecklistItem[] = [];

    checklist.forEach((item) => {
      // Skip completed items
      if (item.completed) return;

      const monthsBeforeWedding = item.monthsBeforeWedding ?? 0;

      // Overdue: monthsBeforeWedding is greater than current monthsUntilWedding
      // (e.g., if item should be done at T-6 months but we're at T-4 months)
      if (monthsBeforeWedding > monthsUntilWedding) {
        overdueItems.push(item);
      }
      // Current month: item should be completed this month
      else if (monthsBeforeWedding === monthsUntilWedding) {
        currentMonthItems.push(item);
      }
    });

    return {
      overdueCount: overdueItems.length,
      currentMonthCount: currentMonthItems.length,
      totalUrgentCount: overdueItems.length + currentMonthItems.length,
      overdueItems,
      currentMonthItems,
    };
  }, [checklist, selectedWedding]);
}
