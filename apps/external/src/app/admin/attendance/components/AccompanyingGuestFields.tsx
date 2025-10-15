import { Button } from '@shared/components/ui/button';
import { ConfirmationStatus } from '@shared/api';
import FormField from '@shared/components/FormField';
import { SingleSelectDropdown } from '@shared/components/ui/form/singleSelectDropdown';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { BUTTON_LABELS, FORM_LABELS, FORM_PLACEHOLDERS, TOOLTIPS } from '../constants';
import { AccompanyingGuestData, GuestFormData, CapacityInfo } from '../types';

/**
 * Props for AccompanyingGuestFields component
 */
interface AccompanyingGuestFieldsProps {
  guest: GuestFormData;
  setGuest: React.Dispatch<React.SetStateAction<GuestFormData>>;
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
 * Component for managing accompanying guest fields in the guest form
 * Supports both add and edit modes
 */
export const AccompanyingGuestFields = React.memo<AccompanyingGuestFieldsProps>(
  ({
    guest,
    setGuest,
    capacityInfo,
    isEditMode = false,
    addAccompanyingGuestField,
    removeAccompanyingGuestField,
    updateAccompanyingGuest,
  }) => {
    const handleAddGuest = React.useCallback(() => {
      addAccompanyingGuestField(guest, setGuest);
    }, [guest, setGuest, addAccompanyingGuestField]);

    const handleRemoveGuest = React.useCallback(
      (index: number) => {
        removeAccompanyingGuestField(index, guest, setGuest);
      },
      [guest, setGuest, removeAccompanyingGuestField],
    );

    const handleUpdateField = React.useCallback(
      (index: number, field: keyof AccompanyingGuestData, value: string | ConfirmationStatus) => {
        updateAccompanyingGuest(index, field, value, guest, setGuest);
      },
      [guest, setGuest, updateAccompanyingGuest],
    );

    return (
      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-foreground">
            {FORM_LABELS.ACCOMPANYING_GUESTS}
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddGuest}
            className="text-brand-600 hover:text-brand-700"
            disabled={capacityInfo.isAtCapacity}
            title={
              capacityInfo.isAtCapacity
                ? TOOLTIPS.GUEST_LIMIT_REACHED
                : TOOLTIPS.ADD_ACCOMPANYING_GUEST
            }
          >
            <Plus className="w-4 h-4 mr-1" />
            {BUTTON_LABELS.ADD_ACCOMPANYING}
          </Button>
        </div>
        <div className="space-y-4">
          {guest.accompanyingGuests?.map((accompanyingGuest, index) => (
            <AccompanyingGuestFieldRow
              key={index}
              index={index}
              accompanyingGuest={accompanyingGuest}
              isEditMode={isEditMode}
              canRemove={(guest.accompanyingGuests?.length || 0) > 1}
              onRemove={handleRemoveGuest}
              onUpdateField={handleUpdateField}
            />
          ))}
        </div>
      </div>
    );
  },
);

AccompanyingGuestFields.displayName = 'AccompanyingGuestFields';

/**
 * Individual accompanying guest field row
 */
interface AccompanyingGuestFieldRowProps {
  index: number;
  accompanyingGuest: AccompanyingGuestData;
  isEditMode: boolean;
  canRemove: boolean;
  onRemove: (index: number) => void;
  onUpdateField: (
    index: number,
    field: keyof AccompanyingGuestData,
    value: string | ConfirmationStatus,
  ) => void;
}

const AccompanyingGuestFieldRow = React.memo<AccompanyingGuestFieldRowProps>(
  ({ index, accompanyingGuest, isEditMode, canRemove, onRemove, onUpdateField }) => {
    const handleNameChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateField(index, 'name', e.target.value);
      },
      [index, onUpdateField],
    );

    const handleAllergiesChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateField(index, 'allergies', e.target.value);
      },
      [index, onUpdateField],
    );

    const handleStatusChange = React.useCallback(
      (selected: string) => {
        onUpdateField(index, 'confirmationStatus', selected as ConfirmationStatus);
      },
      [index, onUpdateField],
    );

    const handleRemoveClick = React.useCallback(() => {
      onRemove(index);
    }, [index, onRemove]);

    if (isEditMode) {
      return (
        <div className="rounded-lg">
          <div className="flex items-center justify-end">
            {canRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveClick}
                className="text-red-600 hover:text-red-700 px-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <FormField
              label={FORM_LABELS.NAME}
              id={`accompanying-name-${index}`}
              type="text"
              value={accompanyingGuest.name}
              onChange={handleNameChange}
              placeholder={FORM_PLACEHOLDERS.ACCOMPANYING_NAME(index)}
            />
            <FormField
              label={FORM_LABELS.ALLERGIES}
              id={`accompanying-allergies-${index}`}
              type="text"
              value={accompanyingGuest.allergies || ''}
              onChange={handleAllergiesChange}
              placeholder={FORM_PLACEHOLDERS.ACCOMPANYING_ALLERGIES}
            />
            <SingleSelectDropdown
              label={FORM_LABELS.CONFIRMATION_STATUS}
              options={Object.values(ConfirmationStatus)}
              selected={accompanyingGuest.confirmationStatus || ConfirmationStatus.PENDING}
              setSelected={handleStatusChange}
              placeholder={FORM_PLACEHOLDERS.SELECT_STATUS}
              className="mt-4"
            />
          </div>
        </div>
      );
    }

    // Add mode - simplified view
    return (
      <div className="rounded-lg">
        <div className="flex items-end gap-1">
          <div className="flex-1">
            <FormField
              label={FORM_LABELS.NAME}
              id={`accompanying-name-${index}`}
              type="text"
              value={accompanyingGuest.name}
              onChange={handleNameChange}
              placeholder={FORM_PLACEHOLDERS.ACCOMPANYING_NAME(index)}
            />
          </div>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveClick}
              className="text-red-600 hover:text-red-700 px-2 mb-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  },
);

AccompanyingGuestFieldRow.displayName = 'AccompanyingGuestFieldRow';
