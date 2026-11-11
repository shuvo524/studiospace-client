import type { Metadata } from "next";
import { Suspense } from "react";
import { StudioDetails } from "@/components/studios/studio-details";

export const metadata: Metadata = {
  title: "Studio Details",
};

async function DetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudioDetails studioId={id} />;
}

export default function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="h-96 animate-pulse rounded-2xl bg-muted" />
          }
        >
          <DetailsContent params={params} />
        </Suspense>
      </div>
    </section>
  );
}
