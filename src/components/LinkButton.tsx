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
    <Link className={cn("group", className)} href={href} aria-label={label} rel="noreferrer">
      <div className="group-hover:-translate-y-1 group-hover:-rotate-12 transition-all">{children}</div>
    </Link>
  );
}
