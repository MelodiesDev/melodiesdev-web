import React from "react";
import java from "@/assets/java.svg";
import react from "@/assets/react.svg";
import typescript from "@/assets/typescript.svg";
import kotlin from "@/assets/kotlin.svg";
import javascript from "@/assets/javascript.svg";
import Image from "next/image";
import Arrow from "~icons/fe/arrow-right.jsx";
// import skink from "@/assets/skink.png";

export default function Home() {
  return (
    <main>
      <div className="relative z-10 flex flex-col justify-center items-center text-3xl md:text-5xl md:px-0 px-8">
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
        <div className="pt-10 text-lg font-normal text-white flex flex-row gap-8">
          <a
            className="flex flex-row gap-2 justify-center items-center transition-all hover:scale-105 duration-300"
            href="/about"
          >
            Learn More <Arrow />
          </a>
        </div>
        {/*<div className="z-10 pt-16 flex flex-row gap-8">*/}
        {/*  <Image*/}
        {/*    src={skink}*/}
        {/*    alt="peridotspin"*/}
        {/*    width="265"*/}
        {/*    height="165"*/}
        {/*    className="transition-all hover:scale-105 duration-300 border-gray-800 border-2 rounded-md opacity-60 hover:opacity-100 fill-black"*/}
        {/*  />*/}
        {/*  <Image*/}
        {/*    src={skink}*/}
        {/*    alt="peridotspin"*/}
        {/*    width="265"*/}
        {/*    height="165"*/}
        {/*    className="transition-all hover:scale-105 duration-300 border-gray-800 border-2 rounded-md opacity-60 hover:opacity-100 fill-black"*/}
        {/*  />*/}
        {/*  <Image*/}
        {/*    src={skink}*/}
        {/*    alt="peridotspin"*/}
        {/*    width="265"*/}
        {/*    height="165"*/}
        {/*    className="transition-all hover:scale-105 duration-300 border-gray-800 border-2 rounded-md opacity-60 hover:opacity-100 fill-black"*/}
        {/*  />*/}
        {/*</div>*/}
      </div>
    </main>
  );
}
