import { Star } from 'lucide-react';
import { Badge } from '@shared/components/ui/badge';
import { ListingResponseDto, VendorResponseDto } from '@wedding/api-types';

interface ListingHeaderProps {
  listing: ListingResponseDto;
  vendor: VendorResponseDto | null;
  formatPrice: (price: number) => string;
}

export function ListingHeader({ listing, vendor, formatPrice }: ListingHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {listing.listingName}
      </h1>
      {vendor && (
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <span>
            by <span className="text-primary font-medium">{vendor.name}</span>
          </span>
          {vendor.rating && vendor.rating > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{vendor.rating.toFixed(1)}</span>
            </div>
          ) : (
            <span className='text-sm font-medium'>No ratings yet!</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 mb-4">
        <div className="text-2xl font-bold text-primary">
          {formatPrice(listing.price)}
          <span className="text-base font-normal text-muted-foreground ml-1">
            starting from
          </span>
        </div>
        {vendor && (
          <Badge variant="secondary">
            {vendor.serviceOffered}
          </Badge>
        )}
      </div>
    </div>
  );
}
