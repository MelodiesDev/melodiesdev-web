"use client";

import React, { FC, useEffect } from "react";

interface Position {
  x: number;
  y: number;
  size: number;
  color: string;
}

export const Stars: FC = () => {
  // List of colors you want your stars to have
  const [positions, setPositions] = React.useState<Position[]>([]);

  useEffect(() => {
    const colors = ["#ffffff", "#ffefd8", "#dcfffb", "#e0e8ff", "#cbcfea"];
    setPositions(
      Array.from({ length: 100 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 0.4 + 0.7,
        color: colors[Math.floor(Math.random() * colors.length)] // Selecting random color from your list
      }))
    );
  }, []);

  const starSvg = (fillColor: string) => (
    <svg
      fill={fillColor}
      viewBox="0 0 225 246"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M110 0L124.593 102.914L224.5 114.5L133.613 130.672L110 246L86.3874 130.672L0 114.5L95.4066 102.914L110 0Z"
        fill={fillColor}
      />
    </svg>
  );

  return positions.map(({ x, y, size, color }, i) => (
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
};
