import Link from "next/link";
import type React from "react";
import { cn } from "@/lib/utils";

export function LinkButton({
  href,
  label,
  children,
  className,
}: React.PropsWithChildren<{
  href: string;
  label: string;
  className?: string;
}>) {
  return (
    <Link
      className={cn("group inline-flex min-h-11 min-w-11 items-center justify-center", className)}
      href={href}
      aria-label={label}
      rel="noreferrer"
    >
      <div className="transition-all group-hover:-translate-y-1 group-hover:-rotate-12">{children}</div>
    </Link>
  );
}
