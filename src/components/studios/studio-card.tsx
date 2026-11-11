"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { Aperture, MapPin, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Studio } from "@/types/studio";

export function StudioCard({ studio }: { studio: Studio }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasReviews = studio.reviewCount > 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {imageFailed ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-secondary">
            <Aperture className="size-12 text-muted-foreground" />
          </div>
        ) : (
          <img
            src={studio.imageUrl}
            alt={studio.title}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {studio.category}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
          <Star className="size-3 fill-current" />
          {hasReviews ? studio.rating.toFixed(1) : "New"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-semibold">{studio.title}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="text-lg font-bold">
            ${studio.hourlyRate}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / hr
            </span>
          </p>
          <Link
            href={`/studios/${studio._id}`}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}