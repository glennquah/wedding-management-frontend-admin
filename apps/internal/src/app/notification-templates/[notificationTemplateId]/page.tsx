'use client';

import { useCallback, useEffect, useState } from 'react';

import { EmailTemplateWithWeddingDto } from '@shared/api';
import { NotificationDetailsService } from '@shared/api/services/NotificationDetailsService';
import { NotificationTemplateDetailView, PageHeader } from '@shared/components';
import { Button } from '@shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

const NotificationTemplateDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const notificationTemplateId = params?.notificationTemplateId
    ? parseInt(params.notificationTemplateId as string)
    : NaN;

  const [template, setTemplate] = useState<EmailTemplateWithWeddingDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplate = useCallback(async () => {
    if (!notificationTemplateId || isNaN(notificationTemplateId)) {
      setError('Invalid template ID');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response =
        await NotificationDetailsService.notificationDetailsControllerGetEmailTemplateWithId(
          notificationTemplateId,
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
  }, [notificationTemplateId]);

  useEffect(() => {
    fetchTemplate();
  }, [notificationTemplateId, fetchTemplate]);

  const handleBackClick = () => {
    router.push('/notification-templates');
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
      <div>
        <Button onClick={handleBackClick} variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Button>
      </div>

      <div>
        <NotificationTemplateDetailView
          template={template}
          isLoading={isLoading}
          weddingId={template?.notificationDetails?.wedding?.id}
          onTemplateUpdated={fetchTemplate}
          onTemplateDeleted={() => router.push('/notification-templates')}
        />
      </div>
    </div>
  );
};

export default NotificationTemplateDetailPage;
