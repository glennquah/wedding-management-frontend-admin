'use client';

import { useMemo } from 'react';

import { TopProductData } from '@shared/api';
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

interface VendorPieChartProps {
  topProducts?: {
    topProducts: TopProductData[];
    currency: string;
  };
  isLoading?: boolean;
}

export const VendorPieChart = ({ topProducts, isLoading }: VendorPieChartProps) => {
  const chartData = useMemo(() => {
    if (!topProducts?.topProducts || topProducts.topProducts.length === 0) return [];

    return topProducts.topProducts.map((item, index) => ({
      product: item.listingName,
      revenue: item.revenue,
      bookingCount: item.bookingCount,
      fill: `var(--chart-${(index % 5) + 1})`,
    }));
  }, [topProducts]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item, index) => {
      config[item.product] = {
        label: item.product,
        color: `var(--chart-${(index % 5) + 1})`,
      };
    });
    return config;
  }, [chartData]);

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader>
        <CardTitle>Revenue Distribution</CardTitle>
        <CardDescription>Revenue breakdown by Listing</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No product data available
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
                      item: { payload: { product: string; bookingCount: number } },
                    ) => (
                      <>
                        <div className="font-semibold text-xs mb-1">{item.payload.product}</div>
                        <div className="text-sm">
                          Revenue: {topProducts?.currency}
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
              <Pie data={chartData} dataKey="revenue" nameKey="product" />
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
