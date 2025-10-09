'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useProgressTrackerManager } from '../../../hooks/useProgressTrackerManager';
import {
  useProgressTrackerStore,
  createEmptyProgressTrackerData,
} from '../../../store/progressTrackerStore';
import { useWeddingStore } from '../../../store/sessionStore';
import ChatTabContent from './ChatTabContent';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@shared/components/ui/card';
import { Input } from '@shared/components/ui/form/input';
import { Bot, MessageCircle, Send, X, ArrowRight, Wand } from 'lucide-react';

type ChatProps = { selectedWedding?: any | null };

export default function Chat({ selectedWedding }: ChatProps) {
  const { selectedWeddingId } = useWeddingStore();

  // Get wedding-specific data
  const progressData = useProgressTrackerStore((s) =>
    typeof selectedWeddingId === 'number'
      ? (s.drafts[selectedWeddingId]?.data ?? createEmptyProgressTrackerData(selectedWeddingId))
      : createEmptyProgressTrackerData(0),
  );

  const [open, setOpen] = useState(progressData.stage !== 'generated');
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const { isLoading, handleNextCategory, handleChecklist, handleWeddingAssistant } =
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

  const showNextButton =
    progressData.stage === 'introduction' &&
    progressData.categoryIntro &&
    !progressData.categoryIntro.isIntroductionComplete;
  const showPlanningButton =
    progressData.stage === 'planning' &&
    progressData.categoryIntro &&
    progressData.categoryIntro.isIntroductionComplete;
  const showSendButton = progressData.stage === 'generated';

  // Debug logging
  console.log('Debug - Stage:', progressData.stage);
  console.log('Debug - CategoryIntro:', progressData.categoryIntro);
  console.log('Debug - Show Next Button:', showNextButton);
  console.log('Debug - Show Send Button:', showSendButton);

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
        <div className="w-[1000px] max-w-[92vw]">
          <Card className="border-primary/30 flex h-[80vh] flex-col border-2 bg-white shadow-xl">
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
                    {progressData.stage === 'introduction'
                      ? 'Learning about your wedding checklist'
                      : 'Here to customize your wedding planning'}
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
                  progressData.stage === 'introduction'
                    ? 'Preparing next category...'
                    : progressData.stage === 'planning'
                      ? 'Updating your checklist...'
                      : 'Let me think...'
                }
              />
            </CardContent>

            <CardFooter className="flex-shrink-0 px-4 pt-0 pb-4">
              {showNextButton && (
                <div className="flex w-full justify-center">
                  <Button
                    onClick={handleNextCategory}
                    disabled={isLoading}
                    className="bg-brand-500 hover:bg-brand-700 text-white"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Next Category
                  </Button>
                </div>
              )}

              {showPlanningButton && (
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
