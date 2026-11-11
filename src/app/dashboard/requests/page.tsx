import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { BookingRequests } from "@/components/bookings/booking-requests";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Booking Requests | StudioSpace",
};

export default function BookingRequestsPage() {
  return (
    <RequireAuth>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <PageHeader
            eyebrow="Host Dashboard"
            title="Booking Requests"
            description="Review requests for your studios, confirm them and mark finished sessions as completed."
          />
          <BookingRequests />
        </div>
      </section>
    </RequireAuth>
  );
}