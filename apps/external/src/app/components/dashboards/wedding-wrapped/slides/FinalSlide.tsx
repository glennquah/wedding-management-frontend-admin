'use client';

import { motion } from 'framer-motion';
import { Button } from '@shared/components/ui/button';
import { AnimatedWords } from '../AnimationComponents';
import { ConfettiParticles } from '../ParticleEffects';

interface FinalSlideProps {
  onSave: () => void;
  isSaving: boolean;
}

export function FinalSlide({ onSave, isSaving }: FinalSlideProps) {
  return {
    background: ConfettiParticles,
    content: (
      <div className="text-center space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <h1 className="text-7xl font-bold text-white mb-4">Thank You for Celebrating</h1>
        </motion.div>
        <motion.p
          className="text-3xl text-white/90 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <AnimatedWords text="Your special day was truly magical" startDelay={0.8} />
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <Button
            onClick={onSave}
            disabled={isSaving}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-2xl px-12 py-6 rounded-full shadow-2xl"
          >
            {isSaving ? 'Saving...' : '💝 Save Wedding Wrapped'}
          </Button>
        </motion.div>
      </div>
    ),
  };
}
