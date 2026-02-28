"use server";

import { redirect } from "next/navigation";
import { verifyAdminCredentials } from "../lib/auth/password";
import { clearSession, setSession } from "../lib/auth/session-server";


export async function loginAction(_: { error?: string }, formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "الرجاء إدخال اسم المستخدم وكلمة المرور." };
  }

  const ok = await verifyAdminCredentials(username, password);
  if (!ok) {
    return { error: "بيانات الدخول غير صحيحة." };
  }

  await setSession(username);
  redirect("/admin/articles");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}
