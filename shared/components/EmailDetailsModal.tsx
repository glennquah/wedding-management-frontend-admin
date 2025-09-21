'use client';

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

interface EmailDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: EmailNotificationHistoryResponseDto | null;
}

const formatType = (type: EmailNotificationHistoryResponseDto.type) => {
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const getTypeColor = (type: EmailNotificationHistoryResponseDto.type) => {
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
            </div>

            <Separator />

            {/* Email Content */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Email Content</h4>
              <div className="border rounded-lg p-4 bg-muted/30">
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: email.body }}
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