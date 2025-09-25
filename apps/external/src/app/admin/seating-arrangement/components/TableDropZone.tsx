import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { DraggableGuestCard } from './DraggableGuestCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@shared/components';
import { Button } from '@shared/components/ui/button';
import { Card } from '@shared/components/ui/card';
import { ArrowLeftRight, Plus, Users, X } from 'lucide-react';

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
  shouldExpand?: boolean;
  isSwapMode?: boolean;
  isSelectedForSwap?: boolean;
  swapSourceTableId?: string | null;
  onInitiateSwap?: (tableId: string) => void;
  onSwapWith?: (sourceTableId: string, targetTableId: string) => void;
  onCancelSwap?: () => void;
}

export interface TableDropZoneRef {
  scrollIntoView: () => void;
  expand: () => void;
}

export const TableDropZone = forwardRef<TableDropZoneRef, TableDropZoneProps>(
  (
    {
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
      shouldExpand = false,
      isSwapMode = false,
      isSelectedForSwap = false,
      swapSourceTableId = null,
      onInitiateSwap,
      onSwapWith,
      onCancelSwap,
    },
    ref,
  ) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);

    const isOverCapacity = guests.length > capacity;
    const canAcceptDrop =
      guests.length < capacity || (draggedGuest && guests.includes(draggedGuest.name));

    useImperativeHandle(ref, () => ({
      scrollIntoView: () => {
        cardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      },
      expand: () => {
        setIsExpanded(true);
      },
    }));

    useEffect(() => {
      if (shouldExpand) {
        setIsExpanded(true);
      }
    }, [shouldExpand]);

    const getCardClassName = () => {
      if (isSelectedForSwap) {
        return 'border-blue-400 bg-blue-50 shadow-md ring-2 ring-blue-200';
      }
      if (isSwapMode && swapSourceTableId && swapSourceTableId !== tableId) {
        return 'border-green-300 bg-green-25 hover:border-green-400 hover:bg-green-50 cursor-pointer';
      }
      if (isDropTarget) {
        return canAcceptDrop
          ? 'border-green-400 bg-green-50 shadow-md scale-[1.02]'
          : 'border-red-400 bg-red-50 shadow-md';
      }
      return 'hover:shadow-md';
    };

    return (
      <Card
        ref={cardRef}
        className={`p-4 transition-all duration-200 ${getCardClassName()}`}
        onDragOver={(e) => onDragOver?.(e, tableId)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop?.(e, tableId)}
        onClick={() => {
          if (isSwapMode && swapSourceTableId && swapSourceTableId !== tableId) {
            onSwapWith?.(swapSourceTableId, tableId);
          }
        }}
      >
        {/* Swap mode indicator */}
        {isSwapMode && swapSourceTableId && swapSourceTableId !== tableId && (
          <div className="mb-3 p-2 border-2 border-dashed border-green-400 bg-green-100 text-green-700 rounded-md flex items-center justify-center gap-2">
            <ArrowLeftRight className="w-4 h-4" />
            <span className="text-sm font-medium">
              Click to swap with Table {swapSourceTableId}
            </span>
          </div>
        )}

        {/* Selected for swap indicator */}
        {isSelectedForSwap && (
          <div className="mb-3 p-2 border-2 border-dashed border-blue-400 bg-blue-100 text-blue-700 rounded-md flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4" />
              <span className="text-sm font-medium">Select another table to swap with</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onCancelSwap?.();
              }}
              className="h-6 w-6 p-0 hover:bg-blue-200"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Drop zone indicator when dragging */}
        {isDropTarget && (
          <div
            className={`mb-3 p-2 border-2 border-dashed rounded-md flex items-center justify-center gap-2 ${
              canAcceptDrop
                ? 'border-green-400 bg-green-100 text-green-700'
                : 'border-red-400 bg-red-100 text-red-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">
              {canAcceptDrop ? `Drop ${draggedGuest?.name} here` : 'Table at capacity'}
            </span>
          </div>
        )}

        <div className="min-h-[40px]">
          {guests.length === 0 ? (
            <div className="py-3">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-brand-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Table {tableId} (0/{capacity})
                </h5>
                {!isSwapMode && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInitiateSwap?.(tableId);
                    }}
                    className="h-8 w-8 p-0 hover:bg-brand-100"
                    title="Swap table"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="text-sm text-gray-500 italic py-2 text-center">
                No guests assigned
              </div>
            </div>
          ) : (
            <Accordion
              type="single"
              collapsible
              value={isExpanded ? 'guests' : ''}
              onValueChange={(value) => setIsExpanded(value === 'guests')}
            >
              <AccordionItem value="guests" className="border-none">
                <div className="flex items-center justify-between">
                  <AccordionTrigger className="flex-1 py-3 px-0 hover:no-underline">
                    <h5 className="font-semibold text-brand-600 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Table {tableId} ({guests.length}/{capacity})
                    </h5>
                  </AccordionTrigger>

                  <div className="flex items-center gap-2 pl-4">
                    {isOverCapacity && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full whitespace-nowrap">
                        Over capacity
                      </span>
                    )}
                    {!isSwapMode && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInitiateSwap?.(tableId);
                        }}
                        className="h-8 w-8 p-0 hover:bg-brand-100"
                        title="Swap table"
                      >
                        <ArrowLeftRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <AccordionContent>
                  <div className="space-y-2 pt-0 pb-2">
                    {guests.map((guest, index) => (
                      <DraggableGuestCard
                        key={`${tableId}-${guest}-${index}`}
                        guestName={guest}
                        fromTable={tableId}
                        isDragging={
                          draggedGuest?.name === guest && draggedGuest?.fromTable === tableId
                        }
                        onDragStart={onGuestDragStart}
                        onDragEnd={onGuestDragEnd}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </Card>
    );
  },
);

TableDropZone.displayName = 'TableDropZone';
