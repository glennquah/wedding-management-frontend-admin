'use client';

import { ListingResponseDto, VendorResponseDto, WeddingService } from '@shared/api';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@shared/components/ui/carousel';
import { ListingCard } from './ListingCard';

interface CategoryCarouselProps {
  category: WeddingService;
  listings: ListingResponseDto[];
  vendors: VendorResponseDto[];
}

const categoryDisplayNames: Record<WeddingService, string> = {
  [WeddingService.VENUE]: 'Venues',
  [WeddingService.CATERING]: 'Catering',
  [WeddingService.PHOTOGRAPHY]: 'Photography',
  [WeddingService.DECORATION]: 'Decoration',
  [WeddingService.MUSIC]: 'Music',
  [WeddingService.ATTIRE]: 'Attire',
  [WeddingService.MAKEUP]: 'Makeup',
  [WeddingService.TRANSPORTATION]: 'Transportation',
};

export function CategoryCarousel({ category, listings, vendors }: CategoryCarouselProps) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          {categoryDisplayNames[category]}
        </h2>
        <p className="text-sm text-muted-foreground">
          {listings.length} {listings.length === 1 ? 'listing' : 'listings'} available
        </p>
      </div>

      <div className="relative">
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {listings.map((listing) => {
              const vendor = vendors.find(v => v.id === listing.vendorId);
              if (!vendor) return null;

              return (
                <CarouselItem
                  key={listing.id}
                  className="pl-2 md:pl-4 !basis-full sm:!basis-1/2 md:!basis-1/3 lg:!basis-1/4 xl:!basis-1/5"
                >
                  <ListingCard listing={listing} vendor={vendor} />
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {listings.length > 5 && (
            <>
              <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-8" />
              <CarouselNext className="hidden sm:flex -right-4 lg:-right-8" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}