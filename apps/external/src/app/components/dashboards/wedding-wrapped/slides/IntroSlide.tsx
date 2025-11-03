'use client';

import { motion } from 'framer-motion';
import { WeddingResponseDto } from '@shared/api';
import { AnimatedWords } from '../AnimationComponents';
import { FireworksParticles } from '../ParticleEffects';

interface IntroSlideProps {
  wedding: WeddingResponseDto | undefined;
}

export function IntroSlide({ wedding }: IntroSlideProps) {
  // Debug logging
  console.log('IntroSlide - wedding:', wedding);
  console.log('IntroSlide - mainCouple:', wedding?.mainCouple);
  console.log('IntroSlide - mainCouple length:', wedding?.mainCouple?.length);
  console.log('IntroSlide - mainCouple[0]:', wedding?.mainCouple?.[0]);
  console.log('IntroSlide - mainCouple[1]:', wedding?.mainCouple?.[1]);

  return {
    background: FireworksParticles,
    content: (
      <div className="max-w-5xl space-y-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <h1 className="mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-8xl font-bold text-transparent">
            Wedding Wrapped
          </h1>
        </motion.div>

        {wedding && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-8"
            >
              <p className="text-6xl font-bold text-white">
                <AnimatedWords
                  text={`On ${new Date(wedding.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}`}
                  startDelay={0.6}
                />
              </p>

              {/* Show main couple if available, otherwise show wedding name */}
              {wedding.mainCouple && wedding.mainCouple.length > 0 ? (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <p className="text-8xl leading-tight font-bold text-white">
                    <AnimatedWords
                      text={wedding.mainCouple[0]?.name || 'Partner 1'}
                      startDelay={1.3}
                    />
                  </p>
                  <p className="text-7xl font-semibold text-pink-300">
                    <AnimatedWords text="tied the knot with" startDelay={1.9} />
                  </p>
                  <p className="text-8xl leading-tight font-bold text-white">
                    <AnimatedWords
                      text={
                        wedding.mainCouple[1]?.name ||
                        (wedding.mainCouple[0]?.name ? 'Partner 2' : wedding.name)
                      }
                      startDelay={2.5}
                    />
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <p className="text-8xl leading-tight font-bold text-white">
                    <AnimatedWords
                      text={wedding.name}
                      startDelay={1.3}
                    />
                  </p>
                  <p className="text-5xl font-semibold text-pink-300">
                    <AnimatedWords text="celebrated their special day" startDelay={2.2} />
                  </p>
                </motion.div>
              )}
            </motion.div>

            {wedding.location && (
              <motion.div
                className="rounded-3xl border-2 border-white/30 bg-white/10 p-10 shadow-2xl backdrop-blur-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.2, duration: 0.8 }}
              >
                <p className="mb-4 text-4xl text-white/80">
                  <AnimatedWords text="📍 Celebrated at" startDelay={3.3} />
                </p>
                <p className="text-6xl font-bold text-white">
                  <AnimatedWords text={wedding.location} startDelay={3.7} />
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
            <AnimatedWords text="A celebration of your special day" startDelay={0.8} />
          </motion.p>
        )}
      </div>
    ),
  };
}
