import Image from "next/image";
import CartoonClouds from "@/assets/cartoonclouds.svg";
import { TextBlock } from "@/components/TextBlock";

export default function Home() {
  return (
    <main>
      <div className="relative flex flex-col overflow-hidden">
        <TextBlock
          isRightArrowVisible={true}
          header="Hey there! I'm Melody!"
          href="/about"
          body="I'm 20 years old and currently living in Australia, over the
                  past year I have been learning Web Design and Web Development
                  to do as my main job. Fun fact I used to play in Overwatch
                  tournaments like AOL playing in various teams before I did any
                  of this... this is way less stressful."
        />
        <TextBlock
          isRightArrowVisible={true}
          href="/projects"
          header="What I Do!"
          body="I love making fun and playful websites that look and feel
              different and have a smooth user experience. Something unique is
              what I do best so if thats what you're looking for you've come to
              the right place!"
        />
        <div>
          <Image
            loading="eager"
            className="fill absolute top-0 -z-10"
            src={CartoonClouds}
            alt="cartoonclouds"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </main>
  );
}
