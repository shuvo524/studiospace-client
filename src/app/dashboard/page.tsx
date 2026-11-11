import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardHub } from "@/components/dashboard/dashboard-hub";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <RequireAuth>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <DashboardHub />
        </div>
      </section>
    </RequireAuth>
  );
}