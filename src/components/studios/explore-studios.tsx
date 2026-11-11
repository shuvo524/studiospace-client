"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SearchX } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { StudioCard } from "@/components/studios/studio-card";
import { StudioCardSkeleton } from "@/components/studios/studio-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { STUDIO_CATEGORIES, type Studio } from "@/types/studio";

type SortValue = "newest" | "rating" | "priceLow" | "priceHigh";

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Top rated" },
  { value: "priceLow", label: "Price: low to high" },
  { value: "priceHigh", label: "Price: high to low" },
];

interface Result {
  key: string;
  studios: Studio[] | null;
  error: string | null;
}

export function ExploreStudios() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [category, setCategory] = useState<string>(
    STUDIO_CATEGORIES.some((item) => item === initialCategory)
      ? (initialCategory as string)
      : "All",
  );
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortValue>("newest");
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  // Wait a little after typing before asking the server.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const params = new URLSearchParams();
  if (category !== "All") params.set("category", category);
  if (search) params.set("search", search);
  if (sort !== "newest") params.set("sort", sort);
  const queryString = params.toString();
  const requestKey = `${queryString}#${attempt}`;

  useEffect(() => {
    let ignore = false;

    api<Studio[]>(`/api/studios${queryString ? `?${queryString}` : ""}`)
      .then((data) => {
        if (ignore) return;
        setResult({ key: requestKey, studios: data, error: null });
      })
      .catch((err: Error) => {
        if (ignore) return;
        setResult({ key: requestKey, studios: null, error: err.message });
      });

    return () => {
      ignore = true;
    };
  }, [queryString, requestKey]);

  function resetFilters() {
    setCategory("All");
    setSearchInput("");
    setSearch("");
    setSort("newest");
  }

  const isLoading = result === null || result.key !== requestKey;

  return (
    <WishlistProvider>
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by studio name or location"
              aria-label="Search studios"
              className="h-9 pl-9"
            />
          </div>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortValue)}
            aria-label="Sort studios"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-56"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", ...STUDIO_CATEGORIES].map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition",
                category === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <StudioCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!isLoading && result?.error && (
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <p className="font-medium">We could not load the studios.</p>
          <p className="mt-2 text-sm text-muted-foreground">{result.error}</p>
          <Button
            className="mt-5"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Try again
          </Button>
        </div>
      )}

      {!isLoading && result?.studios && result.studios.length === 0 && (
        <EmptyState
          icon={SearchX}
          title="No studios match your search"
          description="Try a different keyword or category, or clear your filters."
        >
          <Button className="mt-5" onClick={resetFilters}>
            Clear filters
          </Button>
        </EmptyState>
      )}

      {!isLoading && result?.studios && result.studios.length > 0 && (
        <>
          <p className="mb-5 text-sm text-muted-foreground">
            {result.studios.length}{" "}
            {result.studios.length === 1 ? "studio" : "studios"} found
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        </>
      )}
    </WishlistProvider>
  );
}