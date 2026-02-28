export default function StatusBadge({ isPublished }: { isPublished: boolean }) {
  return isPublished ? (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
      منشور
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
      مسودة
    </span>
  );
}
