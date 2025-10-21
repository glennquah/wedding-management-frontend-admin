/**
 * Constants for the attendance page
 */

export const ATTENDANCE_PAGE_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  EMAIL_TRUNCATE_LENGTH: 12,
} as const;

export const ATTENDANCE_MESSAGES = {
  TITLE: 'Attendance',
  DESCRIPTION_WITH_CAPACITY: (current: number, limit: number) =>
    `Manage your wedding guests attendance (${current}/${limit} guests)\nOnly confirmed guests will be in the list.`,
  DESCRIPTION_WITHOUT_CAPACITY:
    'Manage your wedding guests attendance\nOnly confirmed guests will be in the list.',
  LOADING: 'Loading guests...',
  EMPTY_MESSAGE: 'No confirmed guests yet.',
  EMPTY_DESCRIPTION: 'Guests will appear here once they confirm their attendance.',
  DELETE_CONFIRMATION: (name: string, accompanyingCount: number) =>
    `Are you sure you want to delete ${name}?${
      accompanyingCount > 0
        ? ` This will also delete ${accompanyingCount} accompanying guest${accompanyingCount === 1 ? '' : 's'}.`
        : ''
    } This action cannot be undone.`,
  APPLY_CHANGES_CONFIRMATION: (count: number) =>
    `Are you sure you want to mark attendance for ${count} guest${count === 1 ? '' : 's'}?`,
} as const;

export const DIALOG_TITLES = {
  ADD_GUEST: 'Add New Guest',
  EDIT_GUEST: 'Edit Guest',
  ACCOMPANYING_ATTENDANCE: 'Mark Accompanying Guest Attendance',
} as const;

export const BUTTON_LABELS = {
  ADD_GUEST: 'Add Guest',
  UPDATE_GUEST: 'Update Guest',
  APPLY_CHANGES: (count: number) => `Apply Changes (${count})`,
  APPLYING: 'Applying...',
  CONFIRM: 'Confirm',
  CANCEL: 'Cancel',
  ADD_ACCOMPANYING: 'Add Guest',
} as const;

export const FORM_LABELS = {
  NAME: 'Name *',
  GROUP: 'Group *',
  EMAIL: 'Email *',
  ALLERGIES: 'Dietary Requirements',
  CONFIRMATION_STATUS: 'Confirmation Status',
  ACCOMPANYING_GUESTS: 'Accompanying Guests',
} as const;

export const FORM_PLACEHOLDERS = {
  NAME: 'Guest Name',
  EMAIL: 'Guest email address',
  GROUP: 'Select or add group',
  ALLERGIES: 'Vegetarian, Gluten-Free, etc.',
  CONFIRMATION_STATUS: 'Select confirmation status',
  ACCOMPANYING_NAME: (index: number) => `Guest ${index + 1} name`,
  ACCOMPANYING_ALLERGIES: 'Dietary requirements',
  SELECT_STATUS: 'Select status',
  SEARCH_NAME: 'Search by name...',
} as const;

export const TOOLTIPS = {
  GUEST_LIMIT_REACHED: 'Guest limit reached',
  ADD_ACCOMPANYING_GUEST: 'Add accompanying guest',
} as const;

export const STAT_LABELS = {
  TOTAL_CONFIRMED: 'Total Confirmed Guests',
  PRESENT: 'Present (Marked)',
  NOT_PRESENT: 'Not Present (Unmarked)',
} as const;

export const ACCOMPANYING_DIALOG_MESSAGES = {
  DESCRIPTION:
    'Mark the attendance for accompanying guests. Click the checkbox to toggle attendance status.',
  NO_GUESTS: 'No accompanying guests found.',
} as const;
