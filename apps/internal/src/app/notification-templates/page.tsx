'use client';

import { useRef } from 'react';

import {
  PageHeader,
  SuperAdminNotificationTemplateListView,
} from '@shared/components';

const NotificationTemplatesPage = () => {
  const listViewRef = useRef<{ refresh: () => void }>(null);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="All Notification Templates"
          description={'View all notification templates across all weddings'}
        />
      </div>

      <div>
        <SuperAdminNotificationTemplateListView ref={listViewRef} />
      </div>
    </div>
  );
};

export default NotificationTemplatesPage;
