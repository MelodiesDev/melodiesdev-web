import Image from "next/image";
import pose from "@/assets/MelodyPose.png";
import refsheet from "@/assets/MelodyRefSheet.png";

export default function Blog() {
  return (
    <main>
      <div className="mt-8 flex w-full justify-center">
        <h1 className="font-black text-6xl text-white">Here's all my commissioned artwork!</h1>
      </div>
      <div className="z-10 m-8 grid grid-cols-2 justify-center gap-16 pb-8">
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
