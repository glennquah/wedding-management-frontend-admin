'use client';

import { useEffect, useState } from 'react';

import { useWeddingStore } from '../../apps/external/src/app/store/sessionStore';
import { EmailTemplateResponseDto, SendBulkEmailDto } from '@shared/api';
import { EmailNotificationService } from '@shared/api/services/EmailNotificationService';
import { NotificationDetailsService } from '@shared/api/services/NotificationDetailsService';
import { Button } from '@shared/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import { Label } from '@shared/components/ui/form/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

interface EmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  email: string;
}

export function EmailModal({ open, onOpenChange, name, email }: EmailModalProps) {
  const [templates, setTemplates] = useState<EmailTemplateResponseDto[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const weddingId = useWeddingStore((state) => state.selectedWeddingId);

  // Fetch templates when dialog opens
  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open, weddingId]);

  const fetchTemplates = async () => {
    if (weddingId == null) {
      setTemplates([]);
      return;
    }
    setIsLoadingTemplates(true);
    try {
      const response =
        await NotificationDetailsService.notificationDetailsControllerGetEmailTemplatesForWedding(
          weddingId,
        );
      setTemplates(response as EmailTemplateResponseDto[]);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate) {
      toast.error('Please select an email template');
      return;
    }

    setIsSending(true);
    try {
      // Get selected template details
      const template = templates.find((t) => t.id === selectedTemplate);
      if (!template) {
        toast.error('Selected template not found');
        return;
      }

      // Prepare bulk email data
      const bulkEmailData: SendBulkEmailDto = {
        emails: [email],
        subject: template.subject,
        html: template.htmlContent,
        text: template.textContent || '',
        weddingId: weddingId ?? undefined,
      };

      await EmailNotificationService.emailNotificationControllerSendBulkEmail(bulkEmailData);

      toast.success(`Email sent successfully to ${name}`);
      onOpenChange(false);

      // Reset form
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Failed to send email:', error);
      toast.error('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form
    setSelectedTemplate(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email
          </DialogTitle>
          <DialogDescription>Select an email template to send to the recipient.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-1">Recipient:</p>
            <p className="text-sm text-muted-foreground">
              {name} ({email})
            </p>
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select Email Template *</Label>
            {isLoadingTemplates ? (
              <div className="text-sm text-muted-foreground">Loading templates...</div>
            ) : (
              <Select
                value={selectedTemplate?.toString() || ''}
                onValueChange={(value) => setSelectedTemplate(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an email template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name} - {template.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Template Preview */}
          {selectedTemplate && templates.find((t) => t.id === selectedTemplate) && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground">Subject:</label>
                <div className="mt-1 p-3 bg-muted/30 rounded-md text-sm text-foreground">
                  {templates.find((t) => t.id === selectedTemplate)?.subject}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Preview:</label>
                <div
                  className="mt-1 p-3 bg-muted/30 rounded-md text-sm text-foreground max-h-64 overflow-y-auto"
                  dangerouslySetInnerHTML={{
                    __html: templates.find((t) => t.id === selectedTemplate)?.htmlContent || '',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={handleCancel} disabled={isSending}>
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={isSending || !selectedTemplate || isLoadingTemplates}
          >
            {isSending ? (
              'Sending...'
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
