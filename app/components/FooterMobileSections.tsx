import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type LinkItem = { href: string; label: string };

function MobileSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      className="group rounded-2xl border border-emerald-200/15 bg-white/5"
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden [&::marker]:hidden">
        <span className="text-sm font-bold text-white">{title}</span>
        <ChevronDown className="h-4 w-4 text-emerald-100/80 transition group-open:rotate-180" />
      </summary>

      <div className="px-4 pb-4">{children}</div>
    </details>
  );
}

export default function FooterMobileSections({ links }: { links: LinkItem[] }) {
  return (
    <div className="grid gap-4 lg:hidden">
      {/* مطوية افتراضيًا لكن الروابط موجودة في HTML دائمًا */}
      <MobileSection title="روابط" defaultOpen={false}>
        <nav className="grid gap-2 text-sm" aria-label="روابط سريعة">
          {links.map((l) => (
            <Link
              key={l.href}
              className="rounded-xl px-2 py-2 hover:bg-white/5"
              href={l.href}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </MobileSection>

      <MobileSection title="لماذا نحن؟" defaultOpen={false}>
        <ul className="list-disc pr-5 text-sm leading-7 text-emerald-100/90">
          <li>فحوص دقيقة وتقنيات حديثة.</li>
          <li>خطط علاج واضحة ومتابعة مستمرة.</li>
          <li>خدمات سمع ونطق للأطفال والبالغين.</li>
        </ul>
      </MobileSection>
    </div>
  );
}