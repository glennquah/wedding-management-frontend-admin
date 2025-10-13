'use client';

import { Lora, Playfair_Display } from 'next/font/google';
import Image from 'next/image';

const lora = Lora({ subsets: ['latin'], weight: ['400'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['500'] });

interface VendorCardProps {
  message: string;
  signOff: string;
}

export const VendorCard = ({ message, signOff }: VendorCardProps) => {
  return (
    <div className="relative flex flex-col items-center justify-start w-[420px] h-[420px] bg-gradient-to-b from-[#fffdfa] to-[#fdf7f2] rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-[#e8dfd1] py-6">
      {/* Thank You Image */}
      <Image
        src="https://res.cloudinary.com/dnyxxyolp/image/upload/v1760324408/thank_you_rrswiw.png"
        alt="Thank You"
        width={420}
        height={160}
        className="object-contain mb-2"
      />

      {/* Subheading */}
      <p
        className={`${playfair.className} text-center text-[#b7935b] text-lg italic mb-8 tracking-wide`}
      >
        For being our caterer
      </p>

      {/* Message */}
      <p
        className={`${lora.className} px-10 text-center text-gray-700 text-sm leading-relaxed tracking-wide whitespace-pre-line`}
      >
        {message}
      </p>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 w-full text-center px-4">
        <p className={`${lora.className} text-gray-800 tracking-wider`}>
          With much gratitude,
          <br />
          <span className="font-semibold text-[#b7935b]">{signOff}</span>
          <br />
          <span className="text-xs text-gray-500">DECEMBER 25, 2025</span>
        </p>

        <div className="mt-3 mx-auto w-[30%] border-t border-[#e0cda9]" />
      </div>
    </div>
  );
};
