import { images, type ImageName } from '../data/images';
import { cn } from '../utils/cn';

/** هل القيمة اسم صورة من صور الموقع المضغوطة (images-src/)؟ */
export function isBuiltInImage(value: string): value is ImageName {
  return Object.prototype.hasOwnProperty.call(images, value);
}

/** أسماء الصور المتوفرة داخل الموقع */
export const builtInImageNames = Object.keys(images) as ImageName[];

interface PictureProps {
  /**
   * مصدر الصورة، واحد من ثلاثة:
   *  - اسم صورة من images-src/ بدون الامتداد (مثال: "tagine") ← تُعرض بنسخ WebP متجاوبة
   *  - رابط صورة كامل (https://…)
   *  - صورة مرفوعة من لوحة التعديل (data:…)
   */
  src: string;
  alt: string;
  /** العرض المتوقع للصورة على الشاشة، مثال: "(min-width: 1024px) 33vw, 100vw" */
  sizes: string;
  className?: string;
  /** للصورة الأولى في الصفحة فقط: تُحمَّل فورًا بأولوية عالية */
  priority?: boolean;
}

export function Picture({ src, alt, sizes, className, priority = false }: PictureProps) {
  const loading = {
    loading: priority ? ('eager' as const) : ('lazy' as const),
    decoding: priority ? ('sync' as const) : ('async' as const),
    fetchPriority: priority ? ('high' as const) : ('auto' as const),
  };

  // لا توجد صورة بعد (عنصر جديد في لوحة التعديل)
  if (!src) return <div aria-hidden="true" className={cn('bg-cream-200', className)} />;

  if (isBuiltInImage(src)) {
    const meta = images[src];
    const widths: readonly number[] = meta.widths;
    return (
      <img
        src={`images/${src}-${widths[widths.length - 1]}.webp`}
        srcSet={widths.map((w) => `images/${src}-${w}.webp ${w}w`).join(', ')}
        sizes={sizes}
        alt={alt}
        width={meta.width}
        height={meta.height}
        className={className}
        {...loading}
      />
    );
  }

  return <img src={src} alt={alt} className={className} {...loading} />;
}
