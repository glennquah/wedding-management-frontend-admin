import { RefObject, useEffect, useState } from 'react';

import { WeddingsService } from '@shared/api/services/WeddingsService';
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
  hasWishlistItems?: boolean;
}

export default function TemplateTwo({
  micrositeData,
  rsvpRef,
  guestDetails,
  isWeddingLive,
  micrositeSlug,
  handleConfirmGuestAttendance,
  hasWishlistItems = false,
}: TemplateTwoProps) {
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
      <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/80 px-3 py-2 shadow-sm backdrop-blur dark:border-stone-700 dark:bg-stone-800/80">
          <span className="text-xs font-medium text-stone-700 select-none dark:text-stone-300">
            Dark Mode
          </span>
          <Switch
            aria-label="Toggle Dark Mode"
            checked={isDark}
            onCheckedChange={(checked) => setIsDark(checked)}
          />
        </div>
      </div>
      {hasWishlistItems && (
        <div className="absolute top-4 right-4 z-50 flex gap-3">
          <Button
            onClick={() => router.push(`/microsite/${micrositeSlug}/wishlist`)}
            className="rounded-full bg-amber-700 px-6 py-3 text-white hover:bg-amber-800"
          >
            Wishlist
          </Button>
        </div>
      )}
      {isWeddingLive && (
        <div className="absolute top-4 right-4 z-50 flex gap-3">
          <Button
            onClick={() => router.push(`/microsite/${micrositeSlug}/album`)}
            className="rounded-full bg-amber-700 px-6 py-3 text-white hover:bg-amber-800"
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

      {/* Hero Split: left images (50vw), right text (50vw) */}
      <section className="w-screen md:h-[90vh]">
        <div className="grid h-[40vh] grid-cols-1 items-stretch gap-0 md:h-full md:grid-cols-2">
          {/* Left: rotating gallery */}
          <div className="relative h-full w-full overflow-hidden">
            <div className="absolute inset-0">
              {micrositeData?.heroImages?.map((src, idx) => (
                <Image
                  key={src}
                  src={src}
                  alt="wedding hero"
                  fill
                  priority={idx === 0}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                    idx === current && fade ? 'opacity-90' : 'opacity-0'
                  }`}
                  style={{ transitionProperty: 'opacity' }}
                />
              ))}
              <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply" />
            </div>
          </div>

          {/* Right: content */}
          <div className="flex h-full flex-col justify-center px-6 py-8 md:px-12">
            <h1
              className={`${playfair.className} text-4xl text-stone-900 sm:text-5xl dark:text-stone-100`}
            >
              {micrositeData?.weddingName}
            </h1>
            <p className="mt-2 text-base text-stone-700 sm:text-lg dark:text-stone-300">
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
                className="rounded-full bg-amber-700 px-6 py-3 text-white hover:bg-amber-800"
              >
                RSVP Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Split: left schedule (50vw), right image (50vw) */}
      <section className="w-screen md:h-[90vh]">
        <div className="grid h-full grid-cols-1 items-stretch gap-0 md:grid-cols-2">
          {/* Left: schedule */}
          <div
            className={`flex h-full flex-col justify-center px-20 ${isMobile ? 'px-6' : 'px-20'} py-8`}
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
                    <th className="w-32 px-3 py-2 text-left text-xs font-semibold tracking-wide text-stone-700 uppercase dark:text-stone-300">
                      Time
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-stone-700 uppercase dark:text-stone-300">
                      Event
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                  {micrositeData?.schedule?.map((item, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="px-3 py-3 text-sm font-medium whitespace-nowrap text-stone-900 dark:text-stone-100">
                        {item.time}
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-stone-900 dark:text-stone-100">
                          {item.title}
                        </div>
                        {item.description ? (
                          <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">
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
          <div className="relative h-[40vh] w-full overflow-hidden md:h-full">
            {schedImage ? (
              <Image src={schedImage} alt="schedule visual" fill className="object-cover" />
            ) : null}
            <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply" />
          </div>
        </div>
      </section>

      {/* FAQs Split: left image (50vw), right FAQs (50vw) */}
      <section className="w-screen md:h-[90vh]">
        <div className="grid h-full grid-cols-1 items-stretch gap-0 md:grid-cols-2">
          {/* Left: image */}
          <div className="relative order-1 h-[40vh] w-full overflow-hidden md:order-none md:h-full">
            {faqImage ? (
              <Image src={faqImage} alt="faq visual" fill className="object-cover" />
            ) : null}
            <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply" />
          </div>

          {/* Right: FAQs */}
          <div
            className={`flex h-full flex-col justify-center ${isMobile ? 'px-6' : 'px-20'} py-8`}
          >
            <h2
              className={`${playfair.className} text-left text-3xl font-semibold text-stone-900 dark:text-stone-100`}
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
          className={`${playfair.className} text-center text-2xl font-semibold text-stone-900 dark:text-stone-100`}
        >
          Gallery
        </h2>
        <p className="mt-1 text-center text-sm text-stone-700 dark:text-stone-300">
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
                    className={`${playfair.className} text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-100`}
                  >
                    RSVP
                  </h2>
                  <p className="mt-2 text-base text-stone-700 sm:text-lg dark:text-stone-300">
                    Please review your details and confirm your attendance.
                  </p>
                  {guest && (
                    <div className="mt-6 space-y-4">
                      <div className="border-b border-stone-200 pb-4 dark:border-stone-700">
                        <h4
                          className={`${playfair.className} mb-3 text-base font-medium text-stone-900 dark:text-stone-100`}
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
                          onClick={() => handleConfirmGuestAttendance(selectedAllergies)}
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
                        className={`${playfair.className} text-4xl text-white drop-shadow-md sm:text-5xl`}
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
                className={`${playfair.className} mb-2 text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-100`}
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
                  className={`${playfair.className} mb-3 text-base font-medium text-stone-900 dark:text-stone-100`}
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
                  onClick={() => handleConfirmGuestAttendance(selectedAllergies)}
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
  );
}
