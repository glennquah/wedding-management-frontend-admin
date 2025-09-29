'use client';

import { ListingResponseDto, VendorResponseDto, WeddingService } from '@shared/api';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@shared/components/ui/carousel';
import { Button } from '@shared/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  if (listings.length === 0) {
    return null;
  }

  const handleSeeMore = () => {
    router.push(`/admin/ecommerce/category/${category.toLowerCase()}`);
  };

  // Limit to 4 listings for desktop, 2 for mobile
  const maxListings = 4;
  const displayedListings = listings.slice(0, maxListings);

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
          <CarouselContent className="-ml-2 md:-ml-3">
            {displayedListings.map((listing) => {
              const vendor = vendors.find(v => v.id === listing.vendorId);
              if (!vendor) return null;

              return (
                <CarouselItem
                  key={listing.id}
                  className="pl-2 md:pl-3 !basis-[calc(100%-1rem)] xs:!basis-[calc(50%-0.75rem)] sm:!basis-[calc(33.333%-0.67rem)] md:!basis-[calc(25%-0.75rem)] lg:!basis-[calc(20%-0.8rem)] xl:!basis-[calc(16.666%-0.83rem)]"
                >
                  <ListingCard listing={listing} vendor={vendor} />
                </CarouselItem>
              );
            })}

            <CarouselItem className="pl-2 md:pl-3 !basis-[calc(100%-1rem)] xs:!basis-[calc(50%-0.75rem)] sm:!basis-[calc(33.333%-0.67rem)] md:!basis-[calc(25%-0.75rem)] lg:!basis-[calc(20%-0.8rem)] xl:!basis-[calc(16.666%-0.83rem)] flex items-center justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleSeeMore}
                className="h-full min-h-[300px] w-full flex flex-col items-center justify-center gap-3 border-2 border-gray-300 bg-gray-50 text-black hover:bg-primary hover:text-white hover:border-primary transition-all shadow-md"
              >
                <span className="text-lg font-semibold">See More</span>
                <ArrowRight className="w-6 h-6" />
              </Button>
            </CarouselItem>
          </CarouselContent>

          {displayedListings.length > 1 && (
            <>
              <CarouselPrevious className="hidden xs:flex -left-4 lg:-left-8" />
              <CarouselNext className="hidden xs:flex -right-4 lg:-right-8" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}