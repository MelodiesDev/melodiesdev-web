"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";

export function Providers({ children }: React.PropsWithChildren<{}>) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {children}
    </AnimatePresence>
  );
}
