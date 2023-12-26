declare module "@codaworks/react-glow" {
  import React from "react";

  // eslint-disable-next-line no-unused-vars
  export function Glow(props?: {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    debug?: boolean;
    className?: string;
    color: string;
  }): React.ReactNode;

  // eslint-disable-next-line no-unused-vars
  export function GlowCapture(props?: {
    children?: React.ReactNode;
    className?: string;
    size?: number;
  }): React.ReactNode;
}
