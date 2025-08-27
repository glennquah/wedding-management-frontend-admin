"use client";

import { motion } from "framer-motion";
import { Button } from "@shared/components/ui/button";
import { Calendar, CheckSquare, DollarSign, Sparkles } from "lucide-react";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
import useIsMobileScreen from "@shared/hooks/useIsMobileScreen";

export default function EssentialsPage() {
  const isMobile = useIsMobileScreen();
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-brand-100 to-white text-gray-800 font-sans">
    <ResponsiveMenubar />
    {!isMobile && <div className="mt-[72px] w-full"></div>}
      {/* Hero Section */}
    <section className={`relative flex flex-col items-center justify-center text-center px-6 overflow-hidden min-h-[400px] ${isMobile ? 'pt-[120px] pb-0' : 'py-20'}`}>
        {/* Background Illustration */}
        <motion.img
          src="/images/line-chart.png"
          alt="Wedding illustration background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute inset-0 w-auto mx-auto h-full object-cover pointer-events-none select-none"
          style={{ zIndex: 0 }}
        />
        <div className="relative z-10 flex flex-col items-center w-full">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-extrabold text-brand-900 mb-4"
          >
            Never miss a detail.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg text-gray-600 max-w-xl mb-8"
          >
            We break down the major stages of wedding planning in the ultimate wedding checklist, with AI-powered tools that helps you cover every essential from picking your wedding date to tracking your budget.
          </motion.p>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button size={"lg"}  className="rounded-2xl text-xl">
                Get Started
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto py-20 px-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className="flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
          >
            <div className="mb-4 p-4 bg-brand-100 rounded-full">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-brand-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 mb-4">{feature.desc}</p>
            <img
              src="https://placehold.co/300x180/e0e0e0/555?text=Illustration"
              alt="Feature illustration"
              className="rounded-lg"
            />
          </motion.div>
        ))}
      </section>

      {/* Closing CTA */}
      <section className="text-center py-24 bg-gray-25 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-gray-800 mb-6"
        >
          Make sure you're on track for the big day.
        </motion.h2>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button size={"lg"}  className="rounded-2xl text-xl">
            Get Started
          </Button>
        </motion.div>
      </section>
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
