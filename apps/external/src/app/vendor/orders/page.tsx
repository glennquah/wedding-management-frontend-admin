'use client';

import { OrderCard, PageHeader, Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components';
import { Loader2, Package } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { OrderListing, useVendorOrders } from '../../hooks/useVendorOrders';

export default function VendorOrdersPage() {
  const { data: session } = useSession();
  const vendorId = session?.user?.id;

  const {
    weddings,
    isLoading,
    handleConfirmOrder,
    handleRejectOrder,
    allOrderListings,
    pendingConfirmationListings,
    confirmedOrderListings,
    cancelledOrderListings,
  } = useVendorOrders(vendorId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-4 md:pt-6">
        <PageHeader title="My Orders" description="Manage your customer orders" />
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-8 text-center mt-6">
      <Package className="w-16 h-16 text-gray-300 mb-4" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );

  const OrderListingList = ({ orderListings }: { orderListings: OrderListing[] }) => (
    <div className="grid grid-cols-1 gap-4 mt-6">
      {orderListings.map((ol, index) => {
        const wedding = weddings[ol.order.weddingId];

        const weddingName = wedding?.name || 'Customer';
        let adminEmail: string | undefined;
        let coupleNames: string[] = [];

        if (wedding?.mainCouple && Array.isArray(wedding.mainCouple) && wedding.mainCouple.length > 0) {
          coupleNames = wedding.mainCouple.map((admin) => admin.name).filter(Boolean);
          const emails = wedding.mainCouple.map(admin => admin.email).filter(Boolean);
          adminEmail = emails.length > 0 ? emails.join(',') : undefined;
        }

        return (
          <OrderCard
            key={`${ol.order.id}-${ol.listing.id}-${index}`}
            order={ol.order}
            listings={[{ listing: ol.listing, bookedSlots: ol.bookedSlots }]}
            weddingName={weddingName}
            coupleNames={coupleNames}
            adminEmail={adminEmail}
            onConfirm={handleConfirmOrder}
            onReject={handleRejectOrder}
            viewMode="vendor"
          />
        );
      })}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:pt-6">
      <PageHeader title="My Orders" description="Manage your customer orders" />

      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="bg-muted/50 rounded-lg p-1 grid w-full grid-cols-4 md:flex md:space-x-2 md:w-fit">
          <TabsTrigger
            value="all"
            className="px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium text-foreground data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/20 hover:text-foreground transition-colors"
          >
            <span className="md:hidden">All ({allOrderListings.length})</span>
            <span className="hidden md:block">All Orders ({allOrderListings.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium text-foreground data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/20 hover:text-foreground transition-colors"
          >
            <span className="md:hidden">Pending ({pendingConfirmationListings.length})</span>
            <span className="hidden md:block">Pending Confirmation ({pendingConfirmationListings.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="confirmed"
            className="px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium text-foreground data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/20 hover:text-foreground transition-colors"
          >
            <span className="md:hidden">Confirmed ({confirmedOrderListings.length})</span>
            <span className="hidden md:block">Confirmed ({confirmedOrderListings.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium text-foreground data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/20 hover:text-foreground transition-colors"
          >
            <span className="md:hidden">Cancelled ({cancelledOrderListings.length})</span>
            <span className="hidden md:block">Cancelled ({cancelledOrderListings.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {allOrderListings.length > 0 ? (
            <OrderListingList orderListings={allOrderListings} />
          ) : (
            <EmptyState message="No orders yet." />
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pendingConfirmationListings.length > 0 ? (
            <OrderListingList orderListings={pendingConfirmationListings} />
          ) : (
            <EmptyState message="No pending orders awaiting confirmation." />
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
      </Tabs>
    </div>
  );
}