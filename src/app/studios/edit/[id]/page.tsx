import type { Metadata } from "next";
import { Suspense } from "react";
import { Aperture } from "lucide-react";
import { RequireAuth } from "@/components/auth/require-auth";
import { EditStudio } from "@/components/studios/edit-studio";

export const metadata: Metadata = {
  title: "Update Studio | StudioSpace",
};

function GuardFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Aperture
        className="size-10 animate-spin text-primary"
        aria-label="Loading"
      />
    </div>
  );
}

async function EditStudioContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditStudio studioId={id} />;
}

export default function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<GuardFallback />}>
      <RequireAuth>
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Dashboard
              </span>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                Update your studio
              </h1>
              <p className="mt-4 text-muted-foreground">
                Change the details, photos or pricing of your listing. Your host
                information stays the same.
              </p>
            </div>
            <Suspense
              fallback={
                <div className="h-96 animate-pulse rounded-2xl border border-border bg-card" />
              }
            >
              <EditStudioContent params={params} />
            </Suspense>
          </div>
        </section>
      </RequireAuth>
    </Suspense>
  );
}