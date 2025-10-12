"use client";

import "./globals.css";
import { Brush } from "lucide-react";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import type { FC } from "react";
import MelodiesDev from "@/assets/melodiesdev.svg";
import { LinkButton } from "@/components/LinkButton";
import Threads from "@/components/Threads";
import { cn } from "@/lib/utils";

// Initialize noto font
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "100",
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
//     "Psylocke.gg",
//   ],
// };

type RootLayoutProps = {
  children: React.ReactNode;
};

const Header: FC = () => (
  <div className="mb-8">
    <div className="flex w-full flex-row justify-end p-2">
      <Link className="hover:-rotate-12 hover:-translate-y-1 transition-all" href="/artwork">
        <Brush className="text-black" size={24} />
      </Link>
    </div>
    <div className="flex w-full justify-center">
      <Link href="/">
        <Image
          loading="eager"
          className="size-24 w-fit drop-shadow-2xl drop-shadow-purple-500/30 invert transition-all hover:scale-105"
          src={MelodiesDev}
          alt="MelodiesDev"
        />
      </Link>
    </div>
  </div>
);

const Footer: FC = () => (
  <div className="mt-8 flex w-full flex-row items-center justify-between bg-linear-to-t from-black/80 via-black/50 to-transparent p-8 backdrop-blur-sm">
    <div className="flex flex-row items-center gap-2">
      <p className="font-medium text-gray-200 text-sm">
        made with
        <span className="mx-1 animate-pulse">❤️</span>
        by
      </p>
      <LinkButton href="https://x.com/melodiesdev" label="My Twitter!" className="group">
        <span className="font-bold text-gray-200 text-sm">melody</span>
      </LinkButton>
    </div>
    <LinkButton
      href="/contact"
      label="Contact Page Button"
      className="font-medium text-gray-200 text-sm transition-all"
    >
      <span>Contact Me</span>
    </LinkButton>
  </div>
);

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="en" className={notoSans.variable}>
    <body className={cn("overflow-x-hidden font-sans")}>
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Threads color={[0, 0, 0]} amplitude={0.8} distance={0.3} enableMouseInteraction={true} />
      </div>
      <section className="relative z-10 min-h-screen w-full max-w-full">
        <Header />
        {children}
        <Footer />
      </section>
    </body>
  </html>
);

export default RootLayout;
