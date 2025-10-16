'use client';

import { useMemo } from 'react';

import { WeddingDateData } from '@shared/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@shared/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

interface AdminWeddingDatesHeatmapProps {
  weddingDatesData?: {
    data: WeddingDateData[];
    totalWeddings: number;
  };
  isLoading?: boolean;
}

export const AdminWeddingDatesHeatmap = ({
  weddingDatesData,
  isLoading,
}: AdminWeddingDatesHeatmapProps) => {
  const chartData = useMemo(() => {
    if (!weddingDatesData?.data || weddingDatesData.data.length === 0) return [];

    // Group by month and aggregate counts
    const monthlyData: { [key: string]: number } = {};

    weddingDatesData.data.forEach((item) => {
      const date = new Date(item.date);
      const monthKey = date.toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      });

      if (monthlyData[monthKey]) {
        monthlyData[monthKey] += item.count;
      } else {
        monthlyData[monthKey] = item.count;
      }
    });

    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([month, count]) => ({
        month,
        weddings: count,
        fill: count > 10 ? '#ef4444' : count > 5 ? '#f59e0b' : count > 2 ? '#10b981' : '#3b82f6',
      }))
      .slice(0, 12); // Show only last 12 months
  }, [weddingDatesData]);

  const chartConfig: ChartConfig = {
    weddings: {
      label: 'Weddings',
      color: '#10b981',
    },
  };

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader>
        <CardTitle>Wedding Dates Heatmap</CardTitle>
        <CardDescription>Number of weddings scheduled per month</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No wedding date data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart data={chartData}>
              <XAxis
                dataKey="month"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value: number, _name: string, item: { payload: { month: string } }) => (
                      <>
                        <div className="font-semibold text-xs mb-1">{item.payload.month}</div>
                        <div className="text-sm">
                          {value} wedding{value !== 1 ? 's' : ''} scheduled
                        </div>
                      </>
                    )}
                  />
                }
              />
              <Bar dataKey="weddings" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
