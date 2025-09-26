import React, { useMemo, useState } from 'react';

import { Button } from '@shared/components';
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
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';

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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  const moveGroup = (fromIndex: number, toIndex: number) => {
    const newOrder = [...groupOrder];
    const [movedGroup] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedGroup);
    setGroupOrder(newOrder);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      moveGroup(dragIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
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

        <div className="space-y-2">
          {groupOrder.map((group, index) => {
            const isDragging = draggedIndex === index;
            const isDropTarget = dragOverIndex === index;

            return (
              <div key={group} className="relative">
                {isDropTarget && draggedIndex !== null && draggedIndex > index && (
                  <div className="absolute -top-1 left-0 right-0 h-0.5 bg-brand-500 rounded-full z-10" />
                )}

                <div
                  className={`flex items-center gap-3 p-3 border rounded-lg transition-all duration-200 ${
                    isDragging
                      ? 'opacity-50 scale-95 cursor-grabbing bg-brand-50 border-brand-300'
                      : 'bg-gray-50 cursor-move hover:bg-gray-100'
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => index > 0 && moveGroup(index, index - 1)}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 transition-colors"
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => index < groupOrder.length - 1 && moveGroup(index, index + 1)}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 transition-colors"
                      disabled={index === groupOrder.length - 1}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                  <GripVertical
                    className={`w-4 h-4 transition-colors ${
                      isDragging ? 'text-brand-500' : 'text-gray-400'
                    }`}
                  />
                  <div className="flex-1">
                    <span className="font-medium">{group}</span>
                    {index === 0 && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Highest Priority
                      </span>
                    )}
                  </div>
                </div>

                {isDropTarget && draggedIndex !== null && draggedIndex < index && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-500 rounded-full z-10" />
                )}
              </div>
            );
          })}
        </div>

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
