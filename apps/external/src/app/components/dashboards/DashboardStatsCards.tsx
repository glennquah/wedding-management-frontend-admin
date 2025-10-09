'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { CheckCircle, DollarSign, Users } from 'lucide-react';

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
  isLoading?: boolean;
}

export const DashboardStatsCards = ({
  guestCount,
  spending,
  rsvpCount,
  isLoading,
}: DashboardStatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Guest Count Card */}
      <Card className="bg-transparent border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : guestCount ? (
            <>
              <div className="text-2xl font-bold mb-2">{guestCount.totalGuests}</div>
              <p className="text-xs text-muted-foreground">
                {guestCount.primaryGuests} primary, {guestCount.accompanyingGuests} accompanying
              </p>
            </>
          ) : (
            <div className="text-2xl font-bold">0</div>
          )}
        </CardContent>
      </Card>

      {/* Spending Card */}
      <Card className="bg-transparent border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : spending ? (
            <>
              <div className="text-2xl font-bold mb-2">
                {spending.currency} {spending.totalSpending.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                {spending.budgetUsedPercentage.toFixed(1)}% of {spending.currency}{' '}
                {spending.allocatedBudget.toFixed(2)} budget used
              </p>
              <p className="text-xs text-muted-foreground">
                {spending.currency} {spending.remainingBudget.toFixed(2)} remaining
              </p>
            </>
          ) : (
            <div className="text-2xl font-bold">$0.00</div>
          )}
        </CardContent>
      </Card>

      {/* RSVP Count Card */}
      <Card className="bg-transparent border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">RSVP Status</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : rsvpCount ? (
            <>
              <div className="text-2xl font-bold mb-2">
                {rsvpCount.confirmed} / {rsvpCount.totalInvited}
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                {rsvpCount.rsvpPercentage.toFixed(1)}% confirmed
              </p>
              <p className="text-xs text-muted-foreground">{rsvpCount.pending} pending</p>
            </>
          ) : (
            <div className="text-2xl font-bold">0 / 0</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
