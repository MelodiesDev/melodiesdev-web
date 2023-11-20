import React from "react";

interface NavButtonProps {
  href: string;
  text: string;
}

export function NavButton({ href, text }: NavButtonProps) {
  return (
    <a href={href}>
      <div className="light-hover-glow dark:dark-hover-glow font-bold transition-all">
        {text}
      </div>
    </a>
  );
}
