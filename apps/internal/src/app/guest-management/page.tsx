'use client';

import { useEffect, useState } from 'react';

import { getGuestColumns } from '@shared/columns/guest-columns';
import {
  Button,
  DataTable,
  DeleteConfirmationModal,
  GroupSelectDropdown,
  PageHeader
} from '@shared/components';
import FormField from '@shared/components/FormField';
import { FormDialog } from '@shared/components/ui/form/form-dialog';
import { Input } from '@shared/components/ui/form/input';
import { SingleSelectDropdown } from '@shared/components/ui/form/singleSelectDropdown';
import {
  ConfirmationStatus,
  CreateGuestDto,
  GuestResponseDto,
  GuestsService,
  UpdateGuestDto
} from '@wedding/api-types';
import { Plus, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { EmailModal } from '../../../../../shared/components/EmailModal';
import GuestSummaryStats from '../../../../../shared/components/guest-management/GuestSummaryStats';

export const dynamic = 'force-dynamic';

export default function GuestManagementPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Core data
  const [guests, setGuests] = useState<GuestResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestResponseDto | null>(null);
  const [deleteConfirmGuest, setDeleteConfirmGuest] = useState<GuestResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailModalGuest, setEmailModalGuest] = useState<GuestResponseDto | null>(null);

  // Form data
  const [newGuest, setNewGuest] = useState<Partial<CreateGuestDto & { id?: number }>>({});

  // Mock existing groups (you can replace this with actual API call)
  const [existingGroups] = useState<string[]>(['Family', 'Friends', 'Colleagues', 'Relatives']);

  // Fetch guests data
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        setIsLoading(true);
        const guestsData = await GuestsService.guestControllerGetAllGuests();
        setGuests(guestsData);
      } catch (error) {
        console.error('Failed to fetch guests:', error);
        toast.error('Failed to load guests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuests();
  }, [session?.user, router]);

  // Get primary guests (guests who are not accompanying someone else)
  const primaryGuests = guests.filter((guest) => !guest.primaryGuestId);

  // Modal controls
  const openAddGuestModal = () => {
    setNewGuest({});
    setIsAddingGuest(true);
  };

  const closeAddGuestModal = () => {
    setIsAddingGuest(false);
    setNewGuest({});
  };

  const closeEditGuestModal = () => {
    setEditingGuest(null);
  };

  const openDeleteConfirmModal = (guest: GuestResponseDto) => {
    setDeleteConfirmGuest(guest);
  };

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmGuest(null);
  };

  const closeEmailModal = () => {
    setEmailModalGuest(null);
  };

  // Handlers
  const handleAddGuest = async () => {
    setIsSubmitting(true);
    try {
      if (!newGuest.name || !newGuest.email || !newGuest.group) {
        toast.error('Please fill in all required fields');
        return;
      }

      const guestData: CreateGuestDto = {
        name: newGuest.name,
        email: newGuest.email,
        group: newGuest.group,
        weddingId: 1, // Default wedding ID for internal admin
        allergies: newGuest.allergies || '',
        confirmationStatus:
          newGuest.confirmationStatus || ConfirmationStatus.PENDING,
        accompanyingGuestNames:
          newGuest.accompanyingGuestNames?.filter((name) => name.trim() !== '') || [],
      };

      await GuestsService.guestControllerCreate(guestData);
      toast.success('Guest added successfully!');
      closeAddGuestModal();
      // Refresh guests list
      const guestsData = await GuestsService.guestControllerGetAllGuests();
      setGuests(guestsData);
    } catch (error) {
      console.error('Failed to add guest:', error);
      toast.error('Failed to add guest');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateGuest = async () => {
    if (!editingGuest?.id) return;

    setIsSubmitting(true);
    try {
      if (!editingGuest.name || !editingGuest.email || !editingGuest.group) {
        toast.error('Please fill in all required fields');
        return;
      }

      const updateData: UpdateGuestDto = {
        name: editingGuest.name,
        email: editingGuest.email,
        group: editingGuest.group,
        allergies: editingGuest.allergies || '',
        confirmationStatus:
          editingGuest.confirmationStatus === 'pending'
            ? ConfirmationStatus.PENDING
            : editingGuest.confirmationStatus === 'confirmed'
              ? ConfirmationStatus.CONFIRMED
              : ConfirmationStatus.REJECTED,
      };

      await GuestsService.guestControllerUpdate(editingGuest.id, updateData);
      toast.success('Guest updated successfully!');
      closeEditGuestModal();
      // Refresh guests list
      const guestsData = await GuestsService.guestControllerGetAllGuests();
      setGuests(guestsData);
    } catch (error) {
      console.error('Failed to update guest:', error);
      toast.error('Failed to update guest');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteGuest = async () => {
    if (!deleteConfirmGuest?.id) return;

    setIsSubmitting(true);
    try {
      await GuestsService.guestControllerDelete(deleteConfirmGuest.id);
      toast.success('Guest deleted successfully!');
      closeDeleteConfirmModal();
      // Refresh guests list
      const guestsData = await GuestsService.guestControllerGetAllGuests();
      setGuests(guestsData);
    } catch (error) {
      console.error('Failed to delete guest:', error);
      toast.error('Failed to delete guest');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditGuest = (guest: GuestResponseDto) => {
    setEditingGuest(guest);
  };

  const handleSendEmail = () => {
    toast.info('Email functionality coming soon!');
    closeEmailModal();
  };

  // Form field management functions
  const addAccompanyingGuestField = (
    guest: Partial<CreateGuestDto & { id?: number }>,
    setGuest: React.Dispatch<React.SetStateAction<Partial<CreateGuestDto & { id?: number }>>>,
  ) => {
    const currentNames = guest.accompanyingGuestNames || [''];
    setGuest({ ...guest, accompanyingGuestNames: [...currentNames, ''] });
  };

  const removeAccompanyingGuestField = (
    index: number,
    guest: Partial<CreateGuestDto & { id?: number }>,
    setGuest: React.Dispatch<React.SetStateAction<Partial<CreateGuestDto & { id?: number }>>>,
  ) => {
    const currentNames = guest.accompanyingGuestNames || [];
    const updatedNames = currentNames.filter((_, i) => i !== index);
    setGuest({ ...guest, accompanyingGuestNames: updatedNames });
  };

  const updateAccompanyingGuestName = (
    index: number,
    value: string,
    guest: Partial<CreateGuestDto & { id?: number }>,
    setGuest: React.Dispatch<React.SetStateAction<Partial<CreateGuestDto & { id?: number }>>>,
  ) => {
    const currentNames = guest.accompanyingGuestNames || [];
    const updatedNames = [...currentNames];
    updatedNames[index] = value;
    setGuest({ ...guest, accompanyingGuestNames: updatedNames });
  };

  // Column definitions for DataTable using shared columns
  const columns = getGuestColumns({
    guests,
    onEditGuest: handleEditGuest,
    onDeleteGuest: openDeleteConfirmModal,
    includeEmail: true,
    showConfirmationIcon: true,
    detailedAccompanyingGuests: true,
  });

  // Add/Edit Guest Form Fields
  const guestFormFields = (
    guest: Partial<CreateGuestDto & { id?: number }>,
    setGuest: React.Dispatch<React.SetStateAction<Partial<CreateGuestDto & { id?: number }>>>,
  ) => [
    <div key="name" className="md:col-span-2">
      <FormField
        label="Name *"
        id="name"
        type="text"
        value={guest.name || ''}
        onChange={(e) => setGuest({ ...guest, name: e.target.value })}
        required
        placeholder="Guest Name"
      />
    </div>,

    <div key="group" className="md:col-span-2">
      <GroupSelectDropdown
        label="Group *"
        existingGroups={existingGroups}
        selected={guest.group || ''}
        setSelected={(group) => setGuest({ ...guest, group })}
        placeholder="Select or add group"
      />
    </div>,

    <div key="email" className="md:col-span-2">
      <FormField
        label="Email *"
        id="email"
        type="email"
        value={guest.email || ''}
        onChange={(e) => setGuest({ ...guest, email: e.target.value })}
        required
        placeholder="Guest email address"
      />
    </div>,

    <div key="allergies" className="md:col-span-2">
      <FormField
        label="Dietary Requirements"
        id="allergies"
        type="text"
        value={guest.allergies || ''}
        onChange={(e) => setGuest({ ...guest, allergies: e.target.value })}
        placeholder="Vegetarian, Gluten-Free, etc."
      />
    </div>,

    <div key="confirmationStatus" className="md:col-span-2">
      <SingleSelectDropdown
        label="Confirmation Status"
        options={Object.values(ConfirmationStatus)}
        selected={guest.confirmationStatus || ConfirmationStatus.PENDING}
        setSelected={(selected) =>
          setGuest({
            ...guest,
            confirmationStatus: selected as ConfirmationStatus,
          })
        }
        placeholder="Select confirmation status"
      />
    </div>,

    <div key="accompanyingGuests" className="md:col-span-2">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-foreground">Accompanying Guests</label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addAccompanyingGuestField(guest, setGuest)}
          className="text-brand-600 hover:text-brand-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Guest
        </Button>
      </div>
      <div className="space-y-2">
        {(guest.accompanyingGuestNames || ['']).map((name: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateAccompanyingGuestName(index, e.target.value, guest, setGuest)
              }
              placeholder={`Accompanying guest ${index + 1}`}
              className="flex-1"
            />
            {(guest.accompanyingGuestNames?.length || 0) > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAccompanyingGuestField(index, guest, setGuest)}
                className="text-red-600 hover:text-red-700 px-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Guest Management" description="Manage guests across all weddings" />

      {/* Edit Guest Modal */}
      {editingGuest && (
        <FormDialog
          open={!!editingGuest}
          onOpenChange={closeEditGuestModal}
          title="Edit Guest"
          isSubmitting={isSubmitting}
          onSubmit={handleUpdateGuest}
          onCancel={closeEditGuestModal}
          submitButtonText="Update Guest"
          formFields={guestFormFields(
            {
              ...editingGuest!,
              confirmationStatus:
                editingGuest!.confirmationStatus === 'pending'
                  ? ConfirmationStatus.PENDING
                  : editingGuest!.confirmationStatus === 'confirmed'
                    ? ConfirmationStatus.CONFIRMED
                    : ConfirmationStatus.REJECTED,
              accompanyingGuestNames: editingGuest!.accompanyingGuests?.map((ag) => ag.name) || [
                '',
              ],
            },
            setEditingGuest as React.Dispatch<
              React.SetStateAction<
                Partial<CreateGuestDto & { id?: number; accompanyingGuestNames?: string[] }>
              >
            >,
          )}
          noOfColumns={2}
        />
      )}

      <GuestSummaryStats
        guests={guests.map((guest) => ({
          ...guest,
          confirmationStatus:
            guest.confirmationStatus === 'pending'
              ? ConfirmationStatus.PENDING
              : guest.confirmationStatus === 'confirmed'
                ? ConfirmationStatus.CONFIRMED
                : ConfirmationStatus.REJECTED,
        }))}
      />

      {/* Guest List Table */}
      <DataTable
        data={primaryGuests.map((guest) => ({
          ...guest,
          email: guest.email || '',
        }))}
        columns={columns}
        searchableColumns={[{ id: 'name', placeholder: 'Search by name...' }]}
        enableSelection={false}
        enableColumnVisibility={true}
        enablePagination={true}
        defaultPageSize={10}
        title={`Guests (${guests.length})`}
        isLoading={isLoading}
        loadingMessage="Loading guests..."
        emptyMessage="No guests added yet."
        emptyDescription='Click "Add Guest" to get started!'
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deleteConfirmGuest}
        onOpenChange={closeDeleteConfirmModal}
        itemName={deleteConfirmGuest?.name || 'this guest'}
        description={
          deleteConfirmGuest && (
            <>
              Are you sure you want to delete {deleteConfirmGuest.name}?
              {(() => {
                const accompanyingCount = guests.filter(
                  (g) => g.primaryGuestId === deleteConfirmGuest?.id,
                ).length;
                return accompanyingCount > 0
                  ? ` This will also delete ${accompanyingCount} accompanying guest${accompanyingCount === 1 ? '' : 's'}.`
                  : '';
              })()}{' '}
              This action cannot be undone.
            </>
          )
        }
        onConfirm={confirmDeleteGuest}
        onCancel={closeDeleteConfirmModal}
      />

      {/* Email Guest Modal */}
      {emailModalGuest && (
        <EmailModal
          open={!!emailModalGuest}
          onOpenChange={closeEmailModal}
          name={emailModalGuest.name}
          email={emailModalGuest.email}
          onSendEmail={handleSendEmail}
        />
      )}
    </div>
  );
}
