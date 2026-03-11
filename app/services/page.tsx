
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "../components/Reveal";
import FeatureCard from "../components/FeatureCard";
import { content } from "../lib/content";
import ExpandableText from "../components/ExpandableText";

export const metadata: Metadata = {
  title: "الخدمات",
  alternates: { canonical: "/الخدمات" },
};

export default function ServicesPage() {
  const { services, site } = content;

  const highlights = services.highlights ?? [];
  const cards = services.cards ?? [];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-white to-white" />
        <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          <Reveal>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              {services.pageTitle ?? "الخدمات"}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
              {services.pageIntro ?? services.pageTitle}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Highlights (like demo: خدمات السمع والنطق) */}
      {/* <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14">
        <Reveal>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            {services.highlightsTitle ?? "خدمات السمع والنطق"}
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {highlights.map((c: any, idx: number) => (
            <Reveal key={`${c.title}-${idx}`} delay={0.05 * idx}>
              <FeatureCard title={c.title} text={c.text} image={c.image} />
            </Reveal>
          ))}
        </div>
      </section> */}

      {/* Specialties (like demo: خدمات طبية متخصصة) */}
      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14">
        <Reveal>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            {services.specialtiesTitle ?? "خدمات طبية متخصصة"}
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-6">
          {cards.map((s: any, idx: number) => {
            const flip = idx % 2 === 1;
            const img = s.detailImage ?? s.image;

            return (
              <Reveal key={s.title} delay={0.04 * idx}>
                <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
                  <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
                    <div className={flip ? "lg:order-2" : ""}>
                      <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                        {s.title}
                      </h3>
                      {/* <p className="mt-3 text-sm sm:text-base leading-8 text-slate-600 whitespace-pre-line">
                        {s.text}
                      </p> */}
<ExpandableText text={s.text} lines={6} />
                     
                    </div>

                    <div className={flip ? "lg:order-1" : ""}>
                      <div className="relative aspect-[16/11] overflow-hidden rounded-3xl">
                        <Image
                          src={img}
                          alt={s.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                          priority={idx === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

     
    </div>
  );
}
