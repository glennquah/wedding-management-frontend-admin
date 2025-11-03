'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WeddingWrappedResponseDto } from '@shared/api';
import { TypingText } from '../TypingText';
import { ConfettiParticles } from '../ParticleEffects';

interface GuestExperienceSlideContentProps {
  guestInsights: WeddingWrappedResponseDto['guestInsights'];
  formatDate: (dateString: string | null) => string;
}

function GuestExperienceSlideContent({ guestInsights, formatDate }: GuestExperienceSlideContentProps) {
  const [showStats, setShowStats] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showFirst, setShowFirst] = useState(false);
  const [showFastest, setShowFastest] = useState(false);

  const getAttendanceComment = () => {
    const rate = (guestInsights.totalAttended / guestInsights.totalInvited) * 100;
    if (rate > 90) {
      return "Basically a full house! 🎉 Your popularity is showing!";
    } else if (rate > 75) {
      return "Great turnout! The party people showed up! 🥳";
    } else if (rate > 60) {
      return "Solid crowd! Quality over quantity, right? 😎";
    } else {
      return "Intimate gathering vibes! Sometimes less is more 💕";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl w-full">
        <motion.h2
          className="text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <TypingText text="Guest Experience" speed={80} />
        </motion.h2>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-2xl text-white/90 mb-4">
              <TypingText
                text="Let's talk about the people who celebrated with you..."
                delay={1200}
                speed={60}
                onComplete={() => setTimeout(() => setShowStats(true), 600)}
              />
            </p>
          </motion.div>

          {showStats && (
            <motion.div
              className="grid grid-cols-3 gap-4 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[
                { label: 'Invited', value: guestInsights.totalInvited, color: 'from-blue-400 to-blue-600', delay: 0.2 },
                { label: 'Confirmed', value: guestInsights.totalConfirmed, color: 'from-green-400 to-green-600', delay: 0.4 },
                { label: 'Attended', value: guestInsights.totalAttended, color: 'from-purple-400 to-purple-600', delay: 0.6 },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-center shadow-2xl`}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: item.delay, type: 'spring', bounce: 0.4 }}
                  onAnimationComplete={() => {
                    if (idx === 2) setTimeout(() => setShowComment(true), 500);
                  }}
                >
                  <div className="text-5xl font-bold text-white mb-2">{item.value}</div>
                  <div className="text-base text-white/90">{item.label}</div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {showComment && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-2xl text-yellow-300 font-semibold text-center">
                <TypingText
                  text={getAttendanceComment()}
                  delay={200}
                  speed={50}
                  onComplete={() => setTimeout(() => setShowFirst(true), 1000)}
                />
              </p>
            </motion.div>
          )}

          {showFirst && guestInsights.firstGuestName && (
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xl text-yellow-300 font-semibold mb-3">
                <TypingText text="🏆 First to Arrive" delay={300} speed={70} />
              </p>
              <p className="text-lg text-white/70 mb-2">
                <TypingText
                  text="The early bird who couldn't wait to celebrate!"
                  delay={1500}
                  speed={50}
                />
              </p>
              <p className="text-3xl text-white font-bold pt-1">
                <TypingText
                  text={`${guestInsights.firstGuestName}`}
                  delay={3500}
                  speed={70}
                />
              </p>
              <p className="text-lg text-white/60 mt-2">
                <TypingText
                  text={`at ${formatDate(guestInsights.firstGuestTime)}`}
                  delay={4500}
                  speed={40}
                  onComplete={() => setTimeout(() => setShowFastest(true), 800)}
                />
              </p>
            </motion.div>
          )}

          {showFastest && guestInsights.fastestRsvpName && (
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xl text-green-300 font-semibold mb-3">
                <TypingText text="⚡ Fastest RSVP" delay={300} speed={70} />
              </p>
              <p className="text-lg text-white/70 mb-2">
                <TypingText
                  text="Someone was EAGER! 🏃‍♂️💨"
                  delay={1200}
                  speed={60}
                />
              </p>
              <p className="text-3xl text-white font-bold pt-1">
                <TypingText
                  text={guestInsights.fastestRsvpName}
                  delay={2500}
                  speed={70}
                />
              </p>
              <p className="text-xl text-white/80 mt-2">
                <TypingText
                  text={`Lightning speed: ${guestInsights.fastestRsvpDuration?.toFixed(1)} hours ⚡`}
                  delay={3800}
                  speed={50}
                />
              </p>
            </motion.div>
          )}
        </div>
      </div>
  );
}

interface GuestExperienceSlideProps {
  guestInsights: WeddingWrappedResponseDto['guestInsights'];
  formatDate: (dateString: string | null) => string;
}

export function GuestExperienceSlide({ guestInsights, formatDate }: GuestExperienceSlideProps) {
  return {
    background: ConfettiParticles,
    content: <GuestExperienceSlideContent guestInsights={guestInsights} formatDate={formatDate} />,
  };
}
