import { Button } from '@shared/components';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Badge } from '@shared/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@shared/components/ui/carousel';
import { Calendar, Clock, DollarSign, Edit2, FileText, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Listing } from './types';

interface ListingCardProps {
  listing: Listing;
  onEdit: (listing: Listing) => void;
  onDelete: (id: number) => void;
  serviceType?: string;
}

export const ListingCard = ({ listing, onEdit, onDelete, serviceType }: ListingCardProps) => {
  const hasImages = listing.imageUrls && listing.imageUrls.length > 0 && listing.imageUrls[0];
  const hasMultipleImages = listing.imageUrls && listing.imageUrls.length > 1;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
    }).format(price);
  };

  const formatAvailabilities = (availabilities: Listing['availabilities']) => {
    if (!availabilities || availabilities.length === 0) return 'No dates specified';
    const formattedDates = availabilities.slice(0, 2).map(availability => {
      // Handle new object format (AvailabilitySlotDto)
      if (typeof availability === 'object' && availability.startTime) {
        const dateObj = new Date(availability.startTime);
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      // Handle legacy string format
      const dateObj = new Date(availability as unknown as string);
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    return formattedDates.join(', ') + (availabilities.length > 2 ? ` +${availabilities.length - 2} more` : '');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full h-full hover:shadow-xl transition-all duration-300 group">
      <div className="relative overflow-hidden rounded-t-lg">
        <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-100 to-gray-200">
          {hasImages ? (
            <Carousel className="w-full h-full">
              <CarouselContent>
                {listing.imageUrls!.map((imageUrl, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={imageUrl}
                        alt={`${listing.listingName} - Image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="300px"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {hasMultipleImages && (
                <>
                  <div onClick={(e) => e.stopPropagation()}>
                    <CarouselPrevious
                      className="left-2 bg-white hover:bg-gray-50 border border-gray-200 shadow-lg text-gray-700 hover:text-gray-900"
                      size="sm"
                    />
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <CarouselNext
                      className="right-2 bg-white hover:bg-gray-50 border border-gray-200 shadow-lg text-gray-700 hover:text-gray-900"
                      size="sm"
                    />
                  </div>
                </>
              )}
            </Carousel>
          ) : (
            <div className="text-gray-400 text-center flex items-center justify-center h-full">
              <div>
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                  📷
                </div>
                <span className="text-xs">No image available</span>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons positioned over the image */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(listing);
            }}
            className="h-8 w-8 p-0 bg-white hover:bg-blue-50 border border-gray-200 shadow-lg"
          >
            <Edit2 className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(listing.id);
            }}
            className="h-8 w-8 p-0 bg-white hover:bg-red-50 border border-gray-200 shadow-lg"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
            {listing.listingName}
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Updated {formatDate(listing.updatedAt)}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        {listing.remarks && (
          <p className="text-sm text-gray-600 mb-3 overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const
          }}>
            {listing.remarks}
          </p>
        )}

        <div className="flex justify-between items-center mb-3">
          <div className="text-lg font-bold text-primary">
            {formatPrice(listing.price)}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              starting from
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3" />
            <span className="font-medium">Available:</span>
          </div>
          <p className="text-xs">{formatAvailabilities(listing.availabilities)}</p>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Badge variant="secondary" className="text-xs">
          {serviceType || 'Service Listing'}
        </Badge>
      </CardFooter>
    </Card>
  );
};