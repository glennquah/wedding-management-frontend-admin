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
  Rating,
  RatingButton,
} from '@shared/components';
import { CheckCheck, CircleX, Edit2, ExternalLink, Image as ImageIcon, Trash2 } from 'lucide-react';

interface VendorDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditVendor: (vendor: VendorResponseDto) => void;
  onDeleteVendor: (Vendor: VendorResponseDto) => void;
  onRejectOnboarding: (Vendor: VendorResponseDto) => void;
  onApproveOnboarding: (Vendor: VendorResponseDto) => void;
  vendor: VendorResponseDto;
}

export function VendorDetailsModal({
  open,
  onOpenChange,
  onEditVendor,
  onDeleteVendor,
  onRejectOnboarding,
  onApproveOnboarding,
  vendor,
}: VendorDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          {/* Vendor Name */}
          <h2 className="text-2xl font-semibold text-center flex-1">{vendor.name}</h2>

          {/* Rating */}
          {vendor.rating !== 0 && (
            <div className="flex justify-center mt-2">
              <Rating defaultValue={vendor.rating} readOnly>
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton className="text-red-500" key={index} size={20} />
                ))}
              </Rating>
            </div>
          )}

          <div className="relative flex items-center justify-center mt-4">
            {/* Badges */}
            <div className="flex gap-2">
              <Badge variant="default">{vendor.serviceOffered}</Badge>
              <Badge variant="outline">{vendor.styleOffered}</Badge>
            </div>

            {/* Action Buttons Row */}
            {vendor.onboardingStatus == VendorOnboardingStatus.PENDING ? (
              <div className="absolute right-0 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onRejectOnboarding(vendor)}>
                  <CircleX className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onApproveOnboarding(vendor)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            ) : vendor.onboardingStatus === VendorOnboardingStatus.ONBOARDED ? (
              <div className="absolute right-0 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onEditVendor(vendor)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteVendor(vendor)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            ) : (
              <div className="absolute right-0 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onEditVendor(vendor)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onApproveOnboarding(vendor)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteVendor(vendor)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          <hr className="my-4 border border-muted-foreground" />
        </DialogHeader>

        {/* Split Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Account Details Card */}
          <Card className="bg-transparent border-brand-200">
            <CardHeader className="flex justify-center text-center">
              <CardTitle className="text-primary">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Email:</p>
                <p className="text-sm text-muted-foreground">{vendor.email || '-'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-1">UEN Number:</p>
                <p className="text-sm text-muted-foreground">{vendor.uenNumber || '-'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-1">Website:</p>
                {vendor.vendorWebsite ? (
                  <a
                    href={vendor.vendorWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {vendor.vendorWebsite} <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-1">Bio:</p>
                <p className="text-sm text-muted-foreground">{vendor.bio || '-'}</p>
              </div>

              {vendor.serviceOffered === WeddingService.VENUE && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Capacity:</p>
                  <p className="text-sm text-muted-foreground">{vendor.capacity}</p>
                </div>
              )}

              {vendor.weddingTypes && vendor.weddingTypes.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Wedding Types:</p>
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
          <Card className="bg-transparent border-brand-200 flex flex-col">
            <CardHeader className="flex justify-center text-center">
              <CardTitle className="text-primary">Product Listings</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex items-center justify-center">
              <Carousel className="w-full max-w-xs h-full">
                <CarouselContent>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <CarouselItem key={index}>
                      <div className="flex flex-col items-center justify-center h-full p-6 rounded-lg">
                        <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground text-center">
                          Vendor listings will appear here as a carousel
                        </span>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-white border border-gray-300 shadow-md hover:bg-gray-100 text-gray-700" />
                <CarouselNext className="bg-white border border-gray-300 shadow-md hover:bg-gray-100 text-gray-700" />
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
