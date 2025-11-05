'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { CheckCircle, DollarSign, Gift, Users } from 'lucide-react';

interface DashboardStatsCardsProps {
  guestCount?: {
    totalGuests: number;
    primaryGuests: number;
    accompanyingGuests: number;
  };
  spending?: {
    totalSpending: number;
    allocatedBudget: number;
    remainingBudget: number;
    budgetUsedPercentage: number;
    currency: string;
  };
  rsvpCount?: {
    totalInvited: number;
    confirmed: number;
    pending: number;
    rsvpPercentage: number;
  };
  cashGifts?: {
    totalAmount: number;
    totalGifters: number;
    currency: string;
  };
  isLoading?: boolean;
}

export const DashboardStatsCards = ({
  guestCount,
  spending,
  rsvpCount,
  cashGifts,
  isLoading,
}: DashboardStatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Guest Count Card */}
      <Card className="border-brand-200 bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : guestCount ? (
            <>
              <div className="mb-2 text-2xl font-bold">{guestCount.totalGuests}</div>
              <p className="text-muted-foreground text-xs">
                {guestCount.primaryGuests} primary, {guestCount.accompanyingGuests} accompanying
              </p>
            </>
          ) : (
            <div className="text-2xl font-bold">0</div>
          )}
        </CardContent>
      </Card>

      {/* Spending Card */}
      <Card className="border-brand-200 bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
          <DollarSign className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : spending ? (
            <>
              <div className="mb-2 text-2xl font-bold">
                {spending.currency} {spending.totalSpending.toFixed(2)}
              </div>
              <p className="text-muted-foreground mb-1 text-xs">
                {spending.budgetUsedPercentage.toFixed(1)}% of {spending.currency}{' '}
                {spending.allocatedBudget.toFixed(2)} budget used
              </p>
              <p className="text-muted-foreground text-xs">
                {spending.currency} {spending.remainingBudget.toFixed(2)} remaining
              </p>
            </>
          ) : (
            <div className="text-2xl font-bold">$0.00</div>
          )}
        </CardContent>
      </Card>

      {/* RSVP Count Card */}
      <Card className="border-brand-200 bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">RSVP Status</CardTitle>
          <CheckCircle className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : rsvpCount ? (
            <>
              <div className="mb-2 text-2xl font-bold">
                {rsvpCount.confirmed} / {rsvpCount.totalInvited}
              </div>
              <p className="text-muted-foreground mb-1 text-xs">
                {rsvpCount.rsvpPercentage.toFixed(1)}% confirmed
              </p>
              <p className="text-muted-foreground text-xs">{rsvpCount.pending} pending</p>
            </>
          ) : (
            <div className="text-2xl font-bold">0 / 0</div>
          )}
        </CardContent>
      </Card>

      {/* Cash Gifts Card */}
      <Card className="border-brand-200 bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cash Gifting Value</CardTitle>
          <Gift className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : cashGifts ? (
            <>
              <div className="mb-2 text-2xl font-bold">
                {cashGifts.currency} {cashGifts.totalAmount.toFixed(2)}
              </div>
              <p className="text-muted-foreground text-xs">{cashGifts.totalGifters} gifters</p>
            </>
          ) : (
            <div className="text-2xl font-bold">$0.00</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
