import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/form/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ConfirmationStatus, GuestResponseDto } from '@wedding/api-types';
import { ChevronDown, Edit2, Trash2 } from 'lucide-react';

// Helper functions for confirmation status
const getConfirmationStatusColor = (status: ConfirmationStatus) => {
  switch (status) {
    case 'confirmed':
      return 'bg-[#17b26a] text-white';
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

const getConfirmationIcon = (status: ConfirmationStatus) => {
  switch (status) {
    case 'confirmed':
      return '✓';
    case 'rejected':
      return '✗';
    default:
      return '?';
  }
};

interface GuestColumnsProps {
  guests: GuestResponseDto[];
  onEditGuest: (guest: GuestResponseDto) => void;
  onDeleteGuest: (guest: GuestResponseDto) => void;
  includeEmail?: boolean;
  showConfirmationIcon?: boolean;
  detailedAccompanyingGuests?: boolean;
}

export const getGuestColumns = ({
  guests,
  onEditGuest,
  onDeleteGuest,
  includeEmail = false,
  showConfirmationIcon = false,
  detailedAccompanyingGuests = false,
}: GuestColumnsProps): ColumnDef<GuestResponseDto>[] => {
  const columns: ColumnDef<GuestResponseDto>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'group',
      header: 'Group',
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue('group') || '-'}</div>
      ),
    },
  ];

  // Add email column if requested
  if (includeEmail) {
    columns.push({
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue('email') || '-'}</div>
      ),
    });
  }

  // Add confirmation status column
  columns.push({
    accessorKey: 'confirmationStatus',
    header: showConfirmationIcon ? 'Confirmed' : 'Status',
    cell: ({ row }) => {
      const status = row.getValue('confirmationStatus') as ConfirmationStatus;
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getConfirmationStatusColor(
            status,
          )}`}
        >
          {showConfirmationIcon && getConfirmationIcon(status)}
          {getConfirmationLabel(status)}
        </span>
      );
    },
  });

  // Add accompanying guests column
  columns.push({
    id: 'accompanyingGuests',
    header: 'Accompanying Guests',
    cell: ({ row }) => {
      const guest = row.original;
      const accompanyingGuestsList = guests.filter((g) => g.primaryGuestId === guest.id);

      if (accompanyingGuestsList.length === 0) {
        return <div className="text-sm text-foreground">0 guests</div>;
      }

      // Show detailed dropdown or simple count
      if (detailedAccompanyingGuests) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-sm font-normal justify-start"
              >
                +{accompanyingGuestsList.length} guest
                {accompanyingGuestsList.length === 1 ? '' : 's'}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {accompanyingGuestsList.map((accompanyingGuest, index) => (
                <DropdownMenuItem key={accompanyingGuest.id || index} className="cursor-default">
                  <span className="font-medium">{accompanyingGuest.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }

      return (
        <div className="text-sm text-foreground">
          +{accompanyingGuestsList.length} guest{accompanyingGuestsList.length === 1 ? '' : 's'}
        </div>
      );
    },
  });

  // Add dietary requirements column
  columns.push({
    accessorKey: 'allergies',
    header: 'Dietary Requirements',
    cell: ({ row }) => (
      <div className="text-sm text-foreground">{row.getValue('allergies') || '-'}</div>
    ),
  });

  // Add actions column
  columns.push({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const guest = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEditGuest(guest)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDeleteGuest(guest)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  });

  return columns;
};
