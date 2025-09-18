import { useState } from 'react';

import { HallLayout, SeatingResult } from '../../../../lib/seating';
import { Card } from '@shared/components/ui/card';
import { Skeleton } from '@shared/components/ui/skeleton';

interface SeatingVisualizationProps {
  layout: HallLayout;
  seatingResult?: SeatingResult | null;
  isLoading?: boolean;
}

export function SeatingVisualization({
  layout,
  seatingResult,
  isLoading,
}: SeatingVisualizationProps) {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Wedding Hall Layout</h3>
        <Skeleton className="w-full h-[600px]" />
      </div>
    );
  }

  // Calculate responsive canvas dimensions
  const padding = 8;
  const maxX = Math.max(...layout.tables.map((t) => t.x)) + padding;
  const maxY = Math.max(...layout.tables.map((t) => t.y)) + padding;
  const minX = Math.min(...layout.tables.map((t) => t.x)) - padding;
  const minY = Math.min(...layout.tables.map((t) => t.y)) - padding;

  const width = maxX - minX;
  const height = maxY - minY;
  const baseScale = 25;
  const tableRadius = baseScale * 0.6;

  return (
    <div className="space-y-6">
      {/* Main Hall Visualization */}
      <div className="relative bg-gradient-to-b from-brand-50 to-brand-100 border border-brand-200 rounded-2xl p-6 overflow-hidden shadow-lg">
        {/* Wedding Hall Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="floral" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="2" fill="#d97706" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#floral)" />
          </svg>
        </div>

        <div className="relative overflow-auto">
          <svg
            width="100%"
            height="600"
            viewBox={`${minX * baseScale} ${minY * baseScale} ${width * baseScale} ${height * baseScale}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Hall Floor */}
            <rect
              x={minX * baseScale}
              y={minY * baseScale}
              width={width * baseScale}
              height={height * baseScale}
              fill="#ffffff"
              stroke="#e5e7eb"
              strokeWidth="2"
              rx="12"
            />

            {/* Gradient Definitions */}
            <defs>
              <radialGradient id="hallGradient" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fed7aa" />
              </radialGradient>
              <linearGradient id="stageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="aisleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="50%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#fef3c7" />
              </linearGradient>
              <filter id="tableShadow">
                <feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Center Aisle */}
            <rect
              x={minX * baseScale + (width * baseScale) / 2 - 40}
              y={minY * baseScale + 30}
              width="80"
              height={height * baseScale - 60}
              fill="#f9fafb"
              rx="40"
              opacity="0.9"
              stroke="#d1d5db"
              strokeWidth="2"
              strokeDasharray="8,4"
            />

            {/* Stage/Altar Area */}
            <g>
              <rect
                x={minX * baseScale + 20}
                y={minY * baseScale + 10}
                width={width * baseScale - 40}
                height={baseScale * 2}
                fill="#f9fafb"
                stroke="#d1d5db"
                strokeWidth="2"
                rx="8"
              />
              <text
                x={minX * baseScale + (width * baseScale) / 2}
                y={minY * baseScale + 10 + baseScale}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-lg font-bold"
                fill="#374151"
                style={{ fontSize: '18px' }}
              >
                WEDDING STAGE
              </text>
            </g>

            {/* Tables */}
            {layout.tables.map((table) => {
              const assignedGuests = seatingResult?.seating_arrangement?.[table.id] || [];
              const isOccupied = assignedGuests.length > 0;
              const isOverCapacity = assignedGuests.length > table.capacity;
              const isSelected = selectedTable === table.id;

              return (
                <g
                  key={table.id}
                  className="cursor-pointer transition-all duration-200 hover:opacity-80"
                  onClick={() => setSelectedTable(isSelected ? null : table.id)}
                >
                  {/* Table Shadow */}
                  <circle
                    cx={table.x * baseScale + 3}
                    cy={(maxY - table.y) * baseScale + 3}
                    r={tableRadius}
                    fill="#00000020"
                  />

                  {/* Main Table */}
                  <circle
                    cx={table.x * baseScale}
                    cy={(maxY - table.y) * baseScale}
                    r={tableRadius}
                    fill={
                      isOverCapacity
                        ? '#fca5a5' // red-300
                        : isOccupied
                          ? '#86efac' // green-300
                          : '#f3f4f6' // gray-100
                    }
                    stroke={
                      isSelected
                        ? '#3b82f6' // blue-500
                        : isOverCapacity
                          ? '#dc2626' // red-600
                          : isOccupied
                            ? '#059669' // emerald-600
                            : '#9ca3af' // gray-400
                    }
                    strokeWidth={isSelected ? '4' : '2'}
                    filter="url(#tableShadow)"
                  />

                  {/* Table Inner Ring */}
                  <circle
                    cx={table.x * baseScale}
                    cy={(maxY - table.y) * baseScale}
                    r={tableRadius * 0.7}
                    fill="none"
                    stroke={isOccupied ? '#ffffff80' : '#00000020'}
                    strokeWidth="1"
                  />

                  {/* Table Number */}
                  <text
                    x={table.x * baseScale}
                    y={(maxY - table.y) * baseScale + 5}
                    textAnchor="middle"
                    className="font-bold pointer-events-none"
                    fill={isOccupied ? '#1f2937' : '#6b7280'}
                    style={{ fontSize: '14px' }}
                  >
                    {table.id}
                  </text>

                  {/* Guest Count Badge */}
                  {isOccupied && (
                    <g>
                      <circle
                        cx={table.x * baseScale + tableRadius * 0.6}
                        cy={(maxY - table.y) * baseScale - tableRadius * 0.6}
                        r="12"
                        fill={isOverCapacity ? '#dc2626' : '#059669'}
                      />
                      <text
                        x={table.x * baseScale + tableRadius * 0.6}
                        y={(maxY - table.y) * baseScale - tableRadius * 0.6 + 4}
                        textAnchor="middle"
                        className="font-bold fill-white pointer-events-none"
                        style={{ fontSize: '10px' }}
                      >
                        {assignedGuests.length}
                      </text>
                    </g>
                  )}

                  {/* Chairs around table */}
                  {Array.from({ length: table.capacity }, (_, i) => {
                    const angle = (i * 2 * Math.PI) / table.capacity;
                    const chairRadius = tableRadius + 8;
                    const chairX = table.x * baseScale + chairRadius * Math.cos(angle);
                    const chairY = (maxY - table.y) * baseScale + chairRadius * Math.sin(angle);
                    const hasGuest = i < assignedGuests.length;

                    return (
                      <circle
                        key={`chair-${i}`}
                        cx={chairX}
                        cy={chairY}
                        r="4"
                        fill={hasGuest ? '#3b82f6' : '#e5e7eb'}
                        stroke={hasGuest ? '#1d4ed8' : '#9ca3af'}
                        strokeWidth="1"
                        className="pointer-events-none"
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm bg-white/70 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-100 border-2 border-gray-400"></div>
            <span>Empty Table</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-300 border-2 border-emerald-600"></div>
            <span>Seated Table</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-200 border-2 border-blue-500"></div>
            <span>Occupied Chair</span>
          </div>
        </div>
      </div>

      {/* Table Assignments Overview */}
      {seatingResult?.seating_arrangement && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Table Assignments</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(seatingResult.seating_arrangement)
              .filter(([, guests]) => guests.length > 0)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([tableId, guests]) => (
                <Card key={tableId} className="p-4">
                  <h5 className="font-semibold mb-3 text-brand-600">
                    Table {tableId} ({guests.length} guests)
                  </h5>
                  <div className="space-y-2">
                    {guests.map((guest, index) => (
                      <div
                        key={index}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
                        {guest}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Constraint Violations */}
      {seatingResult?.violated_constraints && seatingResult.violated_constraints.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Seating Constraints</h4>
          <div className="space-y-2">
            {seatingResult.violated_constraints.map((violation, index) => (
              <p key={index} className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
                • {violation}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
