"use client";

import React, { useEffect, useState } from "react";
import * as Menubar from "@radix-ui/react-menubar";
import useIsMobileScreen from "@hooks/useIsMobileScreen";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export const menubar_items = ["Essentials", "Guest & Vendor", "The Big Day"];

const MobileMenubar = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="fixed top-6 z-[100] ml-[0.5rem] flex w-[calc(100vw-1.75rem)] items-center justify-between rounded-3xl bg-base-white px-6 py-1 shadow-md">
      {/* LG Icon Far-left */}
      <div
        onClick={() => router.push("/")}
        className="m-[-16px] mt-[-14px] cursor-pointer p-2 flex items-center"
        style={{ minWidth: 40, minHeight: 40 }}
      >
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="h-10 w-auto object-contain"
          priority
        />
      </div>
      {/* Hamburger menubar */}
      <div className="flex items-center gap-4 ">
        <Menubar.Root>
          <Menubar.Menu>
            <Menubar.Trigger className="group mr-[-16px] flex p-4 scale-150">
              <HamburgerIcon />
            </Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content
                sideOffset={10}
                className="items-center py-2 z-50 mx-[7px] flex w-[calc(100vw-1.75rem)] flex-col gap-2 rounded-3xl font-sans bg-base-white py-2 text-center text-base-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
              >
                {menubar_items.map((item, index) => {
                  const isActive = pathname === `/${item.toLowerCase()}/`;
                  return (
                    <Menubar.Item
                      key={item}
                      className={`hover:font-bold font-normal text-lg hover:text-red ${
                        isActive ? "font-bold text-red" : "font-light"
                      }`}
                      onClick={() =>
                        !isActive && router.push(`/${item.toLowerCase()}`)
                      }
                    >
                      {item}
                    </Menubar.Item>
                  );
                })}
                <Menubar.Item
                  className="mt-2 w-[8rem] rounded-full bg-primary text-primary-foreground px-3 py-2 font-semibold shadow hover:bg-primary-hover transition text-sm"
                  onClick={() => router.push("/get-started")}
                >
                  Get Started
                </Menubar.Item>
                <Menubar.Item
                  className="mt-1 w-[8rem] rounded-full border border-primary text-primary px-3 py-2 font-semibold hover:bg-primary/10 transition text-sm"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>
        </Menubar.Root>
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
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="fixed bg-secondary/80 top-0 z-[100] flex w-screen items-center justify-between px-8 py-4">
      {/* Left: Logo + Menubar Items */}
      <div className="flex items-center gap-8">
        <div
          onClick={() => router.push("/")}
          className="m-[-16px] cursor-pointer p-2 flex items-center"
        >
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="w-auto object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-8 text-[14px] font-thin font-montserrat text-base-yellow">
          {menubar_items.map((item, index) => {
            const isActive = pathname === `/${item.toLowerCase()}/`;
            return (
              <h6
                key={item}
                onClick={() =>
                  !isActive && router.push(`/${item.toLowerCase()}`)
                }
                className={`font-medium ${
                  isActive
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:font-bold hover:text-red"
                }`}
              >
                {item}
              </h6>
            );
          })}
        </div>
      </div>
      {/* Right: Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/get-started")}
          className="ml-4 cursor-pointer rounded-full bg-primary text-primary-foreground px-5 py-2 font-semibold shadow hover:bg-primary-hover transition text-sm"
        >
          Get Started
        </button>
        <button
          onClick={() => router.push("/login")}
          className="ml-2 cursor-pointer rounded-full border border-primary text-primary px-5 py-2 font-semibold hover:bg-primary/10 transition text-sm"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default function ResponsiveMenubar() {
  const isMobileScreen = useIsMobileScreen();
  // Mobile menubar will not be shown on the index page
  return isMobileScreen ? <MobileMenubar /> : <DesktopMenubar />;
}
