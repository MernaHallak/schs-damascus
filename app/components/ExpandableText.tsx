"use client";

import { useEffect, useState } from "react";

type ExpandableTextProps = {
  text: string;
  lines?: number;
  anchorId?: string;
};

export default function ExpandableText({
  text,
  lines = 6,
  anchorId,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!anchorId || typeof window === "undefined") return;

    const syncWithHash = () => {
      const currentHash = decodeURIComponent(
        window.location.hash.replace(/^#/, "")
      );

      if (currentHash === anchorId) {
        setExpanded(true);
      }
    };

    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);

    return () => {
      window.removeEventListener("hashchange", syncWithHash);
    };
  }, [anchorId]);

  return (
    <div className="mt-3">
      <p
        className="whitespace-pre-line text-sm leading-8 text-slate-600 sm:text-base"
        style={
          expanded
            ? undefined
            : {
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
        }
      >
        {text}
      </p>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 cursor-pointer text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
      >
        {expanded ? "عرض أقل" : "عرض المزيد"}
      </button>
    </div>
  );
}