import Link from "next/link";
import { logoutAction } from "./actions";

export const metadata = {
  title: "لوحة التحكم",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-0px)] bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin/articles" className="text-sm font-black text-slate-900">
              لوحة المقالات
            </Link>
            <a href="/" className="text-xs font-bold text-slate-600 hover:underline">
              فتح الموقع
            </a>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-neutral-50"
            >
              تسجيل خروج
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  );
}
