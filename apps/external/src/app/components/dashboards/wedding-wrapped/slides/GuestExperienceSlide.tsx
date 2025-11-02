'use client';

import { motion } from 'framer-motion';
import { WeddingWrappedResponseDto } from '@shared/api';
import { AnimatedWords } from '../AnimationComponents';
import { ConfettiParticles } from '../ParticleEffects';

interface GuestExperienceSlideProps {
  guestInsights: WeddingWrappedResponseDto['guestInsights'];
  formatDate: (dateString: string | null) => string;
}

interface SlideStatItem {
  label: string;
  value: number;
  color: string;
  delay: number;
}

export function GuestExperienceSlide({ guestInsights, formatDate }: GuestExperienceSlideProps) {
  return {
    background: ConfettiParticles,
    content: (
      <div className="space-y-8 max-w-4xl">
        <motion.h2
          className="text-6xl font-bold text-white mb-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          Guest Experience
        </motion.h2>

        <div className="grid grid-cols-3 gap-8 mb-8">
          {(
            [
              {
                label: 'Invited',
                value: guestInsights.totalInvited,
                color: 'from-blue-400 to-blue-600',
                delay: 0.3,
              },
              {
                label: 'Confirmed',
                value: guestInsights.totalConfirmed,
                color: 'from-green-400 to-green-600',
                delay: 0.5,
              },
              {
                label: 'Attended',
                value: guestInsights.totalAttended,
                color: 'from-purple-400 to-purple-600',
                delay: 0.7,
              },
            ] as const satisfies readonly SlideStatItem[]
          ).map((item, idx) => (
            <motion.div
              key={idx}
              className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 text-center shadow-2xl`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay, duration: 0.6 }}
            >
              <div className="text-6xl font-bold text-white mb-2">{item.value}</div>
              <div className="text-xl text-white/90">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {guestInsights.firstGuestName && (
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p className="text-2xl text-yellow-300 font-semibold mb-2">
              <AnimatedWords text="🏆 First to Arrive" startDelay={1.2} />
            </p>
            <p className="text-3xl text-white">
              <AnimatedWords
                text={`${guestInsights.firstGuestName} at ${formatDate(guestInsights.firstGuestTime)}`}
                startDelay={1.5}
              />
            </p>
          </motion.div>
        )}

        {guestInsights.fastestRsvpName && (
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <p className="text-2xl text-green-300 font-semibold mb-2">
              <AnimatedWords text="⚡ Fastest RSVP" startDelay={1.6} />
            </p>
            <p className="text-3xl text-white">
              <AnimatedWords
                text={`${guestInsights.fastestRsvpName} - ${guestInsights.fastestRsvpDuration?.toFixed(1)} hours`}
                startDelay={1.9}
              />
            </p>
          </motion.div>
        )}
      </div>
    ),
  };
}
