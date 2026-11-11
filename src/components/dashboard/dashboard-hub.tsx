"use client";

import Link from "next/link";
import {
  CalendarCheck,
  Heart,
  Inbox,
  LayoutList,
  Plus,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

const items = [
  {
    href: "/add-studio",
    icon: Plus,
    title: "Add New Studio",
    text: "List a new creative space for other creators to book.",
  },
  {
    href: "/my-listings",
    icon: LayoutList,
    title: "My Studio Listings",
    text: "Edit or remove the studios you have listed.",
  },
  {
    href: "/dashboard/requests",
    icon: Inbox,
    title: "Booking Requests",
    text: "Confirm or decline requests for your studios.",
  },
  {
    href: "/my-bookings",
    icon: CalendarCheck,
    title: "My Bookings",
    text: "Track your reservations and download invoices.",
  },
  {
    href: "/wishlist",
    icon: Heart,
    title: "Saved Studios",
    text: "Spaces you saved to come back to later.",
  },
];

export function DashboardHub() {
  const { user } = useCurrentUser();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <>
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Dashboard
        </span>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-4 text-muted-foreground">
          Everything you need to host studios and manage your bookings.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <item.icon className="size-6" />
            </span>
            <h2 className="mt-5 text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
          </Link>
        ))}
      </div>
    </>
  );
}