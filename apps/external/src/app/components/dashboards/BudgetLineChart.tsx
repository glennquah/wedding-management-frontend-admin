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
import { Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts';

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
      color: '#3b82f6',
    },
    budget: {
      label: 'Budget',
      color: '#ef4444',
    },
  };

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader>
        <CardTitle>Budget Tracking</CardTitle>
        <CardDescription>Cumulative spending over time vs allocated budget</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No order data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `${value}`}
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
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{ value: 'Budget Limit', position: 'insideTopRight' }}
              />
              <Line
                type="monotone"
                dataKey="spending"
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
