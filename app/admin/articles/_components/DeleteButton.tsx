"use client";

export default function DeleteButton({
  label = "حذف",
  confirmText = "أكيد بدك تحذف؟",
}: {
  label?: string;
  confirmText?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmText)) {
          e.preventDefault();
        }
      }}
      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
    >
      {label}
    </button>
  );
}
