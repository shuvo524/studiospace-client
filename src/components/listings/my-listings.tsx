"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Aperture, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { authApi } from "@/lib/auth-api";
import { cn } from "@/lib/utils";
import type { Studio } from "@/types/studio";

function ListingImage({ studio }: { studio: Studio }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-secondary">
        <Aperture className="size-10 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={studio.imageUrl}
      alt={studio.title}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
}

function ListingSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
      <div className="aspect-[16/10] w-full rounded-xl bg-muted sm:aspect-[4/3] sm:w-48" />
      <div className="flex-1 space-y-3">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-5 w-2/3 rounded bg-muted" />
        <div className="h-4 w-1/3 rounded bg-muted" />
      </div>
      <div className="h-9 w-full rounded-md bg-muted sm:w-28" />
    </div>
  );
}

export function MyListings() {
  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [target, setTarget] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;

    authApi<Studio[]>("/api/studios/my/listings")
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

  async function handleDelete() {
    if (!target) return;
    const studioId = target._id;

    setDeleting(true);
    try {
      await authApi<{ message: string }>(`/api/studios/${studioId}`, {
        method: "DELETE",
      });
      setStudios((current) =>
        current ? current.filter((studio) => studio._id !== studioId) : current,
      );
      toast.success("Studio deleted successfully.");
      setTarget(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not delete the studio.",
      );
    } finally {
      setDeleting(false);
    }
  }

  const isLoading = studios === null && error === null;

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Dashboard
          </span>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            My Studio Listings
          </h1>
          <p className="mt-3 text-muted-foreground">
            Manage the creative spaces you have listed on StudioSpace.
          </p>
        </div>
        <Link href="/add-studio" className={cn(buttonVariants(), "gap-2")}>
          <Plus className="size-4" />
          Add New Studio
        </Link>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <ListingSkeleton key={index} />
          ))}
        </div>
      )}

      {error && (
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <p className="font-medium">We could not load your listings.</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-5" onClick={retry}>
            Try again
          </Button>
        </div>
      )}

      {studios && studios.length === 0 && (
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Aperture className="mx-auto size-10 text-primary" />
          <p className="mt-4 text-lg font-semibold">
            You have not listed any studios yet
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            List your first creative space and start receiving booking
            requests.
          </p>
          <Link href="/add-studio" className={cn(buttonVariants(), "mt-5")}>
            Add Your First Studio
          </Link>
        </div>
      )}

      {studios && studios.length > 0 && (
        <div className="space-y-4">
          {studios.map((studio) => (
            <article
              key={studio._id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm sm:flex-row sm:items-center"
            >
              <div className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:aspect-[4/3] sm:w-48">
                <ListingImage studio={studio} />
              </div>

              <div className="min-w-0 flex-1">
                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {studio.category}
                </span>
                <h2 className="mt-2 line-clamp-1 text-lg font-semibold">
                  {studio.title}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0" />
                  <span className="line-clamp-1">{studio.location}</span>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                  <span className="font-semibold">
                    ${studio.hourlyRate}
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      / hr
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-4 fill-primary text-primary" />
                    {studio.reviewCount > 0
                      ? `${studio.rating.toFixed(1)} (${studio.reviewCount})`
                      : "No reviews yet"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:w-36 sm:flex-col">
                <Link
                  href={`/studios/${studio._id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "flex-1 sm:flex-none",
                  )}
                >
                  View Details
                </Link>
                <Link
                  href={`/studios/edit/${studio._id}`}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "flex-1 gap-1.5 sm:flex-none",
                  )}
                >
                  <Pencil className="size-3.5" />
                  Update
                </Link>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="flex-1 gap-1.5 sm:flex-none"
                  onClick={() => setTarget(studio)}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
        title="Delete this studio?"
        description={`"${target?.title ?? "This studio"}" will be permanently removed from StudioSpace. This action cannot be undone.`}
        confirmLabel="Yes, delete it"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}