import { cn } from "@/lib/utils";
import Link from "next/link";
import type React from "react";

export function LinkButton({
  href,
  label,
  children,
  className
}: React.PropsWithChildren<{
  href: string;
  label: string;
  className?: string;
}>) {
  return (
    <Link
      className={cn("group", className)}
      target="_blank"
      href={href}
      aria-label={label}
      rel="noreferrer"
    >
      <div className="group-hover:-translate-y-1 text-white group-hover:-rotate-12 transition-all">
        {children}
      </div>
    </Link>
  );
}
