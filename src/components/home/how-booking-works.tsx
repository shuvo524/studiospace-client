import { CalendarCheck, Clock, Search, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/home/section-heading";

const steps = [
  {
    icon: Search,
    title: "Discover Spaces",
    text: "Browse studios by category, location and price to find the right fit for your project.",
  },
  {
    icon: Clock,
    title: "Select Shoot Hours",
    text: "Pick the date and the hours you need. The total price is shown before you book.",
  },
  {
    icon: CalendarCheck,
    title: "Book Instantly",
    text: "Send your request in a few clicks. The host confirms and your slot is secured.",
  },
  {
    icon: Sparkles,
    title: "Create & Produce",
    text: "Arrive, set up and focus on making something great.",
  },
];

export function HowBookingWorks() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How Booking Works"
          title="From idea to shoot in four steps"
          description="Booking a creative space on StudioSpace is quick, clear and transparent."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm"
            >
              <span className="absolute right-5 top-4 text-5xl font-bold text-primary/15">
                {index + 1}
              </span>
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}