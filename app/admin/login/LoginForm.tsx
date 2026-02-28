"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

type State = { error?: string };

export default function LoginForm() {
  const [state, action, pending] = useActionState<State, FormData>(loginAction, {});

  return (
    <form action={action} className="grid gap-4">
      <div>
        <label className="block text-sm font-bold text-slate-900">اسم المستخدم</label>
        <input
          name="username"
          autoComplete="username"
          className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-900">كلمة المرور</label>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
          required
        />
      </div>

      {state?.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "جارٍ التحقق..." : "دخول"}
      </button>
    </form>
  );
}
