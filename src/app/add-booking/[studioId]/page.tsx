import type { Metadata } from "next";
import { Suspense } from "react";
import { RequireAuth } from "@/components/auth/require-auth";
import { PageHeader } from "@/components/shared/page-header";
import { BookingPage } from "@/components/studios/booking-page";

export const metadata: Metadata = {
  title: "Book a Studio",
};

async function BookingContent({
  params,
}: {
  params: Promise<{ studioId: string }>;
}) {
  const { studioId } = await params;
  return <BookingPage studioId={studioId} />;
}

export default function AddBookingPage({
  params,
}: {
  params: Promise<{ studioId: string }>;
}) {
  return (
    <RequireAuth>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <PageHeader
            eyebrow="Book a Studio"
            title="Reserve your session"
            description="Pick a date, choose your time slots, and see the total price before you confirm."
          />
          <Suspense
            fallback={
              <div className="h-96 animate-pulse rounded-2xl bg-muted" />
            }
          >
            <BookingContent params={params} />
          </Suspense>
        </div>
      </section>
    </RequireAuth>
  );
}
