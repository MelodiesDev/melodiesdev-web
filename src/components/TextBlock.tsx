import React from "react";
import { Glow } from "@codaworks/react-glow";
import RightArrow from "~icons/fe/arrow-right";

interface TextBlockProps {
  href?: string;
  header: string;
  body?: string;
  isRightArrowVisible?: boolean;
}

export function TextBlock({
  href,
  header,
  body,
  isRightArrowVisible
}: React.PropsWithChildren<TextBlockProps>) {
  return (
    <Glow color="white" debug={false} style={{}} className="">
      <div className="mx-auto my-16 flex justify-center lg:w-full">
        <a
          href={href}
          className="rounded-2xl bg-gradient-to-b from-[#864DFF]/80 to-[#339DE9]/80 p-4 outline-glow transition-all glow:bg-glow glow:outline glow:outline-white"
        >
          <div className="flex flex-row justify-between">
            <div className="text-2xl font-semibold text-[#EAE2FF]">
              {header}
            </div>
            {isRightArrowVisible && <RightArrow />}
          </div>
          <div className="text-md max-w-3xl font-normal text-[#EAE2FF]">
            {body}
          </div>
        </a>
      </div>
    </Glow>
  );
}
