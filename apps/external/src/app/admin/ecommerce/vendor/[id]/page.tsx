'use client';

import { Badge } from '@shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Skeleton } from '@shared/components/ui/skeleton';
import { Globe, Mail, Star } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ListingsGrid } from '../../components/ListingsGrid';
import { ErrorState } from '../../components/common';
import { BackButton } from '../../components/ui';
import { useVendorData } from '../../hooks';

export default function VendorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = params?.id as string;

  // Determine where the user came from based on query param
  const from = searchParams?.get('from') || 'marketplace';

  const { vendor, listings, loading, error } = useVendorData(vendorId);

  const handleBack = () => {
    router.back();
  };

  let backLabel: string;
  switch (from) {
    case 'listing':
      backLabel = 'Back to Listing';
      break;
    case 'orders':
      backLabel = 'Back to Orders';
      break;
    default:
      backLabel = 'Back to Marketplace';
      break;
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Skeleton className="h-8 w-1/4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton onBack={handleBack} />
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton onBack={handleBack} />
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Vendor Not Found</h2>
          <p className="text-muted-foreground">The vendor you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton onBack={handleBack} label={backLabel} />

      {/* Vendor Header */}
      <div className="mb-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{vendor.name}</h1>

          {/* Service & Rating */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {vendor.serviceOffered && (
              <Badge variant="default" className="text-sm px-3 py-1">
                {vendor.serviceOffered}
              </Badge>
            )}
            {vendor.rating && (
              <div className="flex items-center gap-1.5 ml-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold">{vendor.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">rating</span>
              </div>
            )}
          </div>

          {/* Specialization Details */}
          <div className="space-y-1.5">
            {vendor.styleOffered && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-gray-700">Specializes in:</span>{' '}
                <span className="font-semibold text-gray-900 text-base">{vendor.styleOffered}</span>{' '}
                <span className="font-medium text-gray-700">weddings.</span>
              </p>
            )}
            {vendor.weddingTypes && vendor.weddingTypes.length > 0 && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-gray-700">Caters primarily to:</span>{' '}
                <span className="font-semibold text-gray-900 text-base">{vendor.weddingTypes.join(', ')}</span>{' '}
                <span className="font-medium text-gray-700">weddings.</span>
              </p>
            )}
          </div>
        </div>

        {/* Vendor Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vendor.email && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5" />
                <a href={`mailto:${vendor.email}`} className="hover:text-primary hover:underline">
                  {vendor.email}
                </a>
              </div>
            )}
            {vendor.vendorWebsite && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Globe className="w-5 h-5" />
                <a
                  href={vendor.vendorWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline"
                >
                  {vendor.vendorWebsite}
                </a>
              </div>
            )}
            {vendor.bio && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-gray-700">{vendor.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Vendor Listings */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Listings by {vendor.name}
        </h2>
        {listings.length > 0 ? (
          <ListingsGrid listings={listings} vendors={[vendor]} />
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">This vendor has no active listings at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
