'use client';

import { Badge } from '@shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Star, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { VendorWithScore } from '../hooks/useVendorData';

interface VendorCardProps {
  vendor: VendorWithScore;
  maxScore?: number; // For normalization
}

export function VendorCard({ vendor, maxScore }: VendorCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/admin/ecommerce/vendor/${vendor.id}?from=marketplace`);
  };

  // Normalize score - if maxScore is provided, scale relative to it
  const matchScore = maxScore && maxScore > 0
    ? Math.round((vendor.final_score / maxScore) * 100)
    : Math.round(vendor.final_score * 100);

  return (
    <Card
      className='flex flex-col justify-between overflow-hidden hover:shadow-lg transition-all cursor-pointer group border-2 border-primary/20 w-full h-full'
      onClick={handleClick}
    >
      <CardHeader className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <Badge variant='default' className='bg-primary/10 text-primary hover:bg-primary/20'>
            <TrendingUp className='w-3 h-3 mr-1' />
            {matchScore}% Match
          </Badge>

          <div className='flex items-center gap-1'>
            <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
            <span className='text-sm font-semibold'>
              {vendor.rating > 0 ? vendor.rating.toFixed(1) : 'No ratings yet!'}
            </span>
          </div>
        </div>

          <CardTitle className='text-lg font-semibold group-hover:text-primary transition-colors overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]'>
            {vendor.name}
          </CardTitle>
        </CardHeader>

        <CardContent className='mt-auto'>
          <div className='space-y-1'>
            <p className='text-sm font-semibold text-muted-foreground'>
              <span className='font-medium'>Service:</span> {vendor.serviceOffered}
            </p>
            <p className='text-sm font-semibold text-muted-foreground'>
              <span className='font-medium'>Style:</span> {vendor.styleOffered}
            </p>
          </div>
        </CardContent>
        
      <CardContent className='mt-auto'>
        {vendor.bio && (
          <p className='text-sm text-gray-600' style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const
          }}>
            {vendor.bio}
          </p>
        )}
        </CardContent>

        {/* Starting From */}
        <CardContent className='mt-auto'>
          {vendor.startingPrice !== undefined ? (
            vendor.startingPrice !== null ? (
              <div className='flex items-center gap-1 flex-nowrap'>
                <span className='text-sm text-muted-foreground font-medium whitespace-nowrap'>Starting From:</span>
                <span className='text-lg font-bold text-primary whitespace-nowrap'>
                  ${vendor.startingPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>
                <span className='font-medium'>Starting From:</span> N/A
              </p>
            )
          ) : (
            <p className='text-sm text-muted-foreground'>Loading price...</p>
          )}

        </CardContent>
    </Card>
  );
}
