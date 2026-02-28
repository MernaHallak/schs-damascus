"use client";

import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export default function ClickableRow({ href, className = "", children }: Props) {
  const router = useRouter();

  const go = () => router.push(href);

  return (
    <tr
      role="link"
      tabIndex={0}
      className={`cursor-pointer hover:bg-neutral-50 ${className}`}
      onClick={(e) => {
        const target = e.target as HTMLElement;

        // لا تنتقل للتعديل إذا ضغط على عنصر تفاعلي (زر/رابط/حقول…)
        if (target.closest("a,button,input,select,textarea,label,[role='button']")) return;

        go();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      }}
    >
      {children}
    </tr>
  );
}