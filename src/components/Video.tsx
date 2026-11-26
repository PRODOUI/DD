import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { useContent } from '../content/ContentProvider';
import { waLink } from '../lib/whatsapp';
import { Khatim, WhatsAppIcon } from './Icons';
import { Picture } from './Picture';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

/**
 * قسم الفيديو — عمودي (9:16) داخل قوس مغربي بنفس لغة صور الموقع.
 * لا يُحمَّل الفيديو (≈14MB) إلا عند الضغط على زر التشغيل، فلا يبطّئ الصفحة.
 * الفيديو والصورة المعاينة موجودان في  public/video/  ومساراتهما في  src/data/site.ts  (video.src / video.poster)
 */
export function Video() {
  const c = useContent();
  const { video } = c;
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // إيقاف الفيديو تلقائيًا عند الابتعاد عنه بالتمرير
  useEffect(() => {
    const frame = frameRef.current;
    if (!playing || !frame || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) videoRef.current?.pause();
      },
      { threshold: 0.2 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [playing]);

  return (
    <section
      id="video"
      aria-labelledby="video-title"
      className="zellige-gold overflow-hidden bg-olive-900 py-20 text-cream-50 md:py-28"
    >
      <div className="wrap grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <SectionHeading
              id="video-title"
              eyebrow={video.eyebrow}
              title={video.title}
              text={video.text}
              align="start"
              tone="dark"
            />
          </Reveal>

          {video.points.length > 0 && (
            <Reveal delay={120}>
              <ul className="mt-8 space-y-3.5">
                {video.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg leading-relaxed text-cream-100/90">
                    <Khatim className="mt-2.5 size-3 shrink-0 text-gold-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal delay={220}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#contact" className="btn btn-gold min-h-14 px-8 text-lg">
                {video.cta}
              </a>
              <a
                href={waLink(c.phones[0].intl, c.messages.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-line-light min-h-14 px-8 text-lg"
              >
                <WhatsAppIcon className="size-5" />
                {video.whatsappCta}
              </a>
            </div>
          </Reveal>
        </div>

        {/* الفيديو داخل قوس مغربي (نفس إطار صورة «من نحن») */}
        <Reveal className="lg:col-span-5" delay={100}>
          <div ref={frameRef} className="relative mx-auto w-full max-w-[19rem] sm:max-w-[21rem]">
            <div
              aria-hidden="true"
              className="arch absolute inset-0 -translate-x-3 -translate-y-3 border border-gold-400/60"
            />
            <div className="arch relative aspect-[9/16] overflow-hidden bg-olive-950 shadow-soft ring-1 ring-gold-400/40">
              {playing ? (
                <video
                  ref={videoRef}
                  src={video.src}
                  poster={video.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  controlsList="nodownload"
                  aria-label={video.title}
                  onEnded={() => setPlaying(false)}
                  className="size-full bg-olive-950 object-cover"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label={`${video.playLabel}: ${video.title}`}
                  className="group absolute inset-0 block size-full"
                >
                  <Picture
                    src={video.poster}
                    alt={video.posterAlt}
                    sizes="(min-width: 640px) 21rem, 19rem"
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-linear-to-t from-olive-950/70 via-olive-950/10 to-olive-950/20" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-20 place-items-center rounded-full bg-gold-400 text-olive-950 shadow-soft ring-8 ring-gold-400/25 transition-transform duration-300 group-hover:scale-110">
                      <Play className="size-8 translate-x-0.5 fill-current" />
                    </span>
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-5 text-center font-script text-2xl text-gold-300">
                    {video.playLabel}
                  </span>
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
