'use client';

import { ListingWithVendor } from '@shared/columns/listing-columns';
import { DeleteConfirmationModal, PageHeader } from '@shared/components';
import { ListingTable } from '@shared/components/ListingTable';
import {
  EmailNotificationService,
  ListingResponseDto,
  ListingsService,
  VendorsService,
} from '@wedding/api-types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ListingManagementPage() {
  const router = useRouter();
  const [listings, setListings] = useState<ListingWithVendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmListing, setDeleteConfirmListing] = useState<ListingWithVendor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all vendors and listings on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch all vendors first
        const vendorsData = await VendorsService.vendorControllerGetAllVendors();

        // Create a map for quick vendor lookup
        const vendorMap = new Map(vendorsData.map((v) => [v.id, v]));

        // Fetch listings from all categories in parallel
        const [venues, catering, photography, decoration, music, attire, makeup, transportation] =
          await Promise.all([
            ListingsService.listingControllerGetAllVenues().catch(() => []),
            ListingsService.listingControllerGetAllCatering().catch(() => []),
            ListingsService.listingControllerGetAllPhotography().catch(() => []),
            ListingsService.listingControllerGetAllDecoration().catch(() => []),
            ListingsService.listingControllerGetAllMusic().catch(() => []),
            ListingsService.listingControllerGetAllAttire().catch(() => []),
            ListingsService.listingControllerGetAllMakeup().catch(() => []),
            ListingsService.listingControllerGetAllTransportation().catch(() => []),
          ]);

        // Combine all listings
        const allListings: ListingResponseDto[] = [
          ...venues,
          ...catering,
          ...photography,
          ...decoration,
          ...music,
          ...attire,
          ...makeup,
          ...transportation,
        ];

        // Enrich listings with vendor information
        const enrichedListings: ListingWithVendor[] = allListings.map((listing) => {
          const vendor = vendorMap.get(listing.vendorId);
          return {
            ...listing,
            vendorName: vendor?.name,
            vendorEmail: vendor?.email,
            serviceOffered: vendor?.serviceOffered,
          };
        });

        setListings(enrichedListings);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const openDeleteConfirmModal = (listing: ListingWithVendor) => {
    setDeleteConfirmListing(listing);
  };

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmListing(null);
  };

  const confirmDeleteListing = async (data: { reason?: string }) => {
    if (!deleteConfirmListing?.id) return;

    const { reason } = data;
    if (!reason || reason.trim() === '') {
      toast.error('A reason is required to delete the listing.');
      return;
    }

    setIsSubmitting(true);
    try {
      await ListingsService.listingControllerDelete(
        deleteConfirmListing.vendorId,
        deleteConfirmListing.id,
      );
      toast.success('Listing deleted successfully');

      try {
        await EmailNotificationService.emailNotificationControllerSendListingDeletionEmail({
          vendorId: deleteConfirmListing.vendorId,
          listingName: deleteConfirmListing.listingName,
          dateRemoved: new Date().toISOString().split('T')[0],
          reasonForRemoval: reason,
        });
        toast.success('Vendor notified via email');
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        toast.error('Listing was deleted, but the notification email failed to send.');
      }

      // Remove from local state
      setListings((prev) => prev.filter((l) => l.id !== deleteConfirmListing.id));
      closeDeleteConfirmModal();
    } catch (error: unknown) {
      console.error('Error deleting listing:', error);

      // Check if it's a bad request error due to existing orders
      const err = error as {
        status?: number;
        body?: { statusCode?: number; message?: string };
        message?: string;
      };
      if (err?.status === 400 || err?.body?.statusCode === 400) {
        const errorMessage = err?.body?.message || err?.message || '';
        if (errorMessage.includes('existing orders')) {
          toast.error(
            'Cannot delete this listing because there are existing orders associated with it.',
            { duration: 5000 },
          );
        } else {
          toast.error(errorMessage || 'Failed to delete listing');
        }
      } else {
        toast.error('Failed to delete listing');
      }

      closeDeleteConfirmModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleView = (listing: ListingWithVendor) => {
    router.push(`/listing-detail/${listing.id}`);
  };

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-hidden px-4 py-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title={'Listing Management'}
          description="View and manage all vendor listings across the platform"
        />
      </div>

      <div className="w-full">
        <ListingTable
          listings={listings}
          onDelete={openDeleteConfirmModal}
          onView={handleView}
          isLoading={isLoading}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deleteConfirmListing}
        onOpenChange={closeDeleteConfirmModal}
        itemName={deleteConfirmListing?.listingName || 'this listing'}
        description={
          deleteConfirmListing && (
            <>
              Are you sure you want to delete <strong>{deleteConfirmListing.listingName}</strong>?
              This action cannot be undone and will permanently remove the listing from the
              platform.
            </>
          )
        }
        onConfirm={confirmDeleteListing}
        onCancel={closeDeleteConfirmModal}
        isLoading={isSubmitting}
        requireReason={true}
      />
    </div>
  );
}
