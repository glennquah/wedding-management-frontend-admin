'use client';

import { useCallback, useState } from 'react';

import { useWeddingStore } from '../store/sessionStore';
import {
  CreateGratitudeCardDto,
  GratitudeCardResponseDto,
  GratitudeCardService,
  UpdateGratitudeCardDto,
} from '@shared/api';
import { toast } from 'sonner';

interface UseGratitudeCardManagerReturn {
  // State
  guestCard: GratitudeCardResponseDto | null;
  guestFormData: CreateGratitudeCardDto;
  collaboratorFormData: UpdateGratitudeCardDto;
  vendorFormData: UpdateGratitudeCardDto;
  selectedWeddingId: number | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  isGuestUpdateMode: boolean;
  isCollaboratorUpdateMode: boolean;

  // Functions
  handleSubmit: (e: React.FormEvent, recipient: string) => Promise<void>;
  handleDeleteGuest: (selectedWeddingId: number) => Promise<void>;
  handleDeleteCollaborator: (selectedWeddingId: number) => Promise<void>;
  handleFetchExistingCard: (selectedWeddingId: number) => Promise<void>;

  // State setters
  setIsSubmitting: (v: boolean) => void;
  setIsDeleting: (v: boolean) => void;
  setIsLoading: (v: boolean) => void;
  setIsDeleteDialogOpen: (v: boolean) => void;
  setIsGuestUpdateMode: (v: boolean) => void;
  setIsCollaboratorUpdateMode: (v: boolean) => void;
  setGuestFormData: React.Dispatch<React.SetStateAction<CreateGratitudeCardDto>>;
  setCollaboratorFormData: React.Dispatch<React.SetStateAction<UpdateGratitudeCardDto>>;
  setVendorFormData: React.Dispatch<React.SetStateAction<UpdateGratitudeCardDto>>;
}

export const useGratitudeCardManager = (): UseGratitudeCardManagerReturn => {
  const selectedWeddingId = useWeddingStore((state) => state.selectedWeddingId);

  const [guestCard, setGuestCard] = useState<GratitudeCardResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuestUpdateMode, setIsGuestUpdateMode] = useState(false);
  const [isCollaboratorUpdateMode, setIsCollaboratorUpdateMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [guestFormData, setGuestFormData] = useState<CreateGratitudeCardDto>({
    weddingId: selectedWeddingId || 0,
    signOffName: '',
    guestCardMessage: '',
    guestCardPhotoURL: '',
  });
  const [collaboratorFormData, setCollaboratorFormData] = useState<UpdateGratitudeCardDto>({
    weddingId: selectedWeddingId || 0,
    signOffName: '',
    collaboratorCardMessage: '',
    collaboratorCardPhotoURL: '',
    recipient: 'collaborator',
  });
  const [vendorFormData, setVendorFormData] = useState<UpdateGratitudeCardDto>({
    weddingId: selectedWeddingId || 0,
    signOffName: '',
    vendorCardMessage: '',
    recipient: 'vendor',
  });

  const handleSubmit = async (e: React.FormEvent, recipient: string): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!selectedWeddingId) {
        toast.error('No wedding selected. Please select a wedding first.');
        return;
      }

      // Update case
      if (isGuestUpdateMode && guestCard) {
        let updateData: UpdateGratitudeCardDto;

        switch (recipient) {
          case 'guest':
            updateData = {
              weddingId: selectedWeddingId,
              signOffName: guestFormData.signOffName || '',
              guestCardMessage: guestFormData.guestCardMessage || '',
              guestCardPhotoURL: guestFormData.guestCardPhotoURL || '',
              recipient: 'guest',
            };
            break;

          case 'collaborator':
            updateData = {
              weddingId: selectedWeddingId,
              signOffName: collaboratorFormData.signOffName || '',
              collaboratorCardMessage: collaboratorFormData.collaboratorCardMessage || '',
              collaboratorCardPhotoURL: collaboratorFormData.collaboratorCardPhotoURL || '',
              recipient: 'collab',
            };
            break;

          case 'vendor':
            updateData = {
              weddingId: selectedWeddingId,
              signOffName: vendorFormData.signOffName || '',
              vendorCardMessage: vendorFormData.vendorCardMessage || '',
              recipient: 'vendor',
            };
            break;

          default:
            console.error('Unknown recipient type:', recipient);
            return;
        }

        const updatedCard = await GratitudeCardService.gratitudeCardControllerUpdateGratitudeCard(
          guestCard.id,
          updateData,
        );

        setGuestCard(updatedCard);
        return;
      }

      const createData: CreateGratitudeCardDto = {
        weddingId: selectedWeddingId,
        signOffName: guestFormData.signOffName || '',
        guestCardMessage: guestFormData.guestCardMessage || '',
        guestCardPhotoURL: guestFormData.guestCardPhotoURL || '',
      };

      const createdCard =
        await GratitudeCardService.gratitudeCardControllerCreateGuestGratitudeCard(createData);

      setGuestFormData({
        weddingId: selectedWeddingId,
        signOffName: guestFormData.signOffName || '',
        guestCardMessage: guestFormData.guestCardMessage || '',
        guestCardPhotoURL: guestFormData.guestCardPhotoURL || '',
      });
      setGuestCard(createdCard);
      setIsGuestUpdateMode(true);
    } catch (err: unknown) {
      const status = (() => {
        if (typeof err === 'object' && err !== null) {
          const maybe = (err as Record<string, unknown>).status;
          return typeof maybe === 'number' ? maybe : undefined;
        }
        return undefined;
      })();

      if (status === 409) {
        toast.error('Wedding already has a gratitude card.');
      } else if (status === 404) {
        toast.error('Wedding not found.');
      } else if (status === 400) {
        toast.error('Invalid data provided.');
      } else {
        toast.error(`Failed to ${isGuestUpdateMode ? 'update' : 'create'} gratitude card.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGuest = async (selectedWeddingId: number): Promise<void> => {
    if (!guestCard) {
      toast.error('No gratitude card to delete.');
      return;
    }

    setIsDeleting(true);
    try {
      await GratitudeCardService.gratitudeCardControllerDeleteGratitudeCard(guestCard.id);
      toast.success('Guest card deleted successfully!');
      setIsDeleteDialogOpen(false);

      setGuestFormData({
        weddingId: selectedWeddingId,
        signOffName: '',
        guestCardMessage: '',
        guestCardPhotoURL: '',
      });
      setIsGuestUpdateMode(false);
      setGuestCard(null);
    } catch {
      toast.error('Failed to delete guest card.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCollaborator = async (selectedWeddingId: number): Promise<void> => {
    if (!guestCard) {
      toast.error('No gratitude card to delete.');
      return;
    }

    setIsDeleting(true);
    try {
      const updateData = {
        weddingId: selectedWeddingId,
        signOffName: collaboratorFormData.signOffName,
        collaboratorCardMessage: '',
        collaboratorCardPhotoURL: '',
        recipient: 'collab',
      };
      const updatedCard = await GratitudeCardService.gratitudeCardControllerUpdateGratitudeCard(
        guestCard.id,
        updateData,
      );

      setGuestCard(updatedCard);

      toast.success('Collaborator card deleted successfully!');
      setIsDeleteDialogOpen(false);

      setCollaboratorFormData({
        weddingId: selectedWeddingId || 0,
        signOffName: '',
        collaboratorCardMessage: '',
        collaboratorCardPhotoURL: '',
        recipient: 'collaborator',
      });
      setIsCollaboratorUpdateMode(false);
      setGuestCard(null);
    } catch {
      toast.error('Failed to delete gratitude card.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFetchExistingCard = useCallback(async (weddingId: number) => {
    if (!weddingId) return;
    setIsLoading(true);
    try {
      const card =
        await GratitudeCardService.gratitudeCardControllerGetGratitudeCardByWeddingId(weddingId);

      if (card) {
        setGuestCard(card);
        setGuestFormData({
          weddingId,
          signOffName: card.signOffName || '',
          guestCardMessage: card.guestCardMessage || '',
          guestCardPhotoURL: card.guestCardPhotoURL || '',
        });
        setCollaboratorFormData({
          weddingId,
          signOffName: card.signOffName || '',
          collaboratorCardMessage: card.collaboratorCardMessage || '',
          collaboratorCardPhotoURL: card.collaboratorCardPhotoURL || '',
          recipient: 'collaborator',
        });
        setVendorFormData({
          weddingId,
          signOffName: card.signOffName || '',
          vendorCardMessage: card.guestCardMessage || '',
          recipient: 'vendor',
        });
        setIsGuestUpdateMode(true);
      } else {
        setGuestCard(null);
        setIsGuestUpdateMode(false);
      }
    } catch (err) {
      console.error(err);
      setGuestCard(null);
      setIsGuestUpdateMode(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    guestCard,
    guestFormData,
    collaboratorFormData,
    vendorFormData,
    selectedWeddingId,
    isLoading,
    isSubmitting,
    isDeleteDialogOpen,
    isDeleting,
    isGuestUpdateMode,
    isCollaboratorUpdateMode,

    // Functions
    handleSubmit,
    handleDeleteGuest,
    handleDeleteCollaborator,
    handleFetchExistingCard,

    // State setters
    setIsSubmitting,
    setIsDeleting,
    setIsLoading,
    setIsDeleteDialogOpen,
    setIsGuestUpdateMode,
    setIsCollaboratorUpdateMode,
    setGuestFormData,
    setCollaboratorFormData,
    setVendorFormData,
  };
};
