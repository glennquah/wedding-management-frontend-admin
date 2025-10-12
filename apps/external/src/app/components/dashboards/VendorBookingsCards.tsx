'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { CheckCircle, Clock, Package } from 'lucide-react';

interface VendorBookingsCardsProps {
  bookingsData?: {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
  };
  isLoading?: boolean;
}

export const VendorBookingsCards = ({ bookingsData, isLoading }: VendorBookingsCardsProps) => {
  return (
    <>
      {/* Pending Bookings Card */}
      <Card className="bg-transparent border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : bookingsData ? (
            <>
              <div className="text-2xl font-bold mb-2">{bookingsData.pendingBookings}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </>
          ) : (
            <div className="text-2xl font-bold">0</div>
          )}
        </CardContent>
      </Card>

      {/* Confirmed Bookings Card */}
      <Card className="bg-transparent border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : bookingsData ? (
            <>
              <div className="text-2xl font-bold mb-2">{bookingsData.confirmedBookings}</div>
              <p className="text-xs text-muted-foreground">Active bookings</p>
            </>
          ) : (
            <div className="text-2xl font-bold">0</div>
          )}
        </CardContent>
      </Card>

      {/* Completed Bookings Card */}
      <Card className="bg-transparent border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Bookings</CardTitle>
          <Package className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : bookingsData ? (
            <>
              <div className="text-2xl font-bold mb-2">{bookingsData.completedBookings}</div>
              <p className="text-xs text-muted-foreground">
                {bookingsData.totalBookings} total bookings
              </p>
            </>
          ) : (
            <div className="text-2xl font-bold">0</div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
