import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import {
  BudgetBucket,
  GuestCountBucket,
  GuestResponseDto,
  WeddingResponseDto,
  WeddingService,
} from '@wedding/api-types';
import { Edit2, Trash2 } from 'lucide-react';

const getBudgetVariant = (
  budget: BudgetBucket,
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (budget) {
    case BudgetBucket.LOW:
      return 'outline';
    case BudgetBucket.MEDIUM:
      return 'secondary';
    case BudgetBucket.HIGH:
      return 'default';
    case BudgetBucket.LUXURY:
      return 'destructive';
    default:
      return 'outline';
  }
};

const getGuestCountVariant = (
  count: GuestCountBucket,
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (count) {
    case GuestCountBucket.SMALL:
      return 'outline';
    case GuestCountBucket.MEDIUM:
      return 'secondary';
    case GuestCountBucket.LARGE:
      return 'default';
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

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

interface WeddingColumnsProps {
  onEditWedding: (wedding: WeddingResponseDto) => void;
  onDeleteWedding: (wedding: WeddingResponseDto) => void;
  includeId?: boolean;
  includeUpdatedAt?: boolean;
}

export const getWeddingColumns = ({
  onEditWedding,
  onDeleteWedding,
  includeId = false,
  includeUpdatedAt = false,
}: WeddingColumnsProps): ColumnDef<WeddingResponseDto>[] => {
  const columns: ColumnDef<WeddingResponseDto>[] = [];

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
      header: 'Wedding Name',
      cell: ({ row }) => (
        <div className="font-medium text-foreground whitespace-nowrap">{row.getValue('name')}</div>
      ),
      size: 350,
    },
    {
      accessorKey: 'date',
      header: 'Wedding Date',
      cell: ({ row }) => {
        const date = row.getValue('date') as string;
        return (
          <div className="text-sm text-foreground whitespace-nowrap">
            {date ? formatDate(date) : 'Not set'}
          </div>
        );
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      size: 200,
      cell: ({ row }) => {
        const location = row.getValue('location') as string;
        return (
          <div className="text-sm text-foreground truncate" title={location || 'Not specified'}>
            {location || 'Not specified'}
          </div>
        );
      },
    },
    {
      accessorKey: 'weddingType',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline">{capitalizeFirst(row.getValue('weddingType'))}</Badge>
      ),
    },
    {
      accessorKey: 'budgetBucket',
      header: 'Budget',
      cell: ({ row }) => (
        <Badge variant={getBudgetVariant(row.getValue('budgetBucket'))}>
          {capitalizeFirst(row.getValue('budgetBucket'))}
        </Badge>
      ),
    },
    {
      accessorKey: 'guestCountBucket',
      header: 'Guest Count',
      cell: ({ row }) => (
        <Badge variant={getGuestCountVariant(row.getValue('guestCountBucket'))}>
          {capitalizeFirst(row.getValue('guestCountBucket'))}
        </Badge>
      ),
    },
    {
      accessorKey: 'guests',
      header: 'Guests',
      cell: ({ row }) => {
        const guests = row.getValue('guests') as Array<GuestResponseDto>;
        // TODO: FIX THIS
        console.log(guests);
        const guestCount = guests ? guests.length : 0;
        return <div className="text-sm text-foreground">{guestCount}</div>;
      },
    },
    {
      accessorKey: 'preferredStyle',
      header: 'Style',
      cell: ({ row }) => (
        <Badge variant="secondary">{capitalizeFirst(row.getValue('preferredStyle'))}</Badge>
      ),
    },
    {
      accessorKey: 'preferredServices',
      header: 'Services',
      size: 250,
      cell: ({ row }) => {
        const services = row.getValue('preferredServices') as Array<WeddingService>;
        if (!services || services.length === 0) {
          return <div className="text-sm text-muted-foreground">No services</div>;
        }

        const serviceNames = services
          .slice(0, 2)
          .map((s) => capitalizeFirst(s))
          .join(', ');
        const additionalCount = services.length > 2 ? ` +${services.length - 2} more` : '';

        return (
          <div
            className="text-xs truncate text-foreground"
            title={services.map((s) => capitalizeFirst(s)).join(', ')}
          >
            {serviceNames}
            {additionalCount}
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <div className="text-sm text-foreground whitespace-nowrap">
          {formatDate(row.getValue('createdAt'))}
        </div>
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
      const wedding = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEditWedding(wedding)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDeleteWedding(wedding)}
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
