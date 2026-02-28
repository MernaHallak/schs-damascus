# SCHS — موقع العيادة (Next.js 15 + TypeScript)

مشروع موقع عيادة سمع ونطق مبني باستخدام **Next.js (App Router)** مع واجهة عربية (RTL) وتصميم حديث، ويحتوي على:

* صفحات الموقع العامة
* قسم **المقالات**
* لوحة إدارة مخفية للطبيب لإدارة المقالات
* تخزين المقالات عبر **Prisma + PostgreSQL (Neon)**

---

## 1) التشغيل محليًا (PostgreSQL / Neon)

### 1. تثبيت الحزم

```bash
npm install
```

### 2. إعداد متغيرات البيئة (`.env.local`)

أنشئ ملف `.env.local` في جذر المشروع، وضع القيم التالية:

```env
DATABASE_URL=postgresql://USER:PASSWORD@YOUR-NEON-POOLER-HOST/DB_NAME?sslmode=require
DIRECT_URL=postgresql://USER:PASSWORD@YOUR-NEON-DIRECT-HOST/DB_NAME?sslmode=require

ADMIN_USER=doctor1
ADMIN_PASS_HASH=ضع_الهاش_هنا
SESSION_SECRET=غيّر_هذه_القيمة_إلى_قيمة_قوية

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. إنشاء الجداول في قاعدة البيانات

```bash
npm run prisma:migrate -- --name init_postgres
```

> إذا كانت القاعدة موجودة مسبقًا وتريد فقط مزامنة السكيمة أثناء التطوير:

```bash
npx prisma db push
```

### 4. تشغيل المشروع

```bash
npm run dev
```

ثم افتح:

* `http://localhost:3000`

---

## 2) الروابط (SEO Friendly)

> الملفات داخل المشروع إنكليزية، لكن الروابط الظاهرة للمستخدم عربية (مع `rewrite` / `redirect` حسب الإعداد الحالي).

* الصفحة الرئيسية: `/`
* الخدمات: `/الخدمات/`
* الفحوصات: `/الفحوصات/`
* اتصل بنا: `/اتصل-بنا/`
* المقالات: `/المقالات/`
* مقال مفرد: `/المقالات/[slug]/`

---

## 3) لوحة الطبيب (مخفية)

* تسجيل الدخول: `/admin/login/`
* إدارة المقالات: `/admin/articles/`

### ملاحظات الأمان

* حماية مسارات `/admin/*` عبر `middleware`
* الاعتماد على Cookie من نوع `httpOnly`
* المتغيرات المطلوبة:

  * `ADMIN_USER`
  * `ADMIN_PASS_HASH`
  * `SESSION_SECRET`

### تغيير كلمة المرور (توليد Hash جديد)

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('NEW_PASS',12).then(console.log)"
```

ضع الناتج داخل `ADMIN_PASS_HASH`.

---

## 4) التخزين (Prisma + PostgreSQL)

المشروع يعتمد الآن على **PostgreSQL فقط** (مثل Neon) عبر Prisma.

### أوامر Prisma المهمة

```bash
npx prisma generate
npx prisma migrate dev --name init_postgres
npx prisma studio
```

### للإنتاج (Production)

```bash
npx prisma migrate deploy
```

> **مهم:** لا يوجد الآن دعم تبديل تلقائي بين `SQLite` و `PostgreSQL`. السكيمة المعتمدة ثابتة في:

* `prisma/schema.prisma`

---

## 5) الصور في المقالات

* الأفضل استخدام `coverImageUrl` بمسار داخلي من `public` مثل:

  * `/assets/articles/cover.jpg`
* خيار `Base64` مدعوم، لكن يفضّل أن يبقى **≤ 100KB** حتى لا تصبح صفحة المقالات ثقيلة.
* إذا كانت الصورة كبيرة، استخدم `URL` بدل `Base64`.

---

## 6) أين يوجد المحتوى؟

* المحتوى الثابت الأساسي: `data/content.json`
* المقالات (الديناميكية): قاعدة البيانات عبر Prisma (`Article`)

---

## 7) بنية مهمّة في المشروع

* `app/*` — الصفحات والمكونات (App Router)
* `prisma/*` — Prisma schema والمايغريشن
* `middleware.ts` — حماية لوحة التحكم
* `data/content.json` — المحتوى الثابت
* `public/assets/*` — الصور والملفات الثابتة

---

## 8) النشر على Vercel

### متغيرات البيئة المطلوبة على Vercel

* `DATABASE_URL`
* `DIRECT_URL`
* `ADMIN_USER`
* `ADMIN_PASS_HASH`
* `SESSION_SECRET`
* `NEXT_PUBLIC_SITE_URL` (رابط الموقع الفعلي)

### ملاحظات مهمة

* تأكد أن `prisma/schema.prisma` يستخدم:

  * `provider = "postgresql"`
* تأكد من تشغيل `prisma generate` أثناء البناء
* طبّق المايغريشن في الإنتاج:

```bash
npx prisma migrate deploy
```

---

## 9) ملاحظات تطوير مهمة

* المشروع كان يدعم `SQLite` سابقًا، لكنه الآن مضبوط على **PostgreSQL فقط**.
* تم حذف/إلغاء سكربت تبديل السكيمة التلقائي لتجنّب الرجوع غير المقصود إلى `SQLite`.
* إذا ظهر خطأ اتصال مع Neon (`P1001` أو `Can't reach database server`) فالمشكلة غالبًا تكون:

  * الشبكة
  * VPN
  * DNS
  * Firewall
    وليست من كود المشروع نفسه.
