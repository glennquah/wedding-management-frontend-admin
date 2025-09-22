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
import { CreateAdminDto, UpdateAdminDto, WeddingResponseDto } from '@wedding/api-types';
import { Cog } from 'lucide-react';

interface AdminFormFieldsProps {
  admin: Partial<CreateAdminDto>;
  setAdmin: React.Dispatch<React.SetStateAction<Partial<CreateAdminDto>>>;
  handleGeneratePassword: () => void;
  weddings?: WeddingResponseDto[];
}

interface EditAdminFormFieldsProps {
  admin: Partial<UpdateAdminDto & { id?: number }>;
  setAdmin: React.Dispatch<React.SetStateAction<Partial<UpdateAdminDto & { id?: number }>>>;
  handleGeneratePassword: () => void;
}

export const getAdminFormFields = ({
  admin,
  setAdmin,
  handleGeneratePassword,
  weddings = [],
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
          placeholder="Enter password or use generate button"
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

  <div key="isCouple" className="md:col-span-1">
    <div className="flex items-center space-x-2">
      <Checkbox
        id="isCouple"
        checked={admin.isCouple || false}
        onCheckedChange={(checked: boolean) => setAdmin({ ...admin, isCouple: checked })}
      />
      <Label htmlFor="isCouple">Is this admin a couple?</Label>
    </div>
  </div>,

  <div key="weddingSelection" className="md:col-span-2">
    <Label htmlFor="weddingSelection">Select Wedding *</Label>
    <Select
      value={admin.weddingId?.toString() || ''}
      onValueChange={(value: string) => setAdmin({ ...admin, weddingId: parseInt(value) })}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a wedding to associate with this admin" />
      </SelectTrigger>
      <SelectContent>
        {weddings.map((wedding) => (
          <SelectItem key={wedding.id} value={wedding.id.toString()}>
            {wedding.name} - {new Date(wedding.date).toLocaleDateString()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>,
];

export const getEditAdminFormFields = ({ admin, setAdmin }: EditAdminFormFieldsProps) => [
  <div key="name" className="md:col-span-1">
    <FormField
      label="Name *"
      id="name"
      type="text"
      value={admin.name || ''}
      onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
      placeholder="Admin Name"
      required
    />
  </div>,

  <div key="email" className="md:col-span-1">
    <FormField
      label="Email *"
      id="email"
      type="email"
      value={admin.email || ''}
      onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
      placeholder="Email address"
      required
    />
  </div>,
];
