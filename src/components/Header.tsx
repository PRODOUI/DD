import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { useContent } from '../content/ContentProvider';
import { isLinkVisible } from '../content/utils';
import { telLink, waLink } from '../lib/whatsapp';
import { cn } from '../utils/cn';
import { LogoMark, WhatsAppIcon } from './Icons';

export function Header() {
  const c = useContent();
  const phone = c.phones[0];
  const links = c.nav.links.filter((link) => isLinkVisible(c, link.href));

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // الهيدر شفاف فوق صورة الواجهة ويصير بخلفية بيج بعد التمرير
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // قائمة الجوال: إغلاق بزر Escape ومنع تمرير الصفحة خلفها
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-300',
        solid
          ? 'bg-cream-50/95 text-olive-900 shadow-[0_1px_0_rgb(51_61_32/0.08),0_14px_30px_-24px_rgb(28_34_18/0.6)] backdrop-blur-md'
          : 'text-cream-50',
      )}
    >
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-3">
        {/* الشعار */}
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="flex min-w-0 shrink items-center gap-2.5"
          aria-label={`${c.business.name} ${c.business.suffix} — العودة إلى أعلى الصفحة`}
        >
          <LogoMark
            className={cn('size-10 shrink-0 transition-colors', solid ? 'text-gold-600' : 'text-gold-400')}
          />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-script text-[1.6rem] leading-[1.5] font-bold">
              {c.business.name}
            </span>
            {c.business.suffix && (
              <span
                className={cn(
                  'hidden truncate text-[0.8rem] leading-tight min-[380px]:block',
                  solid ? 'text-olive-700' : 'text-cream-100/80',
                )}
              >
                {c.business.suffix}
              </span>
            )}
          </span>
        </a>

        {/* قائمة التنقل — الحاسوب */}
        <nav aria-label="القائمة الرئيسية" className="hidden lg:block">
          <ul className="flex items-center gap-x-5 xl:gap-x-7">
            {links.map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  className={cn(
                    'relative block py-2 text-[0.97rem] font-medium whitespace-nowrap transition-colors',
                    'after:absolute after:inset-x-0 after:bottom-0.5 after:h-0.5 after:origin-right after:scale-x-0 after:rounded-full after:bg-gold-500 after:transition-transform after:duration-300 hover:after:scale-x-100',
                    solid ? 'hover:text-gold-700' : 'hover:text-gold-300',
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn btn-gold min-h-11 px-5 text-[0.95rem]"
          >
            {c.nav.cta}
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            className={cn(
              'grid size-11 place-items-center rounded-full border transition-colors lg:hidden',
              solid
                ? 'border-olive-800/20 hover:bg-olive-800/8'
                : 'border-cream-50/40 hover:bg-cream-50/10',
            )}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* قائمة التنقل — الجوال */}
      {open && (
        <div
          id="mobile-menu"
          className="fade-in max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-olive-800/10 bg-cream-50 lg:hidden"
        >
          <nav aria-label="قائمة الجوال" className="wrap py-3">
            <ul>
              {links.map((link, i) => (
                <li key={i} className="border-b border-olive-800/8 last:border-0">
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-13 items-center justify-between py-3 text-lg font-medium text-olive-900 active:text-gold-700"
                  >
                    {link.label}
                    <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold-500" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-3 pb-4">
              <a href={telLink(phone.intl)} className="btn btn-olive px-3">
                <Phone className="size-4.5" />
                {c.nav.callLabel}
              </a>
              <a
                href={waLink(phone.intl, c.messages.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa px-3"
              >
                <WhatsAppIcon className="size-4.5" />
                {c.nav.whatsappLabel}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
