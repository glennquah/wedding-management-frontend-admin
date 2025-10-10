import {
  AvailabilitySlotDto,
  ListingResponseDto,
  OrderResponseDto,
  OrdersService,
  OrderStatus,
  WeddingResponseDto,
  WeddingsService,
} from '@shared/api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export type ListingWithBookedSlots = ListingResponseDto & { bookedSlots?: AvailabilitySlotDto[] };
export type OrderListing = { order: OrderResponseDto; listing: ListingWithBookedSlots; bookedSlots?: AvailabilitySlotDto[] };

export function useVendorOrders(vendorId?: number) {
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [weddings, setWeddings] = useState<Record<number, WeddingResponseDto>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Runtime type guard to ensure an unknown value looks like an array of listings
  const isListingWithBookedSlotsArray = (value: unknown): value is ListingWithBookedSlots[] => {
    if (!Array.isArray(value)) return false;
    return value.every(item => typeof item === 'object' && item !== null && ('id' in item || 'listingName' in item || 'price' in item));
  };

  const fetchOrders = async () => {
    if (!vendorId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const fetchedOrders = await OrdersService.orderControllerFindByVendor(vendorId);

      // Filter out PENDING payment orders (only show paid or confirmed orders)
      const paidOrders = fetchedOrders.filter(
        order => order.orderStatus !== OrderStatus.PENDING
      );

      // Sort newest first
      const sortedOrders = paidOrders.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
      setOrders(sortedOrders);

      // Collect unique wedding IDs
      const weddingIds = new Set<number>();
      sortedOrders.forEach(order => {
        weddingIds.add(order.weddingId);
      });

      // Fetch wedding details (includes mainCouple with admin data)
      const weddingsMap: Record<number, WeddingResponseDto> = {};
      await Promise.all(
        Array.from(weddingIds).map(async (id) => {
          try {
            const wedding = await WeddingsService.weddingControllerFindOne(id);
            weddingsMap[id] = wedding;
          } catch (err) {
            console.error(`Failed to fetch wedding ${id}:`, err);
          }
        })
      );
      setWeddings(weddingsMap);
    } catch (err) {
      console.error('Error fetching vendor orders:', err);
      toast.error('Failed to fetch orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) fetchOrders();
  }, [vendorId]);

  const handleConfirmOrder = async (orderId: number) => {
    try {
      await OrdersService.orderControllerVendorConfirm(orderId);
      toast.success('Order confirmed successfully');
      fetchOrders();
    } catch (err) {
      console.error('Error confirming order:', err);
      toast.error('Failed to confirm order. Please try again.');
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    try {
      await OrdersService.orderControllerVendorReject(orderId);
      toast.success('Order rejected and refund initiated');
      fetchOrders();
    } catch (err) {
      console.error('Error rejecting order:', err);
      toast.error('Failed to reject order. Please try again.');
    }
  };

  // Flatten orders into individual order listings for display (only vendor's own listings)
  const getOrderListingsFlat = (): OrderListing[] => {
    const orderListings: OrderListing[] = [];
    orders.forEach(order => {
      if (order.listings && isListingWithBookedSlotsArray(order.listings)) {
        const listings = order.listings as unknown as ListingWithBookedSlots[];
        // Filter to only include listings belonging to this vendor
        const vendorListings = listings.filter(l => l.vendorId === vendorId);
        vendorListings.forEach(listingData => {
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
  const pendingConfirmationListings = filterOrderListingsByStatus(OrderStatus.PAID);
  const confirmedOrderListings = filterOrderListingsByStatus(OrderStatus.CONFIRMED);
  const cancelledOrderListings = filterOrderListingsByStatus(OrderStatus.CANCELLED);

  return {
    orders,
    weddings,
    isLoading,
    fetchOrders,
    handleConfirmOrder,
    handleRejectOrder,
    allOrderListings,
    pendingConfirmationListings,
    confirmedOrderListings,
    cancelledOrderListings,
  };
}
