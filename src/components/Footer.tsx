import { Clock, MapPin, Pencil, Phone } from 'lucide-react';
import { useContent } from '../content/ContentProvider';
import { isLinkVisible } from '../content/utils';
import { telLink, waLink } from '../lib/whatsapp';
import { FacebookIcon, InstagramIcon, LogoMark, TikTokIcon, WhatsAppIcon } from './Icons';

export function Footer() {
  const c = useContent();
  const { business, footer } = c;
  const linkClass = 'transition-colors hover:text-gold-300';

  // الأيقونة تختفي إذا تُرك رابطها فارغًا
  const socialLinks = [
    { label: 'فيسبوك', href: business.social.facebook, Icon: FacebookIcon },
    { label: 'إنستغرام', href: business.social.instagram, Icon: InstagramIcon },
    { label: 'تيك توك', href: business.social.tiktok, Icon: TikTokIcon },
  ].filter((s) => s.href.trim());

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(business.mapQuery)}&hl=ar&z=12&output=embed`;
  const links = c.nav.links.filter((link) => isLinkVisible(c, link.href));

  return (
    <footer id="footer" className="zellige-gold bg-olive-950 text-cream-100/80">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-20">
        {/* الشعار والتعريف */}
        <div className="lg:col-span-4">
          <a href="#top" className="inline-flex items-center gap-3 text-cream-50">
            <LogoMark className="size-12 shrink-0 text-gold-400" />
            <span className="flex flex-col leading-none">
              <span className="font-script text-3xl leading-[1.5] font-bold">{business.name}</span>
              <span className="text-sm text-cream-100/75">{business.suffix}</span>
            </span>
          </a>
          {business.tagline && (
            <p className="mt-5 font-script text-2xl leading-normal text-gold-300">
              «{business.tagline}»
            </p>
          )}
          {footer.about && <p className="mt-3 max-w-sm leading-loose">{footer.about}</p>}

          {socialLinks.length > 0 && (
            <ul className="mt-6 flex gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`صفحتنا على ${label}`}
                    className="grid size-11 place-items-center rounded-full border border-gold-400/40 text-cream-50 transition-colors hover:border-gold-400 hover:bg-gold-400 hover:text-olive-950"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* الهاتف والعنوان وأوقات العمل */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-bold text-cream-50">{footer.phonesTitle}</h2>
          <ul className="mt-4 space-y-3">
            {c.phones.map((p, i) => (
              <li key={i} className="flex items-center gap-3">
                <a
                  href={telLink(p.intl)}
                  aria-label={`اتصال بالرقم ${p.local}`}
                  className={`flex min-h-11 items-center gap-2.5 text-xl font-bold text-cream-50 ${linkClass}`}
                >
                  <Phone className="size-4.5 text-gold-400" />
                  <span dir="ltr">{p.local}</span>
                </a>
                <a
                  href={waLink(p.intl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`واتساب على الرقم ${p.local}`}
                  className="grid size-10 place-items-center rounded-full bg-[#15803d] text-white transition-colors hover:bg-[#16a34a]"
                >
                  <WhatsAppIcon className="size-4.5" />
                </a>
              </li>
            ))}
          </ul>

          {business.address && (
            <>
              <h2 className="mt-8 flex items-center gap-2.5 text-xl font-bold text-cream-50">
                <MapPin className="size-4.5 text-gold-400" />
                {footer.addressTitle}
              </h2>
              <address className="mt-2 leading-relaxed whitespace-pre-line not-italic">
                {business.address}
              </address>
            </>
          )}

          {business.hours.length > 0 && (
            <>
              <h2 className="mt-8 flex items-center gap-2.5 text-xl font-bold text-cream-50">
                <Clock className="size-4.5 text-gold-400" />
                {footer.hoursTitle}
              </h2>
              <dl className="mt-2 space-y-1.5">
                {business.hours.map((h, i) => (
                  <div key={i}>
                    <dt className="inline font-bold text-cream-50">{h.days}: </dt>
                    <dd className="inline">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>

        {/* الخريطة */}
        {business.mapQuery.trim() && (
          <div className="md:col-span-2 lg:col-span-5">
            <h2 className="text-xl font-bold text-cream-50">{footer.mapTitle}</h2>
            <div className="mt-4 overflow-hidden rounded-3xl border border-gold-400/30 bg-olive-900">
              <iframe
                title={`خريطة Google: ${business.name}`}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="block h-72 w-full border-0 lg:h-80"
              />
            </div>
          </div>
        )}
      </div>

      {/* الشريط السفلي */}
      <div className="border-t border-cream-50/10">
        <div className="wrap flex flex-col items-center gap-5 pt-7 pb-40 text-center md:pb-24 lg:flex-row lg:justify-between lg:pb-8 lg:text-start">
          <nav aria-label="روابط سريعة">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1">
              {links.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className={`inline-block py-1.5 ${linkClass}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-[0.95rem] text-cream-100/65 lg:pe-36">
            © {new Date().getFullYear()} {business.name} {business.suffix}. {footer.rights}
            {footer.showEditLink && (
              <a
                href="#edit"
                className={`ms-3 inline-flex items-center gap-1.5 py-1.5 underline underline-offset-4 ${linkClass}`}
              >
                <Pencil className="size-3.5" />
                تعديل المحتوى
              </a>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
