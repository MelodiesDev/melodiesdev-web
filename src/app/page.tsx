import Image from "next/image";
import CartoonClouds from "@/assets/cartoonclouds.svg";
import { TextBlock } from "@/components/TextBlock";

export default function Home() {
  return (
    <main>
      <div className="relative mt-32 flex flex-col gap-16">
        <TextBlock
          header="Hey there! I'm Melody!"
          href="/about"
          body="I'm 20 years old and currently living in Australia, over the
                  past year I have been learning Web Design and Web Development
                  to do as my main job. Fun fact I used to play in Overwatch
                  tournaments like AOL playing in various teams before I did any
                  of this... this is way less stressful."
        />
        <TextBlock
          href="/projects"
          header="What I Do!"
          body="I love making fun and playful websites that look and feel
              different and have a smooth user experience. Something unique is
              what I do best so if thats what you're looking for you've come to
              the right place!"
        />
        <Image
          className="absolute -z-10 "
          layout="responsive"
          src={CartoonClouds}
          alt="cartoonclouds"
        />
        <div className="mx-auto flex w-full justify-center pt-16">
          <a className="group mx-32 h-96 w-full rounded-2xl  bg-gradient-to-b from-[#864DFF]/80 to-[#339DE9]/80 p-4 outline outline-1 outline-transparent transition-all hover:rounded-xl hover:outline-white"></a>
        </div>
      </div>
    </main>
  );
}
