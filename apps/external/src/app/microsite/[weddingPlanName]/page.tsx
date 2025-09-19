'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import FaqAccordion from '../components/FaqAccordion';
import GalleryDialog from '../components/GalleryDialog';
import { Button } from '@shared/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';

type PageProps = {
  params: { weddingPlanName: string };
};

export default function MicrositePage({ params }: PageProps) {
  const decodedPlanName = useMemo(() => decodeURIComponent(params.weddingPlanName), [params]);

  // Dummy data structured as if fetched from backend for this microsite
  const micrositeData = useMemo(() => {
    return {
      template_number: 1,
      coupleName: 'Alex & Jamie',
      heroImages: [
        '/images/landing-pg (1).jpg',
        '/images/landing-pg (2).jpg',
        '/images/landing-pg (3).jpg',
        '/images/landing-pg (4).jpg',
        '/images/guests-vendors.jpg',
      ],
      schedule: [
        {
          time: '2:00 PM',
          title: 'Guest Arrival & Registration',
          description: 'Doors open and light refreshments served.',
        },
        { time: '3:00 PM', title: 'Ceremony', description: 'Exchange of vows and ring ceremony.' },
        { time: '4:00 PM', title: 'Cocktail Hour', description: 'Drinks, canapés, and mingling.' },
        {
          time: '5:30 PM',
          title: 'Reception & Dinner',
          description: 'A seated dinner with toasts.',
        },
        {
          time: '7:30 PM',
          title: 'First Dance & Dance Floor Opens',
          description: 'Join us on the dance floor!',
        },
      ],
      faqs: [
        { q: 'What is the dress code?', a: 'Formal attire is appreciated.' },
        { q: 'Can I bring a plus one?', a: 'Please refer to your invitation details.' },
        { q: 'Are children welcome?', a: 'We love kids, but this is an adults-only celebration.' },
        {
          q: 'Is there parking at the venue?',
          a: 'Yes, complimentary parking is available onsite.',
        },
      ],
      gallery: [
        '/images/landing-pg (1).jpg',
        '/images/landing-pg (2).jpg',
        '/images/landing-pg (3).jpg',
        '/images/landing-pg (4).jpg',
        '/images/guests-vendors.jpg',
        '/images/checklist.png',
        '/images/group.png',
        '/images/wedding-invitation.png',
        '/images/vendor-illustration.png',
        '/images/landing-pg (1).jpg',
      ],
    };
  }, [decodedPlanName]);

  // Rotating hero state (mirrors root landing page behavior)
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % micrositeData.heroImages.length);
        setFade(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [micrositeData.heroImages.length]);

  const rsvpRef = useRef<HTMLDivElement | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // RSVP step state: lookup -> details
  type GuestDetails = {
    name: string;
    email: string;
    group: string;
    accompanyingGuests: string[];
  };
  const [rsvpStep, setRsvpStep] = useState<'lookup' | 'details'>('lookup');
  const [mainGuestName, setMainGuestName] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [guestDetails, setGuestDetails] = useState<GuestDetails | null>(null);

  // Simple client-side password gate. Replace with real backend validation later.
  const storageKey = useMemo(() => `microsite:access:${decodedPlanName}`, [decodedPlanName]);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const existing = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
      setHasAccess(existing === 'true');
    } catch (_e) {
      setHasAccess(false);
    } finally {
      setIsCheckingAccess(false);
    }
  }, [storageKey]);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Replace with API call to validate the wedding microsite password.
    // For now, any non-empty password unlocks.
    if (!passwordInput.trim()) {
      setPasswordError('Please enter the password.');
      return;
    }
    try {
      localStorage.setItem(storageKey, 'true');
    } catch (_e) {
      // Ignore storage failures; still grant access for session
    }
    setHasAccess(true);
    setPasswordError(null);
  }

  async function verifyGuestByName(name: string): Promise<GuestDetails> {
    // TODO: Replace with real API call: e.g., GET /microsite/guest-lookup?name=&slug=
    await new Promise((res) => setTimeout(res, 800));
    if (!name.trim() || name.trim().split(' ').length < 2) {
      throw new Error('Please enter first and last name.');
    }
    const emailSlug = name.trim().toLowerCase().replace(/\s+/g, '.');
    return {
      name: name.trim(),
      email: `${emailSlug}@example.com`,
      group: 'Friends',
      accompanyingGuests: ['Jordan Lee', 'Sam Rivera'],
    };
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setVerifyError(null);
    setVerifyLoading(true);
    try {
      const details = await verifyGuestByName(mainGuestName);
      setGuestDetails(details);
      setRsvpStep('details');
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : 'Unable to verify guest.');
    } finally {
      setVerifyLoading(false);
    }
  }

  function handleConfirm() {
    // TODO: Wire up confirm to backend RSVP endpoint with guest token/slug
    alert('Thanks for confirming your attendance!');
  }

  if (isCheckingAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Checking access...
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <main className="min-h-screen w-full bg-white">
        <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-wider text-brand-600">Wedding Microsite</p>
            <h1 className="mt-2 text-2xl font-semibold text-gray-900">Enter Password</h1>
            <p className="mt-1 text-sm text-gray-600">
              Please enter the password to access{' '}
              <span className="font-medium">{decodedPlanName}</span>.
            </p>
            <form onSubmit={handlePasswordSubmit} className="mt-6 grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  placeholder="Enter password"
                  required
                />
                {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                Unlock Microsite
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white">
      {(() => {
        const templateNumber = micrositeData.template_number;

        function TemplateOne() {
          return (
            <>
              {/* Hero with rotating background and overlayed content */}
              <section className="relative min-h-[70vh] w-full flex items-center justify-center bg-base-black overflow-hidden">
                <div className="absolute inset-0 w-full h-full z-0">
                  {micrositeData.heroImages.map((src, idx) => (
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
                <div className="relative z-20 flex flex-col items-center justify-center text-center w-full px-6 sm:px-20 gap-4">
                  <h1 className="text-4xl sm:text-6xl font-header text-base-white drop-shadow-lg">
                    {micrositeData.coupleName}
                  </h1>
                  <p className="text-base-white/90 font-nunito">{decodedPlanName}</p>
                  <div className="mt-2">
                    <Button
                      variant={'default'}
                      onClick={() => rsvpRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      RSVP Now
                    </Button>
                  </div>
                </div>
              </section>

              {/* Schedule Section */}
              <section className="mx-auto max-w-4xl px-4 py-12">
                <h2 className="text-2xl font-semibold text-gray-900">Wedding Schedule</h2>
                <p className="mt-1 text-sm text-gray-600">Here’s the plan for the day.</p>
                <div className="mt-6 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
                  {micrositeData.schedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:gap-6"
                    >
                      <div className="w-28 shrink-0 text-brand-700 font-medium">{item.time}</div>
                      <div>
                        <div className="text-gray-900 font-medium">{item.title}</div>
                        <div className="text-gray-600 text-sm">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQs Section */}
              <section className="mx-auto max-w-4xl px-4 py-12">
                <h2 className="text-2xl font-semibold text-gray-900">FAQs</h2>
                <div className="mt-6">
                  <FaqAccordion items={micrositeData.faqs} />
                </div>
              </section>

              {/* Gallery Section */}
              <section className="mx-auto max-w-4xl px-4 py-12">
                <h2 className="text-2xl font-semibold text-gray-900">Gallery</h2>
                <p className="mt-1 text-sm text-gray-600">A few moments we love.</p>
                <div className="mt-6 grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {micrositeData.gallery.slice(0, 10).map((src, idx) => (
                    <div key={idx} className="relative aspect-square overflow-hidden rounded-md">
                      <Image src={src} alt={`gallery-${idx}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <Button variant={'darkOutline'} onClick={() => setIsGalleryOpen(true)}>
                    View all photos
                  </Button>
                </div>
                <GalleryDialog
                  open={isGalleryOpen}
                  onOpenChange={setIsGalleryOpen}
                  images={micrositeData.gallery}
                  columns={3}
                />
              </section>
            </>
          );
        }

        function TemplateTwo() {
          const containerVariants = {
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.2 },
            },
          };
          const childVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

          return (
            <>
              {/* Hero with animated overlay */}
              <section className="relative min-h-[70vh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-brand-50 to-white">
                <div className="absolute inset-0 -z-0 opacity-30">
                  {micrositeData.heroImages.map((src, idx) => (
                    <Image
                      key={src}
                      src={src}
                      alt="wedding hero"
                      fill
                      priority={idx === 0}
                      className={`object-cover w-full h-full absolute inset-0 transition-opacity duration-500 ${
                        idx === current && fade ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ transitionProperty: 'opacity' }}
                    />
                  ))}
                </div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="relative z-10 mx-auto max-w-3xl text-center px-6"
                >
                  <motion.h1
                    variants={childVariants}
                    className="text-5xl font-header text-gray-900"
                  >
                    {micrositeData.coupleName}
                  </motion.h1>
                  <motion.p variants={childVariants} className="mt-2 text-gray-700">
                    {decodedPlanName}
                  </motion.p>
                  <motion.div variants={childVariants} className="mt-6">
                    <Button onClick={() => rsvpRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                      RSVP Now
                    </Button>
                  </motion.div>
                </motion.div>
              </section>

              {/* Schedule as timeline */}
              <section className="mx-auto max-w-4xl px-4 py-16">
                <h2 className="text-2xl font-semibold text-gray-900">Schedule</h2>
                <div className="mt-8 relative border-s-2 border-brand-200 ps-6">
                  {micrositeData.schedule.map((sched, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3 }}
                      className="mb-8"
                    >
                      <div className="absolute -start-2 mt-1 h-3 w-3 rounded-full bg-brand-500" />
                      <div className="text-sm text-brand-700 font-medium">{sched.time}</div>
                      <div className="text-gray-900 font-semibold">{sched.title}</div>
                      <div className="text-gray-600">{sched.description}</div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* FAQs with accordion (reuse) */}
              <section className="mx-auto max-w-3xl px-4 py-12">
                <h2 className="text-2xl font-semibold text-gray-900 text-center">FAQs</h2>
                <div className="mt-6">
                  <FaqAccordion items={micrositeData.faqs} />
                </div>
              </section>

              {/* Gallery with subtle motion */}
              <section className="mx-auto max-w-5xl px-4 py-12">
                <h2 className="text-2xl font-semibold text-gray-900 text-center">Gallery</h2>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-50px' }}
                  className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  {micrositeData.gallery.slice(0, 8).map((src, idx) => (
                    <motion.div
                      key={idx}
                      variants={childVariants}
                      className="relative aspect-square overflow-hidden rounded-lg"
                    >
                      <Image src={src} alt={`g-${idx}`} fill className="object-cover" />
                    </motion.div>
                  ))}
                </motion.div>
                <div className="mt-6 flex justify-center">
                  <Button variant={'darkOutline'} onClick={() => setIsGalleryOpen(true)}>
                    View all photos
                  </Button>
                </div>
                <GalleryDialog
                  open={isGalleryOpen}
                  onOpenChange={setIsGalleryOpen}
                  images={micrositeData.gallery}
                  columns={4}
                />
              </section>
            </>
          );
        }

        function TemplateThree() {
          return (
            <>
              {/* Clean hero with centered card */}
              <section className="relative w-full bg-gradient-to-b from-white to-brand-50 py-24">
                <div className="mx-auto max-w-5xl px-4 grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative h-[320px] rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src={micrositeData.heroImages[0]}
                      alt="hero"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                    <h1 className="text-3xl font-header text-gray-900">
                      {micrositeData.coupleName}
                    </h1>
                    <p className="mt-1 text-gray-700">{decodedPlanName}</p>
                    <p className="mt-4 text-gray-600">We’re so excited to celebrate with you.</p>
                    <div className="mt-6">
                      <Button
                        onClick={() => rsvpRef.current?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        RSVP Now
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Schedule cards */}
              <section className="mx-auto max-w-5xl px-4 py-12">
                <h2 className="text-2xl font-semibold text-gray-900">Schedule</h2>
                <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {micrositeData.schedule.map((s, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-white p-5">
                      <div className="text-brand-700 font-medium">{s.time}</div>
                      <div className="font-semibold text-gray-900">{s.title}</div>
                      <div className="text-gray-600 text-sm">{s.description}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQs side card */}
              <section className="mx-auto max-w-5xl px-4 py-12 grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-semibold text-gray-900">FAQs</h2>
                  <div className="mt-4">
                    <FaqAccordion items={micrositeData.faqs} />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <div className="rounded-xl border border-gray-200 bg-white p-6 sticky top-6">
                    <h3 className="font-semibold text-gray-900">Quick Info</h3>
                    <ul className="mt-3 text-sm text-gray-700 space-y-2">
                      <li>
                        <span className="font-medium">Date:</span> TBA
                      </li>
                      <li>
                        <span className="font-medium">Venue:</span> TBA
                      </li>
                      <li>
                        <span className="font-medium">Dress code:</span> Formal
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Gallery wide */}
              <section className="mx-auto max-w-6xl px-4 py-12">
                <h2 className="text-2xl font-semibold text-gray-900">Gallery</h2>
                <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-2">
                  {micrositeData.gallery.slice(0, 12).map((src, idx) => (
                    <div key={idx} className="relative aspect-square overflow-hidden rounded-md">
                      <Image src={src} alt={`g3-${idx}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <Button variant={'darkOutline'} onClick={() => setIsGalleryOpen(true)}>
                    View all photos
                  </Button>
                </div>
                <GalleryDialog
                  open={isGalleryOpen}
                  onOpenChange={setIsGalleryOpen}
                  images={micrositeData.gallery}
                  columns={6}
                />
              </section>
            </>
          );
        }

        if (templateNumber === 2) return <TemplateTwo />;
        if (templateNumber === 3) return <TemplateThree />;
        return <TemplateOne />;
      })()}

      {/* RSVP Section */}
      <section ref={rsvpRef} className="mx-auto max-w-4xl px-4 py-8 grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">RSVP</h2>
            {rsvpStep === 'lookup' && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Please enter the first and last name of the main member of your party below.
                </p>
                <form onSubmit={handleVerify} className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
                  <input
                    type="text"
                    value={mainGuestName}
                    onChange={(e) => setMainGuestName(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                    placeholder="e.g., Taylor Lee"
                    required
                  />
                  <Button type="submit" disabled={verifyLoading}>
                    {verifyLoading ? 'Verifying...' : 'Find My RSVP'}
                  </Button>
                </form>
                {verifyError && <p className="mt-2 text-sm text-red-600">{verifyError}</p>}
              </div>
            )}

            {rsvpStep === 'details' && guestDetails && (
              <div className="mt-6 grid gap-4">
                <p className="text-sm text-gray-600">
                  Please review your details below and confirm.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Guest</div>
                    <div className="mt-1 font-medium text-gray-900">{guestDetails.name}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="mt-1 font-medium text-gray-900">{guestDetails.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Group</div>
                    <div className="mt-1 font-medium text-gray-900">{guestDetails.group}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Accompanying Guests</div>
                    <div className="mt-1 text-gray-900">
                      {guestDetails.accompanyingGuests.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {guestDetails.accompanyingGuests.map((g) => (
                            <li key={g}>{g}</li>
                          ))}
                        </ul>
                      ) : (
                        <span>None</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={handleConfirm}>Confirm Attendance</Button>
                  <Button variant={'outline'}>Contact Couple</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="md:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">Event details</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>
                <span className="font-medium">Date:</span> To be announced
              </li>
              <li>
                <span className="font-medium">Venue:</span> To be announced
              </li>
              <li>
                <span className="font-medium">Dress code:</span> Formal
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
