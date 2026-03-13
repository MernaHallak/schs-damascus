"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type GalleryImage = {
  src: string;
  alt?: string;
};

type HeroMediaItem = {
  title: string;
  image?: string;
  imageAlt?: string;
  images?: GalleryImage[];
};

export default function TestHeroMedia({ item }: { item: HeroMediaItem }) {
  const gallery = useMemo(() => {
    if (item.images?.length) return item.images;
    if (item.image) {
      return [{ src: item.image, alt: item.imageAlt || item.title }];
    }
    return [];
  }, [item]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [item.title]);

  if (!gallery.length) return null;

  const hasSlider = gallery.length > 1;
  const current = gallery[activeIndex];

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative h-[360px] w-full overflow-hidden bg-[#f4f8f6] sm:h-[400px] md:h-[460px] lg:h-[520px]">
      {/* خلفية ضبابية من نفس الصورة الحالية */}
      <Image
        src={current.src}
        alt=""
        fill
        aria-hidden="true"
        priority={activeIndex === 0}
        className="scale-125 object-cover blur-3xl opacity-25"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-white/5 to-transparent" />

      {/* الصورة الحالية */}
      <div className="absolute inset-0">
        <Image
          src={current.src}
          alt={current.alt || item.imageAlt || item.title}
          fill
          priority={activeIndex === 0}
          className="object-contain p-2 md:p-4"
          sizes="(max-width: 768px) 100vw, 1024px"
        />
      </div>

      {/* الأسهم */}
   {hasSlider && (
  <>
    <button
      type="button"
      onClick={goPrev}
      aria-label="الصورة السابقة"
      className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2 text-[#123b31] shadow-sm backdrop-blur-sm transition hover:bg-white"
    >
      <ChevronRight className="h-5 w-5" />
    </button>

    <button
      type="button"
      onClick={goNext}
      aria-label="الصورة التالية"
      className="absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2 text-[#123b31] shadow-sm backdrop-blur-sm transition hover:bg-white"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>

    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
      {gallery.map((img, index) => (
        <button
          key={`${img.src}-${index}`}
          type="button"
          onClick={() => setActiveIndex(index)}
          aria-label={`الانتقال إلى الصورة ${index + 1}`}
          aria-current={index === activeIndex}
          className={`h-2.5 w-2.5 cursor-pointer rounded-full transition ${
            index === activeIndex
              ? "bg-[#0f6b53]"
              : "bg-white/80 hover:bg-white"
          }`}
        />
      ))}
    </div>
  </>
)}
    </div>
  );
}