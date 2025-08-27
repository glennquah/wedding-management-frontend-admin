"use client";

import { motion } from "framer-motion";
import { Button } from "@shared/components/ui/button";
import { Users, ClipboardList, Gift, LayoutGrid } from "lucide-react";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
import useIsMobileScreen from "@shared/hooks/useIsMobileScreen";
import { useRouter } from "next/navigation";

export default function VendorPage() {
  const router = useRouter();
  const isMobile = useIsMobileScreen();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-secondary/20 to-white text-gray-800 font-sans">
      <ResponsiveMenubar />
      {!isMobile && <div className="mt-[72px] w-full"></div>}

      {/* Hero Section */}
      <section
        className={`relative flex flex-col items-center justify-center text-center px-6 overflow-hidden min-h-[400px] ${
          isMobile ? "pt-[120px] pb-0" : "py-20"
        }`}
      >
        {/* Background Illustration */}
        <motion.img
          src="/images/vendor.png"
          alt="Vendor illustration background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute inset-0  w-auto mx-auto h-full object-cover pointer-events-none select-none"
          style={{ zIndex: 0 }}
        />

        <div className="relative z-10 flex flex-col items-center w-full">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-extrabold text-secondary-hover mb-4"
          >
            Grow Your Wedding Business
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg text-base-black max-w-xl mb-8"
          >
            List your products and services, track sales with a powerful dashboard,
            and connect with wedding couples to grow your network.
          </motion.p>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button size={"lg"} className="rounded-2xl text-xl bg-secondary hover:bg-secondary-hover" onClick={() => router.push(`/get-started`)}>
              Get Started
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto py-20 px-6">
        {features.map((feature, i) => {
          const isLast = i === features.length - 1;
          const isOdd = features.length % 2 === 1;
          const cardClass = `flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition ${
            isLast && isOdd ? "md:col-span-2 md:mx-auto md:max-w-[700px]" : ""
          }`;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className={cardClass}
            >
              <div className="mb-4 p-4 text-secondary rounded-full">{feature.icon}</div>
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
          );
        })}
      </section>

      {/* Closing CTA */}
      <section className="text-center py-24 bg-gray-25 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-gray-800 mb-6"
        >
          Connect, Track, and Grow Your Wedding Business.
        </motion.h2>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button size={"lg"} className="rounded-2xl text-xl bg-secondary hover:bg-secondary-hover" onClick={() => router.push(`/get-started`)}>
            Get Started
          </Button>
        </motion.div>
      </section>
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
