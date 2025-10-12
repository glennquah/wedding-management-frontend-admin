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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@shared/components/ui/chart';
import { Cell, Legend, Pie, PieChart } from 'recharts';

interface VendorRevenuePieChartProps {
  revenueByCategory?: {
    categories: CategoryRevenueData[];
    totalRevenue: number;
    currency: string;
  };
  isLoading?: boolean;
}

// Color palette for the pie chart
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export const VendorRevenuePieChart = ({
  revenueByCategory,
  isLoading,
}: VendorRevenuePieChartProps) => {
  const chartData = useMemo(() => {
    if (!revenueByCategory?.categories || revenueByCategory.categories.length === 0) return [];

    return revenueByCategory.categories.map((item) => ({
      name: item.category,
      value: item.revenue,
      percentage: item.percentage,
      bookingCount: item.bookingCount,
    }));
  }, [revenueByCategory]);

  const chartConfig = {
    revenue: {
      label: 'Revenue',
    },
  };

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader>
        <CardTitle>Revenue by Category</CardTitle>
        <CardDescription>Revenue breakdown by service type</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
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
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={({ percentage }) => `${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value: number, name: string, item: any) => (
                      <>
                        <div className="font-semibold text-sm mb-1">{item.payload.name}</div>
                        <div className="text-sm">
                          Revenue: {revenueByCategory?.currency}
                          {Number(value).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.payload.percentage.toFixed(1)}% of total
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
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => value}
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
