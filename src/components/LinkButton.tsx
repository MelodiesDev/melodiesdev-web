import React from "react";
import Link from "next/link";

export function LinkButton({
  href,
  label,
  children
}: React.PropsWithChildren<{ href: string; label: string }>) {
  return (
    <Link
      className="group"
      target="_blank"
      href={href}
      aria-label={label}
      rel="noreferrer"
    >
      <div className="group-hover:-translate-y-1 group-hover:-rotate-12 transition-all">
        {children}
      </div>
    </Link>
  );
}
