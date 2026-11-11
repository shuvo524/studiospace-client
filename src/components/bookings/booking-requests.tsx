"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Inbox, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/auth-api";
import { formatDate, formatMoney, formatTime } from "@/lib/format";
import type { Booking } from "@/types/studio";

type NextStatus = "Confirmed" | "Completed" | "Cancelled";

export function BookingRequests() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);

  useEffect(() => {
    let ignore = false;

    authApi<Booking[]>("/api/bookings/host")
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

  async function updateStatus(booking: Booking, status: NextStatus) {
    setBusyId(booking._id);
    try {
      await authApi(`/api/bookings/${booking._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setBookings((current) =>
        current
          ? current.map((item) =>
              item._id === booking._id ? { ...item, status } : item,
            )
          : current,
      );
      toast.success(`Booking ${status.toLowerCase()} successfully.`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update the booking.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function confirmCancel() {
    if (!cancelTarget) return;
    await updateStatus(cancelTarget, "Cancelled");
    setCancelTarget(null);
  }

  const isLoading = bookings === null && error === null;

  return (
    <>
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-border bg-muted"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <p className="font-medium">We could not load booking requests.</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-5" onClick={retry}>
            Try again
          </Button>
        </div>
      )}

      {bookings && bookings.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="No booking requests yet"
          description="When a creator books one of your studios, the request will show up here."
          actionLabel="View My Listings"
          actionHref="/my-listings"
        />
      )}

      {bookings && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const busy = busyId === booking._id;

            return (
              <article
                key={booking._id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm lg:flex-row lg:items-center"
              >
                <div className="min-w-0 flex-1">
                  <StatusBadge status={booking.status} />
                  <h2 className="mt-2 line-clamp-1 text-lg font-semibold">
                    {booking.studioTitle}
                  </h2>
                  <p className="mt-2 flex items-center gap-1.5 text-sm">
                    <CalendarDays className="size-4 shrink-0 text-primary" />
                    {formatDate(booking.date)}, {formatTime(booking.startTime)}{" "}
                    - {formatTime(booking.endTime)}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="size-4 shrink-0" />
                    <span className="line-clamp-1">
                      {booking.userName || "Creator"} - {booking.userEmail}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {booking.hours} {booking.hours === 1 ? "hour" : "hours"} -{" "}
                    <span className="font-semibold text-foreground">
                      {formatMoney(booking.totalPrice)}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {booking.status === "Pending" && (
                    <>
                      <Button
                        size="sm"
                        disabled={busy}
                        className="gap-1.5"
                        onClick={() => void updateStatus(booking, "Confirmed")}
                      >
                        {busy && <Loader2 className="size-3.5 animate-spin" />}
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={busy}
                        onClick={() => setCancelTarget(booking)}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                  {booking.status === "Confirmed" && (
                    <>
                      <Button
                        size="sm"
                        disabled={busy}
                        className="gap-1.5"
                        onClick={() => void updateStatus(booking, "Completed")}
                      >
                        {busy && <Loader2 className="size-3.5 animate-spin" />}
                        Mark Completed
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={busy}
                        onClick={() => setCancelTarget(booking)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={cancelTarget !== null}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
        title={
          cancelTarget?.status === "Pending"
            ? "Decline this request?"
            : "Cancel this booking?"
        }
        description={`The booking by ${cancelTarget?.userName || "this creator"} for "${cancelTarget?.studioTitle ?? "your studio"}" will be cancelled.`}
        confirmLabel="Yes, continue"
        cancelLabel="Go back"
        destructive
        loading={busyId !== null && busyId === cancelTarget?._id}
        onConfirm={confirmCancel}
      />
    </>
  );
}