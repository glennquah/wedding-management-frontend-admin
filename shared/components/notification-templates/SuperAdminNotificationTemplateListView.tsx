'use client';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { NotificationTemplateList } from './NotificationTemplateList';
import { EmailTemplateResponseDto } from '@shared/api';
import { NotificationDetailsService } from '@shared/api/services/NotificationDetailsService';

export interface NotificationTemplateListViewRef {
  refresh: () => void;
}

export const SuperAdminNotificationTemplateListView = forwardRef<
  NotificationTemplateListViewRef,
  {}
>((props, ref) => {
  const [templates, setTemplates] = useState<EmailTemplateResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      let response: EmailTemplateResponseDto[];

      response =
        await NotificationDetailsService.notificationDetailsControllerGetEmailTemplatesForSuperAdmin();

      setTemplates(response as EmailTemplateResponseDto[]);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Expose refresh function through ref
  useImperativeHandle(ref, () => ({
    refresh: fetchTemplates,
  }));

  return (
    <div className="space-y-4">
      <NotificationTemplateList templates={templates} isSuperAdmin={true} isLoading={isLoading} />
    </div>
  );
});

SuperAdminNotificationTemplateListView.displayName = 'SuperAdminNotificationTemplateListView';
