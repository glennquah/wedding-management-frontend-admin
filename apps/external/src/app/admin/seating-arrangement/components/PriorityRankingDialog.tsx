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
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';

interface Guest {
  group?: string;
}

interface PriorityRankingDialogProps {
  open: boolean;
  guests: Guest[];
  currentPriorities: Record<string, number> | null;
  onSave: (priorities: Record<string, number>) => void;
  onClose: () => void;
}

export function PriorityRankingDialog({
  open,
  guests,
  currentPriorities,
  onSave,
  onClose,
}: PriorityRankingDialogProps) {
  // Get unique groups from guests - memoized to prevent infinite re-renders
  const uniqueGroups = useMemo(() => {
    return Array.from(new Set(guests.map((guest) => guest.group || 'Others')));
  }, [guests]);

  // Initialize priorities - either from current or auto-assigned values
  const [groupOrder, setGroupOrder] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Update groupOrder when uniqueGroups changes
  React.useEffect(() => {
    if (uniqueGroups.length > 0) {
      if (currentPriorities) {
        // Sort groups by current priority (highest first)
        setGroupOrder(
          [...uniqueGroups].sort(
            (a, b) => (currentPriorities[b] || 0) - (currentPriorities[a] || 0),
          ),
        );
      } else {
        setGroupOrder([...uniqueGroups]);
      }
    }
  }, [uniqueGroups, currentPriorities]);

  // Generate priorities based on order: highest priority gets highest number
  const generatePriorities = (order: string[]): Record<string, number> => {
    const priorities: Record<string, number> = {};
    order.forEach((group, index) => {
      priorities[group] = (order.length - index) * 2; // Start from highest and go down by 2
    });
    return priorities;
  };

  const handleSave = () => {
    const finalPriorities = generatePriorities(groupOrder);
    onSave(finalPriorities);
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
                {/* Drop indicator above */}
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

                {/* Drop indicator below */}
                {isDropTarget && draggedIndex !== null && draggedIndex < index && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-500 rounded-full z-10" />
                )}
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
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
