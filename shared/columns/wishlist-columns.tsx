import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { WishlistItemResponseDto } from '@wedding/api-types';
import { Edit2, ExternalLink, Trash2 } from 'lucide-react';

interface WishlistColumnsProps {
  onEditItem: (item: WishlistItemResponseDto) => void;
  onDeleteItem: (item: WishlistItemResponseDto) => void;
}

export const getWishlistColumns = ({
  onEditItem,
  onDeleteItem,
}: WishlistColumnsProps): ColumnDef<WishlistItemResponseDto>[] => {
  return [
    {
      accessorKey: 'title',
      header: 'Item Name',
      cell: ({ row }) => (
        <div className="font-medium text-foreground">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'itemUrl',
      header: 'URL',
      cell: ({ row }) => {
        const url = row.getValue('itemUrl') as string;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            <span className="truncate max-w-[200px]">{url}</span>
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
        );
      },
    },
    {
      accessorKey: 'isReserved',
      header: 'Reserved',
      cell: ({ row }) => {
        const isReserved = row.getValue('isReserved') as boolean;
        return (
          <Badge variant={isReserved ? 'default' : 'outline'}>
            {isReserved ? 'Reserved' : 'Available'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => onEditItem(item)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDeleteItem(item)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];
};
