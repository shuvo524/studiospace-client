"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Aperture,
  CalendarCheck,
  CalendarDays,
  Download,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { authApi } from "@/lib/auth-api";
import { formatDate, formatMoney, formatTime } from "@/lib/format";
import { downloadInvoice } from "@/lib/invoice";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types/studio";

function BookingImage({ booking }: { booking: Booking }) {
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
      src={booking.studioImage}
      alt={booking.studioTitle}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
}

function BookingSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
      <div className="aspect-[16/10] w-full rounded-xl bg-muted sm:aspect-[4/3] sm:w-48" />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-2/3 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-4 w-1/3 rounded bg-muted" />
      </div>
      <div className="h-9 w-full rounded-md bg-muted sm:w-32" />
    </div>
  );
}

export function MyBookings() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [target, setTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let ignore = false;

    authApi<Booking[]>("/api/bookings/my")
      .then((data) => {
        if (ignore) return;
        setBookings(data);
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
    setBookings(null);
    setError(null);
    setAttempt((value) => value + 1);
  }

  async function handleCancel() {
    if (!target) return;
    const bookingId = target._id;

    setCancelling(true);
    try {
      await authApi(`/api/bookings/${bookingId}/cancel`, { method: "PATCH" });
      setBookings((current) =>
        current
          ? current.map((booking) =>
              booking._id === bookingId
                ? { ...booking, status: "Cancelled" as const }
                : booking,
            )
          : current,
      );
      toast.success("Booking cancelled successfully.");
      setTarget(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not cancel the booking.",
      );
    } finally {
      setCancelling(false);
    }
  }

  async function handleInvoice(booking: Booking) {
    try {
      await downloadInvoice(booking);
      toast.success("Invoice downloaded.");
    } catch {
      toast.error("Could not create the invoice. Please try again.");
    }
  }

  const isLoading = bookings === null && error === null;

  return (
    <>
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <BookingSkeleton key={index} />
          ))}
        </div>
      )}

      {error && (
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <p className="font-medium">We could not load your bookings.</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-5" onClick={retry}>
            Try again
          </Button>
        </div>
      )}

      {bookings && bookings.length === 0 && (
        <EmptyState
          icon={CalendarCheck}
          title="You have no bookings yet"
          description="Find a studio you love and book your first session."
          actionLabel="Explore Studios"
          actionHref="/studios"
        />
      )}

      {bookings && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm sm:flex-row sm:items-center"
            >
              <div className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:aspect-[4/3] sm:w-48">
                <BookingImage booking={booking} />
              </div>

              <div className="min-w-0 flex-1">
                <StatusBadge status={booking.status} />
                <h2 className="mt-2 line-clamp-1 text-lg font-semibold">
                  {booking.studioTitle}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0" />
                  <span className="line-clamp-1">{booking.studioLocation}</span>
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-sm">
                  <CalendarDays className="size-4 shrink-0 text-primary" />
                  {formatDate(booking.date)}, {formatTime(booking.startTime)} -{" "}
                  {formatTime(booking.endTime)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {booking.hours} {booking.hours === 1 ? "hour" : "hours"} -{" "}
                  <span className="font-semibold text-foreground">
                    {formatMoney(booking.totalPrice)}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:w-40 sm:flex-col">
                <Link
                  href={`/studios/${booking.studioId}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "flex-1 sm:flex-none",
                  )}
                >
                  View Studio
                </Link>
                {booking.status === "Pending" && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => setTarget(booking)}
                  >
                    Cancel Booking
                  </Button>
                )}
                {(booking.status === "Confirmed" ||
                  booking.status === "Completed") && (
                  <Button
                    type="button"
                    size="sm"
                    className="flex-1 gap-1.5 sm:flex-none"
                    onClick={() => void handleInvoice(booking)}
                  >
                    <Download className="size-3.5" />
                    Invoice
                  </Button>
                )}
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
        title="Cancel this booking?"
        description={`Your pending request for "${target?.studioTitle ?? "this studio"}" will be cancelled. You can always book again later.`}
        confirmLabel="Yes, cancel booking"
        cancelLabel="Keep booking"
        destructive
        loading={cancelling}
        onConfirm={handleCancel}
      />
    </>
  );
}