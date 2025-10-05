import { Badge } from '@shared/components/ui/badge';
import { Button } from '@shared/components/ui/button';
import { Checkbox } from '@shared/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/components/ui/form/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ConfirmationStatus, GuestResponseDto } from '@wedding/api-types';
import { ChevronDown, Edit2, Trash2 } from 'lucide-react';

// Helper functions for confirmation status
const getConfirmationStatusVariant = (
  status: ConfirmationStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case ConfirmationStatus.CONFIRMED:
      return 'default';
    case ConfirmationStatus.REJECTED:
      return 'destructive';
    default:
      return 'outline';
  }
};

const getConfirmationLabel = (status: ConfirmationStatus) => {
  switch (status) {
    case ConfirmationStatus.CONFIRMED:
      return 'Confirmed';
    case ConfirmationStatus.REJECTED:
      return 'Declined';
    default:
      return 'Pending';
  }
};

const getConfirmationIcon = (status: ConfirmationStatus) => {
  switch (status) {
    case ConfirmationStatus.CONFIRMED:
      return '✓';
    case ConfirmationStatus.REJECTED:
      return '✗';
    default:
      return '?';
  }
};

interface AttendanceColumnsProps {
  guests: GuestResponseDto[];
  onEditGuest: (guest: GuestResponseDto) => void;
  onDeleteGuest: (guest: GuestResponseDto) => void;
  onToggleAttendance: (guest: GuestResponseDto) => void;
  hasAttendanceChange: (guestId: number) => boolean;
}

export const getAttendanceColumns = ({
  guests,
  onEditGuest,
  onDeleteGuest,
  onToggleAttendance,
  hasAttendanceChange,
}: AttendanceColumnsProps): ColumnDef<GuestResponseDto>[] => {
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
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const email = row.getValue('email') as string;
        const truncatedEmail = email && email.length > 12 ? email.substring(0, 12) + '...' : email;
        return (
          <div className="text-sm text-foreground" title={email}>
            {truncatedEmail || '-'}
          </div>
        );
      },
    },
    {
      id: 'accompanyingGuests',
      header: 'Accompanying Guests',
      cell: ({ row }) => {
        const guest = row.original;
        const accompanyingGuestsList = guests.filter((g) => g.primaryGuestId === guest.id);

        if (accompanyingGuestsList.length === 0) {
          return <div className="text-sm text-foreground">0 guests</div>;
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-xs font-normal justify-start whitespace-nowrap min-w-0"
              >
                +{accompanyingGuestsList.length}
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
      accessorKey: 'weddingName',
      header: 'Wedding Name',
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue('weddingName') || '-'}</div>
      ),
      size: 200,
    },
    {
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
    },
    {
      id: 'attendance',
      header: 'Attendance',
      cell: ({ row }) => {
        const guest = row.original;
        // Determine the checkbox state based on current attendance and pending changes
        const hasPendingChange = hasAttendanceChange(guest.id);
        const currentAttendance = guest.attendance || false;
        // If there's a pending change, toggle the current state
        const displayedState = hasPendingChange ? !currentAttendance : currentAttendance;

        return (
          <Checkbox
            checked={displayedState}
            onCheckedChange={() => onToggleAttendance(guest)}
            aria-label="Mark attendance"
            className="border-black data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
        );
      },
    },
  ];

  return columns;
};
