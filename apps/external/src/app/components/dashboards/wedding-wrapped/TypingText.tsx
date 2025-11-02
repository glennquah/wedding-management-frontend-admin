'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypingTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypingText({ text, delay = 0, speed = 50, className = '', onComplete }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started || currentIndex >= text.length) {
      if (started && currentIndex >= text.length && onComplete) {
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, started, speed, onComplete]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
    >
      {displayedText}
      {started && currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </motion.span>
  );
}

interface SequentialTypingProps {
  lines: Array<{
    text: string;
    className?: string;
    delay?: number;
    speed?: number;
  }>;
  className?: string;
}

export function SequentialTyping({ lines, className = '' }: SequentialTypingProps) {
  const [completedLines, setCompletedLines] = useState<number[]>([]);

  const handleLineComplete = (index: number) => {
    setCompletedLines((prev) => [...prev, index]);
  };

  return (
    <div className={className}>
      {lines.map((line, index) => {
        const shouldStart = index === 0 || completedLines.includes(index - 1);
        const cumulativeDelay = lines.slice(0, index).reduce((acc, l) => acc + (l.delay || 0), 0);

        return (
          <div key={index}>
            {shouldStart && (
              <TypingText
                text={line.text}
                className={line.className}
                speed={line.speed || 50}
                delay={cumulativeDelay}
                onComplete={() => handleLineComplete(index)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
