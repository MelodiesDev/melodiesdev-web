import "./globals.css";
import { SiGithub, SiX, SiYoutube } from "@icons-pack/react-simple-icons";
import { Brush } from "lucide-react";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import type { FC } from "react";
import Icon from "@/app/icon.png";
import MelodiesDev from "@/assets/melodiesdev.svg";
import { LinkButton } from "@/components/LinkButton";
import { cn } from "@/lib/utils";

// Initialize Nunito font
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MelodiesDevelopment",
  description:
    "Melody's personal portfolio showcasing projects in game development (Minecraft Plugins, Marvel Rivals), web development (React, Next.js), and artwork. Check out Psylocke.gg for Marvel Rivals guides!",
  keywords: [
    "Melody",
    "MelodiesDev",
    "developer",
    "portfolio",
    "fullstack",
    "React",
    "Next.js",
    "TypeScript",
    "Minecraft",
    "plugins",
    "game development",
    "web development",
    "artwork",
    "Marvel Rivals",
    "Psylocke.gg",
  ],
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const Header: FC = () => (
  <div className="relative z-10 mx-auto flex flex-col items-center pt-8 sm:gap-4">
    <Image loading="eager" className="block h-32 w-36 sm:hidden" src={Icon} alt="MelodiesDev" />
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
      <LinkButton href="https://x.com/melodiesdev" label="My Twitter!" className="transition-all hover:scale-110">
        <SiX />
      </LinkButton>
      <LinkButton href="https://github.com/melodiesdev" label="My Github!" className="transition-all hover:scale-110">
        <SiGithub />
      </LinkButton>
      <LinkButton
        href="https://youtube.com/@MelodiesDevelopment"
        label="My Youtube!"
        className="transition-all hover:scale-110"
      >
        <SiYoutube />
      </LinkButton>
    </div>
    <Link
      className="hover:-rotate-12 hover:-translate-y-1 absolute top-6 right-6 transition-all sm:top-8 sm:right-8"
      href="/artwork"
    >
      <Brush size={28} />
    </Link>
  </div>
);

const Footer: FC = () => (
  <div className="absolute bottom-0 z-60 flex w-full flex-row items-center justify-between bg-linear-to-t from-black/80 via-black/50 to-transparent px-6 py-5 backdrop-blur-sm">
    <div className="flex flex-row items-center gap-4">
      <p className="font-medium text-gray-200 text-sm">
        made with
        <span className="mx-1 animate-pulse text-red-500">❤️</span>
        by
      </p>
      <LinkButton href="https://x.com/melodiesdev" label="My Twitter!" className="group">
        <span className="bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text font-bold text-sm text-transparent transition-all group-hover:from-pink-500 group-hover:to-purple-500">
          melody
        </span>
      </LinkButton>
    </div>
    <LinkButton
      href="/contact"
      label="Contact Page Button"
      className="rounded-full bg-linear-to-r from-purple-500 to-pink-500 px-4 py-2 font-medium text-sm text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
    >
      <span>Contact Me</span>
    </LinkButton>
  </div>
);

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="en" className={nunito.variable}>
    <body className={cn("radial-gradient ark font-sans", nunito.className)}>
      <section className="radial-gradient relative min-h-screen min-w-full overflow-hidden">
        <Header />
        <div className="relative z-50 h-full w-full">{children}</div>
        <Footer />
      </section>
    </body>
  </html>
);

export default RootLayout;
