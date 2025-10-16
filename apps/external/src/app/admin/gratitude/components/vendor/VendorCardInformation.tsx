'use client';

import { UpdateGratitudeCardDto } from '@shared/api';
import FormField from '@shared/components/FormField';
import FormFieldTextArea from '@shared/components/FormFieldTextArea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';

interface VendorCardInformationProps {
  vendorFormData: UpdateGratitudeCardDto;
  handleInputChange: (
    field: keyof UpdateGratitudeCardDto,
    value: UpdateGratitudeCardDto[keyof UpdateGratitudeCardDto],
  ) => void;
}

export function VendorCardInformation({
  vendorFormData,
  handleInputChange,
}: VendorCardInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Gratitude Card</CardTitle>
        <CardDescription>
          Provide the details that will appear on your thank-you e-card sent to your vendors.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Message */}
          <div className="col-span-1 md:col-span-2">
            <FormFieldTextArea
              label="Gratitude Message"
              id="vendorMessage"
              value={vendorFormData.vendorCardMessage || ''}
              onChange={(e) => handleInputChange('vendorCardMessage', e.target.value)}
              required
              placeholder="With love and thanks..."
            />
            <p className="text-sm text-gray-500 mt-1">
              This message will appear as the main text on your e-card.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2">
            <hr className="border-gray-300" />
          </div>

          {/* Sign Off */}
          <div className="mt-[-16px] col-span-1 md:col-span-2">
            <FormField
              label="Sign Off"
              id="signOff"
              type="text"
              value={vendorFormData.signOffName}
              onChange={(e) => handleInputChange('signOffName', e.target.value)}
              required
              placeholder="e.g., the Tangs"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
