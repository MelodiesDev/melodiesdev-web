"use client";

import React from "react";
import { GlowCapture } from "@codaworks/react-glow";

export function Providers({ children }: React.PropsWithChildren<{}>) {
  return <GlowCapture size={250}>{children}</GlowCapture>;
}
