import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { MyBookings } from "@/components/bookings/my-bookings";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "My Bookings",
};

export default function MyBookingsPage() {
  return (
    <RequireAuth>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <PageHeader
            eyebrow="Dashboard"
            title="My Bookings"
            description="Track your studio reservations, cancel pending requests and download invoices."
          />
          <MyBookings />
        </div>
      </section>
    </RequireAuth>
  );
}