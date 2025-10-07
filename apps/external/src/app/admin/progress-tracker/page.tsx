'use client';

import { useEffect, useState } from 'react';
import { useWeddingStore } from '../../store/sessionStore';
import { useProgressTrackerStore } from '../../store/progressTrackerStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/ui/tabs';
import { PageHeader } from '@shared/components/ui/page-header';
import Chat from './components/chat';
import TimelineOverview from './components/TimelineOverview';
import ChecklistTable from './components/ChecklistTable';
import { WeddingResponseDto } from '@shared/api';
import { useSidebar } from '@shared/components/ui/sidebar';

export default function Home() {
  const { selectedWeddingId, weddings } = useWeddingStore();
  const { checklist, stage } = useProgressTrackerStore();
  const [selectedWedding, setSelectedWedding] = useState<WeddingResponseDto | null>(null);
  const { setOpen, setOpenMobile, isMobile } = useSidebar();

  useEffect(() => {
    if (selectedWeddingId && weddings.length > 0) {
      const wedding = weddings.find((w) => w.id === selectedWeddingId);
      setSelectedWedding(wedding || null);
    }
  }, [selectedWeddingId, weddings]);

  // Close sidebar by default when landing on this page
  useEffect(() => {
    setOpen(false);
  }, []);

  const getHeaderDescription = () => {
    if (!selectedWedding) {
      return 'Track your wedding planning progress and manage your checklist.';
    }

    const description = `Planning for ${selectedWedding.name}`;
    if (selectedWedding.date) {
      return `${description} • Wedding Date: ${new Date(selectedWedding.date).toLocaleDateString()}`;
    }
    return description;
  };

  return (
    <main className="to-brand-100 text-foreground flex min-h-screen w-full flex-col bg-gradient-to-b from-white px-4 py-8">
      <PageHeader title="Wedding Planning Progress Tracker" description={getHeaderDescription()} />

      <Tabs defaultValue="timeline" className="flex w-full flex-1 flex-col overflow-hidden">
        <TabsList className="grid w-full flex-shrink-0 grid-cols-2">
          <TabsTrigger value="timeline">Timeline Overview</TabsTrigger>
          <TabsTrigger value="checklist">Checklist Table</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6 flex-1 overflow-x-hidden overflow-y-hidden">
          {stage === 'generated' ? (
            <TimelineOverview checklist={checklist} selectedWedding={selectedWedding} />
          ) : (
            <div className="text-sm text-gray-600">
              Start a conversation to generate your personalized plan. The timeline will appear here
              once ready.
            </div>
          )}
        </TabsContent>

        <TabsContent value="checklist" className="mt-6 flex-1 overflow-auto">
          {stage === 'generated' ? (
            <ChecklistTable checklist={checklist} />
          ) : (
            <div className="text-sm text-gray-600">
              Your checklist will show after your first request is processed.
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Chat selectedWedding={selectedWedding} />
    </main>
  );
}
