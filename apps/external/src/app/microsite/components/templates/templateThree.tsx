import { RefObject, useEffect, useMemo, useState } from 'react';

import { Button } from '@shared/components/ui/button';
import { MultiSelectDropdown } from '@shared/components/ui/form/multiSelectDropdown';
import { Switch } from '@shared/components/ui/switch';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { GuestResponseDto, MicrositeResponseDto } from '@wedding/api-types';
import { Cormorant_Garamond, Nunito } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FaqAccordion from '../FaqAccordion';
import GalleryDialog from '../GalleryDialog';

// Clean, professional heading + friendly body
const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['600', '700'] });
const nunito = Nunito({ subsets: ['latin'] });

interface TemplateThreeProps {
  micrositeData: MicrositeResponseDto;
  rsvpRef: RefObject<HTMLDivElement | null>;
  guestDetails: GuestResponseDto | null;
  isWeddingLive: boolean;
  micrositeSlug: string;
  handleConfirmGuestAttendance: (allergies?: string[]) => Promise<void>;
}

// Predefined collage slots (deterministic to avoid hydration mismatch)
const COLLAGE_SLOTS = [
  { top: '8%', left: '6%', rotate: '-6deg', w: 180, h: 240, z: 10 },
  { top: '16%', left: '28%', rotate: '4deg', w: 220, h: 160, z: 20 },
  { top: '6%', left: '56%', rotate: '-2deg', w: 200, h: 260, z: 30 },
  { top: '24%', left: '74%', rotate: '7deg', w: 180, h: 200, z: 15 },
  { top: '46%', left: '8%', rotate: '8deg', w: 220, h: 180, z: 25 },
  { top: '52%', left: '32%', rotate: '-8deg', w: 200, h: 200, z: 35 },
  { top: '44%', left: '58%', rotate: '3deg', w: 220, h: 220, z: 18 },
  { top: '62%', left: '78%', rotate: '-5deg', w: 180, h: 220, z: 22 },
] as const;

export default function TemplateThree({
  micrositeData,
  rsvpRef,
  guestDetails,
  isWeddingLive,
  micrositeSlug,
  handleConfirmGuestAttendance,
}: TemplateThreeProps) {
  const isMobile = useIsMobileScreen();
  const router = useRouter();

  // Food allergies state
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  // Common allergen options
  const allergenOptions = [
    'None',
    'Shellfish',
    'Dairy',
    'Gluten',
    'Peanuts',
    'Beef',
    'Tree Nuts',
    'Eggs',
    'Soy',
    'Fish',
    'Pork',
    'Chicken',
    'Sesame',
  ];
  const [isDark, setIsDark] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  // Provide dummy guest details if none are supplied (useful for preview)
  type BasicGuest = {
    name: string;
    email: string;
    group: string;
    accompanyingGuests: Array<string | { name: string }>;
  };
  const fallbackGuest: BasicGuest = {
    name: 'Dummy Guest',
    email: 'dummy.guest@example.com',
    group: 'Dummy Group',
    accompanyingGuests: ['Dummy Guest Plus-One'],
  };
  const guest: BasicGuest = guestDetails
    ? {
        name: guestDetails.name ?? 'Dummy Guest',
        email: guestDetails.email ?? 'dummy.guest@example.com',
        group: guestDetails.group ?? 'Dummy Group',
        accompanyingGuests: Array.isArray(guestDetails.accompanyingGuests)
          ? guestDetails.accompanyingGuests.map((g) => g.name)
          : [],
      }
    : fallbackGuest;

  // Gallery sources
  const heroImages = useMemo(() => micrositeData?.heroImages ?? [], [micrositeData?.heroImages]);
  const firstHero = heroImages[0];

  // A gentle pulse for the center badge
  useEffect(() => {
    // no-op, but keep for potential client-only effects
  }, []);

  return (
    <main
      className={`${nunito.className} relative min-h-screen w-full overflow-x-hidden transition-colors duration-500 ${
        isDark ? 'dark bg-zinc-950 text-zinc-50' : 'bg-[#FFF7EC] text-zinc-900'
      }`}
    >
      {isWeddingLive && micrositeSlug && (
        <div className="absolute top-4 right-4 z-50 flex gap-3">
          <Button
            onClick={() => router.push(`/microsite/${micrositeSlug}/album`)}
            className="rounded-full bg-[#EADBC8] hover:bg-[#E5D4BE] text-stone-900 border border-stone-300"
          >
            View Album
          </Button>
          <Button
            onClick={() => router.push(`/cashgift/${micrositeData?.weddingId}`)}
            className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white rounded-full"
          >
            Cash Giftings
          </Button>
          <Button
            onClick={() => router.push(`/microsite/${micrositeSlug}/guestbook`)}
            className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white rounded-full"
          >
            View Guestbook
          </Button>
        </div>
      )}

      {/* Party Mode (dark) switch */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur px-3 py-2 shadow-sm">
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none">
            Dark Mode
          </span>
          <Switch aria-label="Toggle Dark Mode" checked={isDark} onCheckedChange={setIsDark} />
        </div>
      </div>

      {/* WILD HERO: Collage of scattered photos (beige + white palette) */}
      <section className="relative min-h-[95vh] w-full overflow-hidden">
        {/* soft wash: beige accents on white */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#F5E9D8_0%,transparent_42%),radial-gradient(circle_at_75%_65%,#FFF_0%,transparent_35%)] opacity-60 dark:opacity-15" />

        {/* Collage stage */}
        <div className="relative mx-auto max-w-[1400px] h-[95vh]">
          {/* Center title badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute -inset-6 -rotate-6 bg-[#F5E9D8]/40 dark:bg-[#F5E9D8]/20 blur-2xl rounded-full" />
              <div className="absolute -inset-4 rotate-6 bg-white/50 dark:bg-white/10 blur-xl rounded-full" />
              <div className="relative px-6 py-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 shadow-xl">
                <h1 className={`${serif.className} text-5xl sm:text-6xl md:text-7xl leading-none`}>
                  {micrositeData?.weddingName}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                  {micrositeData?.weddingDate
                    ? new Date(micrositeData.weddingDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : null}
                  {micrositeData?.weddingLocation ? (
                    <>
                      {micrositeData?.weddingDate ? ' · ' : ''}
                      {micrositeData.weddingLocation}
                    </>
                  ) : null}
                </p>
                <div className="mt-4">
                  <Button
                    onClick={() => rsvpRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="rounded-full bg-[#EADBC8] hover:bg-[#E5D4BE] text-stone-900 border border-stone-300"
                  >
                    RSVP Now
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Scattered cards (desktop) */}
          {!isMobile && (
            <>
              {(heroImages.length ? heroImages : (micrositeData?.imageGallery ?? []))
                .slice(0, 12)
                .map((src, i) => {
                  const slot = COLLAGE_SLOTS[i % COLLAGE_SLOTS.length];
                  return (
                    <div
                      key={`${src}-${i}`}
                      className="absolute will-change-transform"
                      style={{
                        top: slot.top,
                        left: slot.left,
                        zIndex: slot.z,
                        transform: `rotate(${slot.rotate})`,
                        width: slot.w,
                        height: slot.h,
                      }}
                    >
                      <div className="relative w-full h-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.35)] hover:scale-[1.03] hover:-rotate-1 transition-transform duration-300">
                        <Image
                          src={src}
                          alt={`hero-${i}`}
                          fill
                          className="object-cover select-none"
                        />
                        {/* tape corners in beige */}
                        <span className="pointer-events-none absolute -top-2 left-5 rotate-[8deg] bg-[#F5E9D8]/90 dark:bg-[#F5E9D8]/40 h-5 w-16 rounded-[2px]" />
                        <span className="pointer-events-none absolute -bottom-2 right-6 -rotate-[10deg] bg-white/80 dark:bg-white/10 h-5 w-14 rounded-[2px]" />
                      </div>
                    </div>
                  );
                })}
            </>
          )}

          {/* Mobile: a funky grid with slight tilts */}
          {isMobile && (
            <div className="absolute inset-0 z-10 px-4 pt-28">
              <div className="grid grid-cols-2 gap-3">
                {(heroImages.length ? heroImages : (micrositeData?.imageGallery ?? []))
                  .slice(0, 8)
                  .map((src, i) => (
                    <div
                      key={`${src}-${i}`}
                      className={`relative h-36 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow ${i % 3 === 0 ? 'rotate-2' : i % 3 === 1 ? '-rotate-2' : 'rotate-1'}`}
                    >
                      <Image src={src} alt={`hero-m-${i}`} fill className="object-cover" />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ZIGZAG SCHEDULE TIMELINE (neutral accents) */}
      <section className="relative mx-auto max-w-6xl px-4 py-16">
        <h2 className={`${serif.className} text-4xl text-center`}>The Big Day Timeline</h2>
        <p className="mt-1 text-center text-sm text-zinc-700 dark:text-zinc-300">
          Follow the fun — a little zig, a little zag.
        </p>
        <div className="relative mt-10">
          {/* center line */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#F5E9D8] to-white rounded-full opacity-80" />
          <ul className="space-y-10">
            {micrositeData?.schedule?.map((item, idx) => (
              <li key={idx} className="relative grid grid-cols-1 md:grid-cols-2 items-center">
                {/* Show item on left side for even indices (0, 2, 4...) */}
                {idx % 2 === 0 && (
                  <div className="md:pr-10 md:col-start-1">
                    <div className="inline-block max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/90 px-5 py-4 shadow-sm -rotate-2">
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                        {item.time}
                      </div>
                      <div className="mt-1 font-semibold text-lg">{item.title}</div>
                      {item.description ? (
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Show item on right side for odd indices (1, 3, 5...) */}
                {idx % 2 === 1 && (
                  <div className="md:pl-10 md:col-start-2">
                    <div className="inline-block max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/90 px-5 py-4 shadow-sm rotate-2">
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                        {item.time}
                      </div>
                      <div className="mt-1 font-semibold text-lg">{item.title}</div>
                      {item.description ? (
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQS with clean accents */}
      <section className="relative mx-auto max-w-5xl px-4 py-16">
        <div className="relative rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/90 p-6 md:p-8 shadow-lg -rotate-1">
          <div className="absolute -top-3 left-8 rotate-[8deg] bg-[#F5E9D8]/80 dark:bg-[#F5E9D8]/40 h-6 w-20 rounded-[3px]" />
          <div className="absolute -bottom-3 right-10 -rotate-[10deg] bg-white/80 dark:bg-white/10 h-6 w-16 rounded-[3px]" />
          <h2 className={`${serif.className} text-4xl text-center`}>FAQs</h2>
          <p className="mt-1 text-center text-sm text-zinc-700 dark:text-zinc-300">
            The quirky bits you might wonder about.
          </p>
          <div className="mt-6">
            <FaqAccordion items={micrositeData?.faqs ?? []} />
          </div>
        </div>
      </section>

      {/* Polaroid-ish Gallery */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className={`${serif.className} text-4xl text-center`}>Gallery</h2>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 text-center">
          Snapshots from the lovefest.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {micrositeData?.imageGallery?.slice(0, 9).map((src, idx) => (
            <div
              key={idx}
              className={`relative aspect-[3/4] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2 shadow hover:scale-[1.02] transition-transform ${
                idx % 3 === 0 ? '-rotate-2' : idx % 3 === 1 ? 'rotate-1' : 'rotate-2'
              }`}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image src={src} alt={`gallery-${idx}`} fill className="object-cover" />
              </div>
              <div className="absolute -top-2 left-6 rotate-[6deg] bg-[#F5E9D8]/90 dark:bg-[#F5E9D8]/40 h-5 w-16 rounded" />
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            variant={isDark ? 'outline' : 'darkOutline'}
            onClick={() => setIsGalleryOpen(true)}
          >
            View all photos
          </Button>
        </div>
        <GalleryDialog
          open={isGalleryOpen}
          onOpenChange={setIsGalleryOpen}
          images={micrositeData?.imageGallery ?? []}
        />
      </section>

      {/* RSVP */}
      <section ref={rsvpRef} className="mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-3xl border-2 border-dashed border-[#E8DFCF] dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/90 p-6 md:p-8 shadow relative">
          <div className="absolute -top-3 left-8 rotate-[8deg] bg-[#F5E9D8]/80 dark:bg-[#F5E9D8]/40 h-6 w-20 rounded-[3px]" />
          <div className="absolute -bottom-3 right-10 -rotate-[10deg] bg-white/80 dark:bg-white/10 h-6 w-16 rounded-[3px]" />
          <h2 className={`${serif.className} text-5xl`}>RSVP</h2>
          <p className="mt-2 text-base md:text-lg text-zinc-700 dark:text-zinc-300">
            Please review your details and confirm your attendance.
          </p>

          {firstHero && (
            <div className="mt-6">
              <div className="relative h-40 sm:h-56 w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                <Image
                  src={firstHero}
                  alt="RSVP hero"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 768px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
              </div>
            </div>
          )}

          {guest && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
                  <div className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Guest</div>
                  <div className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                    {guest.name}
                  </div>
                </div>
                {guest.email && guest.email.length > 0 && (
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
                    <div className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      Email
                    </div>
                    <div className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                      {guest.email}
                    </div>
                  </div>
                )}
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
                  <div className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Group</div>
                  <div className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                    {guest.group}
                  </div>
                </div>
                {guest.accompanyingGuests && guest.accompanyingGuests.length > 0 && (
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
                    <div className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      Accompanying Guests
                    </div>
                    <div className="mt-1 text-zinc-900 dark:text-zinc-100">
                      <ul className="space-y-0.5">
                        {guest.accompanyingGuests.map((g, idx) => (
                          <li key={idx} className="text-xs font-medium">
                            • {typeof g === 'string' ? g : g.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <MultiSelectDropdown
                  label="Food Allergies"
                  options={allergenOptions}
                  selected={selectedAllergies}
                  setSelected={setSelectedAllergies}
                  placeholder="Select any food allergies"
                  className="w-full"
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => handleConfirmGuestAttendance(selectedAllergies)}
                  className="w-full sm:w-auto rounded-full bg-[#EADBC8] hover:bg-[#E5D4BE] text-stone-900 border border-stone-300"
                >
                  Confirm Attendance
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
