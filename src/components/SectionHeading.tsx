import { cn } from '../utils/cn';
import { Khatim } from './Icons';

interface SectionHeadingProps {
  /** id يُربط بالقسم عبر aria-labelledby */
  id: string;
  eyebrow: string;
  title: string;
  text?: string;
  align?: 'center' | 'start';
  /** dark = القسم خلفيته داكنة */
  tone?: 'light' | 'dark';
  className?: string;
}

/** عنوان قسم موحّد: سطر صغير مزخرف + عنوان + وصف اختياري */
export function SectionHeading({
  id,
  eyebrow,
  title,
  text,
  align = 'center',
  tone = 'light',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';
  const dark = tone === 'dark';
  const line = cn('h-px w-10 shrink-0', dark ? 'bg-gold-400/50' : 'bg-gold-600/50');

  return (
    <div className={cn(centered && 'mx-auto max-w-2xl text-center', className)}>
      <p
        className={cn(
          'flex items-center gap-3 text-base font-bold',
          centered && 'justify-center',
          dark ? 'text-gold-400' : 'text-gold-700',
        )}
      >
        {centered && <span className={line} />}
        <Khatim className="size-3 shrink-0" />
        <span>{eyebrow}</span>
        {centered && <Khatim className="size-3 shrink-0" />}
        <span className={line} />
      </p>

      <h2
        id={id}
        className={cn(
          'mt-4 text-[1.9rem] leading-[1.35] font-bold sm:text-4xl sm:leading-[1.35] lg:text-[2.75rem]',
          dark ? 'text-cream-50' : 'text-olive-900',
        )}
      >
        {title}
      </h2>

      {text && (
        <p
          className={cn(
            'mt-4 text-lg leading-loose',
            dark ? 'text-cream-100/75' : 'text-ink/75',
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}
