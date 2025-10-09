'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSidebar } from '@shared/components/ui/sidebar';
import { ChecklistItem } from '../../../store/progressTrackerStore';
import { parseAndRenderText } from '../../../utils/linkParser';
import { X, Calendar, CheckCircle } from 'lucide-react';

interface TimelineOverviewProps {
  checklist: ChecklistItem[];
  selectedWedding: any;
}

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  monthsBeforeWedding: number;
  completed?: boolean;
  isWeddingDay?: boolean;
  isBranchItem?: boolean; // New property for T-0 branch items
  branchItems?: TimelineItem[]; // For wedding day item to hold T-0 items
  displayLabel: string;
  status: 'completed' | 'upcoming' | 'overdue';
}

export default function TimelineOverview({ checklist, selectedWedding }: TimelineOverviewProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isWeddingDayModalOpen, setIsWeddingDayModalOpen] = useState(false);
  const [itemsPerRow, setItemsPerRow] = useState(6);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [pathD, setPathD] = useState<string>('');
  const { open, openMobile } = useSidebar();

  // Helper function to calculate smart popup positioning
  const getSmartPopupPosition = (
    itemIndex: number,
    totalItems: number,
    isLeftmost: boolean,
    isRightmost: boolean,
  ) => {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const popupWidth = 320; // max-w-80 = 320px
    const margin = 32; // minimum margin from viewport edges

    // If there's enough space to center, use default centering
    if (!isLeftmost && !isRightmost) {
      return { left: '50%', transform: 'translateX(-50%)' };
    }

    // For edge items, check if centering would cause overflow
    if (isLeftmost) {
      // Item is on the left edge - align popup to left edge of item
      return { left: 0, right: 'auto', transform: 'none' };
    }

    if (isRightmost) {
      // Item is on the right edge - align popup to right edge of item
      return { right: 0, left: 'auto', transform: 'none' };
    }

    // Default fallback
    return { left: '50%', transform: 'translateX(-50%)' };
  };

  // Handle responsive layout
  useEffect(() => {
    const calculateItemsPerRow = () => {
      if (typeof window !== 'undefined') {
        const containerWidth = Math.max(window.innerWidth - 100, 600);
        const newItemsPerRow = Math.floor(containerWidth / 180);
        setItemsPerRow(Math.max(newItemsPerRow, 3)); // Minimum 3 items per row
      }
    };

    calculateItemsPerRow();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', calculateItemsPerRow);
      return () => window.removeEventListener('resize', calculateItemsPerRow);
    }
  }, []);

  const timelineItems = useMemo(() => {
    if (!selectedWedding?.date) return [];

    const date = new Date(selectedWedding.date);
    const currentDate = new Date();
    const monthsUntilWedding = Math.ceil(
      (date.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
    );

    // Separate main timeline items and T-0 branch items
    const mainTimelineItems: TimelineItem[] = [];
    const branchItems: TimelineItem[] = [];

    checklist
      .filter((item) => item.monthsBeforeWedding !== undefined)
      .forEach((item) => {
        const monthsBeforeWedding = item.monthsBeforeWedding || 0;
        const isOverdue = monthsUntilWedding < monthsBeforeWedding;

        // Create appropriate display label
        let displayLabel: string;
        if (monthsBeforeWedding > 0) {
          displayLabel = `T-${monthsBeforeWedding}`;
        } else if (monthsBeforeWedding < 0) {
          displayLabel = `T+${Math.abs(monthsBeforeWedding)}`;
        } else {
          displayLabel = 'T-0';
        }

        const timelineItem: TimelineItem = {
          id: item.id,
          title: item.title,
          description: item.description,
          monthsBeforeWedding,
          completed: item.completed || false,
          isWeddingDay: false,
          isBranchItem: monthsBeforeWedding === 0,
          displayLabel,
          status: item.completed ? 'completed' : isOverdue ? 'overdue' : 'upcoming',
        };

        if (monthsBeforeWedding === 0) {
          branchItems.push(timelineItem);
        } else {
          // Include both positive and negative months in main timeline
          mainTimelineItems.push(timelineItem);
        }
      });

    // Add "The Big Day" item to main timeline
    const weddingDayItem: TimelineItem = {
      id: 'wedding-day',
      title: 'The Big Day',
      description: 'Your wedding celebration!',
      monthsBeforeWedding: 0,
      completed: false,
      isWeddingDay: true,
      isBranchItem: false,
      displayLabel: date.toLocaleDateString(),
      status: monthsUntilWedding <= 0 ? 'completed' : 'upcoming',
      branchItems: branchItems, // Attach branch items to wedding day
    };

    mainTimelineItems.push(weddingDayItem);

    // Sort main timeline: positive months (descending) → Wedding Day → negative months (ascending)
    return mainTimelineItems.sort((a, b) => {
      // Wedding day comes between positive and negative months
      if (a.isWeddingDay && b.monthsBeforeWedding > 0) return 1; // Wedding day after positive
      if (b.isWeddingDay && a.monthsBeforeWedding > 0) return -1; // Positive before wedding day
      if (a.isWeddingDay && b.monthsBeforeWedding < 0) return -1; // Wedding day before negative
      if (b.isWeddingDay && a.monthsBeforeWedding < 0) return 1; // Negative after wedding day

      // Both are positive months: sort descending (higher months first)
      if (a.monthsBeforeWedding > 0 && b.monthsBeforeWedding > 0) {
        return b.monthsBeforeWedding - a.monthsBeforeWedding;
      }

      // Both are negative months: sort ascending (closer to wedding day first)
      if (a.monthsBeforeWedding < 0 && b.monthsBeforeWedding < 0) {
        return a.monthsBeforeWedding - b.monthsBeforeWedding;
      }

      // Mixed positive and negative (shouldn't happen due to wedding day in between)
      return b.monthsBeforeWedding - a.monthsBeforeWedding;
    });
  }, [checklist, selectedWedding]);

  // Calculate snaking layout - moved before early return to maintain hook order
  const rows = useMemo(() => {
    if (!selectedWedding?.date || timelineItems.length === 0) {
      return [];
    }

    const calculatedRows = [];
    for (let i = 0; i < timelineItems.length; i += itemsPerRow) {
      const rowItems = timelineItems.slice(i, i + itemsPerRow);
      const rowIndex = Math.floor(i / itemsPerRow);
      const isReversed = rowIndex % 2 === 1; // Alternate direction for each row

      calculatedRows.push({
        items: isReversed ? [...rowItems].reverse() : rowItems,
        isReversed,
        rowIndex,
      });
    }
    return calculatedRows;
  }, [timelineItems, itemsPerRow, selectedWedding?.date]);

  const getItemColor = (item: TimelineItem, isHovered: boolean) => {
    const opacity = isHovered ? 'opacity-100' : 'opacity-70';

    if (item.isWeddingDay) {
      return `bg-brand-500 border-brand-500 ${opacity}`;
    }

    switch (item.status) {
      case 'completed':
        return `bg-gray-400 border-gray-400 ${opacity}`;
      case 'overdue':
        return `bg-destructive border-destructive ${opacity}`;
      case 'upcoming':
        return `bg-brand-200 border-brand-200 ${opacity}`;
      default:
        return `bg-brand-200 border-brand-200 ${opacity}`;
    }
  };

  // Compute smooth SVG path that snakes through dots across rows
  const recomputePath = () => {
    const container = containerRef.current;
    if (!container) return;
    type Pt = { x: number; y: number };
    const points: Pt[] = [];
    rows.forEach((row, rowIndex) => {
      const rowPoints: Pt[] = [];
      row.items.forEach((item) => {
        const el = dotRefs.current[item.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          const crect = container.getBoundingClientRect();
          const cx = rect.left - crect.left + rect.width / 2;
          const cy = rect.top - crect.top + rect.height / 2;
          rowPoints.push({ x: cx, y: cy });
        }
      });
      // Order per visual direction: 0-based even rows (1st, 3rd, ...) L->R, odd rows R->L
      const sorted = rowPoints.sort((a, b) => a.x - b.x);
      if (rowIndex % 2 === 0) {
        points.push(...sorted);
      } else {
        points.push(...sorted.reverse());
      }
    });
    if (points.length < 2) {
      setPathD('');
      return;
    }
    // Build smooth path only
    let d = `M ${points[0].x} ${points[0].y}`;
    const smoothing = 0.8;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const dx = (curr.x - prev.x) * smoothing;
      const dy = (curr.y - prev.y) * smoothing;
      const c1x = prev.x + dx;
      const c1y = prev.y + dy;
      const c2x = curr.x - dx;
      const c2y = curr.y - dy;
      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${curr.x} ${curr.y}`;
    }
    setPathD(d);
  };

  useEffect(() => {
    recomputePath();
  }, [rows]);

  // Recompute on window resize
  useEffect(() => {
    const onResize = () => {
      recomputePath();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Recompute on scroll within the container so the path stays aligned during scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      recomputePath();
    };
    el.addEventListener('scroll', onScroll, { passive: true } as any);
    return () => el.removeEventListener('scroll', onScroll);
  }, [rows]);

  // Recompute when sidebar opens/closes (layout shifts without window resize)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      recomputePath();
    });
    return () => cancelAnimationFrame(id);
  }, [open, openMobile, rows]);

  // Observe container size changes (e.g., row wrapping, font load, sidebar shift)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      recomputePath();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [rows]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isWeddingDayModalOpen) {
        setIsWeddingDayModalOpen(false);
      }
    };

    if (isWeddingDayModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isWeddingDayModalOpen]);

  return (
    <div className="flex h-full w-full flex-col">
      {selectedWedding?.date ? (
        <div
          ref={scrollRef}
          className="scrollbar-hide flex-1 overflow-x-hidden overflow-y-auto px-8 pt-8 pb-20"
        >
          {/* Legend at top */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="bg-brand-200 h-3 w-3 rounded-full"></div>
                <span>Upcoming</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span>Overdue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-gradient-to-br from-yellow-400 to-orange-500 shadow-sm">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
                <span>Wedding Day</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Note: T-X means X months before the wedding date (e.g., T-6 = 6 months before); T+X
              means X months after the wedding date (e.g., T+1 = 1 month after); T-0 = Wedding Day.
            </div>
          </div>

          <div ref={containerRef} className="relative isolate w-full">
            {/* Fluid snaking SVG path behind items */}
            {pathD && (
              <svg
                className="pointer-events-none absolute inset-0 z-0 h-full w-full"
                aria-hidden="true"
              >
                <path
                  d={pathD}
                  fill="none"
                  stroke="#D1D5DB"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {/* Snaking Timeline */}
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative mb-16">
                {/* Row container */}
                <div className={'relative flex flex-row items-center justify-between'}>
                  {/* Timeline items for this row */}
                  {row.items.map((item, itemIndex) => {
                    const isHovered = hoveredItem === item.id;
                    const dotSize = isHovered ? 'w-6 h-6' : 'w-4 h-4';
                    const isDomFirst = itemIndex === 0;
                    const isDomLast = itemIndex === row.items.length - 1;
                    const isLeftmost = isDomFirst;
                    const isRightmost = isDomLast;
                    const smartPosition = getSmartPopupPosition(
                      itemIndex,
                      row.items.length,
                      isLeftmost,
                      isRightmost,
                    );
                    const hoverStyle: React.CSSProperties = {
                      top: rowIndex % 2 === 0 ? '60px' : '-120px',
                      ...smartPosition,
                      minWidth: '256px', // min-w-64
                      maxWidth: '320px', // max-w-80
                    };

                    return (
                      <div
                        key={item.id}
                        className={`relative flex cursor-pointer flex-col items-center ${isHovered ? 'z-50' : 'z-10'}`}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        style={{ minWidth: '160px' }}
                      >
                        {/* Clean hover display - Skip for Wedding Day */}
                        {isHovered && !item.isWeddingDay && (
                          <div
                            className="absolute z-[60] max-w-80 min-w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-all duration-200"
                            style={hoverStyle}
                          >
                            {/* Full title */}
                            <div className="mb-2 text-sm font-semibold text-gray-800">
                              {item.title}
                            </div>

                            {/* Description */}
                            <div className="mb-3 text-sm text-gray-600">
                              {parseAndRenderText(
                                item.description,
                                'text-blue-600 hover:text-blue-800 underline',
                              )}
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">{item.displayLabel}</span>
                              <div>
                                {item.status === 'overdue' && (
                                  <span className="text-destructive font-medium">⚠ Overdue</span>
                                )}
                                {item.completed && (
                                  <span className="font-medium text-green-600">✓ Completed</span>
                                )}
                                {item.status === 'upcoming' && !item.completed && (
                                  <span className="font-medium text-blue-600">📅 Upcoming</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Timeline dot - Special styling for Wedding Day */}
                        <div
                          ref={(el) => {
                            dotRefs.current[item.id] = el;
                          }}
                          className={`${
                            item.isWeddingDay
                              ? 'h-12 w-12 transform cursor-pointer border-4 border-white bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg ring-2 ring-yellow-300 hover:scale-110 hover:shadow-xl'
                              : `${dotSize} ${getItemColor(item, isHovered)}`
                          } rounded-full transition-all duration-200 ${isHovered && !item.isWeddingDay ? 'scale-110 shadow-lg' : ''}`}
                          onClick={() => {
                            if (
                              item.isWeddingDay &&
                              item.branchItems &&
                              item.branchItems.length > 0
                            ) {
                              setIsWeddingDayModalOpen(true);
                            }
                          }}
                        >
                          {/* Wedding Day Icon */}
                          {item.isWeddingDay && (
                            <div className="flex h-full w-full items-center justify-center">
                              <Calendar className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Wedding Day CTA Badge */}
                        {item.isWeddingDay && item.branchItems && item.branchItems.length > 0 && (
                          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                            {item.branchItems.length}
                          </div>
                        )}

                        {/* Wedding Day Activities Popup - Adjacent to icon */}
                        {item.isWeddingDay && isWeddingDayModalOpen && (
                          <div
                            className={`absolute top-full z-[100] mt-2 ${
                              isLeftmost
                                ? 'left-0'
                                : isRightmost
                                  ? 'right-0'
                                  : 'left-1/2 -translate-x-1/2'
                            }`}
                          >
                            {/* Popup Content - Similar to Clean Hover Display */}
                            <div className="max-w-96 min-w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-all duration-200">
                              {/* Header with close button */}
                              <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-5 w-5 text-yellow-500" />
                                  <div className="text-sm font-semibold text-gray-800">
                                    Wedding Day Activities
                                  </div>
                                </div>
                                <button
                                  onClick={() => setIsWeddingDayModalOpen(false)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100"
                                >
                                  <X className="h-4 w-4 text-gray-500" />
                                </button>
                              </div>

                              {/* Activities List */}
                              <div className="max-h-80 space-y-3 overflow-y-auto">
                                {item.branchItems?.map((branchItem, index) => (
                                  <div
                                    key={branchItem.id}
                                    className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                                  >
                                    {/* Activity Title */}
                                    <div className="mb-1 flex items-center justify-start">
                                      <div className="text-sm font-medium text-gray-800">
                                        {branchItem.title}
                                      </div>
                                    </div>

                                    {/* Activity Description */}
                                    <div className="mb-2 text-xs text-gray-600">
                                      {parseAndRenderText(
                                        branchItem.description,
                                        'text-blue-600 hover:text-blue-800 underline',
                                      )}
                                    </div>

                                    {/* Activity Status */}
                                    <div className="flex items-center justify-end text-xs">
                                      <div>
                                        {branchItem.completed ? (
                                          <span className="font-medium text-green-600">
                                            ✓ Completed
                                          </span>
                                        ) : (
                                          <span className="font-medium text-blue-600">
                                            ○ Pending
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Title label - Special styling for Wedding Day */}
                        <div
                          className={`mt-2 min-w-0 text-center font-medium break-words transition-colors duration-200 ${
                            item.isWeddingDay
                              ? 'max-w-40 text-base font-bold text-yellow-600'
                              : `max-w-32 text-xs ${isHovered ? 'text-gray-900' : 'text-gray-700'}`
                          }`}
                        >
                          {item.title}
                        </div>

                        {/* Month label with CTA for Wedding Day */}
                        <div
                          className={`mt-1 min-w-0 text-center transition-colors duration-200 ${
                            item.isWeddingDay
                              ? 'cursor-pointer text-sm font-semibold text-yellow-700 hover:text-yellow-800'
                              : `text-xs ${isHovered ? 'text-gray-700' : 'text-gray-500'}`
                          }`}
                          onClick={() => {
                            if (
                              item.isWeddingDay &&
                              item.branchItems &&
                              item.branchItems.length > 0
                            ) {
                              setIsWeddingDayModalOpen(true);
                            }
                          }}
                        >
                          {item.isWeddingDay && item.branchItems && item.branchItems.length > 0
                            ? `Click to view ${item.branchItems.length} activities`
                            : item.displayLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center text-gray-500">
          <p>Please select a wedding to view the timeline</p>
        </div>
      )}

      {/* Legend moved to top; bottom legend removed */}
    </div>
  );
}
