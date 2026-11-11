import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, Inbox, Handshake } from "lucide-react";
import { HowBookingWorks } from "@/components/home/how-booking-works";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "How It Works",
};

const hostSteps = [
  {
    icon: ClipboardList,
    title: "List your space",
    text: "Add photos, amenities, your hourly rate and a clear description in a few minutes.",
  },
  {
    icon: Inbox,
    title: "Review requests",
    text: "See every booking request in your dashboard and confirm the ones that suit you.",
  },
  {
    icon: Handshake,
    title: "Welcome creators",
    text: "Host the session, mark it completed and build your reputation with reviews.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="pt-12 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PageHeader
            eyebrow="How It Works"
            title="Creative spaces, made simple"
            description="Whether you are looking for a studio or sharing one, StudioSpace keeps every step clear."
          />
        </div>
      </section>

      <HowBookingWorks />

      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              For Hosts
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Turn your space into income
            </h2>
            <p className="mt-4 text-muted-foreground">
              Hosting on StudioSpace takes three simple steps.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {hostSteps.map((step) => (
              <div
                key={step.title}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link href="/studios" className={cn(buttonVariants({ size: "lg" }))}>
              Explore Studios
            </Link>
            <Link
              href="/add-studio"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
              )}
            >
              Host Your Space
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}