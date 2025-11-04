'use client';

import { useEffect, useState } from 'react';

import { BroadcastVendorGratitudeDialog } from './BroadcastVendorGratitudeDialog';
import { VendorCardInformation } from './VendorCardInformation';
import { VendorCard } from './vendorCard';
import { useGratitudeCardManager } from '@/app/hooks/useGratitudeCardManager';
import { UpdateGratitudeCardDto } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/components/ui/dialog';
import { PageHeader } from '@shared/components/ui/page-header';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

interface VendorGratitudeProps {
  onComplete?: () => void;
  onDelete?: () => void;
}

export default function VendorGratitude({ onComplete, onDelete }: VendorGratitudeProps) {
  const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false);

  const {
    selectedWeddingId,
    selectedWedding,
    guestCard,
    vendorFormData,
    isVendorUpdateMode,
    isDeleteDialogOpen,
    isDeleting,
    isLoading,
    isSubmitting,
    handleSubmit,
    handleDeleteVendor,
    setVendorFormData,
    setIsSubmitting,
    setIsVendorUpdateMode,
    setIsDeleteDialogOpen,
    handleFetchExistingCard,
  } = useGratitudeCardManager();

  useEffect(() => {
    if (selectedWeddingId) {
      handleFetchExistingCard(selectedWeddingId);
    }
  }, [selectedWeddingId, handleFetchExistingCard]);

  useEffect(() => {
    if (guestCard) {
      setIsVendorUpdateMode(!!guestCard.vendorCardMessage);
    }
  }, [guestCard, setIsVendorUpdateMode]);

  const handleOpenBroadcastDialog = () => {
    if (!guestCard) {
      toast.error('You must create a gratitude card before broadcasting.');
      return;
    }
    setIsBroadcastDialogOpen(true);
  };

  const handleInputChange = <K extends keyof UpdateGratitudeCardDto>(
    field: K,
    value: UpdateGratitudeCardDto[K],
  ) => {
    setVendorFormData(
      (prev): UpdateGratitudeCardDto => ({
        ...prev,
        [field]: value,
      }),
    );
  };

  const validateForm = () => {
    if (!vendorFormData.signOffName.trim()) return 'Sign off name is required.';
    if (!vendorFormData.vendorCardMessage?.trim()) return 'Gratitude message is required.';

    if (vendorFormData.signOffName.length < 2) return 'Sign off name is too short.';
    if (vendorFormData.vendorCardMessage.length > 500)
      return 'Message is too long. Max 500 characters.';
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      await handleSubmit(e, 'vendor');
      toast.success(isVendorUpdateMode ? 'Gratitude card updated!' : 'Gratitude card created!');
    } catch {
      toast.error('Something went wrong while saving your card.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Loading your gratitude card...</p>
      </div>
    );
  }

  return (
    <div className="w-full text-foreground py-6">
      <div className="relative container mx-auto px-4 pt-4 md:pt-6">
        {(isVendorUpdateMode || vendorFormData) && (
          <PageHeader
            title={isVendorUpdateMode ? 'Edit Gratitude Card' : 'Create Gratitude Card'}
            description={
              isVendorUpdateMode
                ? 'Update your existing gratitude card for this wedding'
                : 'Design and configure gratitude cards for your vendors'
            }
            buttonText="Broadcast"
            onButtonClick={handleOpenBroadcastDialog}
            buttonIcon={<Mail className="w-4 h-4" />}
            isButtonDisabled={isLoading || !isVendorUpdateMode}
          />
        )}

        {/* Form and Live Preview */}
        <div className="flex flex-col sm:flex-row justify-center items-start gap-8 md:gap-12 lg:gap-16 mt-10">
          {/* Left: Form */}
          <form
            onSubmit={handleFormSubmit}
            className="w-full lg:w-2/3 max-w-2xl space-y-8 rounded-xl"
          >
            <VendorCardInformation
              vendorFormData={vendorFormData}
              handleInputChange={handleInputChange}
            />

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
              {isVendorUpdateMode && (
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={isSubmitting || isDeleting}
                      className="px-6 text-white"
                    >
                      Delete Card
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Gratitude Card</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this gratitude card? This action cannot be
                        undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                        disabled={isDeleting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={() => {
                          handleDeleteVendor(selectedWeddingId || 0);
                          onDelete?.();
                        }}
                        className="text-white"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Card'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              <Button type="submit" disabled={isSubmitting || isDeleting} className="px-8">
                {isSubmitting
                  ? isVendorUpdateMode
                    ? 'Updating...'
                    : 'Creating...'
                  : isVendorUpdateMode
                    ? 'Update Card'
                    : 'Create Card'}
              </Button>
            </div>
          </form>

          {/* Right: Live Preview */}
          <div className="w-full lg:w-1/3 flex flex-col items-center">
            <VendorCard
              signOff={vendorFormData.signOffName || 'T & R'}
              message={
                vendorFormData.vendorCardMessage ||
                'Thank you for helping to make our special day even more memorable with your culinary expertise.'
              }
              selectedWeddingDate={selectedWedding?.date || 'December 25, 2025'}
            />
            <p className="text-sm text-muted-foreground mb-3 mt-3 italic text-center">
              Live Preview
            </p>
          </div>
        </div>

        {/* Broadcast Dialog */}
        {selectedWeddingId && (
          <BroadcastVendorGratitudeDialog
            open={isBroadcastDialogOpen}
            weddingId={selectedWeddingId}
            onOpenChange={setIsBroadcastDialogOpen}
            onComplete={onComplete}
          />
        )}
      </div>
    </div>
  );
}
