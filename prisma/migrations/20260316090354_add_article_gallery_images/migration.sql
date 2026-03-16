-- CreateTable
CREATE TABLE "ArticleGalleryImage" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "imageBase64" TEXT NOT NULL,
    "imageAlt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleGalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ArticleGalleryImage_articleId_sortOrder_idx" ON "ArticleGalleryImage"("articleId", "sortOrder");

-- AddForeignKey
ALTER TABLE "ArticleGalleryImage" ADD CONSTRAINT "ArticleGalleryImage_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
