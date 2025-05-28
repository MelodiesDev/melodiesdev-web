"use client";

import java from "@/assets/java.svg";
import javascript from "@/assets/javascript.svg";
import kotlin from "@/assets/kotlin.svg";
import react from "@/assets/react.svg";
import typescript from "@/assets/typescript.svg";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Rss, Volume2, VolumeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import psylocke from "@/assets/psylocke.png";
import { Glow, GlowCapture } from "@codaworks/react-glow";

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
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-black text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-black/50 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center px-4 pb-20 text-center md:px-8">
        {/* Header Section */}
        <GlowCapture>
          <Glow color="rgb(147, 51, 234)">
            <div className="relative flex flex-col items-center justify-center px-8 text-3xl md:px-0 md:text-5xl">

              <h1 className="pt-12 font-bold text-white md:pt-16 md:text-6xl bg-clip-text bg-gradient-to-r from-white to-purple-200">
                Hey there! I'm Melody!
              </h1>
              <h2 className="max-w-xl pt-8 font-normal text-lg text-purple-200/90 md:text-xl">
                I'm a Fullstack & Java/Kotlin Developer passionate about creating unique and ambitious projects!
              </h2>

              <div className="mt-12 w-full max-w-md rounded-2xl border border-purple-500/20 bg-purple-950/10 p-8 backdrop-blur-xl shadow-[0_0_50px_-12px] shadow-purple-500/30 glow:border-purple-500/40 glow:bg-purple-900/20 transition-all">
                <h2 className="font-medium text-2xl text-purple-200 mb-6">
                  I specialize in these languages!
                </h2>
                <div className="z-10 flex flex-row justify-center gap-6 pt-2">
                  <div className="pointer-events-none group transition-all">
                    <Image
                      src={java}
                      alt="java"
                      className="h-12 w-12 transition-all duration-300 hover:scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      loading="eager"
                    />
                  </div>
                  <div className="pointer-events-none">
                    <Image
                      src={kotlin}
                      alt="kotlin"
                      className="h-12 w-12 transition-all duration-300 hover:scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      loading="eager"
                    />
                  </div>
                  <div className="pointer-events-none">
                    <Image
                      src={typescript}
                      alt="ts"
                      className="h-12 w-12 transition-all duration-300 hover:scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      loading="eager"
                    />
                  </div>
                  <div className="pointer-events-none">
                    <Image
                      src={javascript}
                      alt="js"
                      className="h-12 w-12 transition-all duration-300 hover:scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      loading="eager"
                    />
                  </div>
                  <div className="pointer-events-none">
                    <Image
                      src={react}
                      alt="react"
                      className="h-12 w-12 transition-all duration-300 hover:scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
              {/* TODO: add this when i write something */}
              {/*<div className="z-10 flex flex-row gap-8 pt-12 font-normal text-lg">*/}
              {/*  <Link*/}
              {/*    className="group flex flex-row items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-white/20 backdrop-blur-sm"*/}
              {/*    href="/about/"*/}
              {/*  >*/}
              {/*    Learn More */}
              {/*    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />*/}
              {/*  </Link>*/}
              {/*</div>*/}
            </div>
          </Glow>
        </GlowCapture>

        {/* Psylocke.gg Section */}
        <GlowCapture>
          <Glow color="rgb(147, 51, 234)">
            <section className="relative z-10 mt-32 w-full max-w-4xl rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-purple-900/20 to-purple-950/40 p-12 shadow-[0_0_100px_-12px] shadow-purple-500/20 backdrop-blur-xl glow:border-purple-500/50 glow:bg-purple-900/30">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform rounded-full bg-purple-600/20 px-6 py-2 backdrop-blur-xl border border-purple-500/30">
                <span className="text-md font-medium text-purple-200">Featured Project</span>
              </div>
              
              <h2 className="mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-center font-bold text-4xl text-transparent">
                PSYLOCKE.GG
              </h2>
              <h3 className="mb-6 text-center font-medium text-xl text-purple-200">
                Your Marvel Rivals Companion!
              </h3>
              <p className="mx-auto mb-6 max-w-2xl text-center text-purple-100/80">
                Take a look at the best Marvel Rivals website with an extensive array of features such as an extensive item database, all the latest comics from the game and all the latest details on the characters from the game!
              </p>
              <p className="text-purple-200/70 text-center">
                Your go-to source for the latest cosmetics, characters and more!
              </p>
              <div className="pointer-events-none mt-8 rounded-xl overflow-hidden border border-purple-500/30 shadow-[0_0_30px_-12px] shadow-purple-500/30">
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
                  className="group inline-flex items-center gap-2 rounded-xl bg-purple-600/50 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-purple-500 shadow-[0_0_20px_-4px] shadow-purple-500/30"
                >
                  Visit PSYLOCKE.GG 
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </section>
          </Glow>
        </GlowCapture>

        {/* Plugin Development Section */}
        <section className="z-10 mx-auto mt-32 w-full justify-center">
          <GlowCapture>
            <Glow color="rgb(147, 51, 234)">
              <section className="relative z-10 w-full max-w-6xl mx-auto rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-purple-900/20 to-purple-950/40 p-12 shadow-[0_0_100px_-12px] shadow-purple-500/20 backdrop-blur-xl glow:border-purple-500/50 glow:bg-purple-900/30">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform rounded-full bg-purple-600/20 px-6 py-2 backdrop-blur-xl border border-purple-500/30">
                  <span className="text-md font-medium text-purple-200">Plugin Showcase</span>
                  <p className="text-xs text-purple-300/80 mt-0.5">Hover over the cards to preview!</p>
                </div>
                <h2 className="mb-4 text-center font-bold text-3xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Java/Kotlin Plugin Development
                </h2>
                <p className="text-center text-purple-200/80 mb-8 max-w-2xl mx-auto">
                  Check out some of my Minecraft plugins featuring custom mechanics and particle effects!
                </p>
                <div className="relative flex flex-row gap-6 pb-4 justify-center">
                  {carouselItems.map((data, index) => {
                    const isFirst = index === 0;
                    const isLast = index === carouselItems.length - 1;

                    return (
                      <div key={index} className={cn(
                        "w-80 flex-shrink-0 md:w-96",
                        "transition-all duration-150",
                      )}>
                        <Card className="overflow-hidden rounded-lg border border-purple-500/20 bg-black/30 transition-all focus-within:border-purple-500/50 hover:border-purple-500/50 shadow-[0_0_30px_-12px] shadow-purple-500/30">
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
            </Glow>
          </GlowCapture>
        </section>
      </div>
    </main>
  );
}
