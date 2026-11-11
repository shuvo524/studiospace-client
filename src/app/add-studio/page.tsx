import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { StudioForm } from "@/components/studios/studio-form";

export const metadata: Metadata = {
  title: "Add New Studio",
};

export default function AddStudioPage() {
  return (
    <RequireAuth>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Host Your Space
            </span>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              Add a new studio
            </h1>
            <p className="mt-4 text-muted-foreground">
              Share your creative space with filmmakers, photographers,
              podcasters and musicians. It only takes a few minutes.
            </p>
          </div>
          <StudioForm mode="add" />
        </div>
      </section>
    </RequireAuth>
  );
}