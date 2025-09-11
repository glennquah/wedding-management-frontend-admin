'use client';

import { useEffect, useState } from 'react';

import { getGuestColumns } from '@shared/columns/guest-columns';
import { DataTable, PageHeader } from '@shared/components';
import { GuestResponseDto, GuestsService } from '@wedding/api-types';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

export default function GuestManagementPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [guests, setGuests] = useState<GuestResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch guests data
  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

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

  const handleAddGuest = () => {
    toast.info('Add guest functionality coming soon!');
  };

  const handleEditGuest = (guest: GuestResponseDto) => {
    toast.info(`Edit ${guest.name} functionality coming soon!`);
  };

  const handleDeleteGuest = (guest: GuestResponseDto) => {
    toast.info(`Delete ${guest.name} functionality coming soon!`);
  };

  // Get column definitions using shared columns
  const columns = getGuestColumns({
    guests,
    onEditGuest: handleEditGuest,
    onDeleteGuest: handleDeleteGuest,
  });

  return (
    <div className="w-full bg-gradient-to-b from-white to-brand-100 text-foreground">
      <div className="container mx-auto px-4 py-4">
        <PageHeader
          title="Guest Management"
          description="Manage guests across all weddings"
          buttonText="Add Guest"
          onButtonClick={handleAddGuest}
          buttonIcon={<Plus className="w-4 h-4" />}
          isButtonDisabled={isLoading}
        />

        {/* Guest List Table */}
        <DataTable
          data={primaryGuests}
          columns={columns}
          searchableColumns={[{ id: 'name', placeholder: 'Search by name...' }]}
          enableSelection={false}
          enableColumnVisibility={true}
          enablePagination={true}
          defaultPageSize={10}
          title={`Guests (${guests.length})`}
          isLoading={isLoading}
          loadingMessage="Loading guests..."
          emptyMessage="No guests found."
          emptyDescription='Click "Add Guest" to get started!'
        />
      </div>
    </div>
  );
}
