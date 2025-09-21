import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../components/ui/badge';
import { EmailNotificationHistoryResponseDto } from '../api/models/EmailNotificationHistoryResponseDto';

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
    id: 'typeAndSubject',
    header: 'Notification',
    cell: ({ row }) => {
      const notification = row.original;
      return (
        <div className="space-y-2">
          <div>
            <Badge variant={getTypeColor(notification.type)} className="text-xs">
              {formatType(notification.type)}
            </Badge>
          </div>
          <div className="text-sm font-medium text-foreground truncate max-w-[300px]">
            {notification.subject}
          </div>
        </div>
      );
    },
    size: 350,
  },
  {
    id: 'recipientsAndTiming',
    header: 'Recipients & Timing',
    cell: ({ row }) => {
      const notification = row.original;
      const emailList = notification.to.join(', ');
      const sentAtDate = new Date(notification.sentAt);

      return (
        <div className="space-y-2">
          <div className="text-sm text-foreground">
            <div className="font-medium mb-1">Recipients:</div>
            <div className="text-muted-foreground text-xs break-all max-w-[400px]">
              {emailList}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {sentAtDate.toLocaleDateString()} {sentAtDate.toLocaleTimeString()}
          </div>
        </div>
      );
    },
    size: 450,
  },
];