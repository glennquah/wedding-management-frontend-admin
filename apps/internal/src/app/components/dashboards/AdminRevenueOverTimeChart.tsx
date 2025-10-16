'use client';

import { useMemo } from 'react';

import { RevenueOverTimeResponseDto } from '@shared/api';
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

interface AdminRevenueOverTimeChartProps {
  revenueOverTime?: RevenueOverTimeResponseDto;
  isLoading?: boolean;
  period?: 'MONTHLY' | 'YEARLY' | 'ALL';
  onPeriodChange?: (period: 'MONTHLY' | 'YEARLY' | 'ALL') => void;
}

export const AdminRevenueOverTimeChart = ({
  revenueOverTime,
  isLoading,
  period = 'YEARLY',
  onPeriodChange,
}: AdminRevenueOverTimeChartProps) => {
  const chartData = useMemo(() => {
    if (!revenueOverTime?.data || revenueOverTime.data.length === 0) return [];

    // Format the data for the chart
    return revenueOverTime.data.map((item) => {
      let label = item.period;

      // Format based on period type
      if (revenueOverTime.periodType === 'MONTHLY') {
        // MONTHLY returns daily data (YYYY-MM-DD)
        const date = new Date(item.period);
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      } else if (revenueOverTime.periodType === 'YEARLY' || revenueOverTime.periodType === 'ALL') {
        // YEARLY and ALL return monthly data (YYYY-MM)
        const date = new Date(item.period + '-01');
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        });
      }

      return {
        period: label,
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Platform Revenue Over Time</CardTitle>
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
            No revenue data available
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
                  if (value === 'revenue') return 'Revenue';
                  return value;
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(
                      value: number,
                      _name: string,
                      item: { payload: { orderCount: number } },
                    ) => (
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
                connectNulls
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
