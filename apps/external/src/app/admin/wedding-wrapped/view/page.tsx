'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { WeddingWrappedResponseDto } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, X } from 'lucide-react';
import { useWeddingStore } from '@/app/store/sessionStore';
import { AnalyticsService } from '@shared/api';
import { toast } from 'sonner';

import { AreYouReadySlide } from '@/app/components/dashboards/wedding-wrapped/slides/AreYouReadySlide';
import { IntroSlide } from '@/app/components/dashboards/wedding-wrapped/slides/IntroSlide';
import { GuestExperienceSlide } from '@/app/components/dashboards/wedding-wrapped/slides/GuestExperienceSlide';
import { GiftsSupportSlide } from '@/app/components/dashboards/wedding-wrapped/slides/GiftsSupportSlide';
import { PlanningJourneySlide } from '@/app/components/dashboards/wedding-wrapped/slides/PlanningJourneySlide';
import { MemoriesMomentsSlide } from '@/app/components/dashboards/wedding-wrapped/slides/MemoriesMomentsSlide';
import { MostFrequentPersonSlide } from '@/app/components/dashboards/wedding-wrapped/slides/MostFrequentPersonSlide';
import { WellWishesSlide } from '@/app/components/dashboards/wedding-wrapped/slides/WellWishesSlide';
import { FinalSlide } from '@/app/components/dashboards/wedding-wrapped/slides/FinalSlide';

// Music options
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
    name: 'Falling in Love',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1762230430/Elvis_Presley_-_Can_t_Help_Falling_In_Love_Official_Audio_blsm2i.mp3',
  },
];

// Type for slide content
interface SlideContent {
  background: () => React.ReactElement;
  content: React.ReactElement;
  musicIndex: number;
}

export default function WeddingWrappedViewPage() {
  const router = useRouter();
  const selectedWeddingId = useWeddingStore((state) => state.selectedWeddingId);
  const weddings = useWeddingStore((state) => state.weddings);
  const selectedWedding = weddings.find((w) => w.id === selectedWeddingId);

  const [data, setData] = useState<WeddingWrappedResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Fetch wedding wrapped data
  useEffect(() => {
    if (!selectedWeddingId) {
      router.push('/admin/wedding-wrapped');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const wrappedData =
          await AnalyticsService.analyticsControllerGetWeddingWrapped(selectedWeddingId);
        setData(wrappedData);
      } catch (error) {
        console.error('Error fetching Wedding Wrapped:', error);
        toast.error('Failed to load Wedding Wrapped');
        router.push('/admin/wedding-wrapped');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedWeddingId, router]);

  // Start playing music when component mounts
  useEffect(() => {
    if (audioRef.current && !isLoading && data) {
      audioRef.current.play().catch((error: unknown) => {
        console.log('Auto-play prevented:', error);
      });
    }
  }, [isLoading, data]);

  // Auto-scroll effect - smooth scroll to keep content visible
  useEffect(() => {
    if (isLoading || !data || !scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    let scrollInterval: NodeJS.Timeout;

    // Start auto-scrolling after a short delay
    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
          const currentScroll = scrollContainer.scrollTop;

          // If not at bottom, scroll down smoothly
          if (currentScroll < maxScroll) {
            scrollContainer.scrollTo({
              top: currentScroll + 2,
              behavior: 'smooth',
            });
          }
        }
      }, 50);
    };

    // Start scrolling after 2 seconds to let initial animations play
    const timeout = setTimeout(startScrolling, 2000);

    return () => {
      clearTimeout(timeout);
      clearInterval(scrollInterval);
    };
  }, [isLoading, data, currentSlide]);

  // Reset scroll position when slide changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentSlide]);

  // Each slide gets its own music track
  const getMusicIndexForSlide = (slideIndex: number): number => {
    return Math.min(slideIndex, audioOptions.length - 1);
  };

  // Change music when slide changes
  useEffect(() => {
    if (!audioRef.current || !data) return;

    const newMusicIndex = getMusicIndexForSlide(currentSlide);

    if (newMusicIndex !== currentMusicIndex) {
      setCurrentMusicIndex(newMusicIndex);
      const audio = audioRef.current;

      // Immediately stop old music and start new music
      audio.pause();
      const sourceElement = audio.querySelector('source');
      if (sourceElement) {
        sourceElement.src = audioOptions[newMusicIndex].url;
        audio.load();
        audio.volume = 1;
        audio.muted = isMuted;

        audio
          .play()
          .catch((error: unknown) => {
            console.log('Auto-play prevented:', error);
          });
      }
    }
  }, [currentSlide, currentMusicIndex, isMuted, data]);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      toast.success('Wedding Wrapped Saved!');
      setTimeout(() => {
        router.push('/admin/wedding-wrapped');
      }, 1000);
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save Wedding Wrapped');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    router.push('/admin/wedding-wrapped');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-2xl text-white">Loading Wedding Wrapped...</div>
      </div>
    );
  }

  if (!data || !selectedWedding) {
    return null;
  }

  const { guestInsights, giftSupportInsights, planningJourneyInsights, emotionalTouchInsights } =
    data;

  const slides: SlideContent[] = [
    { ...AreYouReadySlide({ wedding: selectedWedding }), musicIndex: 0 },
    { ...IntroSlide({ wedding: selectedWedding, photos: emotionalTouchInsights.photos }), musicIndex: 1 },
    { ...GuestExperienceSlide({ guestInsights, formatDate }), musicIndex: 2 },
    { ...GiftsSupportSlide({ giftSupportInsights, formatCurrency }), musicIndex: 3 },
    { ...PlanningJourneySlide({ planningJourneyInsights, formatCurrency }), musicIndex: 4 },
    { ...MemoriesMomentsSlide({ emotionalTouchInsights }), musicIndex: 5 },
    { ...MostFrequentPersonSlide({ emotionalTouchInsights }), musicIndex: 5 },
    { ...WellWishesSlide({ emotionalTouchInsights }), musicIndex: 6 },
    {
      ...FinalSlide({
        onSave: handleSave,
        isSaving,
        data,
        wedding: selectedWedding,
        formatCurrency,
        formatDate,
      }),
      musicIndex: 7,
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
    <div className="fixed inset-0 z-50 bg-black">
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

      {/* Content Overlay - FULLSCREEN WITH SCROLL */}
      <div ref={scrollContainerRef} className="relative z-10 h-full overflow-x-hidden overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-8 py-32">
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
      <div className="fixed right-0 bottom-8 left-0 z-20 flex items-center justify-center gap-6">
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
        onClick={handleClose}
        variant="ghost"
        size="icon"
        className="fixed top-8 right-8 z-20 h-12 w-12 rounded-full border border-white/40 bg-white/20 backdrop-blur-lg hover:bg-white/30"
      >
        <X className="h-6 w-6 text-white" />
      </Button>

      {/* Mute/Unmute Button */}
      <Button
        onClick={toggleMute}
        variant="ghost"
        size="icon"
        className="fixed top-8 right-24 z-20 h-12 w-12 rounded-full border border-white/40 bg-white/20 backdrop-blur-lg hover:bg-white/30"
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
    </div>
  );
}
