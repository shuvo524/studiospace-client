"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Aperture } from "lucide-react";
import { SectionHeading } from "@/components/home/section-heading";
import { StudioCard } from "@/components/studios/studio-card";
import { StudioCardSkeleton } from "@/components/studios/studio-card-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Studio } from "@/types/studio";

export function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    api<Studio[]>("/api/studios?limit=6&sort=rating")
      .then((data) => {
        if (ignore) return;
        setStudios(data);
        setError(null);
      })
      .catch((err: Error) => {
        if (ignore) return;
        setError(err.message);
      });

    return () => {
      ignore = true;
    };
  }, [attempt]);

  function retry() {
    setStudios(null);
    setError(null);
    setAttempt((value) => value + 1);
  }

  const isLoading = studios === null && error === null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Studios"
          title="Top-rated spaces ready to book"
          description="Hand-picked studios loved by filmmakers, photographers, podcasters and musicians."
        />

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <StudioCardSkeleton key={index} />
            ))}
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
            <p className="font-medium">We could not load the studios.</p>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button className="mt-5" onClick={retry}>
              Try again
            </Button>
          </div>
        )}

        {studios && studios.length === 0 && (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Aperture className="mx-auto size-10 text-primary" />
            <p className="mt-4 text-lg font-semibold">No studios listed yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Be the first host to list a creative space on StudioSpace.
            </p>
            <Link
              href="/add-studio"
              className={cn(buttonVariants(), "mt-5")}
            >
              Host Your Space
            </Link>
          </div>
        )}

        {studios && studios.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {studios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/studios"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                See All Studios
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}