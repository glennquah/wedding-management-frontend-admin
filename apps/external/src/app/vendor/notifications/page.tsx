'use client';

import { useEffect, useState } from 'react';

import { useVendorSession } from '@/contexts/VendorSessionContext';
import { EmailNotificationHistoryResponseDto } from '@shared/api/models/EmailNotificationHistoryResponseDto';
import { NotificationDetailsService } from '@shared/api/services/NotificationDetailsService';
import NotificationList from '@shared/components/NotificationList';

const VendorNotificationsPage = () => {
  const { vendorId } = useVendorSession();
  const [notifications, setNotifications] = useState<EmailNotificationHistoryResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!vendorId) return;

      try {
        setIsLoading(true);
        const response =
          await NotificationDetailsService.notificationDetailsControllerGetEmailNotificationHistoryWithVendorId(
            vendorId,
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
  }, [vendorId]);

  if (!vendorId) {
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

export default VendorNotificationsPage;
