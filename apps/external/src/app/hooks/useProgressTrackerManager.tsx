'use client';

import { useState } from 'react';

import { useProgressTrackerStore } from '../store/progressTrackerStore';

export function useProgressTrackerManager() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    checklist,
    categoryIntro,
    messages,
    setChecklist,
    nextCategory,
    addMessage,
    stage,
    setStage,
  } = useProgressTrackerStore();

  const handleNextCategory = () => {
    nextCategory();
  };

  const handleChecklist = async (input: string) => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: crypto.randomUUID(), role: 'user' as const, content: text };
    addMessage(userMsg);

    try {
      setIsLoading(true);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'checklist',
          messages: [...messages, userMsg],
          checklist,
        }),
      });

      const data = await res.json();
      if (Array.isArray(data?.checklist) && data.checklist.length) {
        setChecklist(data.checklist);
        addMessage({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.message || 'I have updated your checklist based on your requirements.',
        });
        // Inform user that subsequent queries will be handled by the assistant
        addMessage({
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'Going forward, your follow-up queries will be answered by our Wedding Planner Assistant. If you wish to make further changes to your checklist, do use our edit function on the checklist table.',
        });
        if (stage === 'planning') {
          setStage('generated');
        }
      } else {
        addMessage({
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            "I could not update the checklist. Please provide more specific details about what you'd like to add.",
        });
      }
    } catch (error) {
      console.error('Error updating checklist:', error);
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeddingAssistant = async (input: string, context?: { wedding?: any }) => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: crypto.randomUUID(), role: 'user' as const, content: text };
    addMessage(userMsg);

    try {
      setIsLoading(true);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'assistant',
          messages: [...messages, userMsg],
          wedding: context?.wedding ?? null,
        }),
      });

      const data = await res.json();
      const reply = typeof data?.message === 'string' ? data.message : 'How can I help further?';
      addMessage({ id: crypto.randomUUID(), role: 'assistant', content: reply });
    } catch (error) {
      console.error('Assistant chat error:', error);
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I ran into an error while answering. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Loading states
    isLoading,

    // State
    categoryIntro,
    messages,

    // Handler functions
    handleNextCategory,
    handleChecklist,
    handleWeddingAssistant,
  };
}
