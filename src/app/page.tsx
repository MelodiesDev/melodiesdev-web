"use client";

import { SiGithub, SiX, SiYoutube } from "@icons-pack/react-simple-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowLeft, ArrowRight, Volume2, VolumeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import java from "@/assets/java.svg";
import javascript from "@/assets/javascript.svg";
import kotlin from "@/assets/kotlin.svg";
import psylocke from "@/assets/psylocke.png";
import react from "@/assets/react.svg";
import typescript from "@/assets/typescript.svg";
import { LinkButton } from "@/components/LinkButton";
import TimeAgo from "@/components/TimeAgo";
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
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-32">
      <div className="flex w-full flex-col justify-center gap-4 lg:flex-row">
        {/* Header Section */}
        <div className="flex flex-col items-start justify-center gap-4 text-black">
          <div className="flex w-full flex-col gap-2 rounded-lg border border-slate-200 p-8 text-left shadow-[0_0_50px_-12px] shadow-purple-500/30 backdrop-blur-xl transition-all">
            <h1 className="text-4xl">Hey there! I'm Melody!</h1>
            <h2 className="max-w-xl font-normal text-xl">
              I've been creating experiences players love for the past {dayjs().from("2023-03-19", true)}!
            </h2>
            <p>If you like anything you see here please reach out I'd love to make something with you!</p>
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col items-center gap-2 border border-slate-200 p-8 shadow-[0_0_50px_-12px] shadow-purple-500/30 backdrop-blur-xl transition-all">
              <span className="pb-2 font-bold text-lg">My Socials!</span>
              <div className="flex flex-row items-center justify-center gap-4">
                <LinkButton
                  href="https://x.com/melodiesdev"
                  label="My Twitter!"
                  className="transition-all hover:scale-110"
                >
                  <SiX className="text-black" />
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
            <div className="flex flex-col gap-2 rounded-lg border border-slate-200 p-8 text-left shadow-[0_0_50px_-12px] shadow-purple-500/30 backdrop-blur-xl transition-all">
              <div className="flex flex-col items-center gap-2 lg:flex-row">
                <ArrowLeft />
                <h1 className="text-4xl">Connect with me here!</h1>
              </div>
              <p>If you like anything you see here please reach out I'd love to make something with you!</p>
            </div>
          </div>
        </div>

        <div className="grid w-fit grid-cols-2 gap-4 rounded-lg border border-slate-200 p-8 shadow-[0_0_50px_-12px] shadow-purple-500/30 backdrop-blur-xl transition-all">
          <div className="group pointer-events-none transition-all">
            <Image
              src={java}
              alt="java"
              className="h-12 w-12 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-110"
              loading="eager"
            />
          </div>
          <div className="pointer-events-none">
            <Image
              src={kotlin}
              alt="kotlin"
              className="h-12 w-12 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-110"
              loading="eager"
            />
          </div>
          <div className="pointer-events-none">
            <Image
              src={typescript}
              alt="ts"
              className="h-12 w-12 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-110"
              loading="eager"
            />
          </div>
          <div className="pointer-events-none">
            <Image
              src={javascript}
              alt="js"
              className="h-12 w-12 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-110"
              loading="eager"
            />
          </div>
          <div className="pointer-events-none">
            <Image
              src={react}
              alt="react"
              className="h-12 w-12 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-110"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Psylocke.gg Section */}
      <div className="w-full max-w-6xl border border-slate-200 p-8 shadow-[0_0_100px_-12px] shadow-purple-500/20 backdrop-blur-xl">
        <div className="flex flex-col justify-between xl:flex-row">
          <div className="flex w-full flex-col items-start gap-2 text-left text-black">
            <h2 className="font-bold text-3xl lg:text-6xl">PSYLOCKE.GG</h2>
            <h3 className="font-medium text-xl">Your Marvel Rivals Companion!</h3>
          </div>
          <p className="max-w-3xl justify-center text-xl">
            Take a look at the best Marvel Rivals website with an extensive array of features such as an extensive item
            database, all the latest comics from the game and all the latest details on the characters from the game!
          </p>
        </div>

        <div className="pointer-events-none mt-8 overflow-hidden rounded-xl border border-purple-500/30 shadow-[0_0_30px_-12px] shadow-purple-500/30">
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
            className="group inline-flex items-center gap-2 rounded-xl bg-purple-600/50 px-6 py-3 font-medium text-white shadow-[0_0_20px_-4px] shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:bg-purple-500"
          >
            Visit PSYLOCKE.GG
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Plugin Development Section */}
      <div className="z-10 w-full max-w-6xl rounded-2xl border border-slate-200 p-8 text-black shadow-[0_0_100px_-12px] shadow-purple-500/20 backdrop-blur-xl">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <h2 className="font-bold text-black text-xl lg:text-3xl">Minecraft Plugins</h2>
          <p className="w-full lg:max-w-2xl">
            Check out some of my Minecraft plugins featuring custom mechanics and particle effects!
          </p>
        </div>
        <div className="relative flex flex-col items-center justify-center gap-6 xl:flex-row">
          {carouselItems.map((data, index) => (
            <div key={data.name} className={cn("w-80 shrink-0 md:w-96", "transition-all duration-150")}>
              <Card className="overflow-hidden rounded-lg shadow-[0_0_30px_-12px] shadow-purple-500/30 transition-all">
                <CardContent className="relative aspect-video h-full p-0 transition-all hover:brightness-115">
                  <button
                    type="button"
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
                        className="mute-button absolute right-3 bottom-3 z-20 rounded-full bg-black/50 p-1.5 text-white transition-all hover:scale-110 hover:bg-black/80"
                      >
                        {muted ? <VolumeOff size={16} /> : <Volume2 size={16} />}
                      </button>
                    )}
                  </button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
