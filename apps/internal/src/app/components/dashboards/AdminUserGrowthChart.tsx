'use client';

import { useMemo } from 'react';

import { AdminUserGrowthResponseDto } from '@shared/api';
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

interface AdminUserGrowthChartProps {
  userGrowthData?: AdminUserGrowthResponseDto;
  isLoading?: boolean;
  period?: 'MONTHLY' | 'YEARLY' | 'ALL';
  onPeriodChange?: (period: 'MONTHLY' | 'YEARLY' | 'ALL') => void;
}

export const AdminUserGrowthChart = ({
  userGrowthData,
  isLoading,
  period = 'YEARLY',
  onPeriodChange,
}: AdminUserGrowthChartProps) => {
  const chartData = useMemo(() => {
    if (!userGrowthData?.data || userGrowthData.data.length === 0) return [];

    // Format the data for the chart
    return userGrowthData.data.map((item) => {
      let label = item.period;

      // Format based on period type
      if (userGrowthData.periodType === 'MONTHLY') {
        // MONTHLY returns daily data (YYYY-MM-DD)
        const date = new Date(item.period);
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      } else if (userGrowthData.periodType === 'YEARLY' || userGrowthData.periodType === 'ALL') {
        // YEARLY and ALL return monthly data (YYYY-MM)
        const date = new Date(item.period + '-01');
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        });
      }

      return {
        period: label,
        vendors: item.vendorSignups,
        couples: item.coupleSignups,
      };
    });
  }, [userGrowthData]);

  const chartConfig = {
    vendors: {
      label: 'Vendors',
      color: '#3b82f6',
    },
    couples: {
      label: 'Couples',
      color: '#ec4899',
    },
  };

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>
              {period === 'MONTHLY'
                ? 'Daily signups for current month'
                : period === 'YEARLY'
                  ? 'Monthly signups for current year'
                  : 'Monthly signups for all time'}
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
            No user growth data available
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
                  if (value === 'vendors') return 'Vendors';
                  if (value === 'couples') return 'Couples';
                  return value;
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value: number, name: string) => (
                      <>
                        <div className="font-semibold">
                          {name === 'vendors' ? 'Vendors' : 'Couples'}: {value}
                        </div>
                        <div className="text-xs text-muted-foreground">New signups</div>
                      </>
                    )}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="vendors"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="couples"
                stroke="#ec4899"
                strokeWidth={2}
                dot={{ fill: '#ec4899', r: 4 }}
                connectNulls
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
