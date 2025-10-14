'use client';

import { UpdateGratitudeCardDto } from '@shared/api';
import { ImageUploadWidget } from '@shared/components';
import FormField from '@shared/components/FormField';
import FormFieldTextArea from '@shared/components/FormFieldTextArea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { toast } from 'sonner';

interface CollaboratorCardInformationProps {
  collaboratorFormData: UpdateGratitudeCardDto;
  handleInputChange: (
    field: keyof UpdateGratitudeCardDto,
    value: UpdateGratitudeCardDto[keyof UpdateGratitudeCardDto],
  ) => void;
}

export function CollaboratorCardInformation({
  collaboratorFormData,
  handleInputChange,
}: CollaboratorCardInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaborator Gratitude Card</CardTitle>
        <CardDescription>
          Provide the details that will appear on your thank-you e-card sent to your collaborators.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Message */}
          <div className="col-span-1 md:col-span-2">
            <FormFieldTextArea
              label="Gratitude Message"
              id="collaboratorMessage"
              value={collaboratorFormData.collaboratorCardMessage || ''}
              onChange={(e) => handleInputChange('collaboratorCardMessage', e.target.value)}
              required
              placeholder="With love and thanks..."
            />
            <p className="text-sm text-gray-500 mt-1">
              This message will appear as the main text on your e-card.
            </p>
          </div>

          {/* Sign Off */}
          <div className="mt-[-16px] col-span-1 md:col-span-2">
            <FormField
              label="Sign Off"
              id="signOff"
              type="text"
              value={collaboratorFormData.signOffName}
              onChange={(e) => handleInputChange('signOffName', e.target.value)}
              required
              placeholder="e.g., the Tangs"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <hr className="border-gray-300" />
          </div>

          {/* Photo Upload */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Upload Photo</label>
            <p className="text-sm text-gray-500 mt-1">
              This photo will appear on the right side of your e-card design.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <ImageUploadWidget
                onUpload={async (url) => {
                  try {
                    handleInputChange('collaboratorCardPhotoURL', url);
                  } catch (err) {
                    toast.error('Failed to add photo');
                  }
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
