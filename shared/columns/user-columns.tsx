import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { UserResponseDto, UserRole } from '@wedding/api-types';
import { Edit2, Trash2 } from 'lucide-react';

const getRoleVariant = (role: UserRole): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (role) {
    case UserRole.ADMIN:
      return 'destructive';
    case UserRole.SUPER_ADMIN:
      return 'default';
    case UserRole.VENDOR:
      return 'secondary';
    default:
      return 'outline';
  }
};

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

interface UserColumnsProps {
  onEditUser: (user: UserResponseDto) => void;
  onDeleteUser: (user: UserResponseDto) => void;
  includeId?: boolean;
  includeUpdatedAt?: boolean;
}

export const getUserColumns = ({
  onEditUser,
  onDeleteUser,
  includeId = false,
  includeUpdatedAt = false,
}: UserColumnsProps): ColumnDef<UserResponseDto>[] => {
  const columns: ColumnDef<UserResponseDto>[] = [];

  if (includeId) {
    columns.push({
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <div className="text-sm text-foreground">{row.getValue('id')}</div>,
    });
  }

  columns.push(
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div className="text-sm text-foreground">{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as UserRole;
        return <Badge variant={getRoleVariant(role)}>{role}</Badge>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{formatDateTime(row.getValue('createdAt'))}</div>
      ),
    },
  );

  if (includeUpdatedAt) {
    columns.push({
      accessorKey: 'updatedAt',
      header: 'Updated',
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{formatDateTime(row.getValue('updatedAt'))}</div>
      ),
    });
  }

  columns.push({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEditUser(user)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDeleteUser(user)}
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
