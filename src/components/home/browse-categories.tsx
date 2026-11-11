import Link from "next/link";
import { Camera, Clapperboard, Mic, Music, Palette } from "lucide-react";
import { SectionHeading } from "@/components/home/section-heading";

const categories = [
  {
    label: "Photo Studios",
    value: "Photo Studio",
    icon: Camera,
    text: "Cyc walls, lofts and lighting-ready spaces.",
  },
  {
    label: "Sound Stages",
    value: "Film Stage",
    icon: Clapperboard,
    text: "Large stages for film, ads and video shoots.",
  },
  {
    label: "Podcast Rooms",
    value: "Podcast Lounge",
    icon: Mic,
    text: "Cosy rooms with clean audio for your show.",
  },
  {
    label: "Music Suites",
    value: "Music Suite",
    icon: Music,
    text: "Recording suites and rehearsal rooms.",
  },
  {
    label: "Art Workshops",
    value: "Workshop",
    icon: Palette,
    text: "Open workshop spaces for makers and artists.",
  },
];

export function BrowseCategories() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Browse by Category"
          title="Find the space that fits your craft"
          description="Choose a category to see the studios built for that kind of work."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.value}
              href={`/studios?category=${encodeURIComponent(category.value)}`}
              className="group flex h-full flex-col items-center rounded-2xl border border-border bg-card p-6 text-center text-card-foreground shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <category.icon className="size-6" />
              </span>
              <h3 className="mt-4 text-base font-semibold">
                {category.label}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {category.text}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}