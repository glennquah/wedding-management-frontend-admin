'use client';

import { useEffect, useState } from 'react';

import { AllEmailNotificationHistoryResponseDto, NotificationDetailsService } from '@shared/api';
import { PageHeader } from '@shared/components';
import NotificationList from '@shared/components/NotificationList';

export const dynamic = 'force-dynamic';

export default function NotificationsManagementPage() {
  const [notifications, setNotifications] = useState<AllEmailNotificationHistoryResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response =
          await NotificationDetailsService.notificationDetailsControllerGetAllEmailNotificationHistory();
        setNotifications(response);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="w-full max-w-full px-4 py-8 min-w-0 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Notifications Management"
          description="Manage notifications and their settings"
        />
      </div>
      <NotificationList data={notifications} isLoading={isLoading} />
    </div>
  );
}
