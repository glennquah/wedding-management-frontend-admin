'use client';

import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ChecklistItem, useProgressTrackerStore } from '../../../store/progressTrackerStore';
import { useWeddingStore } from '../../../store/sessionStore';
import { Checkbox } from '@shared/components/ui/checkbox';
import { Button } from '@shared/components/ui/button';
import { DataTable } from '@shared/components/ui/table';
import { parseAndRenderText } from '../../../utils/linkParser';
import { Edit2, Trash2 } from 'lucide-react';

interface ChecklistTableProps {
  checklist: ChecklistItem[];
  onEditItem?: (item: ChecklistItem) => void;
  onDeleteItem?: (item: ChecklistItem) => void;
  onToggleCompletion?: (itemId: string, completed: boolean) => Promise<void>;
}

export default function ChecklistTable({
  checklist,
  onEditItem,
  onDeleteItem,
  onToggleCompletion,
}: ChecklistTableProps) {
  const { selectedWeddingId } = useWeddingStore();
  const { updateChecklistItem } = useProgressTrackerStore();
  const [fadingItems, setFadingItems] = useState<Set<string>>(new Set());
  const [optimisticStates, setOptimisticStates] = useState<Map<string, boolean>>(new Map());

  // Stable default sort: Uncompleted first, then monthsBeforeWedding (desc), then original index as tiebreaker
  const sortedChecklist = useMemo(() => {
    const decorated = checklist.map((item, index) => ({ item, index }));
    decorated.sort((a, b) => {
      const aCompleted = !!a.item.completed;
      const bCompleted = !!b.item.completed;
      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1; // uncompleted first
      }
      const aMonths = a.item.monthsBeforeWedding ?? 0;
      const bMonths = b.item.monthsBeforeWedding ?? 0;
      if (aMonths !== bMonths) {
        return bMonths - aMonths; // desc
      }
      return a.index - b.index; // stable tiebreaker by original order
    });
    return decorated.map((d) => d.item);
  }, [checklist]);

  const handleCheckboxChange = async (itemId: string, completed: boolean) => {
    // Immediately update the optimistic state so checkbox shows the new state
    setOptimisticStates((prev) => new Map(prev).set(itemId, completed));

    // Start fade-out animation (for both checking and unchecking)
    setFadingItems((prev) => new Set(prev).add(itemId));

    // Wait for animation, then update state
    setTimeout(async () => {
      if (onToggleCompletion) {
        await onToggleCompletion(itemId, completed);
      } else if (typeof selectedWeddingId === 'number') {
        updateChecklistItem(selectedWeddingId, itemId, { completed });
      }
      // Remove from fading set and optimistic state after update
      setFadingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
      setOptimisticStates((prev) => {
        const next = new Map(prev);
        next.delete(itemId);
        return next;
      });
    }, 500); // Match this to CSS transition duration
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Getting Started': 'bg-green-100 text-green-800',
      'Initial Planning': 'bg-blue-100 text-blue-800',
      'Creating the Foundation': 'bg-purple-100 text-purple-800',
      'Detailed Planning': 'bg-orange-100 text-orange-800',
      'During the Wedding': 'bg-red-100 text-red-800',
      'After the Wedding': 'bg-gray-100 text-gray-800',
      'Additional Details': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: ColumnDef<ChecklistItem>[] = useMemo(() => {
    const baseColumns: ColumnDef<ChecklistItem>[] = [
      {
        accessorKey: 'title',
        header: 'Task',
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="font-medium text-gray-900">{row.original.title}</div>
            <div className="line-clamp-2 text-sm text-gray-500">
              {parseAndRenderText(
                row.original.description,
                'text-blue-600 hover:text-blue-800 underline',
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(row.original.category)}`}
          >
            {row.original.category}
          </span>
        ),
      },
      {
        accessorKey: 'monthsBeforeWedding',
        header: 'Months Before Wedding',
        cell: ({ row }) => (
          <div className="text-sm text-gray-600">
            {row.original.monthsBeforeWedding !== undefined
              ? `${row.original.monthsBeforeWedding}`
              : 'Not specified'}
          </div>
        ),
      },
      {
        id: 'completed',
        header: 'Completed',
        cell: ({ row }) => {
          const item = row.original;
          // Use optimistic state if available, otherwise use actual state
          const isChecked = optimisticStates.has(item.id)
            ? optimisticStates.get(item.id)!
            : item.completed || false;

          return (
            <div className="flex w-full items-center justify-center">
              <Checkbox
                className="border-2 data-[state=unchecked]:border-gray-400 data-[state=unchecked]:bg-white dark:data-[state=unchecked]:border-gray-500 dark:data-[state=unchecked]:bg-transparent"
                checked={isChecked}
                onCheckedChange={(checked) => handleCheckboxChange(item.id, !!checked)}
                aria-label={`Mark ${item.title} as ${item.completed ? 'incomplete' : 'complete'}`}
              />
            </div>
          );
        },
      },
    ];

    // Add actions column if handlers are provided
    if (onEditItem || onDeleteItem) {
      baseColumns.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-2">
              {onEditItem && (
                <Button size="sm" variant="ghost" onClick={() => onEditItem(item)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {onDeleteItem && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteItem(item)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
      });
    }

    return baseColumns;
  }, [onEditItem, onDeleteItem, optimisticStates, handleCheckboxChange]);

  return (
    <>
      <style>{`
        .checklist-row-fade-out {
          opacity: 0;
          transition: opacity 500ms ease-out;
        }
        .checklist-row {
          opacity: 1;
          transition: opacity 500ms ease-in;
        }
      `}</style>
      <DataTable
        data={sortedChecklist}
        columns={columns}
        title="Checklist"
        searchableColumns={[
          {
            id: 'title',
            placeholder: 'Search tasks...',
          },
        ]}
        enableSelection={false}
        defaultPageSize={10}
        className="w-full"
        rowClassName={(row) => {
          const item = row.original as ChecklistItem;
          return fadingItems.has(item.id) ? 'checklist-row-fade-out' : 'checklist-row';
        }}
      />
    </>
  );
}
