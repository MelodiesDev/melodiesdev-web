import spin from "@/assets/dance-moves.gif";
import Image from "next/image";

export default function About() {
  return (
    <main>
      <div className="mt-16 mx-96 flex flex-col justify-center items-center">
        <Image src={spin} alt="spinnnnnnn" width={200} height={200} />
        soon™
      </div>
    </main>
  );
}
