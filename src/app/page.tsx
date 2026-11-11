import { Suspense } from "react";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { HeroSlider } from "@/components/home/hero-slider";

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
      <FeaturedStudios />
    </>
  );
}