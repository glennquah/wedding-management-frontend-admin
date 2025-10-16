'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Users, Heart, Calendar, Globe, UserCheck, DollarSign, TrendingUp } from 'lucide-react';

interface AdminStatsCardsProps {
  basicStats?: {
    totalVendors: number;
    totalCouples: number;
    totalWeddings: number;
    totalMicrosites: number;
    totalGuestsServed: number;
  };
  revenueData?: {
    mtd: number;
    ytd: number;
    allTime: number;
    averageOrderValue: number;
    commissionEarned: number;
    currency: string;
  };
  isLoadingBasicStats?: boolean;
  isLoadingRevenue?: boolean;
}

export const AdminStatsCards = ({
  basicStats,
  revenueData,
  isLoadingBasicStats,
  isLoadingRevenue,
}: AdminStatsCardsProps) => {
  const formatCurrency = (value: number, currency: string) => {
    return `${currency}${value.toFixed(2)}`;
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Vendors Card */}
      <Card className="bg-transparent border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium">Total Vendors</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoadingBasicStats ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : basicStats ? (
            <>
              <div className="text-2xl font-bold mb-2">{basicStats.totalVendors}</div>
              <p className="text-xs text-muted-foreground">Active vendors on platform</p>
            </>
          ) : (
            <div className="text-2xl font-bold">0</div>
          )}
        </CardContent>
      </Card>

      {/* Total Couples Card */}
      <Card className="bg-transparent border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium">Total Couples</CardTitle>
          <Heart className="h-4 w-4 text-pink-600" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoadingBasicStats ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : basicStats ? (
            <>
              <div className="text-2xl font-bold mb-2">{basicStats.totalCouples}</div>
              <p className="text-xs text-muted-foreground">Registered couples</p>
            </>
          ) : (
            <div className="text-2xl font-bold">0</div>
          )}
        </CardContent>
      </Card>

      {/* Total Weddings Card */}
      <Card className="bg-transparent border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium">Total Weddings</CardTitle>
          <Calendar className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoadingBasicStats ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : basicStats ? (
            <>
              <div className="text-2xl font-bold mb-2">{basicStats.totalWeddings}</div>
              <p className="text-xs text-muted-foreground">Weddings planned</p>
            </>
          ) : (
            <div className="text-2xl font-bold">0</div>
          )}
        </CardContent>
      </Card>

      {/* Total Microsites Card */}
      <Card className="bg-transparent border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium">Total Microsites</CardTitle>
          <Globe className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoadingBasicStats ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : basicStats ? (
            <>
              <div className="text-2xl font-bold mb-2">{basicStats.totalMicrosites}</div>
              <p className="text-xs text-muted-foreground">Active wedding sites</p>
            </>
          ) : (
            <div className="text-2xl font-bold">0</div>
          )}
        </CardContent>
      </Card>

      {/* Total Guests Served Card */}
      <Card className="bg-transparent border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium">Guests Served</CardTitle>
          <UserCheck className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoadingBasicStats ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : basicStats ? (
            <>
              <div className="text-2xl font-bold mb-2">
                {basicStats.totalGuestsServed.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total guests served</p>
            </>
          ) : (
            <div className="text-2xl font-bold">0</div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Card - All Time */}
      <Card className="bg-transparent border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoadingRevenue ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : revenueData ? (
            <>
              <div className="text-2xl font-bold mb-2">
                {formatCurrency(revenueData.allTime, revenueData.currency)}
              </div>
              <p className="text-xs text-muted-foreground">All-time platform revenue</p>
            </>
          ) : (
            <div className="text-2xl font-bold">$0.00</div>
          )}
        </CardContent>
      </Card>

      {/* Average Order Value Card */}
      <Card className="bg-transparent border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium">Avg Order Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-indigo-600" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoadingRevenue ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : revenueData ? (
            <>
              <div className="text-2xl font-bold mb-2">
                {formatCurrency(revenueData.averageOrderValue, revenueData.currency)}
              </div>
              <p className="text-xs text-muted-foreground">Per order average</p>
            </>
          ) : (
            <div className="text-2xl font-bold">$0.00</div>
          )}
        </CardContent>
      </Card>

      {/* Commission Earned Card */}
      <Card className="bg-transparent border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium">Commission Earned</CardTitle>
          <DollarSign className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoadingRevenue ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : revenueData ? (
            <>
              <div className="text-2xl font-bold mb-2">
                {formatCurrency(revenueData.commissionEarned, revenueData.currency)}
              </div>
              <p className="text-xs text-muted-foreground">Platform commission</p>
            </>
          ) : (
            <div className="text-2xl font-bold">$0.00</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
