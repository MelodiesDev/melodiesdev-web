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
  const [diagonalStars, setDiagonalStars] = React.useState<Position[]>([]);

  useEffect(() => {
    const colors = ["#ffffff", "#ffe8c1", "#dcfffb", "#ffa7a7", "#cbcfea"];
    const width = window.innerWidth;
    const height = window.innerHeight;

    setPositions(
      Array.from({ length: 100 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() + 0.25,
        color: colors[Math.floor(Math.random() * colors.length)]
      }))
    );

    setSmallStars(
      Array.from({ length: 300 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      }))
    );

    const diagonalStarPositions = Array.from({ length: 300 }, () => {
      let x, y;
      const margin = 150; // Half of 300 pixels for margin

      // Ensure stars are within the diagonal band
      if (Math.random() < 0.5) {
        x = Math.random() * width;
        y = x + margin * (Math.random() - 0.5);
      } else {
        y = Math.random() * height;
        x = y + margin * (Math.random() - 0.5);
      }

      // Clamp values to window dimensions
      x = Math.max(0, Math.min(width, x));
      y = Math.max(0, Math.min(height, y));

      return {
        x: x,
        y: y,
        size: Math.random() * 0.4 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });

    setDiagonalStars(diagonalStarPositions);
  }, []);

  const starSvg = (fillColor: string) => (
    <svg
      fill={fillColor}
      viewBox="0 0 225 246"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-breathing transition-all opacity-0"
      style={{ animationDelay: `${Math.random() * 10}s` }}
    >
      <g>
        <path d="M107.196 19.7082C108.393 16.0229 113.607 16.023 114.804 19.7082L136.144 85.384C136.565 86.6796 137.616 87.6719 138.934 88.0173L205.612 105.494C209.449 106.499 209.639 111.877 205.882 113.151L138.719 135.93C137.523 136.335 136.589 137.281 136.199 138.482L114.804 204.329C113.607 208.014 108.393 208.014 107.196 204.329L85.7903 138.449C85.4061 137.267 84.494 136.33 83.3221 135.915L19.0218 113.131C15.3299 111.823 15.5236 106.537 19.3013 105.503L83.0999 88.0329C84.3988 87.6772 85.4315 86.6918 85.8477 85.411L107.196 19.7082Z" />
      </g>
    </svg>
  );

  const smallStarSvg = (fillColor: string) => (
    <svg
      fill={fillColor}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-30"
    >
      <circle cx="25" cy="25" r="25" />
    </svg>
  );

  const renderStars = (stars: Position[], small: boolean = false) =>
    stars.map(({ x, y, size, color }, i) => (
      <div
        key={i}
        className="absolute top-0 left-0"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          // transform: `translate(${x}px, ${y}px)`,
          width: `${small ? size * 2 : size}rem`,
          height: `${small ? size * 2 : size}rem`
        }}
      >
        {small ? smallStarSvg(color) : starSvg(color)}
      </div>
    ));

  return (
    <div className="big-blur">
      {renderStars(positions)}
      {renderStars(smallStars, true)}
      {renderStars(diagonalStars)}
    </div>
  );
};
