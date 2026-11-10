import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import {
  InstagramIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/brand/social-icons";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { navLinks } from "@/lib/nav-links";

const popularCategories = [
  { label: "Photo Studios", value: "Photo Studio" },
  { label: "Film Stages", value: "Film Stage" },
  { label: "Podcast Lounges", value: "Podcast Lounge" },
  { label: "Music Suites", value: "Music Suite" },
  { label: "Art Workshops", value: "Workshop" },
];

const socials = [
  { label: "StudioSpace on X", href: "https://x.com", icon: XIcon },
  {
    label: "StudioSpace on Instagram",
    href: "https://instagram.com",
    icon: InstagramIcon,
  },
  {
    label: "StudioSpace on YouTube",
    href: "https://youtube.com",
    icon: YouTubeIcon,
  },
];

const linkClass =
  "text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand and mission */}
          <div className="space-y-4 lg:col-span-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Our mission is simple: put every creator in the right room. Book
              photo studios, film stages, podcast lounges and music suites by
              the hour, straight from the people who run them.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <item.icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/add-studio" className={linkClass}>
                  Host Your Space
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular categories */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Popular Categories
            </h3>
            <ul className="space-y-2.5">
              {popularCategories.map((category) => (
                <li key={category.value}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(
                      category.value,
                    )}`}
                    className={linkClass}
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Studio News
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              New spaces, host tips and member-only offers, once a month. No
              spam, ever.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
              &copy; 2026 StudioSpace. All rights reserved.
          </p>
          <p>
            By using StudioSpace you agree to our Terms of Use and Privacy
            Policy.
          </p>
        </div>
      </div>
    </footer>
  );
}