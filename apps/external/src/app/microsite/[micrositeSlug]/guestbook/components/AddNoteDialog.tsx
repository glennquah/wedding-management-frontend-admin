'use client';

import React, { useState } from 'react';

import { Button } from '@shared/components';
import FormField from '@shared/components/FormField';
import FormFieldTextArea from '@shared/components/FormFieldTextArea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/components/ui/dialog';
import Image from 'next/image';

interface AddNoteDialogProps {
  onSubmit: (data: { guestName: string; guestNote: string }) => Promise<void>;
}

interface AddNoteFormProps extends AddNoteDialogProps {
  onClose: () => void;
}

export function AddNoteDialog({ onSubmit }: AddNoteDialogProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <button className="fixed bottom-10 right-10 z-10 cursor-pointer p-0 border-none bg-transparent">
          <Image
            src="https://res.cloudinary.com/dnyxxyolp/image/upload/v1760678608/fountain-pen_te6flc.png"
            alt="Add a Note"
            width={256}
            height={256}
            className="w-28 sm:w-40 h-auto transform hover:scale-105 transition-transform"
          />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Great Vibes', cursive" }} className="text-3xl">
            Leave a Note
          </DialogTitle>
          <DialogDescription>
            Share a memory or well wishes with the happy couple.
          </DialogDescription>
        </DialogHeader>
        {/* Pass the onSubmit and a function to close the dialog to the form */}
        <AddNoteForm onSubmit={onSubmit} onClose={() => setIsFormOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function AddNoteForm({ onSubmit, onClose }: AddNoteFormProps) {
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
