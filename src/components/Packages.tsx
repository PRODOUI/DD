import { useContent } from '../content/ContentProvider';
import { cn } from '../utils/cn';
import { Khatim } from './Icons';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

interface PackagesProps {
  /** يُستدعى عند اختيار باقة ليُملأ حقل الباقة في نموذج الطلب تلقائيًا */
  onSelect: (packageName: string) => void;
}

export function Packages({ onSelect }: PackagesProps) {
  const { packages } = useContent();
  const items = packages.items;
  const rows = Object.entries(packages.rowLabels) as [keyof typeof packages.rowLabels, string][];

  return (
    <section id="packages" aria-labelledby="packages-title" className="bg-cream-50 py-20 md:py-28">
      <div className="wrap">
        <Reveal>
          <SectionHeading
            id="packages-title"
            eyebrow={packages.eyebrow}
            title={packages.title}
            text={packages.text}
          />
        </Reveal>

        {/* ---------- جدول المقارنة (الشاشات المتوسطة والكبيرة) ---------- */}
        <Reveal className="mt-14 hidden md:block">
          <table className="w-full table-fixed border-separate border-spacing-0 text-center">
            <caption className="sr-only">{packages.title}</caption>
            <thead>
              <tr>
                <td className="w-[15%]" />
                {items.map((p, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={cn(
                      'px-5 pt-8 pb-6 align-bottom font-normal',
                      p.featured && 'rounded-t-[2rem] bg-olive-800 text-cream-50',
                    )}
                  >
                    {p.featured && packages.featuredBadge && (
                      <span className="mb-3 inline-block rounded-full bg-gold-400 px-4 py-0.5 text-sm font-bold text-olive-950">
                        {packages.featuredBadge}
                      </span>
                    )}
                    <span
                      className={cn(
                        'block font-display text-3xl font-bold',
                        !p.featured && 'text-olive-900',
                      )}
                    >
                      {p.name}
                    </span>
                    <span
                      className={cn(
                        'mt-2 block text-[0.95rem] leading-relaxed',
                        p.featured ? 'text-cream-100/80' : 'text-ink/65',
                      )}
                    >
                      {p.summary}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([key, label]) => (
                <tr key={key}>
                  <th
                    scope="row"
                    className="border-t border-cream-300 py-5 pe-4 text-start text-lg font-bold text-olive-800"
                  >
                    {label}
                  </th>
                  {items.map((p, i) => (
                    <td
                      key={i}
                      className={cn(
                        'border-t px-5 py-5 leading-relaxed',
                        p.featured
                          ? 'border-cream-50/15 bg-olive-800 font-medium text-cream-50'
                          : 'border-cream-300 text-ink/85',
                      )}
                    >
                      {p.features[key]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="border-t border-cream-300" />
                {items.map((p, i) => (
                  <td
                    key={i}
                    className={cn(
                      'border-t px-5 pt-5 pb-8',
                      p.featured
                        ? 'rounded-b-[2rem] border-cream-50/15 bg-olive-800'
                        : 'border-cream-300',
                    )}
                  >
                    <a
                      href="#contact"
                      onClick={() => onSelect(p.name)}
                      className={cn('btn w-full', p.featured ? 'btn-gold' : 'btn-line-dark')}
                    >
                      {packages.itemCta}
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Reveal>

        {/* ---------- بطاقات (الجوال) ---------- */}
        <ul className="mt-12 grid gap-6 md:hidden">
          {items.map((p, i) => (
            <li key={i}>
              <Reveal>
                <article
                  className={cn(
                    'rounded-[1.75rem] border p-6',
                    p.featured
                      ? 'border-olive-800 bg-olive-800 text-cream-50 shadow-soft'
                      : 'border-cream-300 bg-cream-100/60',
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className={cn('text-3xl font-bold', !p.featured && 'text-olive-900')}>
                      {p.name}
                    </h3>
                    {p.featured && packages.featuredBadge && (
                      <span className="rounded-full bg-gold-400 px-4 py-0.5 text-sm font-bold text-olive-950">
                        {packages.featuredBadge}
                      </span>
                    )}
                  </div>
                  <p className={cn('mt-1', p.featured ? 'text-cream-100/80' : 'text-ink/65')}>
                    {p.summary}
                  </p>

                  <dl className="mt-5">
                    {rows.map(([key, label]) => (
                      <div
                        key={key}
                        className={cn(
                          'border-t py-3.5',
                          p.featured ? 'border-cream-50/15' : 'border-cream-300',
                        )}
                      >
                        <dt
                          className={cn(
                            'text-sm font-bold',
                            p.featured ? 'text-gold-300' : 'text-gold-700',
                          )}
                        >
                          {label}
                        </dt>
                        <dd className="mt-0.5 leading-relaxed">{p.features[key]}</dd>
                      </div>
                    ))}
                  </dl>

                  <a
                    href="#contact"
                    onClick={() => onSelect(p.name)}
                    className={cn('btn mt-3 w-full', p.featured ? 'btn-gold' : 'btn-line-dark')}
                  >
                    {packages.itemCta}
                  </a>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* ---------- ملاحظة الأسعار ---------- */}
        {packages.note && (
          <Reveal className="mt-12">
            <div className="flex flex-col items-center gap-5 rounded-[1.75rem] border border-gold-500/50 bg-cream-100 px-6 py-7 text-center md:flex-row md:justify-between md:px-10 md:text-start">
              <p className="flex items-center gap-3 font-display text-xl leading-relaxed font-bold text-olive-900 sm:text-2xl">
                <Khatim className="hidden size-4 shrink-0 text-gold-600 sm:block" />
                {packages.note}
              </p>
              <a href="#contact" className="btn btn-olive w-full shrink-0 px-8 sm:w-auto">
                {packages.noteCta}
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
