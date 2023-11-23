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
import "@fontsource/nunito";
import { Metadata } from "next";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Melodies Dev",
  description: "meow meow"
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const Header: FC = () => (
  <div className="container relative mx-auto flex px-16 pb-2 pt-2">
    <div className="absolute -bottom-6 left-0 right-0">
      <Image className="fill dark:invert" src={Line} alt="line" />
    </div>
    <div className="flex w-full justify-evenly">
      <div className="flex items-center justify-center sm:hidden">
        <Image src={Icon} alt="MelodiesDev" width="132" height="132" />
      </div>
      <div className="flex flex-1 items-center justify-start gap-3 text-white">
        <NavButton href="/" text="Home" />
        <NavButton href="/artwork" text="Artwork" />
        <NavButton href="/blog" text="Blog" />
      </div>
      <div className="hidden items-center justify-center sm:flex">
        <Image src={MelodiesDev} alt="MelodiesDev" width="132" height="132" />
      </div>
      <div className="hidden flex-1 items-center justify-end gap-6 fill-white sm:flex">
        <LinkButton href="https://twitter.com/melodiesdev">
          <Twitter />
        </LinkButton>
        <LinkButton href="https://github.com/melodiesdev">
          <Github />
        </LinkButton>
        <LinkButton href="https://youtube.com/@MelodiesDevelopment">
          <Youtube />
        </LinkButton>
      </div>
    </div>
  </div>
);

const Footer: FC = () => (
  <div className="flex w-full flex-row justify-between bg-gradient-to-b from-transparent to-purple-400/40 p-4">
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
  <Providers>
    <html lang="en">
      <body>
        <section className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#02364A] via-[#39C4F9] to-white dark:bg-gradient-to-b dark:from-[#BBA5FF] dark:via-blue-400 dark:to-white">
          <div className="flex w-full flex-grow flex-col">
            <div className="relative w-full">
              <Image
                src={Stars}
                alt="stars"
                className="absolute left-0 right-0 top-0"
                style={{ width: "100%" }}
              />
              <Image
                className="absolute left-0 right-0 top-0 -z-0 opacity-50"
                src={Clouds}
                alt="cloudsandstars"
                style={{ width: "100%" }}
              />
            </div>
            <Header />
            <div className="z-20 flex-grow">{children}</div>
          </div>
          <div className="mt-16 w-full">
            <Footer />
          </div>
        </section>
      </body>
    </html>
  </Providers>
);

export default RootLayout;
