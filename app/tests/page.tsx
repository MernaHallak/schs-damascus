import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "../components/Reveal";
import FeatureCard from "../components/FeatureCard";
import { content } from "../lib/content";

export const metadata: Metadata = {
  title: "الفحوصات",
  alternates: { canonical: "/الفحوصات" },
};

export default function TestsPage() {
  const { tests, site } = content;

  const cards = tests.cards ?? [];
  const cta = tests.cta ?? null;

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-white to-white" />
        <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          <Reveal>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              {tests.pageTitle ?? "الفحوصات"}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
              {tests.pageIntro ?? ""}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Cards grid */}
      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14">
        <Reveal>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            {tests.cardsTitle ?? "الفحوصات المتوفرة"}
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c: any, idx: number) => (
            <Reveal key={`${c.title}-${idx}`} delay={0.04 * idx}>
              <FeatureCard title={c.title} text={c.text} image={c.image} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      {cta ? (
        <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16">
          <Reveal>
            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                {cta.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-8 text-slate-600">
                {cta.text}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={cta.primaryHref ?? "/اتصل-بنا"}
                  className="inline-flex rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  {cta.primaryLabel ?? "اتصل بنا"}
                </Link>

                <a
                  href={cta.secondaryHref === "WHATSAPP" ? site.whatsappUrl : cta.secondaryHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-neutral-50"
                >
                  {cta.secondaryLabel ?? "واتساب"}
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      ) : null}
    </div>
  );
}