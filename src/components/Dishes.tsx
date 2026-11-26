import { useContent } from '../content/ContentProvider';
import { cn } from '../utils/cn';
import { Picture } from './Picture';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

/**
 * عدد الأطباق «الكبيرة» (3 في الصف) حتى تمتلئ الصفوف مهما كان عدد الأطباق.
 * الباقي يُعرض 4 في الصف. مثال: 7 أطباق = 3 كبيرة + 4 صغيرة.
 */
function largeCount(total: number): number {
  if (total <= 3) return total;
  if (total % 4 === 3) return 3;
  if (total % 4 === 2) return Math.min(6, total);
  return 0;
}

export function Dishes() {
  const { dishes } = useContent();
  const large = largeCount(dishes.items.length);

  return (
    <section
      id="dishes"
      aria-labelledby="dishes-title"
      className="zellige-gold bg-olive-900 py-20 text-cream-50 md:py-28"
    >
      <div className="wrap">
        <Reveal>
          <SectionHeading
            id="dishes-title"
            eyebrow={dishes.eyebrow}
            title={dishes.title}
            text={dishes.text}
            tone="dark"
          />
        </Reveal>

        <ul className="mt-14 flex flex-wrap justify-center gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
          {dishes.items.map((dish, i) => {
            const isLarge = i < large;
            return (
              <li
                key={i}
                className={cn(
                  'w-[calc(50%-0.5rem)]',
                  isLarge ? 'sm:w-[calc((100%-3rem)/3)]' : 'sm:w-[calc((100%-4.5rem)/4)]',
                )}
              >
                <Reveal delay={(isLarge ? i % 3 : (i - large) % 4) * 90}>
                  <figure className="group text-center">
                    <div className="arch border border-gold-400/45 p-1.5 transition-colors duration-500 group-hover:border-gold-400">
                      <div className="arch aspect-[3/4] overflow-hidden bg-olive-800">
                        <Picture
                          src={dish.image}
                          alt={dish.alt || dish.name}
                          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 33vw, 50vw"
                          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <figcaption className="mt-4">
                      <h3
                        className={cn(
                          'leading-snug font-bold text-cream-50',
                          isLarge ? 'text-xl sm:text-2xl' : 'text-xl',
                        )}
                      >
                        {dish.name}
                      </h3>
                      <p className="mt-1 text-[0.95rem] leading-relaxed text-cream-100/70">
                        {dish.text}
                      </p>
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
