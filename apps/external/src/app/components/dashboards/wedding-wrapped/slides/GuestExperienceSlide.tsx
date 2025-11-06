'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WeddingWrappedResponseDto } from '@shared/api';
import { TypingText } from '../TypingText';
import { ConfettiParticles } from '../ParticleEffects';

interface GuestExperienceSlideContentProps {
  guestInsights: WeddingWrappedResponseDto['guestInsights'];
  formatDate: (dateString: string | null) => string;
}

function GuestExperienceSlideContent({
  guestInsights,
  formatDate,
}: GuestExperienceSlideContentProps) {
  const [showIntro, setShowIntro] = useState(false);
  const [showInvited, setShowInvited] = useState(false);
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [showAttended, setShowAttended] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showFirst, setShowFirst] = useState(false);
  const [showFastest, setShowFastest] = useState(false);

  // Trigger the first card when intro text is shown
  useEffect(() => {
    if (showIntro) {
      setTimeout(() => setShowInvited(true), 800);
    }
  }, [showIntro]);

  const getAttendanceComment = () => {
    const rate = (guestInsights.totalAttended / guestInsights.totalInvited) * 100;
    if (rate > 90) {
      return 'Basically a full house! 🎉 Your popularity is showing!';
    } else if (rate > 75) {
      return 'Great turnout! The party people showed up! 🥳';
    } else if (rate > 60) {
      return 'Solid crowd! Quality over quantity, right? 😎';
    } else {
      return 'Intimate gathering vibes! Sometimes less is more 💕';
    }
  };

  return (
    <div className="w-full max-w-[90vw] space-y-6">
      <motion.h2
        className="mb-6 text-[120px] font-bold text-white leading-tight"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <TypingText text="Guest Experience" speed={80} />
      </motion.h2>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <h3 className="mb-4 text-8xl text-white/90">
            <TypingText
              text="Let's talk about the people who celebrated with you..."
              delay={1200}
              speed={60}
              onComplete={() => setTimeout(() => setShowIntro(true), 600)}
            />
          </h3>
        </motion.div>

        {showIntro && (
          <motion.div
            className="mb-4 grid grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {showInvited && (
              <motion.div
                className="rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 p-6 text-center shadow-2xl"
                initial={{ opacity: 0, y: 50, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
                onAnimationComplete={() => setTimeout(() => setShowConfirmed(true), 1000)}
              >
                <div className="mb-2 text-5xl font-bold text-white">
                  {guestInsights.totalInvited}
                </div>
                <div className="text-base text-white/90">Invited</div>
              </motion.div>
            )}

            {showConfirmed && (
              <motion.div
                className="rounded-2xl bg-gradient-to-br from-green-400 to-green-600 p-6 text-center shadow-2xl"
                initial={{ opacity: 0, y: 50, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
                onAnimationComplete={() => setTimeout(() => setShowAttended(true), 1000)}
              >
                <div className="mb-2 text-5xl font-bold text-white">
                  {guestInsights.totalConfirmed}
                </div>
                <div className="text-base text-white/90">Confirmed</div>
              </motion.div>
            )}

            {showAttended && (
              <motion.div
                className="rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 p-6 text-center shadow-2xl"
                initial={{ opacity: 0, y: 50, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
                onAnimationComplete={() => setTimeout(() => setShowComment(true), 1000)}
              >
                <div className="mb-2 text-5xl font-bold text-white">
                  {guestInsights.totalAttended}
                </div>
                <div className="text-base text-white/90">Attended</div>
              </motion.div>
            )}
          </motion.div>
        )}

        {showComment && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <h3 className="text-center text-8xl font-semibold text-yellow-300">
              <TypingText
                text={getAttendanceComment()}
                delay={200}
                speed={50}
                onComplete={() => setTimeout(() => setShowFirst(true), 1000)}
              />
            </h3>
          </motion.div>
        )}

        {showFirst && guestInsights.firstGuestName && (
          <motion.div
            className="rounded-2xl border-2 border-white/20 bg-white/10 p-6 backdrop-blur-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="mb-3 text-7xl font-semibold text-yellow-300">
              <TypingText text="🏆 First to Arrive" delay={300} speed={70} />
            </h3>
            <h3 className="mb-2 text-6xl text-white/70">
              <TypingText
                text="The early bird who couldn't wait to celebrate!"
                delay={1500}
                speed={50}
              />
            </h3>
            <h3 className="pt-1 text-9xl font-bold text-white">
              <TypingText text={`${guestInsights.firstGuestName}`} delay={3500} speed={70} />
            </h3>
            <h3 className="mt-2 text-6xl text-white/60">
              <TypingText
                text={`at ${formatDate(guestInsights.firstGuestTime)}`}
                delay={4500}
                speed={40}
                onComplete={() => setTimeout(() => setShowFastest(true), 800)}
              />
            </h3>
          </motion.div>
        )}

        {showFastest && guestInsights.fastestRsvpName && (
          <motion.div
            className="rounded-2xl border-2 border-white/20 bg-white/10 p-6 backdrop-blur-lg"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="mb-3 text-7xl font-semibold text-green-300">
              <TypingText text="⚡ Fastest RSVP" delay={300} speed={70} />
            </h3>
            <h3 className="mb-2 text-6xl text-white/70">
              <TypingText text="Someone was EAGER! 🏃‍♂️💨" delay={1200} speed={60} />
            </h3>
            <h3 className="pt-1 text-9xl font-bold text-white">
              <TypingText text={guestInsights.fastestRsvpName} delay={2500} speed={70} />
            </h3>
            <h3 className="mt-2 text-7xl text-white/80">
              <TypingText
                text={`Lightning speed: ${guestInsights.fastestRsvpDuration?.toFixed(1)} hours ⚡`}
                delay={3800}
                speed={50}
              />
            </h3>
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
