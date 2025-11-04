'use client';

import { useEffect, useState } from 'react';

import CollaboratorGratitude from './components/collaborator/CollaboratorGratitude';
import GuestGratitude from './components/guest/GuestGratitude';
import VendorGratitude from './components/vendor/VendorGratitude';
import { useGratitudeCardManager } from '@/app/hooks/useGratitudeCardManager';
import { PageHeader, Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components';
import { Check } from 'lucide-react';

const steps = ['Guest Card', 'Collaborator Card', 'Vendor Card'] as const;
type Step = (typeof steps)[number];

export default function GratitudeCardFlow() {
  const [activeTab, setActiveTab] = useState<Step>('Guest Card');
  const [completed, setCompleted] = useState<Step[]>([]);

  const { handleFetchExistingCard, selectedWeddingId, guestCard, isLoading } =
    useGratitudeCardManager();

  // Fetch existing card
  useEffect(() => {
    if (selectedWeddingId) {
      handleFetchExistingCard(selectedWeddingId);
    }
  }, [handleFetchExistingCard, selectedWeddingId]);

  // Compute completed steps
  useEffect(() => {
    if (!guestCard) return;

    const newCompleted: Step[] = [];
    if (guestCard.signOffName && guestCard.guestCardMessage && guestCard.guestCardPhotoURL) {
      newCompleted.push('Guest Card');
    }
    if (guestCard.collaboratorCardMessage && guestCard.collaboratorCardPhotoURL) {
      newCompleted.push('Collaborator Card');
    }

    setCompleted(newCompleted);
    const firstIncomplete = steps.find((s) => !newCompleted.includes(s));
    setActiveTab(firstIncomplete ?? steps[steps.length - 1]);
  }, [guestCard]);

  const handleComplete = (tab: Step) => {
    setCompleted((prev) => [...new Set([...prev, tab])]);
    const nextStep = steps[steps.indexOf(tab) + 1];
    if (nextStep) setActiveTab(nextStep);
  };

  const handleRevert = (tab: Step) => {
    const currentIndex = steps.indexOf(tab);

    setCompleted((prev) => prev.filter((s) => steps.indexOf(s) < currentIndex - 1));
    setActiveTab(steps[currentIndex - 1] ?? steps[0]);
  };

  const isDisabled = (tab: Step) => {
    const index = steps.indexOf(tab);
    if (index === 0) return false;
    return !completed.includes(steps[index - 1]);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Loading your gratitude card...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground py-6">
      <div className="container mx-auto px-4 md:px-6">
        <PageHeader
          title="Gratitude Cards"
          description="Complete each step sequentially to create and finalize your gratitude cards"
        />

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Step)} className="mt-8">
          <TabsList className="bg-muted/50 rounded-lg p-1 grid w-full grid-cols-3 md:flex md:space-x-2 md:w-fit">
            {steps.map((step) => (
              <TabsTrigger
                key={step}
                value={step}
                disabled={isDisabled(step)}
                className={`relative px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium text-foreground transition-colors
                  data-[state=active]:bg-primary data-[state=active]:text-white
                  ${isDisabled(step) ? 'opacity-50 cursor-not-allowed' : ''}
                  ${completed.includes(step) ? 'border border-green-500 text-green-700' : ''}
                `}
              >
                {/* Step {idx + 1} */}
                {step}
                {completed.includes(step) && (
                  <Check className="w-4 h-4 ml-1 inline text-green-600" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="Guest Card">
            <GuestGratitude
              onComplete={() => handleComplete('Guest Card')}
              onDelete={() => handleRevert('Guest Card')}
            />
          </TabsContent>

          <TabsContent value="Collaborator Card">
            <CollaboratorGratitude
              onComplete={() => handleComplete('Collaborator Card')}
              onDelete={() => handleRevert('Collaborator Card')}
            />
          </TabsContent>

          <TabsContent value="Vendor Card">
            <VendorGratitude
              onComplete={() => handleComplete('Vendor Card')}
              onDelete={() => handleRevert('Vendor Card')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
