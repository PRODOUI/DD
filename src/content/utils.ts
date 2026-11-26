import { defaultContent, type SiteContent } from '../data/site';

export type Path = (string | number)[];

/** مفاتيح لا تُفرَّغ عند إنشاء عنصر جديد (تبقى قيمة العنصر النموذجي) */
const KEEP_ON_BLANK = new Set(['image', 'icon', 'size', 'href', 'rating']);

/** نسخة فارغة بنفس شكل العنصر النموذجي — تُستعمل عند «إضافة عنصر» */
export function blankOf<T>(sample: T): T {
  if (Array.isArray(sample)) return [] as T;
  if (sample !== null && typeof sample === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(sample)) {
      out[key] = KEEP_ON_BLANK.has(key) ? value : blankOf(value);
    }
    return out as T;
  }
  if (typeof sample === 'string') return '' as T;
  if (typeof sample === 'boolean') return false as T;
  return sample;
}

/**
 * دمج محتوى محفوظ (من content.json أو من المتصفح) فوق المحتوى الافتراضي.
 * يضمن أن الشكل النهائي مطابق دائمًا لما تنتظره المكوّنات،
 * حتى لو كان الملف المحفوظ قديمًا أو ناقصًا.
 */
export function mergeContent<T>(def: T, over: unknown): T {
  if (Array.isArray(def)) {
    if (!Array.isArray(over)) return def;
    if (def.length === 0) return over as T;
    const sample = def[0];
    if (sample !== null && typeof sample === 'object') {
      const template = blankOf(sample);
      return over
        .filter((item) => item !== null && typeof item === 'object')
        .map((item) => mergeContent(template, item)) as T;
    }
    return over.filter((item) => typeof item === typeof sample) as T;
  }

  if (def !== null && typeof def === 'object') {
    const source =
      over !== null && typeof over === 'object' && !Array.isArray(over)
        ? (over as Record<string, unknown>)
        : {};
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(def)) {
      out[key] = mergeContent((def as Record<string, unknown>)[key], source[key]);
    }
    return out as T;
  }

  return typeof over === typeof def ? (over as T) : def;
}

/** المحتوى النهائي انطلاقًا من أي بيانات محفوظة */
export function toContent(saved: unknown): SiteContent {
  const merged = mergeContent(defaultContent, saved);
  // الموقع يحتاج رقمًا واحدًا على الأقل لتعمل أزرار واتساب والاتصال
  if (merged.phones.length === 0) merged.phones = defaultContent.phones;
  return merged;
}

/** تغيير قيمة داخل الكائن دون تعديل الأصل */
export function setAt<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  const copy = (Array.isArray(obj) ? [...obj] : { ...obj }) as Record<string | number, unknown>;
  copy[head] = setAt((obj as Record<string | number, unknown>)[head], rest, value);
  return copy as T;
}

/** قراءة قيمة بمسارها */
export function getAt(obj: unknown, path: Path): unknown {
  return path.reduce<unknown>(
    (acc, key) =>
      acc !== null && typeof acc === 'object'
        ? (acc as Record<string | number, unknown>)[key]
        : undefined,
    obj,
  );
}

/** هل القسم الذي يشير إليه الرابط ظاهر في الصفحة؟ (لإخفاء روابط الأقسام المخفية) */
export function isLinkVisible(content: SiteContent, href: string): boolean {
  const visibility: Record<string, boolean> = {
    '#about': content.about.visible,
    '#services': content.services.visible,
    '#dishes': content.dishes.visible,
    '#packages': content.packages.visible,
    '#why': content.why.visible,
    '#gallery': content.gallery.visible,
    '#video': content.video.visible,
    '#testimonials': content.testimonials.visible,
    '#areas': content.areas.visible,
  };
  return visibility[href] !== false;
}
