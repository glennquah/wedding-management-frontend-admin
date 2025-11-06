'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WeddingResponseDto } from '@shared/api';
import { TypingText } from '../TypingText';
import { DynamicWaveParticles } from '../DynamicWaveParticles';

interface AreYouReadySlideProps {
  wedding: WeddingResponseDto | undefined;
}

function AreYouReadySlideContent({ wedding }: AreYouReadySlideProps) {
  const coupleName =
    wedding?.mainCouple && wedding.mainCouple.length > 0
      ? `${wedding.mainCouple[0]?.name || 'Partner 1'} & ${wedding.mainCouple[1]?.name || (wedding.mainCouple[0]?.name ? 'Partner 2' : wedding?.name || '')}`
      : wedding?.name || 'Couple';

  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showCoupleName, setShowCoupleName] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);

  return (
    <div className="max-w-[90vw] space-y-10 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1.5, type: 'spring', bounce: 0.5 }}
      >
        <h1 className="mb-8 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-[180px] leading-tight font-black text-transparent">
          <TypingText
            text="ARE YOU READY?"
            delay={1500}
            speed={150}
            onComplete={() => setTimeout(() => setShowSubtitle(true), 800)}
          />
        </h1>
      </motion.div>

      {showSubtitle && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="font-semibold text-pink-300">
            <TypingText
              text="(Spoiler alert: It's going to be emotional 😭)"
              delay={300}
              speed={70}
              onComplete={() => setTimeout(() => setShowCoupleName(true), 1000)}
            />
          </h3>
        </motion.div>
      )}

      {showCoupleName && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h3 className="mb-6 text-[120px] leading-tight font-bold text-white">
            <TypingText
              text={`${coupleName}'s Wedding Wrapped`}
              delay={300}
              speed={100}
              onComplete={() => setTimeout(() => setShowEmojis(true), 800)}
            />
          </h3>
        </motion.div>
      )}

      {showEmojis && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.6 }}
          className="flex items-center justify-center space-x-8"
          onAnimationComplete={() => setTimeout(() => setShowWarning(true), 1000)}
        >
          <div className="animate-bounce text-7xl">🎉</div>
          <div className="animate-bounce text-7xl" style={{ animationDelay: '0.2s' }}>
            💍
          </div>
          <div className="animate-bounce text-7xl" style={{ animationDelay: '0.4s' }}>
            ❤️
          </div>
        </motion.div>
      )}

      {showWarning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border-2 border-yellow-400 bg-yellow-500/20 p-6 backdrop-blur-lg"
        >
          <h3 className="mb-3 text-8xl font-bold text-yellow-300">
            <TypingText text="⚠️ WARNING ⚠️" delay={200} speed={120} />
          </h3>
          <h3 className="text-6xl text-white/90">
            <TypingText
              text="Side effects may include: happy tears, uncontrollable smiling, and an overwhelming urge to renew your vows immediately"
              delay={1500}
              speed={50}
              onComplete={() => setTimeout(() => setShowFinalText(true), 1200)}
            />
          </h3>
        </motion.div>
      )}

      {showFinalText && (
        <motion.h3
          className="text-9xl font-semibold text-white/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <TypingText text="Let's relive the magic... ✨" delay={200} speed={90} />
        </motion.h3>
      )}
    </div>
  );
}

export function AreYouReadySlide({ wedding }: AreYouReadySlideProps) {
  return {
    background: DynamicWaveParticles,
    content: <AreYouReadySlideContent wedding={wedding} />,
  };
}
