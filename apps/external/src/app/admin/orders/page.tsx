'use client';

import {
  OrderCard,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shared/components';
import { Loader2, Package } from 'lucide-react';
import { OrderListing, useOrders } from '../../hooks/useOrders';
import { useWeddingStore } from '../../store/sessionStore';

export default function OrdersPage() {
  const { selectedWeddingId } = useWeddingStore();
  const {
    vendors,
    isLoading,
    fetchOrders,
    handleDeleteOrder,
    handlePayNow,
    allOrderListings,
    toPayOrderListings,
    paidOrderListings,
    completedOrderListings,
    confirmedOrderListings,
    cancelledOrderListings,
  } = useOrders(selectedWeddingId ?? undefined);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
        <div className="container mx-auto px-4 pt-4 md:pt-6">
          <PageHeader title="My Orders" description="Track your wedding service orders" />
          <div className="flex items-center justify-center py-8">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const EmptyState = ({ message }: { message: string }) => (
    <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
      <Package className="mb-4 h-16 w-16 text-gray-300" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );

  const OrderListingList = ({ orderListings }: { orderListings: OrderListing[] }) => (
    <div className="mt-6 grid grid-cols-1 gap-4">
      {orderListings.map((ol, index) => {
        const vendor = vendors[ol.listing.vendorId];
        return (
          <OrderCard
            key={`${ol.order.id}-${ol.listing.id}-${index}`}
            order={ol.order}
            listings={[{ listing: ol.listing, bookedSlots: ol.bookedSlots }]}
            vendorName={vendor?.name}
            vendorId={vendor?.id}
            vendorEmail={vendor?.email}
            onDelete={handleDeleteOrder}
            onPayNow={handlePayNow}
            onRefresh={fetchOrders}
          />
        );
      })}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
      <div className="container mx-auto px-4 py-8 md:pt-6">
        <PageHeader title="My Orders" description="Track your wedding service orders" />

      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="bg-muted/50 grid w-full grid-cols-4 rounded-lg p-1 md:flex md:w-fit md:space-x-2">
          <TabsTrigger
            value="all"
            className="text-foreground data-[state=active]:bg-primary hover:bg-primary/20 hover:text-foreground rounded-lg px-2 py-2 text-xs font-medium transition-colors data-[state=active]:text-white md:px-4 md:text-sm"
          >
            <span className="md:hidden">All ({allOrderListings.length})</span>
            <span className="hidden md:block">All Orders ({allOrderListings.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="to-pay"
            className="text-foreground data-[state=active]:bg-primary hover:bg-primary/20 hover:text-foreground rounded-lg px-2 py-2 text-xs font-medium transition-colors data-[state=active]:text-white md:px-4 md:text-sm"
          >
            <span className="md:hidden">To Pay ({toPayOrderListings.length})</span>
            <span className="hidden md:block">To Pay ({toPayOrderListings.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="paid"
            className="text-foreground data-[state=active]:bg-primary hover:bg-primary/20 hover:text-foreground rounded-lg px-2 py-2 text-xs font-medium transition-colors data-[state=active]:text-white md:px-4 md:text-sm"
          >
            <span className="md:hidden">Paid ({paidOrderListings.length})</span>
            <span className="hidden md:block">Paid ({paidOrderListings.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="confirmed"
            className="text-foreground data-[state=active]:bg-primary hover:bg-primary/20 hover:text-foreground rounded-lg px-2 py-2 text-xs font-medium transition-colors data-[state=active]:text-white md:px-4 md:text-sm"
          >
            <span className="md:hidden">Done ({confirmedOrderListings.length})</span>
            <span className="hidden md:block">Confirmed ({confirmedOrderListings.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="text-foreground data-[state=active]:bg-primary hover:bg-primary/20 hover:text-foreground rounded-lg px-2 py-2 text-xs font-medium transition-colors data-[state=active]:text-white md:px-4 md:text-sm"
          >
            <span className="md:hidden">Cancelled ({cancelledOrderListings.length})</span>
            <span className="hidden md:block">Cancelled ({cancelledOrderListings.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="text-foreground data-[state=active]:bg-primary hover:bg-primary/20 hover:text-foreground rounded-lg px-2 py-2 text-xs font-medium transition-colors data-[state=active]:text-white md:px-4 md:text-sm"
          >
            <span className="md:hidden">Completed ({completedOrderListings.length})</span>
            <span className="hidden md:block">Completed ({completedOrderListings.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {allOrderListings.length > 0 ? (
            <OrderListingList orderListings={allOrderListings} />
          ) : (
            <EmptyState message="No orders yet. Start shopping for your wedding services!" />
          )}
        </TabsContent>

        <TabsContent value="to-pay">
          {toPayOrderListings.length > 0 ? (
            <OrderListingList orderListings={toPayOrderListings} />
          ) : (
            <EmptyState message="No pending payments." />
          )}
        </TabsContent>

        <TabsContent value="paid">
          {paidOrderListings.length > 0 ? (
            <OrderListingList orderListings={paidOrderListings} />
          ) : (
            <EmptyState message="No paid orders yet." />
          )}
        </TabsContent>

        <TabsContent value="confirmed">
          {confirmedOrderListings.length > 0 ? (
            <OrderListingList orderListings={confirmedOrderListings} />
          ) : (
            <EmptyState message="No confirmed orders yet." />
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {cancelledOrderListings.length > 0 ? (
            <OrderListingList orderListings={cancelledOrderListings} />
          ) : (
            <EmptyState message="No cancelled orders." />
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedOrderListings.length > 0 ? (
            <OrderListingList orderListings={completedOrderListings} />
          ) : (
            <EmptyState message="No completed orders yet." />
          )}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
