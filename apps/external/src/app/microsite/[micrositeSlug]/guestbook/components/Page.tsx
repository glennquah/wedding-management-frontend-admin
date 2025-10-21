'use client';

import { forwardRef } from 'react';

import Image from 'next/image';

export type GuestbookPageProps = {
  children: React.ReactNode;
  number?: number;
};

const Page = forwardRef<HTMLDivElement, GuestbookPageProps>((props, ref) => {
  return (
    <div className="page" ref={ref}>
      <div className="w-full h-full sm:p-2 md:p-8 bg-[#FBF9F6] border border-stone-200 overflow-hidden rounded-md relative">
        <Image
          src="https://res.cloudinary.com/dnyxxyolp/image/upload/v1760605659/guestbook-page-floral_wq5er4.png"
          alt="decoration"
          width={150}
          height={150}
          className="absolute top-0 left-0 opacity-70"
        />
        <Image
          src="https://res.cloudinary.com/dnyxxyolp/image/upload/v1760605659/guestbook-page-floral_wq5er4.png"
          alt="decoration"
          width={150}
          height={150}
          className="absolute bottom-0 right-0 opacity-70 transform -scale-x-100 -scale-y-100"
        />
        <div className="w-full h-full flex flex-col">
          <div
            className="flex-grow text-base text-stone-700 py-12 px-10 flex flex-col justify-center"
            style={{ fontFamily: "'Lora', serif" }}
          >
            {props.children}
          </div>
          <div className="h-[30px] border-t border-stone-200 text-sm text-stone-400 text-center pt-2.5">
            {props.number ? props.number : ''}
          </div>
        </div>
      </div>
    </div>
  );
});

Page.displayName = 'Page';

export default Page;
