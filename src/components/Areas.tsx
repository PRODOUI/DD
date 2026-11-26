import { MapPin } from 'lucide-react';
import { useContent } from '../content/ContentProvider';
import { waLink } from '../lib/whatsapp';
import { WhatsAppIcon } from './Icons';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

export function Areas() {
  const c = useContent();
  const { areas } = c;

  return (
    <section
      id="areas"
      aria-labelledby="areas-title"
      className="zellige-gold bg-olive-900 py-20 text-cream-50 md:py-24"
    >
      <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            id="areas-title"
            eyebrow={areas.eyebrow}
            title={areas.title}
            text={areas.text}
            align="start"
            tone="dark"
          />
          {areas.cta && (
            <a
              href={waLink(c.phones[0].intl, areas.ctaMessage || c.messages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-line-light mt-8 max-w-full px-7 whitespace-normal"
            >
              <WhatsAppIcon className="size-5 shrink-0" />
              {areas.cta}
            </a>
          )}
        </Reveal>

        <Reveal delay={120} className="lg:col-span-7">
          <ul className="flex flex-wrap gap-3">
            {areas.items.map((area, i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded-full border border-gold-400/40 bg-olive-950/50 py-2.5 ps-4 pe-5 text-lg font-medium"
              >
                <MapPin className="size-4.5 shrink-0 text-gold-400" strokeWidth={1.75} />
                {area}
              </li>
            ))}
            {areas.more && (
              <li className="flex items-center rounded-full border border-dashed border-cream-50/35 px-5 py-2.5 text-lg text-cream-100/80">
                {areas.more}
              </li>
            )}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
