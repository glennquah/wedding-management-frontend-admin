'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ListingResponseDto, VendorResponseDto, ListingsService, VendorsService } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Badge } from '@shared/components/ui/badge';
import { Skeleton } from '@shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@shared/components/ui/alert';
import { ArrowLeft, Star, Mail, Globe, AlertTriangle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function ListingPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const [listing, setListing] = useState<ListingResponseDto | null>(null);
  const [vendor, setVendor] = useState<VendorResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAvailabilityPage, setCurrentAvailabilityPage] = useState(1);

  useEffect(() => {
    const fetchListingAndVendor = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch listing by ID
        const listingData = await ListingsService.listingControllerFindById(parseInt(listingId));
        setListing(listingData);

        // Fetch vendor data
        if (listingData.vendorId) {
          const vendorData = await VendorsService.vendorControllerGetVendor(listingData.vendorId);
          setVendor(vendorData);
        }
      } catch (err: any) {
        console.error('Error fetching listing:', err);

        if (err?.status === 404) {
          setError('Listing not found. It may have been removed or the ID is incorrect.');
        } else if (err?.status === 401) {
          setError('Authentication required. Please ensure you are logged in with admin privileges.');
        } else {
          setError('Failed to load listing details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchListingAndVendor();
    }
  }, [listingId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
    }).format(price);
  };

  const handleBack = () => {
    router.push('/admin/ecommerce');
  };

  // Pagination logic for availability
  const ITEMS_PER_PAGE = 4;
  const availabilities = listing?.availabilities || [];
  const totalPages = Math.ceil(availabilities.length / ITEMS_PER_PAGE);
  const startIndex = (currentAvailabilityPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAvailabilities = availabilities.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentAvailabilityPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentAvailabilityPage(prev => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-12 w-96 mb-2" />
          <Skeleton className="h-6 w-48" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        <Alert variant="destructive" className="max-w-2xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Listing not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Marketplace
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {listing.imageUrls && listing.imageUrls.length > 0 ? (
              <Image
                src={listing.imageUrls[0]}
                alt={listing.listingName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center text-2xl">
                    📷
                  </div>
                  <span>No image available</span>
                </div>
              </div>
            )}
          </div>

          {/* Additional images */}
          {listing.imageUrls && listing.imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {listing.imageUrls.slice(1, 5).map((imageUrl, index) => (
                <div key={index} className="aspect-square relative rounded-md overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`${listing.listingName} ${index + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Listing Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {listing.listingName}
            </h1>
            {vendor && (
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <span>by {vendor.name}</span>
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

          {listing.remarks && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {listing.remarks}
                </p>
              </CardContent>
            </Card>
          )}

          {availabilities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Availability
                </CardTitle>
                <CardDescription>
                  Available time slots for this listing ({availabilities.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {currentAvailabilities.map((slot, index) => (
                    <div key={startIndex + index} className="p-3 border rounded-lg bg-gray-50">
                      <div className="text-sm text-muted-foreground">
                        {slot.date && new Date(slot.date).toLocaleDateString('en-SG', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="font-medium">
                        {new Date(slot.startTime).toLocaleTimeString('en-SG', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(slot.endTime).toLocaleTimeString('en-SG', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1}-{Math.min(endIndex, availabilities.length)} of {availabilities.length} slots
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentAvailabilityPage === 1}
                        className="flex items-center gap-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1 px-3">
                        <span className="text-sm font-medium text-gray-700">
                          {currentAvailabilityPage} of {totalPages}
                        </span>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentAvailabilityPage === totalPages}
                        className="flex items-center gap-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {vendor && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendor Information</CardTitle>
                <CardDescription>
                  Contact details and business information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {vendor.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.email}</span>
                  </div>
                )}

                {vendor.rating && (
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>Rating: {vendor.rating.toFixed(1)}/5</span>
                  </div>
                )}

                {vendor.vendorWebsite && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={vendor.vendorWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="w-full">
            <Button className="w-full">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}