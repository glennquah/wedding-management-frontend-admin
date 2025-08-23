"use client";

import Footer from "@shared/components/footer";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@shared/components/ui/button";

const heroImages = [
  "/images/landing-pg (1).jpg",
  "/images/landing-pg (2).jpg",
  "/images/landing-pg (3).jpg",
  "/images/landing-pg (4).jpg",
];

export default function LandingPage() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

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

      {/* Hero Section */}
      <section className="relative flex-1 min-h-screen w-full flex items-center justify-center bg-base-black overflow-hidden">
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
        <div className="relative z-20 flex flex-col items-center justify-center text-center w-full px-6 sm:px-20 gap-8">
          <h1 className="text-4xl sm:text-6xl font-header text-secondary drop-shadow-lg">
            Your Dream Wedding, Seamlessly Planned
          </h1>
          <h5 className="max-w-xl text-xl text-secondary drop-shadow font-semibold">
            Organize every detail, track every task, and coordinate your big day
            effortlessly — all in one intuitive platform.
          </h5>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              variant={"secondary"}
            >
              Get Started
            </Button>
            <Button
              variant={"outline"}
            >
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-20 bg-background flex flex-col gap-16">
        <h2 className="text-3xl font-header font-bold text-center text-primary">
          Our Services
        </h2>
        <div className="grid sm:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-4 text-center hover:scale-110 cursor-pointer transition-transform">
            <Image
              src="/images/checklist.png"
              alt="Checklist"
              width={150}
              height={150}
            />
            <h3 className="font-header text-xl text-brand-900 font-semibold">
              Essentials
            </h3>
            <p className="text-foreground">
              Set your vision, lock your date, track your budget, and cover
              every blindspot—your wedding starts here.
            </p>
          </div>
          <div className="flex flex-col items-center cursor-pointer gap-4 text-center">
            <Image
              src="/images/group.png"
              alt="Group of people"
              width={150}
              height={150}
            />
            <h3 className="font-header text-xl text-brand-900 font-semibold">
              Guests & Vendors
            </h3>
            <p className="text-foreground">
              Manage your guest list, secure the perfect vendors, and style your
              big day—all in one place.
            </p>
          </div>
          <div className="flex flex-col items-center  cursor-pointer gap-4 text-center">
            <Image
              src="/images/wedding-cake.png"
              alt="Wedding Cake"
              width={150}
              height={150}
            />
            <h3 className="font-header text-xl text-brand-900 font-semibold">
              The Big Day
            </h3>
            <p className="text-foreground">
              Stay stress-free with last-minute checklists, day-of coordination,
              and effortless photo collation to relive every moment.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
