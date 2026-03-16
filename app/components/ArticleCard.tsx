import Link from "next/link";
import SmartImage from "./SmartImage";

export type ArticleCardData = {
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  publishedAt: Date | null;
  // coverImageUrl: string | null;  
  coverImageAlt: string | null;
  coverImageBase64: string | null;
};

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("ar-SY", { dateStyle: "medium" }).format(d);
}

export default function ArticleCard({ a }: { a: ArticleCardData }) {
  const cover = a.coverImageBase64 || "";

  return (
    <Link
      href={`/المقالات/${encodeURIComponent(a.slug)}`}
      className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        {cover ? (
          <SmartImage
            src={cover}
            alt={a.coverImageAlt || a.title}
            sizes="(max-width: 768px) 100vw, 33vw"
           className="absolute inset-0 h-full w-full object-cover object-[50%_25%] transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
            بدون صورة
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
      </div>

      <div className="p-6">
        <div className="text-xs text-slate-500">{formatDate(a.publishedAt)}</div>
          <div className="mt-1 text-xs text-slate-500">الكاتب: {a.author}</div>
        <h3 className="mt-1 text-base font-extrabold tracking-tight text-slate-900 break-words [overflow-wrap:anywhere]">
          {a.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-600 break-words [overflow-wrap:anywhere]">
          {a.excerpt}
        </p>
      </div>
    </Link>
  );
}
