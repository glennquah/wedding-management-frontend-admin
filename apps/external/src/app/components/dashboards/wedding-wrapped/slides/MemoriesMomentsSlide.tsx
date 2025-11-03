'use client';

import { motion } from 'framer-motion';
import { WeddingWrappedResponseDto } from '@shared/api';
import { TypingText } from '../TypingText';
import { FlowerPetals } from '../ParticleEffects';

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

export function MemoriesMomentsSlide({ emotionalTouchInsights }: MemoriesMomentsSlideProps) {
  return {
    background: FlowerPetals, // Beautiful flower petals for memories!
    content: (
      <div className="max-w-6xl space-y-10">
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
              {
                label: 'Unique People',
                value: emotionalTouchInsights.totalPeopleClusters,
                color: 'from-green-400 to-teal-600',
                icon: '✨',
                delay: 6.0,
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
          transition={{ delay: 7.5, duration: 0.8 }}
        >
          <p className="text-4xl text-white">
            <TypingText text="These moments will last forever in your hearts ❤️" delay={500} speed={80} />
          </p>
        </motion.div>
      </div>
    ),
  };
}
