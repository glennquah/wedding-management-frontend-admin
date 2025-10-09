'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { OrderResponseDto } from '@shared/api';
import { Badge } from '@shared/components/ui/badge';
import { Package } from 'lucide-react';

interface RecentOrdersListProps {
  orders: OrderResponseDto[];
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

export const RecentOrdersList = ({ orders, isLoading }: RecentOrdersListProps) => {
  // Show only the 5 most recent orders
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Your latest 5 orders</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Loading orders...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center text-muted-foreground">
            <Package className="h-12 w-12 mb-2 opacity-50" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Order #{order.id}</span>
                    <Badge className={getStatusColor(order.orderStatus)} variant="secondary">
                      {order.orderStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.purchaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  {order.remark && (
                    <p className="text-xs text-muted-foreground mt-1">{order.remark}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {order.currency} {order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
