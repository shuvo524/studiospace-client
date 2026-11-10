import Link from "next/link";
import { Aperture } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="StudioSpace home"
      className="group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:rotate-90">
        <Aperture className="size-5" strokeWidth={2.2} />
      </span>
      <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
        Studio<span className="text-amber-700 dark:text-primary">Space</span>
      </span>
    </Link>
  );
}