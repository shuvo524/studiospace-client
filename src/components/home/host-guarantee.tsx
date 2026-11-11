import { BadgeCheck, Headset, ShieldCheck, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/home/section-heading";

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    text: "Clear booking terms and security deposits help protect hosts and creators.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Profiles",
    text: "Every host and creator books with a real, signed-in account.",
  },
  {
    icon: Wrench,
    title: "Equipment Safety",
    text: "Hosts list their gear and rules up front, so you know what to expect.",
  },
  {
    icon: Headset,
    title: "24/7 Host Support",
    text: "Questions about a booking or a space? Help is always a message away.",
  },
];

export function HostGuarantee() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Host Guarantee & Creator Support"
          title="Book and host with confidence"
          description="We built StudioSpace so both sides of every booking feel safe and supported."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item) => (
            <div
              key={item.title}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}