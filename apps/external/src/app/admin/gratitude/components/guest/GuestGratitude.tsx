'use client';

import { useEffect, useRef } from 'react';

import { GuestCardInformation } from './GuestCardInformation';
import { GuestCard } from './guestCard';
import { useGratitudeCardManager } from '@/app/hooks/useGratitudeCardManager';
import { CreateGratitudeCardDto } from '@shared/api';
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
import { toast } from 'sonner';

interface GuestGratitudeProps {
  onComplete?: () => void;
  onDelete?: () => void;
}

export default function GuestGratitude({ onComplete, onDelete }: GuestGratitudeProps) {
  const inviteRef = useRef<HTMLDivElement>(null);

  const {
    selectedWeddingId,
    selectedWedding,
    guestCard,
    guestFormData,
    isGuestUpdateMode,
    isDeleteDialogOpen,
    isDeleting,
    isLoading,
    isSubmitting,
    handleSubmit,
    handleDeleteGuest,
    setGuestFormData,
    setIsSubmitting,
    setIsDeleteDialogOpen,
    handleFetchExistingCard,
  } = useGratitudeCardManager();

  useEffect(() => {
    if (selectedWeddingId) {
      handleFetchExistingCard(selectedWeddingId);
    }
  }, [selectedWeddingId, handleFetchExistingCard]);

  const handleInputChange = <K extends keyof CreateGratitudeCardDto>(
    field: K,
    value: CreateGratitudeCardDto[K],
  ) => {
    setGuestFormData(
      (prev): CreateGratitudeCardDto => ({
        ...prev,
        [field]: value,
      }),
    );
  };

  const validateForm = () => {
    if (!guestFormData.signOffName.trim()) return 'Sign off name is required.';
    if (!guestFormData.guestCardMessage.trim()) return 'Gratitude message is required.';
    if (!guestFormData.guestCardPhotoURL) return 'Photo for the card is required.';

    if (guestFormData.signOffName.length < 2) return 'Sign off name is too short.';
    if (guestFormData.guestCardMessage.length > 500)
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
      await handleSubmit(e, 'guest');
      toast.success(isGuestUpdateMode ? 'Gratitude card updated!' : 'Gratitude card created!');

      onComplete?.();
    } catch (err) {
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
        {(isGuestUpdateMode || guestFormData) && (
          <PageHeader
            title={isGuestUpdateMode ? 'Edit Gratitude Card' : 'Create Gratitude Card'}
            description={
              isGuestUpdateMode
                ? 'Update your existing gratitude card for this wedding'
                : 'Design and configure gratitude cards for your guests or collaborators'
            }
          />
        )}

        {/* Form and Live Preview */}
        <div className="flex flex-col sm:flex-row justify-center items-start gap-8 md:gap-12 lg:gap-16 mt-10">
          {/* Left: Form */}
          <form
            onSubmit={handleFormSubmit}
            className="w-full lg:w-2/3 max-w-2xl space-y-8 rounded-xl"
          >
            <GuestCardInformation
              guestFormData={guestFormData}
              handleInputChange={handleInputChange}
            />

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
              {isGuestUpdateMode && (
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
                          handleDeleteGuest(guestCard?.weddingId || 0);
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
                  ? isGuestUpdateMode
                    ? 'Updating...'
                    : 'Creating...'
                  : isGuestUpdateMode
                    ? 'Update Card'
                    : 'Create Card'}
              </Button>
            </div>
          </form>

          {/* Right: Live Preview */}
          <div className="w-full lg:w-1/3 flex flex-col items-center">
            <div id="print-section" ref={inviteRef}>
              <GuestCard
                signOff={guestFormData.signOffName || 'the Tangs'}
                message={
                  guestFormData.guestCardMessage ||
                  'thank you for coming to our wedding and sharing this wonderful day with us!'
                }
                photoUrl={
                  guestFormData.guestCardPhotoURL ||
                  'https://res.cloudinary.com/dnyxxyolp/image/upload/v1760014682/wedding-couple_cmxtra.webp'
                }
                selectedWeddingDate={selectedWedding?.date || 'December 25, 2025'}
              />
            </div>
            <p className="text-sm text-muted-foreground mb-3 italic text-center mt-4">
              Live Preview
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
