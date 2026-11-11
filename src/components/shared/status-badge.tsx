import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types/studio";

const styles: Record<BookingStatus, string> = {
  Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Confirmed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Completed: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  Cancelled: "bg-red-500/15 text-red-700 dark:text-red-400",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}