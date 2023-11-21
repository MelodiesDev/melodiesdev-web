import peridot from "@/assets/peridotspin.gif";
import Image from "next/image";

export default function Blog() {
  return (
    <main>
      <div className="mt-8 flex w-full justify-center text-6xl font-black text-white">
        <h1>Here's what's been on my mind!</h1>
      </div>
      <Image className="mx-auto pt-8" src={peridot} alt="peridotspin" />
    </main>
  );
}
