"use client";

import { motion } from "framer-motion";
import React from "react";

export function LinkButton({
  href,
  children
}: React.PropsWithChildren<{ href: string }>) {
  return (
    <a target="_blank" href={href} rel="noreferrer">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        {children}
      </motion.div>
    </a>
  );
}
