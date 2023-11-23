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
      <div className="container flex mx-auto">
        <a
          href={href}
          className="flex w-full flex-col m-1 rounded-2xl bg-gradient-to-b from-[#864DFF]/80 to-[#339DE9]/80 p-4 outline-glow glow:bg-glow glow:outline glow:outline-white"
        >
          <div className="flex flex-row justify-between">
            <div className="text-2xl font-semibold text-[#EAE2FF]">
              {header}
            </div>
            {isRightArrowVisible && <RightArrow />}
          </div>
          <div className="text-md font-normal text-[#EAE2FF]">{body}</div>
        </a>
      </div>
    </Glow>
  );
}
