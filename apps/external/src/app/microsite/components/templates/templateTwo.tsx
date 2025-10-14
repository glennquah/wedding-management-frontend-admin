import { RefObject, useEffect, useState } from 'react';

import { Button } from '@shared/components/ui/button';
import { MultiSelectDropdown } from '@shared/components/ui/form/multiSelectDropdown';
import { Switch } from '@shared/components/ui/switch';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { GuestResponseDto, MicrositeResponseDto } from '@wedding/api-types';
import { Lora, Playfair_Display } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FaqAccordion from '../FaqAccordion';
import GalleryDialog from '../GalleryDialog';

// Rustic fonts
const lora = Lora({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });

interface TemplateTwoProps {
  micrositeData: MicrositeResponseDto;
  rsvpRef: RefObject<HTMLDivElement | null>;
  guestDetails: GuestResponseDto | null;
  isWeddingLive: boolean;
  micrositeSlug: string;
  handleConfirmGuestAttendance: (allergies?: string[]) => Promise<void>;
}

export default function TemplateTwo({
  micrositeData,
  rsvpRef,
  guestDetails,
  isWeddingLive,
  micrositeSlug,
  handleConfirmGuestAttendance,
}: TemplateTwoProps) {
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
  // Carousel state (same logic as Template One)
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

  // Images
  const firstHero = micrositeData?.heroImages?.[0];
  const schedImage = micrositeData?.imageGallery?.[0] || micrositeData?.heroImages?.[0];
  const faqImage = micrositeData?.imageGallery?.[1] || micrositeData?.heroImages?.[1] || firstHero;

  return (
    <main
      className={`${lora.className} relative min-h-screen w-full overflow-x-hidden transition-colors duration-500 ${
        isDark ? 'dark bg-stone-900 text-stone-100' : 'bg-[#F5E9D8] text-stone-900'
      }`}
    >
      {/* Theme Switch: Light (default) -> Dark */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-stone-300 dark:border-stone-700 bg-white/80 dark:bg-stone-800/80 backdrop-blur px-3 py-2 shadow-sm">
          <span className="text-xs font-medium text-stone-700 dark:text-stone-300 select-none">
            Dark Mode
          </span>
          <Switch
            aria-label="Toggle Dark Mode"
            checked={isDark}
            onCheckedChange={(checked) => setIsDark(checked)}
          />
        </div>
      </div>

      {isWeddingLive && micrositeSlug && (
        <div className="absolute top-4 right-4 z-50 space-x-2">
          <Button
            onClick={() => router.push(`/microsite/${micrositeSlug}/album`)}
            className="rounded-full bg-amber-700 hover:bg-amber-800 text-white px-6 py-3"
          >
            View Album
          </Button>

          <Button
                onClick={() => router.push(`/cashgift/${micrositeData?.weddingId}`)}
                className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white rounded-full"
              >
                Cash Giftings
          </Button>
        </div>
      )}

      {/* Hero Split: left images (50vw), right text (50vw) */}
      <section className="w-screen md:h-[90vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-[40vh] md:h-full items-stretch">
          {/* Left: rotating gallery */}
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0">
              {micrositeData?.heroImages?.map((src, idx) => (
                <Image
                  key={src}
                  src={src}
                  alt="wedding hero"
                  fill
                  priority={idx === 0}
                  className={`object-cover w-full h-full absolute inset-0 transition-opacity duration-500 ${
                    idx === current && fade ? 'opacity-90' : 'opacity-0'
                  }`}
                  style={{ transitionProperty: 'opacity' }}
                />
              ))}
              <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply" />
            </div>
          </div>

          {/* Right: content */}
          <div className="flex flex-col justify-center h-full px-6 md:px-12 py-8">
            <h1
              className={`${playfair.className} text-4xl sm:text-5xl text-stone-900 dark:text-stone-100`}
            >
              {micrositeData?.weddingName}
            </h1>
            <p className="mt-2 text-base sm:text-lg text-stone-700 dark:text-stone-300">
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
                className="rounded-full bg-amber-700 hover:bg-amber-800 text-white px-6 py-3"
              >
                RSVP Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Split: left schedule (50vw), right image (50vw) */}
      <section className="w-screen md:h-[90vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full items-stretch">
          {/* Left: schedule */}
          <div
            className={`h-full flex flex-col justify-center px-20 ${isMobile ? 'px-6' : 'px-20'} py-8`}
          >
            <h2
              className={`${playfair.className} text-3xl font-semibold text-stone-900 dark:text-stone-100`}
            >
              Wedding Schedule
            </h2>
            <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">
              Here’s the plan for the day.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-stone-100 dark:bg-stone-800/80">
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-stone-700 dark:text-stone-300 px-3 py-2 w-32">
                      Time
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-stone-700 dark:text-stone-300 px-3 py-2">
                      Event
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                  {micrositeData?.schedule?.map((item, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-stone-900 dark:text-stone-100">
                        {item.time}
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-stone-900 dark:text-stone-100 font-medium">
                          {item.title}
                        </div>
                        {item.description ? (
                          <p className="text-sm text-stone-700 dark:text-stone-300 mt-1">
                            {item.description}
                          </p>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: image */}
          <div className="relative w-full h-[40vh] md:h-full overflow-hidden">
            {schedImage ? (
              <Image src={schedImage} alt="schedule visual" fill className="object-cover" />
            ) : null}
            <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply" />
          </div>
        </div>
      </section>

      {/* FAQs Split: left image (50vw), right FAQs (50vw) */}
      <section className="w-screen md:h-[90vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full items-stretch">
          {/* Left: image */}
          <div className="relative order-1 md:order-none w-full h-[40vh] md:h-full overflow-hidden">
            {faqImage ? (
              <Image src={faqImage} alt="faq visual" fill className="object-cover" />
            ) : null}
            <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply" />
          </div>

          {/* Right: FAQs */}
          <div
            className={`h-full flex flex-col justify-center ${isMobile ? 'px-6' : 'px-20'} py-8`}
          >
            <h2
              className={`${playfair.className} text-3xl font-semibold text-stone-900 dark:text-stone-100 text-left`}
            >
              FAQs
            </h2>
            <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">
              Everything you might wonder.
            </p>
            <div className="mt-6">
              <FaqAccordion items={micrositeData?.faqs ?? []} />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery (same as Template One, font changes only) */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2
          className={`${playfair.className} text-2xl font-semibold text-stone-900 dark:text-stone-100 text-center`}
        >
          Gallery
        </h2>
        <p className="mt-1 text-sm text-stone-700 dark:text-stone-300 text-center">
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
                    className={`${playfair.className} text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100`}
                  >
                    RSVP
                  </h2>
                  <p className="mt-2 text-base sm:text-lg text-stone-700 dark:text-stone-300">
                    Please review your details and confirm your attendance.
                  </p>
                  {guest && (
                    <div className="mt-6 space-y-4">
                      <div className="border-b border-stone-200 dark:border-stone-700 pb-4">
                        <h4
                          className={`${playfair.className} text-base font-medium text-stone-900 dark:text-stone-100 mb-3`}
                        >
                          Your Details
                        </h4>
                        <div className="grid grid-cols-1  gap-3">
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
                          onClick={() => handleConfirmGuestAttendance(selectedAllergies)}
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
                        className={`${playfair.className} text-4xl sm:text-5xl text-white drop-shadow-md`}
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
                className={`${playfair.className} text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 mb-2`}
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
                  className={`${playfair.className} text-base font-medium text-stone-900 dark:text-stone-100 mb-3`}
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
                  onClick={() => handleConfirmGuestAttendance(selectedAllergies)}
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
  );
}
