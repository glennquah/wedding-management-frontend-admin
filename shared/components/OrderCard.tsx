'use client';

import { AvailabilitySlotDto, ListingResponseDto, OrderResponseDto, OrderStatus } from '@shared/api';
import { Badge } from '@shared/components/ui/badge';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@shared/components/ui/carousel';
import { DeleteConfirmationModal } from '@shared/components/ui/delete-confirmation-modal';
import { Calendar, Camera, Clock, ExternalLink, Mail, Trash2, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface OrderCardProps {
  order: OrderResponseDto;
  listings: Array<{ listing: ListingResponseDto & { bookingStatus?: OrderStatus }; bookedSlots?: AvailabilitySlotDto[] }>;
  vendorName?: string;
  vendorId?: number;
  vendorEmail?: string;
  weddingName?: string;
  coupleNames?: string[];
  adminEmail?: string;
  onDelete?: (orderId: number, listingId?: number) => void;
  onPayNow?: (orderId: number) => void;
  onConfirm?: () => void;
  onReject?: () => void;
  viewMode?: 'admin' | 'vendor';
}

export function OrderCard({
  order,
  listings,
  vendorName,
  vendorId,
  vendorEmail,
  weddingName,
  coupleNames,
  adminEmail,
  onDelete,
  onPayNow,
  onConfirm,
  onReject,
  viewMode = 'admin'
}: OrderCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: order.currency || 'SGD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-SG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSlotDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Compute the total amount for the listings shown in this card (i.e. this vendor's subtotal).
  // If a listing has booked slots, count each slot separately; otherwise count the listing once.
  const vendorTotal = listings.reduce((sum, item) => {
    const count = item.bookedSlots && item.bookedSlots.length > 0 ? item.bookedSlots.length : 1;
    const price = item.listing?.price ?? 0;
    return sum + price * count;
  }, 0);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case OrderStatus.PAID:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case OrderStatus.CONFIRMED:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case OrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Determine which name/id/email to display based on viewMode
  const displayName = viewMode === 'vendor' ? weddingName : vendorName;
  const displayEmail = viewMode === 'vendor' ? adminEmail : vendorEmail;
  const displayLinkHref = viewMode === 'vendor'
    ? `/vendor/orders`
    : `/admin/ecommerce/vendor/${vendorId}?from=orders`;

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">
               {displayName}
              </CardTitle>
              {viewMode === 'admin' && vendorId && (
                <Link
                  href={displayLinkHref}
                  className="text-brand-600 hover:text-brand-800"
                  title="View vendor page"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
              {displayEmail && (
                <a
                  href={`mailto:${displayEmail}`}
                  className="text-brand-600 hover:text-brand-800"
                  title={viewMode === 'vendor' ? 'Contact customer' : 'Contact vendor'}
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
            </div>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {coupleNames && coupleNames.length > 0 && (
                <div className="flex items-center gap-1 mb-1">
                  <Users className="text-base-black w-4 h-4" />
                  <span className="font-semibold text-base text-foreground">{coupleNames.join(' & ')}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Purchased on: {formatDate(order.purchaseDate)}
              </div>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {listings[0]?.listing?.bookingStatus === OrderStatus.PENDING && onDelete && viewMode === 'admin' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteModal(true)}
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Delete order"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Badge className={`${getStatusColor(listings[0]?.listing?.bookingStatus || OrderStatus.PENDING)} border`}>
              {listings[0]?.listing?.bookingStatus || OrderStatus.PENDING}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Listings in this order */}
        <div className="space-y-3">
          {listings.map((listingItem, listingIndex) => {
            const { listing, bookedSlots } = listingItem;
            const hasImages = listing.imageUrls && listing.imageUrls.length > 0;
            const hasMultipleImages = listing.imageUrls && listing.imageUrls.length > 1;

            // If there are booked slots, create a separate display for each slot
            if (bookedSlots && bookedSlots.length > 0) {
              return bookedSlots.map((slot, slotIndex) => (
                <div
                  key={`${listing.id}-${listingIndex}-${slotIndex}`}
                  className="flex gap-3 p-3 rounded-lg border bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  {/* Listing Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {hasImages ? (
                      <Carousel className="w-full h-full">
                        <CarouselContent>
                          {listing.imageUrls?.map((imageUrl: string, index: number) => (
                            <CarouselItem key={index}>
                              <div className="relative w-24 h-24">
                                <Image
                                  src={imageUrl}
                                  alt={`${listing.listingName} - Image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="96px"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {hasMultipleImages && (
                          <>
                            <div onClick={(e) => e.stopPropagation()}>
                              <CarouselPrevious
                                className="left-1 h-6 w-6 bg-white/80 hover:bg-white border-none shadow"
                                size="icon"
                              />
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <CarouselNext
                                className="right-1 h-6 w-6 bg-white/80 hover:bg-white border-none shadow"
                                size="icon"
                              />
                            </div>
                          </>
                        )}
                      </Carousel>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Listing Details */}
                  <div className="flex justify-between items-center gap-3 w-full">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">
                        {listing.listingName}
                      </h4>

                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{formatSlotDate(slot.startTime)}</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>

                      {listing.remarks && (
                        <p
                          className="text-xs text-gray-600 mt-1 overflow-hidden"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical' as const,
                          }}
                        >
                          {listing.remarks}
                        </p>
                      )}
                    </div>

                    <div className="text-base font-bold text-primary whitespace-nowrap pr-1">
                      {formatPrice(listing.price)}
                    </div>
                  </div>
                </div>
              ));
            }

            // If no booked slots, display the listing as before
            return (
              <div
                key={`${listing.id}-${listingIndex}`}
                className="flex gap-3 p-3 rounded-lg border bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                {/* Listing Image */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {hasImages ? (
                    <Carousel className="w-full h-full">
                      <CarouselContent>
                        {listing.imageUrls?.map((imageUrl: string, index: number) => (
                          <CarouselItem key={index}>
                            <div className="relative w-24 h-24">
                              <Image
                                src={imageUrl}
                                alt={`${listing.listingName} - Image ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {hasMultipleImages && (
                        <>
                          <div onClick={(e) => e.stopPropagation()}>
                            <CarouselPrevious
                              className="left-1 h-6 w-6 bg-white/80 hover:bg-white border-none shadow"
                              size="icon"
                            />
                          </div>
                          <div onClick={(e) => e.stopPropagation()}>
                            <CarouselNext
                              className="right-1 h-6 w-6 bg-white/80 hover:bg-white border-none shadow"
                              size="icon"
                            />
                          </div>
                        </>
                      )}
                    </Carousel>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Listing Details */}
                <div className="flex flex-row justify-between items-start gap-3">
                  {/* Left: name + remarks */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">
                      {listing.listingName}
                    </h4>
                    {listing.remarks && (
                      <p
                        className="text-xs text-gray-600 mt-1 overflow-hidden"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical' as const,
                        }}
                      >
                        {listing.remarks}
                      </p>
                    )}
                  </div>

                  {/* Right: price */}
                  <div className="text-sm font-bold text-primary whitespace-nowrap">
                    {formatPrice(listing.price)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vendor Subtotal */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Subtotal</span>
            <span className="text-xl font-bold text-primary">
              {formatPrice(vendorTotal)}
            </span>
          </div>

          {/* Pay Now Button for Pending Orders - Admin View */}
          {viewMode === 'admin' && listings[0]?.listing?.bookingStatus === OrderStatus.PENDING && onPayNow && (
            <div className="flex justify-end">
              <Button
                className="mt-4"
                onClick={() => onPayNow(order.id)}
                variant="default"
              >
                Pay Now
              </Button>
            </div>
          )}

          {/* Confirm/Reject Buttons for Paid Orders - Vendor View */}
          {viewMode === 'vendor' && listings[0]?.listing?.bookingStatus === OrderStatus.PAID && (onConfirm || onReject) && (
            <div className="flex justify-end gap-2 mt-4">
              {onReject && (
                <Button
                  onClick={() => setShowRejectModal(true)}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Reject Booking
                </Button>
              )}
              {onConfirm && (
                <Button
                  onClick={() => onConfirm()}
                  variant="default"
                >
                  Confirm Booking
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete Order"
        itemName={`order from ${displayName}`}
        description={`Are you sure you want to delete this order? This will cancel your booking and cannot be undone.`}
        onConfirm={() => {
          if (onDelete) {
            onDelete(order.id, listings[0]?.listing.id);
          }
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
        confirmButtonText="Delete Order"
        cancelButtonText="Keep Order"
      />

      <DeleteConfirmationModal
        open={showRejectModal}
        onOpenChange={setShowRejectModal}
        title="Reject Booking"
        itemName={`booking from ${displayName}`}
        description={`Are you sure you want to reject this booking? This will automatically issue a partial refund to the customer and restore the listing availability. This action cannot be undone.`}
        onConfirm={() => {
          if (onReject) {
            onReject();
          }
          setShowRejectModal(false);
        }}
        onCancel={() => setShowRejectModal(false)}
        confirmButtonText="Reject Booking"
        cancelButtonText="Keep Booking"
      />
    </Card>
  );
}
