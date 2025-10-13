"use client";

import "./globals.css";
import { Brush } from "lucide-react";
import { Noto_Sans, Pridi } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import type { FC } from "react";
import MelodiesDev from "@/assets/melodiesdev.svg";
import { LinkButton } from "@/components/LinkButton";
import Particles from "@/components/Particles";
import Threads from "@/components/Threads";
import VerticalThreads from "@/components/VerticalThreads";
import { cn } from "@/lib/utils";

// Initialize noto font
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
  weight: "100",
});

const pridiSerif = Pridi({
  subsets: ["latin"],
  variable: "--font-pridi",
  weight: "200",
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
          className="size-24 w-fit shadow-2xl invert transition-all hover:scale-105"
          src={MelodiesDev}
          alt="MelodiesDev"
        />
      </Link>
    </div>
  </div>
);

const Footer: FC = () => (
  <div className="mt-8 text-black">
    <div className="flex w-full flex-row items-center justify-between p-8">
      <div className="flex flex-row items-center gap-2">
        <p className="font-bold text-sm">
          made with
          <span className="mx-1 animate-pulse">❤️</span>
          by
        </p>
        <LinkButton href="https://x.com/melodiesdev" label="My Twitter!" className="group">
          <span className="font-bold text-sm">melody</span>
        </LinkButton>
      </div>
      <LinkButton href="/contact" label="Contact Page Button" className="font-bold text-sm transition-all">
        <span>Contact Me</span>
      </LinkButton>
    </div>
  </div>
);

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="en" className={cn(notoSans.variable, pridiSerif.variable)}>
    <body className={cn("overflow-x-hidden bg-[#FBFAF5] font-sans")}>
      <section className="relative flex min-h-screen w-full max-w-full flex-col overflow-hidden">
        <div
          className="absolute top-0 right-0 left-0 z-0 h-screen overflow-hidden"
          style={{ transform: "translateY(-20vh)" }}
        >
          <Threads color={[0, 0, 0]} amplitude={0.8} distance={0.3} enableMouseInteraction={false} rotation={0} />
          <VerticalThreads
            color={[0, 0, 0]}
            amplitude={0.6}
            distance={0.8}
            enableMouseInteraction={false}
            rotation={0}
            threadCount={10}
            threadLength={0.16}
            threadWidth={1.5}
          />
        </div>
        <div
          className="absolute top-0 right-0 left-0 z-0 h-screen overflow-hidden"
          style={{ transform: "translateY(30vh)" }}
        >
          <Threads color={[0, 0, 0]} amplitude={0.8} distance={0.3} enableMouseInteraction={false} rotation={-0.15} />
          <VerticalThreads
            color={[0, 0, 0]}
            amplitude={0.6}
            distance={0.8}
            enableMouseInteraction={false}
            rotation={-0.15}
            threadCount={15}
            threadLength={0.16}
            threadWidth={1.5}
          />
        </div>
        <div
          className="absolute top-0 right-0 left-0 z-0 h-screen overflow-hidden"
          style={{ transform: "translateY(90vh)" }}
        >
          <Threads color={[0, 0, 0]} amplitude={0.8} distance={0.3} enableMouseInteraction={false} rotation={0.05} />
          <VerticalThreads
            color={[0, 0, 0]}
            amplitude={0.6}
            distance={0.8}
            enableMouseInteraction={false}
            rotation={0.05}
            threadCount={10}
            threadLength={0.16}
            threadWidth={1.5}
          />
        </div>
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{ width: "100%", height: "100%", position: "absolute" }}
        >
          <Particles
            particleColors={["#000000"]}
            particleCount={200}
            particleSpread={175}
            speed={0.5}
            particleBaseSize={275}
            moveParticlesOnHover={false}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>
        <div className="relative z-10 flex flex-1 flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </section>
    </body>
  </html>
);

export default RootLayout;
