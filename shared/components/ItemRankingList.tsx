'use client';

import React, { useState } from 'react';

import { Button } from '@shared/components';
import { ArrowDown, ArrowUp, GripVertical, Plus, X } from 'lucide-react';

interface ItemRankingListProps {
  selectedItems: string[];
  availableItems?: string[];
  onItemsChange: (items: string[]) => void;
  label?: string;
  description?: string;
  emptyMessage?: string;
  addMoreLabel?: string;
  showAddMore?: boolean;
  allowRemove?: boolean;
}

export function ItemRankingList({
  selectedItems,
  availableItems = [],
  onItemsChange,
  label = 'Items (Ranked by Priority)',
  description = 'Drag to reorder. Items at the top are prioritized higher.',
  emptyMessage = 'No items selected. Add items below to get started.',
  addMoreLabel = 'Add More Items',
  showAddMore = true,
  allowRemove = true,
}: ItemRankingListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const remainingItems = availableItems.filter((item) => !selectedItems.includes(item));

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newOrder = [...selectedItems];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    onItemsChange(newOrder);
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
      moveItem(dragIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleAddItem = (item: string) => {
    onItemsChange([...selectedItems, item]);
  };

  const handleRemoveItem = (item: string) => {
    onItemsChange(selectedItems.filter((d) => d !== item));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">{label}</label>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>

        {selectedItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedItems.map((item, index) => {
              const isDragging = draggedIndex === index;
              const isDropTarget = dragOverIndex === index;

              return (
                <div key={item} className="relative">
                  {isDropTarget && draggedIndex !== null && draggedIndex > index && (
                    <div className="absolute -top-1 left-0 right-0 h-0.5 bg-gray-300 rounded-full z-10" />
                  )}

                  <div
                    className={`flex items-center gap-3 p-3 border rounded-lg transition-all duration-200 ${
                      isDragging
                        ? 'opacity-50 scale-95 cursor-grabbing bg-gray-50 border-gray-300'
                        : 'bg-background cursor-move hover:bg-muted/50'
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
                        onClick={() => index > 0 && moveItem(index, index - 1)}
                        className="p-1 hover:bg-muted rounded disabled:opacity-50 transition-colors"
                        disabled={index === 0}
                        type="button"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => index < selectedItems.length - 1 && moveItem(index, index + 1)}
                        className="p-1 hover:bg-muted rounded disabled:opacity-50 transition-colors"
                        disabled={index === selectedItems.length - 1}
                        type="button"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                    <GripVertical
                      className={`w-4 h-4 transition-colors ${
                        isDragging ? 'text-gray-400' : 'text-muted-foreground'
                      }`}
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <span className="font-medium">{item}</span>
                      {index === 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Highest Priority
                        </span>
                      )}
                    </div>
                    {allowRemove && (
                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="p-1 hover:bg-destructive/10 text-destructive rounded transition-colors"
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isDropTarget && draggedIndex !== null && draggedIndex < index && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-300 rounded-full z-10" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddMore && remainingItems.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">{addMoreLabel}</label>
          <div className="flex gap-2 flex-wrap">
            {remainingItems.map((item) => (
              <Button
                key={item}
                variant="outline"
                size="sm"
                onClick={() => handleAddItem(item)}
                type="button"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Plus className="w-3 h-3 mr-1" />
                {item}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
