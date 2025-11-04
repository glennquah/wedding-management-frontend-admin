'use client';

import { VendorOnboardingStatus, VendorResponseDto, WeddingService } from '@shared/api';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Rating,
  RatingButton,
} from '@shared/components';
import {
  CalendarDays,
  CheckCheck,
  CircleX,
  Edit2,
  ExternalLink,
  Image as ImageIcon,
  OctagonX,
  Trash2,
} from 'lucide-react';

interface VendorDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditVendor: (vendor: VendorResponseDto) => void;
  onDeleteVendor: (Vendor: VendorResponseDto) => void;
  onRejectOnboarding: (Vendor: VendorResponseDto) => void;
  onApproveOnboarding: (Vendor: VendorResponseDto) => void;
  onSuspendVendor: (Vendor: VendorResponseDto) => void;
  onUnsuspendVendor: (Vendor: VendorResponseDto) => void;
  vendor: VendorResponseDto;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';

  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const formatTime = (timeStr?: string) => {
  if (!timeStr) return 'N/A';

  return new Date(timeStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export function VendorDetailsModal({
  open,
  onOpenChange,
  onEditVendor,
  onDeleteVendor,
  onRejectOnboarding,
  onApproveOnboarding,
  onSuspendVendor,
  onUnsuspendVendor,
  vendor,
}: VendorDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          {/* Vendor Name */}
          <h2 className="flex-1 text-center text-2xl font-semibold">{vendor.name}</h2>

          {/* Rating */}
          {vendor.rating !== 0 && (
            <div className="mt-2 flex justify-center">
              <Rating defaultValue={vendor.rating} readOnly>
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton className="text-red-500" key={index} size={20} />
                ))}
              </Rating>
            </div>
          )}

          <div className="relative mt-4 flex items-center justify-center">
            {/* Badges */}
            <div className="flex gap-2">
              <Badge variant="default">{vendor.serviceOffered}</Badge>
              <Badge variant="outline">{vendor.styleOffered}</Badge>
            </div>

            {/* Action Buttons Row */}
            {vendor.onboardingStatus == VendorOnboardingStatus.PENDING ? ( // Onboarding vendors
              <div className="absolute right-0 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onRejectOnboarding(vendor)}>
                  <CircleX className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onApproveOnboarding(vendor)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            ) : vendor.onboardingStatus === VendorOnboardingStatus.ONBOARDED &&
              vendor.isSuspended == false ? ( // Live vendors
              <div className="absolute right-0 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onEditVendor(vendor)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSuspendVendor(vendor)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <OctagonX className="mr-2 h-4 w-4" />
                  Suspend
                </Button>
              </div>
            ) : vendor.onboardingStatus === VendorOnboardingStatus.ONBOARDED &&
              vendor.isSuspended == true ? ( // Suspended vendors
              <div className="absolute right-0 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onUnsuspendVendor(vendor)}>
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Unsuspend
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteVendor(vendor)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            ) : (
              // Onboarding rejected vendors
              <div className="absolute right-0 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onEditVendor(vendor)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onApproveOnboarding(vendor)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteVendor(vendor)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          <hr className="border-muted-foreground my-4 border" />
        </DialogHeader>

        {/* Split Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Account Details Card */}
          <Card className="border-brand-200 bg-transparent">
            <CardHeader className="flex justify-center text-center">
              <CardTitle className="text-primary">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div>
                <p className="text-foreground mb-1 text-sm font-medium">Email:</p>
                <p className="text-muted-foreground text-sm">{vendor.email || '-'}</p>
              </div>

              <div>
                <p className="text-foreground mb-1 text-sm font-medium">UEN Number:</p>
                <p className="text-muted-foreground text-sm">{vendor.uenNumber || '-'}</p>
              </div>

              <div>
                <p className="text-foreground mb-1 text-sm font-medium">Website:</p>
                {vendor.vendorWebsite ? (
                  <a
                    href={vendor.vendorWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    {vendor.vendorWebsite} <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="text-muted-foreground text-sm">-</p>
                )}
              </div>

              <div>
                <p className="text-foreground mb-1 text-sm font-medium">Bio:</p>
                <p className="text-muted-foreground text-sm">{vendor.bio || '-'}</p>
              </div>

              {vendor.serviceOffered === WeddingService.VENUE && (
                <div>
                  <p className="text-foreground mb-1 text-sm font-medium">Capacity:</p>
                  <p className="text-muted-foreground text-sm">{vendor.capacity}</p>
                </div>
              )}

              {vendor.weddingTypes && vendor.weddingTypes.length > 0 && (
                <div>
                  <p className="text-foreground mb-1 text-sm font-medium">Wedding Types:</p>
                  <div className="flex flex-wrap gap-2">
                    {vendor.weddingTypes.map((type) => (
                      <Badge key={type} variant="outline">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vendor Listing Carousel */}
          <Card className="border-brand-200 flex flex-col bg-transparent">
            <CardHeader className="flex justify-center text-center">
              <CardTitle className="text-primary">Product Listings</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-1 items-center justify-center p-4">
              <Carousel className="w-full max-w-sm">
                <CarouselContent>
                  {vendor.listings && vendor.listings.length > 0 ? (
                    vendor.listings.map((listing) => (
                      <CarouselItem key={listing.id}>
                        <div className="p-1">
                          <Card className="flex h-full flex-col">
                            {listing.imageUrls && listing.imageUrls.length > 0 ? (
                              <img
                                src={listing.imageUrls[0]}
                                alt={listing.listingName}
                                className="h-48 w-full rounded-t-lg object-cover"
                              />
                            ) : (
                              <div className="bg-muted flex h-48 w-full items-center justify-center rounded-t-lg">
                                <ImageIcon className="text-muted-foreground h-12 w-12" />
                              </div>
                            )}

                            <CardHeader>
                              <CardTitle className="text-lg">{listing.listingName}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col justify-between p-4">
                              <p className="text-muted-foreground mb-4 text-sm">
                                {listing.remarks || 'No description available.'}
                              </p>

                              <div className="flex items-end justify-between">
                                {listing.availabilities && listing.availabilities.length > 0 ? (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="default" size="sm">
                                        <CalendarDays className="mr-2 h-4 w-4" />
                                        View {listing.availabilities.length} Available Slot(s)
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                      <div className="mb-2 text-sm font-medium">
                                        Available Slots
                                      </div>
                                      <div className="max-h-48 space-y-2 overflow-y-auto">
                                        {listing.availabilities.map((slot, index) => (
                                          <div key={index} className="bg-muted rounded-md p-2">
                                            <p className="font-semibold">{formatDate(slot.date)}</p>
                                            <p className="text-muted-foreground text-xs">
                                              {formatTime(slot.startTime)} to{' '}
                                              {formatTime(slot.endTime)}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                ) : (
                                  <Badge variant="secondary"> No availability info</Badge>
                                )}

                                <p className="text-primary text-right text-xl font-semibold">
                                  ${listing.price.toFixed(2)}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    // Empty state
                    <CarouselItem>
                      <div className="flex h-full flex-col items-center justify-center p-6">
                        <ImageIcon className="text-muted-foreground mb-2 h-10 w-10" />
                        <span className="text-muted-foreground text-center text-sm">
                          This vendor has no product listings yet.
                        </span>
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious className="border border-gray-300 bg-white text-gray-700 shadow-md hover:bg-gray-100" />
                <CarouselNext className="border border-gray-300 bg-white text-gray-700 shadow-md hover:bg-gray-100" />
              </Carousel>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={() => onOpenChange(false)} size="lg">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
