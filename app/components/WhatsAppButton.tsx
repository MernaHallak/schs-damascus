import { content } from "../lib/content";

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-white">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12c0 1.9.53 3.74 1.53 5.34L2 22l4.81-1.47A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2c-1.58 0-3.13-.41-4.5-1.18l-.32-.19-2.85.87.9-2.78-.21-.36A8.2 8.2 0 1 1 12 20.2zm4.77-5.52c-.26-.13-1.52-.75-1.76-.84-.24-.09-.41-.13-.58.13-.17.26-.66.84-.81 1.01-.15.17-.31.19-.57.06-.26-.13-1.1-.41-2.1-1.3-.78-.7-1.31-1.56-1.46-1.82-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.46.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.8-1.92-.21-.5-.42-.43-.58-.44h-.5c-.17 0-.45.06-.69.32-.24.26-.9.88-.9 2.16 0 1.28.92 2.51 1.05 2.69.13.17 1.81 2.77 4.38 3.88.61.26 1.08.42 1.45.54.61.19 1.16.16 1.6.1.49-.07 1.52-.62 1.74-1.21.21-.59.21-1.1.15-1.21-.06-.11-.22-.17-.48-.3z"
      />
    </svg>
  );
}



export default function WhatsAppButton() {
  return (
    <a
      href={content.site.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="محادثة واتساب"
      title="محادثة واتساب"
      className="fixed bottom-5 left-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
    >
      <WhatsAppMark />
    </a>
  );
}
