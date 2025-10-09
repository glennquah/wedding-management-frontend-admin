'use client';

import { ListingResponseDto, OrderResponseDto, OrderStatus, OrdersService, PaymentsService, VendorResponseDto, VendorsService } from '@shared/api';
import { OrderCard, PageHeader, Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components';
import { Loader2, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useWeddingStore } from '../../store/sessionStore';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [vendors, setVendors] = useState<Record<number, VendorResponseDto>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { selectedWeddingId } = useWeddingStore();

  useEffect(() => {
    if (selectedWeddingId) {
      fetchOrders();
    }
  }, [selectedWeddingId]);

  const fetchOrders = async () => {
    if (!selectedWeddingId) {
      toast.error('No wedding selected');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch orders by wedding ID - the backend already includes listing details
      const fetchedOrders = await OrdersService.orderControllerFindByWedding(selectedWeddingId);

      // Sort orders by purchase date (most recent first)
      const sortedOrders = fetchedOrders.sort((a, b) => {
        return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
      });

      setOrders(sortedOrders);

      // Extract unique vendor IDs from all listings
      const vendorIds = new Set<number>();
      fetchedOrders.forEach(order => {
        if (order.listings) {
          const listings = order.listings as any;
          listings.forEach((listingData: any) => {
            if (listingData.vendorId) {
              vendorIds.add(listingData.vendorId);
            }
          });
        }
      });

      // Fetch all vendors
      const vendorsMap: Record<number, VendorResponseDto> = {};
      await Promise.all(
        Array.from(vendorIds).map(async (id) => {
          try {
            const vendor = await VendorsService.vendorControllerGetVendor(id);
            vendorsMap[id] = vendor;
          } catch (err) {
            console.error(`Failed to fetch vendor ${id}:`, err);
          }
        })
      );
      setVendors(vendorsMap);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to fetch orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    try {
      await OrdersService.orderControllerDelete(orderId);
      toast.success('Order deleted successfully');
      // Refresh orders after deletion
      fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
      toast.error('Failed to delete order. Please try again.');
    }
  };

  const handlePayNow = async (orderId: number) => {
    try {
      // Create checkout session and redirect to Stripe
      const checkoutData = await PaymentsService.paymentControllerCreateCheckoutSession({
        orderId: orderId,
        successUrl: `${window.location.origin}/admin/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/admin/payment/cancel`
      });

      // Redirect to Stripe Checkout
      window.location.href = checkoutData.url;
    } catch (error) {
      console.error('Error creating payment session:', error);
      toast.error('Failed to initiate payment. Please try again.');
    }
  };

  // Flatten orders into individual order listings for display
  const getOrderListingsFlat = () => {
    const orderListings: Array<{
      order: OrderResponseDto;
      listing: ListingResponseDto;
      bookedSlots?: any;
    }> = [];

    orders.forEach(order => {
      if (order.listings) {
        const listings = order.listings as any;
        listings.forEach((listingData: any) => {
          orderListings.push({
            order,
            listing: listingData as ListingResponseDto,
            bookedSlots: listingData.bookedSlots,
          });
        });
      }
    });

    return orderListings;
  };

  const filterOrderListingsByStatus = (status?: OrderStatus) => {
    const allOrderListings = getOrderListingsFlat();
    if (!status) return allOrderListings;
    return allOrderListings.filter(ol => ol.order.orderStatus === status);
  };

  const allOrderListings = getOrderListingsFlat();
  const toPayOrderListings = filterOrderListingsByStatus(OrderStatus.PENDING);
  const paidOrderListings = filterOrderListingsByStatus(OrderStatus.PAID);
  const completedOrderListings = filterOrderListingsByStatus(OrderStatus.COMPLETED);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-4 md:pt-6">
        <PageHeader title="My Orders" description="Track your wedding service orders" />
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

  const OrderListingList = ({ orderListings }: { orderListings: Array<{ order: OrderResponseDto; listing: ListingResponseDto; bookedSlots?: any }> }) => (
    <div className="grid grid-cols-1 gap-4 mt-6">
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
          />
        );
      })}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:pt-6">
      <PageHeader title="My Orders" description="Track your wedding service orders" />

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
            value="to-pay"
            className="px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium text-foreground data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/20 hover:text-foreground transition-colors"
          >
            <span className="md:hidden">To Pay ({toPayOrderListings.length})</span>
            <span className="hidden md:block">To Pay ({toPayOrderListings.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="paid"
            className="px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium text-foreground data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/20 hover:text-foreground transition-colors"
          >
            <span className="md:hidden">Paid ({paidOrderListings.length})</span>
            <span className="hidden md:block">Paid ({paidOrderListings.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="confirmed"
            className="px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium text-foreground data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/20 hover:text-foreground transition-colors"
          >
            <span className="md:hidden">Done ({completedOrderListings.length})</span>
            <span className="hidden md:block">Confirmed ({completedOrderListings.length})</span>
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
          {completedOrderListings.length > 0 ? (
            <OrderListingList orderListings={completedOrderListings} />
          ) : (
            <EmptyState message="No confirmed orders yet." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
