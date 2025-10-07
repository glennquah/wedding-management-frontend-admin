'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ChecklistItem, useProgressTrackerStore } from '../../../store/progressTrackerStore';
import { Checkbox } from '@shared/components/ui/checkbox';
import { DataTable } from '@shared/components/ui/table';

interface ChecklistTableProps {
  checklist: ChecklistItem[];
}

export default function ChecklistTable({ checklist }: ChecklistTableProps) {
  const { updateChecklistItem } = useProgressTrackerStore();

  // Sort checklist items by months before wedding (descending)
  const sortedChecklist = useMemo(
    () =>
      [...checklist].sort((a, b) => {
        const aMonths = a.monthsBeforeWedding || 0;
        const bMonths = b.monthsBeforeWedding || 0;
        return bMonths - aMonths;
      }),
    [checklist],
  );

  const handleCheckboxChange = (itemId: string, completed: boolean) => {
    updateChecklistItem(itemId, { completed });
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

  const columns: ColumnDef<ChecklistItem>[] = [
    {
      accessorKey: 'title',
      header: 'Task',
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-medium text-gray-900">{row.original.title}</div>
          <div className="line-clamp-2 text-sm text-gray-500">{row.original.description}</div>
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
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center">
          <Checkbox
            className="border-2 data-[state=unchecked]:border-gray-400 data-[state=unchecked]:bg-white dark:data-[state=unchecked]:border-gray-500 dark:data-[state=unchecked]:bg-transparent"
            checked={row.original.completed || false}
            onCheckedChange={(checked) => handleCheckboxChange(row.original.id, !!checked)}
            aria-label={`Mark ${row.original.title} as ${row.original.completed ? 'incomplete' : 'complete'}`}
          />
        </div>
      ),
    },
  ];

  return (
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
    />
  );
}
