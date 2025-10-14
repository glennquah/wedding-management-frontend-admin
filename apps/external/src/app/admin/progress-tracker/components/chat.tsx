'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@shared/components/ui/card';
import { Input } from '@shared/components/ui/form/input';
import { ArrowRight, Bot, MessageCircle, Send, Wand, X } from 'lucide-react';
import { useProgressTrackerManager } from '../../../hooks/useProgressTrackerManager';
import {
  createEmptyProgressTrackerData,
  useProgressTrackerStore,
  ChatbotStage,
} from '../../../store/progressTrackerStore';
import { useWeddingStore } from '../../../store/sessionStore';
import ChatTabContent from './ChatTabContent';

type ChatProps = {
  selectedWedding?: any | null;
  currentStage: ChatbotStage;
  firstPurchaseMade: boolean;
  onNextCategory: () => void;
};

export default function Chat({
  selectedWedding,
  currentStage,
  firstPurchaseMade,
  onNextCategory,
}: ChatProps) {
  const { selectedWeddingId } = useWeddingStore();

  // Get wedding-specific data
  const progressData = useProgressTrackerStore((s) =>
    typeof selectedWeddingId === 'number'
      ? (s.drafts[selectedWeddingId]?.data ?? createEmptyProgressTrackerData(selectedWeddingId))
      : createEmptyProgressTrackerData(0),
  );

  const [open, setOpen] = useState(currentStage !== 'CHECKLIST_GENERATED');
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const { isLoading, handleChecklist, handleWeddingAssistant } =
    useProgressTrackerManager(selectedWeddingId);

  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  // Auto-scroll to bottom on message change
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [progressData.messages]);

  // Button logic based on current stage
  const showNextButton =
    currentStage !== 'CHECKLIST_GENERATED' && currentStage !== 'ADDITIONAL_DETAILS';
  const showGenerateButton = currentStage === 'ADDITIONAL_DETAILS';
  const showSendButton = currentStage === 'CHECKLIST_GENERATED';

  // Check if we're transitioning from INITIAL_PLANNING to CREATING_THE_FOUNDATION and disable button if no first purchase
  const shouldDisableNextButton = currentStage === 'INITIAL_PLANNING' && !firstPurchaseMade;

  // Get button label
  const getButtonLabel = () => {
    if (currentStage === 'ADDITIONAL_DETAILS') {
      return 'Generate Checklist';
    }
    return 'Next Category';
  };

  // Debug logging
  console.log('Debug - Current Stage:', currentStage);
  console.log('Debug - Show Next Button:', showNextButton);
  console.log('Debug - Show Generate Button:', showGenerateButton);
  console.log('Debug - Show Send Button:', showSendButton);
  console.log('Debug - First Purchase Made:', firstPurchaseMade);
  console.log('Debug - Should Disable Next Button:', shouldDisableNextButton);

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {/* Toggle Button (shown when closed) */}
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="bg-brand-500 hover:bg-brand-700 h-12 w-12 rounded-full p-0 text-white shadow-lg"
          aria-label="Open chat"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      )}

      {open && (
        <div className="w-[800px] max-w-[80vw]">
          <Card className="border-primary/30 flex h-[60vh] flex-col border-2 bg-white shadow-xl">
            <CardHeader className="flex flex-shrink-0 flex-row items-center justify-between space-y-0 rounded-t-xl border-b border-gray-300 bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="bg-brand-500 inline-flex h-8 w-8 items-center justify-center rounded-full text-white">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-black dark:text-white">
                    Wedding Planner Assistant
                  </span>
                  <span className="text-xs text-black/60 dark:text-white/60">
                    {currentStage === 'CHECKLIST_GENERATED'
                      ? 'Here to help with your wedding planning'
                      : 'Guiding you through your wedding checklist'}
                  </span>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-black/70 hover:text-black dark:text-white/70"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden px-4 py-3">
              <ChatTabContent
                ref={viewportRef}
                messages={progressData.messages}
                isLoading={isLoading}
                loadingText={
                  currentStage === 'ADDITIONAL_DETAILS'
                    ? 'Generating your personalized checklist...'
                    : currentStage === 'CHECKLIST_GENERATED'
                      ? 'Let me think...'
                      : 'Preparing next category...'
                }
              />
            </CardContent>

            <CardFooter className="flex-shrink-0 px-4 pt-0 pb-4">
              {showNextButton && (
                <div className="flex w-full flex-col items-center gap-2">
                  <Button
                    onClick={onNextCategory}
                    disabled={isLoading || shouldDisableNextButton}
                    className="bg-brand-500 hover:bg-brand-700 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    title={
                      shouldDisableNextButton
                        ? 'Make your first purchase to unlock Creating the Foundation stage'
                        : undefined
                    }
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    {getButtonLabel()}
                  </Button>
                  {shouldDisableNextButton && (
                    <p className="text-center text-xs text-gray-500">
                      Complete your first purchase to continue to the next stage
                    </p>
                  )}
                </div>
              )}

              {showGenerateButton && (
                <form
                  className="flex w-full items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const text = input.trim();
                    if (!text) return;
                    setInput('');
                    handleChecklist(text);
                  }}
                >
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Tell me about your specific wedding needs..."
                    className="bg-white text-black dark:bg-black dark:text-white"
                    aria-label="Chat message"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={!canSend}
                    className="bg-brand-500 hover:bg-brand-700 text-white"
                  >
                    <Wand className="mr-2 h-4 w-4" />
                    Generate Checklist
                  </Button>
                </form>
              )}

              {showSendButton && (
                <form
                  className="flex w-full items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const text = input.trim();
                    if (!text) return;
                    setInput('');
                    handleWeddingAssistant(text, { wedding: selectedWedding ?? undefined });
                  }}
                >
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask me anything about your wedding..."
                    className="bg-white text-black dark:bg-black dark:text-white"
                    aria-label="Chat message"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={!canSend}
                    className="bg-brand-500 hover:bg-brand-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
