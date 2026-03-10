-- CreateTable
CREATE TABLE "ArticleSlugRedirect" (
    "id" TEXT NOT NULL,
    "fromSlug" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleSlugRedirect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleSlugRedirect_fromSlug_key" ON "ArticleSlugRedirect"("fromSlug");

-- CreateIndex
CREATE INDEX "ArticleSlugRedirect_articleId_idx" ON "ArticleSlugRedirect"("articleId");

-- AddForeignKey
ALTER TABLE "ArticleSlugRedirect" ADD CONSTRAINT "ArticleSlugRedirect_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
