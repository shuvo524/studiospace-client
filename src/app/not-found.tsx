import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center py-16">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <svg
          viewBox="0 0 320 230"
          role="img"
          aria-label="An empty studio floor lit by a single spotlight"
          className="mx-auto w-full max-w-sm"
        >
          <defs>
            <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.5" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g className="text-primary">
            <polygon points="136,52 184,52 262,196 58,196" fill="url(#beam)" />
            <ellipse
              cx="160"
              cy="200"
              rx="104"
              ry="14"
              fill="currentColor"
              opacity="0.18"
            />
          </g>
          <g className="text-foreground">
            <rect
              x="120"
              y="14"
              width="80"
              height="38"
              rx="8"
              fill="currentColor"
            />
            <rect x="156" y="2" width="8" height="14" fill="currentColor" />
            <circle cx="160" cy="33" r="11" className="text-primary" fill="currentColor" />
          </g>
          <text
            x="160"
            y="176"
            textAnchor="middle"
            fontSize="56"
            fontWeight="700"
            fill="currentColor"
            className="text-foreground"
          >
            404
          </text>
        </svg>

        <h1 className="mt-8 text-3xl font-bold sm:text-4xl">
          This scene is not on our set
        </h1>
        <p className="mt-4 text-muted-foreground">
          The page you are looking for does not exist or has been moved. Let us
          get you back to the studio.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ size: "lg" }), "mt-8 gap-2")}
        >
          <ArrowLeft className="size-4" />
          Return to Home
        </Link>
      </div>
    </section>
  );
}