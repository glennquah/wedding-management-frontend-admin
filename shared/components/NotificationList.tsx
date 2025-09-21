'use client';

import { EmailNotificationHistoryResponseDto } from '../api/models/EmailNotificationHistoryResponseDto';
import { DataTable } from './ui/table';
import { notificationColumns } from '../columns/notification-columns';

interface NotificationListProps {
  data: EmailNotificationHistoryResponseDto[];
  isLoading?: boolean;
}

export default function NotificationList({ data, isLoading = false }: NotificationListProps) {
  return (
    <div className="space-y-4">
      <DataTable
        data={data}
        columns={notificationColumns}
        isLoading={isLoading}
        loadingMessage="Loading notifications..."
        emptyMessage="No notifications found"
        emptyDescription="No email notifications have been sent for this wedding yet."
        enableSelection={false}
        enableColumnVisibility={false}
        enablePagination={true}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        title="Email Notification History"
        searchableColumns={[
          {
            id: 'subject' as keyof EmailNotificationHistoryResponseDto,
            placeholder: 'Search by subject...',
          },
        ]}
      />
    </div>
  );
}
