import React from "react";

export function LinkButton({
  href,
  children
}: React.PropsWithChildren<{ href: string }>) {
  return (
    <a className="group" target="_blank" href={href} rel="noreferrer">
      <div className="group-hover:-translate-y-1 group-hover:-rotate-12 transition-all">
        {children}
      </div>
    </a>
  );
}
