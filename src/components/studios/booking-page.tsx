"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, Loader2, MapPin, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { authApi } from "@/lib/auth-api";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Studio } from "@/types/studio";

// Studio hours: 8:00 AM - 11:00 PM, in 15-minute steps.
const OPEN_MINUTES = 8 * 60;
const CLOSE_MINUTES = 23 * 60;
const STEP = 15;

const SLOTS: number[] = [];
for (let m = OPEN_MINUTES; m < CLOSE_MINUTES; m += STEP) {
  SLOTS.push(m);
}

function toHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function toLabel(minutes: number): string {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function todayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
}

export function BookingPage({ studioId }: { studioId: string }) {
  const router = useRouter();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    api<Studio>(`/api/studios/${studioId}`)
      .then((data) => {
        if (!ignore) setStudio(data);
      })
      .catch(() => {
        if (!ignore) {
          setLoadError("We could not load this studio. It may have been removed.");
        }
      });
    return () => {
      ignore = true;
    };
  }, [studioId]);

  const hours = useMemo(() => {
    if (start === null || end === null || end <= start) return 0;
    return (end - start) / 60;
  }, [start, end]);

  const total = studio ? Math.round(hours * studio.hourlyRate * 100) / 100 : 0;

  function handleSlotClick(minutes: number) {
    setError(null);
    if (start === null || (start !== null && end !== null)) {
      setStart(minutes);
      setEnd(null);
      return;
    }
    if (minutes > start) {
      setEnd(minutes);
    } else {
      setStart(minutes);
      setEnd(null);
    }
  }

  function slotState(minutes: number): "start" | "end" | "in-range" | "idle" {
    if (start !== null && minutes === start) return "start";
    if (end !== null && minutes === end) return "end";
    if (start !== null && end !== null && minutes > start && minutes < end) {
      return "in-range";
    }
    return "idle";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!studio) return;

    if (!date) {
      setError("Please choose a booking date.");
      return;
    }
    if (date < todayString()) {
      setError("You cannot book a date in the past.");
      return;
    }
    if (start === null || end === null || hours <= 0) {
      setError("Please pick a start and an end time from the slot grid.");
      return;
    }

    setSubmitting(true);
    try {
      await authApi("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          studioId: studio._id,
          date,
          startTime: toHHMM(start),
          endTime: toHHMM(end),
        }),
      });
      toast.success("Booking request sent. The host will confirm shortly.");
      router.push("/my-bookings");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not create your booking. Please try again.";
      setError(message);
      toast.error(message);
      setSubmitting(false);
    }
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <p className="font-medium">Studio not available</p>
        <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
        <Link
          href="/studios"
          className={cn(buttonVariants({ size: "sm" }), "mt-5")}
        >
          Browse studios
        </Link>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="space-y-6">
        <div className="h-56 animate-pulse rounded-2xl bg-muted" />
        <div className="h-72 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        <div className="space-y-3">
          <Label htmlFor="booking-date" className="inline-flex items-center gap-2">
            <CalendarDays className="size-4" /> Booking date
          </Label>
          <Input
            id="booking-date"
            type="date"
            min={todayString()}
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setError(null);
            }}
            className="max-w-xs dark:scheme-dark"
          />
        </div>

        <div className="space-y-3">
          <p className="inline-flex items-center gap-2 text-sm font-medium">
            <Clock className="size-4" /> Choose your time slots
          </p>
          <p className="text-sm text-muted-foreground">
            Tap a slot to set your start time, then tap a later slot to set
            your end time. Slots run every 15 minutes, from 8:00 AM to
            11:00 PM.
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {SLOTS.map((minutes) => {
              const state = slotState(minutes);
              return (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => handleSlotClick(minutes)}
                  aria-pressed={state === "start" || state === "end"}
                  className={cn(
                    "rounded-lg border px-1 py-2 text-xs font-medium transition",
                    state === "idle" &&
                      "border-border bg-card hover:border-primary hover:text-primary",
                    state === "in-range" && "border-primary/40 bg-primary/10",
                    (state === "start" || state === "end") &&
                      "border-primary bg-primary text-primary-foreground",
                  )}
                >
                  {toLabel(minutes)}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {start !== null ? (
              <>
                Selected: <span className="font-medium text-foreground">{toLabel(start)}</span>
                {end !== null ? (
                  <>
                    {" "}to <span className="font-medium text-foreground">{toLabel(end)}</span>
                    {" "}({hours} {hours === 1 ? "hour" : "hours"})
                  </>
                ) : (
                  <> — now tap your end time.</>
                )}
              </>
            ) : (
              "No time selected yet."
            )}
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={submitting || hours <= 0 || !date}
          className="w-full gap-2 sm:w-auto"
        >
          {submitting && <Loader2 className="size-4 animate-spin" />}
          Book Now{hours > 0 ? ` — ${formatMoney(total)} total` : ""}
        </Button>
      </form>

      <aside className="h-fit overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative aspect-[16/9] w-full bg-muted">
          <img
            src={studio.imageUrl}
            alt={studio.title}
            className="h-full w-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {studio.category}
          </span>
        </div>
        <div className="space-y-3 p-5">
          <h2 className="text-lg font-semibold">{studio.title}</h2>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" /> {studio.location}
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="size-4 shrink-0" /> Up to {studio.maxCapacity} people
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Star className="size-4 shrink-0 fill-current text-primary" />
            {studio.reviewCount > 0
              ? `${studio.rating.toFixed(1)} (${studio.reviewCount} reviews)`
              : "New studio"}
          </p>
          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hourly rate</span>
              <span>{formatMoney(studio.hourlyRate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span>{hours > 0 ? `${hours} hr` : "-"}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>Total price</span>
              <span>{hours > 0 ? formatMoney(total) : "-"}</span>
            </div>
            {studio.securityDeposit > 0 && (
              <p className="pt-1 text-xs text-muted-foreground">
                A refundable security deposit of{" "}
                {formatMoney(studio.securityDeposit)} is handled separately
                by the host and is not included in the total.
              </p>
            )}
            <p className="pt-1 text-xs text-muted-foreground">
              Hosted by {studio.ownerName} ({studio.ownerEmail}). You will
              not be charged until the host confirms your request.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
