"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import sharp from "sharp";
import { prisma } from "../../lib/prisma";
import {
  getSessionCookieName,
  readSessionCookie,
} from "../../lib/auth/session";
import { slugify } from "../../lib/slug";

async function ensureAdmin() {
  const store = await cookies();
  const token = store.get(getSessionCookieName())?.value;
  const payload = await readSessionCookie(token);
  if (!payload) redirect("/admin/login");
  return payload;
}

async function ensureUniqueSlug(base: string, excludeId?: string) {
  let attempt = base;
  let i = 2;

  while (true) {
    const existing = await prisma.article.findFirst({
      where: {
        slug: attempt,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) return attempt;

    attempt = `${base}-${i++}`;
  }
}

const baseSchema = z.object({
  title: z.string().min(3, "العنوان قصير جدًا."),
  excerpt: z.string().min(10, "المقتطف قصير جدًا."),
  contentMarkdown: z.string().min(20, "المحتوى قصير جدًا."),

  coverImageAlt: z
    .string()
    .trim()
    .min(3, "نص alt مطلوب.")
    .max(160, "نص alt طويل جدًا (الحد 160 حرف)."),
  isPublished: z.union([z.literal("on"), z.undefined()]),
});

// type State = { error?: string };

type FormValues = {
  title: string;
  excerpt: string;
  contentMarkdown: string;
  coverImageAlt: string;
  isPublished: boolean;
};

type State = {
  error?: string;
  values?: FormValues;
};

function isImageMime(mime: string) {
  return ["image/png", "image/jpeg", "image/webp"].includes(mime);
}


async function fileToOptimizedDataUrl(
  file: File,
): Promise<{ dataUrl?: string; error?: string }> {
  try {
    const input = Buffer.from(await file.arrayBuffer());

    // نحدّد حجم الخرج المستهدف (لتجنب HTML ثقيل + أداء سيء)
    const maxOutputBytes = 400 * 1024;

    // 1) Resize (بدون تكبير)
    const base = sharp(input, { failOn: "none" });

    // نحاول أولًا بعرض 1600px ثم نقلل إذا لزم
    const widths = [1600, 1200, 1000, 800];
    const qualities = [80, 72, 65, 58, 50, 45];

    for (const w of widths) {
      const resized = base
        .clone()
        .resize({ width: w, withoutEnlargement: true });
      for (const q of qualities) {
        const out = await resized.webp({ quality: q }).toBuffer();
        if (out.length <= maxOutputBytes) {
          return {
            dataUrl: `data:image/webp;base64,${out.toString("base64")}`,
          };
        }
      }
    }

    return {
      error:
        "الصورة كبيرة جدًا وما قدرنا نضغطها ضمن حد الأداء. جرّب صورة أصغر/أقل دقة أو استخدم رابط صورة مباشر.",
    };
  } catch {
    return {
      error: "فشل تحويل صورة الغلاف. جرّب صورة ثانية بصيغة JPEG/PNG/WEBP.",
    };
  }
}

function getFormValues(formData: FormData): FormValues {
  return {
    title: String(formData.get("title") || ""),
    excerpt: String(formData.get("excerpt") || ""),
    contentMarkdown: String(formData.get("contentMarkdown") || ""),
    coverImageAlt: String(formData.get("coverImageAlt") || ""),
    isPublished: formData.get("isPublished") === "on",
  };
}

export async function createArticleAction(_: State, formData: FormData) {
  await ensureAdmin();
  const values = getFormValues(formData);

  const parsed = baseSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    contentMarkdown: formData.get("contentMarkdown"),
    coverImageAlt: formData.get("coverImageAlt"),
    isPublished: formData.get("isPublished") ?? undefined,
  });

  if (!parsed.success) {
    return {
    error: parsed.error.issues[0]?.message || "بيانات غير صحيحة.",
    values,
  };
  }

  const title = parsed.data.title.trim();
  const coverImageAlt = String(parsed.data.coverImageAlt || "").trim() || null;
  let slug = slugify(title);
  const excerpt = String(parsed.data.excerpt ?? "");
  const contentMarkdown = String(parsed.data.contentMarkdown ?? "");
  const isPublished = parsed.data.isPublished === "on";

  // أهم سبب للـ horizontal scroll: إدخال Base64 داخل المحتوى نفسه.
  if (
    /^data:image\//im.test(contentMarkdown) ||
    contentMarkdown.includes("data:image/")
  ) {
    return {
      error:
        "لصورة الغلاف استخدم رفع ملف من جهازك، وللصور داخل النص استخدم رابط صورة مباشر."
        , values,
    };
  }

  if (!slug) {
    return {
      error: "تعذر توليد الرابط من العنوان. عدّلي العنوان."
      , values,
    };
  }

  slug = await ensureUniqueSlug(slug);

let coverImageBase64: string | null = null;
  // 2) إذا تم رفع ملف → يتغلب على الرابط
  const coverFile = formData.get("coverFile");
  if (coverFile && coverFile instanceof File && coverFile.size > 0) {
    if (!isImageMime(coverFile.type)) {
      return { error: "صيغة صورة الغلاف غير مدعومة (PNG/JPEG/WEBP فقط)."
        , values, };
    }

    const maxUploadBytes = 5 * 1024 * 1024;
    if (coverFile.size > maxUploadBytes) {
      return { error: "حجم ملف الغلاف كبير جدًا. الحد الأعلى 5MB."
        , values, };
    }

    const optimized = await fileToOptimizedDataUrl(coverFile);
    if (optimized.error || !optimized.dataUrl) {
      return { error: optimized.error || "فشل حفظ صورة الغلاف." 
        , values, };
    }

    coverImageBase64 = optimized.dataUrl;
  }

  if (!coverImageBase64) {
  return { error: "صورة الغلاف مطلوبة."
    , values, };
}

  const now = new Date();
  const publishedAt = isPublished ? now : null;

  

  await prisma.article.create({
    data: {
      title,
      slug,
      excerpt,
      contentMarkdown,
      coverImageBase64,
      isPublished,
      publishedAt,
      coverImageAlt,
    },
  });

  // حتى لو الصفحات صارت ISR لاحقًا
  // revalidatePath("/articles");
  // revalidatePath(`/articles/${slug}`);
  // revalidatePath("/sitemap.xml");

  redirect("/admin/articles?msg=created");
}

export async function updateArticleAction(_: State, formData: FormData) {
  await ensureAdmin();

  const id = String(formData.get("id") || "").trim();
  const values = getFormValues(formData);
  if (!id) return { error: "المعرّف غير صحيح."
     ,values,
   };

  const parsed = baseSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    contentMarkdown: formData.get("contentMarkdown"),
    coverImageAlt: formData.get("coverImageAlt"),
    isPublished: formData.get("isPublished") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "بيانات غير صحيحة."
      ,values,
     };
  }

  const title = parsed.data.title.trim();
  const coverImageAlt = String(parsed.data.coverImageAlt || "").trim() || null;
  const desiredSlug = slugify(title);
  const excerpt = String(parsed.data.excerpt ?? "");
  const contentMarkdown = String(parsed.data.contentMarkdown ?? "");
  const isPublished = parsed.data.isPublished === "on";

  if (
    /^data:image\//im.test(contentMarkdown) ||
    contentMarkdown.includes("data:image/")
  ) {
    return {
      error:
        " لصورة الغلاف استخدم رفع ملف من جهازك، وللصور داخل النص استخدم رابط صورة مباشر."
        ,values,
    };
  }

  if (!desiredSlug) {
    return {
      error: "تعذر توليد الرابط من العنوان. عدّلي العنوان."
      ,values,
    };
  }

  let coverImageBase64: string | null | undefined = undefined;

  const coverFile = formData.get("coverFile");
  if (coverFile && coverFile instanceof File && coverFile.size > 0) {
    if (!isImageMime(coverFile.type)) {
      return { error: "صيغة صورة الغلاف غير مدعومة (PNG/JPEG/WEBP فقط)." 
        ,values,
      };
    }

    const maxUploadBytes = 5 * 1024 * 1024;
    if (coverFile.size > maxUploadBytes) {
      return { error: "حجم ملف الغلاف كبير جدًا. الحد الأعلى 5MB."
        ,values,
       };
    }

    const optimized = await fileToOptimizedDataUrl(coverFile);
    if (optimized.error || !optimized.dataUrl) {
      return { error: optimized.error || "فشل حفظ صورة الغلاف."
        ,values,
       };
    }

    coverImageBase64 = optimized.dataUrl;
  }

  const prev = await prisma.article.findUnique({
    where: { id },
    select: {
      isPublished: true,
      publishedAt: true,
      slug: true,
      coverImageBase64: true,
    },
  });

  if (!prev) return { error: "المقال غير موجود."
    ,values,
   };

  if (!coverImageBase64 && !prev.coverImageBase64) {
  return { error: "صورة الغلاف مطلوبة."
    ,values,
   };
}

  const nextSlug = await ensureUniqueSlug(desiredSlug, id);
  const publishedAt = isPublished ? prev.publishedAt || new Date() : null;

  await prisma.$transaction(async (tx) => {
    if (prev.slug !== nextSlug && prev.isPublished) {
      await tx.articleSlugRedirect.deleteMany({
        where: { articleId: id, fromSlug: nextSlug },
      });

      await tx.articleSlugRedirect.upsert({
        where: { fromSlug: prev.slug },
        update: { articleId: id },
        create: { fromSlug: prev.slug, articleId: id },
      });
    }

    await tx.article.update({
      where: { id },
      data: {
        title,
        slug: nextSlug,
        excerpt,
        contentMarkdown,
        ...(coverImageBase64 !== undefined ? { coverImageBase64 } : {}),
        isPublished,
        publishedAt,
        coverImageAlt,
      },
    });
  });

  // revalidatePath("/articles");
  // revalidatePath(`/articles/${prev.slug}`);
  // revalidatePath(`/articles/${nextSlug}`);
  // revalidatePath("/sitemap.xml");

  redirect("/admin/articles?msg=updated");
}

export async function deleteArticleAction(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("id") || "").trim();
  if (!id) redirect("/admin/articles?msg=error");
  let prevSlug: string | null = null;

 try {
  const prev = await prisma.article.findUnique({
    where: { id },
    select: { slug: true },
  });

  prevSlug = prev?.slug ?? null;

  await prisma.article.delete({ where: { id } });
} catch {
  redirect("/admin/articles?msg=error");
}

// revalidatePath("/articles");
// if (prevSlug) revalidatePath(`/articles/${prevSlug}`);
// revalidatePath("/sitemap.xml");

redirect("/admin/articles?msg=deleted");
}

export async function togglePublishAction(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("id") || "").trim();
  if (!id) redirect("/admin/articles?msg=error");

  // يدعم نموذجين:
  // 1) isPublished = 'true' | 'false' (المستخدم حاليًا بصفحة الإدارة)
  // 2) next = 'publish' | 'draft' (بديل/قديم)
  const rawBool = formData.get("isPublished");
  const rawNext = formData.get("next");

  let isPublished: boolean | null = null;

  if (rawBool !== null) {
    const v = String(rawBool).trim().toLowerCase();
    if (v === "true") isPublished = true;
    if (v === "false") isPublished = false;
  }

  if (isPublished === null && rawNext !== null) {
    const v = String(rawNext).trim().toLowerCase();
    if (v === "publish") isPublished = true;
    if (v === "draft") isPublished = false;
  }

  if (isPublished === null) redirect("/admin/articles?msg=error");
  let prevSlug: string | null = null;

  try {
  const prev = await prisma.article.findUnique({
    where: { id },
    select: { slug: true },
  });

  prevSlug = prev?.slug ?? null;

  await prisma.article.update({
    where: { id },
    data: {
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });
} catch {
  redirect("/admin/articles?msg=error");
}

// revalidatePath("/articles");
// if (prevSlug) revalidatePath(`/articles/${prevSlug}`);
// revalidatePath("/sitemap.xml");

redirect(`/admin/articles?msg=${isPublished ? "published" : "draft"}`);
}
