"use client";

import ResponsiveMenubar from "@shared/components/responsive-menubar";
import useIsMobileScreen from "@shared/hooks/useIsMobileScreen";
import { ClipboardList, LayoutGrid, Users } from "lucide-react";
import ClosingCTA from "../components/unauthenticated/closing-cta";
import FeaturesPanel from "../components/unauthenticated/features-panel";
import Hero from "../components/unauthenticated/hero";

export default function VendorPage() {
  const isMobile = useIsMobileScreen();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-secondary/20 to-white text-gray-800 font-sans">
      <ResponsiveMenubar />
      {!isMobile && <div className="mt-[72px] w-full"></div>}
      {/* Hero Section */}
      <Hero color_theme="secondary" img_src="/images/vendor.jpg" header="Grow Your Wedding Business." subheader="List your products and services, track sales with a powerful dashboard, and connect with wedding couples to grow your network." />
      {/* Features Section */}
      <FeaturesPanel color_theme="secondary" features={features} />
      {/* Closing CTA */}
      <ClosingCTA color_theme="secondary" cta_text="Connect, Track, and Grow Your Wedding Business." />
    </div>
  );
}

const features = [
  {
    title: "List Products & Services",
    desc: "Showcase your offerings to couples and make it easy for them to discover your services.",
    icon: <ClipboardList className="w-8 h-8 text-secondary/80" />,
  },
  {
    title: "Sales Dashboard",
    desc: "Track and monitor your sales, leads, and bookings with a clear, easy-to-use dashboard.",
    icon: <LayoutGrid className="w-8 h-8 text-secondary/80" />,
  },
  {
    title: "Build Your Network",
    desc: "Connect with wedding couples, expand your reach, and grow your wedding business network.",
    icon: <Users className="w-8 h-8 text-secondary/80" />,
  },
];
