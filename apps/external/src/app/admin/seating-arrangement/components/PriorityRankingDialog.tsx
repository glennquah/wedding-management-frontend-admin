import React, { useMemo, useState } from 'react';

import { Button, ItemRankingList } from '@shared/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';

interface Guest {
  group?: string;
}

interface PriorityRankingDialogProps {
  open: boolean;
  guests: Guest[];
  currentPriorities: Record<string, number> | null;
  guestCountBucket: string | null;
  tablesPerRow: number | null;
  onSave: (priorities: Record<string, number>, tablesPerRow: number) => void;
  onClose: () => void;
}

export function PriorityRankingDialog({
  open,
  guests,
  currentPriorities,
  guestCountBucket,
  tablesPerRow,
  onSave,
  onClose,
}: PriorityRankingDialogProps) {
  const uniqueGroups = useMemo(() => {
    return Array.from(new Set(guests.map((guest) => guest.group || 'Others')));
  }, [guests]);

  const [groupOrder, setGroupOrder] = useState<string[]>([]);

  // Define default tables per row based on guest count. This will always be a number.
  const defaultTables = guestCountBucket === 'MEDIUM' ? 4 : 6;
  const [selectedTablesPerRow, setSelectedTablesPerRow] = useState(tablesPerRow ?? defaultTables);

  React.useEffect(() => {
    if (open) {
      // Re-initialize state when the dialog opens to ensure it's fresh
      if (currentPriorities) {
        setGroupOrder(
          [...uniqueGroups].sort(
            (a, b) => (currentPriorities[b] || 0) - (currentPriorities[a] || 0),
          ),
        );
      } else {
        setGroupOrder([...uniqueGroups]);
      }
      // Reset tables per row based on props every time the dialog is opened
      setSelectedTablesPerRow(tablesPerRow ?? (guestCountBucket === 'MEDIUM' ? 4 : 6));
    }
  }, [open, uniqueGroups, currentPriorities, tablesPerRow, guestCountBucket]);

  const generatePriorities = (order: string[]): Record<string, number> => {
    const priorities: Record<string, number> = {};
    order.forEach((group, index) => {
      priorities[group] = (order.length - index) * 2;
    });
    return priorities;
  };

  const handleSave = () => {
    const finalPriorities = generatePriorities(groupOrder);
    // The state is always a number, so we can pass it directly.
    onSave(finalPriorities, selectedTablesPerRow);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rank Group Priorities</DialogTitle>
          <DialogDescription>
            Drag groups to rank them by priority. Groups at the top get better table placement.
          </DialogDescription>
        </DialogHeader>

        <ItemRankingList
          selectedItems={groupOrder}
          onItemsChange={setGroupOrder}
          label="Group Priority Order"
          description="Drag to reorder. Groups at the top get better table placement."
          emptyMessage="No groups found."
          showAddMore={false}
          allowRemove={false}
        />

        {guestCountBucket && (guestCountBucket === 'MEDIUM' || guestCountBucket === 'LARGE') && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex flex-col gap-3">
              <label htmlFor="tables-per-row" className="text-sm font-medium text-gray-700">
                Tables per Row
              </label>
              <Select
                value={selectedTablesPerRow.toString()}
                onValueChange={(value) => {
                  setSelectedTablesPerRow(parseInt(value, 10));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tables per row" />
                </SelectTrigger>
                <SelectContent>
                  {guestCountBucket === 'MEDIUM' ? (
                    <>
                      <SelectItem value="4">4 tables per row</SelectItem>
                      <SelectItem value="6">6 tables per row</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="4">4 tables per row</SelectItem>
                      <SelectItem value="6">6 tables per row</SelectItem>
                      <SelectItem value="8">8 tables per row</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600">
                Choose how many tables to display per row in your seating layout
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            ⚠️ <strong>Notice:</strong> Any previously generated seating arrangement will not be
            saved and a new one will be generated.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Generate Seating</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
