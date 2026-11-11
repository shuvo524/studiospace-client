import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { MyListings } from "@/components/listings/my-listings";

export const metadata: Metadata = {
  title: "My Studio Listings",
};

export default function MyListingsPage() {
  return (
    <RequireAuth>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <MyListings />
        </div>
      </section>
    </RequireAuth>
  );
}