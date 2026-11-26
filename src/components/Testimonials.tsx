import { Quote, Star } from 'lucide-react';
import { useContent } from '../content/ContentProvider';
import { cn } from '../utils/cn';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

function Stars({ rating }: { rating: number }) {
  return (
    <div role="img" aria-label={`التقييم: ${rating} من 5`} className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            'size-5',
            i < rating ? 'fill-gold-500 text-gold-500' : 'fill-transparent text-gold-500/40',
          )}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const { testimonials } = useContent();

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="zellige-olive bg-cream-100 py-20 md:py-28"
    >
      <div className="wrap">
        <Reveal>
          <SectionHeading
            id="testimonials-title"
            eyebrow={testimonials.eyebrow}
            title={testimonials.title}
          />
        </Reveal>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.items.map((t, i) => (
            <li key={i}>
              <Reveal delay={(i % 3) * 100} className="h-full">
                <figure className="relative flex h-full flex-col rounded-[1.75rem] border border-cream-300/80 bg-cream-50 p-7 shadow-soft">
                  <Quote
                    aria-hidden="true"
                    className="absolute end-6 top-6 size-10 text-gold-400/45"
                    strokeWidth={1.5}
                  />
                  <Stars rating={t.rating} />
                  <blockquote className="mt-5 flex-1 text-lg leading-loose text-ink/85">
                    {t.text}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3.5 border-t border-cream-300 pt-5">
                    <span
                      aria-hidden="true"
                      className="grid size-12 shrink-0 place-items-center rounded-full bg-olive-800 font-display text-xl font-bold text-gold-300"
                    >
                      {t.name.trim().charAt(0)}
                    </span>
                    <span>
                      <span className="block text-lg leading-snug font-bold text-olive-900">
                        {t.name}
                      </span>
                      <span className="block text-[0.95rem] text-ink/65">{t.event}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
