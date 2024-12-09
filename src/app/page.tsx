"use client";

import React, { useState } from "react";
import java from "@/assets/java.svg";
import react from "@/assets/react.svg";
import typescript from "@/assets/typescript.svg";
import kotlin from "@/assets/kotlin.svg";
import javascript from "@/assets/javascript.svg";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Volume2 } from "lucide-react";
import { VolumeOff } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface CarouselItemData {
  name: string;
  subtitle: string;
  video: string;
}

const carouselItems: CarouselItemData[] = [
  {
    name: "Black Hole",
    subtitle: "A force that sucks in blocks around it!",
    video: "/videos/blackhole.mp4"
  },
  {
    name: "Meteor Rain",
    subtitle: "Summons meteors to rain from the sky!",
    video: "/videos/meteorrain.mp4"
  },
  {
    name: "Divine Beam",
    subtitle: "Shoots a beam of light down from the heavens!",
    video: "/videos/divinebeam.mp4"
  }
];

export default function Home() {
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  return (
    <>
      <main>
        <div className="flex flex-col justify-center items-center text-3xl md:text-5xl md:px-0 px-8">
          <h1 className="pt-8 md:pt-14 font-medium text-white">
            Hey there! I'm Melody!
          </h1>
          <h1 className="pt-10 text-xs md:text-lg font-normal text-white">
            I've worked with these languages making fun stuff you'll love!
          </h1>
          <div className="flex flex-row gap-4 pt-6 z-10">
            <Image
              src={java}
              alt="java"
              className="w-12 h-12 transition-all hover:scale-110 duration-300"
              loading="eager"
            />
            <Image
              src={kotlin}
              alt="kotlin"
              className="w-12 h-12 transition-all hover:scale-110 duration-300"
              loading="eager"
            />
            <Image
              src={typescript}
              alt="ts"
              className="w-12 h-12 transition-all hover:scale-110 duration-300"
              loading="eager"
            />
            <Image
              src={javascript}
              alt="js"
              className="w-12 h-12 transition-all hover:scale-110 duration-300"
              loading="eager"
            />
            <Image
              src={react}
              alt="react"
              className="w-12 h-12 transition-all hover:scale-110 duration-300"
              loading="eager"
            />
          </div>
          <div className="pt-10 text-lg font-normal text-white flex flex-row gap-8 z-10">
            <Link
              className="flex flex-row gap-2 justify-center items-center transition-all hover:scale-105 duration-300"
              href="/about/"
            >
              Learn More <ArrowRight />
            </Link>
          </div>
        </div>
      </main>
      <Carousel
        opts={{
          align: "start"
        }}
        className="px-32 pt-8"
      >
        <CarouselContent>
          {carouselItems.map((data, index) => (
            <CarouselItem key={index} className="basis-1/3">
              <Card>
                <CardContent className="aspect-video p-2 transition-all rounded-md overflow-clip opacity-75 hover:opacity-100">
                  <div
                    className="relative"
                    onMouseOver={() => {
                      setHoveredVideo(index);
                    }}
                    onMouseOut={(event) => {
                      // Check if the related target is an Element before using closest
                      const target = event.relatedTarget as Element;
                      if (!target?.closest(".mute-button")) {
                        setHoveredVideo(null);
                      }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10 pointer-events-none">
                      <div className="flex flex-col justify-end p-4 h-full">
                        <span className="text-xl font-medium">{data.name}</span>
                        <span>{data.subtitle}</span>
                      </div>
                    </div>
                    <video
                      src={data.video}
                      className="aspect-video rounded-md"
                      onMouseOver={(event) => {
                        event.currentTarget.play();
                      }}
                      onMouseOut={(event) => {
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
                        onClick={() => setMuted(!muted)}
                        className="absolute bottom-2 right-2 bg-black/30 text-white px-2 py-1 z-20 rounded-md hover:bg-black/70 transition-all mute-button"
                      >
                        {muted ? <VolumeOff /> : <Volume2 />}
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}
