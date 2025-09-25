'use client';

import { useEffect, useState } from 'react';
import { useWeddingStore } from '../../store/sessionStore';
import NotificationList from '@shared/components/NotificationList';
import { EmailNotificationHistoryResponseDto } from '@shared/api/models/EmailNotificationHistoryResponseDto';
import { NotificationDetailsService } from '@shared/api/services/NotificationDetailsService';

const NotificationsPage = () => {
  const currentWeddingId = useWeddingStore((state) => state.selectedWeddingId);
  const [notifications, setNotifications] = useState<EmailNotificationHistoryResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentWeddingId) return;

      try {
        setIsLoading(true);
        const response = await NotificationDetailsService.notificationDetailsControllerGetEmailNotificationHistoryWithWeddingId(
          currentWeddingId,
        );
        setNotifications(response);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [currentWeddingId]);

  if (!currentWeddingId) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please select a wedding to view notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <NotificationList data={notifications} isLoading={isLoading} />
    </div>
  );
};

export default NotificationsPage;
