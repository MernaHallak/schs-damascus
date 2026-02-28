import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "تسجيل دخول الطبيب",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
      <div className="text-2xl font-black tracking-tight text-slate-900">تسجيل دخول الطبيب</div>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        هذه الصفحة مخفية ومخصصة لإدارة المقالات فقط.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}
