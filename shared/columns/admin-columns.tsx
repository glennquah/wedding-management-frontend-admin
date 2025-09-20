import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { AdminResponseDto, UserRole } from '@wedding/api-types';
import { CheckCheck, Edit2, OctagonX, Trash2 } from 'lucide-react';

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

const formatOnboardedDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

interface AdminColumnsProps {
  onEditAdmin: (admin: AdminResponseDto) => void;
  onDeleteAdmin: (admin: AdminResponseDto) => void;
  onSuspendAdmin: (admin: AdminResponseDto) => void;
  onUnsuspendAdmin: (admin: AdminResponseDto) => void;
  includeId?: boolean;
  includeUpdatedAt?: boolean;
  isSuspendedTable?: boolean;
}

export const getAdminColumns = ({
  onEditAdmin,
  onDeleteAdmin,
  onSuspendAdmin,
  onUnsuspendAdmin,
  includeId = false,
  includeUpdatedAt = false,
  isSuspendedTable = false,
}: AdminColumnsProps): ColumnDef<AdminResponseDto>[] => {
  const columns: ColumnDef<AdminResponseDto>[] = [];

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
      cell: ({ row }) => (
        <div className="font-medium text-foreground whitespace-nowrap">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 200,
      cell: ({ row }) => (
        <div className="text-sm text-foreground whitespace-nowrap">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'onboardedDate',
      header: 'Onboarded',
      cell: ({ row }) => (
        <div className="text-sm text-foreground whitespace-nowrap">
          {formatOnboardedDate(row.getValue('onboardedDate'))}
        </div>
      ),
    },
    {
      accessorKey: 'weddings',
      header: 'Weddings',
      size: 200,
      cell: ({ row }) => {
        const weddings = row.getValue('weddings') as Array<{ id: number; name: string }>;
        if (!weddings || weddings.length === 0) {
          return <div className="text-sm text-muted-foreground">No weddings</div>;
        }

        const weddingNames = weddings
          .slice(0, 2)
          .map((w) => w.name)
          .join(', ');
        const additionalCount = weddings.length > 2 ? ` +${weddings.length - 2} more` : '';

        return (
          <div
            className="text-xs truncate text-foreground"
            title={weddings.map((w) => w.name).join(', ')}
          >
            {weddingNames}
            {additionalCount}
          </div>
        );
      },
    },
    {
      accessorKey: 'isSuspended',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('isSuspended') ? 'destructive' : 'outline'}>
          {row.getValue('isSuspended') ? 'Suspended' : 'Active'}
        </Badge>
      ),
    },
  );

  if (includeUpdatedAt) {
    columns.push({
      accessorKey: 'updatedAt',
      header: 'Updated',
      cell: ({ row }) => (
        <div className="text-sm text-foreground whitespace-nowrap">
          {formatDateTime(row.getValue('updatedAt'))}
        </div>
      ),
    });
  }

  columns.push({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const admin = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEditAdmin(admin)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          {isSuspendedTable ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onUnsuspendAdmin(admin)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <CheckCheck className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteAdmin(admin)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSuspendAdmin(admin)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <OctagonX className="w-4 h-4" />
            </Button>
          )}
        </div>
      );
    },
  });

  return columns;
};
