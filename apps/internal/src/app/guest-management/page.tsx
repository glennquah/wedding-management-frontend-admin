'use client';

import { DataTable, PageHeader } from '@shared/components';
import { Button } from '@shared/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ConfirmationStatus, GuestResponseDto, GuestsService } from '@wedding/api-types';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

// Helper functions for confirmation status
const getConfirmationStatusColor = (status: ConfirmationStatus) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

const getConfirmationLabel = (status: ConfirmationStatus) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmed';
    case 'rejected':
      return 'Declined';
    default:
      return 'Pending';
  }
};

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
  const primaryGuests = guests.filter(guest => !guest.primaryGuestId);

  // Column definitions for DataTable
  const columns: ColumnDef<GuestResponseDto>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium text-foreground">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'group',
      header: 'Group',
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue('group') || '-'}</div>
      ),
    },
    {
      accessorKey: 'confirmationStatus',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('confirmationStatus') as ConfirmationStatus;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getConfirmationStatusColor(
              status
            )}`}
          >
            {getConfirmationLabel(status)}
          </span>
        );
      },
    },
    {
      id: 'accompanyingGuests',
      header: 'Accompanying Guests',
      cell: ({ row }) => {
        const guest = row.original;
        const accompanyingCount = guests.filter(g => g.primaryGuestId === guest.id).length;

        if (accompanyingCount === 0) {
          return <div className="text-sm text-foreground">0 guests</div>;
        }

        return (
          <div className="text-sm text-foreground">
            +{accompanyingCount} guest{accompanyingCount === 1 ? '' : 's'}
          </div>
        );
      },
    },
    {
      accessorKey: 'allergies',
      header: 'Dietary Requirements',
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue('allergies') || '-'}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const guest = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => handleEditGuest(guest)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteGuest(guest)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleAddGuest = () => {
    toast.info('Add guest functionality coming soon!');
  };

  const handleEditGuest = (guest: GuestResponseDto) => {
    toast.info(`Edit ${guest.name} functionality coming soon!`);
  };

  const handleDeleteGuest = (guest: GuestResponseDto) => {
    toast.info(`Delete ${guest.name} functionality coming soon!`);
  };

  return (
    <div className="w-full bg-gradient-to-b from-white to-brand-100 text-foreground">
      <div className="container mx-auto px-4 py-8">
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
