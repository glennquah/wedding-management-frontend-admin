'use client';

import { useEffect, useState } from 'react';

import useIsMobileScreen from '../hooks/useIsMobileScreen';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export const menubar_items = ['Essentials', 'Guest & Vendor', 'The Big Day'];

const MobileMenubar = () => {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed top-6 z-[100] ml-[0.8rem] flex w-[calc(100vw-1.75rem)] items-center justify-between rounded-3xl bg-base-white px-6 py-1 shadow-md">
      {/* LG Icon Far-left */}
      <div
        onClick={() => router.push('/')}
        className="m-[-16px] mt-[-14px] cursor-pointer p-2 flex items-center"
        style={{ minWidth: 40, minHeight: 40 }}
      >
        <Image
          src="/images/logo-single.png"
          alt="Logo"
          width={25}
          height={25}
          className="w-[25px] h-[25px] object-contain"
          priority
        />
      </div>
      {/* Hamburger menubar */}
      <div className="flex items-center gap-4 ">
        <Sheet>
          <SheetTrigger className="group mr-[-15px] flex p-4 scale-150">
            <HamburgerIcon />
          </SheetTrigger>
          <SheetContent
            side="top"
            className="items-center mt-[80px] z-50 mx-[15px] flex w-[calc(100vw-2rem)] flex-col gap-2 rounded-3xl font-sans bg-base-white py-2 text-center text-base-black"
          >
            <div className="flex flex-col gap-2 items-center">
              {menubar_items.map((item, idx) => {
                const isActive = pathname === `/${item.toLowerCase()}/`;
                const isLast = idx === menubar_items.length - 1;
                return (
                  <div key={item}>
                    <div
                      className={`hover:font-bold font-normal text-lg hover:text-red cursor-pointer ${
                        isActive ? 'font-bold text-red' : 'font-light'
                      }`}
                      onClick={() =>
                        !isActive && router.push(`/${item.toLowerCase().replace(/\s+/g, '-')}`)
                      }
                    >
                      {item}
                    </div>
                    {isLast && (
                      <Button
                        variant={'ghost'}
                        onClick={() => router.push('/for-businesses')}
                        className="text-base text-secondary hover:bg-secondary/10"
                      >
                        For Businesses
                      </Button>
                    )}
                  </div>
                );
              })}
              <Button
                variant={'default'}
                onClick={() => router.push('/get-started')}
                className="-mb-2"
              >
                Get Started
              </Button>
              <Button variant={'ghost'} onClick={() => router.push('/login')}>
                Login
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

function HamburgerIcon() {
  return (
    <div className="p-[0 6px] mx-[2px] grid justify-items-center gap-0.5">
      <span
        className={`duration-250 h-[1px] w-[10px] rounded-full bg-base-black transition-transform ease-in group-data-[state=open]:translate-y-[3px] group-data-[state=open]:rotate-45`}
      ></span>
      <span
        className={`duration-250 h-[1px] w-[10px] rounded-full bg-base-black transition-transform ease-in group-data-[state=open]:scale-x-0`}
      ></span>
      <span
        className={`duration-250 h-[1px] w-[10px] rounded-full bg-base-black transition-transform ease-in group-data-[state=open]:-translate-y-[3px] group-data-[state=open]:-rotate-45`}
      ></span>
    </div>
  );
}

const DesktopMenubar = () => {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  return (
    <div className="fixed bg-gray-100/80 top-0 z-[100] flex w-screen items-center justify-between px-8 py-4">
      {/* Left: Logo + Menubar Items */}
      <div className="flex items-center gap-8">
        <div
          onClick={() => router.push('/')}
          className="m-[-16px] cursor-pointer p-2 flex items-center"
        >
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={80}
            className="w-[100px] h-[80px] object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-8 text-[14px] font-thin font-montserrat text-base-yellow">
          {menubar_items.map((item, idx) => {
            const isActive = pathname === `/${item.toLowerCase()}/`;
            const isLast = idx === menubar_items.length - 1;
            return (
              <div key={item} className="flex items-center gap-8">
                <h6
                  onClick={() =>
                    !isActive && router.push(`/${item.toLowerCase().replace(/\s+/g, '-')}`)
                  }
                  className={`font-medium ${
                    isActive
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer hover:font-bold hover:text-red'
                  }`}
                >
                  {item}
                </h6>
                {isLast && (
                  <Button
                    variant={'ghost'}
                    onClick={() => router.push('/for-businesses')}
                    className="font-montserrat text-lg text-secondary hover:bg-secondary/10"
                  >
                    For Businesses
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Right: Buttons */}
      <div className="flex items-center gap-2">
        <Button variant={'default'} onClick={() => router.push('/get-started')}>
          Get Started
        </Button>
        <Button variant={'darkOutline'} onClick={() => router.push('/login')}>
          Login
        </Button>
      </div>
    </div>
  );
};

export default function ResponsiveMenubar() {
  const isMobileScreen = useIsMobileScreen();
  // Mobile menubar will not be shown on the index page
  return isMobileScreen ? <MobileMenubar /> : <DesktopMenubar />;
}
