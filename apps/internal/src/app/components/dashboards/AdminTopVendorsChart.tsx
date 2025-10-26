'use client';

import { useMemo } from 'react';

import { TopVendorData } from '@shared/api';
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

interface AdminTopVendorsChartProps {
  topVendors?: {
    topVendors: TopVendorData[];
    currency: string;
  };
  isLoading?: boolean;
}

export const AdminTopVendorsChart = ({ topVendors, isLoading }: AdminTopVendorsChartProps) => {
  const chartData = useMemo(() => {
    if (!topVendors?.topVendors || topVendors.topVendors.length === 0) return [];

    // Format the data for the chart
    return topVendors.topVendors.map((item, index) => ({
      vendor:
        item.vendorName.length > 15 ? item.vendorName.substring(0, 15) + '...' : item.vendorName,
      fullName: item.vendorName,
      revenue: item.revenue,
      bookingCount: item.bookingCount,
      fill: `var(--chart-${(index % 5) + 1})`,
    }));
  }, [topVendors]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item, index) => {
      const safeKey = `vendor${index}`;
      config[safeKey] = {
        label: item.fullName,
        color: `var(--chart-${(index % 5) + 1})`,
      };
    });
    return config;
  }, [chartData]);

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader>
        <CardTitle>Top Vendors by Revenue</CardTitle>
        <CardDescription>Best performing vendors on the platform</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No vendor data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart data={chartData}>
              <XAxis
                dataKey="vendor"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                angle={-45}
                textAnchor="end"
                height={80}
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
                    formatter={(
                      value: number,
                      _name: string,
                      item: { payload: { fullName: string; bookingCount: number } },
                    ) => (
                      <>
                        <div className="font-semibold text-xs mb-1">{item.payload.fullName}</div>
                        <div className="text-sm">
                          Revenue: {topVendors?.currency}
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
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
