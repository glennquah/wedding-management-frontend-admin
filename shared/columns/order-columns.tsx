import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { OrderResponseDto } from '@wedding/api-types';
import { Edit2, Trash2 } from 'lucide-react';

const getStatusVariant = (
  status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'PENDING':
      return 'outline';
    case 'CONFIRMED':
      return 'secondary';
    case 'PAID':
      return 'default';
    case 'COMPLETED':
      return 'default';
    case 'CANCELLED':
      return 'destructive';
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

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

interface OrderColumnsProps {
  onEditOrder: (order: OrderResponseDto) => void;
  onDeleteOrder: (order: OrderResponseDto) => void;
  includeId?: boolean;
  includeUpdatedAt?: boolean;
}

export const getOrderColumns = ({
  onEditOrder,
  onDeleteOrder,
  includeId = false,
  includeUpdatedAt = false,
}: OrderColumnsProps): ColumnDef<OrderResponseDto>[] => {
  const columns: ColumnDef<OrderResponseDto>[] = [];

  if (includeId) {
    columns.push({
      accessorKey: 'id',
      header: 'Order ID',
      cell: ({ row }) => <div className="text-sm text-foreground">{row.getValue('id')}</div>,
    });
  }

  columns.push(
    {
      accessorKey: 'weddingId',
      header: 'Wedding ID',
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue('weddingId')}</div>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total Amount',
      cell: ({ row }) => {
        const amount = row.getValue('totalAmount') as number;
        const currency = row.original.currency;
        return (
          <div className="font-medium text-foreground whitespace-nowrap">
            {formatCurrency(amount, currency)}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        if (!status) {
          return <Badge variant="outline">Unknown</Badge>;
        }
        return (
          <Badge variant={getStatusVariant(status)}>
            {capitalizeFirst(status.toLowerCase())}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'purchaseDate',
      header: 'Purchase Date',
      cell: ({ row }) => {
        const date = row.getValue('purchaseDate') as string;
        return (
          <div className="text-sm text-foreground whitespace-nowrap">
            {date ? formatDate(date) : 'Not set'}
          </div>
        );
      },
    },
    {
      accessorKey: 'remark',
      header: 'Remarks',
      size: 250,
      cell: ({ row }) => {
        const remark = row.getValue('remark') as string;
        return (
          <div className="text-sm text-foreground truncate" title={remark || 'No remarks'}>
            {remark || 'No remarks'}
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

  // Commented out actions column for now
  // columns.push({
  //   id: 'actions',
  //   header: 'Actions',
  //   cell: ({ row }) => {
  //     const order = row.original;
  //     return (
  //       <div className="flex items-center gap-2">
  //         <Button size="sm" variant="ghost" onClick={() => onEditOrder(order)}>
  //           <Edit2 className="w-4 h-4" />
  //         </Button>
  //         <Button
  //           size="sm"
  //           variant="ghost"
  //           onClick={() => onDeleteOrder(order)}
  //           className="text-red-600 hover:text-red-700 hover:bg-red-50"
  //         >
  //           <Trash2 className="w-4 h-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  // });

  return columns;
};
