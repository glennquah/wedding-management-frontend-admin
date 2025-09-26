'use client';

import { CreateMicrositeDto } from '@shared/api';
import FormField from '@shared/components/FormField';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { SingleSelectDropdown } from '@shared/components/ui/form/singleSelectDropdown';

interface BasicInformationProps {
  formData: CreateMicrositeDto;
  handleInputChange: (
    field: keyof CreateMicrositeDto,
    value: CreateMicrositeDto[keyof CreateMicrositeDto]
  ) => void;
}

export function BasicInformation({ formData, handleInputChange }: BasicInformationProps) {
  // Template options for dropdown
  const templateOptions = ['Template 1 - Elegant', 'Template 2 - Rustic', 'Template 3 - Fun'];

  const handleTemplateSelection = (selectedTemplate: string) => {
    const templateNumber = parseInt(selectedTemplate.split(' ')[1]);
    handleInputChange('templateNumber', templateNumber);
  };

  const getSelectedTemplate = () => {
    return (
      templateOptions.find(
        (template) => parseInt(template.split(' ')[1]) === formData.templateNumber,
      ) || templateOptions[0]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Set up the core details for your microsite</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <SingleSelectDropdown
              label="Template"
              options={templateOptions}
              selected={getSelectedTemplate()}
              setSelected={handleTemplateSelection}
              placeholder="Select template"
            />
          </div>

          <div className="space-y-2 mt-[-16px]">
            <FormField
              label="URL Slug"
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('slug', e.target.value)
              }
              required={true}
              placeholder="e.g., smith-jones-wedding"
            />
            <p className="text-sm text-gray-500">
              This will be the URL: /microsite/{formData.slug || 'your-slug'}
            </p>
          </div>

          <div className="mt-[-16px]">
            <FormField
              label="Couple Name"
              id="coupleName"
              type="text"
              value={formData.coupleName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('coupleName', e.target.value)
              }
              required={true}
              placeholder="e.g., Alex & Jamie"
            />
          </div>

          <div className="mt-[-16px]">
            <FormField
              label="Access Password"
              id="password"
              type="password"
              value={formData.password ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('password', e.target.value)
              }
              required={true}
              placeholder="Password for guest access"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
