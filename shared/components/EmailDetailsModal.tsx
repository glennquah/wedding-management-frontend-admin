'use client';

import { AllEmailNotificationHistoryResponseDto } from '../api/models/AllEmailNotificationHistoryResponseDto';
import { EmailNotificationHistoryResponseDto } from '../api/models/EmailNotificationHistoryResponseDto';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Separator } from './ui/separator';

type NotificationHistoryType =
  | EmailNotificationHistoryResponseDto
  | AllEmailNotificationHistoryResponseDto;

interface EmailDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: NotificationHistoryType | null;
}

const formatType = (
  type: EmailNotificationHistoryResponseDto.type | AllEmailNotificationHistoryResponseDto.type,
) => {
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const getTypeColor = (
  type: EmailNotificationHistoryResponseDto.type | AllEmailNotificationHistoryResponseDto.type,
) => {
  switch (type) {
    case 'PASSWORD_RESET':
      return 'destructive';
    case 'WELCOME':
      return 'default';
    case 'VERIFY_EMAIL':
      return 'secondary';
    case 'CREATE_ACCOUNT':
      return 'default';
    case 'CUSTOM':
      return 'outline';
    default:
      return 'secondary';
  }
};

export default function EmailDetailsModal({ open, onOpenChange, email }: EmailDetailsModalProps) {
  if (!email) return null;

  const sentAtDate = new Date(email.sentAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Email Details</span>
            <Badge variant={getTypeColor(email.type)} className="text-xs">
              {formatType(email.type)}
            </Badge>
          </DialogTitle>
          <DialogDescription>View complete email notification details</DialogDescription>
        </DialogHeader>

        <div className="flex-1 max-h-[60vh] overflow-y-auto pr-4">
          <div className="space-y-6">
            {/* Email Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Subject</h4>
                <p className="text-sm font-medium">{email.subject}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Sent At</h4>
                <p className="text-sm">
                  {sentAtDate.toLocaleDateString()} {sentAtDate.toLocaleTimeString()}
                </p>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Recipients</h4>
                <p className="text-sm break-all">{email.to.join(', ')}</p>
              </div>
              {/* Wedding/Vendor Information */}
              {('weddingName' in email || 'vendorName' in email) && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Related To</h4>
                  <div className="text-sm">
                    {'weddingName' in email && email.weddingName && (
                      <p>
                        <span className="font-medium">Wedding:</span> {email.weddingName}
                      </p>
                    )}
                    {'vendorName' in email && email.vendorName && (
                      <p>
                        <span className="font-medium">Vendor:</span> {email.vendorName}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Email Content */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Email Content</h4>
              <div className="border rounded-lg bg-white overflow-hidden">
                {/* Email Content in Isolated Iframe */}
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body {
                          margin: 0;
                          padding: 16px;
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                          background: white;
                          line-height: 1.6;
                        }
                      </style>
                    </head>
                    <body>
                      ${email.body}
                    </body>
                    </html>
                  `}
                  className="w-full border-0"
                  style={{ minHeight: '300px', height: '400px' }}
                  title="Email Content Preview"
                />
              </div>
            </div>

            {/* Raw HTML View */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Raw HTML</h4>
              <div className="border rounded-lg p-4 bg-muted/30">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-all">
                  {email.body}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
