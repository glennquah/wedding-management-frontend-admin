'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeddingResponseDto } from '@shared/api';
import { TypingText } from '../TypingText';
import { FireworksParticles } from '../ParticleEffects';
import Image from 'next/image';

interface IntroSlideProps {
  wedding: WeddingResponseDto | undefined;
  photos?: Array<{ url: string }>;
}

function IntroSlideContent({ wedding, photos = [] }: IntroSlideProps) {
  const [showDate, setShowDate] = useState(false);
  const [showPartner1, setShowPartner1] = useState(false);
  const [showTiedKnot, setShowTiedKnot] = useState(false);
  const [showPartner2, setShowPartner2] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [visiblePhotos, setVisiblePhotos] = useState<number[]>([]);

  // Photo reveal effect
  useEffect(() => {
    if (!showPhotos || photos.length === 0) return;

    let currentIndex = 0;
    let delay = 1000; // Start slow

    const showNextPhoto = () => {
      if (currentIndex < photos.length) {
        setVisiblePhotos((prev) => [...prev, currentIndex]);
        currentIndex++;

        // Speed up progressively
        if (currentIndex < 3) {
          delay = 1000; // First few photos slow
        } else if (currentIndex < 8) {
          delay = 500; // Medium speed
        } else if (currentIndex < 15) {
          delay = 200; // Getting faster
        } else {
          delay = 50; // Very fast to fill the screen
        }

        setTimeout(showNextPhoto, delay);
      }
    };

    const startTimeout = setTimeout(showNextPhoto, 500);

    return () => clearTimeout(startTimeout);
  }, [showPhotos, photos]);

  return (
    <div className="max-w-[90vw] space-y-8 text-center relative z-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <h1 className="mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-[180px] font-bold text-transparent leading-tight">
          <TypingText
            text="Wedding Wrapped"
            delay={500}
            speed={120}
            onComplete={() => setTimeout(() => setShowDate(true), 800)}
          />
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
            <h3 className="text-[120px] font-bold text-white leading-tight">
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
            </h3>

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
                    <h3 className="text-[160px] leading-tight font-bold text-white">
                      <TypingText
                        text={wedding.mainCouple[0]?.name || 'Partner 1'}
                        delay={300}
                        speed={100}
                        onComplete={() => setTimeout(() => setShowTiedKnot(true), 800)}
                      />
                    </h3>
                  </motion.div>
                )}
                {showTiedKnot && (
                  <h3 className="text-[120px] font-semibold text-pink-300 leading-tight">
                    <TypingText
                      text="tied the knot with"
                      delay={200}
                      speed={90}
                      onComplete={() => setTimeout(() => setShowPartner2(true), 800)}
                    />
                  </h3>
                )}
                {showPartner2 && (
                  <h3 className="text-[160px] leading-tight font-bold text-white">
                    <TypingText
                      text={
                        wedding.mainCouple[1]?.name ||
                        (wedding.mainCouple[0]?.name ? 'Partner 2' : wedding.name)
                      }
                      delay={200}
                      speed={100}
                      onComplete={() => setTimeout(() => setShowLocation(true), 1000)}
                    />
                  </h3>
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
                    <h3 className="text-[160px] leading-tight font-bold text-white">
                      <TypingText
                        text={wedding.name}
                        delay={300}
                        speed={100}
                        onComplete={() => setTimeout(() => setShowTiedKnot(true), 800)}
                      />
                    </h3>
                  </motion.div>
                )}
                {showTiedKnot && (
                  <h3 className="text-[100px] font-semibold text-pink-300 leading-tight">
                    <TypingText
                      text="celebrated their special day"
                      delay={200}
                      speed={80}
                      onComplete={() => setTimeout(() => setShowLocation(true), 1000)}
                    />
                  </h3>
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
              <h3 className="mb-4 text-9xl text-white/80">
                <TypingText text="📍 Celebrated at" delay={300} speed={80} />
              </h3>
              <h3 className="text-[120px] font-bold text-white leading-tight">
                <TypingText
                  text={wedding.location}
                  delay={1500}
                  speed={90}
                  onComplete={() => setTimeout(() => setShowPhotos(true), 2000)}
                />
              </h3>
            </motion.div>
          )}

          {/* Trigger photos even if no location */}
          {!wedding.location && showLocation && (
            <div style={{ display: 'none' }}>
              {setTimeout(() => setShowPhotos(true), 2000)}
            </div>
          )}
        </>
      )}

      {!wedding && (
        <motion.h3
          className="text-9xl text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <TypingText text="A celebration of your special day" delay={800} speed={80} />
        </motion.h3>
      )}

      {/* Photo Overlay Animation */}
      {showPhotos && photos.length > 0 && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <AnimatePresence>
            {visiblePhotos.map((index) => {
              const photo = photos[index];
              if (!photo) return null;

              // Random position and rotation for each photo
              const randomX = Math.random() * 80 - 40; // -40% to 40%
              const randomY = Math.random() * 80 - 40;
              const randomRotate = Math.random() * 40 - 20; // -20deg to 20deg
              const size = Math.random() * 200 + 150; // 150px to 350px

              return (
                <motion.div
                  key={index}
                  className="absolute"
                  style={{
                    left: `${50 + randomX}%`,
                    top: `${50 + randomY}%`,
                    width: size,
                    height: size,
                  }}
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{
                    opacity: 0.8,
                    scale: 1,
                    rotate: randomRotate,
                  }}
                  transition={{
                    duration: 0.6,
                    type: 'spring',
                    bounce: 0.4,
                  }}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden border-4 border-white shadow-2xl">
                    <Image
                      src={photo.url}
                      alt={`Wedding photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export function IntroSlide({ wedding, photos }: IntroSlideProps) {
  return {
    background: FireworksParticles,
    content: <IntroSlideContent wedding={wedding} photos={photos} />,
  };
}
