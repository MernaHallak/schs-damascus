"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

type State = { ok?: boolean; error?: string };

type Initial = {
  id?: string;
  title?: string;
  excerpt?: string;
  contentMarkdown?: string;
  isPublished?: boolean;
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
  const initialState = { error: undefined, values: undefined };

  const [state, formAction, pending] = useActionState<State, FormData>(
    action,
    initialState,
  );

  const currentValues = state.values ?? {
    title: initial.title ?? "",
    excerpt: initial.excerpt ?? "",
    contentMarkdown: initial.contentMarkdown ?? "",
    coverImageAlt: initial.coverImageAlt ?? "",
    isPublished: initial.isPublished ?? false,
  };

  const [title, setTitle] = useState(currentValues.title);
  const [excerpt, setExcerpt] = useState(currentValues.excerpt);
  const [contentMarkdown, setContentMarkdown] = useState(
    currentValues.contentMarkdown,
  );
  const [coverImageAlt, setCoverImageAlt] = useState(
    currentValues.coverImageAlt,
  );
  const [isPublished, setIsPublished] = useState(currentValues.isPublished);

  const [selectedCoverName, setSelectedCoverName] = useState("");

  useEffect(() => {
    if (!state.values) return;

    setTitle(state.values.title);
    setExcerpt(state.values.excerpt);
    setContentMarkdown(state.values.contentMarkdown);
    setCoverImageAlt(state.values.coverImageAlt);
    setIsPublished(state.values.isPublished);
  }, [state.values]);

  return (
    <form action={formAction} className="grid gap-5">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-900">عنوان المقال</label>
        <input
          name="title"
          // defaultValue={initial.title ?? ""}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
          required
        />
        <p className="text-xs leading-6 text-slate-500">
          سيتم توليد رابط المقال تلقائيًا من العنوان.
        </p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-900">مقتطف</label>
        <textarea
          name="excerpt"
          // defaultValue={initial.excerpt ?? ""}
           value={excerpt}
  onChange={(e) => setExcerpt(e.target.value)}
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
          // defaultValue={initial.contentMarkdown ?? ""}
           value={contentMarkdown}
  onChange={(e) => setContentMarkdown(e.target.value)}
          rows={14}
          dir="auto"
          wrap="soft"
          className="w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm leading-7 outline-none
             focus:ring-2 focus:ring-emerald-500/30
             whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
          required
        />
      </div>

      <div className="grid gap-2 ">
        <label className="text-sm font-bold text-slate-900">
          رفع غلاف صورة للمقال
        </label>
        <input
          id="coverFile"
          type="file"
          name="coverFile"
          accept="image/png,image/jpeg,image/webp"
          required={!initial.coverImageBase64}
          className="sr-only"
          onChange={(e) => {
            setSelectedCoverName(e.target.files?.[0]?.name || "");
          }}
        />

        {/* <label
          htmlFor="coverFile"
          className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 cursor-pointer transition hover:border-emerald-400"
        > */}
        <label
          htmlFor="coverFile"
          className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 cursor-pointer transition focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500"
        >
          <span className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white">
            اختيار صورة
          </span>

          <div className="min-w-0 flex-1 text-right">
            <p className="truncate text-sm text-slate-700">
              {selectedCoverName ||
                (initial.coverImageBase64
                  ? "توجد صورة غلاف محفوظة حاليًا، يمكنك استبدالها"
                  : "لم يتم اختيار صورة بعد")}
            </p>
          </div>
        </label>

        <div className="text-xs leading-6 text-slate-500">
          <p>الصيغ المدعومة: PNG / JPEG / WEBP</p>
          <p>الحد الأعلى للرفع: 5MB.</p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-bold text-slate-900">
            نص بديل لصورة الغلاف (alt)
          </label>
          <input
            name="coverImageAlt"
            // defaultValue={initial.coverImageAlt ?? ""}
             value={coverImageAlt}
  onChange={(e) => setCoverImageAlt(e.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
            placeholder="مثال: أخصائي يجري فحص سمع لطفل داخل العيادة"
            required
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
          // defaultChecked={Boolean(initial.isPublished)}
          checked={isPublished}
  onChange={(e) => setIsPublished(e.target.checked)}
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
