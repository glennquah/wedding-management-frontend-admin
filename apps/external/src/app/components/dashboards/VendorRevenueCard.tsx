'use client';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@shared/components/ui/tabs';

interface VendorRevenueCardProps {
  revenueData?: {
    mtd: number;
    ytd: number;
    allTime: number;
    currency: string;
  };
  isLoading?: boolean;
}

type RevenuePeriod = 'mtd' | 'ytd' | 'allTime';

export const VendorRevenueCard = ({ revenueData, isLoading }: VendorRevenueCardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<RevenuePeriod>('mtd');

  const getRevenueValue = () => {
    if (!revenueData) return 0;
    switch (selectedPeriod) {
      case 'mtd':
        return revenueData.mtd;
      case 'ytd':
        return revenueData.ytd;
      case 'allTime':
        return revenueData.allTime;
      default:
        return 0;
    }
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'mtd':
        return 'This month';
      case 'ytd':
        return 'This year';
      case 'allTime':
        return 'All time';
      default:
        return '';
    }
  };

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xs font-medium">Revenue</CardTitle>
        </div>
        <Tabs
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value as RevenuePeriod)}
        >
          <TabsList className="grid grid-row-3 h-7">
            <TabsTrigger value="mtd" className="text-xs px-2">
              MTD
            </TabsTrigger>
            <TabsTrigger value="ytd" className="text-xs px-2">
              YTD
            </TabsTrigger>
            <TabsTrigger value="allTime" className="text-xs px-2">
              All
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="text-2xl font-bold">Loading...</div>
        ) : revenueData ? (
          <>
            <div className="text-2xl font-bold mb-2">
              {revenueData.currency}
              {getRevenueValue().toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
          </>
        ) : (
          <div className="text-2xl font-bold">$0.00</div>
        )}
      </CardContent>
    </Card>
  );
};
