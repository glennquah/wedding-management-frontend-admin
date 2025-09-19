'use client';

import { useEffect, useState } from 'react';

import { Button, PageHeader } from '@shared/components';
import { WeddingTable } from '@shared/components/WeddingTable';
import { FormDialog } from '@shared/components/ui/form/form-dialog';
import {
  BudgetBucket,
  CreateWeddingDto,
  GuestCountBucket,
  UpdateWeddingDto,
  WeddingResponseDto,
  WeddingService,
  WeddingStyle,
  WeddingType,
  WeddingsService,
} from '@wedding/api-types';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  getEditWeddingFormFields,
  getWeddingFormFields,
} from '../components/formFields/WeddingManagement';

export const dynamic = 'force-dynamic';

export default function WeddingManagementPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Core data
  const [weddings, setWeddings] = useState<WeddingResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isAddingWedding, setIsAddingWedding] = useState(false);
  const [isEditingWedding, setIsEditingWedding] = useState(false);
  const [deleteConfirmWedding, setDeleteConfirmWedding] = useState<WeddingResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [newWedding, setNewWedding] = useState<Partial<CreateWeddingDto>>({});
  const [editWedding, setEditWedding] = useState<Partial<UpdateWeddingDto & { id?: number }>>({});

  // Fetch weddings data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const weddingsData = await WeddingsService.weddingControllerFindAll();
        setWeddings(weddingsData);
      } catch (error) {
        console.error('Failed to fetch weddings:', error);
        toast.error('Failed to load weddings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session?.user, router]);

  // Modal controls
  const openAddWeddingModal = () => {
    setNewWedding({
      name: '',
      location: '',
      date: '',
      weddingType: WeddingType.WESTERN,
      budgetBucket: BudgetBucket.MEDIUM,
      guestCountBucket: GuestCountBucket.MEDIUM,
      preferredStyle: WeddingStyle.MODERN,
      preferredServices: [],
    });
    setIsAddingWedding(true);
  };

  const closeAddWeddingModal = () => {
    setIsAddingWedding(false);
    setNewWedding({});
  };

  const openEditWeddingModal = (wedding: WeddingResponseDto) => {
    setEditWedding({
      id: wedding.id,
      name: wedding.name,
      location: wedding.location,
      date: wedding.date,
      weddingType: wedding.weddingType as unknown as WeddingType,
      budgetBucket: wedding.budgetBucket as unknown as BudgetBucket,
      guestCountBucket: wedding.guestCountBucket as unknown as GuestCountBucket,
      preferredStyle: wedding.preferredStyle as unknown as WeddingStyle,
      preferredServices: wedding.preferredServices as unknown as Array<WeddingService>,
    });
    setIsEditingWedding(true);
  };

  const closeEditWeddingModal = () => {
    setIsEditingWedding(false);
    setEditWedding({});
  };

  const openDeleteConfirmModal = (wedding: WeddingResponseDto) => {
    setDeleteConfirmWedding(wedding);
  };

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmWedding(null);
  };

  const validateWeddingForm = (wedding: Partial<CreateWeddingDto>): string | null => {
    if (!wedding.name?.trim()) {
      return 'Wedding name is required';
    }
    if (!wedding.weddingType) {
      return 'Wedding type is required';
    }
    if (!wedding.budgetBucket) {
      return 'Budget range is required';
    }
    if (!wedding.guestCountBucket) {
      return 'Guest count is required';
    }
    if (!wedding.preferredStyle) {
      return 'Preferred style is required';
    }
    if (!wedding.preferredServices || wedding.preferredServices.length === 0) {
      return 'At least one preferred service is required';
    }

    if (wedding.date) {
      const selectedDate = new Date(wedding.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return 'Wedding date cannot be in the past';
      }
    }

    return null;
  };

  const isFormValid = validateWeddingForm(newWedding) === null;

  // Handlers
  const handleAddWedding = async () => {
    setIsSubmitting(true);
    try {
      // Validate required fields
      const validationError = validateWeddingForm(newWedding);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const weddingData: CreateWeddingDto = {
        name: newWedding.name!,
        date: newWedding.date,
        location: newWedding.location,
        weddingType: newWedding.weddingType!,
        budgetBucket: newWedding.budgetBucket!,
        guestCountBucket: newWedding.guestCountBucket!,
        preferredStyle: newWedding.preferredStyle!,
        preferredServices: newWedding.preferredServices!,
      };

      await WeddingsService.weddingControllerCreate(weddingData);
      toast.success('Wedding added successfully!');
      closeAddWeddingModal();
      // Refresh weddings list
      const weddingsData = await WeddingsService.weddingControllerFindAll();
      setWeddings(weddingsData);
    } catch (error) {
      console.error('Failed to add wedding:', error);
      toast.error('Failed to add wedding');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditWedding = async () => {
    if (!editWedding.id) return;

    setIsSubmitting(true);
    try {
      const updateData: UpdateWeddingDto = {
        name: editWedding.name,
        date: editWedding.date,
        location: editWedding.location,
        weddingType: editWedding.weddingType,
        budgetBucket: editWedding.budgetBucket,
        guestCountBucket: editWedding.guestCountBucket,
        preferredStyle: editWedding.preferredStyle,
        preferredServices: editWedding.preferredServices,
      };

      await WeddingsService.weddingControllerUpdate(editWedding.id, updateData);
      toast.success('Wedding updated successfully!');
      closeEditWeddingModal();
      // Refresh weddings list
      const weddingsData = await WeddingsService.weddingControllerFindAll();
      setWeddings(weddingsData);
    } catch (error) {
      console.error('Failed to update wedding:', error);
      toast.error('Failed to update wedding');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteWedding = async () => {
    if (!deleteConfirmWedding?.id) return;

    setIsSubmitting(true);
    try {
      await WeddingsService.weddingControllerRemove(deleteConfirmWedding.id);
      toast.success('Wedding deleted successfully!');
      closeDeleteConfirmModal();
      // Refresh weddings list
      const weddingsData = await WeddingsService.weddingControllerFindAll();
      setWeddings(weddingsData);
    } catch (error) {
      console.error('Failed to delete wedding:', error);
      toast.error('Failed to delete wedding');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Wedding Management"
          description="Manage wedding events and their details"
        />
        <Button onClick={openAddWeddingModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Wedding
        </Button>
      </div>

      {/* Add Wedding Modal */}
      <FormDialog
        open={isAddingWedding}
        onOpenChange={closeAddWeddingModal}
        title="Add Wedding"
        isSubmitting={isSubmitting}
        onSubmit={handleAddWedding}
        onCancel={closeAddWeddingModal}
        submitButtonText="Add Wedding"
        formFields={getWeddingFormFields({
          wedding: newWedding,
          setWedding: setNewWedding,
        })}
        noOfColumns={2}
        disabled={!isFormValid}
      />

      {/* Wedding Table with Edit/Delete Modals */}
      <div className="w-full">
        <WeddingTable
          weddings={weddings}
          isLoading={isLoading}
          isEditingWedding={isEditingWedding}
          editWedding={editWedding}
          setEditWedding={setEditWedding}
          isSubmitting={isSubmitting}
          deleteConfirmWedding={deleteConfirmWedding}
          onEditWedding={openEditWeddingModal}
          onDeleteWedding={openDeleteConfirmModal}
          handleEditWedding={handleEditWedding}
          closeEditWeddingModal={closeEditWeddingModal}
          confirmDeleteWedding={confirmDeleteWedding}
          closeDeleteConfirmModal={closeDeleteConfirmModal}
          editFormFields={getEditWeddingFormFields({
            wedding: editWedding,
            setWedding: setEditWedding,
          })}
        />
      </div>
    </div>
  );
}
