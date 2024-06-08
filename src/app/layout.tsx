"use client";

import "./globals.css";
import Image from "next/image";
import Twitter from "~icons/fe/twitter";
import Github from "~icons/fe/github-alt";
import Youtube from "~icons/fe/youtube";
import { LinkButton } from "@/components/LinkButton";
import { NavButton } from "@/components/NavButton";
import React, { FC } from "react";
import MelodiesDev from "@/assets/melodiesdev.svg";
import Clouds from "@/assets/clouds.svg";
import Icon from "@/assets/icon.png";
import { Nunito } from "next/font/google";

// export const metadata: Metadata = {
//   title: "Melodies Dev",
//   description: "meow meow"
// };

type RootLayoutProps = {
  children: React.ReactNode;
};

const nunito = Nunito({ subsets: ["latin"] });

const Header: FC = () => (
  <div className="relative flex flex-col items-center mx-auto mt-40 z-10 gap-4">
    <Image
      loading="eager"
      className="sm:hidden block w-16 h-16"
      src={Icon}
      alt="MelodiesDev"
    />
    <div className="flex flex-row gap-3 text-white font-bold">
      <NavButton href="/" text="Home" />
      <NavButton href="/artwork" text="Artwork" />
      <NavButton href="/blog" text="Blog" />
    </div>
    <div className="hidden sm:flex">
      <Image
        loading="eager"
        className="h-16 w-32 hover:scale-105 transition-all"
        src={MelodiesDev}
        alt="MelodiesDev"
      />
    </div>
    <div className="hidden gap-6 fill-white sm:flex">
      <LinkButton href="https://twitter.com/melodiesdev" label="My Twitter!">
        <Twitter />
      </LinkButton>
      <LinkButton href="https://github.com/melodiesdev" label="My Github!">
        <Github />
      </LinkButton>
      <LinkButton
        href="https://youtube.com/@MelodiesDevelopment"
        label="My Youtube!"
      >
        <Youtube />
      </LinkButton>
    </div>
  </div>
);

const Footer: FC = () => (
  <div className="flex relative bottom-0 w-full flex-row justify-between p-4 bg-gradient-to-b from-transparent to-black/30">
    <div>
      <span className="font-normal">
        Copyright © Melodies Development 2023
      </span>
    </div>
    <div className="font-normal">
      <NavButton href="/contact" text="Contact Me" />
    </div>
  </div>
);

const Stars: FC = () => {
  // List of colors you want your stars to have
  const colors = ["#ffffff", "#ffefd8", "#dcfffb", "#e0e8ff", "#cbcfea"];

  const positions = Array.from({ length: 300 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 0.4 + 0.7,
    color: colors[Math.floor(Math.random() * colors.length)] // Selecting random color from your list
  }));

  const starSvg = (fillColor: string) => (
    <svg
      fill={fillColor}
      viewBox="0 0 225 246"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M110 0L124.593 102.914L224.5 114.5L133.613 130.672L110 246L86.3874 130.672L0 114.5L95.4066 102.914L110 0Z"
        fill={fillColor}
      />
    </svg>
  );

  return positions.map(({ x, y, size, color }, i) => (
    <div
      key={i}
      className="absolute top-0 left-0"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        width: `${size}rem`,
        height: `${size}rem`
      }}
    >
      {starSvg(color)}
    </div>
  ));
};

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <body className={nunito.className}>
      <section className="relative overflow-hidden min-h-screen radial-gradient min-w-full">
        <div className="absolute left-0 right-0 top-0 z-0 animate-breathing transition-all">
          <Stars />
        </div>
        <Image
          loading="eager"
          className="absolute left-0 right-0 top-0 z-5 drop-shadow-2xl "
          src={Clouds}
          alt="clouds"
          style={{ width: "100%" }}
        />
        <Header />
        {children}
        <Footer />
      </section>
    </body>
  </html>
);

export default RootLayout;
