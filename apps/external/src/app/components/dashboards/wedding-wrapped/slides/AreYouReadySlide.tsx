'use client';

import { motion } from 'framer-motion';
import { WeddingResponseDto } from '@shared/api';
import { AnimatedWords } from '../AnimationComponents';
import { DynamicWaveParticles } from '../DynamicWaveParticles';

interface AreYouReadySlideProps {
  wedding: WeddingResponseDto | undefined;
}

export function AreYouReadySlide({ wedding }: AreYouReadySlideProps) {
  const coupleName = wedding?.mainCouple && wedding.mainCouple.length > 0
    ? `${wedding.mainCouple[0]?.name || 'Partner 1'} & ${wedding.mainCouple[1]?.name || (wedding.mainCouple[0]?.name ? 'Partner 2' : wedding?.name || '')}`
    : wedding?.name || 'Couple';

  return {
    background: DynamicWaveParticles,
    content: (
      <div className="text-center space-y-12 max-w-5xl">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
        >
          <h1 className="text-9xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-8">
            ARE YOU READY?
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <p className="text-5xl text-white font-bold mb-6">
            <AnimatedWords
              text={`${coupleName}'s Wedding Wrapped`}
              startDelay={1}
            />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8, type: 'spring' }}
          className="flex justify-center items-center space-x-8"
        >
          <div className="text-7xl animate-bounce">🎉</div>
          <div className="text-7xl animate-bounce" style={{ animationDelay: '0.2s' }}>💍</div>
          <div className="text-7xl animate-bounce" style={{ animationDelay: '0.4s' }}>❤️</div>
        </motion.div>

        <motion.p
          className="text-3xl text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <AnimatedWords text="Get ready to relive your magical moments!" startDelay={2.2} />
        </motion.p>
      </div>
    ),
  };
}
