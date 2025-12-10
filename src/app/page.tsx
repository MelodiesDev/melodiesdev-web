"use client";

import { SiGithub, SiX, SiYoutube } from "@icons-pack/react-simple-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowLeft, ArrowRight, ArrowUp, Volume2, VolumeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  SiBlender,
  SiDocker,
  SiDrizzle,
  SiGit,
  SiJavascript,
  SiKotlin,
  SiLinkedin,
  SiMongodb,
  SiNotion,
  SiPython,
  SiReact,
  SiSqlite,
  SiTypescript,
} from "react-icons/si";
import awardshow from "@/assets/awardshow.jpg";
import farminc1 from "@/assets/farminc1.png";
import farminc2 from "@/assets/farminc2.png";
import lockedin from "@/assets/lockedin.png";
import psylocke from "@/assets/psylocke.png";
import { LinkButton } from "@/components/LinkButton";
import RotatingText from "@/components/RotatingText";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CarouselItemData {
  name: string;
  subtitle: string;
  video: string;
}

const carouselItems: CarouselItemData[] = [
  {
    name: "Black Hole",
    subtitle: "A force that sucks in blocks around it!",
    video: "/videos/blackhole.mp4",
  },
  {
    name: "Meteor Rain",
    subtitle: "Summons meteors to rain from the sky!",
    video: "/videos/meteorrain.mp4",
  },
  {
    name: "Divine Beam",
    subtitle: "Shoots a beam of light down from the heavens!",
    video: "/videos/divinebeam.mp4",
  },
];

dayjs.extend(relativeTime);

export default function Home() {
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);

  return (
    <div className="flex w-full flex-col items-center gap-32">
      {/* Hero Section */}
      <div className="container">
        <div className="flex w-full flex-col justify-center gap-4 lg:flex-row">
          <div className="flex w-full flex-col items-start justify-center gap-4 text-black">
            <div className="flex w-full flex-col gap-2 rounded-lg border border-slate-200 p-8 text-left shadow-2xl backdrop-blur-xl transition-all">
              <h1 className="font-bold font-serif text-2xl lg:text-5xl">Hey there! I'm Melody!</h1>
              <div className="flex flex-col items-center gap-1 lg:flex-row">
                <span className="font-semibold text-md lg:text-2xl">I've been creating</span>
                <RotatingText
                  texts={["experiences", "worlds", "plugins", "games", "environments"]}
                  mainClassName="bg-black text-md lg:text-2xl font-bold align-middle text-white text-black overflow-hidden justify-center rounded-lg"
                  staggerFrom={"first"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-150%" }}
                  staggerDuration={0.035}
                  splitLevelClassName="overflow-hidden"
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  rotationInterval={2000}
                />
                <div className="flex flex-row gap-2 lg:flex-none">
                  <span className="flex items-center font-semibold text-md lg:text-2xl">players love for the past</span>
                  <span className="rounded-lg bg-black px-2 py-1 font-bold text-sm text-white lg:text-2xl">
                    {dayjs().from("2023-03-19", true)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 lg:flex-row">
              <div className="flex flex-col items-center gap-2 border border-slate-200 p-8 shadow-2xl backdrop-blur-xl transition-all">
                <div className="grid grid-cols-2 items-center justify-center gap-4">
                  <LinkButton
                    href="https://x.com/melodiesdev"
                    label="My Twitter!"
                    className="transition-all hover:scale-110"
                  >
                    <SiX className="text-black" />
                  </LinkButton>
                  <LinkButton
                    href="https://x.com/melodiesdev"
                    label="My LinkedIn!"
                    className="transition-all hover:scale-110"
                  >
                    <SiLinkedin className="text-black" />
                  </LinkButton>
                  <LinkButton
                    href="https://github.com/melodiesdev"
                    label="My Github!"
                    className="transition-all hover:scale-110"
                  >
                    <SiGithub className="text-black" />
                  </LinkButton>
                  <LinkButton
                    href="https://youtube.com/@MelodiesDevelopment"
                    label="My Youtube!"
                    className="transition-all hover:scale-110"
                  >
                    <SiYoutube className="text-black" />
                  </LinkButton>
                </div>
              </div>
              <div className="flex w-full flex-col gap-2 rounded-lg border border-slate-200 p-8 text-left shadow-2xl backdrop-blur-xl transition-all">
                <div className="flex flex-col items-center gap-2 lg:flex-row">
                  <ArrowLeft className="hidden lg:block" />
                  <ArrowUp className="visible lg:hidden" />
                  <span className="font-serif text-4xl">Connect with me here!</span>
                </div>
                <p className="text-xl">
                  If you like anything you see here please reach out I'd love to make something with you!
                </p>
              </div>
            </div>
            <div className="grid h-full w-full grid-cols-6 justify-between gap-2 rounded-lg border border-slate-200 p-8 shadow-2xl backdrop-blur-xl lg:flex lg:flex-row">
              <SiJavascript size={32} className="transition-transform hover:scale-110" />
              <SiKotlin size={32} className="transition-transform hover:scale-110" />
              <SiDocker size={32} className="transition-transform hover:scale-110" />
              <SiMongodb size={32} className="transition-transform hover:scale-110" />
              <SiSqlite size={32} className="transition-transform hover:scale-110" />
              <SiTypescript size={32} className="transition-transform hover:scale-110" />
              <SiReact size={32} className="transition-transform hover:scale-110" />
              <SiPython size={32} className="transition-transform hover:scale-110" />
              <SiDrizzle size={32} className="transition-transform hover:scale-110" />
              <SiBlender size={32} className="transition-transform hover:scale-110" />
              <SiNotion size={32} className="transition-transform hover:scale-110" />
              <SiGit size={32} className="transition-transform hover:scale-110" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="container">
        <div className="flex w-full flex-col gap-16">
          <div className="w-full rounded-lg border border-slate-200 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col justify-between xl:flex-row">
              <div className="flex w-full flex-col items-start gap-2 text-left text-black">
                <span className="pb-2 font-bold font-serif text-3xl">Your Ultimate Marvel Rivals Companion!</span>
                <p className="max-w-3xl justify-center text-2xl">
                  <span className="font-semibold">PSYLOCKE.GG</span> is a Marvel Rivals website that has an extensive
                  array of features such as a complete item database, voice line viewer, store tracker and all the
                  latest details on new characters added to the game!
                </p>
              </div>
            </div>

            <div className="pointer-events-none mt-8 overflow-hidden rounded-lg shadow-2xl">
              <Image
                src={psylocke}
                alt="Psylocke.gg"
                className="w-full transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href="https://psylocke.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg bg-black px-2 py-2 font-medium text-white shadow-2xl transition-all duration-100 hover:scale-105"
              >
                Visit PSYLOCKE.GG
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="h-full w-full rounded-lg border border-slate-200 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex h-full flex-col justify-between text-black">
              <span className="pb-2 font-bold font-serif text-4xl">Meta Horizon Worlds Creator Academy</span>
              <p className="text-2xl">
                I got the amazing opportunity to fly out to San Francisco for the creator academy and meta connect and
                won an award for Outstanding Visual Design for my game Locked In.
              </p>
              <div className="pointer-events-none mt-8 rounded-lg shadow-2xl">
                <Image src={lockedin} alt="locked in" className="" />
                <Image className="border border-slate-200 border-t-2" src={awardshow} alt="Outstanding Visual Design" />
              </div>
              <div className="mt-8 flex justify-center">
                <Link
                  href="https://horizon.meta.com/world/4080898192123460"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-lg bg-black px-2 py-2 font-medium text-white shadow-2xl transition-all duration-100 hover:scale-105"
                >
                  Play Locked In
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex h-full w-full flex-col gap-4 rounded-lg border border-slate-200 p-8 text-black shadow-2xl backdrop-blur-xl">
            <span className="font-bold font-serif text-4xl">Horizon Worlds Competitions</span>
            <div className="flex flex-row gap-2">
              <Image className="aspect-square h-fit" src={farminc1} alt="farminc1" />
              <div className="flex w-full flex-col">
                <Image className="border border-slate-200" src={farminc2} alt="farminc2" />
                <div className="flex flex-row p-4">
                  <p className="text-2xl">
                    After the horizon academy myself and my partner Stella were approached by{" "}
                    <Link href="https://foad.gg" target="_blank" className="font-semibold">
                      FOAD
                    </Link>{" "}
                    to develop games for the platform. Our first game Farm Inc. won a competition category for "Best use
                    of Camera API" and we're super proud of it. The next game we've made is called Rummager which i'll
                    show off at the end of 2025.
                  </p>
                  <div className="flex w-full flex-col justify-end">
                    <Link
                      href="https://horizon.meta.com/world/4096893230523956"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex h-fit w-full items-center gap-2 rounded-lg bg-black px-2 py-2 font-medium text-white shadow-2xl transition-all duration-100 hover:scale-105"
                    >
                      Play Farm Inc.
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minecraft Plugins Section */}
      <div className="container">
        <div className="z-10 w-full rounded-2xl border border-slate-200 p-8 text-black shadow-2xl backdrop-blur-xl">
          <div className="mb-8 flex flex-col items-center gap-2 text-center">
            <h2 className="font-bold font-serif text-black text-xl lg:text-5xl">Minecraft Plugins</h2>
            <p className="w-full font-semibold text-xl">
              Check out some of my Minecraft plugins featuring custom mechanics and particle effects!
            </p>
          </div>
          <div className="relative flex flex-col items-center justify-center gap-6 xl:flex-row">
            {carouselItems.map((data, index) => (
              <div key={data.name} className={cn("w-80 shrink-0 md:w-96", "transition-all duration-150")}>
                <Card className="overflow-hidden rounded-lg shadow-2xl transition-all">
                  <CardContent className="relative aspect-video h-full p-0 transition-all hover:brightness-115">
                    {/** biome-ignore lint/a11y/noStaticElementInteractions: Not directly interacting so it's fine */}
                    <div
                      className="relative h-full w-full"
                      onMouseOver={() => {
                        setHoveredVideo(index);
                      }}
                      onFocus={() => {
                        setHoveredVideo(index);
                      }}
                      onMouseOut={(event) => {
                        const target = event.relatedTarget as Element;
                        if (!target?.closest(".mute-button")) {
                          setHoveredVideo(null);
                        }
                      }}
                      onBlur={(event) => {
                        const target = event.relatedTarget as Element;
                        if (!target?.closest(".mute-button")) {
                          setHoveredVideo(null);
                        }
                      }}
                    >
                      <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4">
                        <div className="flex h-full flex-col justify-end">
                          <h3 className="font-semibold text-lg text-white">{data.name}</h3>
                          <p className="text-gray-200 text-sm">{data.subtitle}</p>
                        </div>
                      </div>
                      <video
                        src={data.video}
                        className="aspect-video h-full w-full object-cover"
                        onMouseOver={(event) => {
                          event.currentTarget.play();
                        }}
                        onFocus={(event) => {
                          event.currentTarget.play();
                        }}
                        onMouseOut={(event) => {
                          const target = event.relatedTarget as Element;
                          if (!target?.closest(".mute-button")) {
                            event.currentTarget.pause();
                          }
                        }}
                        onBlur={(event) => {
                          const target = event.relatedTarget as Element;
                          if (!target?.closest(".mute-button")) {
                            event.currentTarget.pause();
                          }
                        }}
                        loop={true}
                        muted={muted}
                      />
                      {hoveredVideo === index && (
                        <button
                          type="button"
                          onClick={() => setMuted(!muted)}
                          className="mute-button absolute right-3 bottom-3 z-20 rounded-lg bg-black/50 p-1.5 text-white transition-all hover:scale-110 hover:bg-black/80"
                        >
                          {muted ? <VolumeOff size={16} /> : <Volume2 size={16} />}
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
