'use client';

import { AvailabilitySlotDto, ListingResponseDto, OrderResponseDto, OrderStatus } from '@shared/api';
import { Badge } from '@shared/components/ui/badge';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@shared/components/ui/carousel';
import { DeleteConfirmationModal } from '@shared/components/ui/delete-confirmation-modal';
import { Calendar, Camera, Clock, ExternalLink, Mail, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface OrderCardProps {
  order: OrderResponseDto;
  listings: Array<{ listing: ListingResponseDto; bookedSlots?: AvailabilitySlotDto[] }>;
  vendorName: string;
  vendorId?: number;
  vendorEmail?: string;
  onDelete?: (orderId: number) => void;
  onPayNow?: (orderId: number) => void;
}

export function OrderCard({ order, listings, vendorName, vendorId, vendorEmail, onDelete, onPayNow }: OrderCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: order.currency || 'SGD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSlotDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case OrderStatus.PAID:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case OrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">
               {vendorName}
              </CardTitle>
              {vendorId && (
                <Link
                  href={`/admin/ecommerce/vendor/${vendorId}?from=orders`}
                  className="text-brand-600 hover:text-brand-800"
                  title="View vendor page"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
              {vendorEmail && (
                <a
                  href={`mailto:${vendorEmail}`}
                  className="text-brand-600 hover:text-brand-800"
                  title="Contact vendor"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
            </div>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Purchased on: {formatDate(order.purchaseDate)}
              </div>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {order.orderStatus === OrderStatus.PENDING && onDelete && (
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
            <Badge className={`${getStatusColor(order.orderStatus)} border`}>
              {order.orderStatus}
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
                          {listing.imageUrls!.map((imageUrl: string, index: number) => (
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
                        {listing.imageUrls!.map((imageUrl: string, index: number) => (
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

        {/* Order Total */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Amount</span>
            <span className="text-xl font-bold text-primary">
              {formatPrice(order.totalAmount)}
            </span>
          </div>

          {/* Pay Now Button for Pending Orders */}
          {order.orderStatus === OrderStatus.PENDING && onPayNow && (
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
        </div>
      </CardContent>

      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete Order"
        itemName={`order from ${vendorName}`}
        description={`Are you sure you want to delete this order? This will cancel your booking and cannot be undone.`}
        onConfirm={() => {
          if (onDelete) {
            onDelete(order.id);
          }
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
        confirmButtonText="Delete Order"
        cancelButtonText="Keep Order"
      />
    </Card>
  );
}
