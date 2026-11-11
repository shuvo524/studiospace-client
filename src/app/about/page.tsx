import type { Metadata } from "next";
import Link from "next/link";
import { Eye, HeartHandshake, Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
};

const values = [
  {
    icon: Eye,
    title: "Transparent pricing",
    text: "Hourly rates, deposits and totals are shown up front, so there are no surprises.",
  },
  {
    icon: HeartHandshake,
    title: "Trust on both sides",
    text: "Verified accounts, clear booking steps and honest reviews protect hosts and creators.",
  },
  {
    icon: Lightbulb,
    title: "Creators first",
    text: "We build tools that save time, so more of it goes into making great work.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <PageHeader
            eyebrow="About Us"
            title="A home for every creative project"
            description="StudioSpace connects filmmakers, photographers, podcasters and musicians with spaces built for their craft."
          />
          <div className="space-y-5 text-center leading-relaxed text-muted-foreground">
            <p>
              Finding the right studio should not be harder than the project
              itself. Great spaces often sit empty while creators search for
              somewhere to shoot, record or rehearse.
            </p>
            <p>
              StudioSpace is a peer-to-peer marketplace that brings both sides
              together. Hosts list their space, creators discover it, and a
              simple booking flow takes care of the rest.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              What We Believe
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Our principles
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <value.icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/studios" className={cn(buttonVariants({ size: "lg" }))}>
              Explore Studios
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}