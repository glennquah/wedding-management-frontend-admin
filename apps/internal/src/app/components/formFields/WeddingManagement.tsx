import React from 'react';

import FormField from '@shared/components/FormField';
import { Checkbox } from '@shared/components/ui/checkbox';
import { Label } from '@shared/components/ui/form/label';
import { SingleDatePicker } from '@shared/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import {
  BudgetBucket,
  CreateWeddingDto,
  GuestCountBucket,
  UpdateWeddingDto,
  WeddingService,
  WeddingStyle,
  WeddingType,
} from '@wedding/api-types';

interface WeddingFormFieldsProps {
  wedding: Partial<CreateWeddingDto>;
  setWedding: React.Dispatch<React.SetStateAction<Partial<CreateWeddingDto>>>;
}

interface EditWeddingFormFieldsProps {
  wedding: Partial<UpdateWeddingDto & { id?: number }>;
  setWedding: React.Dispatch<React.SetStateAction<Partial<UpdateWeddingDto & { id?: number }>>>;
}

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const getWeddingFormFields = ({ wedding, setWedding }: WeddingFormFieldsProps) => [
  <div key="name" className="md:col-span-1">
    <FormField
      label="Wedding Name *"
      id="name"
      type="text"
      value={wedding.name || ''}
      onChange={(e) => setWedding({ ...wedding, name: e.target.value })}
      required
      placeholder="Enter wedding name"
    />
  </div>,

  <div key="location" className="md:col-span-1">
    <FormField
      label="Location"
      id="location"
      type="text"
      value={wedding.location || ''}
      onChange={(e) => setWedding({ ...wedding, location: e.target.value })}
      placeholder="Enter wedding location"
    />
  </div>,

  <div key="date" className="md:col-span-1">
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor="date">Wedding Date</Label>
      <SingleDatePicker
        value={wedding.date || ''}
        onChange={(date) => setWedding({ ...wedding, date: date || '' })}
        placeholder="Select wedding date"
        minDate={new Date().toISOString().split('T')[0]}
      />
    </div>
  </div>,

  <div key="weddingType" className="md:col-span-1">
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor="weddingType">Wedding Type *</Label>
      <Select
        value={wedding.weddingType || ''}
        onValueChange={(value: WeddingType) => setWedding({ ...wedding, weddingType: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select wedding type" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(WeddingType).map((type) => (
            <SelectItem key={type} value={type}>
              {capitalizeFirst(type)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>,

  <div key="budgetBucket" className="md:col-span-1">
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor="budgetBucket">Budget Range *</Label>
      <Select
        value={wedding.budgetBucket || ''}
        onValueChange={(value: BudgetBucket) => setWedding({ ...wedding, budgetBucket: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select budget range" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(BudgetBucket).map((budget) => (
            <SelectItem key={budget} value={budget}>
              {capitalizeFirst(budget)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>,

  <div key="guestCountBucket" className="md:col-span-1">
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor="guestCountBucket">Guest Count *</Label>
      <Select
        value={wedding.guestCountBucket || ''}
        onValueChange={(value: GuestCountBucket) =>
          setWedding({ ...wedding, guestCountBucket: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select guest count range" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(GuestCountBucket).map((count) => (
            <SelectItem key={count} value={count}>
              {capitalizeFirst(count)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>,

  <div key="preferredStyle" className="md:col-span-1">
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor="preferredStyle">Preferred Style *</Label>
      <Select
        value={wedding.preferredStyle || ''}
        onValueChange={(value: WeddingStyle) => setWedding({ ...wedding, preferredStyle: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select preferred style" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(WeddingStyle).map((style) => (
            <SelectItem key={style} value={style}>
              {capitalizeFirst(style)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>,

  <div key="preferredServices" className="md:col-span-2">
    <div className="mt-4 gap-2 flex flex-col">
      <Label>Preferred Services *</Label>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {Object.values(WeddingService).map((service) => (
          <div key={service} className="flex items-center space-x-2">
            <Checkbox
              id={service}
              checked={wedding.preferredServices?.includes(service) || false}
              onCheckedChange={(checked: boolean) => {
                const currentServices = wedding.preferredServices || [];
                if (checked) {
                  setWedding({
                    ...wedding,
                    preferredServices: [...currentServices, service],
                  });
                } else {
                  setWedding({
                    ...wedding,
                    preferredServices: currentServices.filter((s) => s !== service),
                  });
                }
              }}
            />
            <Label htmlFor={service} className="text-sm">
              {capitalizeFirst(service)}
            </Label>
          </div>
        ))}
      </div>
    </div>
  </div>,
];

export const getEditWeddingFormFields = ({ wedding, setWedding }: EditWeddingFormFieldsProps) => [
  <div key="name" className="md:col-span-1">
    <FormField
      label="Wedding Name"
      id="name"
      type="text"
      value={wedding.name || ''}
      onChange={(e) => setWedding({ ...wedding, name: e.target.value })}
      placeholder="Enter wedding name"
      required
    />
  </div>,

  <div key="location" className="md:col-span-1">
    <FormField
      label="Location"
      id="location"
      type="text"
      value={wedding.location || ''}
      onChange={(e) => setWedding({ ...wedding, location: e.target.value })}
      placeholder="Enter wedding location"
    />
  </div>,

  <div key="date" className="md:col-span-1">
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor="date">Wedding Date</Label>
      <SingleDatePicker
        value={wedding.date || ''}
        onChange={(date) => setWedding({ ...wedding, date: date || '' })}
        placeholder="Select wedding date"
        minDate={new Date().toISOString().split('T')[0]}
      />
    </div>
  </div>,

  <div key="weddingType" className="md:col-span-1">
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor="weddingType">Wedding Type</Label>
      <Select
        value={wedding.weddingType || ''}
        onValueChange={(value: WeddingType) => setWedding({ ...wedding, weddingType: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select wedding type" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(WeddingType).map((type) => (
            <SelectItem key={type} value={type}>
              {capitalizeFirst(type)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>,

  <div key="budgetBucket" className="md:col-span-1">
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor="budgetBucket">Budget Range</Label>
      <Select
        value={wedding.budgetBucket || ''}
        onValueChange={(value: BudgetBucket) => setWedding({ ...wedding, budgetBucket: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select budget range" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(BudgetBucket).map((budget) => (
            <SelectItem key={budget} value={budget}>
              {capitalizeFirst(budget)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>,

  <div key="guestCountBucket" className="md:col-span-1">
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor="guestCountBucket">Guest Count</Label>
      <Select
        value={wedding.guestCountBucket || ''}
        onValueChange={(value: GuestCountBucket) =>
          setWedding({ ...wedding, guestCountBucket: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select guest count range" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(GuestCountBucket).map((count) => (
            <SelectItem key={count} value={count}>
              {capitalizeFirst(count)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>,

  <div key="preferredStyle" className="md:col-span-1">
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor="preferredStyle">Preferred Style</Label>
      <Select
        value={wedding.preferredStyle || ''}
        onValueChange={(value: WeddingStyle) => setWedding({ ...wedding, preferredStyle: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select preferred style" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(WeddingStyle).map((style) => (
            <SelectItem key={style} value={style}>
              {capitalizeFirst(style)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>,

  <div key="preferredServices" className="md:col-span-2">
    <Label>Preferred Services</Label>
    <div className="grid grid-cols-2 gap-2 mt-2">
      {Object.values(WeddingService).map((service) => (
        <div key={service} className="flex items-center space-x-2">
          <Checkbox
            id={service}
            checked={wedding.preferredServices?.includes(service) || false}
            onCheckedChange={(checked: boolean) => {
              const currentServices = wedding.preferredServices || [];
              if (checked) {
                setWedding({
                  ...wedding,
                  preferredServices: [...currentServices, service],
                });
              } else {
                setWedding({
                  ...wedding,
                  preferredServices: currentServices.filter((s) => s !== service),
                });
              }
            }}
          />
          <Label htmlFor={service} className="text-sm">
            {capitalizeFirst(service)}
          </Label>
        </div>
      ))}
    </div>
  </div>,
];
