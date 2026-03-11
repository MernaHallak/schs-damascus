"use client";

import { useState } from "react";

type ExpandableTextProps = {
  text: string;
  lines?: number;
};

export default function ExpandableText({
  text,
  lines = 6,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-3">
      <p
        className="text-sm sm:text-base leading-8 text-slate-600 whitespace-pre-line"
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
        className="mt-3 text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
      >
        {expanded ? "عرض أقل" : "عرض المزيد"}
      </button>
    </div>
  );
}