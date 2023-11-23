import React from "react";

export function LinkButton({
  href,
  arialabel,
  children
}: React.PropsWithChildren<{ href: string; arialabel: string }>) {
  return (
    <a
      className="group"
      target="_blank"
      href={href}
      aria-label={arialabel}
      rel="noreferrer"
    >
      <div className="group-hover:-translate-y-1 group-hover:-rotate-12 transition-all">
        {children}
      </div>
    </a>
  );
}
