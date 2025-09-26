'use client';

import { useMemo } from 'react';

import { useMicrositePreviewStore } from '../store/micrositePreviewStore';
import {
  CreateMicrositeDto,
  MicrositeService,
  UpdateMicrositeDto,
  WeddingResponseDto,
} from '@shared/api';
import { useSidebar } from '@shared/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ManagerOptions = {
  formData: CreateMicrositeDto;
  selectedWeddingId?: number | null;
  weddings: WeddingResponseDto[];
  isUpdateMode: boolean;
  existingMicrositeId: number | null;
  resetFormData: (weddingId: number) => void;
  // UI state setters
  setIsSubmitting: (v: boolean) => void;
  setIsDeleting: (v: boolean) => void;
  setIsDeleteDialogOpen: (v: boolean) => void;
  setIsUpdateMode: (v: boolean) => void;
  setExistingMicrositeId: (v: number | null) => void;
};

export function useMicrositeAdminManager(opts: ManagerOptions) {
  const {
    formData,
    selectedWeddingId,
    weddings,
    isUpdateMode,
    existingMicrositeId,
    resetFormData,
    setIsSubmitting,
    setIsDeleting,
    setIsDeleteDialogOpen,
    setIsUpdateMode,
    setExistingMicrositeId,
  } = opts;

  const router = useRouter();
  const { setOpen, setOpenMobile } = useSidebar();
  const { setData: setPreviewData } = useMicrositePreviewStore();

  const previewPayload = useMemo(() => {
    if (typeof selectedWeddingId !== 'number') return null;
    const w = weddings.find((x) => x.id === selectedWeddingId);
    if (!w) return null;
    const nowIso = new Date().toISOString();
    return {
      id: 0,
      templateNumber: formData.templateNumber,
      slug: formData.slug || 'preview',
      coupleName: formData.coupleName,
      heroImages: formData.heroImages ?? [],
      imageGallery: formData.imageGallery ?? [],
      schedule: formData.schedule ?? [],
      faqs: formData.faqs ?? [],
      weddingId: selectedWeddingId,
      weddingName: w.name,
      weddingLocation: w.location,
      weddingDate: w.date,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  }, [formData, selectedWeddingId, weddings]);

  const handlePreview = () => {
    if (!previewPayload) {
      toast.error('Missing wedding details. Please ensure a wedding is selected.');
      return;
    }
    try {
      setOpen(false);
      setOpenMobile(false);
    } catch {}
    setPreviewData(previewPayload);
    router.push('/admin/microsite/preview');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!selectedWeddingId) {
        toast.error('No wedding selected. Please select a wedding first.');
        return;
      }

      const submissionData = {
        ...formData,
        weddingId: selectedWeddingId,
      } as CreateMicrositeDto & { weddingId: number };

      if (isUpdateMode && existingMicrositeId) {
        const updateData: UpdateMicrositeDto = {
          templateNumber: submissionData.templateNumber,
          slug: submissionData.slug,
          coupleName: submissionData.coupleName,
          heroImages: submissionData.heroImages,
          imageGallery: submissionData.imageGallery,
          schedule: submissionData.schedule,
          faqs: submissionData.faqs,
          password: submissionData.password || undefined,
        };
        await MicrositeService.micrositeControllerUpdateMicrosite(existingMicrositeId, updateData);
        toast.success('Microsite updated successfully!');
      } else {
        await MicrositeService.micrositeControllerCreateMicrosite(submissionData);
        toast.success('Microsite created successfully!');
      }

      if (!isUpdateMode && typeof selectedWeddingId === 'number') {
        resetFormData(selectedWeddingId);
      }
    } catch (err: unknown) {
      const status = (() => {
        if (typeof err === 'object' && err !== null) {
          const maybe = (err as Record<string, unknown>).status;
          return typeof maybe === 'number' ? maybe : undefined;
        }
        return undefined;
      })();

      if (status === 409) {
        toast.error(
          'Microsite slug already exists or wedding already has a microsite. Please choose a different slug.',
        );
      } else if (status === 404) {
        toast.error(
          isUpdateMode
            ? 'Microsite not found or not owned by admin. Please try again.'
            : 'Admin or wedding not found. Please try again.',
        );
      } else if (status === 400) {
        toast.error('Invalid data provided. Please check your inputs and try again.');
      } else {
        toast.error(`Failed to ${isUpdateMode ? 'update' : 'create'} microsite. Please try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingMicrositeId) {
      toast.error('No microsite to delete.');
      return;
    }

    setIsDeleting(true);
    try {
      await MicrositeService.micrositeControllerDeleteMicrosite(existingMicrositeId);
      toast.success('Microsite deleted successfully!');
      setIsDeleteDialogOpen(false);

      setIsUpdateMode(false);
      setExistingMicrositeId(null);
      if (typeof selectedWeddingId === 'number') {
        resetFormData(selectedWeddingId);
      }
    } catch (err: unknown) {
      const status = (() => {
        if (typeof err === 'object' && err !== null) {
          const maybe = (err as Record<string, unknown>).status;
          return typeof maybe === 'number' ? maybe : undefined;
        }
        return undefined;
      })();

      if (status === 404) {
        toast.error('Microsite not found or not owned by admin.');
      } else {
        toast.error('Failed to delete microsite. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return { previewPayload, handlePreview, handleSubmit, handleDelete };
}
