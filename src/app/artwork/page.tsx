import Image from "next/image";
import Link from "next/link";
import pose from "@/assets/MelodyPose.png";
import refsheet from "@/assets/MelodyRefSheet.png";

export default function Blog() {
  return (
    <div className="container mx-auto flex flex-col gap-8">
      <div className="flex w-full justify-center">
        <h1 className="font-bold font-serif text-6xl text-black">Here's all my commissioned artwork!</h1>
      </div>
      <div className="grid w-full grid-cols-2 items-center gap-16 rounded-lg border border-slate-200 p-8 text-left shadow-2xl backdrop-blur-xl transition-all">
        <Link className="h-fit w-fit border-slate-200 shadow-2xl" href="https://x.com/Ztermidsy_">
          <Image src={refsheet} alt="refsheet" />
        </Link>
        <Link className="h-fit w-fit border-slate-200 shadow-2xl" href="https://x.com/Ztermidsy_">
          <Image src={pose} alt="pose" />
        </Link>
      </div>
    </div>
  );
}
