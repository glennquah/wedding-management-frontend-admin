import { RefObject, useEffect, useState } from 'react';

import FaqAccordion from '../FaqAccordion';
import GalleryDialog from '../GalleryDialog';
import { Button } from '@shared/components/ui/button';
import { MultiSelectDropdown } from '@shared/components/ui/form/multiSelectDropdown';
import { Switch } from '@shared/components/ui/switch';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { GuestResponseDto, MicrositeResponseDto } from '@wedding/api-types';
import { Alex_Brush, Montserrat } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Use Montserrat for body text within this template only
const montserrat = Montserrat({ subsets: ['latin'] });

const alexBrush = Alex_Brush({ weight: '400', subsets: ['latin'] });

interface TemplateOneProps {
  micrositeData?: MicrositeResponseDto;
  rsvpRef: RefObject<HTMLDivElement | null>;
  guestDetails?: GuestResponseDto | null;
  isWeddingLive: boolean;
  micrositeSlug: string;
  handleConfirmGuestAttendance?: (allergies?: string[]) => Promise<void>;
  hasWishlistItems?: boolean;
}

export default function TemplateOne({
  micrositeData,
  rsvpRef,
  guestDetails,
  isWeddingLive,
  micrositeSlug,
  handleConfirmGuestAttendance,
  hasWishlistItems = false,
}: TemplateOneProps) {
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

  // Carousel state
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    if (!micrositeData?.heroImages?.length) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % (micrositeData?.heroImages?.length ?? 1));
        setFade(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [micrositeData?.heroImages?.length]);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isHeroPortrait, setIsHeroPortrait] = useState<boolean | null>(null);

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

  const firstHero = micrositeData?.heroImages?.[0];

  return (
    <>
      <main
        className={`${montserrat.className} relative min-h-screen w-full transition-colors duration-500 ${!isMobile && 'pt-20'}  ${
          isDark ? 'dark bg-gray-modern-950 text-white' : 'bg-brand-25 text-black'
        }`}
      >
        {/* Sticky Dark Mode Switch */}
        <div className="fixed right-0 bottom-4 z-50">
          <div className="max-w-6xl mx-auto px-4 flex justify-end">
            <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-modern-900/80 backdrop-blur px-3 py-2 shadow-sm">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 select-none">
                Dark Mode
              </span>
              <Switch aria-label="Toggle Dark Mode" checked={isDark} onCheckedChange={setIsDark} />
            </div>
          </div>
        </div>
        <section className="relative min-h-[70vh] w-full flex items-center justify-center bg-base-black overflow-hidden ">
          <div className="absolute inset-0 w-full h-full z-0">
            {micrositeData?.heroImages?.map((src, idx) => (
              <Image
                key={src}
                src={src}
                alt="wedding hero"
                fill
                priority={idx === 0}
                className={`object-cover w-full h-full absolute inset-0 transition-opacity duration-500 ${
                  idx === current && fade ? 'opacity-70' : 'opacity-0'
                }`}
                style={{ transitionProperty: 'opacity' }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-black/30 z-10" />

          {micrositeSlug && (
            <div className="absolute top-4 right-4 z-50 flex gap-3">
              {hasWishlistItems && (
                <Button
                  onClick={() => router.push(`/microsite/${micrositeSlug}/wishlist`)}
                  className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white rounded-full"
                >
                  Wishlist
                </Button>
              )}
              {isWeddingLive && (
                <>
                  <Button
                    onClick={() => router.push(`/microsite/${micrositeSlug}/album`)}
                    className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white rounded-full"
                  >
                    View Album
                  </Button>
                  <Button
                    onClick={() => router.push(`/microsite/${micrositeSlug}/guestbook`)}
                    className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white rounded-full"
                  >
                    View Guestbook
                  </Button>
                </>
              )}
            </div>
          )}

          <div className="relative z-20 flex flex-col items-center justify-center text-center w-full px-6 sm:px-20 gap-3">
            <h1
              className={`${alexBrush.className} text-4xl sm:text-6xl text-base-white drop-shadow-lg`}
            >
              {micrositeData?.weddingName}
            </h1>
            <p className="text-base sm:text-lg text-white/85">
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
            <div className="mt-1">
              <Button
                variant={'outline'}
                onClick={() => rsvpRef.current?.scrollIntoView({ behavior: 'smooth' })}
              >
                RSVP Now
              </Button>
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section className="mx-auto max-w-4xl px-4 py-12">
          <h2
            className={`${alexBrush.className} text-2xl font-semibold text-gray-900 dark:text-white text-center`}
          >
            Wedding Schedule
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 text-center">
            Here’s the plan for the day.
          </p>
          <div className="mt-8">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {micrositeData?.schedule?.map((item, idx) => (
                <li
                  key={idx}
                  className="py-5 grid grid-cols-1 sm:grid-cols-[7rem_1fr] gap-4 items-start"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                    {item.time}
                  </div>
                  <div>
                    <div className="text-gray-900 dark:text-white font-medium">{item.title}</div>
                    {item.description ? (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mx-auto max-w-4xl px-4 py-12">
          <h2
            className={`${alexBrush.className} text-2xl font-semibold text-gray-900 dark:text-white text-center`}
          >
            FAQs
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 text-center">
            Everything you might wonder.
          </p>
          <div className="mt-6">
            <FaqAccordion items={micrositeData?.faqs ?? []} />
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2
            className={`${alexBrush.className} text-2xl font-semibold text-gray-900 dark:text-white text-center`}
          >
            Gallery
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 text-center">
            A few moments we love.
          </p>
          <div className="mt-8 columns-1 sm:columns-2 md:columns-3 gap-3 space-y-3">
            {micrositeData?.imageGallery?.slice(0, 6).map((src, idx) => (
              <div key={idx} className="break-inside-avoid mb-3 group">
                <div className="relative overflow-hidden">
                  <Image
                    src={src}
                    alt={`gallery-${idx}`}
                    width={400}
                    height={600}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.015] group-hover:brightness-90 rounded-lg"
                  />
                </div>
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
        {/* RSVP: portrait image on the left, content on the right */}
        <section ref={rsvpRef} className="mx-auto max-w-4xl px-4 py-12">
          <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-gray-100 dark:bg-stone-900 p-6 shadow-sm transition-colors duration-500">
            {firstHero ? (
              isHeroPortrait ? (
                <div className="md:flex md:items-stretch md:gap-6">
                  {/* Left: portrait image */}
                  <div className="relative mx-auto md:mx-0 h-56 w-40 sm:h-64 sm:w-48 md:self-stretch md:h-auto md:w-56 lg:w-64 xl:w-72 overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800">
                    <Image
                      src={firstHero}
                      alt="RSVP hero"
                      fill
                      sizes="(max-width: 640px) 100vw, 768px"
                      className="object-cover"
                      onLoadingComplete={(img) => {
                        try {
                          const portrait = img.naturalHeight > img.naturalWidth;
                          setIsHeroPortrait(portrait);
                        } catch {}
                      }}
                    />
                  </div>
                  {/* Right: header, subtitle and details */}
                  <div className="mt-6 md:mt-0 flex-1">
                    <h2
                      className={`${alexBrush.className} text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100`}
                    >
                      RSVP
                    </h2>
                    <p
                      className={`mt-2 ${montserrat.className} sm:text-lg text-stone-700 dark:text-stone-300`}
                    >
                      Please review your details and confirm your attendance.
                    </p>
                    {guest && (
                      <div className="mt-6 space-y-4">
                        <div className="border-b border-stone-200 dark:border-stone-700 pb-4">
                          <h4
                            className={`${alexBrush.className} text-base font-medium text-stone-900 dark:text-stone-100 mb-3`}
                          >
                            Your Details
                          </h4>
                          <div className={`grid grid-cols-1 gap-3  ${montserrat.className} `}>
                            <div className="bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-3 transition-colors duration-500">
                              <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                                Guest
                              </div>
                              <div className="mt-1 font-semibold text-stone-900 dark:text-stone-100 text-sm">
                                {guest.name}
                              </div>
                            </div>
                            {guest.email && guest.email.length > 0 && (
                              <div className="bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-3 transition-colors duration-500">
                                <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                                  Email
                                </div>
                                <div className="mt-1 font-semibold text-stone-900 dark:text-stone-100 text-sm">
                                  {guest.email}
                                </div>
                              </div>
                            )}
                            <div className="bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-3 transition-colors duration-500">
                              <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                                Group
                              </div>
                              <div className="mt-1 font-semibold text-stone-900 dark:text-stone-100 text-sm">
                                {guest.group}
                              </div>
                            </div>
                            {guest.accompanyingGuests && guest.accompanyingGuests.length > 0 && (
                              <div className="bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-3 transition-colors duration-500">
                                <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                                  Accompanying Guests
                                </div>
                                <div className="mt-1 text-stone-900 dark:text-stone-100">
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
                        </div>
                        <div className="flex justify-end pt-2">
                          <Button
                            onClick={() => handleConfirmGuestAttendance?.(selectedAllergies)}
                            className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white rounded-full"
                          >
                            Confirm Attendance
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Landscape or unknown orientation: show image with overlay title
                <div className="mb-6">
                  <div className="relative h-40 sm:h-56 w-full overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800">
                    <Image
                      src={firstHero}
                      alt="RSVP hero"
                      fill
                      sizes="(max-width: 640px) 100vw, 768px"
                      className="object-cover"
                      onLoadingComplete={(img) => {
                        try {
                          const portrait = img.naturalHeight > img.naturalWidth;
                          setIsHeroPortrait(portrait);
                        } catch {}
                      }}
                    />
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="absolute inset-0 z-20 flex items-end justify-center p-3 sm:p-4">
                      <div className="text-center">
                        <h2
                          className={`${alexBrush.className} text-4xl sm:text-5xl text-white drop-shadow-md`}
                        >
                          RSVP
                        </h2>
                        <p className="mt-2 text-sm sm:text-base md:text-lg text-white/90">
                          Please review your details and confirm your attendance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              // No image available: simple header and subtitle
              <div className="mb-6">
                <h2
                  className={`${alexBrush.className} text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 mb-2`}
                >
                  RSVP
                </h2>
                <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300">
                  Please review your details and confirm your attendance.
                </p>
              </div>
            )}

            {/* Details block for non-portrait (or no image) layouts */}
            {(!isHeroPortrait || !firstHero) && guest && (
              <div className="space-y-4">
                <div className="border-b border-stone-200 dark:border-stone-700 pb-4">
                  <h4
                    className={`${alexBrush.className} text-base font-medium text-stone-900 dark:text-stone-100 mb-3`}
                  >
                    Your Details
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-3 transition-colors duration-500">
                      <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                        Guest
                      </div>
                      <div className="mt-1 font-semibold text-stone-900 dark:text-stone-100 text-sm">
                        {guest.name}
                      </div>
                    </div>
                    {guest.email && guest.email.length > 0 && (
                      <div className="bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-3 transition-colors duration-500">
                        <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                          Email
                        </div>
                        <div className="mt-1 font-semibold text-stone-900 dark:text-stone-100 text-sm">
                          {guest.email}
                        </div>
                      </div>
                    )}
                    <div className="bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-3 transition-colors duration-500">
                      <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                        Group
                      </div>
                      <div className="mt-1 font-semibold text-stone-900 dark:text-stone-100 text-sm">
                        {guest.group}
                      </div>
                    </div>
                    {guest.accompanyingGuests && guest.accompanyingGuests.length > 0 && (
                      <div className="bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-3 transition-colors duration-500">
                        <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                          Accompanying Guests
                        </div>
                        <div className="mt-1 text-stone-900 dark:text-stone-100">
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
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => handleConfirmGuestAttendance?.(selectedAllergies)}
                    className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white rounded-full"
                  >
                    Confirm Attendance
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
