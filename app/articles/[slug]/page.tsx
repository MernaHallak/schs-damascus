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

  // const ogImage =
  //   article.coverImageUrl && !article.coverImageUrl.startsWith("data:")
  //     ? article.coverImageUrl.startsWith("/")
  //       ? `${siteUrl}${article.coverImageUrl}`
  //       : article.coverImageUrl
  //     : undefined;

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
      // images: ogImage ? [{ url: ogImage }] : undefined,
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

  // const cover =
  //   (article.coverImageUrl && article.coverImageUrl.trim()) ||
  //   (article.coverImageBase64 && article.coverImageBase64.trim()) ||
  //   "";
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
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl">
        <Link
          href="/المقالات"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d6e8e0] bg-white px-4 py-2 text-sm text-[#145c49] shadow-sm transition hover:bg-[#f2faf6]"
          >
            <span aria-hidden>←</span>
            <span>العودة إلى المقالات</span>
        </Link>

        <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-[1.15]">
          {article.title}
        </h1>

        <p className="mt-3 text-base leading-8 text-slate-600 break-words [overflow-wrap:anywhere]">
          {article.excerpt}
        </p>

        <div className="mt-4 text-sm text-slate-500">
          {formatDate(article.publishedAt)}
        </div>

        {cover ? (
          <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100">
            <div className="relative aspect-[16/9]">
              <SmartImage
                src={cover}
                alt={article.coverImageAlt || article.title}
                sizes="(max-width: 768px) 100vw, 768px"
                priority
                className="absolute inset-0 h-full w-full object-cover object-[50%_25%]"
              />
            </div>
          </div>
        ) : null}

        <article
          dir="auto"
          className="mt-10 text-base leading-8 text-slate-800 whitespace-break-spaces break-words [overflow-wrap:anywhere]"
        >
          {article.contentMarkdown}
        </article>
      </div>
    </div>
  );
}
