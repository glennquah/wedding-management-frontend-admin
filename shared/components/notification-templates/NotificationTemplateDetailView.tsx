'use client';

import { useState, useEffect } from 'react';
import { EmailTemplateWithWeddingDto } from '@shared/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Badge } from '@shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/ui/tabs';
import { Separator } from '@shared/components/ui/separator';

interface NotificationTemplateDetailViewProps {
  template: EmailTemplateWithWeddingDto | null;
  isLoading?: boolean;
}

export const NotificationTemplateDetailView = ({
  template,
  isLoading = false,
}: NotificationTemplateDetailViewProps) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    if (template) {
      setHtmlContent(template.htmlContent);
    }
  }, [template]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Select a template to view details</p>
          <p className="text-sm text-muted-foreground mt-2">
            Choose a template from the list to see its HTML content and preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-280px)] flex flex-col">
      {/* Content */}
      <div className="flex-1 flex">
        {/* Left side - HTML Editor */}
        <div className="w-1/2 border-r">
          <div className="p-4 border-b">
            <h3 className="font-medium">HTML Content</h3>
            <p className="text-sm text-muted-foreground">
              Raw HTML content of the email template
            </p>
          </div>
          <div className="p-4 h-[calc(100vh-350px)]">
            <div className="h-full">
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className="w-full h-full p-3 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="HTML content will appear here..."
                readOnly={false}
              />
            </div>
          </div>
        </div>

        {/* Right side - Preview */}
        <div className="w-1/2">
          <div className="p-4 border-b">
            <h3 className="font-medium">Email Preview</h3>
            <p className="text-sm text-muted-foreground">
              How the email will look when rendered
            </p>
          </div>
          <div className="p-4 h-[calc(100vh-350px)]">
            <div className="h-full border rounded-md bg-white overflow-auto">
              <div className="p-4">
                {/* Email Header */}
                <div className="mb-4 pb-4 border-b">
                  <div className="text-sm text-gray-600 mb-1">Subject:</div>
                  <div className="font-medium">{template.subject}</div>
                </div>

                {/* Email Content */}
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with actions */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Template ID: {template.id} | Created: {new Date(template.createdAt).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Edit Template
            </Button>
            <Button variant="secondary" size="sm">
              Duplicate
            </Button>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};