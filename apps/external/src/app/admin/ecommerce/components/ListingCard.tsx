'use client';

import { ListingResponseDto, VendorResponseDto } from '@shared/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Badge } from '@shared/components/ui/badge';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ListingCardProps {
  listing: ListingResponseDto;
  vendor: VendorResponseDto;
}

export function ListingCard({ listing, vendor }: ListingCardProps) {
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
    }).format(price);
  };

  const displayImage = listing.imageUrls && listing.imageUrls.length > 0
    ? listing.imageUrls[0]
    : null;

  const handleClick = () => {
    router.push(`/admin/ecommerce/listing/${listing.id}`);
  };

  return (
    <Card className="w-full max-w-[300px] hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={handleClick}>
      <div className="relative overflow-hidden rounded-t-lg">
        <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={listing.listingName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="300px"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                📷
              </div>
              <span className="text-xs">No image available</span>
            </div>
          )}
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
            {listing.listingName}
          </CardTitle>
          <div className="flex items-center gap-1 ml-2">
            {vendor.rating && (
              <>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
              </>
            )}
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          by {vendor.name}
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

        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-primary">
            {formatPrice(listing.price)}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              starting from
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Badge variant="secondary" className="text-xs">
          {vendor.serviceOffered}
        </Badge>
      </CardFooter>
    </Card>
  );
}