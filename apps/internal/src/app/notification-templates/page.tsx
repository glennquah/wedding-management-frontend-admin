'use client';

import { useRef, useState } from 'react';

import {
  AddNotificationTemplateDialog,
  Button,
  PageHeader,
  SuperAdminNotificationTemplateListView,
} from '@shared/components';
import { Bell, Plus } from 'lucide-react';

const NotificationTemplatesPage = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const listViewRef = useRef<{ refresh: () => void }>(null);

  const handleTemplateCreated = () => {
    // Refresh the template list
    listViewRef.current?.refresh();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="All Notification Templates"
          description={'View all notification templates across all weddings'}
        />
        <div className="flex flex-row gap-2">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
          <Button variant="secondary" onClick={() => setShowSendDialog(true)}>
            <Bell className="w-4 h-4 mr-2" />
            Send Notifications
          </Button>
        </div>
      </div>

      <div>
        <SuperAdminNotificationTemplateListView ref={listViewRef} />
      </div>
      {/* Add Template Dialog */}
      <AddNotificationTemplateDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onTemplateCreated={handleTemplateCreated}
      />

      {/* Send Notifications Dialog */}
      {/* <SendNotificationsDialog
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        weddingId={currentWeddingId}
      /> */}
    </div>
  );
};

export default NotificationTemplatesPage;
