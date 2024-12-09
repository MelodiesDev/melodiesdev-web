"use client";

import React, { FC, useRef } from "react";
import { Cloud, Clouds, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { MeshBasicMaterial, Vector3 } from "three";

export const THREEDComponents: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="absolute m-0 p-0 h-full w-full">
      <Canvas eventSource={ref.current ?? undefined}>
        <Clouds material={MeshBasicMaterial} renderOrder={2}>
          <Cloud
            seed={0}
            segments={50}
            bounds={[20, 1, 1]}
            position={new Vector3(0, 9.5, -8)}
            color="#464259"
            speed={0.1}
          />
          <Cloud seed={1} scale={2} volume={3} color="black" fade={100} />
          <Cloud seed={2} scale={1} volume={1} color="purple" fade={100} />
          <Cloud seed={3} scale={1} volume={1} color="darkblue" fade={100} />
        </Clouds>

        <Stars
          radius={30}
          depth={50}
          count={5000}
          factor={5}
          saturation={5}
          fade
          speed={1}
        />
      </Canvas>
    </div>
  );
};
