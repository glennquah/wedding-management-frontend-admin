'use client';

import { useState } from 'react';
import { EmailNotificationHistoryResponseDto } from '../api/models/EmailNotificationHistoryResponseDto';
import { createNotificationColumns } from '../columns/notification-columns';
import { DataTable } from './ui/table';
import EmailDetailsModal from './EmailDetailsModal';

interface NotificationListProps {
  data: EmailNotificationHistoryResponseDto[];
  isLoading?: boolean;
}

export default function NotificationList({ data, isLoading = false }: NotificationListProps) {
  const [selectedEmail, setSelectedEmail] = useState<EmailNotificationHistoryResponseDto | null>(null);

  const handleViewEmail = (email: EmailNotificationHistoryResponseDto) => {
    setSelectedEmail(email);
  };

  const columns = createNotificationColumns(handleViewEmail);

  return (
    <div className="space-y-4">
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        loadingMessage="Loading notifications..."
        emptyMessage="No notifications found"
        emptyDescription="No email notifications have been sent yet."
        enableSelection={false}
        enableColumnVisibility={false}
        enablePagination={true}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        title="Email Notification History"
        searchableColumns={[
          {
            id: 'subject',
            placeholder: 'Search notifications by subject',
          },
        ]}
      />

      <EmailDetailsModal
        open={!!selectedEmail}
        onOpenChange={(open) => !open && setSelectedEmail(null)}
        email={selectedEmail}
      />
    </div>
  );
}
