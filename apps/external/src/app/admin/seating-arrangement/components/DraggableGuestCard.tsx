import React from 'react';
import { GripVertical } from 'lucide-react';

interface DraggableGuestCardProps {
  guestName: string;
  fromTable: string;
  isDragging?: boolean;
  onDragStart?: (guestName: string, fromTable: string) => void;
  onDragEnd?: () => void;
}

export function DraggableGuestCard({
  guestName,
  fromTable,
  isDragging = false,
  onDragStart,
  onDragEnd,
}: DraggableGuestCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    const guestInfo = { name: guestName, fromTable };
    e.dataTransfer.setData('text/plain', JSON.stringify(guestInfo));
    onDragStart?.(guestName, fromTable);
  };

  return (
    <div
      className={`flex items-center gap-2 p-2 border rounded-md cursor-move transition-all duration-200 ${
        isDragging
          ? 'opacity-50 scale-95 cursor-grabbing bg-brand-50 border-brand-300 shadow-lg'
          : 'bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm'
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <GripVertical className={`w-3 h-3 transition-colors ${
        isDragging ? 'text-brand-500' : 'text-gray-400'
      }`} />
      <span className="text-sm text-muted-foreground flex items-center gap-2 select-none">
        <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
        {guestName}
      </span>
    </div>
  );
}