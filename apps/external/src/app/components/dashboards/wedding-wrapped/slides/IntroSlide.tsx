'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WeddingResponseDto } from '@shared/api';
import { TypingText } from '../TypingText';
import { FireworksParticles } from '../ParticleEffects';

interface IntroSlideProps {
  wedding: WeddingResponseDto | undefined;
}

function IntroSlideContent({ wedding }: IntroSlideProps) {
  const [showDate, setShowDate] = useState(false);
  const [showPartner1, setShowPartner1] = useState(false);
  const [showTiedKnot, setShowTiedKnot] = useState(false);
  const [showPartner2, setShowPartner2] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  return (
    <div className="max-w-5xl space-y-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <h1 className="mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-8xl font-bold text-transparent">
          <TypingText text="Wedding Wrapped" delay={500} speed={120} onComplete={() => setTimeout(() => setShowDate(true), 800)} />
        </h1>
      </motion.div>

      {wedding && showDate && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <p className="text-7xl font-bold text-white">
              <TypingText
                text={`On ${new Date(wedding.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}`}
                delay={300}
                speed={80}
                onComplete={() => setTimeout(() => setShowPartner1(true), 1000)}
              />
            </p>

            {/* Show main couple if available, otherwise show wedding name */}
            {wedding.mainCouple && wedding.mainCouple.length > 0 ? (
              <>
                {showPartner1 && (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <p className="text-9xl leading-tight font-bold text-white">
                      <TypingText
                        text={wedding.mainCouple[0]?.name || 'Partner 1'}
                        delay={300}
                        speed={100}
                        onComplete={() => setTimeout(() => setShowTiedKnot(true), 800)}
                      />
                    </p>
                  </motion.div>
                )}
                {showTiedKnot && (
                  <p className="text-8xl font-semibold text-pink-300">
                    <TypingText
                      text="tied the knot with"
                      delay={200}
                      speed={90}
                      onComplete={() => setTimeout(() => setShowPartner2(true), 800)}
                    />
                  </p>
                )}
                {showPartner2 && (
                  <p className="text-9xl leading-tight font-bold text-white">
                    <TypingText
                      text={
                        wedding.mainCouple[1]?.name ||
                        (wedding.mainCouple[0]?.name ? 'Partner 2' : wedding.name)
                      }
                      delay={200}
                      speed={100}
                      onComplete={() => setTimeout(() => setShowLocation(true), 1000)}
                    />
                  </p>
                )}
              </>
            ) : (
              <>
                {showPartner1 && (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <p className="text-9xl leading-tight font-bold text-white">
                      <TypingText
                        text={wedding.name}
                        delay={300}
                        speed={100}
                        onComplete={() => setTimeout(() => setShowTiedKnot(true), 800)}
                      />
                    </p>
                  </motion.div>
                )}
                {showTiedKnot && (
                  <p className="text-6xl font-semibold text-pink-300">
                    <TypingText
                      text="celebrated their special day"
                      delay={200}
                      speed={80}
                      onComplete={() => setTimeout(() => setShowLocation(true), 1000)}
                    />
                  </p>
                )}
              </>
            )}
          </motion.div>

          {wedding.location && showLocation && (
            <motion.div
              className="rounded-3xl border-2 border-white/30 bg-white/10 p-10 shadow-2xl backdrop-blur-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p className="mb-4 text-5xl text-white/80">
                <TypingText text="📍 Celebrated at" delay={300} speed={80} />
              </p>
              <p className="text-7xl font-bold text-white">
                <TypingText text={wedding.location} delay={1500} speed={90} />
              </p>
            </motion.div>
          )}
        </>
      )}

      {!wedding && (
        <motion.p
          className="text-3xl text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <TypingText text="A celebration of your special day" delay={800} speed={80} />
        </motion.p>
      )}
    </div>
  );
}

export function IntroSlide({ wedding }: IntroSlideProps) {
  return {
    background: FireworksParticles,
    content: <IntroSlideContent wedding={wedding} />,
  };
}
