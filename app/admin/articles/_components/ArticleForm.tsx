"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { slugify } from "../../../lib/slug";

type State = { ok?: boolean; error?: string };

type Initial = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  contentMarkdown?: string;
  isPublished?: boolean;
  coverImageUrl?: string;
  coverImageBase64?: string;
  coverImageAlt?: string;
};

export default function ArticleForm({
  initial = {},
  submitLabel,
  action,
}: {
  initial?: Initial;
  submitLabel: string;
  action: (prevState: State, formData: FormData) => Promise<State>;
}) {
  const [title, setTitle] = useState(initial.title ?? "");
  const [slug, setSlug] = useState(initial.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));

  const autoSlug = useMemo(() => slugify(title), [title]);

  // React 19: returns [state, formAction, pending]
  const [state, formAction, pending] = useActionState<State, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="grid gap-5">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-900">عنوان المقال</label>
        <input
          name="title"
          value={title}
          onChange={(e) => {
            const v = e.target.value;
            setTitle(v);
            if (!slugTouched) setSlug(slugify(v));
          }}
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-900">
          Slug (الرابط)
        </label>
        <input
          name="slug"
          value={slugTouched ? slug : autoSlug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
          placeholder={autoSlug || "مثال: نص-المقال"}
        />
        <p className="text-xs leading-6 text-slate-500">
          إذا تركته فاضي، رح يتولد تلقائيًا من العنوان.
        </p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-900">مقتطف</label>
        <textarea
          name="excerpt"
          defaultValue={initial.excerpt ?? ""}
          rows={3}
          dir="auto"
          wrap="soft"
          className="w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none
             focus:ring-2 focus:ring-emerald-500/30
             whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-900">
          المحتوى (Markdown)
        </label>
        <textarea
          name="contentMarkdown"
          defaultValue={initial.contentMarkdown ?? ""}
          rows={14}
          dir="auto"
          wrap="soft"
          className="w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm leading-7 outline-none
             focus:ring-2 focus:ring-emerald-500/30
             whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
          required
        />
        {/* <p className="text-xs leading-6 text-slate-500">
          Markdown فقط (بدون HTML خام). مثال:{" "}
          <code className="rounded bg-neutral-100 px-1">## عنوان</code> أو{" "}
          <code className="rounded bg-neutral-100 px-1">- نقطة</code>.
        </p> */}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-900">
          صورة الغلاف (رابط URL)
        </label>
        <input
          name="coverImageUrl"
          defaultValue={initial.coverImageUrl ?? ""}
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
          placeholder="https://..."
        />

        <p className="text-xs leading-6 text-slate-500">
          الأفضل للسرعة.
          <span className="block">
            ملاحظة: رابط
            <code className="mx-1 rounded bg-neutral-100 px-1">
              google.com/search
            </code>
            مو رابط صورة، لازم رابط صورة مباشر (Open image in new tab).
          </span>
          <span className="block">
            إذا بدك ترفع ملف: استخدم الحقل التالي (رح ننزّله تلقائيًا لصورة
            "WEBP" مضغوطة للأداء). إذا بدك تلصق Base64 يدويًا لازم يكون صغير
            (حوالي ≤ 400KB).
          </span>
        </p>
        <div className="grid gap-2">
          <label className="text-sm font-bold text-slate-900">
            نص بديل لصورة الغلاف (alt) — اختياري
          </label>
          <input
            name="coverImageAlt"
            defaultValue={initial.coverImageAlt ?? ""}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
            placeholder="مثال: أخصائي يجري فحص سمع لطفل داخل العيادة"
          />
          <p className="text-xs leading-6 text-slate-500">
            اكتب وصفًا قصيرًا ودقيقًا للصورة حسب سياق المقال (يفيد SEO
            والوصولية).
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-900">
          رفع غلاف (ملف) — اختياري
        </label>
        <input
          name="coverFile"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
        />

        <p className="text-xs text-slate-500">
          الحد الأعلى للرفع: 8MB. سيتم تحويل الغلاف تلقائيًا إلى WEBP مضغوط
          للأداء.
        </p>
        <div className="grid gap-2">
          <label className="text-sm font-bold text-slate-900">
            نص بديل لصورة الغلاف (alt) — اختياري
          </label>
          <input
            name="coverImageAlt"
            defaultValue={initial.coverImageAlt ?? ""}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
            placeholder="مثال: أخصائي يجري فحص سمع لطفل داخل العيادة"
          />
          <p className="text-xs leading-6 text-slate-500">
            اكتب وصفًا قصيرًا ودقيقًا للصورة حسب سياق المقال (يفيد SEO
            والوصولية).
          </p>
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm font-bold text-slate-900">
        <input
          name="isPublished"
          type="checkbox"
          defaultChecked={Boolean(initial.isPublished)}
          className="h-4 w-4 rounded border-neutral-300"
        />
        نشر المقال
      </label>

      {state?.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? "جارٍ الحفظ..." : submitLabel}
        </button>

        <Link
          href="/admin/articles"
          className="rounded-2xl border border-neutral-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-neutral-50"
        >
          رجوع
        </Link>
      </div>
    </form>
  );
}
