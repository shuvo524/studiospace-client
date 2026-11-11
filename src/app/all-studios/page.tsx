import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ExploreStudios } from "@/components/studios/explore-studios";
import { StudioCardSkeleton } from "@/components/studios/studio-card-skeleton";

export const metadata: Metadata = {
  title: "All Studios",
};

export default function AllStudiosPage() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="All Studios"
          title="Every creative space, in one place"
          description="Search photo studios, film stages, podcast lounges, music suites and workshops, then filter and sort to find your fit."
        />
        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <StudioCardSkeleton key={index} />
              ))}
            </div>
          }
        >
          <ExploreStudios />
        </Suspense>
      </div>
    </section>
  );
}
