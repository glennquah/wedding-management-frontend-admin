'use client';

import { useCallback } from 'react';

import { AlbumService, CreateAlbumDto, MicrositeService, UpdateAlbumDto } from '@shared/api';
import QRCode from 'qrcode';
import { toast } from 'sonner';

type ManagerOptions = {
  formData: CreateAlbumDto;
  selectedWeddingId?: number | null;
  isUpdateMode: boolean;
  existingAlbumId: number | null;
  setIsSubmitting: (v: boolean) => void;
  setIsDeleting: (v: boolean) => void;
  setIsLoading: (v: boolean) => void;
  setIsDeleteDialogOpen: (v: boolean) => void;
  setIsUpdateMode: (v: boolean) => void;
  setExistingAlbumId: (v: number | null) => void;
  setFormData: (v: CreateAlbumDto) => void;
};

export function useAlbumManager(opts: ManagerOptions) {
  const {
    formData,
    selectedWeddingId,
    isUpdateMode,
    existingAlbumId,
    setIsSubmitting,
    setIsDeleting,
    setIsLoading,
    setIsDeleteDialogOpen,
    setIsUpdateMode,
    setExistingAlbumId,
    setFormData,
  } = opts;

  const generateAndUploadQrCode = async (
    albumPublicUrl: string,
    coupleName: string,
  ): Promise<string | null> => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(albumPublicUrl, {
        width: 100,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      });

      const res = await fetch(qrCodeDataUrl);
      const blob = await res.blob();

      const fileName = `${coupleName?.replace(/\W+/g, '_') || 'album'}_${Date.now()}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!);
      formData.append('folder', 'qrcodes');
      formData.append('public_id', fileName.replace('.png', ''));

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const data = await response.json();

      if (!data.secure_url) throw new Error('Failed to upload QR code to Cloudinary');
      return data.secure_url as string;
    } catch (err: unknown) {
      toast.error('Failed to upload QR code.', { description: String(err) });
      return null;
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        if (!selectedWeddingId) {
          toast.error('No wedding selected. Please select a wedding first.');
          return;
        }

        // Update case
        if (isUpdateMode && existingAlbumId) {
          const updateData: UpdateAlbumDto = {
            weddingId: selectedWeddingId,
            coupleName: formData.coupleName,
            inviteCardMessage: formData.inviteCardMessage,
            landingMessage: formData.landingMessage,
            albumURL: formData.albumURL,
          };

          await AlbumService.albumControllerUpdateAlbum(existingAlbumId, updateData);
          toast.success('Album updated successfully!');
          return;
        }

        // Create case
        const microsite =
          await MicrositeService.micrositeControllerGetMicrositeByWeddingId(selectedWeddingId);

        if (!microsite) {
          toast.error('Microsite for the wedding has not been created yet.');
          return;
        }

        const albumPublicUrl = `${process.env.NEXT_PUBLIC_EXTERNAL_URL}/microsite/${microsite.slug}`;
        const qrUrl = await generateAndUploadQrCode(albumPublicUrl, formData.coupleName);

        if (!qrUrl) {
          toast.error('Failed to generate QR code. Please try again.');
          return;
        }

        const createData: CreateAlbumDto = {
          weddingId: selectedWeddingId,
          coupleName: formData.coupleName,
          inviteCardMessage: formData.inviteCardMessage,
          landingMessage: formData.landingMessage,
          albumURL: qrUrl,
        };

        const createdAlbum = await AlbumService.albumControllerCreateAlbum(createData);
        toast.success('Album created successfully!');

        setFormData({
          weddingId: selectedWeddingId,
          coupleName: createdAlbum.coupleName || '',
          inviteCardMessage: createdAlbum.inviteCardMessage,
          landingMessage: createdAlbum.landingMessage,
          albumURL: createdAlbum.albumURL || '',
        });
        setExistingAlbumId(createdAlbum.id);
        setIsUpdateMode(true);
      } catch (err: unknown) {
        const status = (() => {
          if (typeof err === 'object' && err !== null) {
            const maybe = (err as Record<string, unknown>).status;
            return typeof maybe === 'number' ? maybe : undefined;
          }
          return undefined;
        })();

        if (status === 409) {
          toast.error('Album slug already exists or wedding already has an album.');
        } else if (status === 404) {
          toast.error('Microsite for the wedding has not been created yet.');
        } else if (status === 400) {
          toast.error('Invalid data provided.');
        } else {
          toast.error(`Failed to ${isUpdateMode ? 'update' : 'create'} album.`);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      selectedWeddingId,
      isUpdateMode,
      existingAlbumId,
      formData,
      setIsSubmitting,
      setFormData,
      setExistingAlbumId,
      setIsUpdateMode,
    ],
  );

  const handleDelete = useCallback(
    async (selectedWeddingId: number) => {
      if (!existingAlbumId) {
        toast.error('No album to delete.');
        return;
      }

      setIsDeleting(true);
      try {
        await AlbumService.albumControllerDeleteAlbum(existingAlbumId);
        toast.success('Album deleted successfully!');
        setIsDeleteDialogOpen(false);

        setFormData({
          weddingId: selectedWeddingId,
          coupleName: '',
          inviteCardMessage: '',
          landingMessage: '',
          albumURL: '',
        });
        setIsUpdateMode(false);
        setExistingAlbumId(null);
      } catch {
        toast.error('Failed to delete album.');
      } finally {
        setIsDeleting(false);
      }
    },
    [
      existingAlbumId,
      setIsDeleting,
      setIsDeleteDialogOpen,
      setFormData,
      setIsUpdateMode,
      setExistingAlbumId,
    ],
  );

  const handleFetchExistingAlbum = useCallback(
    async (weddingId: number) => {
      try {
        const album = await AlbumService.albumControllerGetAlbumByWeddingId(weddingId);
        if (album) {
          setFormData({
            weddingId: weddingId,
            coupleName: album.coupleName || '',
            inviteCardMessage: album.inviteCardMessage,
            landingMessage: album.landingMessage,
            albumURL: album.albumURL || '',
          });
          setExistingAlbumId(album.id);
          setIsUpdateMode(true);
        } else {
          setExistingAlbumId(null);
          setIsUpdateMode(false);
        }
      } catch {
        setExistingAlbumId(null);
        setIsUpdateMode(false);
      } finally {
        setIsLoading(false);
      }
    },
    [setFormData, setExistingAlbumId, setIsUpdateMode, setIsLoading],
  );

  return { handleSubmit, handleDelete, handleFetchExistingAlbum };
}
