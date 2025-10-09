'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@shared/components/ui/carousel';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { VendorWithScore } from '../hooks';
import { VendorCard } from './VendorCard';

interface RecommendedVendorsCarouselProps {
  vendors: VendorWithScore[];
  loading?: boolean;
}

export function RecommendedVendorsCarousel({ vendors, loading }: RecommendedVendorsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    onSelect();
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  if (loading) {
    return (
      <section className='mb-12'>
        <div className='flex items-center gap-3 mb-6'>
          <Sparkles className='w-8 h-8 text-primary animate-pulse' />
          <div>
            <h2 className='text-3xl font-bold text-gray-900'>Loading Recommendations...</h2>
            <p className='text-sm text-muted-foreground mt-1'>Finding the perfect vendors for you</p>
          </div>
        </div>
        <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='h-64 bg-gray-200 animate-pulse rounded-lg' />
          ))}
        </div>
      </section>
    );
  }

  if (!vendors || vendors.length === 0) {
    return null;
  }

  // Get the max score (first vendor's score) for normalization so first vendor shows 100% match
  const maxScore = vendors.length > 0 ? vendors[0].final_score : 1;

  return (
    <section className='mb-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-6 border-2 border-primary/20'>
      <div className='flex items-center gap-3 mb-6'>
        <Sparkles className='w-8 h-8 text-primary' />
        <div>
          <h2 className='text-3xl font-bold text-gray-900'>Recommended for You</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Handpicked vendors based on your wedding preferences
          </p>
        </div>
      </div>

      <div className='relative'>
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: false,
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-2 md:-ml-3'>
            {vendors.map((vendor) => (
              <CarouselItem
                key={vendor.id}
                className='pl-2 md:pl-3 !basis-[calc(100%-1rem)] sm:!basis-[calc(50%-0.75rem)] md:!basis-[calc(33.333%-0.67rem)] lg:!basis-[calc(25%-0.75rem)] xl:!basis-[calc(20%-0.8rem)]'
              >
                <VendorCard vendor={vendor} maxScore={maxScore} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {vendors.length > 4 && (
            <>
              {canScrollPrev && (
                <CarouselPrevious className='left-0 bg-primary border border-gray-300 shadow-lg hover:bg-destructive' />
              )}
              {canScrollNext && (
                <CarouselNext className='right-0 bg-primary border border-gray-300 shadow-lg hover:bg-destructive' />
              )}
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}
