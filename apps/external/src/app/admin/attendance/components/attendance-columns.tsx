import { Checkbox } from '@shared/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { GuestResponseDto } from '@shared/api';
import React from 'react';

/**
 * Constants for email truncation
 */
const EMAIL_TRUNCATE_LENGTH = 12;

/**
 * Props for attendance columns configuration
 */
interface AttendanceColumnsProps {
  onToggleAttendance: (guest: GuestResponseDto) => void;
  hasAttendanceChange: (guestId: number) => boolean;
}

/**
 * Truncate email if it exceeds the maximum length
 */
const truncateEmail = (email: string): string => {
  if (!email) return '-';
  return email.length > EMAIL_TRUNCATE_LENGTH
    ? `${email.substring(0, EMAIL_TRUNCATE_LENGTH)}...`
    : email;
};

/**
 * Calculate the displayed attendance state based on current state and pending changes
 */
const getDisplayedAttendanceState = (
  currentAttendance: boolean,
  hasPendingChange: boolean,
): boolean => {
  return hasPendingChange ? !currentAttendance : currentAttendance;
};

/**
 * Name cell component
 */
const NameCell = React.memo<{ name: string }>(({ name }) => (
  <div className="font-medium text-foreground">{name}</div>
));
NameCell.displayName = 'NameCell';

/**
 * Group cell component
 */
const GroupCell = React.memo<{ group?: string }>(({ group }) => (
  <div className="text-sm text-foreground">{group || '-'}</div>
));
GroupCell.displayName = 'GroupCell';

/**
 * Email cell component
 */
const EmailCell = React.memo<{ email: string }>(({ email }) => (
  <div className="text-sm text-foreground" title={email}>
    {truncateEmail(email)}
  </div>
));
EmailCell.displayName = 'EmailCell';

/**
 * Dietary requirements cell component
 */
const AllergiesCell = React.memo<{ allergies?: string }>(({ allergies }) => (
  <div className="text-sm text-foreground">{allergies || '-'}</div>
));
AllergiesCell.displayName = 'AllergiesCell';

/**
 * Attendance checkbox cell component
 */
interface AttendanceCellProps {
  isChecked: boolean;
  onToggle: () => void;
}

const AttendanceCell = React.memo<AttendanceCellProps>(({ isChecked, onToggle }) => (
  <Checkbox
    checked={isChecked}
    onCheckedChange={onToggle}
    aria-label="Mark attendance"
    className="border-black data-[state=checked]:bg-black data-[state=checked]:border-black"
  />
));
AttendanceCell.displayName = 'AttendanceCell';

/**
 * Generate column definitions for the attendance table
 */
export const getAttendanceColumns = ({
  onToggleAttendance,
  hasAttendanceChange,
}: AttendanceColumnsProps): ColumnDef<GuestResponseDto>[] => {
  const columns: ColumnDef<GuestResponseDto>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <NameCell name={row.getValue('name')} />,
    },
    {
      accessorKey: 'group',
      header: 'Group',
      cell: ({ row }) => <GroupCell group={row.getValue('group')} />,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <EmailCell email={row.getValue('email')} />,
    },
    {
      accessorKey: 'allergies',
      header: 'Dietary Requirements',
      cell: ({ row }) => <AllergiesCell allergies={row.getValue('allergies')} />,
    },
    {
      id: 'attendance',
      header: 'Attendance',
      cell: ({ row }) => {
        const guest = row.original;
        const hasPendingChange = hasAttendanceChange(guest.id);
        const currentAttendance = guest.attendance || false;
        const displayedState = getDisplayedAttendanceState(currentAttendance, hasPendingChange);

        return (
          <AttendanceCell
            isChecked={displayedState}
            onToggle={() => onToggleAttendance(guest)}
          />
        );
      },
    },
  ];

  return columns;
};
