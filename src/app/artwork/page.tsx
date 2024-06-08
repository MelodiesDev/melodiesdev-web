import Image from "next/image";
import refsheet from "@/assets/MelodyRefSheet.png";
import pose from "@/assets/MelodyPose.png";

export default function Blog() {
  return (
    <main>
      <div className="mt-16 flex w-full justify-center">
        <h1 className="text-6xl font-black text-white">
          Here's all my commissioned artwork!
        </h1>
      </div>
      <div className="flex flex-col justify-center gap-8 z-10 my-8">
        <a href="https://x.com/Ztermidsy_">
          <Image className="mx-auto px-32" src={refsheet} alt="refsheet" />
        </a>
        <a href="https://x.com/Ztermidsy_">
          <Image className="mx-auto px-32" src={pose} alt="pose" />
        </a>
      </div>
    </main>
  );
}
