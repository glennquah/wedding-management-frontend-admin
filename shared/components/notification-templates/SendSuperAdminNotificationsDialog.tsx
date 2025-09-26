'use client';

import { useEffect, useState } from 'react';

import {
  AdminResponseDto,
  EmailTemplateResponseDto,
  SendBulkEmailDto,
  VendorResponseDto,
} from '@shared/api';
import { AdminsService } from '@shared/api/services/AdminsService';
import { EmailNotificationService } from '@shared/api/services/EmailNotificationService';
import { NotificationDetailsService } from '@shared/api/services/NotificationDetailsService';
import { VendorsService } from '@shared/api/services/VendorsService';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/ui/tabs';
import { Check, Mail, Shield, Store, Users } from 'lucide-react';
import { toast } from 'sonner';

interface SendSuperAdminNotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type UserType = 'admin' | 'vendor';
type CombinedUser = (AdminResponseDto | VendorResponseDto) & { userType: UserType };

export const SendSuperAdminNotificationsDialog = ({
  open,
  onOpenChange,
}: SendSuperAdminNotificationsDialogProps) => {
  const [admins, setAdmins] = useState<AdminResponseDto[]>([]);
  const [vendors, setVendors] = useState<VendorResponseDto[]>([]);
  const [templates, setTemplates] = useState<EmailTemplateResponseDto[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<{ id: number; userType: UserType }[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<UserType>('admin');
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchAdmins();
      fetchVendors();
      fetchTemplates();
    }
  }, [open]);

  const fetchAdmins = async () => {
    setIsLoadingAdmins(true);
    try {
      const response = await AdminsService.adminControllerGetAllAdmins();
      setAdmins(response);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      toast.error('Failed to load admins');
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  const fetchVendors = async () => {
    setIsLoadingVendors(true);
    try {
      const response = await VendorsService.vendorControllerGetAllVendors();
      setVendors(response);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setIsLoadingVendors(false);
    }
  };

  const fetchTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const response =
        await NotificationDetailsService.notificationDetailsControllerGetEmailTemplatesForSuperAdmin();
      setTemplates(response as EmailTemplateResponseDto[]);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleUserSelection = (userId: number, userType: UserType, checked: boolean) => {
    setSelectedUsers((prev) => {
      if (checked) {
        return [...prev, { id: userId, userType }];
      } else {
        return prev.filter((user) => !(user.id === userId && user.userType === userType));
      }
    });
  };

  const handleSelectAllUsers = (userType: UserType, checked: boolean) => {
    const currentUsers = userType === 'admin' ? admins : vendors;

    if (checked) {
      const newUsers = currentUsers.map((user) => ({ id: user.id, userType }));
      setSelectedUsers((prev) => [
        ...prev.filter((user) => user.userType !== userType),
        ...newUsers,
      ]);
    } else {
      setSelectedUsers((prev) => prev.filter((user) => user.userType !== userType));
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

      // Get selected user emails
      const selectedUserEmails: string[] = [];

      selectedUsers.forEach((selectedUser) => {
        if (selectedUser.userType === 'admin') {
          const admin = admins.find((a) => a.id === selectedUser.id);
          if (admin?.email) selectedUserEmails.push(admin.email);
        } else {
          const vendor = vendors.find((v) => v.id === selectedUser.id);
          if (vendor?.email) selectedUserEmails.push(vendor.email);
        }
      });

      // Prepare bulk email data
      const bulkEmailData: SendBulkEmailDto = {
        emails: selectedUserEmails,
        subject: template.subject,
        html: template.htmlContent,
        text: template.textContent || 'hi',
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

  const getCurrentUsers = () => (activeTab === 'admin' ? admins : vendors);
  const getCurrentSelectedUsers = () => selectedUsers.filter((user) => user.userType === activeTab);
  const isCurrentTabAllSelected = () => {
    const currentUsers = getCurrentUsers();
    const currentSelected = getCurrentSelectedUsers();
    return currentUsers.length > 0 && currentSelected.length === currentUsers.length;
  };
  const isCurrentTabIndeterminate = () => {
    const currentSelected = getCurrentSelectedUsers();
    return currentSelected.length > 0 && !isCurrentTabAllSelected();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Super Admin Notifications
          </DialogTitle>
          <DialogDescription>
            Select recipients (admins and vendors) and a template to send bulk email notifications.
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
              <Label className="text-base font-medium">Select Recipients *</Label>
              <div className="text-sm text-muted-foreground">
                {selectedUsers.length} total selected
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UserType)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admins ({admins.length})
                </TabsTrigger>
                <TabsTrigger value="vendor" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Vendors ({vendors.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="admin" className="space-y-4">
                {isLoadingAdmins ? (
                  <div className="text-sm text-muted-foreground">Loading admins...</div>
                ) : (
                  <div className="space-y-4">
                    {/* Select All Admins */}
                    <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                      <Checkbox
                        id="select-all-admins"
                        checked={isCurrentTabAllSelected()}
                        onCheckedChange={(checked) =>
                          handleSelectAllUsers('admin', checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="select-all-admins"
                        className="font-medium flex items-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        Select All Admins ({getCurrentSelectedUsers().length}/{admins.length})
                      </Label>
                    </div>

                    {/* Individual Admins */}
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {admins.map((admin) => (
                        <div
                          key={admin.id}
                          className="flex items-center space-x-2 p-2 hover:bg-muted/30 rounded-md"
                        >
                          <Checkbox
                            id={`admin-${admin.id}`}
                            checked={selectedUsers.some(
                              (user) => user.id === admin.id && user.userType === 'admin',
                            )}
                            onCheckedChange={(checked) =>
                              handleUserSelection(admin.id, 'admin', checked as boolean)
                            }
                          />
                          <Label htmlFor={`admin-${admin.id}`} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{admin.name}</div>
                                <div className="text-sm text-muted-foreground">{admin.email}</div>
                              </div>
                              {selectedUsers.some(
                                (user) => user.id === admin.id && user.userType === 'admin',
                              ) && <Check className="w-4 h-4 text-green-600" />}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="vendor" className="space-y-4">
                {isLoadingVendors ? (
                  <div className="text-sm text-muted-foreground">Loading vendors...</div>
                ) : (
                  <div className="space-y-4">
                    {/* Select All Vendors */}
                    <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                      <Checkbox
                        id="select-all-vendors"
                        checked={isCurrentTabAllSelected()}
                        onCheckedChange={(checked) =>
                          handleSelectAllUsers('vendor', checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="select-all-vendors"
                        className="font-medium flex items-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        Select All Vendors ({getCurrentSelectedUsers().length}/{vendors.length})
                      </Label>
                    </div>

                    {/* Individual Vendors */}
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {vendors.map((vendor) => (
                        <div
                          key={vendor.id}
                          className="flex items-center space-x-2 p-2 hover:bg-muted/30 rounded-md"
                        >
                          <Checkbox
                            id={`vendor-${vendor.id}`}
                            checked={selectedUsers.some(
                              (user) => user.id === vendor.id && user.userType === 'vendor',
                            )}
                            onCheckedChange={(checked) =>
                              handleUserSelection(vendor.id, 'vendor', checked as boolean)
                            }
                          />
                          <Label htmlFor={`vendor-${vendor.id}`} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{vendor.name}</div>
                                <div className="text-sm text-muted-foreground">{vendor.email}</div>
                              </div>
                              {selectedUsers.some(
                                (user) => user.id === vendor.id && user.userType === 'vendor',
                              ) && <Check className="w-4 h-4 text-green-600" />}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
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
              isLoadingAdmins ||
              isLoadingVendors ||
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
