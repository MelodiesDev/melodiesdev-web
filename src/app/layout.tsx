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
import { Metadata } from "next";
import { Stars } from "@/components/Stars";

export const metadata: Metadata = {
  title: "Melodies Dev",
  description: "meow meow"
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const nunito = Nunito({ subsets: ["latin"] });

const Header: FC = () => (
  <div className="relative flex flex-col items-center mx-auto sm:mt-40 z-10 sm:gap-4">
    <div className="flex flex-row gap-3 pt-8 text-white font-bold">
      <NavButton href="/" text="Home" />
      <NavButton href="/artwork" text="Artwork" />
      <NavButton href="/blog" text="Blog" />
    </div>
    <Image
      loading="eager"
      className="sm:hidden block h-32 w-36"
      src={Icon}
      alt="MelodiesDev"
    />
    <div className="hidden sm:flex">
      <Image
        loading="eager"
        className="h-16 w-32 hover:scale-105 transition-all"
        src={MelodiesDev}
        alt="MelodiesDev"
      />
    </div>
    <div className="gap-6 fill-white flex flex-row">
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
  <div className="flex absolute bottom-0 w-full flex-row justify-between p-4 bg-gradient-to-b from-transparent to-black/30">
    <div>
      <span className="text-sm font-normal">
        Copyright © Melodies Development 2023
      </span>
    </div>
    <div className="text-sm font-normal">
      <NavButton href="/contact" text="Contact Me" />
    </div>
  </div>
);

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <body className={nunito.className}>
      <section className="relative overflow-hidden min-h-screen radial-gradient min-w-full">
        <div className="absolute left-0 right-0 top-0 z-0 animate-breathing transition-all">
          <Stars />
        </div>
        <Image
          loading="eager"
          className="hidden sm:flex absolute left-0 right-0 top-0 z-5 drop-shadow-2xl "
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
