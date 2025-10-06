import React from 'react';
import { STAT_LABELS } from '../constants';
import { AttendanceStats as AttendanceStatsType } from '../types';

/**
 * Props for the AttendanceStats component
 */
interface AttendanceStatsProps {
  stats: AttendanceStatsType;
}

/**
 * Display attendance statistics in a grid layout
 */
export const AttendanceStats = React.memo<AttendanceStatsProps>(({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
      <StatCard
        value={stats.totalConfirmed}
        label={STAT_LABELS.TOTAL_CONFIRMED}
        colorClass="text-brand-600"
      />
      <StatCard value={stats.present} label={STAT_LABELS.PRESENT} colorClass="text-green-600" />
      <StatCard
        value={stats.notPresent}
        label={STAT_LABELS.NOT_PRESENT}
        colorClass="text-red-600"
      />
    </div>
  );
});

AttendanceStats.displayName = 'AttendanceStats';

/**
 * Individual stat card component
 */
interface StatCardProps {
  value: number;
  label: string;
  colorClass: string;
}

const StatCard = React.memo<StatCardProps>(({ value, label, colorClass }) => {
  return (
    <div className="bg-transparent border-brand-200 rounded-lg border p-3 sm:p-4">
      <div className={`text-xl sm:text-2xl font-bold ${colorClass}`}>{value}</div>
      <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
    </div>
  );
});

StatCard.displayName = 'StatCard';
