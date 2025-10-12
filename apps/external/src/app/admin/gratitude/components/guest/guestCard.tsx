'use client';

import { Great_Vibes, Playfair_Display } from 'next/font/google';
import Image from 'next/image';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
});

interface GuestCardProps {
  message: string;
  signOff: string;
  photoUrl: string;
}

export const GuestCard = ({ message, signOff, photoUrl }: GuestCardProps) => {
  return (
    <div className="relative flex w-[720px] h-[500px] overflow-hidden rounded-xl bg-white shadow-md">
      {/* Left text section */}
      <div className="flex flex-col justify-center items-center w-[40%] px-8 text-center bg-white">
        <p
          className={`${playfair.className} text-[18px] tracking-[1em] leading-relaxed uppercase text-gray-800 whitespace-pre-line`}
        >
          {message}
        </p>
        <p className={`${greatVibes.className} mt-8 text-gray-600 text-[24px] italic`}>{signOff}</p>
      </div>

      {/* Right image section */}
      <div className="relative w-[60%] h-full overflow-hidden">
        <Image src={photoUrl} alt="Wedding photo" fill className="object-cover" />
      </div>
    </div>
  );
};
