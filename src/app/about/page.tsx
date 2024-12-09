import spin from "@/assets/dance-moves.gif";
import Image from "next/image";

export default function About() {
  return (
    <main>
      <div className="mt-16 mx-auto flex flex-col justify-center items-center">
        <Image src={spin} alt="spinnnnnnn" width={200} height={200} />
        <div className="flex flex-col gap-4 text-xl font-medium">
          <span>
            Hiya!, I'm Melody! a 21 year old software engineer with over a year
            of experience making plugins for Minecraft in Java and Kotlin.
          </span>
          <span>
            I've made tons of cool things like custom enchants and items to
            skills that you can level and vaults to store items in!
          </span>
          <span>
            This page is still a work in progress, but there will be more here
            soon!
          </span>
        </div>
      </div>
    </main>
  );
}
