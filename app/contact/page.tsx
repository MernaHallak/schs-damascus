import type { Metadata } from "next";
import Reveal from "../components/Reveal";
import { content } from "../lib/content";

export const metadata: Metadata = {
  title: "اتصل بنا",
  alternates: { canonical: "/اتصل-بنا/" },
};

export default function ContactPage() {
  const { site } = content;

  return (
 
        <div className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          <Reveal>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              اتصل بنا
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
              احجز موعدك أو اسأل عن أي خدمة. الأفضل للتواصل السريع: واتساب.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                  معلومات التواصل
                </h2>

                <div className="mt-4 grid gap-3 text-sm text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900">الهاتف:</span>{" "}
                    <a className="underline underline-offset-4" href={`tel:${site.phone}`}>
                      {site.phone}
                    </a>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">واتساب:</span>{" "}
                    <a
                      className="underline underline-offset-4"
                      href={site.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {site.whatsapp}
                    </a>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">العنوان:</span>{" "}
                    {site.addressText || `${site.city} - ${site.country}`}
                  </div>
                  {site.hoursText ? (
                    <div>
                      <span className="font-bold text-slate-900">ساعات العمل:</span>{" "}
                      {site.hoursText}
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={site.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    تواصل واتساب
                  </a>
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-2xl border border-neutral-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-neutral-50"
                  >
                    فتح الخريطة
                  </a>
                  <a
                    href={site.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-2xl border border-neutral-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-neutral-50"
                  >
                    صفحة فيسبوك
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
                <iframe
                  title="خريطة العيادة"
                  src="https://www.google.com/maps?q=Damascus%20Syria&output=embed"
                  className="h-[420px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>
        </div>
  
  );
}
