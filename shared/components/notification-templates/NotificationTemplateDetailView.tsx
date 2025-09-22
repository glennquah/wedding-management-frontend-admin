'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EmailTemplateWithWeddingDto, UpdateEmailTemplateDto } from '@shared/api';
import { NotificationDetailsService } from '@shared/api/services/NotificationDetailsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Badge } from '@shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/ui/tabs';
import { Separator } from '@shared/components/ui/separator';
import { Input } from '@shared/components/ui/form/input';
import { Label } from '@shared/components/ui/form/label';
import { DeleteConfirmationModal } from '@shared/components/ui/delete-confirmation-modal';
import { CodeEditor } from '@shared/components/ui/code-editor';
import { toast } from 'sonner';

interface NotificationTemplateDetailViewProps {
  template: EmailTemplateWithWeddingDto | null;
  isLoading?: boolean;
  onTemplateUpdated?: () => void;
  onTemplateDeleted?: () => void;
}

export const NotificationTemplateDetailView = ({
  template,
  isLoading = false,
  onTemplateUpdated,
  onTemplateDeleted,
}: NotificationTemplateDetailViewProps) => {
  const router = useRouter();
  const [htmlContent, setHtmlContent] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [textContent, setTextContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (template) {
      setHtmlContent(template.htmlContent);
      setTemplateName(template.name);
      setTemplateSubject(template.subject);
      setTextContent(template.textContent || '');
    }
  }, [template]);

  const handleSave = async () => {
    if (!template) return;

    setIsSaving(true);
    try {
      const updateData: any = {};

      // Only include fields that have changed
      if (templateName !== template.name) updateData.name = templateName;
      if (templateSubject !== template.subject) updateData.subject = templateSubject;
      if (htmlContent !== template.htmlContent) updateData.htmlContent = htmlContent;
      if (textContent !== (template.textContent || '')) updateData.textContent = textContent;

      await NotificationDetailsService.notificationDetailsControllerUpdateEmailTemplateInWedding(
        template.id,
        updateData
      );

      toast.success('Template updated successfully');
      setIsEditing(false);
      onTemplateUpdated?.();
    } catch (error) {
      console.error('Failed to update template:', error);
      toast.error('Failed to update template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!template) return;

    setIsDeleting(true);
    try {
      await NotificationDetailsService.notificationDetailsControllerDeleteEmailTemplate(template.id);
      toast.success('Template deleted successfully');
      setShowDeleteModal(false);
      onTemplateDeleted?.();
      router.push('/admin/notification-templates');
    } catch (error) {
      console.error('Failed to delete template:', error);
      toast.error('Failed to delete template');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (template) {
      setHtmlContent(template.htmlContent);
      setTemplateName(template.name);
      setTemplateSubject(template.subject);
      setTextContent(template.textContent || '');
    }
    setIsEditing(false);
  };

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
      {/* Header with editable fields */}
      <div className="border-b p-6">
        <div className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <Label htmlFor="templateSubject">Email Subject</Label>
                  <Input
                    id="templateSubject"
                    value={templateSubject}
                    onChange={(e) => setTemplateSubject(e.target.value)}
                    placeholder="Enter email subject"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {template?.notificationDetails?.wedding?.name || 'Template'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Updated: {template ? new Date(template.updatedAt).toLocaleDateString() : ''}
                </span>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">{template?.name}</h2>
                <p className="text-muted-foreground">{template?.subject}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">
                    {template?.notificationDetails?.wedding?.name || 'Template'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Updated: {template ? new Date(template.updatedAt).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  Edit Template
                </Button>
                <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

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
            <CodeEditor
              value={htmlContent}
              onChange={setHtmlContent}
              language="html"
              placeholder="HTML content will appear here..."
              readOnly={!isEditing}
            />
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

      {/* Footer with template info */}
      <div className="border-t p-4">
        <div className="text-sm text-muted-foreground">
          Template ID: {template.id} | Created: {new Date(template.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
        title="Delete Email Template"
        itemName={template?.name || 'this template'}
        description={`Are you sure you want to delete "${template?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};