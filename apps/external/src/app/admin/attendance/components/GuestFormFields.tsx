import { ConfirmationStatus } from '@shared/api';
import { GroupSelectDropdown } from '@shared/components';
import FormField from '@shared/components/FormField';
import { SingleSelectDropdown } from '@shared/components/ui/form/singleSelectDropdown';
import React from 'react';
import { FORM_LABELS, FORM_PLACEHOLDERS } from '../constants';
import { AccompanyingGuestData, GuestFormData, CapacityInfo } from '../types';
import { AccompanyingGuestFields } from './AccompanyingGuestFields';

/**
 * Props for GuestFormFields component
 */
interface GuestFormFieldsProps {
  guest: GuestFormData;
  setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>;
  existingGroups: string[];
  capacityInfo: CapacityInfo;
  isEditMode?: boolean;
  addAccompanyingGuestField: (
    guest: GuestFormData,
    setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  ) => void;
  removeAccompanyingGuestField: (
    index: number,
    guest: GuestFormData,
    setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  ) => void;
  updateAccompanyingGuest: (
    index: number,
    field: keyof AccompanyingGuestData,
    value: string | ConfirmationStatus,
    guest: GuestFormData,
    setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  ) => void;
}

/**
 * Helper function to create form fields
 */
function createGuestFormFields(
  guest: GuestFormData,
  setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  existingGroups: string[],
  capacityInfo: CapacityInfo,
  isEditMode: boolean,
  addAccompanyingGuestField: (
    guest: GuestFormData,
    setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  ) => void,
  removeAccompanyingGuestField: (
    index: number,
    guest: GuestFormData,
    setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  ) => void,
  updateAccompanyingGuest: (
    index: number,
    field: keyof AccompanyingGuestData,
    value: string | ConfirmationStatus,
    guest: GuestFormData,
    setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  ) => void,
): React.JSX.Element[] {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuest({ ...guest, name: e.target.value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuest({ ...guest, email: e.target.value });
  };

  const handleAllergiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuest({ ...guest, allergies: e.target.value });
  };

  const handleGroupChange = (group: string) => {
    setGuest({ ...guest, group });
  };

  const handleConfirmationStatusChange = (selected: string) => {
    setGuest({
      ...guest,
      confirmationStatus: selected as ConfirmationStatus,
    });
  };

  const fields: React.JSX.Element[] = [
      <div key="name" className="md:col-span-2">
        <FormField
          label={FORM_LABELS.NAME}
          id="name"
          type="text"
          value={guest.name || ''}
          onChange={handleNameChange}
          required
          placeholder={FORM_PLACEHOLDERS.NAME}
        />
      </div>,

      <div key="group" className="md:col-span-2">
        <GroupSelectDropdown
          label={FORM_LABELS.GROUP}
          existingGroups={existingGroups}
          selected={guest.group || ''}
          setSelected={handleGroupChange}
          placeholder={FORM_PLACEHOLDERS.GROUP}
        />
      </div>,

      <div key="email" className="md:col-span-2">
        <FormField
          label={FORM_LABELS.EMAIL}
          id="email"
          type="email"
          value={guest.email || ''}
          onChange={handleEmailChange}
          required
          placeholder={FORM_PLACEHOLDERS.EMAIL}
        />
      </div>,
    ];

    // Add allergies and confirmation status fields only in edit mode
    if (isEditMode) {
      fields.push(
        <div key="allergies" className="md:col-span-2">
          <FormField
            label={FORM_LABELS.ALLERGIES}
            id="allergies"
            type="text"
            value={guest.allergies || ''}
            onChange={handleAllergiesChange}
            placeholder={FORM_PLACEHOLDERS.ALLERGIES}
          />
        </div>,

        <div key="confirmationStatus" className="md:col-span-2">
          <SingleSelectDropdown
            label={FORM_LABELS.CONFIRMATION_STATUS}
            options={Object.values(ConfirmationStatus)}
            selected={guest.confirmationStatus || ConfirmationStatus.PENDING}
            setSelected={handleConfirmationStatusChange}
            placeholder={FORM_PLACEHOLDERS.CONFIRMATION_STATUS}
          />
        </div>,
      );
    }

    // Add accompanying guests field
    fields.push(
      <AccompanyingGuestFields
        key="accompanyingGuests"
        guest={guest}
        setGuest={setGuest}
        capacityInfo={capacityInfo}
        isEditMode={isEditMode}
        addAccompanyingGuestField={addAccompanyingGuestField}
        removeAccompanyingGuestField={removeAccompanyingGuestField}
        updateAccompanyingGuest={updateAccompanyingGuest}
      />,
    );

  return fields;
}

/**
 * Component that renders form fields for adding/editing a guest
 * Returns an array of JSX elements to be used in FormDialog
 */
export const GuestFormFields = React.memo<GuestFormFieldsProps>(
  ({
    guest,
    setGuest,
    existingGroups,
    capacityInfo,
    isEditMode = false,
    addAccompanyingGuestField,
    removeAccompanyingGuestField,
    updateAccompanyingGuest,
  }) => {
    return createGuestFormFields(
      guest,
      setGuest,
      existingGroups,
      capacityInfo,
      isEditMode,
      addAccompanyingGuestField,
      removeAccompanyingGuestField,
      updateAccompanyingGuest,
    );
  },
);

GuestFormFields.displayName = 'GuestFormFields';

/**
 * Helper function to generate form fields for adding a guest
 */
export function useAddGuestFormFields(
  guest: GuestFormData,
  setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  existingGroups: string[],
  capacityInfo: CapacityInfo,
  addAccompanyingGuestField: (
    guest: GuestFormData,
    setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  ) => void,
  removeAccompanyingGuestField: (
    index: number,
    guest: GuestFormData,
    setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  ) => void,
  updateAccompanyingGuest: (
    index: number,
    field: keyof AccompanyingGuestData,
    value: string | ConfirmationStatus,
    guest: GuestFormData,
    setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  ) => void,
): React.JSX.Element[] {
  return React.useMemo(
    () =>
      createGuestFormFields(
        guest,
        setGuest,
        existingGroups,
        capacityInfo,
        false,
        addAccompanyingGuestField,
        removeAccompanyingGuestField,
        updateAccompanyingGuest,
      ),
    [
      guest,
      setGuest,
      existingGroups,
      capacityInfo,
      addAccompanyingGuestField,
      removeAccompanyingGuestField,
      updateAccompanyingGuest,
    ],
  );
}

/**
 * Helper function to generate form fields for editing a guest
 */
export function useEditGuestFormFields(
  guest: GuestFormData,
  setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  existingGroups: string[],
  capacityInfo: CapacityInfo,
  addAccompanyingGuestField: (
    guest: GuestFormData,
    setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  ) => void,
  removeAccompanyingGuestField: (
    index: number,
    guest: GuestFormData,
    setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  ) => void,
  updateAccompanyingGuest: (
    index: number,
    field: keyof AccompanyingGuestData,
    value: string | ConfirmationStatus,
    guest: GuestFormData,
    setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>,
  ) => void,
): React.JSX.Element[] {
  return React.useMemo(
    () =>
      createGuestFormFields(
        guest,
        setGuest,
        existingGroups,
        capacityInfo,
        true,
        addAccompanyingGuestField,
        removeAccompanyingGuestField,
        updateAccompanyingGuest,
      ),
    [
      guest,
      setGuest,
      existingGroups,
      capacityInfo,
      addAccompanyingGuestField,
      removeAccompanyingGuestField,
      updateAccompanyingGuest,
    ],
  );
}
