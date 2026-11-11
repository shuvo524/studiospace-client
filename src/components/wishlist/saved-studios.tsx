"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { StudioCard } from "@/components/studios/studio-card";
import { StudioCardSkeleton } from "@/components/studios/studio-card-skeleton";
import { Button } from "@/components/ui/button";
import {
  useWishlist,
  WishlistProvider,
} from "@/components/wishlist/wishlist-provider";
import { authApi } from "@/lib/auth-api";
import type { Studio } from "@/types/studio";

function SavedList() {
  const { ids, ready } = useWishlist();
  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    authApi<Studio[]>("/api/wishlist")
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

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <p className="font-medium">We could not load your saved studios.</p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button className="mt-5" onClick={retry}>
          Try again
        </Button>
      </div>
    );
  }

  if (!studios || !ready) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <StudioCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const visible = studios.filter((studio) => ids.has(studio._id));

  if (visible.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No saved studios yet"
        description="Tap the heart on any studio to keep it here for later."
        actionLabel="Explore Studios"
        actionHref="/studios"
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((studio) => (
        <StudioCard key={studio._id} studio={studio} />
      ))}
    </div>
  );
}

export function SavedStudios() {
  return (
    <WishlistProvider>
      <SavedList />
    </WishlistProvider>
  );
}