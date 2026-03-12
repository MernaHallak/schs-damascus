import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import { content } from "./lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://schs-sy.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${content.site.name} - ${content.site.city}`,
    template: `%s | ${content.site.name}`,
  },
  description:
    "خدمات سمع ونطق متخصصة في دمشق. فحوص دقيقة، حلول سماعات حديثة، وجلسات لغة ونطق.",
  alternates: { canonical: "/" },
  icons: {
    icon: "/assets/branding/logo_icon.png",
  },
  openGraph: {
    type: "website",
    locale: "ar_SY",
    url: siteUrl,
    siteName: content.site.name,
    title: `${content.site.name} - ${content.site.city}`,
    description:
      "خدمات سمع ونطق متخصصة في دمشق. فحوص دقيقة، حلول سماعات حديثة، وجلسات لغة ونطق.",
    images: [
      {
        url: "/assets/branding/clinic_logo.png",
        width: 1200,
        height: 630,
        alt: content.site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${content.site.name} - ${content.site.city}`,
    description:
      "خدمات سمع ونطق متخصصة في دمشق. فحوص دقيقة، حلول سماعات حديثة، وجلسات لغة ونطق.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
        <Navbar />
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-50" />
          <main className="relative z-10 h-full">{children}</main>
        </div>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
