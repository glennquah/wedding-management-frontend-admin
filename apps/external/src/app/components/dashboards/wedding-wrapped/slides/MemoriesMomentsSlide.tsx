'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WeddingWrappedResponseDto } from '@shared/api';
import { TypingText } from '../TypingText';
import { FlowerPetals } from '../ParticleEffects';
import Image from 'next/image';

interface MemoriesMomentsSlideProps {
  emotionalTouchInsights: WeddingWrappedResponseDto['emotionalTouchInsights'];
}

interface SlideMemoryItem {
  label: string;
  value: number;
  color: string;
  icon: string;
  delay: number;
}

function MemoriesMomentsSlideContent({ emotionalTouchInsights }: MemoriesMomentsSlideProps) {
  const [showStarSection, setShowStarSection] = useState(false);

  const { mostFrequentPersonName, mostFrequentPersonCount, mostFrequentPersonPhoto } = emotionalTouchInsights;

  return (
    <div className="max-w-[90vw] space-y-10">
      <motion.h2
        className="mb-10 text-8xl font-bold text-white"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        Memories & Moments
      </motion.h2>

      <div className="flex flex-row items-stretch justify-center gap-6">
        {(
          [
            {
              label: 'Photos Uploaded',
              value: emotionalTouchInsights.totalPhotos,
              color: 'from-orange-400 to-red-600',
              icon: '📸',
              delay: 1.5,
            },
            {
              label: 'Well Wishes',
              value: emotionalTouchInsights.totalWellWishes,
              color: 'from-purple-400 to-pink-600',
              icon: '💌',
              delay: 3.0,
            },
            {
              label: 'Faces Detected',
              value: emotionalTouchInsights.totalFacesDetected,
              color: 'from-blue-400 to-cyan-600',
              icon: '👥',
              delay: 4.5,
            },
          ] as const satisfies readonly SlideMemoryItem[]
        ).map((item, idx) => (
          <motion.div
            key={idx}
            className={`bg-gradient-to-br ${item.color} flex-1 rounded-2xl p-6 text-center shadow-2xl`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: item.delay, duration: 1.5 }}
          >
            <div className="mb-3 text-4xl">{item.icon}</div>
            <div className="mb-2 text-6xl font-bold text-white">{item.value}</div>
            <div className="text-lg text-white/90">{item.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="rounded-3xl border-2 border-white/20 bg-white/10 p-10 text-center backdrop-blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 6.0, duration: 0.8 }}
        onAnimationComplete={() => setTimeout(() => setShowStarSection(true), 1000)}
      >
        <h3 className="text-7xl text-white">
          <TypingText text="These moments will last forever in your hearts ❤️" delay={500} speed={80} />
        </h3>
      </motion.div>

      {/* Star of the Show Section */}
      {showStarSection && mostFrequentPersonName && mostFrequentPersonCount && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-7xl font-bold text-yellow-300 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <TypingText text="⭐ Star of the Show! ⭐" delay={300} speed={80} />
          </motion.h2>

          <motion.div
            className="flex flex-col items-center space-y-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 1.5 }}
          >
            {mostFrequentPersonPhoto ? (
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-8 border-yellow-400 shadow-2xl">
                <Image
                  src={mostFrequentPersonPhoto}
                  alt={mostFrequentPersonName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-9xl border-8 border-yellow-400 shadow-2xl">
                📸
              </div>
            )}
          </motion.div>

          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3 }}
          >
            <h3 className="text-8xl font-bold text-white">
              <TypingText text={mostFrequentPersonName} delay={300} speed={80} />
            </h3>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-6 border-2 border-yellow-400/30 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4, delay: 3.5 }}
          >
            <h3 className="text-5xl text-yellow-300 font-semibold mb-3">
              <TypingText text="📸 Camera Magnet!" delay={300} speed={70} />
            </h3>
            <h3 className="text-7xl text-white font-bold mt-4">
              <TypingText
                text={`${mostFrequentPersonCount} ${mostFrequentPersonCount === 1 ? 'photo' : 'photos'}`}
                delay={1500}
                speed={60}
              />
            </h3>
            <h3 className="text-4xl text-white/70 mt-4">
              <TypingText
                text="Always ready for the camera! 📷✨"
                delay={3000}
                speed={50}
              />
            </h3>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export function MemoriesMomentsSlide({ emotionalTouchInsights }: MemoriesMomentsSlideProps) {
  return {
    background: FlowerPetals,
    content: <MemoriesMomentsSlideContent emotionalTouchInsights={emotionalTouchInsights} />,
  };
}
