import React from "react";
import java from "@/assets/java.svg";
import react from "@/assets/react.svg";
import typescript from "@/assets/typescript.svg";
import kotlin from "@/assets/kotlin.svg";
import javascript from "@/assets/javascript.svg";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="justify-center mx-4 md:mx-64 mt-8 border border-white rounded-lg p-4 bg-gradient-to-b from-black/30 to-black/15">
        <h1 className="text-2xl font-black text-white mb-4">
          Hey there! I'm Melody!
        </h1>
        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-lg font-bold text-white">
            I'm a 20 year old full stack and java/kotlin developer working in
            Australia. I've been working in these fields for the past 2 years
            and have a real good sense of creativity and innovation. I'm always
            looking for a fun new project to work on and I love a good
            challenge.
          </h1>
          <h1 className="text-lg font-bold text-white">
            If you've got something you want made I'm happy to help!
          </h1>
        </div>
      </div>
      <div className="mx-4 md:mx-64 mb-24 items-center justify-center mt-8 border border-white rounded-lg p-4 bg-gradient-to-b from-black/30 to-black/15">
        <div className="flex flex-row justify-between z-10">
          <Image src={java} alt="java" className="w-12 h-12" loading="eager" />
          <Image
            src={kotlin}
            alt="kotlin"
            className="w-12 h-12"
            loading="eager"
          />
          <Image
            src={typescript}
            alt="ts"
            className="w-12 h-12"
            loading="eager"
          />
          <Image
            src={javascript}
            alt="js"
            className="w-12 h-12"
            loading="eager"
          />
          <Image
            src={react}
            alt="react"
            className="w-12 h-12"
            loading="eager"
          />
        </div>
      </div>
    </main>
  );
}
