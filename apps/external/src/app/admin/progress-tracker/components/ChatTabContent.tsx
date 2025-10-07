'use client';

import { Bot } from 'lucide-react';
import { forwardRef } from 'react';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

interface ChatTabContentProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  loadingText?: string;
}

// Simple Markdown renderer for basic formatting
const renderMarkdown = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|•\s)/g);

  return parts.map((part, index) => {
    // Bold text **text**
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Italic text *text*
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    // Inline code `code`
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">
          {part.slice(1, -1)}
        </code>
      );
    }
    // Bullet points
    if (part === '• ') {
      return (
        <span key={index} className="text-brand-500 font-bold">
          •{' '}
        </span>
      );
    }

    return part;
  });
};

const ChatTabContent = forwardRef<HTMLDivElement, ChatTabContentProps>(
  ({ messages, isLoading = false, loadingText = 'Thinking...' }, ref) => {
    return (
      <div ref={ref} className="custom-scrollbar h-full overflow-y-auto pr-1">
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className="flex">
              {m.role === 'assistant' ? (
                <div className="mr-auto ml-0 max-w-[82%]">
                  <div className="mb-1 flex items-center gap-1 text-xs font-medium text-black/60">
                    <Bot className="text-brand-500 h-3.5 w-3.5" /> Wedding Planner Assistant
                  </div>
                  <div className="border-brand-500/20 rounded-2xl rounded-tl-sm border bg-white px-3 py-2 text-black">
                    <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {renderMarkdown(m.content)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mr-0 ml-auto max-w-[82%] text-right">
                  <div className="mb-1 text-xs font-medium text-black/60">You</div>
                  <div className="border-brand-500/20 bg-brand-50 rounded-2xl rounded-tr-sm border px-3 py-2 text-black">
                    <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {renderMarkdown(m.content)}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
          {isLoading && (
            <li className="flex">
              <div className="mr-auto ml-0 max-w-[82%]">
                <div className="mb-1 flex items-center gap-1 text-xs font-medium text-black/60">
                  <Bot className="text-brand-500 h-3.5 w-3.5" /> Wedding Planner Assistant
                </div>
                <div className="border-brand-500/20 rounded-2xl rounded-tl-sm border bg-white px-3 py-2 text-black">
                  <div className="flex items-center gap-2">
                    <div className="border-brand-500 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                    <span className="text-sm">{loadingText}</span>
                  </div>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    );
  },
);

ChatTabContent.displayName = 'ChatTabContent';

export default ChatTabContent;
