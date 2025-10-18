'use client';

import React, { useState } from 'react';

import { Button } from '@shared/components';
import FormField from '@shared/components/FormField';
import FormFieldTextArea from '@shared/components/FormFieldTextArea';

interface AddNoteFormProps {
  onSubmit: (data: { guestName: string; guestNote: string }) => Promise<void>;
  onClose: () => void;
}

export function AddNoteForm({ onSubmit, onClose }: AddNoteFormProps) {
  const [formData, setFormData] = useState({
    guestName: '',
    guestNote: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Your Name"
        id="guestName"
        type="text"
        value={formData.guestName}
        onChange={(e) => handleInputChange('guestName', e.target.value)}
        required={true}
        placeholder="e.g., Ryan Tang"
      />

      <FormFieldTextArea
        label="Your Message"
        id="guestNote"
        value={formData.guestNote}
        onChange={(e) => handleInputChange('guestNote', e.target.value)}
        required
        placeholder="Share a memory or well wishes..."
        rows={5}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding Note...' : 'Add My Note'}
        </Button>
      </div>
    </form>
  );
}
