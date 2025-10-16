'use client';

import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { InviteInformation } from './components/InviteInformation';
import InviteCard from './template/albumInvite';
import { useAlbumManager } from '@/app/hooks/useAlbumManager';
import { useWeddingStore } from '@/app/store/sessionStore';
import { CreateAlbumDto } from '@shared/api';
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
import { Printer } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateAlbumInvitePage() {
  const selectedWeddingId = useWeddingStore((state) => state.selectedWeddingId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [existingAlbumId, setExistingAlbumId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const inviteRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CreateAlbumDto>({
    weddingId: selectedWeddingId || 0,
    coupleName: '',
    inviteCardMessage: '',
    landingMessage: '',
    albumURL: '',
  });

  const { handleSubmit, handleDelete, handleFetchExistingAlbum } = useAlbumManager({
    formData,
    selectedWeddingId: typeof selectedWeddingId === 'number' ? selectedWeddingId : null,
    isUpdateMode,
    existingAlbumId,
    setIsSubmitting,
    setIsDeleting,
    setIsLoading,
    setIsDeleteDialogOpen,
    setIsUpdateMode,
    setExistingAlbumId,
    setFormData,
  });

  // Keep weddingId in formData in sync with selection
  useEffect(() => {
    if (typeof selectedWeddingId !== 'number') return;

    setFormData((prev) => ({ ...prev, weddingId: selectedWeddingId }));
  }, [selectedWeddingId]);

  // Fetch existing album for selected wedding
  useEffect(() => {
    if (typeof selectedWeddingId !== 'number') return;

    const fetchExistingAlbum = async () => {
      setIsLoading(true);
      handleFetchExistingAlbum(selectedWeddingId);
    };

    fetchExistingAlbum();
  }, [handleFetchExistingAlbum, selectedWeddingId]);

  const handleInputChange = <K extends keyof CreateAlbumDto>(
    field: K,
    value: CreateAlbumDto[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // Required fields validation
    if (!formData.coupleName.trim()) {
      return 'Couple Name is required.';
    }
    if (!formData.inviteCardMessage.trim()) {
      return 'Invite message is required.';
    }
    if (!formData.landingMessage.trim()) {
      return 'Landing page message is required.';
    }

    // Length validation
    if (formData.inviteCardMessage.length < 10) {
      return 'Invite message is too short. Please provide more details.';
    }
    if (formData.inviteCardMessage.length > 500) {
      return 'Invite message is too long. Max 500 characters.';
    }

    if (formData.landingMessage.length > 1000) {
      return 'Landing page message is too long. Max 1000 characters.';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    handleSubmit(e);
  };

  const cleanedCoupleName = formData.coupleName
    .split(/(?:\s*and\s*|,|\s*&\s*)/)
    .map((name) => name.trim())
    .filter(Boolean)
    .join('-and-');

  const handlePrint = useReactToPrint({
    contentRef: inviteRef,
    documentTitle: `${cleanedCoupleName || 'Wedding'}_Invite`,
  });

  // Split coupleName into two names for InviteCard
  const [coupleName1, coupleName2] = formData.coupleName
    ? formData.coupleName.split(/(?:\sand\s|,)/).map((s) => s.trim())
    : ['', ''];

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground py-6">
        <div className="container mx-auto px-4 pt-4 md:pt-6">
          <PageHeader title="Loading..." description="Checking for existing album invite..." />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground py-6">
      <div className="relative container mx-auto px-4 pt-4 md:pt-6">
        {(isUpdateMode || formData.albumURL) && (
          <PageHeader
            title={isUpdateMode ? 'Edit Album Invite' : 'Create Album Invite'}
            description={
              isUpdateMode
                ? 'Update your existing album invite for this wedding'
                : 'Design and configure a wedding album invite for your guests'
            }
            buttonText="Export PDF"
            onButtonClick={handlePrint}
            isButtonDisabled={isSubmitting || isDeleting}
            buttonIcon={<Printer className="w-4 h-4" />}
          />
        )}

        {!isUpdateMode && !formData.albumURL && (
          <PageHeader
            title="Create Album Invite"
            description="Design and configure a wedding album invite for your guests"
          />
        )}

        {/* 🧩 Responsive side-by-side layout */}
        <div className="flex flex-col sm:flex-row justify-center items-start gap-8 md:gap-12 lg:gap-16 mt-10">
          {/* Left: Form */}
          <form
            onSubmit={handleFormSubmit}
            className="w-full lg:w-2/3 max-w-2xl space-y-8 rounded-xl"
          >
            <InviteInformation formData={formData} handleInputChange={handleInputChange} />

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
              {isUpdateMode && (
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={isSubmitting || isDeleting}
                      className="px-6 text-white"
                    >
                      Delete Album Invite
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Album Invite</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this album invite? This action is
                        irreversible.
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
                          handleDelete(selectedWeddingId || 0);
                        }}
                        className="text-white"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Album Invite'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              <Button type="submit" disabled={isSubmitting || isDeleting} className="px-8">
                {isSubmitting
                  ? isUpdateMode
                    ? 'Updating...'
                    : 'Creating...'
                  : isUpdateMode
                    ? 'Update Album Invite'
                    : 'Create Album Invite'}
              </Button>
            </div>
          </form>

          {/* Right: Live Preview */}
          <div className="w-full lg:w-1/3 flex flex-col items-center">
            <div id="print-section" ref={inviteRef}>
              <InviteCard
                coupleName1={coupleName1 || 'Ryan'}
                coupleName2={coupleName2 || 'Ranae'}
                inviteMessage={
                  formData.inviteCardMessage ||
                  "We'd love your help to remember our wedding day — scan to upload your photos!"
                }
                qrCodeUrl={
                  formData.albumURL ||
                  'https://res.cloudinary.com/dnyxxyolp/image/upload/v1759562157/QR_Code_Example.svg_zj8ap8.png'
                }
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
