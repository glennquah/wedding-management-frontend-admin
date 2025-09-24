'use client';

import { useState } from 'react';

import { AllEmailNotificationHistoryResponseDto } from '../api/models/AllEmailNotificationHistoryResponseDto';
import { EmailNotificationHistoryResponseDto } from '../api/models/EmailNotificationHistoryResponseDto';
import { createNotificationColumns } from '../columns/notification-columns';
import EmailDetailsModal from './EmailDetailsModal';
import { DataTable } from './ui/table';

type NotificationHistoryType =
  | EmailNotificationHistoryResponseDto
  | AllEmailNotificationHistoryResponseDto;

interface NotificationListProps {
  data: NotificationHistoryType[];
  isLoading?: boolean;
}

export default function NotificationList({ data, isLoading = false }: NotificationListProps) {
  const [selectedEmail, setSelectedEmail] = useState<NotificationHistoryType | null>(null);

  const handleViewEmail = (email: NotificationHistoryType) => {
    setSelectedEmail(email);
  };

  // Check if any item in the data has wedding/vendor name properties
  const hasRelatedEntity = data.some(
    (item) => 'weddingName' in item || 'vendorName' in item
  );

  const columns = createNotificationColumns(handleViewEmail, hasRelatedEntity);

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
        title="Email Notification Sent History"
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
