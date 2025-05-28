"use client"

import "./globals.css";
import Icon from "@/app/icon.png";
import MelodiesDev from "@/assets/melodiesdev.svg";
import { THREEDComponents } from "@/components/3DComponents";
import { DateTimeLocationPicker } from "@/components/DateTimeLocationPicker";
import { LinkButton } from "@/components/LinkButton";
import { NavButton } from "@/components/NavButton";
import { cn } from "@/lib/utils";
import { getLocationFromIP } from "@/lib/geolocation";
import { SiGithub, SiX, SiYoutube } from "@icons-pack/react-simple-icons";
import { Brush } from "lucide-react";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useState, FC, useEffect } from "react";

// Initialize Nunito font
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans"
});

// export const metadata: Metadata = {
//   title: "MelodiesDevelopment",
//   description:
//     "Melody's personal portfolio showcasing projects in game development (Minecraft Plugins, Marvel Rivals), web development (React, Next.js), and artwork. Check out Psylocke.gg for Marvel Rivals guides!",
//   keywords: [
//     "Melody",
//     "MelodiesDev",
//     "developer",
//     "portfolio",
//     "fullstack",
//     "React",
//     "Next.js",
//     "TypeScript",
//     "Minecraft",
//     "plugins",
//     "game development",
//     "web development",
//     "artwork",
//     "Marvel Rivals",
//     "Psylocke.gg"
//   ]
// };

type RootLayoutProps = {
  children: React.ReactNode;
};

const Header: FC = () => (
  <div className="relative z-10 mx-auto flex flex-col items-center pt-8 sm:gap-4">
    <Image
      loading="eager"
      className="block h-32 w-36 sm:hidden"
      src={Icon}
      alt="MelodiesDev"
    />
    <div className="hidden sm:flex">
      <Link href="/">
        <Image
          loading="eager"
          className="h-24 w-48 transition-all hover:scale-105"
          src={MelodiesDev}
          alt="MelodiesDev"
        />
      </Link>
    </div>
    <div className="flex flex-row gap-6 pt-4 sm:pt-0">
      <LinkButton
        href="https://x.com/melodiesdev"
        label="My Twitter!"
        className="transition-all hover:scale-110"
      >
        <SiX />
      </LinkButton>
      <LinkButton
        href="https://github.com/melodiesdev"
        label="My Github!"
        className="transition-all hover:scale-110"
      >
        <SiGithub />
      </LinkButton>
      <LinkButton
        href="https://youtube.com/@MelodiesDevelopment"
        label="My Youtube!"
        className="transition-all hover:scale-110 "
      >
        <SiYoutube />
      </LinkButton>
    </div>
    <Link
      className="hover:-rotate-12 hover:-translate-y-1 absolute top-6 right-6 sm:top-8 sm:right-8 transition-all"
      href="/artwork"
    >
      <Brush size={28} />
    </Link>
  </div>
);

const Footer: FC = () => (
  <div className="absolute bottom-0 z-[60] flex w-full flex-row items-center justify-between bg-gradient-to-t from-black/80 via-black/50 to-transparent px-6 py-5 backdrop-blur-sm">
    <div className="flex flex-row items-center gap-4">
      <p className="text-sm font-medium text-gray-200">made with 
        <span className="mx-1 animate-pulse text-red-500">❤️</span> 
        by
      </p>
      <LinkButton 
        href="https://x.com/melodiesdev" 
        label="My Twitter!"
        className="group"
      >
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-sm font-bold text-transparent transition-all group-hover:from-pink-500 group-hover:to-purple-500">melody</span>
      </LinkButton>
      <div className="h-4 w-[1px] bg-gradient-to-t from-purple-500 to-pink-500" />
      <LinkButton
        href="https://psylocke.gg"
        label="Psylocke.gg - Marvel Rivals Guides"
        className="group"
      >
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-sm font-bold text-transparent transition-all group-hover:from-pink-500 group-hover:to-purple-500">PSYLOCKE.GG</span>
      </LinkButton>
    </div>
    <LinkButton 
      href="/contact" 
      label="Contact Page Button" 
      className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
    >
      <span>Contact Me</span>
    </LinkButton>
  </div>
);

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  const [overrideDate, setOverrideDate] = useState<Date>(new Date());
  const [manualLocation, setManualLocation] = useState<{ latitude: number; longitude: number } | undefined>();

  useEffect(() => {
    // Fetch location from IP if no manual location is set
    if (!manualLocation) {
      getLocationFromIP().then(location => {
        setManualLocation(location);
      });
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleLocationChange = (location: { latitude: number; longitude: number }) => {
    setManualLocation(location);
  };

  return (
    <html lang="en" className={nunito.variable}>
      <body className={cn("radial-gradient ark font-sans", nunito.className)}>
        <DateTimeLocationPicker 
          onDateTimeChangeAction={setOverrideDate} 
          manualLocation={manualLocation}
          onLocationChangeAction={handleLocationChange}
        />
        <section className="radial-gradient relative min-h-screen min-w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <THREEDComponents overrideDate={overrideDate} observerLocation={manualLocation ? {coords: manualLocation, timestamp: Date.now()} as GeolocationPosition : undefined} />
          </div>
          <Header />
          <div className="relative z-50 h-full w-full">{children}</div>
          <Footer />
        </section>
      </body>
    </html>
  );
};

export default RootLayout;
