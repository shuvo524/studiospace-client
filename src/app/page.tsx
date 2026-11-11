import { Suspense } from "react";
import { BrowseCategories } from "@/components/home/browse-categories";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { HeroSlider } from "@/components/home/hero-slider";
import { HostGuarantee } from "@/components/home/host-guarantee";
import { HowBookingWorks } from "@/components/home/how-booking-works";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";

function HeroFallback() {
  return (
    <div className="h-[560px] w-full animate-pulse bg-muted sm:h-[620px] lg:h-[680px]" />
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HeroFallback />}>
        <HeroSlider />
      </Suspense>
      <BrowseCategories />
      <WishlistProvider>
        <FeaturedStudios />
      </WishlistProvider>
      <HowBookingWorks />
      <HostGuarantee />
    </>
  );
}