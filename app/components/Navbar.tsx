"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { content } from "../lib/content";

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: "/", label: "الرئيسية" },
  { href: "/الخدمات", label: "الخدمات" },
  { href: "/الفحوصات", label: "الفحوصات" },
  { href: "/المقالات", label: "المقالات" },
  { href: "/اتصل-بنا", label: "اتصل بنا" },
];



function norm(s: string) {
  // 1) فك ترميز المسار لأن `usePathname()` بيرجع أحيانًا مسار URL-encoded
  //    مثل: /%D8%A7%D9%84%D8%AE%D8%AF%D9%85%D8%A7%D8%AA بدل /الخدمات
  let decoded = s;
  try {
    decoded = decodeURI(s);
  } catch {
    decoded = s; // إذا كان في ترميز غير صالح خلّيه كما هو
  }

  // 2) توحيد السلاشات: شيل السلاشات بالنهاية (ما عدا /)
  return decoded === "/" ? "/" : decoded.replace(/\/+$/, "");
}

function isActive(pathname: string, href: string) {
  const p = norm(pathname);
  const h = norm(href);
  if (h === "/") return p === "/";
  return p === h || p.startsWith(h + "/");
}

export default function Navbar() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () =>
      NAV.map((it) => ({
        ...it,
        active: isActive(pathname, it.href),
      })),
    [pathname]
  );

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/65">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 py-3">
          <Link
            href="/"
            aria-label={content.site.name}
            className="flex items-center gap-3"
          >
            <Image
              src="/assets/branding/logo_icon.png"
              alt=""
              width={40}
              height={40}
              priority
              className="h-10 w-10 rounded-xl object-contain"
            />
            <div className="leading-tight">
              <div className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900">
                {content.site.name}
              </div>
              <div className="text-xs text-slate-500">
                {content.site.city} • {content.site.country}
              </div>
            </div>
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="التنقل">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={
                  "rounded-full px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 " +
                  (it.active
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                    : "text-slate-700 hover:bg-neutral-100")
                }
              >
                {it.label}
              </Link>
            ))}
          </nav>

          {/* Mobile */}
          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-slate-700 shadow-sm transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="md:hidden pb-3">
            <nav className="grid gap-2" aria-label="التنقل">
              {items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className={
                    "rounded-2xl px-4 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 " +
                    (it.active
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                      : "border border-neutral-200 bg-white text-slate-700 hover:bg-neutral-50")
                  }
                >
                  {it.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
