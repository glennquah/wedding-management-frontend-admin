'use client';

import { useMemo } from 'react';

import { TopListingData } from '@shared/api';
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

interface AdminTopListingsChartProps {
  topListings?: {
    topListings: TopListingData[];
    currency: string;
  };
  isLoading?: boolean;
}

export const AdminTopListingsChart = ({ topListings, isLoading }: AdminTopListingsChartProps) => {
  const chartData = useMemo(() => {
    if (!topListings?.topListings || topListings.topListings.length === 0) return [];

    // Format the data for the chart
    return topListings.topListings.map((item, index) => ({
      listing:
        item.listingName.length > 15 ? item.listingName.substring(0, 15) + '...' : item.listingName,
      fullName: item.listingName,
      revenue: item.revenue,
      bookingCount: item.bookingCount,
      fill: `var(--chart-${(index % 5) + 1})`,
    }));
  }, [topListings]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item, index) => {
      const safeKey = `listing${index}`;
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
        <CardTitle>Top Listings by Revenue</CardTitle>
        <CardDescription>Best performing listings on the platform</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No listing data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart data={chartData}>
              <XAxis
                dataKey="listing"
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
                          Revenue: {topListings?.currency}
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
