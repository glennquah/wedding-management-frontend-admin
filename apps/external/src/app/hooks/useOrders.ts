import {
    AvailabilitySlotDto,
    ListingResponseDto,
    OrderResponseDto,
    OrderStatus,
    OrdersService,
    PaymentsService,
    VendorResponseDto,
    VendorsService,
} from '@shared/api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export type ListingWithBookedSlots = ListingResponseDto & { bookedSlots?: AvailabilitySlotDto[] };
export type OrderListing = { order: OrderResponseDto; listing: ListingWithBookedSlots; bookedSlots?: AvailabilitySlotDto[] };

export function useOrders(selectedWeddingId?: number) {
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [vendors, setVendors] = useState<Record<number, VendorResponseDto>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Runtime type guard to ensure an unknown value looks like an array of listings
  const isListingWithBookedSlotsArray = (value: unknown): value is ListingWithBookedSlots[] => {
    if (!Array.isArray(value)) return false;
    return value.every(item => typeof item === 'object' && item !== null && ('id' in item || 'listingName' in item || 'price' in item));
  };

  const fetchOrders = async () => {
    if (!selectedWeddingId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const fetchedOrders = await OrdersService.orderControllerFindByWedding(selectedWeddingId);

      // Sort newest first
      const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
      setOrders(sortedOrders);

      // collect vendor ids
      const vendorIds = new Set<number>();
      sortedOrders.forEach(order => {
        if (order.listings && isListingWithBookedSlotsArray(order.listings)) {
          const listings = order.listings as unknown as ListingWithBookedSlots[];
          listings.forEach(l => {
            if (l.vendorId) vendorIds.add(l.vendorId);
          });
        }
      });

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

  useEffect(() => {
    if (selectedWeddingId) fetchOrders();
  }, [selectedWeddingId]);

  const handleDeleteOrder = async (orderId: number) => {
    try {
      await OrdersService.orderControllerDelete(orderId);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
      toast.error('Failed to delete order. Please try again.');
    }
  };

  const handlePayNow = async (orderId: number) => {
    try {
      const checkoutData = await PaymentsService.paymentControllerCreateCheckoutSession({
        orderId: orderId,
        successUrl: `${window.location.origin}/admin/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/admin/payment/cancel`,
      });
      window.location.href = checkoutData.url;
    } catch (err) {
      console.error('Error creating payment session:', err);
      toast.error('Failed to initiate payment. Please try again.');
    }
  };

  // Flatten orders into individual order listings for display
  const getOrderListingsFlat = (): OrderListing[] => {
    const orderListings: OrderListing[] = [];
    orders.forEach(order => {
      if (order.listings && isListingWithBookedSlotsArray(order.listings)) {
        const listings = order.listings as unknown as ListingWithBookedSlots[];
        listings.forEach(listingData => {
          orderListings.push({ order, listing: listingData, bookedSlots: listingData.bookedSlots });
        });
      }
    });
    return orderListings;
  };

  const filterOrderListingsByStatus = (status?: OrderStatus) => {
    const all = getOrderListingsFlat();
    if (!status) return all;
    return all.filter(ol => ol.order.orderStatus === status);
  };

  const allOrderListings = getOrderListingsFlat();
  const toPayOrderListings = filterOrderListingsByStatus(OrderStatus.PENDING);
  const paidOrderListings = filterOrderListingsByStatus(OrderStatus.PAID);
  const completedOrderListings = filterOrderListingsByStatus(OrderStatus.COMPLETED);

  return {
    orders,
    vendors,
    isLoading,
    fetchOrders,
    handleDeleteOrder,
    handlePayNow,
    allOrderListings,
    toPayOrderListings,
    paidOrderListings,
    completedOrderListings,
  };
}
