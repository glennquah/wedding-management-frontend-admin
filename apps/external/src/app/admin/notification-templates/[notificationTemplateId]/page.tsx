'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EmailTemplateWithWeddingDto } from '@shared/api';
import { NotificationDetailsService } from '@shared/api/services/NotificationDetailsService';
import { NotificationTemplateDetailView, PageHeader } from '@shared/components';
import { Button } from '@shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NotificationTemplateDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const notificationTemplateId = params?.notificationTemplateId
    ? parseInt(params.notificationTemplateId as string)
    : NaN;

  const [template, setTemplate] = useState<EmailTemplateWithWeddingDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!notificationTemplateId || isNaN(notificationTemplateId)) {
        setError('Invalid template ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await NotificationDetailsService.notificationDetailsControllerGetEmailTemplateWithId(
          notificationTemplateId
        );
        setTemplate(response);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch template:', error);
        setError('Failed to load template details');
        setTemplate(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [notificationTemplateId]);

  const handleBackClick = () => {
    router.push('/admin/notification-templates');
  };

  if (error) {
    return (
      <div className="p-6">
        <PageHeader
          title="Template Not Found"
          description="The requested template could not be loaded"
        />
        <div className="mt-6 text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleBackClick} variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          onClick={handleBackClick}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Button>

        <PageHeader
          title={template?.name || 'Loading...'}
          description={template?.subject || 'Email template details'}
        />
      </div>

      <div className="mt-6">
        <NotificationTemplateDetailView
          template={template}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default NotificationTemplateDetailPage;