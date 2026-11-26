import { useEffect, useRef, useState } from 'react';
import { Phone, X } from 'lucide-react';
import { useContent } from '../content/ContentProvider';
import { telLink, waLink } from '../lib/whatsapp';
import { WhatsAppIcon } from './Icons';

/**
 * الأزرار العائمة أسفل الصفحة:
 *  - زر واتساب (دائمًا): يفتح قائمة صغيرة لاختيار أحد الأرقام.
 *  - زر اتصال مباشر tel: (على الجوال فقط).
 */
export function FloatingActions() {
  const c = useContent();
  const { phones, floating } = c;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند الضغط خارجها أو على Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="fixed end-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:end-6 sm:bottom-6"
    >
      {/* قائمة اختيار الرقم */}
      {open && (
        <div
          id="whatsapp-menu"
          className="pop-in w-64 rounded-3xl border border-cream-300 bg-cream-50 p-3 text-ink shadow-[0_24px_60px_-20px_rgb(28_34_18/0.55)]"
        >
          <p className="px-2 pt-1 pb-2 font-display text-lg font-bold text-olive-900">
            {floating.menuTitle}
          </p>
          <ul className="space-y-1.5">
            {phones.map((p, i) => (
              <li key={i}>
                <a
                  href={waLink(p.intl, c.messages.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex min-h-13 items-center gap-3 rounded-2xl px-3 py-2 transition-colors hover:bg-cream-200"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#16a34a] text-white">
                    <WhatsAppIcon className="size-4.5" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm text-ink/60">{p.label}</span>
                    <span dir="ltr" className="block text-lg font-bold text-olive-900">
                      {p.local}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* زر الاتصال المباشر — الجوال فقط */}
      <a
        href={telLink(phones[0].intl)}
        aria-label={`اتصال مباشر بالرقم ${phones[0].local}`}
        className="grid size-14 place-items-center rounded-full bg-olive-800 text-gold-300 shadow-[0_14px_30px_-12px_rgb(28_34_18/0.8)] ring-1 ring-gold-400/50 transition-transform active:scale-95 md:hidden"
      >
        <Phone className="size-6" />
      </a>

      {/* زر واتساب العائم */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="whatsapp-menu"
        aria-label={open ? 'إغلاق قائمة واتساب' : 'تواصل معنا عبر واتساب'}
        className="flex h-14 min-w-14 items-center justify-center gap-2.5 rounded-full bg-[#16a34a] px-4 font-bold text-white shadow-[0_14px_30px_-10px_rgb(22_163_74/0.75)] transition hover:bg-[#15803d] active:scale-95 md:px-6"
      >
        {open ? <X className="size-6" /> : <WhatsAppIcon className="size-7" />}
        {floating.label && <span className="hidden md:inline">{floating.label}</span>}
      </button>
    </div>
  );
}
