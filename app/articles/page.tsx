import type { Metadata } from "next";
import Reveal from "../components/Reveal";
import ArticleCard from "../components/ArticleCard";
import { prisma } from "../lib/prisma";

const safeDecode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};
// ISR: أداء أفضل + نتائج SEO أفضل (مع revalidatePath بعد أي تعديل من لوحة الإدارة)
export const revalidate = 60;

export const metadata: Metadata = {
  title: "المقالات",
  alternates: { canonical: "/المقالات" },
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const articles = await prisma.article.findMany({
    where: {
      isPublished: true,
      OR: query
        ? [
            { title: { contains: query } },
            { excerpt: { contains: query } },
          ]
        : undefined,
    },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      title: true,
      author: true,
      excerpt: true,
      publishedAt: true,
      coverImageBase64: true,
      coverImageAlt: true,
    },
  });

  return (
   
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
      <Reveal>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">المقالات</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
          مقالات طبية وتوعوية منشورة من العيادة.
        </p>
      </Reveal>

      <div className="mt-8">
        <form method="get" className="max-w-xl">
          <label className="block text-sm font-bold text-slate-900">بحث</label>
          <input
            name="q"
            defaultValue={query}
            placeholder="ابحث بالعنوان أو المقتطف..."
            className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </form>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {articles.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-7 text-sm text-slate-600 shadow-sm lg:col-span-3">
            لا يوجد مقالات منشورة حاليًا.
          </div>
        ) : (
          articles.map((a, idx) => (
            <Reveal key={a.slug} delay={0.03 * idx}>
              <ArticleCard a={a} />
            </Reveal>
          ))
        )}
      </div>
    </div>
        
    
  );
}
