"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/auth-api";
import { formatMoney } from "@/lib/format";
import type { Studio } from "@/types/studio";

function toMinutes(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studio: Studio;
}

export function BookingModal({ open, onOpenChange, studio }: BookingModalProps) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  const hours =
    start !== null && end !== null && end > start ? (end - start) / 60 : 0;
  const total = Math.round(hours * studio.hourlyRate * 100) / 100;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!date) {
      setError("Please choose a date.");
      return;
    }

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    if (date < today) {
      setError("You cannot book a date in the past.");
      return;
    }

    if (hours <= 0) {
      setError("The end time must be after the start time.");
      return;
    }

    setSubmitting(true);
    try {
      await authApi("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          studioId: studio._id,
          date,
          startTime,
          endTime,
        }),
      });
      toast.success("Booking request sent. The host will confirm shortly.");
      onOpenChange(false);
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

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!submitting) onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book {studio.title}</DialogTitle>
          <DialogDescription>
            Choose your date and hours. The host will confirm your request.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="booking-date">Date</Label>
            <Input
              id="booking-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="dark:scheme-dark"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking-start">Start time</Label>
              <Input
                id="booking-start"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="dark:scheme-dark"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-end">End time</Label>
              <Input
                id="booking-end"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="dark:scheme-dark"
              />
            </div>
          </div>

          <div className="space-y-2 rounded-xl bg-muted p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hourly rate</span>
              <span>{formatMoney(studio.hourlyRate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hours</span>
              <span>{hours > 0 ? hours : "-"}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{hours > 0 ? formatMoney(total) : "-"}</span>
            </div>
            {studio.securityDeposit > 0 && (
              <p className="pt-1 text-xs text-muted-foreground">
                A security deposit of {formatMoney(studio.securityDeposit)} is
                handled separately by the host and is not included in the
                total.
              </p>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting} className="w-full gap-2">
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Send booking request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}