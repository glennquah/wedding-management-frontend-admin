'use client';

import { useState } from 'react';
import { CreateEmailTemplateDto } from '@shared/api';
import { NotificationDetailsService } from '@shared/api/services/NotificationDetailsService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/form/input';
import { Label } from '@shared/components/ui/form/label';
import { Textarea } from '@shared/components/ui/textarea';
import { CodeEditor } from '@shared/components/ui/code-editor';
import { toast } from 'sonner';

interface AddNotificationTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weddingId: number;
  onTemplateCreated?: () => void;
}

export const AddNotificationTemplateDialog = ({
  open,
  onOpenChange,
  weddingId,
  onTemplateCreated,
}: AddNotificationTemplateDialogProps) => {
  const [formData, setFormData] = useState<CreateEmailTemplateDto>({
    name: '',
    subject: '',
    htmlContent: '',
    textContent: '',
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (field: keyof CreateEmailTemplateDto, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.subject.trim() || !formData.htmlContent.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    try {
      await NotificationDetailsService.notificationDetailsControllerCreateEmailTemplateInWedding(
        weddingId,
        formData
      );

      toast.success('Template created successfully');
      onTemplateCreated?.();
      onOpenChange(false);

      // Reset form
      setFormData({
        name: '',
        subject: '',
        htmlContent: '',
        textContent: '',
      });
    } catch (error) {
      console.error('Failed to create template:', error);
      toast.error('Failed to create template');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form
    setFormData({
      name: '',
      subject: '',
      htmlContent: '',
      textContent: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Email Template</DialogTitle>
          <DialogDescription>
            Create a new email template for your wedding notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name *</Label>
                <Input
                  id="templateName"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Wedding Invitation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateSubject">Email Subject *</Label>
                <Input
                  id="templateSubject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="e.g., You're Invited to Our Wedding!"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-2">
              <Label htmlFor="textContent">Plain Text Content (Optional)</Label>
              <Textarea
                id="textContent"
                value={formData.textContent || ''}
                onChange={(e) => handleInputChange('textContent', e.target.value)}
                placeholder="Plain text version of your email..."
                rows={3}
              />
            </div>

            {/* HTML Content */}
            <div className="space-y-2">
              <Label>HTML Content *</Label>
              <div className="h-80">
                <CodeEditor
                  value={formData.htmlContent}
                  onChange={(value) => handleInputChange('htmlContent', value)}
                  language="html"
                  placeholder="Enter your HTML email template..."
                  title="HTML Email Template"
                  showCopyButton={false}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={handleCancel} disabled={isCreating}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};