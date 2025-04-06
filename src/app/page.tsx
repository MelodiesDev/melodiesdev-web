"use client";

import java from "@/assets/java.svg";
import javascript from "@/assets/javascript.svg";
import kotlin from "@/assets/kotlin.svg";
import react from "@/assets/react.svg";
import typescript from "@/assets/typescript.svg";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Rss } from "lucide-react";
import { Volume2 } from "lucide-react";
import { VolumeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import psylocke from "@/assets/img.png";

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

export default function Home() {
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  return (
    <>
      <main className="flex flex-col items-center px-4 pb-20 text-center md:px-8">
        <div className="flex flex-col items-center justify-center px-8 text-3xl md:px-0 md:text-5xl">
          <h1 className="pt-12 font-medium text-white md:pt-16 md:text-6xl">Hey there! I'm Melody!</h1>
          <p className="max-w-xl pt-8 font-normal text-gray-300 text-lg md:text-xl">
            I'm a Fullstack & Java/Kotlin Developer passionate about creating unique and ambitious projects!
          </p>
          <div className="mt-12 w-full max-w-md rounded-lg border border-sky-500/20 bg-black/10 p-6 backdrop-blur-sm">
            <h2 className="font-normal text-base text-white md:text-lg">Technologies I Enjoy Working With:</h2>
            <div className="z-10 flex flex-row justify-center gap-4 pt-6">
              <Image
                src={java}
                alt="java"
                className="h-12 w-12 transition-all duration-300 hover:scale-110"
                loading="eager"
              />
              <Image
                src={kotlin}
                alt="kotlin"
                className="h-12 w-12 transition-all duration-300 hover:scale-110"
                loading="eager"
              />
              <Image
                src={typescript}
                alt="ts"
                className="h-12 w-12 transition-all duration-300 hover:scale-110"
                loading="eager"
              />
              <Image
                src={javascript}
                alt="js"
                className="h-12 w-12 transition-all duration-300 hover:scale-110"
                loading="eager"
              />
              <Image
                src={react}
                alt="react"
                className="h-12 w-12 transition-all duration-300 hover:scale-110"
                loading="eager"
              />
            </div>
          </div>
          <div className="z-10 flex flex-row gap-8 pt-12 font-normal text-lg text-white">
            <Link
              className="flex flex-row items-center justify-center gap-2 px-4 py-2 font-medium text-white transition-all duration-300 hover:scale-105 hover:underline"
              href="/about/"
            >
              Learn More <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Psylocke.gg Section */}
        <section className="z-10 mt-20 w-full max-w-4xl rounded-xl border border-purple-600/50 bg-gradient-to-br from-purple-950/30 via-black/20 to-black/20 p-10 shadow-lg shadow-purple-900/20 backdrop-blur-md">
          <h2 className="mb-6 text-center font-semibold text-3xl text-purple-300">
            PSYLOCKE.GG - Your Marvel Rivals Companion!
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-center text-gray-300">
            Take a look at the best Marvel Rivals website with nearly every feature from in the game!
          </p>
          <p className="text-gray-300">
            Your go-to source for the latest cosmetics, characters and more!
          </p>
          <a href="https://psylocke.gg" target="_blank" rel="noopener noreferrer">
            <Image src={psylocke} alt="Psylocke.gg" className="mx-auto hover:border-purple-700 border-transparent border-1 hover:scale-103 transition-all duration-150 rounded-lg mt-8 w-full max-w-2xl" />
          </a>
          <div className="mt-8 flex justify-center">
            <Link
              href="https://psylocke.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-purple-700"
            >
              PSYLOCKE.GG <ArrowRight size={18} />
            </Link>
          </div>
        </section>
        <section className="z-10 mx-auto mt-20 w-full justify-center">
          <h2 className="mb-8 text-center font-semibold text-2xl text-purple-300">
            Java/Kotlin Plugin Development!
          </h2>
          <div className="relative flex flex-row gap-4 pb-4 justify-center">
            {carouselItems.map((data, index) => {
              const isFirst = index === 0;
              const isLast = index === carouselItems.length - 1;

              return (
                <div key={index} className={cn(
                  "w-80 flex-shrink-0 md:w-96",
                  "transition-all duration-150",
                  isFirst && "mask-l-from-80% hover:mask-none",
                  isLast && "mask-r-from-80% hover:mask-none",
                )}>
                  <Card className="overflow-hidden rounded-lg border border-transparent bg-black/30 transition-all focus-within:border-purple-500/50 hover:border-purple-500/50">
                    <CardContent className="relative aspect-video p-0 transition-all hover:brightness-115">
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
                        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
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
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
