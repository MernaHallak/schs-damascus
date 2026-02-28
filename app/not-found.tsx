import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
      <div className="mx-auto max-w-xl rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <div className="text-2xl font-black tracking-tight text-slate-900">الصفحة غير موجودة</div>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          ممكن يكون الرابط غير صحيح أو تم نقل الصفحة.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            الرئيسية
          </Link>
          <Link
            href="/الخدمات/"
            className="inline-flex rounded-2xl border border-neutral-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-neutral-50"
          >
            الخدمات
          </Link>
        </div>
      </div>
    </div>
  );
}
