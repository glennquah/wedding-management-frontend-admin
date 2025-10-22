'use client';

import { useMemo } from 'react';

import { AdminBookingsOverTimeResponseDto } from '@shared/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@shared/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import { Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

interface AdminBookingsOverTimeChartProps {
  bookingsOverTime?: AdminBookingsOverTimeResponseDto;
  isLoading?: boolean;
  period?: 'MONTHLY' | 'YEARLY' | 'ALL';
  onPeriodChange?: (period: 'MONTHLY' | 'YEARLY' | 'ALL') => void;
}

export const AdminBookingsOverTimeChart = ({
  bookingsOverTime,
  isLoading,
  period = 'YEARLY',
  onPeriodChange,
}: AdminBookingsOverTimeChartProps) => {
  const chartData = useMemo(() => {
    if (!bookingsOverTime?.data || bookingsOverTime.data.length === 0) return [];

    // Format the data for the chart
    return bookingsOverTime.data.map((item) => {
      let label = item.period;

      // Format based on period type
      if (bookingsOverTime.periodType === 'MONTHLY') {
        // MONTHLY returns daily data (YYYY-MM-DD)
        const date = new Date(item.period);
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      } else if (
        bookingsOverTime.periodType === 'YEARLY' ||
        bookingsOverTime.periodType === 'ALL'
      ) {
        // YEARLY and ALL return monthly data (YYYY-MM)
        const date = new Date(item.period + '-01');
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        });
      }

      return {
        period: label,
        bookings: item.bookingCount,
        revenue: item.revenue,
      };
    });
  }, [bookingsOverTime]);

  const chartConfig = {
    bookings: {
      label: 'Bookings',
      color: '#3b82f6',
    },
  };

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Platform Bookings Over Time</CardTitle>
            <CardDescription>
              {period === 'MONTHLY'
                ? 'Daily breakdown for current month'
                : period === 'YEARLY'
                  ? 'Monthly breakdown for current year'
                  : 'Monthly breakdown for all time'}
            </CardDescription>
          </div>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-[130px] border-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
              <SelectItem value="ALL">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No booking data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart data={chartData}>
              <XAxis
                dataKey="period"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `${value}`}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => {
                  if (value === 'bookings') return 'Bookings';
                  return value;
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(
                      value: number,
                      name: string,
                      item: { payload: { revenue: number } },
                    ) => (
                      <>
                        <div className="font-semibold">
                          {name === 'bookings' ? 'Bookings' : name}: {value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Revenue: {bookingsOverTime?.currency}
                          {Number(item.payload.revenue).toFixed(2)}
                        </div>
                      </>
                    )}
                  />
                }
              />
              <Line
                dataKey="bookings"
                type="monotone"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
