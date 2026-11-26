/**
 * سكربت تحسين الصور — أفراح الزوبير
 * ---------------------------------------------------------------
 * يقرأ كل الصور الموجودة في مجلد  images-src/
 * ويحوّلها إلى WebP بعدة مقاسات داخل  public/images/
 * ثم يكتب فهرسًا في  src/data/images.ts  يستعمله الموقع تلقائيًا.
 *
 * طريقة الاستعمال:
 *   1) ضع صورتك في images-src/ (مثال: images-src/tagine.jpg)
 *      — إذا استعملت نفس الاسم فستُستبدل الصورة القديمة مباشرة.
 *   2) شغّل:  node scripts/optimize-images.mjs
 *   3) شغّل:  npm run build
 */
import sharp from 'sharp';
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SRC_DIR = 'images-src';
const OUT_DIR = 'public/images';
const MANIFEST = 'src/data/images.ts';

/** المقاسات (بالبكسل) التي تُولَّد لكل صورة — لا نكبّر صورة فوق حجمها الأصلي */
const TARGET_WIDTHS = [480, 800, 1200, 1600];
const QUALITY = 72;

const files = (await readdir(SRC_DIR))
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort();

if (files.length === 0) {
  console.error(`لا توجد صور داخل ${SRC_DIR}/`);
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

// حذف النسخ القديمة حتى لا تبقى ملفات غير مستعملة
for (const f of await readdir(OUT_DIR)) {
  if (/-\d+\.webp$/.test(f)) await rm(path.join(OUT_DIR, f));
}

const manifest = {};
let totalBytes = 0;

for (const file of files) {
  const name = path.parse(file).name;
  const input = path.join(SRC_DIR, file);
  const meta = await sharp(input).metadata();

  const widths = [
    ...new Set([
      ...TARGET_WIDTHS.filter((w) => w < meta.width),
      Math.min(meta.width, TARGET_WIDTHS.at(-1)),
    ]),
  ].sort((a, b) => a - b);

  for (const w of widths) {
    const info = await sharp(input)
      .rotate()
      .resize({ width: w })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(path.join(OUT_DIR, `${name}-${w}.webp`));
    totalBytes += info.size;
  }

  manifest[name] = { width: meta.width, height: meta.height, widths };
  console.log(`✓ ${name}  →  ${widths.join(', ')}`);
}

const banner = `// ⚠️ ملف مولَّد تلقائيًا بواسطة scripts/optimize-images.mjs — لا تعدّله يدويًا.
// لإضافة أو تغيير صورة: ضعها في images-src/ ثم شغّل:  node scripts/optimize-images.mjs
`;

await mkdir(path.dirname(MANIFEST), { recursive: true });
await writeFile(
  MANIFEST,
  `${banner}
export const images = ${JSON.stringify(manifest, null, 2)} as const;

export type ImageName = keyof typeof images;
`,
);

console.log(
  `\nتم: ${files.length} صورة، الحجم الإجمالي ${(totalBytes / 1024).toFixed(0)} KB`,
);
