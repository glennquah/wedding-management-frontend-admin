'use client';

import { useState, useEffect } from 'react';
import { EmailTemplateResponseDto } from '@shared/api';
import { NotificationDetailsService } from '@shared/api/services/NotificationDetailsService';
import { NotificationTemplateList } from './NotificationTemplateList';

interface NotificationTemplateListViewProps {
  weddingId?: number;
  showAllTemplates?: boolean;
}

export const NotificationTemplateListView = ({
  weddingId,
  showAllTemplates = false,
}: NotificationTemplateListViewProps) => {
  const [templates, setTemplates] = useState<EmailTemplateResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        let response: EmailTemplateResponseDto[];

        if (showAllTemplates) {
          response = await NotificationDetailsService.notificationDetailsControllerGetAllEmailTemplates();
        } else if (weddingId) {
          response = await NotificationDetailsService.notificationDetailsControllerGetEmailTemplatesForWedding(weddingId);
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

    fetchTemplates();
  }, [weddingId, showAllTemplates]);

  if (!showAllTemplates && !weddingId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please select a wedding to view notification templates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Email Templates</h3>
        <p className="text-sm text-muted-foreground">
          {showAllTemplates ? 'All available templates' : `Templates for wedding ${weddingId}`}
        </p>
      </div>
      <NotificationTemplateList
        templates={templates}
        isLoading={isLoading}
      />
    </div>
  );
};