'use client';

import { useMemo } from 'react';

import { MonthlyRevenueData } from '@shared/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@shared/components/ui/chart';
import { Line, LineChart, XAxis, YAxis } from 'recharts';

interface VendorRevenueLineChartProps {
  revenueOverTime?: {
    monthlyData: MonthlyRevenueData[];
    currency: string;
  };
  isLoading?: boolean;
}

export const VendorRevenueLineChart = ({
  revenueOverTime,
  isLoading,
}: VendorRevenueLineChartProps) => {
  const chartData = useMemo(() => {
    if (!revenueOverTime?.monthlyData || revenueOverTime.monthlyData.length === 0) return [];

    // Format the data for the chart
    return revenueOverTime.monthlyData.map((item) => {
      const date = new Date(item.month + '-01');
      return {
        month: date.toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        }),
        revenue: item.revenue,
        orderCount: item.orderCount,
      };
    });
  }, [revenueOverTime]);

  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: '#10b981',
    },
  };

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
        <CardDescription>Monthly revenue performance</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No revenue data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart data={chartData}>
              <XAxis
                dataKey="month"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value: number, name: string, item: any) => (
                      <>
                        <div className="font-semibold">
                          Revenue: {revenueOverTime?.currency}
                          {Number(value).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.payload.orderCount} order{item.payload.orderCount !== 1 ? 's' : ''}
                        </div>
                      </>
                    )}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
