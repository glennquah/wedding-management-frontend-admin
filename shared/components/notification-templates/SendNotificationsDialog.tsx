'use client';

import { useEffect, useState } from 'react';

import { EmailTemplateResponseDto, GuestResponseDto, GuestsService, SendBulkEmailDto } from '@shared/api';
import { EmailNotificationService } from '@shared/api/services/EmailNotificationService';
import { NotificationDetailsService } from '@shared/api/services/NotificationDetailsService';
import { Button } from '@shared/components/ui/button';
import { Checkbox } from '@shared/components/ui/checkbox';
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
import { Check, Mail, Users } from 'lucide-react';
import { toast } from 'sonner';

interface SendNotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weddingId: number;
}

export const SendNotificationsDialog = ({
  open,
  onOpenChange,
  weddingId,
}: SendNotificationsDialogProps) => {
  const [users, setUsers] = useState<GuestResponseDto[]>([]);
  const [templates, setTemplates] = useState<EmailTemplateResponseDto[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Fetch users and templates when dialog opens
  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchTemplates();
    }
  }, [open, weddingId]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await GuestsService.guestControllerGetGuestsByWedding(weddingId);
      setUsers(response);
    } catch (error) {
      console.error('Failed to fetch guests:', error);
      toast.error('Failed to load guests');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchTemplates = async () => {
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

  const handleUserSelection = (userId: number, checked: boolean) => {
    setSelectedUsers((prev) => {
      if (checked) {
        return [...prev, userId];
      } else {
        return prev.filter((id) => id !== userId);
      }
    });
  };

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSendNotifications = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

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

      // Get selected guest emails
      const selectedUserEmails = users
        .filter((user) => selectedUsers.includes(user.id))
        .map((user) => user.email);

      // Prepare bulk email data
      const bulkEmailData: SendBulkEmailDto = {
        emails: selectedUserEmails,
        subject: template.subject,
        html: template.htmlContent,
        text: template.textContent || '',
        weddingId: weddingId,
      };

      await EmailNotificationService.emailNotificationControllerSendBulkEmail(bulkEmailData);

      toast.success(`Email sent successfully to ${selectedUsers.length} recipient(s)`);
      onOpenChange(false);

      // Reset form
      setSelectedUsers([]);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Failed to send notifications:', error);
      toast.error('Failed to send notifications');
    } finally {
      setIsSending(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form
    setSelectedUsers([]);
    setSelectedTemplate(null);
  };

  const isAllSelected = users.length > 0 && selectedUsers.length === users.length;
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < users.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Notifications
          </DialogTitle>
          <DialogDescription>
            Select recipients and a template to send bulk email notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
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

          {/* User Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Select Wedding Guests *</Label>
              <div className="text-sm text-muted-foreground">
                {selectedUsers.length} of {users.length} selected
              </div>
            </div>

            {isLoadingUsers ? (
              <div className="text-sm text-muted-foreground">Loading guests...</div>
            ) : (
              <div className="space-y-4">
                {/* Select All */}
                <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                  <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAllUsers}
                  />
                  <Label htmlFor="select-all" className="font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Select All Guests ({users.length})
                  </Label>
                </div>

                {/* Individual Guests */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 p-2 hover:bg-muted/30 rounded-md"
                    >
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) =>
                          handleUserSelection(user.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                          {selectedUsers.includes(user.id) && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={handleCancel} disabled={isSending}>
            Cancel
          </Button>
          <Button
            onClick={handleSendNotifications}
            disabled={
              isSending ||
              selectedUsers.length === 0 ||
              !selectedTemplate ||
              isLoadingUsers ||
              isLoadingTemplates
            }
          >
            {isSending ? 'Sending...' : `Send to ${selectedUsers.length} recipient(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
