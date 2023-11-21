import { motion } from "framer-motion";
import React from "react";

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
}

export function LinkButton({ href, children }: LinkButtonProps) {
  return (
    <a target="_blank" className="group" href={href} rel="noreferrer">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <div>{children}</div>
      </motion.div>
    </a>
  );
}
