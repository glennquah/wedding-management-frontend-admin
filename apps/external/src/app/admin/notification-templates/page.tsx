'use client';

import { useRef, useState } from 'react';

import { useWeddingStore } from '../../store/sessionStore';
import {
  AddNotificationTemplateDialog,
  Button,
  NotificationTemplateListView,
  NotificationTemplateListViewRef,
  PageHeader,
} from '@shared/components';
import { Plus } from 'lucide-react';

const NotificationTemplatesPage = () => {
  const currentWeddingId = useWeddingStore((state) => state.selectedWeddingId);
  const [showAddDialog, setShowAddDialog] = useState(false);
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
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
        )}
      </div>

      <div className="mt-6">
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
    </div>
  );
};

export default NotificationTemplatesPage;
