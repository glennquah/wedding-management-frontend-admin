'use client';

import { motion } from 'framer-motion';
import { WeddingWrappedResponseDto } from '@shared/api';
import { AnimatedWords } from '../AnimationComponents';
import { CameraFlashes } from '../ParticleEffects';

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
    background: CameraFlashes,
    content: (
      <div className="space-y-8 max-w-4xl">
        <motion.h2
          className="text-6xl font-bold text-white mb-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          Memories & Moments
        </motion.h2>

        <div className="grid grid-cols-2 gap-8">
          {(
            [
              {
                label: 'Photos Uploaded',
                value: emotionalTouchInsights.totalPhotos,
                color: 'from-orange-400 to-red-600',
                icon: '📸',
                delay: 0.3,
              },
              {
                label: 'Well Wishes',
                value: emotionalTouchInsights.totalWellWishes,
                color: 'from-purple-400 to-pink-600',
                icon: '💌',
                delay: 0.5,
              },
              {
                label: 'Faces Detected',
                value: emotionalTouchInsights.totalFacesDetected,
                color: 'from-blue-400 to-cyan-600',
                icon: '👥',
                delay: 0.7,
              },
              {
                label: 'Unique People',
                value: emotionalTouchInsights.totalPeopleClusters,
                color: 'from-green-400 to-teal-600',
                icon: '✨',
                delay: 0.9,
              },
            ] as const satisfies readonly SlideMemoryItem[]
          ).map((item, idx) => (
            <motion.div
              key={idx}
              className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 text-center shadow-2xl`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: item.delay, duration: 0.6 }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-5xl font-bold text-white mb-2">{item.value}</div>
              <div className="text-xl text-white/90">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="text-3xl text-white">
            <AnimatedWords
              text="These moments will last forever in your hearts"
              startDelay={1.4}
            />
          </p>
        </motion.div>
      </div>
    ),
  };
}
