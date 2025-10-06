'use client';

import { ListingResponseDto, VendorResponseDto } from '@shared/api';
import { ListingCard } from './ListingCard';

interface ListingsGridProps {
  listings: ListingResponseDto[];
  vendors: VendorResponseDto[];
}

export function ListingsGrid({ listings, vendors }: ListingsGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No listings available in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {listings.map((listing) => {
        const vendor = vendors.find(v => v.id === listing.vendorId);
        if (!vendor) return null;

        return (
          <div key={listing.id}>
            <ListingCard listing={listing} vendor={vendor} />
          </div>
        );
      })}
    </div>
  );
}