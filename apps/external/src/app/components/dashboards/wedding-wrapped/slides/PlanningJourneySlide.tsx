'use client';

import { motion } from 'framer-motion';
import { WeddingWrappedResponseDto } from '@shared/api';
import { AnimatedWords } from '../AnimationComponents';
import { SparklingStars } from '../ParticleEffects';

interface PlanningJourneySlideProps {
  planningJourneyInsights: WeddingWrappedResponseDto['planningJourneyInsights'];
  formatCurrency: (amount: number) => string;
}

export function PlanningJourneySlide({
  planningJourneyInsights,
  formatCurrency,
}: PlanningJourneySlideProps) {
  return {
    background: SparklingStars,
    content: (
      <div className="space-y-8 max-w-4xl">
        <motion.h2
          className="text-6xl font-bold text-white mb-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          Planning Journey
        </motion.h2>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <motion.div
            className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-center shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="text-5xl font-bold text-white mb-2">
              {planningJourneyInsights.planningDays}
            </div>
            <div className="text-xl text-white/90">Days of Planning</div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 text-center shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="text-5xl font-bold text-white mb-2">
              {planningJourneyInsights.budgetUtilization.toFixed(0)}%
            </div>
            <div className="text-xl text-white/90">Budget Used</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <p className="text-xl text-green-300 font-semibold mb-2">Total Spent</p>
            <p className="text-4xl text-white font-bold">
              {formatCurrency(planningJourneyInsights.totalSpent)}
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p className="text-xl text-blue-300 font-semibold mb-2">Allocated Budget</p>
            <p className="text-4xl text-white font-bold">
              {formatCurrency(planningJourneyInsights.allocatedBudget)}
            </p>
          </motion.div>
        </div>

        {planningJourneyInsights.topVendorCategory && (
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <p className="text-2xl text-yellow-300 font-semibold mb-2">
              <AnimatedWords text="💰 Biggest Investment" startDelay={1.5} />
            </p>
            <p className="text-3xl text-white">
              <AnimatedWords
                text={`${planningJourneyInsights.topVendorCategory} - ${formatCurrency(planningJourneyInsights.topVendorAmount || 0)}`}
                startDelay={1.8}
              />
            </p>
          </motion.div>
        )}
      </div>
    ),
  };
}
