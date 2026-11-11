import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { PageHeader } from "@/components/shared/page-header";
import { SavedStudios } from "@/components/wishlist/saved-studios";

export const metadata: Metadata = {
  title: "Saved Studios",
};

export default function WishlistPage() {
  return (
    <RequireAuth>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PageHeader
            eyebrow="Wishlist"
            title="Your saved studios"
            description="Spaces you loved, all in one place."
          />
          <SavedStudios />
        </div>
      </section>
    </RequireAuth>
  );
}