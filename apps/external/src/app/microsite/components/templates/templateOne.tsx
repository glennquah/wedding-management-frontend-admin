import { RefObject, useEffect, useState } from 'react';

import { WeddingsService } from '@shared/api/services/WeddingsService';
import { Button } from '@shared/components/ui/button';
import { MultiSelectDropdown } from '@shared/components/ui/form/multiSelectDropdown';
import { Switch } from '@shared/components/ui/switch';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { GuestResponseDto, MicrositeResponseDto } from '@wedding/api-types';
import { Alex_Brush, Montserrat } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FaqAccordion from '../FaqAccordion';
import GalleryDialog from '../GalleryDialog';

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

  // QR code availability state
  const [hasQRCode, setHasQRCode] = useState<boolean>(false);

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

  // Fetch wedding data to check if QR code exists
  useEffect(() => {
    const checkQRCode = async () => {
      if (isWeddingLive && micrositeData?.weddingId) {
        try {
          const weddingData = await WeddingsService.weddingControllerFindPublic(
            micrositeData.weddingId,
          );
          setHasQRCode(!!weddingData.payLahQR);
        } catch (error) {
          // If fetching fails, assume no QR code
          setHasQRCode(false);
        }
      }
    };
    checkQRCode();
  }, [isWeddingLive, micrositeData?.weddingId]);

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
        className={`${montserrat.className} relative min-h-screen w-full transition-colors duration-500 ${!isMobile && 'pt-20'} ${
          isDark ? 'dark bg-gray-modern-950 text-white' : 'bg-brand-25 text-black'
        }`}
      >
        {/* Sticky Dark Mode Switch */}
        <div className="fixed right-0 bottom-4 z-50">
          <div className="mx-auto flex max-w-6xl justify-end px-4">
            <div className="dark:bg-gray-modern-900/80 pointer-events-auto inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-2 shadow-sm backdrop-blur dark:border-gray-700">
              <span className="text-xs font-medium text-gray-700 select-none dark:text-gray-300">
                Dark Mode
              </span>
              <Switch aria-label="Toggle Dark Mode" checked={isDark} onCheckedChange={setIsDark} />
            </div>
          </div>
        </div>
        <section className="bg-base-black relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 h-full w-full">
            {micrositeData?.heroImages?.map((src, idx) => (
              <Image
                key={src}
                src={src}
                alt="wedding hero"
                fill
                priority={idx === 0}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  idx === current && fade ? 'opacity-70' : 'opacity-0'
                }`}
                style={{ transitionProperty: 'opacity' }}
              />
            ))}
          </div>
          <div className="absolute inset-0 z-10 bg-black/30" />
          {hasWishlistItems && (
            <div className="absolute top-4 right-4 z-50 flex gap-3">
              <Button
                onClick={() => router.push(`/microsite/${micrositeSlug}/wishlist`)}
                className="w-full rounded-full bg-amber-700 text-white hover:bg-amber-800 sm:w-auto"
              >
                Wishlist
              </Button>
            </div>
          )}
          {isWeddingLive && (
            <div className="absolute top-4 right-4 z-50 flex gap-3">
              <Button
                onClick={() => router.push(`/microsite/${micrositeSlug}/album`)}
                className="w-full rounded-full bg-amber-700 text-white hover:bg-amber-800 sm:w-auto"
              >
                View Album
              </Button>
              <Button
                onClick={() => router.push(`/microsite/${micrositeSlug}/guestbook`)}
                className="w-full rounded-full bg-amber-700 text-white hover:bg-amber-800 sm:w-auto"
              >
                View Guestbook
              </Button>
              {hasQRCode && (
                <Button
                  onClick={() =>
                    router.push(`/microsite/${micrositeSlug}/cashgift/${micrositeData?.weddingId}`)
                  }
                  className="w-full rounded-full bg-amber-700 text-white hover:bg-amber-800 sm:w-auto"
                >
                  Cash Giftings
                </Button>
              )}
            </div>
          )}

          <div className="relative z-20 flex w-full flex-col items-center justify-center gap-3 px-6 text-center sm:px-20">
            <h1
              className={`${alexBrush.className} text-base-white text-4xl drop-shadow-lg sm:text-6xl`}
            >
              {micrositeData?.weddingName}
            </h1>
            <p className="text-base text-white/85 sm:text-lg">
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
            className={`${alexBrush.className} text-center text-2xl font-semibold text-gray-900 dark:text-white`}
          >
            Wedding Schedule
          </h2>
          <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-300">
            Here’s the plan for the day.
          </p>
          <div className="mt-8">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {micrositeData?.schedule?.map((item, idx) => (
                <li
                  key={idx}
                  className="grid grid-cols-1 items-start gap-4 py-5 sm:grid-cols-[7rem_1fr]"
                >
                  <div className="text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-gray-300">
                    {item.time}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.title}</div>
                    {item.description ? (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
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
            className={`${alexBrush.className} text-center text-2xl font-semibold text-gray-900 dark:text-white`}
          >
            FAQs
          </h2>
          <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-300">
            Everything you might wonder.
          </p>
          <div className="mt-6">
            <FaqAccordion items={micrositeData?.faqs ?? []} />
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2
            className={`${alexBrush.className} text-center text-2xl font-semibold text-gray-900 dark:text-white`}
          >
            Gallery
          </h2>
          <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-300">
            A few moments we love.
          </p>
          <div className="mt-8 columns-1 gap-3 space-y-3 sm:columns-2 md:columns-3">
            {micrositeData?.imageGallery?.slice(0, 6).map((src, idx) => (
              <div key={idx} className="group mb-3 break-inside-avoid">
                <div className="relative overflow-hidden">
                  <Image
                    src={src}
                    alt={`gallery-${idx}`}
                    width={400}
                    height={600}
                    className="h-auto w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-[1.015] group-hover:brightness-90"
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
          <div className="rounded-xl border border-stone-200 bg-gray-100 p-6 shadow-sm transition-colors duration-500 dark:border-stone-700 dark:bg-stone-900">
            {firstHero ? (
              isHeroPortrait ? (
                <div className="md:flex md:items-stretch md:gap-6">
                  {/* Left: portrait image */}
                  <div className="relative mx-auto h-56 w-40 overflow-hidden rounded-lg border border-stone-200 bg-stone-50 sm:h-64 sm:w-48 md:mx-0 md:h-auto md:w-56 md:self-stretch lg:w-64 xl:w-72 dark:border-stone-700 dark:bg-stone-800">
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
                  <div className="mt-6 flex-1 md:mt-0">
                    <h2
                      className={`${alexBrush.className} text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-100`}
                    >
                      RSVP
                    </h2>
                    <p
                      className={`mt-2 ${montserrat.className} text-stone-700 sm:text-lg dark:text-stone-300`}
                    >
                      Please review your details and confirm your attendance.
                    </p>
                    {guest && (
                      <div className="mt-6 space-y-4">
                        <div className="border-b border-stone-200 pb-4 dark:border-stone-700">
                          <h4
                            className={`${alexBrush.className} mb-3 text-base font-medium text-stone-900 dark:text-stone-100`}
                          >
                            Your Details
                          </h4>
                          <div className={`grid grid-cols-1 gap-3 ${montserrat.className} `}>
                            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 transition-colors duration-500 dark:border-stone-700 dark:bg-stone-800">
                              <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                                Guest
                              </div>
                              <div className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">
                                {guest.name}
                              </div>
                            </div>
                            {guest.email && guest.email.length > 0 && (
                              <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 transition-colors duration-500 dark:border-stone-700 dark:bg-stone-800">
                                <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                                  Email
                                </div>
                                <div className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">
                                  {guest.email}
                                </div>
                              </div>
                            )}
                            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 transition-colors duration-500 dark:border-stone-700 dark:bg-stone-800">
                              <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                                Group
                              </div>
                              <div className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">
                                {guest.group}
                              </div>
                            </div>
                            {guest.accompanyingGuests && guest.accompanyingGuests.length > 0 && (
                              <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 transition-colors duration-500 dark:border-stone-700 dark:bg-stone-800">
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
                            className="w-full rounded-full bg-amber-700 text-white hover:bg-amber-800 sm:w-auto"
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
                  <div className="relative h-40 w-full overflow-hidden rounded-lg border border-stone-200 bg-stone-50 sm:h-56 dark:border-stone-700 dark:bg-stone-800">
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
                          className={`${alexBrush.className} text-4xl text-white drop-shadow-md sm:text-5xl`}
                        >
                          RSVP
                        </h2>
                        <p className="mt-2 text-sm text-white/90 sm:text-base md:text-lg">
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
                  className={`${alexBrush.className} mb-2 text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-100`}
                >
                  RSVP
                </h2>
                <p className="text-base text-stone-700 sm:text-lg dark:text-stone-300">
                  Please review your details and confirm your attendance.
                </p>
              </div>
            )}

            {/* Details block for non-portrait (or no image) layouts */}
            {(!isHeroPortrait || !firstHero) && guest && (
              <div className="space-y-4">
                <div className="border-b border-stone-200 pb-4 dark:border-stone-700">
                  <h4
                    className={`${alexBrush.className} mb-3 text-base font-medium text-stone-900 dark:text-stone-100`}
                  >
                    Your Details
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 transition-colors duration-500 dark:border-stone-700 dark:bg-stone-800">
                      <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                        Guest
                      </div>
                      <div className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {guest.name}
                      </div>
                    </div>
                    {guest.email && guest.email.length > 0 && (
                      <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 transition-colors duration-500 dark:border-stone-700 dark:bg-stone-800">
                        <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                          Email
                        </div>
                        <div className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {guest.email}
                        </div>
                      </div>
                    )}
                    <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 transition-colors duration-500 dark:border-stone-700 dark:bg-stone-800">
                      <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                        Group
                      </div>
                      <div className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {guest.group}
                      </div>
                    </div>
                    {guest.accompanyingGuests && guest.accompanyingGuests.length > 0 && (
                      <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 transition-colors duration-500 dark:border-stone-700 dark:bg-stone-800">
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
                    className="w-full rounded-full bg-amber-700 text-white hover:bg-amber-800 sm:w-auto"
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
