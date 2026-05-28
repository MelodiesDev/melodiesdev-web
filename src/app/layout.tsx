import "./globals.css";
import { Brush } from "lucide-react";
import type { Metadata } from "next";
import { Noto_Sans, Pridi } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import type { FC } from "react";
import MelodiesDev from "@/assets/melodiesdev.svg";
import { AnimatedBackdrop } from "@/components/AnimatedBackdrop";
import { LinkButton } from "@/components/LinkButton";
import { cn } from "@/lib/utils";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
  weight: ["400", "500", "600", "700"],
});

const pridiSerif = Pridi({
  subsets: ["latin"],
  variable: "--font-pridi",
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "MelodiesDev",
  description:
    "Melody's portfolio: game development (Meta Horizon Worlds, Minecraft plugins), web (React, Next.js), and artwork. Featuring Psylocke.gg, Locked In, Farm Inc., and Rummager.",
  keywords: [
    "Melody",
    "MelodiesDev",
    "portfolio",
    "game development",
    "Meta Horizon Worlds",
    "Minecraft plugins",
    "React",
    "Next.js",
    "TypeScript",
    "Psylocke.gg",
    "Marvel Rivals",
    "Farm Inc",
    "Rummager",
  ],
};

const Header: FC = () => (
  <div className="mb-8">
    <div className="flex w-full flex-row justify-end p-2">
      <Link
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg transition-all hover:-translate-y-1 hover:-rotate-12"
        href="/artwork"
        aria-label="View my artwork"
      >
        <Brush className="text-ink" size={24} />
      </Link>
    </div>
    <div className="flex w-full justify-center">
      <Link href="/" aria-label="Home">
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
  <div className="mt-8 text-ink">
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

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <html lang="en" className={cn(notoSans.variable, pridiSerif.variable)}>
    <body className="overflow-x-hidden bg-paper font-sans text-ink">
      <section className="relative flex min-h-screen w-full max-w-full flex-col overflow-hidden">
        <AnimatedBackdrop />
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
