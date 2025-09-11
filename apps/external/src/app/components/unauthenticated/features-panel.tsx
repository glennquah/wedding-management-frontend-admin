import { motion } from 'framer-motion';
import Image from 'next/image';

export default function FeaturesPanel({
  color_theme = 'primary',
  features,
}: {
  color_theme?: 'primary' | 'secondary';
  features: { title: string; desc: string; icon: React.ReactNode }[];
}) {
  return (
    <section className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto py-10 px-6">
      {features.map((feature, i) => {
        // Center last card if odd number of features
        const isLast = i === features.length - 1;
        const isOdd = features.length % 2 === 1;
        const cardClass = `flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition ${isLast && isOdd ? 'md:col-span-2 md:mx-auto md:max-w-[700px]' : ''}`;
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className={cardClass}
          >
            <div
              className={`mb-4 p-4 ${color_theme == 'primary' ? 'bg-gray-100' : 'bg-brand-100'} rounded-full`}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.desc}</p>
            <Image
              src="/images/placeholder-image.png"
              alt="Feature illustration"
              width={300}
              height={180}
              className="rounded-lg"
            />
          </motion.div>
        );
      })}
    </section>
  );
}
