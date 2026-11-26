import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useContent } from '../content/ContentProvider';
import { cn } from '../utils/cn';
import { Picture } from './Picture';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

/** مساحة كل صورة داخل الشبكة حسب قيمة size */
const spanClass: Record<string, string> = {
  wide: 'col-span-2 row-span-2',
  tall: 'row-span-2',
  land: 'col-span-2',
  small: '',
};

const sizesAttr: Record<string, string> = {
  wide: '(min-width: 768px) 50vw, 100vw',
  land: '(min-width: 768px) 50vw, 100vw',
  tall: '(min-width: 768px) 25vw, 50vw',
  small: '(min-width: 768px) 25vw, 50vw',
};

interface GalleryItem {
  image: string;
  caption: string;
  size: string;
}

export function Gallery() {
  const { gallery } = useContent();
  const items = gallery.items;
  const count = items.length;
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null || count === 0 ? null : (i + dir + count) % count)),
    [count],
  );

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="bg-cream-50 py-20 md:py-28">
      <div className="wrap">
        <Reveal>
          <SectionHeading
            id="gallery-title"
            eyebrow={gallery.eyebrow}
            title={gallery.title}
            text={gallery.text}
          />
        </Reveal>

        <ul className="mt-12 grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[13rem] md:grid-cols-4 md:gap-4 lg:auto-rows-[15rem]">
          {items.map((item, i) => (
            <li key={i} className={spanClass[item.size] ?? ''}>
              <Reveal delay={(i % 4) * 70} className="h-full">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`تكبير الصورة: ${item.caption}`}
                  className="group relative block size-full overflow-hidden rounded-2xl bg-cream-200 focus-visible:rounded-2xl"
                >
                  <Picture
                    src={item.image}
                    alt=""
                    sizes={sizesAttr[item.size] ?? sizesAttr.small}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-linear-to-t from-olive-950/75 via-olive-950/0 to-olive-950/0 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-start text-cream-50 sm:p-4">
                    <span className="text-[0.95rem] leading-snug font-bold sm:text-base">
                      {item.caption}
                    </span>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cream-50/20 backdrop-blur-sm transition-colors group-hover:bg-gold-400 group-hover:text-olive-950">
                      <Expand className="size-4" />
                    </span>
                  </span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      {active !== null && items[active] && (
        <Lightbox
          item={items[active]}
          index={active}
          count={count}
          onClose={close}
          onStep={step}
        />
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  نافذة تكبير الصورة                                                  */
/* ------------------------------------------------------------------ */
interface LightboxProps {
  item: GalleryItem;
  index: number;
  count: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}

function Lightbox({ item, index, count, onClose, onStep }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onStep(1); // في الاتجاه RTL: اليسار = التالي
      } else if (e.key === 'ArrowRight') {
        onStep(-1);
      } else if (e.key === 'Tab') {
        // إبقاء التنقل بلوحة المفاتيح داخل النافذة
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose, onStep]);

  const navButton =
    'grid size-12 shrink-0 place-items-center rounded-full bg-cream-50/10 text-cream-50 ring-1 ring-cream-50/25 transition-colors hover:bg-gold-400 hover:text-olive-950';

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`معرض الصور: ${item.caption}`}
      className="fade-in fixed inset-0 z-[70] flex flex-col bg-olive-950/95 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 text-cream-50 sm:px-6">
        <p className="text-cream-100/80" aria-live="polite">
          {index + 1} من {count}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className={cn(navButton, 'size-11')}
        >
          <X className="size-5" />
        </button>
      </div>

      <div
        className="flex min-h-0 flex-1 items-center justify-center gap-2 px-3 sm:gap-5 sm:px-6"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <button
          type="button"
          onClick={() => onStep(-1)}
          aria-label="الصورة السابقة"
          className={cn(navButton, 'max-sm:hidden')}
        >
          <ChevronRight className="size-6" />
        </button>

        <figure className="flex min-h-0 min-w-0 flex-col items-center justify-center self-stretch">
          <Picture
            key={index}
            src={item.image}
            alt={item.caption}
            sizes="100vw"
            className="pop-in h-auto max-h-[calc(100dvh-11rem)] w-auto max-w-[calc(100vw-1.5rem)] rounded-xl object-contain shadow-2xl sm:max-w-[calc(100vw-13rem)]"
          />
        </figure>

        <button
          type="button"
          onClick={() => onStep(1)}
          aria-label="الصورة التالية"
          className={cn(navButton, 'max-sm:hidden')}
        >
          <ChevronLeft className="size-6" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 px-4 py-4 text-cream-50">
        <button
          type="button"
          onClick={() => onStep(-1)}
          aria-label="الصورة السابقة"
          className={cn(navButton, 'sm:hidden')}
        >
          <ChevronRight className="size-6" />
        </button>
        <p className="min-w-0 text-center font-display text-xl font-bold">{item.caption}</p>
        <button
          type="button"
          onClick={() => onStep(1)}
          aria-label="الصورة التالية"
          className={cn(navButton, 'sm:hidden')}
        >
          <ChevronLeft className="size-6" />
        </button>
      </div>
    </div>
  );
}
