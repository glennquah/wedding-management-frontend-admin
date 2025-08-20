"use client";

import * as Menubar from "@radix-ui/react-menubar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useIsMobileScreen from "../hooks/useIsMobileScreen";

export const menubar_items = [
  "CHECKLIST",
  "GUEST LIST",
  "BUDGET TRACKER",
  "VENDOR MANAGEMENT",
];

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
    <div className="fixed top-6 z-[100] ml-[1rem] flex w-[calc(100vw-1.75rem)] items-center justify-between rounded-3xl bg-base-white px-6 py-1 shadow-md">
      {/* LG Icon Far-left */}
      <h6
        onClick={() => router.push("/")}
        className="m-[-16px] mt-[-14px] cursor-pointer p-4 font-coachella_light text-sm tracking-tighter text-base-black hover:text-red"
      >
        W
      </h6>
      {/* Hamburger menubar */}
      <Menubar.Root>
        <Menubar.Menu>
          <Menubar.Trigger className="group mr-[-16px] flex p-4 scale-150">
            {" "}
            <HamburgerIcon />
          </Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content
              sideOffset={10}
              className="z-50 mr-[14px] flex w-[calc(100vw-1.75rem)] flex-col gap-2 rounded-3xl font-sans bg-base-white py-2 text-center text-base-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            >
              {" "}
              {menubar_items.map((item, index) => {
                const isActive = pathname === `/${item.toLowerCase()}/`;
                return (
                  <Menubar.Item
                    key={item}
                    className={`hover:font-bold hover:text-red ${
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
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>
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
    <div className="fixed top-0 z-[100] flex w-screen items-center justify-between px-8 py-2">
      {/* LG Icon Far-left */}
      <h1
        className="cursor-pointer font-coachella_thin tracking-tighter text-base-yellow hover:text-red"
        style={{
          textShadow:
            "2px 2px 2px rgba(18, 18, 18, 0.2), 3px 3px 2px rgba(18, 18, 18, 0.2), 4px 4px 2px rgba(18, 18, 18, 0.2),  5px 5px 2px rgba(18, 18, 18, 0.2)",
        }}
        onClick={() => router.push("/")}
      >
        W
      </h1>
      {/* Desktop Menubar */}
      <div className="flex gap-8 text-[14px] font-thin text-base-yellow">
        {menubar_items.map((item, index) => {
          const isActive = pathname === `/${item.toLowerCase()}/`;
          return (
            <h4
              key={item}
              onClick={() => !isActive && router.push(`/${item.toLowerCase()}`)}
              className={`${
                isActive
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:font-bold hover:text-red"
              }`}
            >
              {item}
            </h4>
          );
        })}
      </div>
    </div>
  );
};

export default function ResponsiveMenubar() {
  const isMobileScreen = useIsMobileScreen();
  // Mobile menubar will not be shown on the index page
  return isMobileScreen ? <MobileMenubar /> : <DesktopMenubar />;
}
