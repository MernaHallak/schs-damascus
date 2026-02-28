import type { Metadata } from "next";
import ArticleForm from "../_components/ArticleForm";
import { createArticleAction } from "../actions";

export const metadata: Metadata = {
  title: "إضافة مقال",
  robots: { index: false, follow: false },
};

export default function NewArticlePage() {
  return <ArticleForm submitLabel="إضافة" action={createArticleAction} initial={{}} />;
}
