'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WeddingWrappedResponseDto } from '@shared/api';
import { TypingText } from '../TypingText';
import { SparklingStars } from '../ParticleEffects';
import Image from 'next/image';

interface MostFrequentPersonSlideProps {
  emotionalTouchInsights: WeddingWrappedResponseDto['emotionalTouchInsights'];
}

function MostFrequentPersonSlideContent({ emotionalTouchInsights }: MostFrequentPersonSlideProps) {
  const [showQuestion, setShowQuestion] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showCount, setShowCount] = useState(false);

  const { mostFrequentPersonName, mostFrequentPersonCount, mostFrequentPersonPhoto } = emotionalTouchInsights;

  // If no data, don't show the slide
  if (!mostFrequentPersonName || !mostFrequentPersonCount) {
    return null;
  }

  return (
    <div className="space-y-10 max-w-[90vw] w-full">
      <motion.h2
        className="text-[120px] font-bold text-white mb-6 leading-tight text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <TypingText
          text="Star of the Show! 🌟"
          speed={80}
          onComplete={() => setTimeout(() => setShowQuestion(true), 800)}
        />
      </motion.h2>

      {showQuestion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-8xl text-white/90 text-center">
            <TypingText
              text="Who appeared most in your photos?"
              delay={300}
              speed={60}
              onComplete={() => setTimeout(() => setShowPhoto(true), 1000)}
            />
          </h3>
        </motion.div>
      )}

      {showPhoto && (
        <motion.div
          className="flex flex-col items-center space-y-6"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
          onAnimationComplete={() => setTimeout(() => setShowName(true), 800)}
        >
          {mostFrequentPersonPhoto ? (
            <div className="relative w-96 h-96 rounded-full overflow-hidden border-8 border-white/30 shadow-2xl">
              <Image
                src={mostFrequentPersonPhoto}
                alt={mostFrequentPersonName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-96 h-96 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-9xl">
              📸
            </div>
          )}
        </motion.div>
      )}

      {showName && (
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-[140px] font-bold text-white leading-tight">
            <TypingText
              text={mostFrequentPersonName}
              delay={300}
              speed={80}
              onComplete={() => setTimeout(() => setShowCount(true), 800)}
            />
          </h3>
        </motion.div>
      )}

      {showCount && (
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/20 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4, delay: 0.3 }}
        >
          <h3 className="text-7xl text-yellow-300 font-semibold mb-3">
            <TypingText text="📸 Camera Magnet!" delay={300} speed={70} />
          </h3>
          <h3 className="text-9xl text-white font-bold mt-4">
            <TypingText
              text={`${mostFrequentPersonCount} ${mostFrequentPersonCount === 1 ? 'photo' : 'photos'}`}
              delay={1500}
              speed={60}
            />
          </h3>
          <h3 className="text-5xl text-white/70 mt-4">
            <TypingText
              text="Always ready for the camera! 📷✨"
              delay={3000}
              speed={50}
            />
          </h3>
        </motion.div>
      )}
    </div>
  );
}

interface MostFrequentPersonSlideExportProps {
  emotionalTouchInsights: WeddingWrappedResponseDto['emotionalTouchInsights'];
}

export function MostFrequentPersonSlide({ emotionalTouchInsights }: MostFrequentPersonSlideExportProps) {
  return {
    background: SparklingStars,
    content: <MostFrequentPersonSlideContent emotionalTouchInsights={emotionalTouchInsights} />,
  };
}
