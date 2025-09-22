'use client';

import React from 'react';
import { cn } from '../lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: 'html' | 'css' | 'javascript';
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export const CodeEditor = ({
  value,
  onChange,
  language = 'html',
  placeholder = 'Enter your code here...',
  className,
  readOnly = false,
}: CodeEditorProps) => {
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

  return (
    <div className={cn('relative h-full', className)}>
      <textarea
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        readOnly={readOnly}
        spellCheck={false}
        className={cn(
          'w-full h-full p-3 font-mono text-sm bg-background border border-input rounded-md resize-none outline-none',
          'placeholder:text-muted-foreground text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          readOnly && 'cursor-default bg-muted',
          className
        )}
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          lineHeight: '1.5',
          tabSize: 2,
        }}
      />

      {/* Show language indicator */}
      {language && (
        <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
          {language.toUpperCase()}
        </div>
      )}
    </div>
  );
};