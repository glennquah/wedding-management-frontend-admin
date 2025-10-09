'use client';

import { useMemo } from 'react';

import { OrderResponseDto } from '@shared/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@shared/components/ui/chart';
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts';

interface BudgetLineChartProps {
  orders: OrderResponseDto[];
  allocatedBudget: number;
  currency: string;
  isLoading?: boolean;
}

export const BudgetLineChart = ({
  orders,
  allocatedBudget,
  currency,
  isLoading,
}: BudgetLineChartProps) => {
  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    // Sort orders by purchase date
    const sortedOrders = [...orders].sort(
      (a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime(),
    );

    // Calculate cumulative spending
    let cumulativeSpending = 0;
    const data = sortedOrders.map((order) => {
      cumulativeSpending += order.totalAmount;
      return {
        date: new Date(order.purchaseDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        spending: cumulativeSpending,
        budget: allocatedBudget,
      };
    });

    return data;
  }, [orders, allocatedBudget]);

  const chartConfig = {
    spending: {
      label: 'Spending',
      color: 'hsl(var(--chart-1))',
    },
    budget: {
      label: 'Budget',
      color: 'hsl(var(--chart-2))',
    },
  };

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader>
        <CardTitle>Budget Tracking</CardTitle>
        <CardDescription>Cumulative spending over time vs allocated budget</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No order data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `${currency}${value}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <>
                        {name === 'spending' ? 'Spending: ' : 'Budget: '}
                        {currency}
                        {Number(value).toFixed(2)}
                      </>
                    )}
                  />
                }
              />
              <ReferenceLine
                y={allocatedBudget}
                stroke="hsl(var(--destructive))"
                strokeDasharray="3 3"
                label={{ value: 'Budget Limit', position: 'insideTopRight' }}
              />
              <Line
                type="monotone"
                dataKey="spending"
                stroke="var(--color-spending)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-spending)' }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
