'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';

import { Canvas, useFrame } from '@react-three/fiber';
import { WeddingResponseDto, WeddingWrappedResponseDto } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, X } from 'lucide-react';
import * as THREE from 'three';

interface WeddingWrappedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: WeddingWrappedResponseDto | null;
  wedding: WeddingResponseDto | undefined;
  onSave: () => void;
  isSaving: boolean;
}

// Music options from slideshow
const audioOptions = [
  {
    name: 'Ry in the feels',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1760936505/slideshow-music-1_opllxe.mp3',
  },
  {
    name: 'Make a move',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1760936505/slideshow-music-3_iwnnif.mp3',
  },
  {
    name: 'Seal the deal',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1760936505/slideshow-music-2_y4n2dd.mp3',
  },
];

// Type definitions for particle userData
interface ParticleUserData {
  positions: number[];
  velocities: number[];
  time?: number;
  scales?: number[];
  phases?: number[];
}

// Type for slide statistics
interface SlideStatItem {
  label: string;
  value: number;
  color: string;
  delay: number;
}

interface SlideMemoryItem extends SlideStatItem {
  icon: string;
}

// Type for slide content
interface SlideContent {
  background: () => React.ReactElement;
  content: React.ReactElement;
}

// Confetti Particles for Guest Experience
function ConfettiParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 200;
  const dummy = new THREE.Object3D();

  useEffect(() => {
    if (!meshRef.current) return;

    const positions: number[] = [];
    const velocities: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        Math.random() * 15 + 5,
        (Math.random() - 0.5) * 20,
      );
      velocities.push(
        (Math.random() - 0.5) * 0.02,
        -Math.random() * 0.05 - 0.02,
        (Math.random() - 0.5) * 0.02,
      );
      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.8, 0.6);
      colors.push(color.r, color.g, color.b);
    }

    meshRef.current.userData = { positions, velocities } as ParticleUserData;

    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(
        i,
        new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]),
      );
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const userData = meshRef.current.userData as ParticleUserData;
    const { positions, velocities } = userData;
    if (!positions || !velocities) return;

    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      if (positions[i * 3 + 1] < -5) {
        positions[i * 3 + 1] = 15;
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }

      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.rotation.x += 0.02;
      dummy.rotation.y += 0.02;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.2, 0.2, 0.02]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}

// Floating Hearts for Gifts & Support
function FloatingHearts() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 100;
  const dummy = new THREE.Object3D();

  useEffect(() => {
    if (!meshRef.current) return;

    const positions: number[] = [];
    const velocities: number[] = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 15,
        Math.random() * 20 - 5,
        (Math.random() - 0.5) * 15,
      );
      velocities.push(Math.sin(i) * 0.01, Math.random() * 0.02 + 0.01, Math.cos(i) * 0.01);
    }

    meshRef.current.userData = { positions, velocities, time: 0 } as ParticleUserData;

    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.set(0.3, 0.3, 0.3);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const userData = meshRef.current.userData as ParticleUserData;
    const { positions, velocities, time } = userData;
    if (!positions || !velocities) return;

    const currentTime = (time || 0) + 0.01;
    userData.time = currentTime;

    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3] + Math.sin(currentTime + i) * 0.01;
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2] + Math.cos(currentTime + i) * 0.01;

      if (positions[i * 3 + 1] > 15) {
        positions[i * 3 + 1] = -5;
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      }

      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.rotation.y = currentTime + i;
      dummy.scale.set(
        0.3 + Math.sin(currentTime + i) * 0.1,
        0.3 + Math.sin(currentTime + i) * 0.1,
        0.3,
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#ff69b4" emissive="#ff1493" emissiveIntensity={0.5} />
    </instancedMesh>
  );
}

// Sparkling Stars for Planning Journey
function SparklingStars() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 150;
  const dummy = new THREE.Object3D();

  useEffect(() => {
    if (!meshRef.current) return;

    const positions: number[] = [];
    const scales: number[] = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
      );
      scales.push(Math.random() * 0.3 + 0.1);
    }

    meshRef.current.userData = { positions, velocities: [], scales, time: 0 } as ParticleUserData;

    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(scales[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const userData = meshRef.current.userData as ParticleUserData;
    const { positions, scales, time } = userData;
    if (!positions || !scales) return;

    const currentTime = (time || 0) + 0.02;
    userData.time = currentTime;

    for (let i = 0; i < count; i++) {
      const scale = scales[i] * (1 + Math.sin(currentTime * 2 + i) * 0.5);
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(scale);
      dummy.rotation.z = currentTime + i;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={0.8} />
    </instancedMesh>
  );
}

// Camera Flashes for Memories & Moments
function CameraFlashes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 80;
  const dummy = new THREE.Object3D();

  useEffect(() => {
    if (!meshRef.current) return;

    const positions: number[] = [];
    const phases: number[] = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      );
      phases.push(Math.random() * Math.PI * 2);
    }

    meshRef.current.userData = { positions, velocities: [], phases, time: 0 } as ParticleUserData;

    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(0.3);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const userData = meshRef.current.userData as ParticleUserData;
    const { positions, phases, time } = userData;
    if (!positions || !phases) return;

    const currentTime = (time || 0) + 0.05;
    userData.time = currentTime;

    for (let i = 0; i < count; i++) {
      const flash = Math.max(
        0,
        Math.sin(currentTime + phases[i]) * Math.sin(currentTime * 2 + phases[i]),
      );
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(0.3 + flash * 0.5);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
    </instancedMesh>
  );
}

// Text animation component
function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {text}
    </motion.span>
  );
}

// Word by word animation
function AnimatedWords({ text, startDelay = 0 }: { text: string; startDelay?: number }) {
  const words = text.split(' ');
  return (
    <span>
      {words.map((word, index) => (
        <span key={index}>
          <AnimatedText text={word} delay={startDelay + index * 0.1} />{' '}
        </span>
      ))}
    </span>
  );
}

export function WeddingWrappedModal({
  open,
  onOpenChange,
  data,
  wedding,
  onSave,
  isSaving,
}: WeddingWrappedModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (open) {
      setCurrentSlide(0);
      // Start playing music when modal opens
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error: unknown) => {
          console.log('Auto-play prevented:', error);
        });
      }
    } else {
      // Stop music when modal closes
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [open]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!data || !open) return null;

  const { guestInsights, giftSupportInsights, planningJourneyInsights, emotionalTouchInsights } =
    data;

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const slides: SlideContent[] = [
    // Intro Slide
    {
      background: ConfettiParticles,
      content: (
        <div className="text-center space-y-8 max-w-5xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <h1 className="text-8xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
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
                <p className="text-6xl text-white font-bold">
                  <AnimatedWords
                    text={`On ${new Date(wedding.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}`}
                    startDelay={0.6}
                  />
                </p>

                {wedding.mainCouple && wedding.mainCouple.length > 0 && (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  >
                    <p className="text-8xl text-white font-bold leading-tight">
                      <AnimatedWords
                        text={wedding.mainCouple[0]?.name || 'Partner 1'}
                        startDelay={1.3}
                      />
                    </p>
                    <p className="text-7xl text-pink-300 font-semibold">
                      <AnimatedWords text="tied the knot with" startDelay={1.9} />
                    </p>
                    <p className="text-8xl text-white font-bold leading-tight">
                      <AnimatedWords
                        text={
                          wedding.mainCouple[1]?.name ||
                          (wedding.mainCouple[0]?.name ? 'Partner 2' : wedding.name)
                        }
                        startDelay={2.5}
                      />
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {wedding.location && (
                <motion.div
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border-2 border-white/30 shadow-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3.2, duration: 0.8 }}
                >
                  <p className="text-4xl text-white/80 mb-4">
                    <AnimatedWords text="📍 Celebrated at" startDelay={3.3} />
                  </p>
                  <p className="text-6xl text-white font-bold">
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
    },

    // Guest Experience
    {
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
    },

    // Gifts & Support
    {
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
    },

    // Planning Journey
    {
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
    },

    // Memories & Moments
    {
      background: CameraFlashes,
      content: (
        <div className="space-y-8 max-w-4xl">
          <motion.h2
            className="text-6xl font-bold text-white mb-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            Memories & Moments
          </motion.h2>

          <div className="grid grid-cols-2 gap-8">
            {(
              [
                {
                  label: 'Photos Uploaded',
                  value: emotionalTouchInsights.totalPhotos,
                  color: 'from-orange-400 to-red-600',
                  icon: '📸',
                  delay: 0.3,
                },
                {
                  label: 'Well Wishes',
                  value: emotionalTouchInsights.totalWellWishes,
                  color: 'from-purple-400 to-pink-600',
                  icon: '💌',
                  delay: 0.5,
                },
                {
                  label: 'Faces Detected',
                  value: emotionalTouchInsights.totalFacesDetected,
                  color: 'from-blue-400 to-cyan-600',
                  icon: '👥',
                  delay: 0.7,
                },
                {
                  label: 'Unique People',
                  value: emotionalTouchInsights.totalPeopleClusters,
                  color: 'from-green-400 to-teal-600',
                  icon: '✨',
                  delay: 0.9,
                },
              ] as const satisfies readonly SlideMemoryItem[]
            ).map((item, idx) => (
              <motion.div
                key={idx}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 text-center shadow-2xl`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: item.delay, duration: 0.6 }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-5xl font-bold text-white mb-2">{item.value}</div>
                <div className="text-xl text-white/90">{item.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <p className="text-3xl text-white">
              <AnimatedWords
                text="These moments will last forever in your hearts"
                startDelay={1.4}
              />
            </p>
          </motion.div>
        </div>
      ),
    },

    // Final Slide
    {
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
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* THREE.js Background */}
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              <Suspense fallback={null}>
                <AnimatePresence mode="wait">
                  {React.createElement(slides[currentSlide].background)}
                </AnimatePresence>
              </Suspense>
            </Canvas>
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="w-full flex items-center justify-center"
              >
                {slides[currentSlide].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6 z-20">
            <Button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              size="lg"
              className="rounded-full w-12 h-12 p-0 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-4 border-white shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 flex items-center justify-center"
            >
              <ChevronLeft className="w-8 h-8 text-white" strokeWidth={4} />
            </Button>

            {/* Progress Dots */}
            <div className="flex gap-2 px-4 py-2 bg-black/40 backdrop-blur-lg rounded-full border border-white/30">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-white w-6 h-2'
                      : 'bg-white/50 hover:bg-white/80 w-2 h-2'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              size="lg"
              className="rounded-full w-12 h-12 p-0 bg-gradient-to-br from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-4 border-white shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 flex items-center justify-center"
            >
              <ChevronRight className="w-8 h-8 text-white" strokeWidth={4} />
            </Button>
          </div>

          {/* Close Button */}
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            size="icon"
            className="absolute top-8 right-8 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg border border-white/40 hover:bg-white/30"
          >
            <X className="w-6 h-6 text-white" />
          </Button>

          {/* Mute/Unmute Button */}
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="icon"
            className="absolute top-8 right-24 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg border border-white/40 hover:bg-white/30"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </Button>

          {/* Background Music */}
          <audio ref={audioRef} loop>
            <source src={audioOptions[0].url} type="audio/mpeg" />
          </audio>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
