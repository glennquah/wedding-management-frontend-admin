import { motion } from "framer-motion";
import { Button } from "@shared/components/ui/button";
import { useRouter } from "next/navigation";
import useIsMobileScreen from "@shared/hooks/useIsMobileScreen";

export default function Hero(
    {color_theme = "primary", img_src, header, subheader}: {color_theme?: "primary" | "secondary", img_src: string, header: string, subheader: string}
) {
    const isMobile = useIsMobileScreen();
    const router = useRouter();
    return (
    <section className={`relative flex flex-col items-center justify-center text-center px-6 overflow-hidden min-h-[400px] ${isMobile ? 'pt-[120px] pb-0' : 'py-20'}`}>
        {/* Background Illustration */}
        <motion.img
          src={img_src}
          alt={header + " illustration background"}
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
            className={`text-5xl font-extrabold ${color_theme == "primary" ? "text-brand-900":"text-secondary-hover"} mb-4`} 
          >
            {header}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg text-gray-600 max-w-xl mb-8"
          >
            {subheader}
          </motion.p>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button size={"lg"}  className={`rounded-2xl text-xl ${color_theme == "secondary" && "bg-secondary hover:bg-secondary-hover"}`} onClick={() => router.push(`/get-started`)}>
                Get Started
            </Button>
          </motion.div>
        </div>
      </section>
    )
}