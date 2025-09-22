'use client';

import { useRef, useState } from 'react';

import { useWeddingStore } from '../../store/sessionStore';
import {
  AddNotificationTemplateDialog,
  Button,
  NotificationTemplateListView,
  NotificationTemplateListViewRef,
  PageHeader,
  SendNotificationsDialog,
} from '@shared/components';
import { Bell, Plus } from 'lucide-react';

const NotificationTemplatesPage = () => {
  const currentWeddingId = useWeddingStore((state) => state.selectedWeddingId);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const listViewRef = useRef<NotificationTemplateListViewRef>(null);

  const handleTemplateCreated = () => {
    // Refresh the template list
    listViewRef.current?.refresh();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Notification Templates"
          description={'Manage your wedding notification templates'}
        />

        {currentWeddingId && (
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
        )}
      </div>

      <div>
        <NotificationTemplateListView ref={listViewRef} weddingId={currentWeddingId || undefined} />
      </div>

      {/* Add Template Dialog */}
      {currentWeddingId && (
        <AddNotificationTemplateDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          weddingId={currentWeddingId}
          onTemplateCreated={handleTemplateCreated}
        />
      )}

      {/* Send Notifications Dialog */}
      {currentWeddingId && (
        <SendNotificationsDialog
          open={showSendDialog}
          onOpenChange={setShowSendDialog}
          weddingId={currentWeddingId}
        />
      )}
    </div>
  );
};

export default NotificationTemplatesPage;
