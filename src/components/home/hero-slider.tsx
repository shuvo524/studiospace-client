"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    image: "/images/hero-photo.jpg",
    badge: "Photo Studios",
    title: "Find the perfect light for your next shoot",
    text: "Cyc walls, natural light lofts and fully equipped photo studios, bookable by the hour.",
  },
  {
    image: "/images/hero-music.jpg",
    badge: "Music Suites",
    title: "Record your sound in a space built for it",
    text: "Acoustically treated suites with pro gear, from quiet vocal booths to full band rooms.",
  },
  {
    image: "/images/hero-podcast.jpg",
    badge: "Podcast Lounges",
    title: "Start your show in a studio that feels like home",
    text: "Comfortable podcast lounges with clean audio, great mics and room for every guest.",
  },
];

export function HeroSlider() {
  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-[560px] w-full sm:h-[620px] lg:h-[680px]"
        style={
          {
            "--swiper-pagination-color": "var(--primary)",
            "--swiper-pagination-bullet-inactive-color": "#ffffff",
            "--swiper-pagination-bullet-inactive-opacity": "0.5",
          } as React.CSSProperties
        }
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.badge}>
            <div className="relative h-full w-full bg-zinc-900">
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.15) 100%)",
                }}
              />
              <div className="relative mx-auto flex h-full w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl pb-8 text-white">
                  <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur">
                    {slide.badge}
                  </span>
                  <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
                    {slide.text}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/studios"
                      className={cn(buttonVariants({ size: "lg" }), "gap-2")}
                    >
                      Explore Studios
                      <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      href="/studios"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white",
                      )}
                    >
                      Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}