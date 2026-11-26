import type { CSSProperties } from 'react';
import { useContent } from '../content/ContentProvider';
import { waLink } from '../lib/whatsapp';
import { Khatim, WhatsAppIcon } from './Icons';
import { Picture } from './Picture';

/** تأخير حركة الدخول لكل عنصر */
const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export function Hero() {
  const c = useContent();
  const { hero, business } = c;

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-olive-950 text-cream-50"
    >
      {/* صورة المائدة */}
      <Picture
        src={hero.image}
        alt={hero.imageAlt}
        sizes="100vw"
        priority
        className="hero-image absolute inset-0 -z-20 size-full object-cover"
      />

      {/* تدرّجات داكنة لضمان وضوح النص فوق الصورة */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-l from-olive-950/90 via-olive-950/50 to-olive-950/5 max-md:bg-olive-950/55 max-md:bg-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-olive-950 via-olive-950/0 to-olive-950/45"
      />

      <div className="wrap pt-32 pb-10 md:pb-14">
        <div className="max-w-3xl">
          {hero.eyebrow && (
            <p
              className="hero-in flex items-center gap-3 text-base font-medium text-gold-300 sm:text-lg"
              style={delay(100)}
            >
              <Khatim className="size-3.5 shrink-0" />
              {hero.eyebrow}
              <span className="h-px w-12 bg-gold-400/60" />
            </p>
          )}

          <h1
            id="hero-title"
            className="hero-in mt-5 text-[2.15rem] leading-[1.3] font-bold sm:text-5xl sm:leading-[1.3] lg:text-[4rem] lg:leading-[1.25]"
            style={delay(200)}
          >
            {hero.titleLead && <span className="block text-gold-300">{hero.titleLead}</span>}
            <span className="block">{hero.titleRest}</span>
          </h1>

          {business.tagline && (
            <p
              className="hero-in mt-5 font-script text-[1.7rem] leading-normal text-gold-300 sm:text-4xl"
              style={delay(350)}
            >
              «{business.tagline}»
            </p>
          )}

          {hero.text && (
            <p
              className="hero-in mt-4 max-w-xl text-lg leading-loose text-cream-100/90"
              style={delay(450)}
            >
              {hero.text}
            </p>
          )}

          <div className="hero-in mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={delay(550)}>
            <a href="#contact" className="btn btn-gold min-h-14 px-8 text-lg">
              {hero.primaryCta}
            </a>
            <a
              href={waLink(c.phones[0].intl, c.messages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-line-light min-h-14 px-8 text-lg backdrop-blur-sm"
            >
              <WhatsAppIcon className="size-5" />
              {hero.whatsappCta}
            </a>
          </div>
        </div>

        {/* شريط المزايا السريعة */}
        {hero.highlights.length > 0 && (
          <ul
            className="hero-in mt-12 flex flex-wrap gap-x-8 gap-y-2 border-t border-cream-50/20 pt-6 text-cream-100/90 max-md:pe-16 md:mt-16"
            style={delay(700)}
          >
            {hero.highlights.map((item, i) => (
              <li key={i} className="flex items-center gap-2.5 font-medium">
                <Khatim className="size-2.5 text-gold-400" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
