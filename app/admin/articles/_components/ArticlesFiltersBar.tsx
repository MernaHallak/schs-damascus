"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

export default function ArticlesFiltersBar({
  initialQ,
  initialStatus,
}: {
  initialQ: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [q, setQ] = useState(initialQ);
  const [status, setStatus] = useState(initialStatus);


function buildUrl(nextQ: string, nextStatus: string) {
  const params = new URLSearchParams(sp.toString());

  const trimmed = nextQ.trim();

  if (!nextStatus || nextStatus === "all") params.delete("status");
  else params.set("status", nextStatus);

  if (!trimmed) params.delete("q");
  else params.set("q", trimmed);

  params.delete("page");
  params.delete("msg");

  const qs = params.toString();
  return qs ? `/admin/articles?${qs}` : "/admin/articles";
}

  // function buildUrl(nextQ: string, nextStatus: string) {
  //   const params = new URLSearchParams(sp.toString());

  //   const trimmed = nextQ.trim();

  //   if (!nextStatus || nextStatus === "all") params.delete("status");
  //   else params.set("status", nextStatus);

  //   if (!trimmed) params.delete("q");
  //   else params.set("q", trimmed);

  //   params.delete("page");

  //   const qs = params.toString();
  //   return qs ? `/admin/articles?${qs}` : "/admin/articles";
  // }

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.replace(buildUrl(q, status), { scroll: false });
  //   }, 50);

  //   return () => clearTimeout(timer);
  // }, [q, status, router]);

  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setStatus(sp.get("status") ?? "all");
  }, [sp]);

  const submitSearch = () => {
    const trimmed = q.trim();

    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    router.replace(buildUrl(trimmed, status), { scroll: false });
    inputRef.current?.focus();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitSearch();
  };

  const handleReset = () => {
    setQ("");
    setStatus("all");
    router.replace("/admin/articles", { scroll: false });
    inputRef.current?.focus();
  };

  return (
    <form
      method="GET"
      action="/admin/articles"
      onSubmit={handleSubmit}
      className="mb-6 rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-3">
          <label
            htmlFor="articles-search"
            className="block text-base font-extrabold text-slate-900 sm:text-lg"
          >
            بحث عن مقال
          </label>

          <div className="relative">
            <input
              ref={inputRef}
              id="articles-search"
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="أدخل عنوان أو مقتطف المقال..."
              className="h-13 w-full rounded-2xl border border-neutral-200 bg-white pr-4 pl-14 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />

            <button
              type="button"
              aria-label="بحث"
              onClick={submitSearch}
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm transition hover:bg-emerald-100 active:scale-[0.98]"
            >
              <Search className="h-4.5 w-4.5" strokeWidth={2.4} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="h-12 rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-neutral-50"
        >
          إعادة ضبط
        </button>
      </div>
    </form>
  );
}