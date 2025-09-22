'use client';

import { useWeddingStore } from '../../store/sessionStore';
import { NotificationTemplateListView, PageHeader } from '@shared/components';

const NotificationTemplatesPage = () => {
  const currentWeddingId = useWeddingStore((state) => state.selectedWeddingId);

  return (
    <div className="p-6">
      <PageHeader
        title="Notification Templates"
        description={'Manage your wedding notification templates'}
      />

      <div className="mt-6">
        <NotificationTemplateListView weddingId={currentWeddingId || undefined} />
      </div>
    </div>
  );
};

export default NotificationTemplatesPage;
