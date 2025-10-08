'use client';

import { CreateAlbumDto } from '@shared/api';
import FormField from '@shared/components/FormField';
import FormFieldTextArea from '@shared/components/FormFieldTextArea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';

interface InviteInformationProps {
  formData: CreateAlbumDto;
  handleInputChange: (
    field: keyof CreateAlbumDto,
    value: CreateAlbumDto[keyof CreateAlbumDto],
  ) => void;
}

export function InviteInformation({ formData, handleInputChange }: InviteInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Card Information</CardTitle>
        <CardDescription>
          Provide the details that will appear on your printed invite and album landing page.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Couple Name */}
          <div className="mt-[-16px] col-span-1 md:col-span-2">
            <FormField
              label="Couple Name"
              id="coupleName"
              type="text"
              value={formData.coupleName}
              onChange={(e) => handleInputChange('coupleName', e.target.value)}
              required
              placeholder="e.g., Ryan, Ranae"
            />
          </div>

          {/* Invite Card Message */}
          <div className="mt-[-16px] col-span-1 md:col-span-2">
            <FormFieldTextArea
              label="Invite Message"
              id="inviteMessage"
              value={formData.inviteCardMessage}
              onChange={(e) => handleInputChange('inviteCardMessage', e.target.value)}
              required
              placeholder="We'd love your help to remember our wedding..."
            />
            <p className="text-sm text-gray-500 mt-1">
              This message will appear on the printed invite card beneath your names.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2">
            <hr className="border-gray-300 my-6" />
          </div>

          {/* Landing Page Message */}
          <div className="mt-[-16px] col-span-1 md:col-span-2">
            <FormFieldTextArea
              label="Album Landing Message"
              id="landingMessage"
              value={formData.landingMessage}
              onChange={(e) => handleInputChange('landingMessage', e.target.value)}
              required
              placeholder="Welcome to our wedding album! Share your favourite moments with us..."
            />
            <p className="text-sm text-gray-500 mt-1">
              This message will appear on the microsite where guests upload their photos and videos.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
