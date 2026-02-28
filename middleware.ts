import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookieName, readSessionCookie } from "./app/lib/auth/session";

const MAP = [
  { ar: "/الخدمات", en: "/services" },
  { ar: "/الفحوصات", en: "/tests" },
  { ar: "/اتصل-بنا", en: "/contact" },
  { ar: "/المقالات", en: "/articles" },
];

function swapPrefix(path: string, from: string, to: string) {
  if (path === from) return to;
  if (path.startsWith(from + "/")) return to + path.slice(from.length);
  return null;
}

function safeDecode(path: string) {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const rawPath = url.pathname;
  const path = safeDecode(rawPath);

  // تجاهل ملفات النظام/الستاتيك
  if (rawPath.startsWith("/_next")) return NextResponse.next();

  // 1) حماية الادمن + منع ظهور login إذا في Session
  if (path.startsWith("/admin")) {
    const cookieName = getSessionCookieName();
    const raw = req.cookies.get(cookieName)?.value;
    const session = await readSessionCookie(raw);

    const isLogin = path === "/admin/login" || path.startsWith("/admin/login/");

    // إذا مسجل دخول وفتح صفحة login رجّعه على لوحة المقالات
    if (isLogin && session) {
      url.pathname = "/admin/articles";
      return NextResponse.redirect(url, 307);
    }

    // اسمح لصفحة login فقط إذا مو مسجل دخول
    if (isLogin) {
      return NextResponse.next();
    }

    // باقي صفحات الادمن لازم Session
    if (!session) {
      url.pathname = "/admin/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url, 307);
    }

    return NextResponse.next();
  }

  // 2) Canonical: شيل trailing slash (بدون سلاش بالنهاية)
  if (path.length > 1 && path.endsWith("/")) {
    url.pathname = path.replace(/\/+$/, "");
    return NextResponse.redirect(url, 308);
  }

  // 3) Redirect إنكليزي -> عربي (canonical)
  for (const { ar, en } of MAP) {
    const toArabic = swapPrefix(path, en, ar);
    if (toArabic) {
      url.pathname = toArabic;
      return NextResponse.redirect(url, 308);
    }
  }

  // 4) Rewrite عربي -> إنكليزي (داخلي، يخفي الوجهة)
  for (const { ar, en } of MAP) {
    const toEnglish = swapPrefix(path, ar, en);
    if (toEnglish) {
      url.pathname = toEnglish;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};