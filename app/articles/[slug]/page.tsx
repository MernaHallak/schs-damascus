import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import SmartImage from "../../components/SmartImage";

// ISR: أداء أفضل + نتائج SEO أفضل (مع revalidatePath بعد أي تعديل من لوحة الإدارة)
export const revalidate = 60;

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("ar-SY", { dateStyle: "medium" }).format(d);
}

const safeDecode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

async function findPublishedArticleOrRedirect(slug: string) {
  const article = await prisma.article.findFirst({
    where: { slug, isPublished: true },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      contentMarkdown: true,
      coverImageBase64: true,
      publishedAt: true,
      updatedAt: true,
      coverImageAlt: true,
    },
  });

  if (article) {
    return { article, redirectedFrom: null as string | null };
  }

  const redirectEntry = await prisma.articleSlugRedirect.findUnique({
    where: { fromSlug: slug },
    select: {
      article: {
        select: {
          slug: true,
          title: true,
          excerpt: true,
          contentMarkdown: true,
          coverImageBase64: true,
          publishedAt: true,
          updatedAt: true,
          coverImageAlt: true,
          isPublished: true,
        },
      },
    },
  });

  if (redirectEntry?.article?.isPublished) {
    const { isPublished, ...redirectedArticle } = redirectEntry.article;
    return { article: redirectedArticle, redirectedFrom: slug };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = safeDecode(rawSlug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://schs-sy.com";

  const resolved = await findPublishedArticleOrRedirect(slug);
  if (!resolved) return { title: "المقال غير موجود" };

  const article = resolved.article;
  const canonical = `${siteUrl}/المقالات/${encodeURIComponent(article.slug)}`;

  return {
    title: article.title,
    description: article.excerpt?.trim(),
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description: article.excerpt?.trim(),
      url: canonical,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt?.toISOString(),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = safeDecode(rawSlug);

  const resolved = await findPublishedArticleOrRedirect(slug);
  if (!resolved) notFound();

  if (resolved.redirectedFrom) {
    permanentRedirect(`/المقالات/${encodeURIComponent(resolved.article.slug)}`);
  }

  const article = resolved.article;
  const cover = article.coverImageBase64?.trim() || "";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const canonical = `${siteUrl}/المقالات/${encodeURIComponent(article.slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt?.toISOString(),
    mainEntityOfPage: canonical,
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-6 text-end">
        <Link
          href="/المقالات"
          className="inline-flex items-center gap-2 rounded-full border border-[#d6e8e0] bg-white px-4 py-2 text-sm text-[#145c49] shadow-sm transition hover:bg-[#f2faf6] hover:border-[#bfd8ce]"
        >
          <span aria-hidden>←</span>
          <span>العودة إلى المقالات</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-[#dbece5] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
        {cover ? (
          <div className="relative h-[280px] w-full overflow-hidden bg-[#f4f8f6] sm:h-[360px] md:h-[430px]">
            {/* خلفية خفيفة من نفس الصورة */}
            <SmartImage
              src={cover}
              alt=""
              sizes="100vw"
              priority
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-2xl"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

            {/* الصورة الأساسية */}
            <SmartImage
              src={cover}
              alt={article.coverImageAlt || article.title}
              sizes="(max-width: 768px) 100vw, 1100px"
              priority
              className="absolute inset-0 h-full w-full object-contain p-3 sm:p-4 md:p-5"
            />
          </div>
        ) : null}

        <div className="px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-block rounded-full bg-[#e7f5ef] px-3 py-1 text-xs font-medium text-[#0f6b53] md:text-sm">
              المقالات
            </span>

            <h1 className="mt-4 text-3xl font-bold leading-tight text-[#123b31] sm:text-4xl md:text-5xl">
              {article.title}
            </h1>

            {article.excerpt ? (
              <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#19624f] sm:text-lg">
                {article.excerpt}
              </p>
            ) : null}

            {article.publishedAt ? (
              <div className="mt-5 text-sm text-[#6c8a80]">
                {formatDate(article.publishedAt)}
              </div>
            ) : null}
          </div>

          <div className="mx-auto mt-8 max-w-4xl border-t border-[#e7efeb] pt-8 md:mt-10 md:pt-10">
            <article
              dir="auto"
              className="mx-auto max-w-3xl whitespace-break-spaces break-words text-base leading-9 text-[#243b35] [overflow-wrap:anywhere]"
            >
              {article.contentMarkdown}
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}