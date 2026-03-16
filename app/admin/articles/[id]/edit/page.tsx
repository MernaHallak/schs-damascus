import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import ArticleForm from "../../_components/ArticleForm";
import { updateArticleAction } from "../../actions";

export const metadata: Metadata = {
  title: "تعديل مقال",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
  where: { id },
  include: {
    galleryImages: {
      orderBy: { sortOrder: "asc" },
      select: {
        imageBase64: true,
        imageAlt: true,
        sortOrder: true,
      },
    },
  },
});
  if (!article) notFound();

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
     <ArticleForm
  action={updateArticleAction}
  submitLabel="حفظ التغييرات"
  initial={{
    id: article.id,
    title: article.title,
    author: article.author,
    excerpt: article.excerpt,
    contentMarkdown: article.contentMarkdown,
    isPublished: article.isPublished,
    coverImageBase64: article.coverImageBase64 ?? "",
    coverImageAlt: article.coverImageAlt ?? "",
    galleryImages: article.galleryImages,
  }}
/>
    </div>
  );
}
