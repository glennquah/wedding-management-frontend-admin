"use client";

export const dynamic = 'force-dynamic'

import { AppService } from "@shared/api/services/AppService";
import Footer from "@shared/components/footer";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
import { Button } from "@shared/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const heroImages = [
  "/images/landing-pg (1).jpg",
  "/images/landing-pg (2).jpg",
  "/images/landing-pg (3).jpg",
  "/images/landing-pg (4).jpg",
];

export default function LandingPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [apiMessage, setApiMessage] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const featuresRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchHello = async () => {
      try {
        const response = await AppService.appControllerGetHello();
        setApiMessage(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch API:", error);
        setApiMessage("Failed to load API message");
        setIsLoading(false);
      }
    };

    fetchHello();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % heroImages.length);
        setFade(true);
      }, 400); // fade out duration
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="font-sans min-h-screen flex flex-col">
      {/* Menubar */}
      <ResponsiveMenubar />
      {/* API Message Display */}
        {/* <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-primary mb-2">API Response:</h2>
          {isLoading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <p className="text-gray-800">{apiMessage}</p>
          )}
        </div> */}
      {/* Hero Section */}
      <section className="relative flex-1 min-h-screen w-full flex items-center pt-[48px] justify-center bg-base-black overflow-hidden">
        {/* Rotating Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          {heroImages.map((src, idx) => (
            <Image
              key={src}
              src={src}
              alt="happy couple illustration"
              fill
              priority={idx === 0}
              className={`object-cover w-full h-full absolute inset-0 transition-opacity duration-500 ${
                idx === current && fade ? "opacity-70" : "opacity-0"
              }`}
              style={{ transitionProperty: "opacity" }}
            />
          ))}
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 z-10" />
        {/* Centered Content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center w-full px-6 sm:px-20 gap-6">
          <h1 className="text-4xl sm:text-6xl font-header text-base-white drop-shadow-lg">
            Your Dream Wedding, Seamlessly Planned
          </h1>
          <h5 className="max-w-xl text-xl text-base-white drop-shadow font-nunito font-semibold">
            Organize every detail, track every task, and coordinate your big day
            effortlessly — all in one intuitive platform.
          </h5>
          <div className="flex sm:flex-row gap-4 mt-4">
            <Button
              variant={"default"}
              onClick={() => router.push(`/get-started`)}
            >
              Get Started
            </Button>
            <Button
              variant={"outline"}
              onClick={() => {
                featuresRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Features
            </Button>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-6 sm:px-20 bg-background flex flex-col gap-16">
        <h2 className="text-3xl font-header font-bold text-center text-foreground">
          Our Services
        </h2>
        {(() => {
          const services = [
            {
              image: "/images/checklist.png",
              alt: "Checklist",
              header: "Essentials",
              description:
                "Set your vision, lock your date, track your budget, and cover every blindspot—your wedding starts here.",
            },
            {
              image: "/images/group.png",
              alt: "Group of people",
              header: "Guests & Vendors",
              description:
                "Manage your guest list, secure the perfect vendors, and style your big day—all in one place.",
            },
            {
              image: "/images/wedding-invitation.png",
              alt: "Wedding Cake",
              header: "The Big Day",
              description:
                "Stay stress-free with last-minute checklists, day-of coordination, and effortless photo collation to relive every moment.",
            },
          ];

          
          function ServiceCard({ image, alt, header, description }: { image: string; alt: string; header: string; description: string }) {
            return (
              <div
                className="flex flex-col items-center gap-4 text-center hover:scale-110 cursor-pointer transition-transform"
                onClick={() => router.push(`/${header.toLowerCase().replace(/\s+/g, '-')}`)}
              >
                <Image src={image} alt={alt} width={150} height={150} />
                <h3 className="font-header text-xl text-foreground font-semibold">{header}</h3>
                <p className="text-foreground">{description}</p>
              </div>
            );
          }

          return (
            <div className="grid sm:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {services.map((service) => (
                <ServiceCard key={service.header} {...service} />
              ))}
            </div>
          );
        })()}
      </section>

      {/* Vendor B2B Section */}
      <section className="py-20 px-6 sm:px-20 bg-gradient-to-b from-background to-base-white flex flex-col items-center">
        <h2 className="text-3xl font-header font-bold text-center text-foreground">
          Are You a Vendor?
        </h2>
        <div className="flex flex-col items-center max-w-3xl w-full">
          <Image src="/images/vendor-illustration.png" alt="Vendor too illustration" width={320} height={220} className="bg-transparent" />
          <p className="text-lg text-center text-foreground font-nunito">
            Join our platform to easily list your goods and services, track your sales and bookings, and connect with couples looking for the best wedding experiences. Our simple yet effective B2B tools empower you to grow your business and manage everything in one place.
          </p>
          <Button
              variant={"secondary"}
              className="mt-6"
              onClick={() => router.push(`/vendor`)}
          >
              Learn More
          </Button>
        </div>
      </section>

      
      {/* Footer */}
      <Footer />
    </div>
  );
}
