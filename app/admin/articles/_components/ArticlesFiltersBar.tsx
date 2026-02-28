"use client";

import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ArticlesFiltersBar({
  initialQ,
  initialStatus,
}: {
  initialQ: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(initialQ);
  const [status, setStatus] = useState(initialStatus);

  // حافظ على التزامن إذا تغيّر URL (مثلاً زر Back)
  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setStatus(sp.get("status") ?? "all");
  }, [sp]);

  function buildUrl(nextQ: string, nextStatus: string) {
    const params = new URLSearchParams(sp.toString());

    // status
    if (!nextStatus || nextStatus === "all") params.delete("status");
    else params.set("status", nextStatus);

    // q
    const trimmed = nextQ.trim();
    if (!trimmed) params.delete("q");
    else params.set("q", trimmed);

    // إذا عندك pagination
    params.delete("page");

    const qs = params.toString();
    return qs ? `/admin/articles?${qs}` : "/admin/articles";
  }

  return (
    <form
      method="GET"
      action="/admin/articles"
      className="mb-6 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-3 sm:grid-cols-[160px_1fr_auto_auto] sm:items-end">
       <div className="relative w-40">
      <select
        dir="rtl"
        className="w-full appearance-none rounded-xl border border-neutral-200 bg-white py-2 pr-7 pl-4 text-right outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 "
      >
        <option value="all">الكل</option>
        <option value="published">منشور</option>
        <option value="draft">مسودة</option>
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black" />
    </div>

        <div className="grid gap-2">
          <label className="text-xs font-bold text-slate-700">بحث</label>
          <input
            name="q"
            value={q}
            onChange={(e) => {
              const v = e.target.value;
              setQ(v);

              // المطلوب: إذا انمسح البحث يرجّع كل المقالات فورًا
              if (v.trim() === "") {
                router.replace(buildUrl("", status), { scroll: false });
              }
            }}
            placeholder="عنوان / مقتطف / slug..."
            className="h-11 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
          />
        </div>

        <button
          type="submit"
          className="h-11 rounded-2xl bg-slate-900 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
        >
          تطبيق
        </button>

        <button
          type="button"
          onClick={() => {
            setQ("");
            setStatus("all");
            router.replace("/admin/articles", { scroll: false });
          }}
          className="h-11 rounded-2xl border border-neutral-200 bg-white px-6 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-neutral-50"
        >
          إعادة ضبط
        </button>
      </div>
    </form>
  );
}