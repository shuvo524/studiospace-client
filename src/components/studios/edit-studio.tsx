"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  StudioForm,
  type StudioFormValues,
} from "@/components/studios/studio-form";
import { useCurrentUser } from "@/hooks/use-current-user";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Studio } from "@/types/studio";

function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-6 rounded-2xl border border-border bg-card p-8">
      <div className="h-10 w-full rounded bg-muted" />
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="h-10 rounded bg-muted" />
        <div className="h-10 rounded bg-muted" />
        <div className="h-10 rounded bg-muted" />
        <div className="h-10 rounded bg-muted" />
      </div>
      <div className="h-40 w-full rounded bg-muted" />
      <div className="h-32 w-full rounded bg-muted" />
    </div>
  );
}

export function EditStudio({ studioId }: { studioId: string }) {
  const { user } = useCurrentUser();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    api<Studio>(`/api/studios/${studioId}`)
      .then((data) => {
        if (ignore) return;
        setStudio(data);
        setError(null);
      })
      .catch((err: Error) => {
        if (ignore) return;
        setError(err.message);
      });

    return () => {
      ignore = true;
    };
  }, [studioId, attempt]);

  function retry() {
    setStudio(null);
    setError(null);
    setAttempt((value) => value + 1);
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <p className="font-medium">We could not load this studio.</p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <div className="mt-5 flex justify-center gap-3">
          <Button onClick={retry}>Try again</Button>
          <Link
            href="/my-listings"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to My Listings
          </Link>
        </div>
      </div>
    );
  }

  if (!studio) {
    return <FormSkeleton />;
  }

  if (user && studio.ownerEmail !== user.email) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <p className="font-medium">You can only edit your own studios.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          This listing belongs to another host.
        </p>
        <Link
          href="/my-listings"
          className={cn(buttonVariants(), "mt-5")}
        >
          Go to My Listings
        </Link>
      </div>
    );
  }

  const initialValues: StudioFormValues = {
    title: studio.title,
    category: studio.category,
    hourlyRate: String(studio.hourlyRate),
    securityDeposit: studio.securityDeposit ? String(studio.securityDeposit) : "",
    maxCapacity: String(studio.maxCapacity),
    location: studio.location,
    imageUrl: studio.imageUrl,
    gallery: studio.gallery ?? [],
    amenities: studio.amenities ?? [],
    overview: studio.overview,
    cancellationPolicy:
      studio.cancellationPolicy ??
      "Flexible — free cancellation up to 24 hours before the session",
  };

  return (
    <StudioForm
      key={studio._id}
      mode="edit"
      studioId={studio._id}
      initialValues={initialValues}
    />
  );
}