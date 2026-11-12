"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Heart, MapPin, ShieldCheck, Star, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import { ReviewsSection } from "@/components/studios/reviews-section";
import { StudioGallery } from "@/components/studios/studio-gallery";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  useWishlist,
  WishlistProvider,
} from "@/components/wishlist/wishlist-provider";
import { useCurrentUser } from "@/hooks/use-current-user";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Studio } from "@/types/studio";

function SaveButton({ studioId }: { studioId: string }) {
  const { ids, toggle } = useWishlist();
  const saved = ids.has(studioId);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-pressed={saved}
      onClick={() => void toggle(studioId)}
      className="gap-2"
    >
      <Heart className={cn("size-4", saved && "fill-red-500 text-red-500")} />
      {saved ? "Saved" : "Save"}
    </Button>
  );
}

function DetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 animate-pulse gap-8 lg:grid-cols-3">
      <div className="min-w-0 space-y-6 lg:col-span-2">
        <div className="aspect-[16/10] rounded-2xl bg-muted" />
        <div className="h-8 w-2/3 rounded bg-muted" />
        <div className="h-4 w-1/3 rounded bg-muted" />
        <div className="h-32 rounded bg-muted" />
      </div>
      <div className="h-72 rounded-2xl bg-muted" />
    </div>
  );
}

export function StudioDetails({ studioId }: { studioId: string }) {
  const router = useRouter();
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

  function reload() {
    setAttempt((value) => value + 1);
  }

  function handleBook() {
    if (!user) {
      toast.info("Please log in to book this studio.");
      router.push(
        `/login?redirect=${encodeURIComponent(`/add-booking/${studioId}`)}`,
      );
      return;
    }
    router.push(`/add-booking/${studioId}`);
  }

  if (error && !studio) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <p className="font-medium">We could not find this studio.</p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <div className="mt-5 flex justify-center gap-3">
          <Button
            onClick={() => {
              setError(null);
              reload();
            }}
          >
            Try again
          </Button>
          <Link
            href="/studios"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Explore Studios
          </Link>
        </div>
      </div>
    );
  }

  if (!studio) {
    return <DetailsSkeleton />;
  }

  const extraImages =
    (studio as Studio & { gallery?: string[] }).gallery ?? [];
  const images = [studio.imageUrl, ...extraImages];
  const isOwner = user?.email === studio.ownerEmail;
  const hasReviews = studio.reviewCount > 0;

  return (
    <WishlistProvider>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="min-w-0 space-y-10 lg:col-span-2">
          <StudioGallery images={images} title={studio.title} />

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {studio.category}
              </span>
              <SaveButton studioId={studio._id} />
            </div>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              {studio.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" />
                {studio.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-4 fill-primary text-primary" />
                {hasReviews
                  ? `${studio.rating.toFixed(1)} (${studio.reviewCount} ${studio.reviewCount === 1 ? "review" : "reviews"})`
                  : "No reviews yet"}
              </span>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold">About this space</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">
              {studio.overview || "The host has not added a description yet."}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Amenities</h2>
            {studio.amenities.length === 0 ? (
              <p className="mt-4 text-muted-foreground">
                No amenities listed for this studio.
              </p>
            ) : (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {studio.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"
                  >
                    <Check className="size-4 shrink-0 text-primary" />
                    {amenity}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold">Your host</h2>
            <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                {(studio.ownerName || studio.ownerEmail)
                  .charAt(0)
                  .toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {studio.ownerName || "StudioSpace host"}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {studio.ownerEmail}
                </p>
              </div>
            </div>
          </section>

          <ReviewsSection studioId={studio._id} onChanged={reload} />
        </div>

        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm">
            <p className="text-3xl font-bold">
              {formatMoney(studio.hourlyRate)}
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / hour
              </span>
            </p>

            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Wallet className="size-4" />
                  Security deposit
                </span>
                <span className="font-medium">
                  {formatMoney(studio.securityDeposit)}
                </span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Users className="size-4" />
                  Max capacity
                </span>
                <span className="font-medium">{studio.maxCapacity} people</span>
              </li>
              <li className="flex items-start justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="size-4 shrink-0" />
                  Cancellation policy
                </span>
                <span className="text-right font-medium">
                  {studio.cancellationPolicy ||
                    "Flexible — free cancellation up to 24 hours before the session"}
                </span>
              </li>
            </ul>

            <Button
              type="button"
              size="lg"
              className="mt-6 w-full"
              disabled={isOwner}
              onClick={handleBook}
            >
              {isOwner ? "This is your studio" : "Book Now"}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              You will not be charged until the host confirms your request.
            </p>
          </div>
        </aside>
      </div>
    </WishlistProvider>
  );
}