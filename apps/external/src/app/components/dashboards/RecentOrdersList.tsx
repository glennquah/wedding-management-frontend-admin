'use client';

import { OrderListingDetailResponseDto } from '@shared/api';
import { Badge } from '@shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/components/ui/table';
import { Package } from 'lucide-react';

interface RecentOrdersListProps {
  listingDetails: OrderListingDetailResponseDto[];
  isLoading?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const RecentOrdersList = ({ listingDetails, isLoading }: RecentOrdersListProps) => {
  // Show only the 5 most recent listing details
  const recentListings = listingDetails
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Your latest 5 orders</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading orders...
          </div>
        ) : recentListings.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <Package className="h-12 w-12 mb-2 opacity-50" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="overflow-auto h-full border rounded-md ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Listing</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentListings.map((listing) => (
                  <TableRow key={`${listing.orderId}-${listing.listingId}`}>
                    <TableCell className="font-medium">{listing.listingName}</TableCell>
                    <TableCell>{listing.vendorName}</TableCell>
                    <TableCell>
                      {new Date(listing.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(listing.status)} variant="secondary">
                        {listing.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {listing.currency} {listing.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
