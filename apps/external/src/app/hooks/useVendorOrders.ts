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

export type ListingWithBookedSlots = ListingResponseDto & {
  bookedSlots?: AvailabilitySlotDto[];
  bookingStatus?: OrderStatus;
};
export type OrderListing = {
  order: OrderResponseDto;
  listing: ListingWithBookedSlots;
  bookedSlots?: AvailabilitySlotDto[];
  bookingStatus?: OrderStatus;
};

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

      // Filter orders to only show those with at least one PAID or CONFIRMED listing for this vendor
      const relevantOrders = fetchedOrders.filter((order: OrderResponseDto) => {
        if (!order.listings || !isListingWithBookedSlotsArray(order.listings)) return false;
        const listings = order.listings as unknown as ListingWithBookedSlots[];
        // Check if there's at least one listing from this vendor that's not PENDING
        return listings.some(
          l => l.vendorId === vendorId && l.bookingStatus !== OrderStatus.PENDING
        );
      });

      // Sort newest first
      const sortedOrders = relevantOrders.sort((a: OrderResponseDto, b: OrderResponseDto) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
      setOrders(sortedOrders);

      // Collect unique wedding IDs
      const weddingIds = new Set<number>();
      sortedOrders.forEach((order: OrderResponseDto) => {
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
  }, [vendorId, fetchOrders]);

  const handleConfirmListing = async (orderId: number, listingId: number) => {
    try {
      await OrdersService.orderControllerVendorConfirmListing(orderId, listingId);
      toast.success('Listing confirmed successfully');
      fetchOrders();
    } catch (err) {
      console.error('Error confirming listing:', err);
      toast.error('Failed to confirm listing. Please try again.');
    }
  };

  const handleRejectListing = async (orderId: number, listingId: number) => {
    try {
      await OrdersService.orderControllerVendorRejectListing(orderId, listingId);
      toast.success('Listing rejected and partial refund initiated');
      fetchOrders();
    } catch (err) {
      console.error('Error rejecting listing:', err);
      toast.error('Failed to reject listing. Please try again.');
    }
  };

  const handleCompleteListing = async (orderId: number, listingId: number) => {
    try {
      await OrdersService.orderControllerVendorCompleteListing(orderId, listingId);
      toast.success('Order completed successfully');
      fetchOrders();
    } catch (err) {
      console.error('Error completing listing:', err);
      toast.error('Failed to complete order. Please try again.');
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
          orderListings.push({
            order,
            listing: listingData,
            bookedSlots: listingData.bookedSlots,
            bookingStatus: listingData.bookingStatus,
          });
        });
      }
    });
    return orderListings;
  };

  const filterOrderListingsByStatus = (status?: OrderStatus) => {
    const all = getOrderListingsFlat();
    if (!status) return all;
    // Filter by bookingStatus on the listing level, not order level
    return all.filter(ol => ol.bookingStatus === status);
  };

  const allOrderListings = getOrderListingsFlat();
  const pendingConfirmationListings = filterOrderListingsByStatus(OrderStatus.PAID);
  const confirmedOrderListings = filterOrderListingsByStatus(OrderStatus.CONFIRMED);
  const completedOrderListings = filterOrderListingsByStatus(OrderStatus.COMPLETED);
  const cancelledOrderListings = filterOrderListingsByStatus(OrderStatus.CANCELLED);

  return {
    orders,
    weddings,
    isLoading,
    fetchOrders,
    handleConfirmListing,
    handleRejectListing,
    handleCompleteListing,
    allOrderListings,
    pendingConfirmationListings,
    confirmedOrderListings,
    completedOrderListings,
    cancelledOrderListings,
  };
}
