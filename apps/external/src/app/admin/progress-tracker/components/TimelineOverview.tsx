'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from '@shared/components/ui/sidebar';
import { ChecklistItem } from '../../../store/progressTrackerStore';
import { parseAndRenderText } from '../../../utils/linkParser';
import { X, Calendar, CheckCircle, Circle } from 'lucide-react';
import { WeddingResponseDto } from '@shared/api';

interface TimelineOverviewProps {
  checklist: ChecklistItem[];
  selectedWedding: WeddingResponseDto | null;
  onToggleCompletion?: (itemId: string, completed: boolean) => Promise<ChecklistItem[] | null>;
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

export default function TimelineOverview({
  checklist,
  selectedWedding,
  onToggleCompletion,
}: TimelineOverviewProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isWeddingDayModalOpen, setIsWeddingDayModalOpen] = useState(false);
  const [itemsPerRow, setItemsPerRow] = useState(6);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [pathD, setPathD] = useState<string>('');
  const { open, openMobile } = useSidebar();

  // Helper function to calculate smart popup positioning
  const getSmartPopupPosition = (isLeftmost: boolean, isRightmost: boolean) => {
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
    // Use calendar month boundaries so the wedding month is 0
    const monthsUntilWedding =
      (date.getFullYear() - currentDate.getFullYear()) * 12 +
      (date.getMonth() - currentDate.getMonth());

    // Separate main timeline items and T-0 branch items
    const mainTimelineItems: TimelineItem[] = [];
    const branchItems: TimelineItem[] = [];

    checklist
      .filter((item) => item.monthsBeforeWedding !== undefined)
      .forEach((item) => {
        const monthsBeforeWedding = item.monthsBeforeWedding || 0;
        const isOverdue = monthsUntilWedding < monthsBeforeWedding;

        // Create appropriate display label with actual month names
        let displayLabel: string;
        if (monthsBeforeWedding > 0) {
          // Calculate the target month for tasks before wedding
          const targetDate = new Date(date);
          targetDate.setMonth(targetDate.getMonth() - monthsBeforeWedding);
          displayLabel = targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        } else if (monthsBeforeWedding < 0) {
          // Calculate the target month for tasks after wedding
          const targetDate = new Date(date);
          targetDate.setMonth(targetDate.getMonth() - monthsBeforeWedding); // Note: -monthsBeforeWedding because it's negative
          displayLabel = targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        } else {
          displayLabel = 'Wedding Day';
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
        const monthDiff = b.monthsBeforeWedding - a.monthsBeforeWedding;
        // Add stable secondary sort by ID to prevent position jumping
        return monthDiff !== 0 ? monthDiff : a.id.localeCompare(b.id);
      }

      // Both are negative months: sort ascending (closer to wedding day first)
      if (a.monthsBeforeWedding < 0 && b.monthsBeforeWedding < 0) {
        const monthDiff = a.monthsBeforeWedding - b.monthsBeforeWedding;
        // Add stable secondary sort by ID to prevent position jumping
        return monthDiff !== 0 ? monthDiff : a.id.localeCompare(b.id);
      }

      // Mixed positive and negative (shouldn't happen due to wedding day in between)
      const monthDiff = b.monthsBeforeWedding - a.monthsBeforeWedding;
      // Add stable secondary sort by ID to prevent position jumping
      return monthDiff !== 0 ? monthDiff : a.id.localeCompare(b.id);
    });
  }, [checklist, selectedWedding]);

  // Calculate user progress state and current time position
  const progressInfo = useMemo(() => {
    if (!selectedWedding?.date || timelineItems.length === 0) return null;

    const date = new Date(selectedWedding.date);
    const currentDate = new Date();
    // Use calendar month boundaries so the wedding month is 0
    const monthsUntilWedding =
      (date.getFullYear() - currentDate.getFullYear()) * 12 +
      (date.getMonth() - currentDate.getMonth());

    // Find the uncompleted item furthest from wedding day (user's progress state)
    // The user's position should be at the last completed item before the first uncompleted item
    const sortedItems = [...timelineItems]
      .filter((item) => !item.isWeddingDay)
      .sort((a, b) => {
        const monthDiff = b.monthsBeforeWedding - a.monthsBeforeWedding;
        // Add stable secondary sort by ID to prevent position jumping
        return monthDiff !== 0 ? monthDiff : a.id.localeCompare(b.id);
      }); // Sort by monthsBeforeWedding descending

    // Find the first uncompleted item in the sorted list (furthest from wedding)
    const firstUncompletedItem = sortedItems.find((item) => !item.completed);

    // Find the latest (most recent) completed item (closest to wedding day among completed items)
    const completedItems = sortedItems.filter((item) => item.completed);
    const latestCompletedMonths =
      completedItems.length > 0
        ? Math.min(...completedItems.map((item) => item.monthsBeforeWedding))
        : null;

    let userProgressMonths = 0; // Default to wedding day if all completed

    // If it's already past the wedding date, position at the first uncompleted item AFTER the wedding
    if (monthsUntilWedding < 0) {
      const afterWeddingItems = sortedItems.filter((item) => item.monthsBeforeWedding < 0);
      const firstUncompletedAfterWedding = afterWeddingItems.find((item) => !item.completed);
      if (firstUncompletedAfterWedding) {
        userProgressMonths = firstUncompletedAfterWedding.monthsBeforeWedding;
      } else {
        // If nothing uncompleted after wedding, fallback to the closest completed after-wedding task if exists, else stay at wedding day
        const completedAfterWedding = afterWeddingItems.filter((item) => item.completed);
        if (completedAfterWedding.length > 0) {
          // Pick the closest to wedding day (e.g., -1 over -3)
          userProgressMonths = Math.max(
            ...completedAfterWedding.map((item) => item.monthsBeforeWedding),
          );
        }
      }
    } else {
      if (firstUncompletedItem) {
        // User progress is at the first uncompleted item
        userProgressMonths = firstUncompletedItem.monthsBeforeWedding;
      } else {
        // All items completed - use the latest completed item
        if (latestCompletedMonths !== null) {
          userProgressMonths = latestCompletedMonths;
        }
      }
    }

    // Determine schedule status
    let scheduleStatus: 'ahead' | 'behind' | 'on_schedule' | 'wedding_day' | 'post_wedding';

    if (monthsUntilWedding <= 0) {
      scheduleStatus = monthsUntilWedding === 0 ? 'wedding_day' : 'post_wedding';
    } else {
      // Consider only pre-wedding items when comparing against current month
      const preWeddingItems = [...timelineItems]
        .filter((it) => !it.isWeddingDay && it.monthsBeforeWedding > 0)
        .sort((a, b) => {
          const monthDiff = b.monthsBeforeWedding - a.monthsBeforeWedding;
          // Add stable secondary sort by ID to prevent position jumping
          return monthDiff !== 0 ? monthDiff : a.id.localeCompare(b.id);
        });

      const preCompleted = preWeddingItems.filter((it) => it.completed);
      const preUncompleted = preWeddingItems.filter((it) => !it.completed);
      const latestCompletedPreMonths =
        preCompleted.length > 0
          ? Math.min(...preCompleted.map((it) => it.monthsBeforeWedding))
          : null;

      // Overdue if any uncompleted item exists earlier than current month (i.e., with a larger monthsBeforeWedding number)
      const overdueExists = preUncompleted.some(
        (it) => it.monthsBeforeWedding > monthsUntilWedding,
      );

      if (overdueExists || userProgressMonths > monthsUntilWedding) {
        scheduleStatus = 'behind';
      } else {
        // Gap exists if there is any uncompleted item between the farthest completed pre-wedding month and the current month
        const gapExists = preUncompleted.some(
          (it) =>
            it.monthsBeforeWedding <= monthsUntilWedding &&
            (latestCompletedPreMonths === null ||
              it.monthsBeforeWedding > latestCompletedPreMonths),
        );

        if (
          latestCompletedPreMonths !== null &&
          latestCompletedPreMonths < monthsUntilWedding &&
          !gapExists
        ) {
          scheduleStatus = 'ahead';
        } else {
          scheduleStatus = 'on_schedule';
        }
      }
    }

    console.log('Progress Info:', {
      userProgressMonths,
      currentTimeMonths: monthsUntilWedding,
      latestCompletedMonths,
      latestCompletedPreMonths: ((): number | null => {
        const preCompleted = timelineItems.filter(
          (it) => !it.isWeddingDay && it.monthsBeforeWedding > 0 && it.completed,
        );
        return preCompleted.length > 0
          ? Math.min(...preCompleted.map((it) => it.monthsBeforeWedding))
          : null;
      })(),
      scheduleStatus,
      sortedItemsCount: sortedItems.length,
      firstUncompletedItem: firstUncompletedItem ? firstUncompletedItem.title : 'None',
    });

    return {
      userProgressMonths,
      currentTimeMonths: monthsUntilWedding,
      scheduleStatus,
    };
  }, [timelineItems, selectedWedding]);

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
        return 'bg-red-500 border-red-500';
      case 'upcoming':
        return `bg-chart-4 border-chart-4 ${opacity}`;
      default:
        return `bg-brand-200 border-brand-200 ${opacity}`;
    }
  };

  // Helper: Is the given item the last displayed in its row (where the path turns down)?
  const isEndOfDisplayedRow = (targetId: string, rowIndex: number) => {
    if (!timelineItems.length || itemsPerRow <= 0) return false;
    const start = rowIndex * itemsPerRow;
    const slice = timelineItems.slice(start, start + itemsPerRow);
    const display = rowIndex % 2 === 1 ? [...slice].reverse() : slice;
    if (display.length === 0) return false;
    return display[display.length - 1]?.id === targetId;
  };

  // Helper function to find position along the timeline path for a given monthsBeforeWedding
  // If multiple items exist at the same monthsBeforeWedding, find based on completion status
  const getTimelinePosition = (
    monthsBeforeWedding: number,
    preferFirstUncompleted: boolean = false,
  ) => {
    // Find all items with matching monthsBeforeWedding
    const matchingItems = timelineItems.filter(
      (item) => item.monthsBeforeWedding === monthsBeforeWedding,
    );

    let targetItem: TimelineItem | undefined;

    if (matchingItems.length > 0 || !preferFirstUncompleted) {
      if (preferFirstUncompleted) {
        // For user progress: prioritize first uncompleted item, or last completed item
        const uncompletedItems = matchingItems.filter((item) => !item.completed);
        const completedItems = matchingItems.filter((item) => item.completed);

        if (uncompletedItems.length > 0) {
          // Use first uncompleted item
          targetItem = uncompletedItems[0];
          console.log(
            `User progress at first uncompleted: ${targetItem.title} (${uncompletedItems.length} uncompleted items at ${monthsBeforeWedding} months)`,
          );
        } else if (completedItems.length > 0) {
          // If all completed, use last completed item
          targetItem = completedItems[completedItems.length - 1];
          console.log(
            `User progress at last completed: ${targetItem.title} (${completedItems.length} completed items at ${monthsBeforeWedding} months)`,
          );
        } else {
          // Fallback to first item
          targetItem = matchingItems[0];
        }
      } else {
        // For current time: prefer the last item from the closest previous month group
        const previousMonthItems = timelineItems.filter(
          (it) => it.monthsBeforeWedding > monthsBeforeWedding,
        );
        if (previousMonthItems.length > 0) {
          const closestPrevMonth = Math.min(
            ...previousMonthItems.map((it) => it.monthsBeforeWedding),
          );
          const prevGroup = timelineItems.filter(
            (it) => it.monthsBeforeWedding === closestPrevMonth,
          );
          if (prevGroup.length > 0) {
            targetItem = prevGroup[prevGroup.length - 1];
          }
        }
        // If no previous month group found, fallback to the last item in the current month group
        if (!targetItem && matchingItems.length > 0) {
          targetItem = matchingItems[matchingItems.length - 1];
        }
      }
    }

    // If no exact match, find the closest item
    if (!targetItem && timelineItems.length > 0) {
      targetItem = timelineItems.reduce((closest, item) => {
        const closestDiff = Math.abs(closest.monthsBeforeWedding - monthsBeforeWedding);
        const itemDiff = Math.abs(item.monthsBeforeWedding - monthsBeforeWedding);
        return itemDiff < closestDiff ? item : closest;
      }, timelineItems[0]);

      console.log(
        `No exact match for ${monthsBeforeWedding} months, using closest: ${targetItem.monthsBeforeWedding} months (${targetItem.title})`,
      );
    }

    if (targetItem) {
      const el = dotRefs.current[targetItem.id];
      if (el && containerRef.current) {
        const rect = el.getBoundingClientRect();
        const crect = containerRef.current.getBoundingClientRect();
        const index = timelineItems.findIndex((it) => it.id === targetItem!.id);
        const rowIndex = index >= 0 ? Math.floor(index / itemsPerRow) : 0;
        return {
          x: rect.left - crect.left + rect.width / 2,
          y: rect.top - crect.top + rect.height / 2,
          id: targetItem.id,
          rowIndex,
        } as { x: number; y: number; id: string; rowIndex: number };
      }
    }
    return null;
  };

  // Compute smooth SVG path that snakes through dots across rows
  const recomputePath = useCallback(() => {
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
  }, [rows]);

  useEffect(() => {
    recomputePath();
  }, [rows, recomputePath]);

  // Recompute on window resize
  useEffect(() => {
    const onResize = () => {
      recomputePath();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [recomputePath]);

  // Recompute on scroll within the container so the path stays aligned during scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      recomputePath();
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [rows, recomputePath]);

  // Recompute when sidebar opens/closes (layout shifts without window resize)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      recomputePath();
    });
    return () => cancelAnimationFrame(id);
  }, [open, openMobile, rows, recomputePath]);

  // Observe container size changes (e.g., row wrapping, font load, sidebar shift)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      recomputePath();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [rows, recomputePath]);

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
          className="scrollbar-hide flex-1 overflow-x-hidden overflow-y-auto px-16 pt-8 pb-20"
        >
          {/* Legend at top */}
          <div className="mb-16 ml-[-52px]">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="bg-chart-4 h-3 w-3 rounded-full"></div>
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
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-gradient-to-br from-sky-400 to-teal-500 shadow-sm">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
                <span>Wedding Day</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Note: Timeline shows target completion months relative to your wedding date. Tasks
              should be completed by the specified month.
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

            {/* Progress Indicators */}
            {progressInfo && (
              <>
                {/* User Progress Position */}
                {(() => {
                  const userPosition = (() => {
                    // Edge case: When it's the wedding day, anchor icon to the Wedding Day dot
                    if (progressInfo.scheduleStatus === 'wedding_day') {
                      const el = dotRefs.current['wedding-day'];
                      if (el && containerRef.current) {
                        const rect = el.getBoundingClientRect();
                        const crect = containerRef.current.getBoundingClientRect();
                        const index = timelineItems.findIndex((it) => it.id === 'wedding-day');
                        const rowIndex = index >= 0 ? Math.floor(index / itemsPerRow) : 0;
                        return {
                          x: rect.left - crect.left + rect.width / 2,
                          y: rect.top - crect.top + rect.height / 2,
                          id: 'wedding-day',
                          rowIndex,
                        } as { x: number; y: number; id: string; rowIndex: number };
                      }
                      return null;
                    }
                    // Default: use computed user progress position
                    return getTimelinePosition(progressInfo.userProgressMonths, true);
                  })();
                  if (!userPosition) return null;

                  const isEvenNumberedRow = ((userPosition.rowIndex ?? 0) + 1) % 2 === 0;
                  const endOfRow = isEndOfDisplayedRow(userPosition.id, userPosition.rowIndex ?? 0);

                  let imageSrc = '';
                  let label = '';
                  let shouldAnimate = false;
                  const localRunKeyframes = `
                    @keyframes youAreHereRun {
                      0%, 100% { transform: translateY(0) rotate(0deg); }
                      25% { transform: translateY(-8px) rotate(-3deg); }
                      50% { transform: translateY(0) rotate(0deg); }
                      75% { transform: translateY(-8px) rotate(3deg); }
                    }
                  `;

                  switch (progressInfo.scheduleStatus) {
                    case 'behind':
                      imageSrc = '/images/progress-timeline-icons/you_are_here_behind_schedule.png';
                      label = 'You are here';
                      shouldAnimate = true;
                      break;
                    case 'ahead':
                      imageSrc = '/images/progress-timeline-icons/you_are_here_ahead_schedule.png';
                      label = 'You are here';
                      break;
                    case 'on_schedule':
                      imageSrc = '/images/progress-timeline-icons/time_now_on_schedule.png';
                      label = 'You are here';
                      break;
                    case 'wedding_day':
                      imageSrc = '/images/progress-timeline-icons/wedding_day.png';
                      label = 'You are here';
                      break;
                    case 'post_wedding':
                      imageSrc = '/images/progress-timeline-icons/post_wedding.png';
                      label = 'You are here';
                      break;
                  }

                  return (
                    <div
                      className="absolute z-20 flex flex-col items-center"
                      style={{
                        left: endOfRow
                          ? userPosition.x - 50
                          : progressInfo.scheduleStatus === 'wedding_day'
                            ? userPosition.x - 46
                            : isEvenNumberedRow
                              ? userPosition.x + 40
                              : userPosition.x - 140,
                        top: endOfRow
                          ? userPosition.y - 100
                          : progressInfo.scheduleStatus === 'wedding_day'
                            ? userPosition.y - 100
                            : userPosition.y - 60,
                      }}
                    >
                      {/* Local animation keyframes to avoid relying on global CSS */}
                      <style>{localRunKeyframes}</style>
                      <span className="text-brand-500 mb-[-4px] text-xs font-black whitespace-nowrap">
                        {label}
                      </span>
                      <div
                        className={`text-brand-500 ${endOfRow ? 'mb-[-22px]' : 'mb-[-12px]'} text-xs`}
                      >
                        ▼
                      </div>
                      <div
                        style={{
                          display: 'inline-block',
                          transformOrigin: '50% 80%',
                          willChange: 'transform',
                          animation: shouldAnimate
                            ? 'youAreHereRun 0.6s ease-in-out infinite'
                            : undefined,
                        }}
                      >
                        <Image
                          src={imageSrc}
                          alt={label}
                          width={96}
                          height={96}
                          className={`${shouldAnimate && 'pt-2'} h-24 w-24`}
                          style={{
                            transform:
                              // At end of row, face the direction the next row will flow
                              // In even rows (R->L), at end we're on left, next row goes L->R, so face right
                              // In odd rows (L->R), at end we're on right, next row goes R->L, so face left
                              endOfRow
                                ? isEvenNumberedRow
                                  ? undefined // Face right for next row
                                  : 'scaleX(-1)' // Face left for next row
                                : isEvenNumberedRow
                                  ? 'scaleX(-1)' // Face left in even rows (timeline goes R->L)
                                  : undefined, // Face right in odd rows (timeline goes L->R)
                          }}
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Current Time Position (only for behind/ahead scenarios) */}
                {(progressInfo.scheduleStatus === 'behind' ||
                  progressInfo.scheduleStatus === 'ahead') &&
                  (() => {
                    const timePosition = getTimelinePosition(progressInfo.currentTimeMonths);
                    if (!timePosition) return null;

                    const isEvenNumberedRow = ((timePosition.rowIndex ?? 0) + 1) % 2 === 0;
                    const endOfRow = isEndOfDisplayedRow(
                      timePosition.id,
                      timePosition.rowIndex ?? 0,
                    );

                    const imageSrc =
                      progressInfo.scheduleStatus === 'behind'
                        ? '/images/progress-timeline-icons/time_now_behind_schedule.png'
                        : '/images/progress-timeline-icons/time_now_ahead_schedule.png';

                    return (
                      <div
                        className="absolute z-20 flex flex-col items-center"
                        style={{
                          left: endOfRow
                            ? timePosition.x - 50
                            : isEvenNumberedRow
                              ? timePosition.x - 140
                              : timePosition.x + 40,
                          top: endOfRow ? timePosition.y + 80 : timePosition.y - 60,
                        }}
                      >
                        <span className="text-brand-500 mb-[-4px] text-xs font-black whitespace-nowrap">
                          Current month
                        </span>
                        <div
                          className={`text-brand-500 ${endOfRow ? 'mb-[-18px]' : 'mb-[-12px]'} text-xs`}
                        >
                          ▼
                        </div>
                        <Image
                          src={imageSrc}
                          alt="Current month"
                          width={96}
                          height={96}
                          className="h-24 w-24"
                          style={{
                            transform:
                              endOfRow
                                ? isEvenNumberedRow
                                  ? undefined // Face right for next row
                                  : 'scaleX(-1)' // Face left for next row
                                : isEvenNumberedRow
                                  ? 'scaleX(-1)' // Face left in even rows
                                  : undefined, // Face right in odd rows
                          }}
                        />
                      </div>
                    );
                  })()}
              </>
            )}

            {/* Snaking Timeline */}
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative mb-26">
                {/* Row container */}
                <div className={'relative flex flex-row items-start justify-between'}>
                  {/* Timeline items for this row */}
                  {row.items.map((item, itemIndex) => {
                    const isHovered = hoveredItem === item.id;
                    const dotSize = isHovered ? 'w-6 h-6' : 'w-4 h-4';
                    const isDomFirst = itemIndex === 0;
                    const isDomLast = itemIndex === row.items.length - 1;
                    const isLeftmost = isDomFirst;
                    const isRightmost = isDomLast;
                    const smartPosition = getSmartPopupPosition(isLeftmost, isRightmost);
                    const hoverStyle: React.CSSProperties = {
                      top: rowIndex % 2 === 0 ? '60px' : '-120px',
                      ...smartPosition,
                      minWidth: '256px', // min-w-64
                      maxWidth: '320px', // max-w-80
                    };
                    return (
                      <div
                        key={item.id}
                        className={`relative flex cursor-pointer flex-col items-center ${isHovered ? 'z-50' : item.isWeddingDay ? 'z-30' : 'z-10'}`}
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
                            {/* Header with title and toggle button */}
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <div className="text-sm font-semibold text-gray-800">
                                {item.title}
                              </div>
                              {onToggleCompletion && (
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await onToggleCompletion(item.id, !item.completed);
                                  }}
                                  className="hover:bg-brand-50 flex-shrink-0 rounded-full p-1 transition-colors"
                                  title={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                >
                                  {item.completed ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-gray-400" />
                                  )}
                                </button>
                              )}
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
                                  <span className="font-medium text-yellow-600">⏰ Upcoming</span>
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
                              ? 'h-12 w-12 -mt-4 transform cursor-pointer border-4 border-white bg-gradient-to-br from-sky-400 to-teal-500 shadow-lg ring-2 ring-teal-300 hover:scale-110 hover:shadow-xl'
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
                          <div className="absolute -top-1 right-6 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">
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
                                  <Calendar className="h-5 w-5 text-teal-500" />
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
                              <div className="scrollbar-hide max-h-80 space-y-3 overflow-y-auto">
                                {item.branchItems?.map((branchItem) => (
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
                              ? 'max-w-40 text-base font-bold text-teal-700'
                              : `max-w-32 text-xs ${isHovered ? 'text-gray-900' : 'text-gray-700'}`
                          }`}
                        >
                          {item.title}
                        </div>

                        {/* Month label with CTA for Wedding Day */}
                        <div
                          className={`mt-1 min-w-0 text-center transition-colors duration-200 ${
                            item.isWeddingDay
                              ? 'cursor-pointer text-sm font-semibold text-teal-700 hover:text-teal-800'
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
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-gray-500">
          <p className="text-lg">
            Please choose a wedding date for the timeline overview to be displayed.
          </p>
          <p className="text-sm">
            If you need help finding a date, use our{' '}
            <Link
              href="/admin/date-optimizer"
              className="text-brand-500 hover:text-brand-700 font-medium underline"
            >
              Date Optimizer
            </Link>
          </p>
        </div>
      )}

      {/* Legend moved to top; bottom legend removed */}
    </div>
  );
}
