import { EmailNotificationHistoryResponseDto } from '../api/models/EmailNotificationHistoryResponseDto';
import { Badge } from '../components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

const getTypeColor = (type: EmailNotificationHistoryResponseDto.type) => {
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

const formatType = (type: EmailNotificationHistoryResponseDto.type) => {
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export const notificationColumns: ColumnDef<EmailNotificationHistoryResponseDto>[] = [
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
    size: 300,
  },
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
];
