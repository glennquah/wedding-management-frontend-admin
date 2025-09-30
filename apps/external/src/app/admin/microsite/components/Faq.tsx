'use client';

import { CreateMicrositeDto, FaqItemDto } from '@shared/api';
import FormField from '@shared/components/FormField';
import FormFieldTextArea from '@shared/components/FormFieldTextArea';
import { Button } from '@shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface FaqProps {
  formData: CreateMicrositeDto;
  handleFaqFieldChange: (index: number, field: keyof FaqItemDto, value: string) => void;
  addFaqItem: () => void;
  removeFaqItem: (index: number) => void;
}

export function Faq({ formData, handleFaqFieldChange, addFaqItem, removeFaqItem }: FaqProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>Add common questions and answers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {(formData.faqs ?? []).map((item, index) => (
          <div key={index} className="relative border border-gray-200 rounded-lg p-6 bg-white">
            {/* Delete button */}
            {(formData.faqs?.length ?? 0) > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFaqItem(index)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            <div className="space-y-4">
              {/* Question Input */}
              <div className="mt-[-16px]">
                <FormField
                  type="text"
                  label="Question"
                  id={`faq-question-${index}`}
                  value={item.q}
                  onChange={(e) => handleFaqFieldChange(index, 'q', e.target.value)}
                  placeholder="e.g., What is the dress code?"
                  required
                />
              </div>
              {/* Answer Input */}
              <FormFieldTextArea
                label="Answer"
                id={`faq-answer-${index}`}
                value={item.a}
                onChange={(e) => handleFaqFieldChange(index, 'a', e.target.value)}
                placeholder="e.g., Formal attire is appreciated."
                required
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="darkOutline"
          onClick={addFaqItem}
          className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ Item
        </Button>
      </CardContent>
    </Card>
  );
}
