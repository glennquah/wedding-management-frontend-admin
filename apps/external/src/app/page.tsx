"use client";

import Image from "next/image";
import ResponsiveMenubar from "@components/common/responsive-menubar";

export default function LandingPage() {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      {/* Menubar */}
      <ResponsiveMenubar />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center pt-40 py-20 px-6 sm:px-20 gap-8 bg-brand-25">
        <h1 className="text-4xl sm:text-6xl font-header text-primary">
          Your Dream Wedding, Simplified
        </h1>
        <p className="max-w-xl text-lg sm:text-xl text-secondary-foreground/90">
          Plan, organize, and track every detail of your special day in one
          intuitive platform. Say goodbye to stress and hello to joy.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <a
            href="/get-started"
            className="rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold shadow-lg hover:bg-primary-hover transition"
          >
            Get Started
          </a>
          <a
            href="/features"
            className="rounded-full border border-secondary text-secondary-foreground px-6 py-3 font-semibold hover:bg-secondary-hover transition"
          >
            Explore Features
          </a>
        </div>

        <Image
          src="/images/landing-pg.jpg"
          alt="Happy couple illustration"
          width={500}
          height={300}
          className="mt-10"
        />
      </main>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-20 bg-background flex flex-col gap-16">
        <h2 className="text-3xl font-header text-center text-primary">
          Why Choose Us?
        </h2>
        <div className="grid sm:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-4 text-center">
            <Image
              src="/images/feature-one.jpg"
              alt="Calendar"
              width={300}
              height={300}
            />
            <h3 className="font-header text-xl text-primary">Smart Planning</h3>
            <p className="text-secondary-foreground/80">
              Organize every detail of your wedding with our easy-to-use
              planner.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <Image
              src="/images/feature-two.jpg"
              alt="Budget"
              width={300}
              height={300}
            />
            <h3 className="font-header text-xl text-primary">
              Budget Management
            </h3>
            <p className="text-secondary-foreground/80">
              Track your expenses and stay within budget without the stress.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <Image
              src="/images/feature-three.jpg"
              alt="Guest List"
              width={300}
              height={300}
            />
            <h3 className="font-header text-xl text-primary">
              Guest Management
            </h3>
            <p className="text-secondary-foreground/80">
              Easily manage invites, RSVPs, and seating arrangements in one
              place.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-25 py-10 px-6 sm:px-20 text-center text-secondary-foreground/90">
        <p>© {new Date().getFullYear()} WeddingPlanner. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="/about" className="hover:underline">
            About
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
