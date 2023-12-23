import "./globals.css";
import Image from "next/image";
import Twitter from "~icons/fe/twitter";
import Github from "~icons/fe/github-alt";
import Youtube from "~icons/fe/youtube";
import { LinkButton } from "@/components/LinkButton";
import { NavButton } from "@/components/NavButton";
import React, { FC } from "react";
import MelodiesDev from "@/assets/melodiesdev.svg";
import Line from "@/assets/Line.svg";
import Clouds from "@/assets/clouds.svg";
import Stars from "@/assets/stars.svg";
import Icon from "@/assets/icon.png";
import { Nunito } from "next/font/google";
import { Metadata } from "next";
import { Providers } from "@/components/Providers";
import CartoonClouds from "@/assets/cartoonclouds.svg";

export const metadata: Metadata = {
  title: "Melodies Dev",
  description: "meow meow"
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const nunito = Nunito({ subsets: ["latin"] });

const Header: FC = () => (
  <div className="container relative mx-auto flex px-16 pb-2 pt-2 z-10">
    <Image
      className="hidden sm:block absolute -bottom-6 left-0 right-0 dark:invert"
      loading="eager"
      src={Line}
      alt="line"
      style={{ width: "100%" }}
    />
    <div className="flex w-full justify-between">
      <Image
        loading="eager"
        className="sm:hidden block w-16 h-16 object-contain"
        src={Icon}
        alt="MelodiesDev"
      />
      <div className="flex flex-1 items-center justify-end gap-3 text-white font-bold sm:justify-start">
        <NavButton href="/" text="Home" />
        <NavButton href="/artwork" text="Artwork" />
        <NavButton href="/blog" text="Blog" />
      </div>
      <div className="hidden items-center justify-center sm:flex">
        <Image
          loading="eager"
          className="h-16 aspect-auto hover:scale-105 transition-all"
          src={MelodiesDev}
          alt="MelodiesDev"
        />
      </div>
      <div className="hidden flex-1 items-center justify-end gap-6 fill-white sm:flex">
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
  </div>
);

const Footer: FC = () => (
  <div className="flex fixed bottom-0 w-full flex-row justify-between bg-gradient-to-b from-transparent z-10 to-purple-400/40 p-4">
    <div>
      <span className="font-normal text-black">
        Copyright © Melodies Development 2023
      </span>
    </div>
    <div className="dark:invert">
      <NavButton href="/contact" text="Contact Me" />
    </div>
  </div>
);

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <body className={nunito.className}>
      <section className="relative overflow-hidden flex min-h-screen flex-col bg-gradient-to-b from-[#02364A] via-[#39C4F9] to-white dark:bg-gradient-to-b dark:from-[#BBA5FF] dark:via-blue-400 dark:to-white">
        <Image
          loading="eager"
          src={Stars}
          alt="stars"
          className="absolute left-0 right-0 top-0 -z-0 animate-breathing transition-all"
          style={{ width: "100%" }}
        />
        <Image
          loading="eager"
          className="absolute left-0 right-0 top-0 -z-0 opacity-50"
          src={Clouds}
          alt="cloudsandstars"
          style={{ width: "100%" }}
        />
        <Header />
        <Image
          src={CartoonClouds}
          alt="cartoonclouds"
          className="sm:flex hidden z-0 animate-cloudmovement absolute bottom-0 transformY transition-all"
          style={{ width: "100%" }}
        />
        <Providers>{children}</Providers>
        <div className="absolute bottom-0 w-full">
          <Footer />
        </div>
      </section>
    </body>
  </html>
);

export default RootLayout;
