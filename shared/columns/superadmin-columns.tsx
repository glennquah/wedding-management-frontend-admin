import { Button } from '../components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { SuperAdminResponseDto } from '@wedding/api-types';
import { Trash2 } from 'lucide-react';

interface SuperAdminColumnsProps {
  onDeleteSuperAdmin: (superAdmin: SuperAdminResponseDto) => void;
}

export const getSuperAdminColumns = ({
  onDeleteSuperAdmin,
}: SuperAdminColumnsProps): ColumnDef<SuperAdminResponseDto>[] => {
  const columns: ColumnDef<SuperAdminResponseDto>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className='font-medium text-foreground'>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className='text-sm text-foreground'>{row.getValue('email') || '-'}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return (
          <div className='text-sm text-foreground'>
            {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => {
        const date = new Date(row.getValue('updatedAt'));
        return (
          <div className='text-sm text-foreground'>
            {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const superAdmin = row.original;
        return (
          <div className='flex items-center gap-2'>
            <Button
              size='sm'
              variant='ghost'
              onClick={() => onDeleteSuperAdmin(superAdmin)}
              className='text-red-600 hover:text-red-700 hover:bg-red-50'
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        );
      },
    },
  ];

  return columns;
};