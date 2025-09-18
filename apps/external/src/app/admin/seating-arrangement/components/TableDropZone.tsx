import React from 'react';
import { Card } from '@shared/components/ui/card';
import { Users, Plus } from 'lucide-react';
import { DraggableGuestCard } from './DraggableGuestCard';

interface TableDropZoneProps {
  tableId: string;
  guests: string[];
  capacity?: number;
  isDropTarget?: boolean;
  draggedGuest?: { name: string; fromTable: string } | null;
  onDragOver?: (e: React.DragEvent, tableId: string) => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent, tableId: string) => void;
  onGuestDragStart?: (guestName: string, fromTable: string) => void;
  onGuestDragEnd?: () => void;
}

export function TableDropZone({
  tableId,
  guests,
  capacity = 10,
  isDropTarget = false,
  draggedGuest,
  onDragOver,
  onDragLeave,
  onDrop,
  onGuestDragStart,
  onGuestDragEnd,
}: TableDropZoneProps) {
  const isOverCapacity = guests.length > capacity;
  const canAcceptDrop = guests.length < capacity || (draggedGuest && guests.includes(draggedGuest.name));

  return (
    <Card
      className={`p-4 transition-all duration-200 ${
        isDropTarget
          ? canAcceptDrop
            ? 'border-green-400 bg-green-50 shadow-md scale-[1.02]'
            : 'border-red-400 bg-red-50 shadow-md'
          : 'hover:shadow-md'
      }`}
      onDragOver={(e) => onDragOver?.(e, tableId)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop?.(e, tableId)}
    >
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-brand-600 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Table {tableId} ({guests.length}/{capacity})
        </h5>
        {isOverCapacity && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
            Over capacity
          </span>
        )}
      </div>

      {/* Drop zone indicator when dragging */}
      {isDropTarget && (
        <div className={`mb-3 p-2 border-2 border-dashed rounded-md flex items-center justify-center gap-2 ${
          canAcceptDrop
            ? 'border-green-400 bg-green-100 text-green-700'
            : 'border-red-400 bg-red-100 text-red-700'
        }`}>
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">
            {canAcceptDrop
              ? `Drop ${draggedGuest?.name} here`
              : 'Table at capacity'}
          </span>
        </div>
      )}

      <div className="space-y-2 min-h-[40px]">
        {guests.length === 0 ? (
          <div className="text-sm text-gray-500 italic py-2 text-center">
            No guests assigned
          </div>
        ) : (
          guests.map((guest, index) => (
            <DraggableGuestCard
              key={`${tableId}-${guest}-${index}`}
              guestName={guest}
              fromTable={tableId}
              isDragging={draggedGuest?.name === guest && draggedGuest?.fromTable === tableId}
              onDragStart={onGuestDragStart}
              onDragEnd={onGuestDragEnd}
            />
          ))
        )}
      </div>
    </Card>
  );
}