'use client';

import { EmailTemplateResponseDto } from '@shared/api';
import { Badge } from '@shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { useRouter } from 'next/navigation';

interface NotificationTemplateListProps {
  templates: EmailTemplateResponseDto[];
  isLoading?: boolean;
}

export const NotificationTemplateList = ({
  templates,
  isLoading = false,
}: NotificationTemplateListProps) => {
  const router = useRouter();

  const handleTemplateClick = (template: EmailTemplateResponseDto) => {
    router.push(`/admin/notification-templates/${template.id}`);
  };
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No email templates found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="cursor-pointer transition-all hover:shadow-md"
          onClick={() => handleTemplateClick(template)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="font-medium">{template.subject}</CardDescription>
              </div>
              <Badge variant="secondary" className="ml-2">
                Template
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div
                className="text-sm text-muted-foreground line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: template.htmlContent.replace(/<[^>]+>/g, '').substring(0, 150) + '...',
                }}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(template.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
