'use client';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { NotificationTemplateList } from './NotificationTemplateList';
import { EmailTemplateResponseDto } from '@shared/api';
import { NotificationDetailsService } from '@shared/api/services/NotificationDetailsService';

interface NotificationTemplateListViewProps {
  weddingId?: number;
  showAllTemplates?: boolean;
}

export interface NotificationTemplateListViewRef {
  refresh: () => void;
}

export const NotificationTemplateListView = forwardRef<
  NotificationTemplateListViewRef,
  NotificationTemplateListViewProps
>(({ weddingId, showAllTemplates = false }, ref) => {
  const [templates, setTemplates] = useState<EmailTemplateResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      let response: EmailTemplateResponseDto[];

      if (showAllTemplates) {
        response =
          await NotificationDetailsService.notificationDetailsControllerGetAllEmailTemplates();
      } else if (weddingId) {
        response =
          await NotificationDetailsService.notificationDetailsControllerGetEmailTemplatesForWedding(
            weddingId,
          );
      } else {
        setTemplates([]);
        setIsLoading(false);
        return;
      }

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
  }, [weddingId, showAllTemplates]);

  // Expose refresh function through ref
  useImperativeHandle(ref, () => ({
    refresh: fetchTemplates,
  }));

  if (!showAllTemplates && !weddingId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Please select a wedding to view notification templates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {showAllTemplates ? 'All available templates' : `Templates for wedding ${weddingId}`}
      </p>
      <NotificationTemplateList templates={templates} isLoading={isLoading} />
    </div>
  );
});

NotificationTemplateListView.displayName = 'NotificationTemplateListView';
