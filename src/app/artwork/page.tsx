import peridot from "@/assets/peridotspin.gif";
import Image from "next/image";

export default function Blog() {
  return (
    <main>
      <div className="mt-16 flex w-full justify-center">
        <h1 className="text-6xl font-black text-white">
          Here's all my commissioned artwork!
        </h1>
      </div>
      <Image className="mx-auto pt-8" src={peridot} alt="peridotspin" />
    </main>
  );
}
