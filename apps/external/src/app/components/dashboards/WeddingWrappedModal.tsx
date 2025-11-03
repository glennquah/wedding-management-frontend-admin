'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';

import { Canvas } from '@react-three/fiber';
import { WeddingResponseDto, WeddingWrappedResponseDto, WeddingsService } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, X } from 'lucide-react';

import { AreYouReadySlide } from './wedding-wrapped/slides/AreYouReadySlide';
import { IntroSlide } from './wedding-wrapped/slides/IntroSlide';
import { GuestExperienceSlide } from './wedding-wrapped/slides/GuestExperienceSlide';
import { GiftsSupportSlide } from './wedding-wrapped/slides/GiftsSupportSlide';
import { PlanningJourneySlide } from './wedding-wrapped/slides/PlanningJourneySlide';
import { MemoriesMomentsSlide } from './wedding-wrapped/slides/MemoriesMomentsSlide';
import { SummarySlide } from './wedding-wrapped/slides/SummarySlide';
import { FinalSlide } from './wedding-wrapped/slides/FinalSlide';

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
    name: 'Marry You',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1762106255/Bruno_Mars_-_Marry_You_Official_Lyric_Video_qscqiz.mp3',
  },
  {
    name: 'Shut Up and Dance',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1762106745/WALK_THE_MOON_-_Shut_Up_and_Dance_Lyrics_v7otzn.mp3',
  },
  {
    name: 'Dance with somebody',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1762106183/TRIMMED_ennzu7.m4a',
  },
  {
    name: 'Love i need',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1762106383/LOVE_I_NEED_byaho0.m4a',
  },
  {
    name: 'DANCE',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1762106594/DANCE_mz2tfq.m4a',
  },
  {
    name: 'SUGAR',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1762106687/sugar_wuc7u9.m4a',
  },
  {
    name: 'SUGAR',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1762106687/sugar_wuc7u9.m4a',
  },
  {
    name: '24K',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1762106463/24K_pjbqiv.m4a',
  },
];

// Type for slide content
interface SlideContent {
  background: () => React.ReactElement;
  content: React.ReactElement;
  musicIndex: number;
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
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [fullWedding, setFullWedding] = useState<WeddingResponseDto | undefined>(wedding);

  // Fetch full wedding details when modal opens
  useEffect(() => {
    if (open && wedding?.id) {
      const fetchFullWedding = async () => {
        try {
          const weddingDetails = await WeddingsService.weddingControllerFindOne(wedding.id);
          setFullWedding(weddingDetails);
        } catch (error) {
          console.error('Error fetching wedding details:', error);
          // Fall back to the wedding prop if fetch fails
          setFullWedding(wedding);
        }
      };
      fetchFullWedding();
    }
  }, [open, wedding]);

  useEffect(() => {
    if (open) {
      setCurrentSlide(0);
      setCurrentMusicIndex(0);
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

  // Each slide gets its own music track
  const getMusicIndexForSlide = (slideIndex: number): number => {
    // Ensure we don't exceed available music tracks
    return Math.min(slideIndex, audioOptions.length - 1);
  };

  // Change music when slide changes
  useEffect(() => {
    if (!open || !audioRef.current || !data) return;

    const newMusicIndex = getMusicIndexForSlide(currentSlide);

    if (newMusicIndex !== currentMusicIndex) {
      setCurrentMusicIndex(newMusicIndex);
      const audio = audioRef.current;

      // Fade out old music
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume = Math.max(0, audio.volume - 0.1);
        } else {
          clearInterval(fadeOut);
          audio.pause();

          // Change source and fade in new music
          const sourceElement = audio.querySelector('source');
          if (sourceElement) {
            sourceElement.src = audioOptions[newMusicIndex].url;
            audio.load();
            audio.volume = 0;
            audio.muted = isMuted;

            audio
              .play()
              .then(() => {
                const fadeIn = setInterval(() => {
                  if (audio.volume < 0.9) {
                    audio.volume = Math.min(1, audio.volume + 0.1);
                  } else {
                    audio.volume = 1;
                    clearInterval(fadeIn);
                  }
                }, 50);
              })
              .catch((error: unknown) => {
                console.log('Auto-play prevented:', error);
              });
          }
        }
      }, 50);
    }
  }, [currentSlide, open, currentMusicIndex, isMuted, data]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

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

  if (!data || !open) return null;

  const { guestInsights, giftSupportInsights, planningJourneyInsights, emotionalTouchInsights } =
    data;

  const slides: SlideContent[] = [
    // ARE YOU READY Slide - Marry You
    { ...AreYouReadySlide({ wedding: fullWedding }), musicIndex: 0 },
    // Intro Slide - Shut Up and Dance
    { ...IntroSlide({ wedding: fullWedding }), musicIndex: 1 },
    // Guest Experience - Dance with somebody
    { ...GuestExperienceSlide({ guestInsights, formatDate }), musicIndex: 2 },
    // Gifts & Support - Love i need
    { ...GiftsSupportSlide({ giftSupportInsights, formatCurrency }), musicIndex: 3 },
    // Planning Journey - DANCE
    { ...PlanningJourneySlide({ planningJourneyInsights, formatCurrency }), musicIndex: 4 },
    // Memories & Moments - SUGAR
    { ...MemoriesMomentsSlide({ emotionalTouchInsights }), musicIndex: 5 },
    // Summary Slide - SUGAR (same music)
    { ...SummarySlide({ data, wedding: fullWedding, formatCurrency, formatDate }), musicIndex: 5 },
    // Final Slide - 24K
    { ...FinalSlide({ onSave, isSaving }), musicIndex: 7 },
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
          {/* THREE.js Background - FULLSCREEN SPOTIFY WRAPPED STYLE */}
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
              <ambientLight intensity={0.8} />
              <pointLight position={[20, 20, 20]} intensity={2} />
              <pointLight position={[-20, -20, -20]} intensity={1} />
              <pointLight position={[0, 20, 10]} intensity={1.5} color="#ff69b4" />
              <Suspense fallback={null}>
                <AnimatePresence mode="wait">
                  {React.createElement(slides[currentSlide].background)}
                </AnimatePresence>
              </Suspense>
            </Canvas>
          </div>

          {/* Content Overlay - WITH SCROLLING */}
          <div className="relative z-10 flex h-full items-center justify-center p-8 overflow-hidden">
            <div className="w-full h-full overflow-y-auto overflow-x-hidden flex items-center justify-center py-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="flex w-full items-center justify-center"
                >
                  {slides[currentSlide].content}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute right-0 bottom-8 left-0 z-20 flex items-center justify-center gap-6">
            <Button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              size="lg"
              className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-purple-500 to-pink-500 p-0 shadow-2xl transition-all hover:scale-110 hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-8 w-8 text-white" strokeWidth={4} />
            </Button>

            {/* Progress Dots */}
            <div className="flex gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 backdrop-blur-lg">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`rounded-full transition-all ${
                    index === currentSlide
                      ? 'h-2 w-6 bg-white'
                      : 'h-2 w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              size="lg"
              className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-pink-500 to-purple-500 p-0 shadow-2xl transition-all hover:scale-110 hover:from-pink-600 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-8 w-8 text-white" strokeWidth={4} />
            </Button>
          </div>

          {/* Close Button */}
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            size="icon"
            className="absolute top-8 right-8 z-20 h-12 w-12 rounded-full border border-white/40 bg-white/20 backdrop-blur-lg hover:bg-white/30"
          >
            <X className="h-6 w-6 text-white" />
          </Button>

          {/* Mute/Unmute Button */}
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="icon"
            className="absolute top-8 right-24 z-20 h-12 w-12 rounded-full border border-white/40 bg-white/20 backdrop-blur-lg hover:bg-white/30"
          >
            {isMuted ? (
              <VolumeX className="h-6 w-6 text-white" />
            ) : (
              <Volume2 className="h-6 w-6 text-white" />
            )}
          </Button>

          {/* Background Music */}
          <audio ref={audioRef} loop>
            <source src={audioOptions[currentMusicIndex].url} type="audio/mpeg" />
          </audio>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
