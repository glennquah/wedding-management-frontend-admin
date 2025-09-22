'use client';

import { useState } from 'react';

import { CreateEmailTemplateDto } from '@shared/api';
import { NotificationDetailsService } from '@shared/api/services/NotificationDetailsService';
import { Button } from '@shared/components/ui/button';
import { CodeEditor } from '@shared/components/ui/code-editor';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import { Input } from '@shared/components/ui/form/input';
import { Label } from '@shared/components/ui/form/label';
import { Textarea } from '@shared/components/ui/textarea';
import { FileTextIcon } from 'lucide-react';
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

  const skeletonTemplate = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Your Knotly Password</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
            sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8f9fa;
        }

        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header {
          background: linear-gradient(135deg, #ff5a5f 0%, #45292f 100%);
          padding: 40px 20px;
          text-align: center;
        }

        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #ffffff !important;
          text-decoration: none;
          letter-spacing: 1px;
          display: block;
          text-align: center;
          margin: 0 auto;
        }

        .logo-img {
          width: 150px;
          height: 50px;
          object-fit: contain;
          display: block;
          margin: 0 auto;
        }

        .tagline {
          color: #ffffff;
          font-size: 14px;
          margin-top: 8px;
          opacity: 0.9;
        }

        .content {
          padding: 40px 30px;
        }

        .greeting {
          font-size: 24px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .message {
          font-size: 16px;
          line-height: 1.7;
          color: #555;
          margin-bottom: 30px;
        }

        .cta-container {
          text-align: center;
          margin: 40px 0;
        }

        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #ff5a5f 0%, #da3c41 100%) !important;
          color: #ffffff !important;
          text-decoration: none !important;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: transform 0.2s ease;
          box-shadow: 0 4px 15px rgba(255, 90, 95, 0.3);
          border: none !important;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 90, 95, 0.4);
        }

        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e0e0e0, transparent);
          margin: 30px 0;
        }

        .footer {
          background-color: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e9ecef;
        }

        .footer-logo {
          font-size: 18px;
          font-weight: bold;
          color: #ff5a5f;
          margin-bottom: 10px;
        }

        .footer-text {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 15px;
        }

        .social-links {
          margin: 20px 0;
        }

        .social-link {
          display: inline-block;
          margin: 0 10px;
          color: #ff5a5f;
          text-decoration: none;
          font-size: 14px;
        }

        .unsubscribe {
          font-size: 12px;
          color: #adb5bd;
          margin-top: 20px;
        }

        .unsubscribe a {
          color: #ff5a5f;
          text-decoration: none;
        }

        @media (max-width: 600px) {
          .email-container {
            margin: 0;
            border-radius: 0;
          }

          .content {
            padding: 30px 20px;
          }

          .header {
            padding: 30px 20px;
          }

          .greeting {
            font-size: 20px;
          }

          .cta-button {
            padding: 14px 28px;
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <div style="text-align: center">
            <img
              src="https://res.cloudinary.com/doudbsnya/image/upload/v1758432610/logo_ptrwb6.png"
              alt="Knotly Logo"
              class="logo-img"
            />
          </div>
          <div class="tagline">Your Perfect Wedding, Perfectly Planned</div>
        </div>

        <!-- Main Content -->
        <div class="content">
          <div class="greeting">Hello {{name}}!</div>

          <div class="message">
            <!-- Main Content Text -->
            Enter Main Text Here
          </div>

          <div class="cta-container">
            <!-- Main Content Button -->
            <a href="{{buttonUrl}}" class="cta-button">Enter Button Text</a>
          </div>

          <div class="divider"></div>

          <div class="message">
            <!-- Additional Content Text -->
            Enter Additional Text Here
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <a href="https://knotly.app" class="logo">
            <img
              src="https://res.cloudinary.com/doudbsnya/image/upload/v1758432610/logo_ptrwb6.png"
              alt="Knotly Logo"
              class="logo-img"
            />
          </a>
          <div class="footer-text">Making your dream wedding a reality, one detail at a time.</div>

          <div class="social-links">
            <a href="https://knotly.app" class="social-link">Website</a>
            <a href="https://knotly.app/support" class="social-link">Support</a>
            <a href="mailto:hello@knotly.app" class="social-link">Contact</a>
          </div>
        </div>
      </div>
    </body>
  </html>`;

  const handleInputChange = (field: keyof CreateEmailTemplateDto, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const loadSkeletonTemplate = () => {
    setFormData((prev) => ({
      ...prev,
      htmlContent: skeletonTemplate,
      name: prev.name || 'Wedding Notification Template',
      subject: prev.subject || "You're Invited to Our Wedding!",
    }));
    toast.success('Skeleton template loaded!');
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
        formData,
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

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 py-4 p-1">
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
          <Button
            variant="secondary"
            onClick={loadSkeletonTemplate}
            className="flex items-center gap-2"
          >
            <FileTextIcon className="w-4 h-4" />
            Use Skeleton Template
          </Button>
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
