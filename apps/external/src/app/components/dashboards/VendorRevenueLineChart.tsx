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

interface VendorRevenueLineChartProps {
  revenueOverTime?: RevenueOverTimeResponseDto;
  isLoading?: boolean;
  period?: 'MONTHLY' | 'YEARLY' | 'ALL';
  onPeriodChange?: (period: 'MONTHLY' | 'YEARLY' | 'ALL') => void;
}

export const VendorRevenueLineChart = ({
  revenueOverTime,
  isLoading,
  period = 'MONTHLY',
  onPeriodChange,
}: VendorRevenueLineChartProps) => {
  const chartData = useMemo(() => {
    if (!revenueOverTime?.data || revenueOverTime.data.length === 0) return [];

    // Find the index where predictions start
    const firstPredictedIndex = revenueOverTime.data.findIndex((item) => item.isPredictedValue);

    // Format the data for the chart
    return revenueOverTime.data.map((item, index) => {
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

      // Determine revenue and predictedRevenue values
      let revenue: number | null = item.revenue;
      let predictedRevenue: number | null = null;

      if (firstPredictedIndex !== -1) {
        // Include the last actual value as the starting point for the predicted line
        if (index === firstPredictedIndex - 1 || index >= firstPredictedIndex) {
          predictedRevenue = item.revenue;
        }
        // Hide revenue values at and after predictions start
        if (index >= firstPredictedIndex) {
          revenue = null;
        }
      }

      return {
        period: label,
        revenue,
        predictedRevenue,
        orderCount: item.orderCount,
        isPredicted: item.isPredictedValue,
      };
    });
  }, [revenueOverTime]);

  // Check if we have any predicted values
  const hasPredictedValues = useMemo(() => chartData.some((item) => item.isPredicted), [chartData]);

  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: '#10b981',
    },
    predictedRevenue: {
      label: 'Predicted',
      color: '#3b82f6',
    },
  };

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Over Time</CardTitle>
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
                  if (value === 'predictedRevenue') return 'Predicted';
                  return value;
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(
                      value: number,
                      _name: string,
                      item: { payload: { orderCount: number; isPredicted: boolean } },
                    ) => (
                      <>
                        <div className="font-semibold">
                          {item.payload.isPredicted ? 'Predicted Revenue' : 'Revenue'}:{' '}
                          {revenueOverTime?.currency}
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
              {hasPredictedValues && (
                <Line
                  type="monotone"
                  dataKey="predictedRevenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={(props: {
                    cx?: number;
                    cy?: number;
                    index?: number;
                    payload?: { predictedRevenue: number | null };
                  }) => {
                    // Only render visible dot if there's a predictedRevenue value
                    if (!props.payload?.predictedRevenue) {
                      return <circle cx={props.cx} cy={props.cy} r={0} fill="transparent" />;
                    }

                    const firstPredictedIndex = chartData.findIndex((item) => item.isPredicted);
                    const isConnectionPoint = props.index === firstPredictedIndex - 1;
                    const fill = isConnectionPoint ? '#10b981' : '#3b82f6';
                    return <circle cx={props.cx} cy={props.cy} r={4} fill={fill} />;
                  }}
                  connectNulls
                />
              )}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
