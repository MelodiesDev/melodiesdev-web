import type React from "react";

export function NavButton({ href, text }: React.PropsWithChildren<{ href: string; text: string }>) {
  return (
    <a className="group relative flex items-center justify-center" href={href}>
      {text}
      <div className="absolute right-0 bottom-0 left-0 h-0.5 scale-x-0 rounded-lg bg-white transition-all group-hover:scale-x-100"></div>
    </a>
  );
}
