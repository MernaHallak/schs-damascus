import Image from "next/image";
import Link from "next/link";
import { Facebook, MapPin } from "lucide-react";
import { content } from "../lib/content";
import FooterMobileSections from "./FooterMobileSections";

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200/40 bg-emerald-500/90 text-black shadow-sm transition hover:bg-emerald-600"
    >
      {children}
    </a>
  );
}

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12c0 1.9.53 3.74 1.53 5.34L2 22l4.81-1.47A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2c-1.58 0-3.13-.41-4.5-1.18l-.32-.19-2.85.87.9-2.78-.21-.36A8.2 8.2 0 1 1 12 20.2zm4.77-5.52c-.26-.13-1.52-.75-1.76-.84-.24-.09-.41-.13-.58.13-.17.26-.66.84-.81 1.01-.15.17-.31.19-.57.06-.26-.13-1.1-.41-2.1-1.3-.78-.7-1.31-1.56-1.46-1.82-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.46.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.8-1.92-.21-.5-.42-.43-.58-.44h-.5c-.17 0-.45.06-.69.32-.24.26-.9.88-.9 2.16 0 1.28.92 2.51 1.05 2.69.13.17 1.81 2.77 4.38 3.88.61.26 1.08.42 1.45.54.61.19 1.16.16 1.6.1.49-.07 1.52-.62 1.74-1.21.21-.59.21-1.1.15-1.21-.06-.11-.22-.17-.48-.3z"
      />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const s = content.site;

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/الخدمات", label: "الخدمات" },
    { href: "/الفحوصات", label: "الفحوصات" },
    { href: "/المقالات", label: "المقالات" },
    { href: "/اتصل-بنا", label: "اتصل بنا" },
  ];

  return (
    <footer className="border-t border-emerald-200/25 bg-emerald-900 text-emerald-50">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* ===== Mobile sections (Client only) ===== */}
        <div className="lg:hidden">
          {/* Brand block stays Server-rendered */}
          <div className="rounded-2xl border border-emerald-200/15 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/branding/clinic_logo.png"
                alt={s.name}
                width={112}
                height={44}
                className="h-11 w-auto rounded-xl bg-white/95 p-2 object-contain"
              />
              <div className="leading-tight min-w-0">
                <div className="truncate text-sm font-extrabold tracking-tight text-white">
                  {s.name}
                </div>
                <div className="text-xs text-emerald-100/80">
                  {s.city} • {s.country}
                </div>
              </div>
            </div>

            <address className="mt-3 not-italic text-xs leading-6 text-emerald-100/90">
              <div className="break-words">
                {s.city} • {s.country}
                {s.addressText ? ` • ${s.addressText}` : ""}
              </div>
              {s.hoursText ? <div>ساعات العمل: {s.hoursText}</div> : null}
              {s.whatsapp ? (
                <div>
                  واتساب:{" "}
                  <a
                    href={s.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
                  >
                    {s.whatsapp}
                  </a>
                </div>
              ) : null}
            </address>

            <div className="mt-3 flex items-center gap-2">
              <IconLink href={s.mapsUrl} label="فتح موقع العيادة على الخريطة">
                <MapPin className="h-5 w-5" />
              </IconLink>
              <IconLink href={s.facebookUrl} label="صفحة العيادة على فيسبوك">
                <Facebook className="h-5 w-5" />
              </IconLink>
              <IconLink href={s.whatsappUrl} label="محادثة واتساب">
                <WhatsAppMark />
              </IconLink>
            </div>
          </div>

          {/* Client-only collapsible sections */}
          <div className="mt-4">
            <FooterMobileSections links={links} />
          </div>
        </div>

        {/* ===== Desktop (pure Server) ===== */}
        <div className="hidden gap-10 lg:grid lg:grid-cols-3">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/branding/clinic_logo.png"
                alt={s.name}
                width={120}
                height={48}
                className="h-12 w-auto rounded-xl bg-white/95 p-2 object-contain"
              />
              <div className="leading-tight">
                <div className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                  {s.name}
                </div>
                <div className="text-xs text-emerald-100/80">
                  {s.city} • {s.country}
                </div>
              </div>
            </div>

            <address className="mt-4 not-italic text-sm leading-7 text-emerald-100/90">
              <div>
                {s.city} • {s.country}
                {s.addressText ? ` • ${s.addressText}` : ""}
              </div>
              {s.hoursText ? <div>ساعات العمل: {s.hoursText}</div> : null}
              {s.whatsapp ? (
                <div>
                  واتساب:{" "}
                  <a
                    href={s.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
                  >
                    {s.whatsapp}
                  </a>
                </div>
              ) : null}
            </address>

            <div className="mt-4 flex items-center gap-2">
              <IconLink href={s.mapsUrl} label="فتح موقع العيادة على الخريطة">
                <MapPin className="h-5 w-5" />
              </IconLink>
              <IconLink href={s.facebookUrl} label="صفحة العيادة على فيسبوك">
                <Facebook className="h-5 w-5" />
              </IconLink>
              <IconLink href={s.whatsappUrl} label="محادثة واتساب">
                <WhatsAppMark />
              </IconLink>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-white">روابط</div>
            <nav className="mt-3 grid gap-2 text-sm" aria-label="روابط سريعة">
              {links.map((l) => (
                <Link key={l.href} className="hover:underline underline-offset-4" href={l.href}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="rounded-3xl border border-emerald-200/20 bg-white/5 p-6">
            <div className="text-sm font-bold text-white">لماذا نحن؟</div>
            <ul className="mt-3 list-disc pr-5 text-sm leading-7 text-emerald-100/90">
              <li>فحوص دقيقة وتقنيات حديثة.</li>
              <li>خطط علاج واضحة ومتابعة مستمرة.</li>
              <li>خدمات سمع ونطق للأطفال والبالغين.</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 sm:mt-8 flex flex-col gap-2 border-t border-emerald-200/15 pt-5 text-[11px] leading-5 text-emerald-100/80 sm:flex-row sm:items-center sm:justify-between">
          <div className="break-words">
            © {year} {s.name}. جميع الحقوق محفوظة.
          </div>
          <div className="break-words">
            موقع رسمي — معلومات للتوعية وليست بديلاً عن الاستشارة الطبية.
          </div>
        </div>
      </div>
    </footer>
  );
}
