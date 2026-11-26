import { useContent } from '../content/ContentProvider';
import { getIcon } from '../lib/icons';
import { Picture } from './Picture';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

export function About() {
  const { about } = useContent();

  return (
    <section id="about" aria-labelledby="about-title" className="bg-cream-50 py-20 md:py-28">
      <div className="wrap grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* الصورة داخل قوس مغربي */}
        <Reveal className="lg:col-span-5">
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div
              aria-hidden="true"
              className="arch absolute inset-0 translate-x-3 -translate-y-3 border border-gold-500/70"
            />
            <div className="arch relative aspect-[4/5] overflow-hidden bg-cream-200 shadow-soft">
              <Picture
                src={about.image}
                alt={about.imageAlt}
                sizes="(min-width: 1024px) 36vw, (min-width: 640px) 24rem, 90vw"
                className="size-full object-cover"
              />
            </div>
            {about.badge && (
              <p className="absolute -bottom-5 left-1/2 w-max max-w-[90%] -translate-x-1/2 rounded-full bg-olive-800 px-6 py-2.5 text-center font-script text-xl text-gold-300 shadow-soft">
                {about.badge}
              </p>
            )}
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <SectionHeading
              id="about-title"
              eyebrow={about.eyebrow}
              title={about.title}
              align="start"
            />
            <p className="mt-6 text-lg leading-loose text-ink/80">{about.text}</p>
          </Reveal>

          <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {about.points.map((point, i) => {
              const Icon = getIcon(point.icon);
              return (
                <li key={i}>
                  <Reveal delay={i * 80} className="flex gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full border border-gold-500/50 bg-cream-100 text-gold-700">
                      <Icon className="size-5.5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-olive-900">{point.title}</h3>
                      <p className="mt-1 leading-relaxed text-ink/70">{point.text}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
