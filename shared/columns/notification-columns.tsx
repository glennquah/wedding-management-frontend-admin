import { EmailNotificationHistoryResponseDto } from '../api/models/EmailNotificationHistoryResponseDto';
import { AllEmailNotificationHistoryResponseDto } from '../api/models/AllEmailNotificationHistoryResponseDto';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ColumnDef } from '@tanstack/react-table';

type NotificationHistoryType = EmailNotificationHistoryResponseDto | AllEmailNotificationHistoryResponseDto;

const getTypeColor = (type: EmailNotificationHistoryResponseDto.type | AllEmailNotificationHistoryResponseDto.type) => {
  switch (type) {
    case 'PASSWORD_RESET':
      return 'destructive';
    case 'WELCOME':
      return 'default';
    case 'VERIFY_EMAIL':
      return 'secondary';
    case 'CREATE_ACCOUNT':
      return 'default';
    case 'CUSTOM':
      return 'outline';
    default:
      return 'secondary';
  }
};

const formatType = (type: EmailNotificationHistoryResponseDto.type | AllEmailNotificationHistoryResponseDto.type) => {
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export const createNotificationColumns = (
  onViewEmail: (email: NotificationHistoryType) => void,
  showRelatedEntity: boolean = false,
): ColumnDef<NotificationHistoryType>[] => {
  const baseColumns: ColumnDef<NotificationHistoryType>[] = [
    {
      id: 'type',
      header: 'Type',
      accessorFn: (row) => formatType(row.type),
      cell: ({ row }) => {
        const notification = row.original;
        return (
          <Badge variant={getTypeColor(notification.type)} className="text-xs">
            {formatType(notification.type)}
          </Badge>
        );
      },
      size: 150,
    },
    {
      id: 'subject',
      header: 'Subject',
      accessorKey: 'subject',
      cell: ({ row }) => {
        const notification = row.original;
        return (
          <div className="text-sm font-medium text-foreground truncate max-w-[400px]">
            {notification.subject}
          </div>
        );
      },
      size: 300,
    },
    {
      id: 'recipients',
      header: 'Recipients',
      cell: ({ row }) => {
        const notification = row.original;
        const emailList = notification.to.join(', ');
        return (
          <div className="text-muted-foreground text-xs break-all max-w-[300px]">{emailList}</div>
        );
      },
      size: 200,
    },
  ];

  const relatedEntityColumn: ColumnDef<NotificationHistoryType> = {
    id: 'relatedEntity',
    header: 'Wedding / Vendor',
    cell: ({ row }) => {
      const notification = row.original as AllEmailNotificationHistoryResponseDto;
      const entityName = notification.weddingName || notification.vendorName;
      const entityType = notification.weddingName ? 'Wedding' : notification.vendorName ? 'Vendor' : null;

      if (!entityName) {
        return <div className="text-xs text-muted-foreground">-</div>;
      }

      return (
        <div className="text-xs">
          <div className="text-muted-foreground mb-1">{entityType}</div>
          <div className="font-medium text-foreground truncate max-w-[200px]">{entityName}</div>
        </div>
      );
    },
    size: 200,
  };

  const endColumns: ColumnDef<NotificationHistoryType>[] = [
    {
      id: 'sentAt',
      header: 'Time',
      cell: ({ row }) => {
        const notification = row.original;
        const sentAtDate = new Date(notification.sentAt);
        return (
          <div className="text-xs text-muted-foreground">
            {sentAtDate.toLocaleDateString()} {sentAtDate.toLocaleTimeString()}
          </div>
        );
      },
      size: 200,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const notification = row.original;
        return (
          <Button
            className="flex items-center whitespace-nowrap text-xs px-1 py-1 min-w-0"
            size="sm"
            onClick={() => onViewEmail(notification)}
          >
            View
          </Button>
        );
      },
      size: 100,
    },
  ];

  return showRelatedEntity
    ? [...baseColumns, relatedEntityColumn, ...endColumns]
    : [...baseColumns, ...endColumns];
};
