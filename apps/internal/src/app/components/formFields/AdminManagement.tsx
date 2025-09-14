import React from 'react';

import FormField from '@shared/components/FormField';
import { Button } from '@shared/components/ui/button';
import { Checkbox } from '@shared/components/ui/checkbox';
import { Input } from '@shared/components/ui/form/input';
import { Label } from '@shared/components/ui/form/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import {
  BudgetBucket,
  CreateAdminDto,
  GuestCountBucket,
  UpdateAdminDto,
  WeddingService,
  WeddingStyle,
  WeddingType,
} from '@wedding/api-types';
import { Cog } from 'lucide-react';

interface AdminFormFieldsProps {
  admin: Partial<CreateAdminDto & { id?: number }>;
  setAdmin: React.Dispatch<React.SetStateAction<Partial<CreateAdminDto & { id?: number }>>>;
  handleGeneratePassword: () => void;
  handleServiceToggle: (service: WeddingService) => void;
}

interface EditAdminFormFieldsProps {
  admin: Partial<UpdateAdminDto & { id?: number }>;
  setAdmin: React.Dispatch<React.SetStateAction<Partial<UpdateAdminDto & { id?: number }>>>;
  handleGeneratePassword: () => void;
  handleServiceToggle: (service: WeddingService) => void;
}

export const getAdminFormFields = ({
  admin,
  setAdmin,
  handleGeneratePassword,
  handleServiceToggle,
}: AdminFormFieldsProps) => [
  <div key="name" className="md:col-span-1">
    <FormField
      label="Name *"
      id="name"
      type="text"
      value={admin.name || ''}
      onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
      required
      placeholder="Admin Name"
    />
  </div>,

  <div key="email" className="md:col-span-1">
    <FormField
      label="Email *"
      id="email"
      type="email"
      value={admin.email || ''}
      onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
      required
      placeholder="Email address"
    />
  </div>,

  <div key="password" className="md:col-span-2">
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor="password">Password *</Label>
      <div className="relative w-full">
        <Input
          id="password"
          type="text"
          value={admin.password || ''}
          onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
          required
          placeholder="Generated password will appear here"
          readOnly
          className="w-full pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleGeneratePassword}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          title="Click to regenerate random password"
        >
          <Cog className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>,

  <div key="isCouple" className="md:col-span-2">
    <div className="flex items-center space-x-2">
      <Checkbox
        id="isCouple"
        checked={admin.isCouple || false}
        onCheckedChange={(checked: boolean) => setAdmin({ ...admin, isCouple: checked })}
      />
      <Label htmlFor="isCouple">Is this admin a couple?</Label>
    </div>
  </div>,

  <div key="weddingType" className="md:col-span-1">
    <Label htmlFor="weddingType">Wedding Type *</Label>
    <Select
      value={admin.weddingType || ''}
      onValueChange={(value: string) => setAdmin({ ...admin, weddingType: value as WeddingType })}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select wedding type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={WeddingType.CHINESE}>Chinese</SelectItem>
        <SelectItem value={WeddingType.MALAY}>Malay</SelectItem>
        <SelectItem value={WeddingType.INDIAN}>Indian</SelectItem>
        <SelectItem value={WeddingType.WESTERN}>Western</SelectItem>
        <SelectItem value={WeddingType.OTHERS}>Others</SelectItem>
      </SelectContent>
    </Select>
  </div>,

  <div key="budgetBucket" className="md:col-span-1">
    <Label htmlFor="budgetBucket">Budget Bucket *</Label>
    <Select
      value={admin.budgetBucket || ''}
      onValueChange={(value: string) => setAdmin({ ...admin, budgetBucket: value as BudgetBucket })}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select budget bucket" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={BudgetBucket.LOW}>Low</SelectItem>
        <SelectItem value={BudgetBucket.MEDIUM}>Medium</SelectItem>
        <SelectItem value={BudgetBucket.HIGH}>High</SelectItem>
        <SelectItem value={BudgetBucket.LUXURY}>Luxury</SelectItem>
      </SelectContent>
    </Select>
  </div>,

  <div key="guestCountBucket" className="md:col-span-1">
    <Label htmlFor="guestCountBucket">Guest Count Bucket *</Label>
    <Select
      value={admin.guestCountBucket || ''}
      onValueChange={(value: string) =>
        setAdmin({ ...admin, guestCountBucket: value as GuestCountBucket })
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select guest count" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={GuestCountBucket.SMALL}>Small</SelectItem>
        <SelectItem value={GuestCountBucket.MEDIUM}>Medium</SelectItem>
        <SelectItem value={GuestCountBucket.LARGE}>Large</SelectItem>
      </SelectContent>
    </Select>
  </div>,

  <div key="preferredStyle" className="md:col-span-1">
    <Label htmlFor="preferredStyle">Preferred Style *</Label>
    <Select
      value={admin.preferredStyle || ''}
      onValueChange={(value: string) =>
        setAdmin({ ...admin, preferredStyle: value as WeddingStyle })
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select preferred style" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={WeddingStyle.LUXURY}>Luxury</SelectItem>
        <SelectItem value={WeddingStyle.MODERN}>Modern</SelectItem>
        <SelectItem value={WeddingStyle.TRADITIONAL}>Traditional</SelectItem>
        <SelectItem value={WeddingStyle.RUSTIC}>Rustic</SelectItem>
      </SelectContent>
    </Select>
  </div>,

  <div key="preferredServices" className="md:col-span-2">
    <Label>Preferred Services *</Label>
    <div className="grid grid-cols-2 gap-2 mt-2">
      {Object.values(WeddingService).map((service) => (
        <div key={service} className="flex items-center space-x-2">
          <Checkbox
            id={`service-${service}`}
            checked={admin.preferredServices?.includes(service) || false}
            onCheckedChange={() => handleServiceToggle(service)}
          />
          <Label htmlFor={`service-${service}`} className="capitalize">
            {service.replace('_', ' ')}
          </Label>
        </div>
      ))}
    </div>
  </div>,
];

export const getEditAdminFormFields = ({
  admin,
  setAdmin,
  handleGeneratePassword,
  handleServiceToggle,
}: EditAdminFormFieldsProps) => [
  <div key="name" className="md:col-span-1">
    <FormField
      label="Name"
      id="name"
      type="text"
      value={admin.name || ''}
      onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
      placeholder="Admin Name"
    />
  </div>,

  <div key="email" className="md:col-span-1">
    <FormField
      label="Email"
      id="email"
      type="email"
      value={admin.email || ''}
      onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
      placeholder="Email address"
    />
  </div>,

  <div key="password" className="md:col-span-2">
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor="password">Password (leave empty to keep current)</Label>
      <div className="relative w-full">
        <Input
          id="password"
          type="text"
          value={admin.password || ''}
          onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
          placeholder="Leave empty to keep current password"
          className="w-full pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleGeneratePassword}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          title="Click to generate new password"
        >
          <Cog className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>,

  <div key="isCouple" className="md:col-span-2">
    <div className="flex items-center space-x-2">
      <Checkbox
        id="isCouple"
        checked={admin.isCouple || false}
        onCheckedChange={(checked: boolean) => setAdmin({ ...admin, isCouple: checked })}
      />
      <Label htmlFor="isCouple">Is this admin a couple?</Label>
    </div>
  </div>,

  <div key="weddingType" className="md:col-span-1">
    <Label htmlFor="weddingType">Wedding Type</Label>
    <Select
      value={admin.weddingType || ''}
      onValueChange={(value: string) =>
        setAdmin({ ...admin, weddingType: value as UpdateAdminDto.weddingType })
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select wedding type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="chinese">Chinese</SelectItem>
        <SelectItem value="malay">Malay</SelectItem>
        <SelectItem value="indian">Indian</SelectItem>
        <SelectItem value="western">Western</SelectItem>
        <SelectItem value="others">Others</SelectItem>
      </SelectContent>
    </Select>
  </div>,

  <div key="budgetBucket" className="md:col-span-1">
    <Label htmlFor="budgetBucket">Budget Bucket</Label>
    <Select
      value={admin.budgetBucket || ''}
      onValueChange={(value: string) =>
        setAdmin({ ...admin, budgetBucket: value as UpdateAdminDto.budgetBucket })
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select budget bucket" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="low">Low</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="high">High</SelectItem>
        <SelectItem value="luxury">Luxury</SelectItem>
      </SelectContent>
    </Select>
  </div>,

  <div key="guestCountBucket" className="md:col-span-1">
    <Label htmlFor="guestCountBucket">Guest Count Bucket</Label>
    <Select
      value={admin.guestCountBucket || ''}
      onValueChange={(value: string) =>
        setAdmin({ ...admin, guestCountBucket: value as UpdateAdminDto.guestCountBucket })
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select guest count" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="small">Small</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="large">Large</SelectItem>
      </SelectContent>
    </Select>
  </div>,

  <div key="preferredStyle" className="md:col-span-1">
    <Label htmlFor="preferredStyle">Preferred Style</Label>
    <Select
      value={admin.preferredStyle || ''}
      onValueChange={(value: string) =>
        setAdmin({ ...admin, preferredStyle: value as UpdateAdminDto.preferredStyle })
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select preferred style" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="luxury">Luxury</SelectItem>
        <SelectItem value="modern">Modern</SelectItem>
        <SelectItem value="traditional">Traditional</SelectItem>
        <SelectItem value="rustic">Rustic</SelectItem>
      </SelectContent>
    </Select>
  </div>,

  <div key="preferredServices" className="md:col-span-2">
    <Label>Preferred Services</Label>
    <div className="grid grid-cols-2 gap-2 mt-2">
      {Object.values(WeddingService).map((service) => (
        <div key={service} className="flex items-center space-x-2">
          <Checkbox
            id={`edit-service-${service}`}
            checked={
              admin.preferredServices?.includes(
                service as
                  | 'venue'
                  | 'catering'
                  | 'photography'
                  | 'decoration'
                  | 'music'
                  | 'attire'
                  | 'makeup'
                  | 'transportation',
              ) || false
            }
            onCheckedChange={() => handleServiceToggle(service)}
          />
          <Label htmlFor={`edit-service-${service}`} className="capitalize">
            {service.replace('_', ' ')}
          </Label>
        </div>
      ))}
    </div>
  </div>,
];
