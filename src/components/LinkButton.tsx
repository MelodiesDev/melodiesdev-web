import React from "react";

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
}

export function LinkButton({ href, children }: LinkButtonProps) {
  return (
    <a target="_blank" className="group" href={href} rel="noreferrer">
      <div className="transition-all group-hover:-translate-y-1">
        {children}
      </div>
    </a>
  );
}
