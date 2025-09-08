"use client";

import {
  Bell,
  UserCheck,
  Wallet,
  Camera,
  Heart,
  Images,
} from "lucide-react";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
import useIsMobileScreen from "@shared/hooks/useIsMobileScreen";
import Hero from "../components/unauthenticated/hero";
import FeaturesPanel from "../components/unauthenticated/features-panel";
import ClosingCTA from "../components/unauthenticated/closing-cta";

export default function TheBigDayPage() {
  const isMobile = useIsMobileScreen();
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-brand-100 to-white text-gray-800 font-sans">
      <ResponsiveMenubar />
      {!isMobile && <div className="mt-[72px] w-full"></div>}
      {/* Hero Section */}
      <Hero img_src="/images/the-big-day.jpg" header="Make the Big Day Seamless." subheader="From real-time check-ins to digital angbaos and live photo uploads —
            ensure your wedding day flows effortlessly and memories last forever." />
      {/* Features Section */}
      <FeaturesPanel features={features} />
      {/* Closing CTA */}
     <ClosingCTA cta_text="Let technology take care of the details, so you can cherish the moment." />
    </div>
  );
}

const features = [
  {
    title: "Automated Notifications & Announcements",
    desc: "Send timely updates via email or SMS to keep guests informed.",
    icon: <Bell className="w-8 h-8 text-brand-600" />,
  },
  {
    title: "Real-time Guest Check-in",
    desc: "Track attendance effortlessly with digital guest check-in tools.",
    icon: <UserCheck className="w-8 h-8 text-brand-600" />,
  },
  {
    title: "Digital Angbao",
    desc: "Simplify gift-giving with secure cash transfer tracking.",
    icon: <Wallet className="w-8 h-8 text-brand-600" />,
  },
  {
    title: "Live Photo Uploads",
    desc: "Guests can scan a QR code to upload photos and contribute to your wedding album.",
    icon: <Camera className="w-8 h-8 text-brand-600" />,
  },
  {
    title: "Automated Thank-you E-cards",
    desc: "Express gratitude instantly with personalized digital thank-you notes.",
    icon: <Heart className="w-8 h-8 text-brand-600" />,
  },
  {
    title: "Photo Sharing & Album Curation",
    desc: "Compile guest photos into curated digital albums for lasting memories.",
    icon: <Images className="w-8 h-8 text-brand-600" />,
  },
];
