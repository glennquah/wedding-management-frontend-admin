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
  const [currentDelay, setCurrentDelay] = useState(1500); // Start slow

  const { wellWishes, totalWellWishes } = emotionalTouchInsights;

  useEffect(() => {
    // Start showing title
    const titleTimeout = setTimeout(() => setShowTitle(true), 500);
    return () => clearTimeout(titleTimeout);
  }, []);

  useEffect(() => {
    if (!showTitle || wellWishes.length === 0) return;

    let currentIndex = 0;
    let delay = currentDelay;

    const showNextWish = () => {
      if (currentIndex < wellWishes.length) {
        setVisibleWishes((prev) => [...prev, currentIndex]);
        currentIndex++;

        // Speed up as more wishes appear
        // Start at 1500ms, gradually decrease to 100ms
        if (currentIndex < 3) {
          delay = 1500; // First few are slow
        } else if (currentIndex < 8) {
          delay = 800; // Medium speed
        } else if (currentIndex < 15) {
          delay = 400; // Getting faster
        } else {
          delay = 100; // Very fast for the rest
        }

        setCurrentDelay(delay);
        setTimeout(showNextWish, delay);
      }
    };

    // Start showing wishes after title appears
    const startTimeout = setTimeout(showNextWish, 2000);

    return () => clearTimeout(startTimeout);
  }, [showTitle, wellWishes]);

  if (wellWishes.length === 0) {
    return (
      <div className="space-y-10 max-w-[90vw] w-full text-center">
        <motion.h2
          className="text-[120px] font-bold text-white leading-tight"
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
          <TypingText text="No well wishes yet... but we know the love is there! ❤️" delay={1500} speed={60} />
        </motion.h3>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[90vw] w-full">
      <motion.h2
        className="text-[120px] font-bold text-white mb-8 leading-tight text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <TypingText
          text="Messages of Love 💕"
          speed={80}
        />
      </motion.h2>

      {showTitle && (
        <motion.h3
          className="text-7xl text-white/90 text-center mb-8"
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

      {/* Well wishes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-4">
        <AnimatePresence>
          {visibleWishes.map((index) => {
            const wish = wellWishes[index];
            return (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl"
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
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {wish.guestName || 'Anonymous'}
                    </h3>
                    <h3 className="text-lg text-white/80 leading-relaxed">
                      {wish.message}
                    </h3>
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
          className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30 text-center mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-6xl text-white font-semibold">
            <TypingText
              text="So much love, so many memories! ❤️✨"
              delay={500}
              speed={60}
            />
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
