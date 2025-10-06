import { Button } from '@shared/components/ui/button';
import { Checkbox } from '@shared/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ConfirmationStatus, GuestResponseDto } from '@wedding/api-types';

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
  onToggleAttendance: (guest: GuestResponseDto) => void;
  hasAttendanceChange: (guestId: number) => boolean;
  onOpenAccompanyingGuestDialog: (primaryGuestId: number) => void;
}

export const getAttendanceColumns = ({
  guests,
  onToggleAttendance,
  hasAttendanceChange,
  onOpenAccompanyingGuestDialog,
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenAccompanyingGuestDialog(guest.id)}
            className="h-auto p-1 text-xs font-normal justify-start whitespace-nowrap min-w-0 hover:bg-brand-50 hover:text-brand-700"
          >
            +{accompanyingGuestsList.length}
          </Button>
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
