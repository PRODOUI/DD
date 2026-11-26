import { useContent } from '../content/ContentProvider';
import { getIcon } from '../lib/icons';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

export function WhyUs() {
  const { why } = useContent();

  return (
    <section id="why" aria-labelledby="why-title" className="bg-cream-100 py-20 md:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* العنوان يبقى ثابتًا أثناء تمرير القائمة على الحاسوب */}
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-28">
            <SectionHeading
              id="why-title"
              eyebrow={why.eyebrow}
              title={why.title}
              text={why.text}
              align="start"
            />
            {why.cta && (
              <a href="#contact" className="btn btn-olive mt-8 px-8">
                {why.cta}
              </a>
            )}
          </Reveal>
        </div>

        <ul className="lg:col-span-7">
          {why.items.map((reason, i) => {
            const Icon = getIcon(reason.icon);
            return (
              <li key={i} className="border-b border-olive-800/15 first:border-t">
                <Reveal delay={i * 60} className="flex items-start gap-5 py-7 sm:gap-7">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-cream-50 text-gold-700 ring-1 ring-gold-500/50">
                    <Icon className="size-6.5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="text-2xl leading-snug font-bold text-olive-900">
                      {reason.title}
                    </h3>
                    <p className="mt-1.5 text-lg leading-relaxed text-ink/70">{reason.text}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
