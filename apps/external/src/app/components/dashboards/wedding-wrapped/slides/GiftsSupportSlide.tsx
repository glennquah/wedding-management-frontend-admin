'use client';

import { motion } from 'framer-motion';
import { WeddingWrappedResponseDto } from '@shared/api';
import { AnimatedWords } from '../AnimationComponents';
import { FloatingHearts } from '../ParticleEffects';

interface GiftsSupportSlideProps {
  giftSupportInsights: WeddingWrappedResponseDto['giftSupportInsights'];
  formatCurrency: (amount: number) => string;
}

export function GiftsSupportSlide({ giftSupportInsights, formatCurrency }: GiftsSupportSlideProps) {
  return {
    background: FloatingHearts,
    content: (
      <div className="space-y-8 max-w-4xl">
        <motion.h2
          className="text-6xl font-bold text-white mb-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          Gifts & Support
        </motion.h2>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <motion.div
            className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-8 text-center shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="text-5xl font-bold text-white mb-2">
              {formatCurrency(giftSupportInsights.totalGiftValue)}
            </div>
            <div className="text-xl text-white/90">Total Gift Value</div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-center shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="text-5xl font-bold text-white mb-2">
              {giftSupportInsights.wishlistCompletion.toFixed(0)}%
            </div>
            <div className="text-xl text-white/90">Wishlist Completion</div>
          </motion.div>
        </div>

        {giftSupportInsights.mostWantedItem && (
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <p className="text-2xl text-pink-300 font-semibold mb-2">
              <AnimatedWords text="💖 Most Wanted Item" startDelay={1} />
            </p>
            <p className="text-3xl text-white">
              <AnimatedWords
                text={`${giftSupportInsights.mostWantedItem} (${giftSupportInsights.mostWantedItemCount} reservations)`}
                startDelay={1.3}
              />
            </p>
          </motion.div>
        )}

        {giftSupportInsights.topContributorName && (
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <p className="text-2xl text-yellow-300 font-semibold mb-2">
              <AnimatedWords text="🌟 Top Contributor" startDelay={1.4} />
            </p>
            <p className="text-3xl text-white">
              <AnimatedWords
                text={`${giftSupportInsights.topContributorName} - ${formatCurrency(giftSupportInsights.topContribution || 0)}`}
                startDelay={1.7}
              />
            </p>
          </motion.div>
        )}
      </div>
    ),
  };
}
