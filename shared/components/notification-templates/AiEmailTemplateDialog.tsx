'use client';

import { useState } from 'react';

import { GenerateAiEmailTemplateDto } from '@shared/api';
import { EmailNotificationService } from '@shared/api/services/EmailNotificationService';
import { Button } from '@shared/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import { Textarea } from '@shared/components/ui/textarea';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface AiEmailTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weddingId: number;
  onSuccess: (html: string, subject: string) => void;
}

export const AiEmailTemplateDialog = ({
  open,
  onOpenChange,
  weddingId,
  onSuccess,
}: AiEmailTemplateDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<GenerateAiEmailTemplateDto>({
    emailPurpose: '',
    audience: '',
    mainMessage: '',
    primaryColor: '',
    secondaryColor: '',
    tone: undefined,
    mapLocation: '',
    additionalContext: '',
  });

  const handleGenerate = async () => {
    if (!formData.emailPurpose.trim()) {
      toast.error('Email purpose is required');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await EmailNotificationService.emailNotificationControllerGetAiEmailTemplate(
        weddingId,
        formData,
      );

      toast.success('AI template generated successfully');
      onSuccess(response.html, response.subject);
      onOpenChange(false);

      // Reset form data
      setFormData({
        emailPurpose: '',
        audience: '',
        mainMessage: '',
        primaryColor: '',
        secondaryColor: '',
        tone: undefined,
        mapLocation: '',
        additionalContext: '',
      });
    } catch (error) {
      console.error('Failed to generate AI template:', error);
      toast.error('Failed to generate AI template');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate AI Email Template
          </DialogTitle>
          <DialogDescription>
            Provide details below to generate a custom email template using AI. The generated
            template will replace the current HTML content and subject.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Email Purpose - Required */}
          <div className="space-y-2">
            <Label htmlFor="emailPurpose">
              Email Purpose <span className="text-red-500">*</span>
            </Label>
            <Input
              id="emailPurpose"
              value={formData.emailPurpose}
              onChange={(e) => setFormData({ ...formData, emailPurpose: e.target.value })}
              placeholder="e.g., welcome email, event invitation, thank you note"
            />
          </div>

          {/* Audience */}
          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Input
              id="audience"
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              placeholder="e.g., Dear Close Ones, Dear Family and Friends, Dear Valued Guests"
            />
          </div>

          {/* Main Message */}
          <div className="space-y-2">
            <Label htmlFor="mainMessage">Main Content/Message</Label>
            <Textarea
              id="mainMessage"
              value={formData.mainMessage}
              onChange={(e) => setFormData({ ...formData, mainMessage: e.target.value })}
              placeholder="Enter the main content or message for the email"
              rows={3}
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  placeholder="#ff5a5f"
                  className="flex-1"
                />
                <input
                  type="color"
                  value={formData.primaryColor || '#ff5a5f'}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="h-9 w-16 rounded-md border border-input bg-transparent cursor-pointer"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  placeholder="#45292f"
                  className="flex-1"
                />
                <input
                  type="color"
                  value={formData.secondaryColor || '#45292f'}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="h-9 w-16 rounded-md border border-input bg-transparent cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select
              value={formData.tone}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  tone: value as GenerateAiEmailTemplateDto.tone,
                })
              }
            >
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select a tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Map Location */}
          <div className="space-y-2">
            <Label htmlFor="mapLocation">Map Location (Optional)</Label>
            <Input
              id="mapLocation"
              value={formData.mapLocation}
              onChange={(e) => setFormData({ ...formData, mapLocation: e.target.value })}
              placeholder="e.g., 123 Main St, City, State, Country"
            />
            <p className="text-xs text-muted-foreground">
              If provided, a "View On Map" button will be included in the email
            </p>
          </div>

          {/* Additional Context */}
          <div className="space-y-2">
            <Label htmlFor="additionalContext">Additional Context</Label>
            <Textarea
              id="additionalContext"
              value={formData.additionalContext}
              onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
              placeholder="Any special requirements or additional context for the email"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating || !formData.emailPurpose.trim()}>
            {isGenerating ? 'Generating...' : 'Generate Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
