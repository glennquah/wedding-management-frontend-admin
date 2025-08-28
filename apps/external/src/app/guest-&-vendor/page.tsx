"use client";

import {
  Users,
  Gift,
  ClipboardList,
  UtensilsCrossed,
  LayoutGrid,
} from "lucide-react";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
import useIsMobileScreen from "@shared/hooks/useIsMobileScreen";
import Hero from "../components/unauthenticated/hero";
import FeaturesPanel from "../components/unauthenticated/features-panel";
import ClosingCTA from "../components/unauthenticated/closing-cta";

export default function GuestVendorPage() {
  const isMobile = useIsMobileScreen();
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-brand-100 to-white text-gray-800 font-sans">
      <ResponsiveMenubar />
      {!isMobile && <div className="mt-[72px] w-full"></div>}
      {/* Hero Section */}
      <Hero img_src="/images/guest.png" header="Guests & Vendors, Simplified." subheader="Manage RSVPs, vendors, gifts, and seating in one seamless platform.
            From AI-generated couple stories to intelligent vendor recommendations,
            we’ve got you covered." />
      {/* Features Section */}
      <FeaturesPanel features={features} />
      {/* Closing CTA */}
      <ClosingCTA cta_text="Make every guest and vendor connection seamless." />
    </div>
  );
}

const features = [
  {
    title: "RSVP & Couple Microsite",
    desc: "Personalized microsite with AI-generated stories & photos. Guests can RSVP, note dietary needs, and view your registry.",
    icon: <ClipboardList className="w-8 h-8 text-brand-600" />,
  },
  {
    title: "Vendor & Catering Selection",
    desc: "Discover vendors and caterers with AI-powered recommendations tailored to your style and budget.",
    icon: <UtensilsCrossed className="w-8 h-8 text-brand-600" />,
  },
  {
    title: "Couple’s Wishlist Purchases",
    desc: "Allow guests to purchase items directly from your curated wishlist.",
    icon: <Gift className="w-8 h-8 text-brand-600" />,
  },
  {
    title: "Centralized Guest List",
    desc: "Keep all your guest details in one organized list with easy access.",
    icon: <Users className="w-8 h-8 text-brand-600" />,
  },
  {
    title: "Seating Arrangement Generator",
    desc: "Save time and stress with AI-generated seating plans that keep everyone happy.",
    icon: <LayoutGrid className="w-8 h-8 text-brand-600" />,
  },
];
