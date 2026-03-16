import Link from "next/link";
import { prisma } from "../../lib/prisma";
import StatusBadge from "./_components/StatusBadge";
import DeleteButton from "./_components/DeleteButton";
import { deleteArticleAction, togglePublishAction } from "./actions";
import ArticlesFiltersBar from "./_components/ArticlesFiltersBar";
import ClickableRow from "./_components/ClickableRow";

export const dynamic = "force-dynamic";

function fmt(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("ar-SY", { dateStyle: "medium" }).format(d);
}

type SP = Promise<{
  q?: string;
  status?: string;
  msg?: string;
}>;

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;

  const q = (sp.q ?? "").trim();
  const status = sp.status ?? "all";
  const msg = sp.msg ?? "";

  const where: any = {};
  if (status === "published") where.isPublished = true;
  if (status === "draft") where.isPublished = false;

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { slug: { contains: q } },
    ];
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: [{ isPublished: "desc" }, { updatedAt: "desc" }],
  });

  const message =
    msg === "created"
      ? "تم إنشاء المقال."
      : msg === "updated"
        ? "تم تحديث المقال."
        : msg === "deleted"
          ? "تم حذف المقال."
          : msg === "published"
            ? "تم تعديل حالة النشر."
            : "";
const noticeClass =
  msg === "deleted"
    ? "border-red-200 bg-red-50 text-red-700"
    : "border-emerald-200 bg-emerald-50 text-emerald-700";
  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            إدارة المقالات
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            إنشاء/تعديل/حذف + مسودة/منشور.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
        >
          + إضافة مقال
        </Link>
      </div>

      {/* الفلاتر (Client Component) */}
      <div className="mt-6">
        <ArticlesFiltersBar initialQ={q} initialStatus={status} />
      </div>

      {message ? (
  <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-bold ${noticeClass}`}>
    {message}
  </div>
) : null}

      <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-neutral-50 text-xs font-bold text-slate-600">
              <tr>
                <th className="px-4 py-3 text-right">العنوان</th>
                <th className="px-4 py-3 text-right">الحالة</th>
                <th className="px-4 py-3 text-right">تاريخ النشر</th>
                <th className="px-4 py-3 text-right">آخر تحديث</th>
                <th className="px-4 py-3 text-right">إجراءات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200">
              {articles.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    لا يوجد نتائج.
                  </td>
                </tr>
              ) : (
                articles.map((a) => (
                  <ClickableRow
                    key={a.id}
                    href={`/admin/articles/${a.id}/edit`}
                    className="align-top"
                  >
                    {(() => {
                      const editHref = `/admin/articles/${a.id}/edit`;

                      return (
                        <>
                          <td className="px-4 py-4">
                            <Link
                              href={editHref}
                              className="block rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <div className="font-black text-slate-900">
                                {a.title}
                              </div>
                              <div className="mt-1 text-xs text-slate-500">
                                /{a.slug}
                              </div>
                            </Link>

                            {a.isPublished ? (
                              <a
                                href={`/المقالات/${encodeURIComponent(a.slug)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              >
                                فتح المقال العام
                              </a>
                            ) : null}
                          </td>

                          <td className="px-4 py-4">
                            <Link
                              href={editHref}
                              className="inline-block rounded-xl focus:outline-none"
                            >
                              <StatusBadge isPublished={a.isPublished} />
                            </Link>
                          </td>

                          <td className="px-4 py-4">
                            <Link
                              href={editHref}
                              className="block text-slate-600 hover:underline rounded-xl focus:outline-none"
                            >
                              {fmt(a.publishedAt)}
                            </Link>
                          </td>

                          <td className="px-4 py-4">
                            <Link
                              href={editHref}
                              className="block text-slate-600 hover:underline rounded-xl focus:outline-none "
                            >
                              {fmt(a.updatedAt)}
                            </Link>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <Link
                                href={editHref}
                                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 transition hover:bg-neutral-50"
                              >
                                تعديل
                              </Link>

                              <form action={togglePublishAction}>
                                <input type="hidden" name="id" value={a.id} />
                                <input
                                  type="hidden"
                                  name="isPublished"
                                  value={String(!a.isPublished)}
                                />
                                <button
                                  type="submit"
                                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 cursor-pointer"
                                >
                                  {a.isPublished ? "إلغاء النشر" : "نشر"}
                                </button>
                              </form>

                              <form action={deleteArticleAction}>
                                <input type="hidden" name="id" value={a.id} />
                                <DeleteButton />
                              </form>
                            </div>
                          </td>
                        </>
                      );
                    })()}
                  </ClickableRow>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
