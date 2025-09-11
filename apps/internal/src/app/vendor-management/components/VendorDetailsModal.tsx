"use client";

import { VendorResponseDto } from "@shared/api";
import { Button, Card, CardContent, CardHeader, CardTitle, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@shared/components";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader
} from "@shared/components/ui/dialog";
import { ExternalLink, Image as ImageIcon } from "lucide-react";

interface VendorDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: VendorResponseDto;
}

export function VendorDetailsModal({
  open,
  onOpenChange,
  vendor,
}: VendorDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          {/* Centered Vendor Name */}
          <h2 className="text-2xl font-semibold text-center">{vendor.name}</h2>
          <hr className="my-4 border border-muted-foreground" />
        </DialogHeader>

        {/* Split Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Account Details Card */}
          <Card className="bg-transparent border-brand-200">
            <CardHeader className="flex justify-center text-center">
                <CardTitle className="text-primary">
                    Account Details
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Email:
                </p>
                <p className="text-sm text-muted-foreground">
                  {vendor.email || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  UEN Number:
                </p>
                <p className="text-sm text-muted-foreground">
                  {vendor.uenNumber || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Website:
                </p>
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
                <p className="text-sm font-medium text-foreground mb-1">
                  Bio:
                </p>
                <p className="text-sm text-muted-foreground">
                  {vendor.bio || "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Listing Carousel */}
          <div className="flex items-center justify-center rounded-lg">
            <Carousel className="w-full max-w-xs h-full">
                <CarouselContent>
                    {Array.from({ length: 3 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <Card className="bg-transparent border-brand-200">
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">Vendor listings will appear here as a carousel</span>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="bg-white border border-gray-300 shadow-md hover:bg-gray-100 text-gray-700" />
                <CarouselNext className="bg-white border border-gray-300 shadow-md hover:bg-gray-100 text-gray-700" />
            </Carousel>
            
          </div>
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
