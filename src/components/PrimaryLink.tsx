import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PrimaryLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex w-fit items-center gap-2 rounded-lg bg-ink px-3.5 py-2 font-medium text-white shadow-sm transition-all duration-100 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        className
      )}
    >
      {children}
      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
