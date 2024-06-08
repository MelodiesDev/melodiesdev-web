import React from "react";
import java from "@/assets/java.svg";
import react from "@/assets/react.svg";
import typescript from "@/assets/typescript.svg";
import kotlin from "@/assets/kotlin.svg";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col justify-center ml-96 mr-96 mt-8 border border-white rounded-md p-4 bg-gradient-to-b from-black/30 to-black/15">
        <h1 className="text-2xl font-black text-white mb-4">
          Hey there! I'm Melody!
        </h1>
        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-lg font-bold text-white">
            I'm a full stack developer with a passion for building beautiful and
            functional applications. I'm also a big fan of music and enjoy
            playing the guitar. I'm always looking for new challenges and
            opportunities to learn and grow. I'm excited to share my skills and
            knowledge with others. I'm a true believer in the power of
            collaboration and teamwork.
          </h1>
        </div>
      </div>
      <div className="flex flex-col ml-96 mr-96 items-center justify-center mx-auto mt-8 border border-white rounded-md p-4 bg-gradient-to-b from-black/30 to-black/15">
        <h1 className="text-2xl font-black text-white">
          I'm proficient in the languages below!
        </h1>
        <div className="flex flex-row gap-20 mt-4 z-10">
          <Image src={java} alt="java" className="w-12 h-12" />
          <Image src={kotlin} alt="kotlin" className="w-12 h-12" />
          <Image src={typescript} alt="ts" className="w-12 h-12" />
          <Image src={react} alt="react" className="w-12 h-12" />
        </div>
      </div>
    </main>
  );
}
