'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@shared/components/ui/accordion';

export type FaqItem = { q: string; a: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
      {items.map((f, idx) => (
        <AccordionItem
          key={idx}
          value={`item-${idx + 1}`}
          className="border-b border-gray-200 dark:border-gray-700"
        >
          <AccordionTrigger className="no-underline text-lg">{f.q}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-gray-700 dark:text-gray-300">{f.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
