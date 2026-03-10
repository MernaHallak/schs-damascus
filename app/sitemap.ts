import type { MetadataRoute } from "next";
import { prisma } from "./lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://schs-damascus.vercel.app/";

  const base: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/الخدمات`, lastModified: new Date() },
    { url: `${siteUrl}/الفحوصات`, lastModified: new Date() },
    { url: `${siteUrl}/اتصل-بنا`, lastModified: new Date() },
    { url: `${siteUrl}/المقالات`, lastModified: new Date() },
  ];

  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    const articleUrls = articles.map((a) => ({
      url: `${siteUrl}/المقالات/${encodeURIComponent(a.slug)}`,
      lastModified: a.updatedAt || a.publishedAt || new Date(),
    }));

    return [...base, ...articleUrls];
  } catch {
    // If DB isn't ready yet, return static routes.
    return base;
  }
}
