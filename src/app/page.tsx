"use client";

import { Glow, GlowCapture } from "@codaworks/react-glow";
import { ArrowRight, Volume2, VolumeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import java from "@/assets/java.svg";
import javascript from "@/assets/javascript.svg";
import kotlin from "@/assets/kotlin.svg";
import psylocke from "@/assets/psylocke.png";
import react from "@/assets/react.svg";
import typescript from "@/assets/typescript.svg";
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

export default function Home() {
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-gray-300 via-slate-900 to-black text-white">
      <div className="relative z-10 flex flex-col items-center px-4 pb-20 text-center md:px-8">
        {/* Header Section */}
        <GlowCapture>
          <Glow color="rgb(147, 51, 234)">
            <div className="relative flex flex-col items-center justify-center px-8 text-3xl md:px-0 md:text-5xl">
              <h1 className="bg-linear-to-r from-white to-purple-200 bg-clip-text pt-12 font-bold text-white md:pt-16 md:text-6xl">
                Hey there! I'm Melody!
              </h1>
              <h2 className="max-w-xl pt-8 font-normal text-lg text-purple-200/90 md:text-xl">
                I'm a Fullstack & Java/Kotlin Developer passionate about creating unique and ambitious projects!
              </h2>

              <div className="mt-12 w-full max-w-md rounded-2xl border border-purple-500/20 glow:border-purple-500/40 bg-purple-950/10 glow:bg-purple-900/20 p-8 shadow-[0_0_50px_-12px] shadow-purple-500/30 backdrop-blur-xl transition-all">
                <h2 className="mb-6 font-medium text-2xl text-purple-200">I specialize in these languages!</h2>
                <div className="z-10 flex flex-row justify-center gap-6 pt-2">
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
            <section className="relative z-10 mt-32 w-full max-w-4xl rounded-2xl border border-purple-500/30 glow:border-purple-500/50 bg-linear-to-br glow:bg-purple-900/30 from-purple-950/40 via-purple-900/20 to-purple-950/40 p-12 shadow-[0_0_100px_-12px] shadow-purple-500/20 backdrop-blur-xl">
              <div className="-top-6 -translate-x-1/2 absolute left-1/2 transform rounded-full border border-purple-500/30 bg-purple-600/20 px-6 py-2 backdrop-blur-xl">
                <span className="font-medium text-md text-purple-200">Featured Project</span>
              </div>

              <h2 className="mb-6 bg-linear-to-r from-white to-purple-200 bg-clip-text text-center font-bold text-4xl text-transparent">
                PSYLOCKE.GG
              </h2>
              <h3 className="mb-6 text-center font-medium text-purple-200 text-xl">Your Marvel Rivals Companion!</h3>
              <p className="mx-auto mb-6 max-w-2xl text-center text-purple-100/80">
                Take a look at the best Marvel Rivals website with an extensive array of features such as an extensive
                item database, all the latest comics from the game and all the latest details on the characters from the
                game!
              </p>
              <p className="text-center text-purple-200/70">
                Your go-to source for the latest cosmetics, characters and more!
              </p>
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
            </section>
          </Glow>
        </GlowCapture>

        {/* Plugin Development Section */}
        <section className="z-10 mx-auto mt-32 w-full justify-center">
          <GlowCapture>
            <Glow color="rgb(147, 51, 234)">
              <section className="relative z-10 mx-auto w-full max-w-6xl rounded-2xl border border-purple-500/30 glow:border-purple-500/50 bg-linear-to-br glow:bg-purple-900/30 from-purple-950/40 via-purple-900/20 to-purple-950/40 p-12 shadow-[0_0_100px_-12px] shadow-purple-500/20 backdrop-blur-xl">
                <div className="-top-6 -translate-x-1/2 absolute left-1/2 transform rounded-full border border-purple-500/30 bg-purple-600/20 px-6 py-2 backdrop-blur-xl">
                  <span className="font-medium text-md text-purple-200">Plugin Showcase</span>
                  <p className="mt-0.5 text-purple-300/80 text-xs">Hover over the cards to preview!</p>
                </div>
                <h2 className="mb-4 bg-linear-to-r from-white to-purple-200 bg-clip-text text-center font-bold text-3xl text-transparent">
                  Java/Kotlin Plugin Development
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-center text-purple-200/80">
                  Check out some of my Minecraft plugins featuring custom mechanics and particle effects!
                </p>
                <div className="relative flex flex-row justify-center gap-6 pb-4">
                  {carouselItems.map((data, index) => (
                    <div key={data.name} className={cn("w-80 shrink-0 md:w-96", "transition-all duration-150")}>
                      <Card className="overflow-hidden rounded-lg border border-purple-500/20 bg-black/30 shadow-[0_0_30px_-12px] shadow-purple-500/30 transition-all focus-within:border-purple-500/50 hover:border-purple-500/50">
                        <CardContent className="relative aspect-video p-0 transition-all hover:brightness-115">
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
              </section>
            </Glow>
          </GlowCapture>
        </section>
      </div>
    </main>
  );
}
