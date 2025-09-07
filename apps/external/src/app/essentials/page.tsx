"use client";

import { Calendar, CheckSquare, DollarSign, Sparkles } from "lucide-react";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
import useIsMobileScreen from "@shared/hooks/useIsMobileScreen";
import Hero from "../components/unauthenticated/hero";
import FeaturesPanel from "../components/unauthenticated/features-panel";
import ClosingCTA from "../components/unauthenticated/closing-cta";

export default function EssentialsPage() {
  const isMobile = useIsMobileScreen();
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-brand-100 to-white text-gray-800 font-sans">
      <ResponsiveMenubar />
      {!isMobile && <div className="mt-[72px] w-full"></div>}
      {/* Hero Section */}
      <Hero img_src="/images/essentials.jpg" header="Never miss a detail." subheader="We break down the major stages of wedding planning in the ultimate wedding checklist, with AI-powered tools that helps you cover every essential from picking your wedding date to tracking your budget." />
      {/* Features Section */}
      <FeaturesPanel features={features} />
      {/* Closing CTA */}
      <ClosingCTA cta_text="Make sure you're on track for the big day." />
    </div>
  );
}

const features = [
  {
    title: "AI Prediction of Best Dates",
    desc: "Let our AI recommend guest-friendly dates for your big day.",
    icon: <Sparkles className="w-8 h-8 text-brand-600" />,
  },
  {
    title: "Big Day Preparation Checklist",
    desc: "Stay organized with a smart checklist and track your progress with ease.",
    icon: <CheckSquare className="w-8 h-8 text-brand-600" />,
  },
  {
    title: "Google Calendar Integration",
    desc: "Sync schedules seamlessly so you never miss an important wedding task.",
    icon: <Calendar className="w-8 h-8 text-brand-600" />,
  },
  {
    title: "Budget Tracking",
    desc: "Keep your spending on track and stress-free with our budget manager.",
    icon: <DollarSign className="w-8 h-8 text-brand-600" />,
  },
];
