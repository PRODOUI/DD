import { useContent } from '../content/ContentProvider';
import { getIcon } from '../lib/icons';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

export function Services() {
  const { services } = useContent();

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="zellige-olive bg-cream-100 py-20 md:py-28"
    >
      <div className="wrap">
        <Reveal>
          <SectionHeading
            id="services-title"
            eyebrow={services.eyebrow}
            title={services.title}
            text={services.text}
          />
        </Reveal>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((service, i) => {
            // الأيقونات المتاحة معرّفة في src/lib/icons.ts
            const Icon = getIcon(service.icon);
            return (
              <li key={i}>
                <Reveal delay={(i % 3) * 90} className="h-full">
                  <article className="group flex h-full gap-5 rounded-3xl border border-cream-300/80 bg-cream-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-gold-500/70 hover:shadow-soft sm:flex-col sm:p-7">
                    {/* شارة الأيقونة على شكل نجمة ثمانية */}
                    <span className="relative grid size-14 shrink-0 place-items-center">
                      <span className="absolute inset-1.5 rounded-[3px] bg-olive-800 transition-colors duration-300 group-hover:bg-gold-500" />
                      <span className="absolute inset-1.5 rotate-45 rounded-[3px] bg-olive-800 transition-colors duration-300 group-hover:bg-gold-500" />
                      <Icon
                        className="relative size-6 text-gold-300 transition-colors duration-300 group-hover:text-olive-950"
                        strokeWidth={1.75}
                      />
                    </span>
                    <div>
                      <h3 className="text-[1.35rem] leading-snug font-bold text-olive-900">
                        {service.title}
                      </h3>
                      <p className="mt-2 leading-relaxed text-ink/70">{service.text}</p>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
