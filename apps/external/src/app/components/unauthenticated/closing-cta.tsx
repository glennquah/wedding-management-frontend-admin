import { motion } from "framer-motion";
import { Button } from "@shared/components/ui/button";
import { useRouter } from "next/navigation";

export default function ClosingCTA(
  { color_theme = "primary", cta_text }: { color_theme?: "primary" | "secondary", cta_text: string }
) {
    const router = useRouter();
    return (
      <section className="text-center py-24 bg-gray-25 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-gray-800 mb-6"
        >
          {cta_text}
        </motion.h2>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button size={"lg"} className={`rounded-2xl text-xl ${color_theme == "secondary" && "bg-secondary hover:bg-secondary-hover"}`} onClick={() => router.push(`/get-started`)}>
            Get Started
          </Button>
        </motion.div>
      </section>
    )
}