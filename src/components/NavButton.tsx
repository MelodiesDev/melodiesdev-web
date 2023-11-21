import React from "react";

interface NavButtonProps {
  href: string;
  text: string;
}

export function NavButton({ href, text }: NavButtonProps) {
  return (
    <a className="flex items-center justify-center" href={href}>
      <div className="underlined-animate rounded-md transition-all">{text}</div>
    </a>
  );
}
