'use client';

import { motion } from 'framer-motion';

// Text animation component
export function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {text}
    </motion.span>
  );
}

// Word by word animation
export function AnimatedWords({ text, startDelay = 0 }: { text: string; startDelay?: number }) {
  const words = text.split(' ');
  return (
    <span>
      {words.map((word, index) => (
        <span key={index}>
          <AnimatedText text={word} delay={startDelay + index * 0.1} />{' '}
        </span>
      ))}
    </span>
  );
}
