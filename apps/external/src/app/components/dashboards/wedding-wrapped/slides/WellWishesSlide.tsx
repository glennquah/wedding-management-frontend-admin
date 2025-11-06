'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeddingWrappedResponseDto } from '@shared/api';
import { TypingText } from '../TypingText';
import { FloatingHearts } from '../ParticleEffects';

interface WellWishesSlideProps {
  emotionalTouchInsights: WeddingWrappedResponseDto['emotionalTouchInsights'];
}

function WellWishesSlideContent({ emotionalTouchInsights }: WellWishesSlideProps) {
  const [showTitle, setShowTitle] = useState(false);
  const [visibleWishes, setVisibleWishes] = useState<number[]>([]);

  const { wellWishes, totalWellWishes } = emotionalTouchInsights;

  useEffect(() => {
    // Start showing title
    const titleTimeout = setTimeout(() => setShowTitle(true), 500);
    return () => clearTimeout(titleTimeout);
  }, []);

  useEffect(() => {
    if (!showTitle || wellWishes.length === 0) return;

    let currentIndex = 0;
    const delay = 800; // Consistent speed throughout

    const showNextWish = () => {
      if (currentIndex < wellWishes.length) {
        setVisibleWishes((prev) => [...prev, currentIndex]);
        currentIndex++;
        setTimeout(showNextWish, delay);
      }
    };

    // Start showing wishes after title appears
    const startTimeout = setTimeout(showNextWish, 2000);

    return () => clearTimeout(startTimeout);
  }, [showTitle, wellWishes]);

  if (wellWishes.length === 0) {
    return (
      <div className="w-full max-w-[90vw] space-y-10 text-center">
        <motion.h2
          className="text-[120px] leading-tight font-bold text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <TypingText text="Messages of Love 💕" speed={80} />
        </motion.h2>
        <motion.h3
          className="text-8xl text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <TypingText
            text="No well wishes yet... but we know the love is there! ❤️"
            delay={1500}
            speed={60}
          />
        </motion.h3>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[90vw] space-y-8">
      <motion.h2
        className="mb-8 text-center text-[120px] leading-tight font-bold text-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <TypingText text="Messages of Love 💕" speed={80} />
      </motion.h2>

      {showTitle && (
        <motion.h3
          className="mb-8 text-center text-7xl text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <TypingText
            text={`${totalWellWishes} heartfelt ${totalWellWishes === 1 ? 'message' : 'messages'} from your loved ones...`}
            delay={500}
            speed={60}
          />
        </motion.h3>
      )}

      {/* Well wishes grid - no scroll */}
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {visibleWishes.map((index) => {
            const wish = wellWishes[index];
            return (
              <motion.div
                key={index}
                className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg"
                initial={{ opacity: 0, scale: 0.5, rotateZ: -10 }}
                animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                transition={{
                  type: 'spring',
                  bounce: 0.5,
                  duration: 0.6,
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">💌</div>
                  <div className="flex-1">
                    <p className="mb-2 text-2xl font-semibold text-white">
                      {wish.guestName || 'Anonymous'}
                    </p>
                    <p className="text-lg leading-relaxed text-white/80">{wish.message}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Show completion message when all wishes are visible */}
      {visibleWishes.length === wellWishes.length && wellWishes.length > 0 && (
        <motion.div
          className="mt-8 rounded-3xl border-2 border-white/30 bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-8 text-center backdrop-blur-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-6xl font-semibold text-white">
            <TypingText text="So much love, so many memories! ❤️✨" delay={500} speed={60} />
          </h3>
        </motion.div>
      )}
    </div>
  );
}

interface WellWishesSlideExportProps {
  emotionalTouchInsights: WeddingWrappedResponseDto['emotionalTouchInsights'];
}

export function WellWishesSlide({ emotionalTouchInsights }: WellWishesSlideExportProps) {
  return {
    background: FloatingHearts,
    content: <WellWishesSlideContent emotionalTouchInsights={emotionalTouchInsights} />,
  };
}
