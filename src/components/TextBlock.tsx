import React from "react";
import { Glow, GlowCapture } from "@codaworks/react-glow";
import RightArrow from "~icons/fe/arrow-right";

export function TextBlock({
  href,
  header,
  body
}: React.PropsWithChildren<{
  href?: string;
  header: string;
  body: string;
}>) {
  return (
    <GlowCapture>
      <Glow color="white" debug={false} style={{}} className="">
        <div className="mx-auto my-1 flex justify-center lg:w-full">
          <a
            href={href}
            className="rounded-2xl bg-gradient-to-b from-[#864DFF]/80 to-[#339DE9]/80 p-4 outline-glow transition-all glow:bg-glow glow:outline glow:outline-white"
          >
            <div className="mb-3 flex flex-row justify-between">
              <div className="text-2xl font-semibold text-[#EAE2FF]">
                {header}
              </div>
              <RightArrow />
            </div>
            <div className="text-md max-w-3xl font-normal text-[#EAE2FF]">
              {body}
            </div>
          </a>
        </div>
      </Glow>
    </GlowCapture>
  );
}
