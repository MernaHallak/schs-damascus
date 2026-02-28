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

  // eslint-disable-next-line no-constant-condition
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
  slug: z.string().optional(),
  excerpt: z.string().min(10, "المقتطف قصير جدًا."),
  contentMarkdown: z.string().min(20, "المحتوى قصير جدًا."),
  // نتحقق يدويًا لأننا نريد دعم:
  // - روابط https
  // - مسارات محلية تبدأ بـ /
  // - data:image/... (عند اللزوم)
  coverImageUrl: z.string().optional().or(z.literal("")),
  coverImageAlt: z.string().max(160, "نص alt طويل جدًا (الحد 160 حرف).").optional().or(z.literal("")),
  isPublished: z.union([z.literal("on"), z.undefined()]),
});

type State = { error?: string };

function isImageMime(mime: string) {
  return ["image/png", "image/jpeg", "image/webp"].includes(mime);
}

function estimateBase64Bytes(dataUrl: string) {
  const idx = dataUrl.indexOf(",");
  if (idx === -1) return 0;
  const b64 = dataUrl.slice(idx + 1).trim();
  // base64 bytes ≈ len * 3/4 - padding
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - padding;
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

function isProbablyGoogleSearch(url: string) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (!host.includes("google.")) return false;
    // روابط بحث Google ليست صور مباشرة
    if (u.pathname.startsWith("/search")) return true;
    return false;
  } catch {
    return false;
  }
}

function normalizeCoverUrl(raw: string): {
  coverImageUrl: string | null;
  coverImageBase64FromUrl: string | null;
  error?: string;
} {
  const v = (raw || "").trim();
  if (!v) return { coverImageUrl: null, coverImageBase64FromUrl: null };

  // data:image/... → نعامله كـ Base64 (أفضل من محاولة next/image)
  if (/^data:image\//i.test(v)) {
    const maxInlineBytes = 400 * 1024;
    if (estimateBase64Bytes(v) > maxInlineBytes) {
      return {
        coverImageUrl: null,
        coverImageBase64FromUrl: null,
        error:
          "Base64 المكتوب داخل الحقل كبير جدًا. استخدم رفع ملف من الحقل التالي وسيتم ضغطه تلقائيًا للأداء، أو استخدم رابط صورة مباشر.",
      };
    }
    return { coverImageUrl: null, coverImageBase64FromUrl: v };
  }

  // مسار محلي داخل public
  if (v.startsWith("/")) {
    return { coverImageUrl: v, coverImageBase64FromUrl: null };
  }

  // روابط خارجية
  if (!/^https?:\/\//i.test(v)) {
    return {
      coverImageUrl: null,
      coverImageBase64FromUrl: null,
      error:
        "رابط الغلاف غير صحيح. لازم يبدأ بـ https:// أو يكون مسار محلي يبدأ بـ / أو يكون data:image/...",
    };
  }

  if (isProbablyGoogleSearch(v)) {
    return {
      coverImageUrl: null,
      coverImageBase64FromUrl: null,
      error:
        "رابط Google Search مو رابط صورة مباشر. افتح الصورة نفسها (Open image in new tab) وخذ رابط ينتهي عادةً بـ .jpg/.png أو استخدم رفع ملف من الحقل تحت.",
    };
  }

  return { coverImageUrl: v, coverImageBase64FromUrl: null };
}

export async function createArticleAction(_: State, formData: FormData) {
  await ensureAdmin();

  const parsed = baseSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    contentMarkdown: formData.get("contentMarkdown"),
    coverImageUrl: formData.get("coverImageUrl"),
    coverImageAlt: formData.get("coverImageAlt"),
    isPublished: formData.get("isPublished") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "بيانات غير صحيحة." };
  }

  const title = parsed.data.title.trim();
  const coverImageAlt = String(parsed.data.coverImageAlt || "").trim() || null;
  const rawSlug = String(parsed.data.slug || "").trim();
  let slug = slugify(rawSlug || title);
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
        "لا تحط Base64 داخل محتوى المقال. إذا بدك صورة: استخدم صورة الغلاف (رفع ملف/URL) أو استخدم رابط صورة مباشر داخل Markdown.",
    };
  }

  if (!slug)
    return {
      error: "تعذر توليد slug من العنوان. عدّل العنوان أو اكتب slug يدويًا.",
    };

  slug = await ensureUniqueSlug(slug);

  let coverImageBase64: string | null = null;
  let coverImageUrl: string | null = null;

  // 1) إذا كان في رابط مكتوب
  const normalized = normalizeCoverUrl(String(parsed.data.coverImageUrl || ""));
  if (normalized.error) return { error: normalized.error };
  coverImageUrl = normalized.coverImageUrl;
  coverImageBase64 = normalized.coverImageBase64FromUrl;

  // 2) إذا تم رفع ملف → يتغلب على الرابط
  const coverFile = formData.get("coverFile");
  if (coverFile && coverFile instanceof File && coverFile.size > 0) {
    if (!isImageMime(coverFile.type)) {
      return { error: "صيغة صورة الغلاف غير مدعومة (PNG/JPEG/WEBP فقط)." };
    }

    const maxUploadBytes = 8 * 1024 * 1024;
    if (coverFile.size > maxUploadBytes) {
      return { error: "حجم ملف الغلاف كبير جدًا. الحد الأعلى 8MB." };
    }

    const optimized = await fileToOptimizedDataUrl(coverFile);
    if (optimized.error || !optimized.dataUrl) {
      return { error: optimized.error || "فشل حفظ صورة الغلاف." };
    }

    coverImageBase64 = optimized.dataUrl;
    coverImageUrl = null;
  }

  const now = new Date();
  const publishedAt = isPublished ? now : null;

  await prisma.article.create({
    data: {
      title,
      slug,
      excerpt,
      contentMarkdown,
      coverImageUrl,
      coverImageBase64,
      isPublished,
      publishedAt,
      coverImageAlt,
    },
  });

  // حتى لو الصفحات صارت ISR لاحقًا
  revalidatePath("/articles");
  revalidatePath(`/articles/${slug}`);
  revalidatePath("/sitemap.xml");

  redirect("/admin/articles?msg=created");
}

export async function updateArticleAction(_: State, formData: FormData) {
  await ensureAdmin();

  const id = String(formData.get("id") || "").trim();
  if (!id) return { error: "المعرّف غير صحيح." };

  const parsed = baseSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    contentMarkdown: formData.get("contentMarkdown"),
    coverImageUrl: formData.get("coverImageUrl"),
    coverImageAlt: formData.get("coverImageAlt"),
    isPublished: formData.get("isPublished") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "بيانات غير صحيحة." };
  }

  const title = parsed.data.title.trim();
  const coverImageAlt = String(parsed.data.coverImageAlt || "").trim() || null;
  const rawSlug = String(parsed.data.slug || "").trim();
  let slug = slugify(rawSlug || title);
  const excerpt = String(parsed.data.excerpt ?? "");
const contentMarkdown = String(parsed.data.contentMarkdown ?? "");
  const rawCoverUrl = String(parsed.data.coverImageUrl || "");
  const isPublished = parsed.data.isPublished === "on";

  // أهم سبب للـ horizontal scroll: إدخال Base64 داخل المحتوى نفسه.
  if (
    /^data:image\//im.test(contentMarkdown) ||
    contentMarkdown.includes("data:image/")
  ) {
    return {
      error:
        "لا تحط Base64 داخل محتوى المقال. إذا بدك صورة: استخدم صورة الغلاف (رفع ملف/URL) أو استخدم رابط صورة مباشر داخل Markdown.",
    };
  }

  if (!slug)
    return {
      error: "تعذر توليد slug من العنوان. عدّل العنوان أو اكتب slug يدويًا.",
    };

  slug = await ensureUniqueSlug(slug, id);

  // ✅ الغلاف: نحافظ على Base64 القديم إلا إذا المستخدم بدّل (URL/Upload)
  const normalized = normalizeCoverUrl(rawCoverUrl);
  if (normalized.error) return { error: normalized.error };

  let coverImageUrl: string | null = normalized.coverImageUrl;
  let coverImageBase64: string | null | undefined = undefined;

  // user typed data:image/... داخل حقل الرابط
  if (normalized.coverImageBase64FromUrl) {
    coverImageBase64 = normalized.coverImageBase64FromUrl;
    coverImageUrl = null;
  } else if (coverImageUrl) {
    // إذا صار عندنا URL → نمسح أي Base64 قديم (حتى ما نخزن نسختين)
    coverImageBase64 = null;
  }

  // رفع ملف يتغلب على كل شيء
  const coverFile = formData.get("coverFile");
  if (coverFile && coverFile instanceof File && coverFile.size > 0) {
    if (!isImageMime(coverFile.type)) {
      return { error: "صيغة صورة الغلاف غير مدعومة (PNG/JPEG/WEBP فقط)." };
    }

    const maxUploadBytes = 8 * 1024 * 1024;
    if (coverFile.size > maxUploadBytes) {
      return { error: "حجم ملف الغلاف كبير جدًا. الحد الأعلى 8MB." };
    }

    const optimized = await fileToOptimizedDataUrl(coverFile);
    if (optimized.error || !optimized.dataUrl) {
      return { error: optimized.error || "فشل حفظ صورة الغلاف." };
    }

    coverImageBase64 = optimized.dataUrl;
    coverImageUrl = null;
  }

  const prev = await prisma.article.findUnique({
    where: { id },
    select: { isPublished: true, publishedAt: true, slug: true },
  });
  if (!prev) return { error: "المقال غير موجود." };

  const publishedAt = isPublished ? prev.publishedAt || new Date() : null;

  await prisma.article.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      contentMarkdown,
      coverImageUrl,
      ...(coverImageBase64 !== undefined ? { coverImageBase64 } : {}),
      isPublished,
      publishedAt,
      coverImageAlt,
    },
  });

  revalidatePath("/articles");
  // إذا تغيّر الـ slug نحدّث القديم والجديد
  revalidatePath(`/articles/${prev.slug}`);
  revalidatePath(`/articles/${slug}`);
  revalidatePath("/sitemap.xml");

  redirect("/admin/articles?msg=updated");
}

export async function deleteArticleAction(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("id") || "").trim();
  if (!id) redirect("/admin/articles?msg=error");

  try {
    const prev = await prisma.article.findUnique({
      where: { id },
      select: { slug: true },
    });
    await prisma.article.delete({ where: { id } });

    revalidatePath("/articles");
    if (prev?.slug) revalidatePath(`/articles/${prev.slug}`);
    revalidatePath("/sitemap.xml");

    redirect("/admin/articles?msg=deleted");
  } catch {
    redirect("/admin/articles?msg=error");
  }
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

  try {
    const prev = await prisma.article.findUnique({
      where: { id },
      select: { slug: true },
    });
    await prisma.article.update({
      where: { id },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    revalidatePath("/articles");
    if (prev?.slug) revalidatePath(`/articles/${prev.slug}`);
    revalidatePath("/sitemap.xml");

    redirect(`/admin/articles?msg=${isPublished ? "published" : "draft"}`);
  } catch {
    redirect("/admin/articles?msg=error");
  }
}
