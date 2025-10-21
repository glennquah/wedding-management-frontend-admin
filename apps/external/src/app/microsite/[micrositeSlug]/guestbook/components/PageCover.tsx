'use client';

import { forwardRef } from 'react';

import type { GuestbookPageProps } from './Page';

const PageCover = forwardRef<HTMLDivElement, GuestbookPageProps>((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard">
      <div
        className="w-full h-full flex flex-col items-center justify-center p-5 bg-cover bg-center border-2 rounded-md"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dnyxxyolp/image/upload/v1760675900/guestbook-cover_h7ecw5.jpg')",
        }}
      >
        <h2
          className="text-8xl text-center  font-bold"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          {props.children}
        </h2>
      </div>
    </div>
  );
});

PageCover.displayName = 'PageCover';

export default PageCover;
