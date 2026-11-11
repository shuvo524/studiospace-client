import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { TokenSync } from "@/components/auth/token-sync";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const fontHeading = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "StudioSpace | Book Creative Studios by the Hour",
    template: "%s | StudioSpace",
  },
  description:
    "StudioSpace is a peer-to-peer marketplace where creators book photo studios, film stages, podcast lounges and music suites by the hour.",
  openGraph: {
    title: "StudioSpace | Book Creative Studios by the Hour",
    description:
      "Book photo studios, film stages, podcast lounges and music suites by the hour, straight from the people who run them.",
    siteName: "StudioSpace",
    type: "website",
    images: ["/images/hero-photo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudioSpace | Book Creative Studios by the Hour",
    description:
      "Book photo studios, film stages, podcast lounges and music suites by the hour, straight from the people who run them.",
    images: ["/images/hero-photo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontHeading.variable} ${fontBody.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="studiospace-theme"
        >
          <TokenSync />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}