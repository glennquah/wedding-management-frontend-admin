import { Star } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@shared/components/ui/badge';
import { ListingHeaderProps } from '../../types';

export function ListingHeader({ listing, vendor, formatPrice }: ListingHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {listing.listingName}
      </h1>
      {vendor && (
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <span>
            by{' '}
            <Link
              href={`/admin/ecommerce/vendor/${vendor.id}?from=listing`}
              className="text-primary hover:underline font-medium"
            >
              {vendor.name}
            </Link>
          </span>
          {vendor.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{vendor.rating.toFixed(1)}</span>
            </div>
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