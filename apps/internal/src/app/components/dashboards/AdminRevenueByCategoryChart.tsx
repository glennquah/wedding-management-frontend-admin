'use client';

import { useMemo } from 'react';

import { CategoryRevenueData } from '@shared/api';
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
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from '@shared/components/ui/chart';
import { Pie, PieChart } from 'recharts';

interface AdminRevenueByCategoryChartProps {
  revenueByCategory?: {
    categories: CategoryRevenueData[];
    currency: string;
  };
  isLoading?: boolean;
}

export const AdminRevenueByCategoryChart = ({
  revenueByCategory,
  isLoading,
}: AdminRevenueByCategoryChartProps) => {
  const chartData = useMemo(() => {
    if (!revenueByCategory?.categories || revenueByCategory.categories.length === 0) return [];

    return revenueByCategory.categories.map((item, index) => ({
      category: item.category,
      revenue: item.revenue,
      bookingCount: item.bookingCount,
      fill: `var(--chart-${(index % 5) + 1})`,
    }));
  }, [revenueByCategory]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item, index) => {
      config[item.category] = {
        label: item.category,
        color: `var(--chart-${(index % 5) + 1})`,
      };
    });
    return config;
  }, [chartData]);

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader>
        <CardTitle>Revenue by Category</CardTitle>
        <CardDescription>Revenue breakdown by service category</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No category data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(
                      value: number,
                      _name: string,
                      item: { payload: { category: string; bookingCount: number } },
                    ) => (
                      <>
                        <div className="font-semibold text-xs mb-1">{item.payload.category}</div>
                        <div className="text-sm">
                          Revenue: {revenueByCategory?.currency}
                          {Number(value).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.payload.bookingCount} booking
                          {item.payload.bookingCount !== 1 ? 's' : ''}
                        </div>
                      </>
                    )}
                  />
                }
              />
              <Pie data={chartData} dataKey="revenue" nameKey="category" />
              <ChartLegend
                content={(props) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const { payload } = props as any;
                  return (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {payload?.map((entry: { value?: string; color?: string }, index: number) => (
                        <div key={`legend-${index}`} className="flex items-center gap-1.5">
                          <div
                            className="h-2 w-2 shrink-0 rounded-[2px]"
                            style={{
                              backgroundColor: entry.color,
                            }}
                          />
                          <span className="text-xs text-muted-foreground">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
