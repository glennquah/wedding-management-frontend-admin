'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSidebar } from '@shared/components/ui/sidebar';
import { ChecklistItem } from '../../../store/progressTrackerStore';

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
  displayLabel: string;
  status: 'completed' | 'upcoming' | 'overdue';
}

export default function TimelineOverview({ checklist, selectedWedding }: TimelineOverviewProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [itemsPerRow, setItemsPerRow] = useState(6);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [pathD, setPathD] = useState<string>('');
  const { open, openMobile } = useSidebar();

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

    // Create timeline items from checklist
    const items: TimelineItem[] = checklist
      .filter((item) => item.monthsBeforeWedding !== undefined)
      .map((item) => {
        const monthsBeforeWedding = item.monthsBeforeWedding || 0;
        const isOverdue = monthsUntilWedding < monthsBeforeWedding;

        return {
          id: item.id,
          title: item.title,
          description: item.description,
          monthsBeforeWedding,
          completed: item.completed || false,
          isWeddingDay: false,
          displayLabel: `T-${monthsBeforeWedding}`,
          status: item.completed ? 'completed' : isOverdue ? 'overdue' : 'upcoming',
        };
      });

    // Add "The Big Day" item
    items.push({
      id: 'wedding-day',
      title: 'The Big Day',
      description: 'Your wedding celebration!',
      monthsBeforeWedding: 0,
      completed: false,
      isWeddingDay: true,
      displayLabel: date.toLocaleDateString(),
      status: monthsUntilWedding <= 0 ? 'completed' : 'upcoming',
    });

    // Sort by months before wedding (descending), then after wedding (ascending)
    return items.sort((a, b) => {
      // Wedding day always in the middle
      if (a.isWeddingDay) return 0;
      if (b.isWeddingDay) return a.monthsBeforeWedding > 0 ? -1 : 1;

      // Before wedding items (positive months)
      if (a.monthsBeforeWedding > 0 && b.monthsBeforeWedding > 0) {
        return b.monthsBeforeWedding - a.monthsBeforeWedding;
      }

      // After wedding items (0 months)
      if (a.monthsBeforeWedding === 0 && b.monthsBeforeWedding === 0) {
        return 0;
      }

      // Mixed before/after
      if (a.monthsBeforeWedding > 0) return -1;
      return 1;
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
    const smoothing = 0.45;
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
                <div className="bg-brand-500 h-3 w-3 rounded-full"></div>
                <span>Wedding Day</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Note: T-X means X months before the wedding date (e.g., T-6 = 6 months before; T-0 =
              Wedding Day).
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
                    const hoverStyle: React.CSSProperties = {
                      top: rowIndex % 2 === 0 ? '60px' : '-120px',
                      ...(isLeftmost
                        ? { left: 0, right: 'auto', transform: 'none' }
                        : isRightmost
                          ? { right: 0, left: 'auto', transform: 'none' }
                          : { left: '50%', transform: 'translateX(-50%)' }),
                    };

                    return (
                      <div
                        key={item.id}
                        className={`relative flex cursor-pointer flex-col items-center ${isHovered ? 'z-50' : 'z-10'}`}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        style={{ minWidth: '160px' }}
                      >
                        {/* Clean hover display */}
                        {isHovered && (
                          <div
                            className="absolute z-[60] max-w-80 min-w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-all duration-200"
                            style={hoverStyle}
                          >
                            {/* Full title */}
                            <div className="mb-2 text-sm font-semibold text-gray-800">
                              {item.title}
                            </div>

                            {/* Description */}
                            <div className="mb-3 text-sm text-gray-600">{item.description}</div>

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

                        {/* Timeline dot */}
                        <div
                          ref={(el) => {
                            dotRefs.current[item.id] = el;
                          }}
                          className={`${dotSize} rounded-full ${getItemColor(item, isHovered)} transition-all duration-200 ${isHovered ? 'scale-110 shadow-lg' : ''}`}
                        />

                        {/* Title label */}
                        <div
                          className={`mt-2 max-w-32 min-w-0 text-center text-xs font-medium break-words transition-colors duration-200 ${isHovered ? 'text-gray-900' : 'text-gray-700'}`}
                        >
                          {item.title}
                        </div>

                        {/* Month label */}
                        <div
                          className={`mt-1 min-w-0 text-center text-xs transition-colors duration-200 ${isHovered ? 'text-gray-700' : 'text-gray-500'}`}
                        >
                          {item.displayLabel}
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
