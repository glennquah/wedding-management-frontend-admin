'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WeddingWrappedResponseDto } from '@shared/api';
import { TypingText } from '../TypingText';
import { SparklingStars } from '../ParticleEffects';

interface PlanningJourneySlideContentProps {
  planningJourneyInsights: WeddingWrappedResponseDto['planningJourneyInsights'];
  formatCurrency: (amount: number) => string;
}

function PlanningJourneySlideContent({
  planningJourneyInsights,
  formatCurrency,
}: PlanningJourneySlideContentProps) {
  const [showDays, setShowDays] = useState(false);
  const [showDaysComment, setShowDaysComment] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [showBudgetReveal, setShowBudgetReveal] = useState(false);
  const [showSpent, setShowSpent] = useState(false);
  const [showVendor, setShowVendor] = useState(false);

  const getDaysComment = () => {
    if (planningJourneyInsights.planningDays > 365) {
      return "Whoa! That's over a year of planning! 😮 Talk about dedication...";
    } else if (planningJourneyInsights.planningDays > 180) {
      return "Half a year of planning? You really took your time! 🗓️";
    } else if (planningJourneyInsights.planningDays > 90) {
      return "A solid few months! Well-planned and well-paced 👌";
    } else {
      return "Speed run champion! 🏃‍♀️💨 Quick but efficient!";
    }
  };

  const getBudgetComment = () => {
    const utilization = planningJourneyInsights.budgetUtilization;
    if (utilization > 95) {
      return "You MAXED IT OUT! 💸 Every penny counted!";
    } else if (utilization > 80) {
      return "Close to the edge! But who's counting? 😏";
    } else if (utilization > 60) {
      return "Nicely balanced! The Goldilocks zone 👌";
    } else if (utilization > 40) {
      return "Playing it safe! Smart moves 🧠";
    } else {
      return "Under budget?! Teach us your ways! 🙌";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl w-full">
        <motion.h2
          className="text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <TypingText text="Planning Journey" speed={80} />
        </motion.h2>

        <div className="space-y-6">
          {/* Planning Days */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="space-y-4"
          >
            <p className="text-2xl text-white/80">
              <TypingText
                text="Let's see... how long did this journey take?"
                delay={1500}
                speed={60}
                onComplete={() => setTimeout(() => setShowDays(true), 800)}
              />
            </p>

            {showDays && (
              <motion.div
                className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-center shadow-2xl"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <div className="text-6xl font-bold text-white mb-2">
                  {planningJourneyInsights.planningDays}
                </div>
                <div className="text-xl text-white/90">Days of Planning</div>
              </motion.div>
            )}

            {showDays && (
              <p className="text-2xl text-yellow-300 font-semibold text-center">
                <TypingText
                  text={getDaysComment()}
                  delay={500}
                  speed={50}
                  onComplete={() => setTimeout(() => setShowBudget(true), 1200)}
                />
              </p>
            )}
          </motion.div>

          {/* Budget Suspense */}
          {showBudget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <p className="text-3xl text-white/80 text-center">
                <TypingText
                  text="Now for the real question... 💰"
                  delay={200}
                  speed={70}
                />
              </p>
              <p className="text-3xl text-white font-bold text-center">
                <TypingText
                  text="Did you break the bank?"
                  delay={2000}
                  speed={60}
                  onComplete={() => setTimeout(() => setShowBudgetReveal(true), 1000)}
                />
              </p>
            </motion.div>
          )}

          {/* Budget Reveal */}
          {showBudgetReveal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <motion.div
                className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-8 text-center shadow-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.4 }}
              >
                <div className="text-6xl font-bold text-white mb-2">
                  {planningJourneyInsights.budgetUtilization.toFixed(0)}%
                </div>
                <div className="text-xl text-white/90">Budget Used</div>
              </motion.div>

              <p className="text-2xl text-cyan-300 font-semibold text-center">
                <TypingText
                  text={getBudgetComment()}
                  delay={800}
                  speed={50}
                  onComplete={() => setTimeout(() => setShowSpent(true), 1000)}
                />
              </p>
            </motion.div>
          )}

          {/* Money Details */}
          {showSpent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-row gap-4 justify-center items-stretch"
            >
              <motion.div
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20 flex-1 text-center"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-lg text-green-300 font-semibold mb-2">Total Spent</p>
                <p className="text-3xl text-white font-bold">
                  {formatCurrency(planningJourneyInsights.totalSpent)}
                </p>
              </motion.div>

              <motion.div
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20 flex-1 text-center"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onAnimationComplete={() => setTimeout(() => setShowVendor(true), 800)}
              >
                <p className="text-lg text-blue-300 font-semibold mb-2">Allocated Budget</p>
                <p className="text-3xl text-white font-bold">
                  {formatCurrency(planningJourneyInsights.allocatedBudget)}
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Top Vendor */}
          {showVendor && planningJourneyInsights.topVendorCategory && (
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xl text-yellow-300 font-semibold mb-3">
                <TypingText text="💰 Your Biggest Splurge?" delay={300} speed={60} />
              </p>
              <p className="text-3xl text-white pt-1">
                <TypingText
                  text={`${planningJourneyInsights.topVendorCategory} - ${formatCurrency(planningJourneyInsights.topVendorAmount || 0)}`}
                  delay={1500}
                  speed={50}
                />
              </p>
              <p className="text-lg text-white/60 mt-3">
                <TypingText
                  text="Worth every cent! 🌟"
                  delay={3500}
                  speed={60}
                />
              </p>
            </motion.div>
          )}
        </div>
      </div>
  );
}

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
    content: <PlanningJourneySlideContent planningJourneyInsights={planningJourneyInsights} formatCurrency={formatCurrency} />,
  };
}
