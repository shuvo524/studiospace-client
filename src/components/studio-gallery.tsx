"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Aperture } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function GalleryImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-secondary">
        <Aperture className="size-16 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
}

export function StudioGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const hasMany = images.length > 1;

  return (
    <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-muted">
      <Swiper
        modules={[Navigation, Pagination, Keyboard]}
        navigation={hasMany}
        pagination={hasMany ? { clickable: true } : false}
        keyboard
        className="h-full w-full"
        style={
          {
            "--swiper-navigation-color": "#ffffff",
            "--swiper-pagination-color": "var(--primary)",
            "--swiper-pagination-bullet-inactive-color": "#ffffff",
          } as React.CSSProperties
        }
      >
        {images.map((src, index) => (
          <SwiperSlide key={`${src}-${index}`}>
            <GalleryImage src={src} alt={`${title} photo ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}