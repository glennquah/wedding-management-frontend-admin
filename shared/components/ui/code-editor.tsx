'use client';

import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Button } from './button';
import { Copy, Check } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: 'html' | 'css' | 'javascript';
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  showHeader?: boolean;
  showCopyButton?: boolean;
  title?: string;
}

export const CodeEditor = ({
  value,
  onChange,
  language = 'html',
  placeholder = 'Enter your code here...',
  className,
  readOnly = false,
  showHeader = true,
  showCopyButton = true,
  title,
}: CodeEditorProps) => {
  const [copied, setCopied] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!readOnly) {
      onChange(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert two spaces for tab
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // Reset cursor position after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={cn('relative h-full flex flex-col border border-border rounded-lg overflow-hidden', className)}>
      {/* Header */}
      {showHeader && (
        <div className="bg-muted/50 border-b border-border flex items-center justify-between px-3 py-2 min-h-[40px]">
          <div className="flex items-center gap-2">
            {/* Traffic light dots */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>

            {/* Title or language */}
            <div className="text-sm text-muted-foreground font-medium">
              {title || `${language?.toUpperCase()} Editor`}
            </div>
          </div>

          {/* Copy button */}
          {showCopyButton && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-7 w-7 p-0"
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          readOnly={readOnly}
          spellCheck={false}
          className={cn(
            'w-full h-full p-4 font-mono text-sm bg-background resize-none outline-none border-0',
            'placeholder:text-muted-foreground text-foreground',
            'focus:outline-none focus:ring-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            readOnly && 'cursor-default bg-muted/30',
          )}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            lineHeight: '1.6',
            tabSize: 2,
          }}
        />

        {/* Copy button for no-header mode */}
        {!showHeader && showCopyButton && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="absolute top-2 right-2 h-7 w-7 p-0 bg-background/80 backdrop-blur-sm"
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};