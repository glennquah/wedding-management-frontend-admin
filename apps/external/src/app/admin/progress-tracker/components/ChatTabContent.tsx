'use client';

import { Bot } from 'lucide-react';
import { forwardRef } from 'react';
import { parseAndRenderText } from '../../../utils/linkParser';

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

// Enhanced Markdown renderer with link support
const renderMarkdown = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|•\s)/g);

  return parts.map((part, index) => {
    // Bold text **text**
    if (part.startsWith('**') && part.endsWith('**')) {
      const innerText = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold">
          {parseAndRenderText(innerText, 'text-blue-600 hover:text-blue-800 underline')}
        </strong>
      );
    }
    // Italic text *text*
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      const innerText = part.slice(1, -1);
      return (
        <em key={index} className="italic">
          {parseAndRenderText(innerText, 'text-blue-600 hover:text-blue-800 underline')}
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

    // Regular text - parse for links
    return (
      <span key={index}>
        {parseAndRenderText(part, 'text-blue-600 hover:text-blue-800 underline')}
      </span>
    );
  });
};

const ChatTabContent = forwardRef<HTMLDivElement, ChatTabContentProps>(
  ({ messages, isLoading = false, loadingText = 'Thinking...' }, ref) => {
    // Safety check: ensure messages is always an array
    const safeMessages = messages || [];

    return (
      <div ref={ref} className="custom-scrollbar h-full overflow-y-auto pr-1">
        <ul className="space-y-3">
          {safeMessages.map((m) => (
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
