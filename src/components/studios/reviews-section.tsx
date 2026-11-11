"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/use-current-user";
import { api } from "@/lib/api";
import { authApi } from "@/lib/auth-api";
import { formatPostedDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Review } from "@/types/studio";

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "size-4",
            n <= value
              ? "fill-primary text-primary"
              : "text-muted-foreground/40",
          )}
        />
      ))}
    </span>
  );
}

interface ReviewsSectionProps {
  studioId: string;
  onChanged: () => void;
}

export function ReviewsSection({ studioId, onChanged }: ReviewsSectionProps) {
  const { user } = useCurrentUser();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    api<Review[]>(`/api/studios/${studioId}/reviews`)
      .then((data) => {
        if (ignore) return;
        setReviews(data);
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating < 1) {
      toast.error("Please choose a star rating.");
      return;
    }
    if (comment.trim().length < 3) {
      toast.error("Please write a short comment.");
      return;
    }

    setSubmitting(true);
    try {
      await authApi(`/api/studios/${studioId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });
      toast.success("Thanks! Your review has been saved.");
      setRating(0);
      setComment("");
      setAttempt((value) => value + 1);
      onChanged();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save your review.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-bold">Reviews</h2>

      <div className="mt-5 rounded-2xl border border-border bg-card p-5">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <p className="font-medium">Share your experience</p>
            <div className="flex gap-1" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onClick={() => setRating(n)}
                  className="rounded p-0.5"
                >
                  <Star
                    className={cn(
                      "size-7 transition",
                      n <= rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/40 hover:text-primary",
                    )}
                  />
                </button>
              ))}
            </div>
            <Textarea
              rows={3}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="How was the space, the equipment and the host?"
            />
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Submit review
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Log in to rate this studio and share your experience.
            </p>
            <Link
              href={`/login?redirect=${encodeURIComponent(`/studios/${studioId}`)}`}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Log in to review
            </Link>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {!reviews && !error && (
          <div className="h-24 animate-pulse rounded-2xl bg-muted" />
        )}

        {error && (
          <p className="text-sm text-muted-foreground">
            Reviews could not be loaded. {error}
          </p>
        )}

        {reviews && reviews.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <MessageSquare className="mx-auto size-8 text-primary" />
            <p className="mt-3 font-medium">No reviews yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to share your experience.
            </p>
          </div>
        )}

        {reviews?.map((review) => (
          <article
            key={review._id}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                {(review.userName || review.userEmail).charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {review.userName || "StudioSpace creator"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPostedDate(review.createdAt)}
                </p>
              </div>
              <Stars value={review.rating} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {review.comment}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}