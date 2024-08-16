"use client";

import React, { FC, useEffect } from "react";

interface Position {
  x: number;
  y: number;
  size: number;
  color: string;
}

export const Stars: FC = () => {
  const [positions, setPositions] = React.useState<Position[]>([]);
  const [smallStars, setSmallStars] = React.useState<Position[]>([]);

  useEffect(() => {
    const colors = ["#ffffff", "#ffe8c1", "#b1deff", "#ffb9b9", "#cbcfea"];
    setPositions(
      Array.from({ length: 100 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() + 0.25,
        color: colors[Math.floor(Math.random() * colors.length)]
      }))
    );
    setSmallStars(
      Array.from({ length: 300 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
      }))
    );
  }, []);

  const starSvg = (fillColor: string) => (
    <svg
      fill={fillColor}
      viewBox="0 0 225 246"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_17_40)">
        <path d="M107.196 19.7082C108.393 16.0229 113.607 16.023 114.804 19.7082L136.144 85.384C136.565 86.6796 137.616 87.6719 138.934 88.0173L205.612 105.494C209.449 106.499 209.639 111.877 205.882 113.151L138.719 135.93C137.523 136.335 136.589 137.281 136.199 138.482L114.804 204.329C113.607 208.014 108.393 208.014 107.196 204.329L85.7903 138.449C85.4061 137.267 84.494 136.33 83.3221 135.915L19.0218 113.131C15.3299 111.823 15.5236 106.537 19.3013 105.503L83.0999 88.0329C84.3988 87.6772 85.4315 86.6918 85.8477 85.411L107.196 19.7082Z" />
      </g>
      <defs>
        <filter
          id="filter0_f_17_40"
          x="0.357666"
          y="0.94426"
          width="224.24"
          height="222.148"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="8"
            result="effect1_foregroundBlur_17_40"
          />
        </filter>
      </defs>
    </svg>
  );

  const renderStars = (stars: Position[]) =>
    stars.map(({ x, y, size, color }, i) => (
      <div
        key={i}
        className="absolute top-0 left-0"
        style={{
          transform: `translate(${x}px, ${y}px)`,
          width: `${size}rem`,
          height: `${size}rem`
        }}
      >
        {starSvg(color)}
      </div>
    ));

  return (
    <div>
      {renderStars(positions)}
      {renderStars(smallStars)}
    </div>
  );
};
