import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "./components/Reveal";
import FeatureCard from "./components/FeatureCard";
import { content, testsDetails } from "./lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

function waText(text: string) {
  const base = content.site.whatsappUrl;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}text=${encodeURIComponent(text)}`;
}

export default function HomePage() {
  const { home, services, tests, site } = content;

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={home.hero.image}
            alt={home.hero.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/75 to-white/30" />
        </div>

        <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-xs text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                مواعيد مرنة • متابعة مستمرة • دعم عبر واتساب
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                {home.hero.title}
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-4 text-base sm:text-lg leading-8 text-slate-700">
                {home.hero.subtitle}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/الخدمات/"
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  استعرض الخدمات
                </Link>
                <a
                  href={waText("مرحبا، بدي استفسار عن خدمات العيادة")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white/80 px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  تواصل واتساب
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {home.servicesQuickList.slice(0, 4).map((t) => (
                  <div
                    key={t}
                    className="rounded-2xl border border-neutral-200 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                خدماتنا الأكثر طلبًا
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                تشخيص دقيق + خطة واضحة + متابعة.
              </p>
            </div>
            <Link
              href="/الخدمات/"
              className="hidden sm:inline-flex rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-neutral-50"
            >
              كل الخدمات
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.cards.map((c, idx) => (
            <Reveal key={c.title} delay={0.05 * idx}>
              <FeatureCard title={c.title} text={c.text} image={c.image} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                الفحوصات
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                {tests.pageIntro}
              </p>
              <div className="mt-5 grid gap-3">
                {testsDetails.map((t) => (
                  <div
                    key={t.title}
                    className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3"
                  >
                    <div className="text-sm font-bold text-slate-900">
                      {t.title}
                    </div>
                    <div className="mt-1 text-sm leading-7 text-slate-600">
                      {t.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/الفحوصات/"
                  className="inline-flex rounded-2xl bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 px-5 py-3 text-sm font-bold text-white shadow-sm transition "
                >
                  تفاصيل الفحوصات
                </Link>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-neutral-50"
                >
                  موقع العيادة
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="min-h-[220px] sm:min-h-[401px] sm:max-w-[460px] mx-auto relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
              <Image
                src={testsDetails[0].image}
                alt="الفحوصات"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover "
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        <Reveal>
          <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  فريق الاختصاص
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600">
                  أسماء الاختصاصيين قابلة للكبس لفتح واتساب مباشرة.
                </p>
              </div>
              <Link
                href="/اتصل-بنا/"
                className="inline-flex rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-neutral-50"
              >
                احجز موعد
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {home.specialists.map((s, idx) => (
                <Reveal key={s.wa} delay={0.03 * idx}>
                <a
                  href={`https://wa.me/${s.wa}?text=${encodeURIComponent("مرحباً، أريد حجز موعد.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`فتح واتساب: ${s.name}`}
                  className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-900 transition hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  {s.name}
                </a>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
