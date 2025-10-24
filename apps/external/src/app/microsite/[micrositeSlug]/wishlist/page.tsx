'use client';

import { use, useEffect, useState } from 'react';

import { MicrositeService, WishlistItemResponseDto, WishlistService } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import { ArrowLeft, Check, ExternalLink, Gift, Heart } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useMicrositeManager } from '../../../hooks/useMicrositeManager';
import MicrositeLogin from '../../components/MicrositeLogin';

export type PageProps = {
  params: Promise<{ micrositeSlug: string }>;
};

export default function WishlistPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const micrositeSlug = decodeURIComponent(resolvedParams.micrositeSlug);
  const { hasAccess, guestDetails, micrositeData, handleMicrositeLogin } = useMicrositeManager();

  const [wishlistItems, setWishlistItems] = useState<WishlistItemResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [weddingId, setWeddingId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<WishlistItemResponseDto | null>(null);
  const [isReserving, setIsReserving] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      try {
        // First, get the microsite to find the weddingId
        const micrositeData = await MicrositeService.micrositeControllerGetMicrositeDetails(
          micrositeSlug,
        );
        const fetchedWeddingId = micrositeData.weddingId;
        setWeddingId(fetchedWeddingId);

        // Then fetch the wishlist items
        const items = await WishlistService.wishlistControllerFindAllByWeddingId(
          fetchedWeddingId,
        );
        setWishlistItems(items);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [micrositeSlug]);

  const handleReserveClick = (item: WishlistItemResponseDto) => {
    if (item.isReserved) {
      toast.info('This item is already reserved');
      return;
    }
    setSelectedItem(item);
  };

  const confirmReservation = async () => {
    if (!selectedItem) return;

    setIsReserving(true);
    try {
      const updatedItem = await WishlistService.wishlistControllerReserve(selectedItem.id, {
        isReserved: true,
        reservedByName: guestDetails?.name || undefined,
      });
      setWishlistItems(
        wishlistItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      );
      toast.success(
        "Thank you! You've reserved this gift. The couple will be delighted!",
      );
      setSelectedItem(null);
    } catch (error: unknown) {
      console.error('Error reserving item:', error);
      if (error && typeof error === 'object' && 'status' in error && error.status === 400) {
        toast.error('This item was just reserved by someone else');
        // Refresh the list
        if (weddingId) {
          const items = await WishlistService.wishlistControllerFindAllByWeddingId(weddingId);
          setWishlistItems(items);
        }
      } else {
        toast.error('Failed to reserve item. Please try again.');
      }
    } finally {
      setIsReserving(false);
    }
  };

  if (!hasAccess) {
    return (
      <MicrositeLogin
        micrositeData={micrositeData}
        decodedPlanName={micrositeSlug}
        handleMicrositeLogin={handleMicrositeLogin}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-brand-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-50">
      {/* Header */}
      <div>
        <div className="container mx-auto px-4 py-6">
          <Link
            href={`/microsite/${micrositeSlug}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Microsite
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Gift className="h-8 w-8 text-brand-600" />
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900">Our Wishlist</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Your presence at our wedding is the greatest gift of all. However, if you would
            like to honor us with a gift, here are some items we would cherish.
          </p>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="container mx-auto px-4 py-12">
        {wishlistItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No items yet</h3>
              <p className="text-gray-600">
                The couple hasn&apos;t added any wishlist items yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card
                key={item.id}
                className={`overflow-hidden transition-all hover:shadow-lg ${
                  item.isReserved ? 'opacity-75' : 'hover:scale-[1.02]'
                }`}
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 flex-1 pr-2">
                        {item.title}
                      </h3>
                      {item.isReserved && (
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          <Check className="h-4 w-4" />
                          Reserved
                        </div>
                      )}
                    </div>
                    {item.isReserved && item.reservedByName && (
                      <p className="text-sm text-gray-600">
                        Reserved by {item.reservedByName === guestDetails?.name ? 'you' : item.reservedByName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <a
                      href={item.itemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <span className="truncate">View Item</span>
                      <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                    </a>

                    <Button
                      onClick={() => handleReserveClick(item)}
                      disabled={item.isReserved}
                      className={`w-full ${
                        item.isReserved
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-primary hover:bg-primary-hover'
                      }`}
                    >
                      {item.isReserved ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Already Reserved
                        </>
                      ) : (
                        <>
                          <Heart className="h-4 w-4 mr-2" />
                          Reserve This Gift
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserve This Gift?</DialogTitle>
            <DialogDescription>
              Are you sure you want to reserve &quot;{selectedItem?.title}&quot;? This will let the
              couple know you&apos;ll be getting this item for them.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedItem(null)}
              disabled={isReserving}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmReservation}
              disabled={isReserving}
              className="bg-primary hover:bg-primary-hover"
            >
              {isReserving ? 'Reserving...' : 'Yes, Reserve This Gift'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
