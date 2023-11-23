"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { GlowCapture } from "@codaworks/react-glow";

export function Providers({ children }: React.PropsWithChildren<{}>) {
  return (
    <GlowCapture size={250}>
      <AnimatePresence mode="wait" initial={false}>
        {children}
      </AnimatePresence>
    </GlowCapture>
  );
}
