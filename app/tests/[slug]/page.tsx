import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "../../components/Reveal";
import { testsDetails } from "../../lib/content";
import TestHeroMedia from "../../components/TestHeroMedia";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getTestBySlug(slug: string) {
  return testsDetails.find((t) => t.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getTestBySlug(slug);

  if (!item) {
    return {
      title: "الفحص غير موجود | العيادة التخصصية للسمع والنطق - دمشق",
      description: "لم يتم العثور على صفحة الفحص المطلوبة.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pageUrl = `${siteUrl}/الفحوصات/${item.slug}`;

  return {
    title: `${item.title} | العيادة التخصصية للسمع والنطق - دمشق`,
    description: item.intro,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${item.title} | العيادة التخصصية للسمع والنطق - دمشق`,
      description: item.intro,
      url: pageUrl,
      siteName: "العيادة التخصصية للسمع والنطق - دمشق",
      locale: "ar_SY",
      type: "article",
      images: [
        {
          url: item.image,
          alt: item.imageAlt || item.title,
        },
      ],
    },
  };
}

export default async function TestDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getTestBySlug(slug);

  if (!item) notFound();

  return (
    <main className="min-h-screen bg-[#f6faf8] px-4 py-8 md:px-6" dir="rtl">
      <div className="mx-auto max-w-5xl">
        {/* زر رجوع */}
        <Reveal>
          <Link
            href="/الفحوصات"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d6e8e0] bg-white px-4 py-2 text-sm text-[#145c49] shadow-sm transition hover:bg-[#f2faf6]"
          >
            <span aria-hidden>←</span>
            <span>العودة إلى الفحوصات</span>
          </Link>
        </Reveal>

        {/* البطاقة الرئيسية */}
        {/* <div className="overflow-hidden rounded-3xl border border-[#dbece5] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
          <Reveal>
            <div className="relative h-56 w-full md:h-80">
              <Image
                src={item.image}
                alt={item.imageAlt || item.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1024px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
          </Reveal>

          <div className="p-5 md:p-8">
            <Reveal delay={0.03}>
              <span className="inline-block rounded-full bg-[#e7f5ef] px-3 py-1 text-xs font-medium text-[#0f6b53] md:text-sm">
                الفحوصات السمعية
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-3 text-2xl font-bold leading-tight text-[#123b31] md:text-4xl">
                {item.title}
              </h1>
            </Reveal>

            {item.intro  ? (
              <Reveal delay={0.09}>
                <p className="mt-2 text-lg font-medium text-[#19624f] md:text-xl">
                  {item.intro}
                </p>
              </Reveal>
            ) : null}

          </div>
        </div> */}

        <div className="overflow-hidden rounded-3xl border border-[#dbece5] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
          <Reveal>
            <TestHeroMedia item={item} />
          </Reveal>

          <div className="p-5 md:p-8">
            <Reveal delay={0.03}>
              <span className="inline-block rounded-full bg-[#e7f5ef] px-3 py-1 text-xs font-medium text-[#0f6b53] md:text-sm">
                الفحوصات السمعية
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-3 text-2xl font-bold leading-tight text-[#123b31] md:text-4xl">
                {item.title}
              </h1>
            </Reveal>

            {item.intro ? (
              <Reveal delay={0.09}>
                <p className="mt-2 text-lg font-medium text-[#19624f] md:text-xl">
                  {item.intro}
                </p>
              </Reveal>
            ) : null}
          </div>
        </div>

        {/* أقسام المحتوى */}
        <section className="mt-6 space-y-4" aria-label={`تفاصيل ${item.title}`}>
          {item.sections.map((section, idx) => (
            <Reveal
              key={`${section.heading}-${idx}`}
              delay={Math.min(idx * 0.04, 0.2)}
            >
              <article className="rounded-2xl border border-[#dbece5] bg-white p-5 shadow-sm md:p-6">
                <h2 className="mb-3 text-lg font-bold text-[#123b31] md:text-xl">
                  {section.heading}
                </h2>

                {section.content ? (
                  <p className="text-sm leading-8 text-[#3a6056] md:text-base">
                    {section.content}
                  </p>
                ) : null}

                {section.list?.length ? (
                  <ul className="space-y-2 text-sm leading-8 text-[#3a6056] md:text-base">
                    {section.list.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#17a36b]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </Reveal>
          ))}
        </section>

        {/* CTA بدون ناف/فوتر */}
        <Reveal delay={0.08}>
          <div className="mt-8 rounded-2xl border border-[#cfe8de] bg-gradient-to-l from-[#eaf8f2] to-[#f7fcfa] p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#124636] md:text-xl">
                  هل تحتاج إلى حجز هذا الفحص؟
                </h2>
                <p className="mt-1 text-sm text-[#44695f] md:text-base">
                  تواصل معنا لحجز موعد مناسب والحصول على تقييم أولي وخطة واضحة.
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/اتصل-بنا"
                  className="rounded-xl bg-[#0f8f62] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0c7b54]"
                >
                  احجز الآن
                </Link>

                <a
                  href="https://wa.me/963000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-[#b9ddd0] bg-white px-4 py-2.5 text-sm font-medium text-[#0f6b53] transition hover:bg-[#f2faf6]"
                >
                  واتساب
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
