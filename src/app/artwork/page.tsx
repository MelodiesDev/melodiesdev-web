import Image from "next/image";
import refsheet from "@/assets/MelodyRefSheet.png";
import pose from "@/assets/MelodyPose.png";

export default function Blog() {
  return (
    <main>
      <div className="mt-8 flex w-full justify-center">
        <h1 className="text-6xl font-black text-white">
          Here's all my commissioned artwork!
        </h1>
      </div>
      <div className="grid grid-cols-2 justify-center gap-16 m-8 pb-8 z-10 ">
        <a href="https://x.com/Ztermidsy_">
          <Image src={refsheet} alt="refsheet" />
        </a>
        <a href="https://x.com/Ztermidsy_">
          <Image src={pose} alt="pose" />
        </a>
      </div>
    </main>
  );
}
