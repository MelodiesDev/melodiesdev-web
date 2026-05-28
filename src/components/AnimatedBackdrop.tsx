"use client";

import { useEffect, useState } from "react";
import Particles from "@/components/Particles";
import Threads from "@/components/Threads";
import VerticalThreads from "@/components/VerticalThreads";

const THREAD_LAYERS = [
  { translateY: "-20vh", rotation: 0, threadCount: 10 },
  { translateY: "30vh", rotation: -0.15, threadCount: 15 },
  { translateY: "90vh", rotation: 0.05, threadCount: 10 },
] as const;

function useShouldAnimate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!motionQuery.matches && document.visibilityState === "visible");

    update();
    motionQuery.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);

    return () => {
      motionQuery.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return enabled;
}

export function AnimatedBackdrop() {
  const animate = useShouldAnimate();

  if (!animate) return null;

  return (
    <>
      {THREAD_LAYERS.map((layer) => (
        <div
          key={layer.translateY}
          className="absolute top-0 right-0 left-0 z-0 h-screen overflow-hidden"
          style={{ transform: `translateY(${layer.translateY})` }}
        >
          <Threads
            color={[0, 0, 0]}
            amplitude={0.8}
            distance={0.3}
            enableMouseInteraction={false}
            rotation={layer.rotation}
          />
          <VerticalThreads
            color={[0, 0, 0]}
            amplitude={0.6}
            distance={0.8}
            enableMouseInteraction={false}
            rotation={layer.rotation}
            threadCount={layer.threadCount}
            threadLength={0.16}
            threadWidth={1.5}
          />
        </div>
      ))}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <Particles
          particleColors={["#000000"]}
          particleCount={200}
          particleSpread={175}
          speed={0.5}
          particleBaseSize={275}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
    </>
  );
}
