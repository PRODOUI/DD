import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  Download,
  Eye,
  ImageUp,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { isBuiltInImage, Picture } from '../components/Picture';
import { useContentAdmin } from '../content/ContentProvider';
import { blankOf, getAt, type Path } from '../content/utils';
import { defaultContent } from '../data/site';
import { cn } from '../utils/cn';
import {
  fieldHints,
  imageOptions,
  keyLabels,
  ltrKeys,
  minItems,
  multilineKeys,
  pathLabels,
  sections,
  selectOptions,
} from './labels';

/**
 * لوحة تعديل المحتوى (تُفتح بإضافة  #edit  إلى رابط الموقع).
 *
 * اللوحة «عامة»: تقرأ شكل المحتوى من src/data/site.ts وتبني الحقول تلقائيًا:
 *   نص ← حقل كتابة،  صح/خطأ ← زر تفعيل،  قائمة ← عناصر مع إضافة/حذف/ترتيب،
 *   image ← اختيار أو رفع صورة،  icon / size / href ← قائمة اختيار.
 * التسميات العربية في  src/editor/labels.ts
 */

const inputClass = 'field min-h-11 py-2 text-[0.95rem]';
const iconButton =
  'grid h-9 min-w-9 shrink-0 place-items-center rounded-lg text-olive-800 transition-colors hover:bg-cream-200 disabled:opacity-30 disabled:hover:bg-transparent';

/* ------------------------------ أدوات المسار ------------------------------ */

function lastKey(path: Path): string {
  for (let i = path.length - 1; i >= 0; i--) {
    const part = path[i];
    if (typeof part === 'string') return part;
  }
  return '';
}

/** المسار بدون أرقام العناصر: ['services','items',2,'title'] ← 'services.items.title' */
function pathKey(path: Path): string {
  return path.filter((part) => typeof part === 'string').join('.');
}

function labelFor(path: Path): string {
  return pathLabels[pathKey(path)] ?? keyLabels[lastKey(path)] ?? lastKey(path);
}

function hintFor(path: Path): string | undefined {
  return fieldHints[pathKey(path)] ?? fieldHints[lastKey(path)];
}

function itemTitle(item: unknown, index: number): string {
  if (item !== null && typeof item === 'object') {
    const record = item as Record<string, unknown>;
    for (const key of ['title', 'name', 'label', 'caption', 'days']) {
      const value = record[key];
      if (typeof value === 'string' && value.trim()) return value;
    }
  }
  return `عنصر ${index + 1}`;
}

/* --------------------------- تصغير الصور المرفوعة -------------------------- */

/** تصغير الصورة قبل حفظها حتى لا تملأ مساحة المتصفح ولا تثقل الصفحة */
async function fileToDataUrl(file: File, maxSide = 1280, quality = 0.8): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('unreadable image'));
      el.src = objectUrl;
    });
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas unavailable');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/* ------------------------------ عناصر مشتركة ------------------------------ */

function Labeled({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[0.92rem] font-bold text-olive-900">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[0.85rem] leading-relaxed text-ink/60">{hint}</p>}
    </div>
  );
}

/** زر يحتاج ضغطتين (حماية من الحذف بالخطأ) */
function ConfirmButton({
  onConfirm,
  label,
  confirmText,
  className,
  disabled,
  children,
}: {
  onConfirm: () => void;
  label: string;
  confirmText: string;
  className?: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = window.setTimeout(() => setArmed(false), 3500);
    return () => window.clearTimeout(timer);
  }, [armed]);

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={armed ? `${confirmText} — ${label}` : label}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else {
          setArmed(true);
        }
      }}
      className={cn(className, armed && 'bg-[#b3261e] px-2.5 text-white hover:bg-[#8c1d18]')}
    >
      {armed ? <span className="text-sm font-bold whitespace-nowrap">{confirmText}</span> : children}
    </button>
  );
}

function ItemControls({
  index,
  count,
  canRemove,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  canRemove: boolean;
  onMove: (dir: 1 | -1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center">
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={index === 0}
        aria-label="تحريك إلى الأعلى"
        className={iconButton}
      >
        <ChevronUp className="size-4.5" />
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={index === count - 1}
        aria-label="تحريك إلى الأسفل"
        className={iconButton}
      >
        <ChevronDown className="size-4.5" />
      </button>
      <ConfirmButton
        onConfirm={onRemove}
        disabled={!canRemove}
        label="حذف"
        confirmText="حذف؟"
        className={cn(iconButton, 'text-[#b3261e]')}
      >
        <Trash2 className="size-4.5" />
      </ConfirmButton>
    </div>
  );
}

function StringInput({
  id,
  value,
  onChange,
  multiline,
  ltr,
  ariaLabel,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  multiline: boolean;
  ltr: boolean;
  ariaLabel?: string;
}) {
  if (multiline) {
    return (
      <textarea
        id={id}
        value={value}
        aria-label={ariaLabel}
        rows={Math.min(8, Math.max(2, Math.ceil(value.length / 36)))}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClass, 'min-h-0 leading-relaxed')}
      />
    );
  }
  return (
    <input
      id={id}
      type="text"
      value={value}
      aria-label={ariaLabel}
      dir={ltr ? 'ltr' : undefined}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputClass, ltr && 'text-right')}
    />
  );
}

/* ------------------------------- حقل الصورة ------------------------------- */

function ImageField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [error, setError] = useState('');
  const builtIn = isBuiltInImage(value);
  const uploaded = value.startsWith('data:');

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      onChange(await fileToDataUrl(file));
      setError('');
    } catch {
      setError('تعذّرت قراءة الصورة. جرّب صورة أخرى بصيغة JPG أو PNG.');
    }
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[0.92rem] font-bold text-olive-900">
        {label}
      </label>
      <div className="flex gap-3">
        <div className="size-[5.5rem] shrink-0 overflow-hidden rounded-xl border border-cream-300 bg-cream-200">
          <Picture src={value} alt="" sizes="88px" className="size-full object-cover" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <select
            id={id}
            value={builtIn ? value : ''}
            onChange={(e) => e.target.value && onChange(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled={builtIn}>
              {uploaded ? 'صورة مرفوعة من جهازك' : value ? 'صورة من رابط' : 'اختر صورة'}
            </option>
            {imageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <label className="btn btn-line-dark min-h-10 w-full cursor-pointer px-3 text-[0.92rem] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-500">
            <ImageUp className="size-4" />
            رفع صورة من جهازك
            <input type="file" accept="image/*" onChange={onFile} className="sr-only" />
          </label>
        </div>
      </div>
      <label
        htmlFor={`${id}-url`}
        className="mt-2.5 mb-1 block text-[0.85rem] leading-relaxed text-ink/60"
      >
        أو الصق رابط صورة من الإنترنت:
      </label>
      <input
        id={`${id}-url`}
        type="url"
        dir="ltr"
        placeholder="https://"
        value={builtIn || uploaded ? '' : value}
        onChange={(e) => onChange(e.target.value.trim())}
        className={inputClass}
      />
      {error && (
        <p role="alert" className="mt-1.5 text-[0.9rem] font-medium text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------- القوائم ---------------------------------- */

function ListField({ value, path }: { value: unknown[]; path: Path }) {
  const { update } = useContentAdmin();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const label = labelFor(path);
  const hint = hintFor(path);
  const min = minItems[pathKey(path)] ?? 0;

  // العنصر النموذجي يؤخذ من المحتوى الافتراضي حتى لو حُذفت كل العناصر الحالية
  const defaults = getAt(
    defaultContent,
    path.map((part) => (typeof part === 'number' ? 0 : part)),
  );
  const sample: unknown = Array.isArray(defaults) && defaults.length > 0 ? defaults[0] : '';
  const objectList = sample !== null && typeof sample === 'object';

  const move = (index: number, dir: 1 | -1) => {
    const other = index + dir;
    if (other < 0 || other >= value.length) return;
    const next = [...value];
    [next[index], next[other]] = [next[other], next[index]];
    update(path, next);
    setOpenIndex((open) => (open === index ? other : open === other ? index : open));
  };

  const remove = (index: number) => {
    update(
      path,
      value.filter((_, i) => i !== index),
    );
    setOpenIndex(null);
  };

  const add = () => {
    update(path, [...value, blankOf(sample)]);
    if (objectList) setOpenIndex(value.length);
  };

  return (
    <div>
      <p className="mb-1.5 flex items-baseline justify-between gap-2 text-[0.92rem] font-bold text-olive-900">
        {label}
        <span className="font-normal text-ink/55">{value.length}</span>
      </p>
      {hint && <p className="mb-2 text-[0.85rem] leading-relaxed text-ink/60">{hint}</p>}

      <ul className="space-y-2">
        {value.map((item, i) => {
          const controls = (
            <ItemControls
              index={i}
              count={value.length}
              canRemove={value.length > min}
              onMove={(dir) => move(i, dir)}
              onRemove={() => remove(i)}
            />
          );

          if (!objectList) {
            return (
              <li key={i} className="flex items-start gap-1">
                <div className="min-w-0 flex-1">
                  <StringInput
                    id={`ed-${[...path, i].join('-')}`}
                    value={String(item)}
                    onChange={(v) => update([...path, i], v)}
                    multiline={multilineKeys.has(lastKey(path))}
                    ltr={false}
                    ariaLabel={`${label} ${i + 1}`}
                  />
                </div>
                {controls}
              </li>
            );
          }

          const open = openIndex === i;
          return (
            <li key={i} className="rounded-2xl border border-cream-300 bg-white">
              <div className="flex items-center gap-1 p-1 ps-2">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-lg px-1 text-start font-bold text-olive-900"
                >
                  <ChevronDown
                    className={cn('size-4 shrink-0 transition-transform', open && 'rotate-180')}
                  />
                  <span className="truncate">{itemTitle(item, i)}</span>
                </button>
                {controls}
              </div>
              {open && (
                <div className="border-t border-cream-300 p-3">
                  <FieldNode value={item} path={[...path, i]} bare />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={add}
        className="btn btn-line-dark mt-2 min-h-10 w-full border-dashed px-3 text-[0.92rem]"
      >
        <Plus className="size-4" />
        إضافة عنصر
      </button>
    </div>
  );
}

/* --------------------------- الحقل العام (تكراري) -------------------------- */

function FieldNode({ value, path, bare = false }: { value: unknown; path: Path; bare?: boolean }) {
  const { update } = useContentAdmin();
  const key = lastKey(path);
  const id = `ed-${path.join('-')}`;
  const label = labelFor(path);
  const hint = hintFor(path);
  const set = (next: unknown) => update(path, next);

  if (typeof value === 'boolean') {
    return (
      <div>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-cream-300 bg-white px-3 py-2">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => set(e.target.checked)}
            className="size-5 shrink-0 accent-olive-700"
          />
          <span className="text-[0.95rem] font-bold text-olive-900">{label}</span>
        </label>
        {hint && <p className="mt-1 text-[0.85rem] leading-relaxed text-ink/60">{hint}</p>}
      </div>
    );
  }

  if (typeof value === 'number') {
    return (
      <Labeled id={id} label={label} hint={hint}>
        <select
          id={id}
          value={value}
          onChange={(e) => set(Number(e.target.value))}
          className={inputClass}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {'★'.repeat(n)} ({n})
            </option>
          ))}
        </select>
      </Labeled>
    );
  }

  if (typeof value === 'string') {
    if (key === 'image') {
      return <ImageField id={id} label={label} value={value} onChange={set} />;
    }

    const options = selectOptions[key];
    if (options) {
      return (
        <Labeled id={id} label={label} hint={hint}>
          <select id={id} value={value} onChange={(e) => set(e.target.value)} className={inputClass}>
            {!options.some((option) => option.value === value) && (
              <option value={value}>{value || '—'}</option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Labeled>
      );
    }

    return (
      <Labeled id={id} label={label} hint={hint}>
        <StringInput
          id={id}
          value={value}
          onChange={set}
          multiline={multilineKeys.has(key)}
          ltr={ltrKeys.has(key)}
        />
      </Labeled>
    );
  }

  if (Array.isArray(value)) {
    return <ListField value={value} path={path} />;
  }

  if (value !== null && typeof value === 'object') {
    const fields = Object.entries(value).map(([childKey, child]) => (
      <FieldNode key={childKey} value={child} path={[...path, childKey]} />
    ));
    if (bare) return <div className="space-y-3.5">{fields}</div>;
    return (
      <fieldset className="rounded-2xl border border-cream-300 bg-cream-100/60 p-3 pt-1">
        <legend className="px-2 text-[0.95rem] font-bold text-olive-900">{label}</legend>
        <div className="space-y-3.5">{fields}</div>
      </fieldset>
    );
  }

  return null;
}

/* ------------------------------- اللوحة ----------------------------------- */

export function ContentEditor({ onClose }: { onClose: () => void }) {
  const { content, hasDraft, saveState, replaceAll, reset } = useContentAdmin();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [minimized, setMinimized] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const toggleSection = (key: string, target?: string) => {
    const opening = openSection !== key;
    setOpenSection(opening ? key : null);
    // على الشاشات الواسعة ننقل الصفحة إلى القسم الذي يُعدَّل لتظهر المعاينة بجانب اللوحة
    if (opening && target && window.innerWidth >= 640) {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const exportFile = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'content.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice({ ok: true, text: 'تم تنزيل الملف content.json' });
  };

  const importFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('not a content file');
      }
      replaceAll(parsed);
      setNotice({ ok: true, text: 'تم استيراد المحتوى من الملف.' });
    } catch {
      setNotice({
        ok: false,
        text: 'الملف غير صالح. اختر ملف content.json سبق تنزيله من هذه اللوحة.',
      });
    }
  };

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        className="btn btn-olive pop-in fixed start-4 bottom-4 z-[90] px-5 shadow-soft ring-1 ring-gold-400/60"
      >
        <Pencil className="size-4" />
        متابعة التعديل
      </button>
    );
  }

  return (
    <aside
      aria-label="لوحة تعديل المحتوى"
      className="fade-in fixed inset-y-0 end-0 z-[90] flex w-full flex-col border-s border-gold-500/40 bg-cream-50 text-ink shadow-[0_0_60px_-10px_rgb(28_34_18/0.6)] sm:w-[27rem]"
    >
      {/* الشريط العلوي */}
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 bg-olive-900 px-4 text-cream-50">
        <h2 className="flex items-center gap-2.5 text-xl font-bold">
          <Pencil className="size-5 text-gold-400" />
          تعديل المحتوى
        </h2>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMinimized(true)}
            className="btn btn-line-light min-h-10 px-3.5 text-[0.92rem]"
          >
            <Eye className="size-4" />
            معاينة
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق لوحة التعديل"
            className="grid size-10 place-items-center rounded-full transition-colors hover:bg-cream-50/15"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* الأقسام */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4">
        <p className="mb-4 px-1 text-[0.95rem] leading-relaxed text-ink/70">
          افتح أي قسم وعدّل نصوصه وصوره: التغيير يظهر فورًا في الصفحة ويُحفظ تلقائيًا في هذا المتصفح.
        </p>

        <ul className="space-y-2">
          {sections.map(({ key, title, target }) => {
            const open = openSection === key;
            return (
              <li
                key={key}
                className={cn(
                  'rounded-2xl border bg-cream-100/70 transition-colors',
                  open ? 'border-gold-500/70' : 'border-cream-300',
                )}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => toggleSection(key, target)}
                    aria-expanded={open}
                    className="flex min-h-13 w-full items-center justify-between gap-3 rounded-2xl px-4 text-start font-display text-lg font-bold text-olive-900"
                  >
                    {title}
                    <ChevronDown
                      className={cn(
                        'size-5 shrink-0 text-gold-700 transition-transform',
                        open && 'rotate-180',
                      )}
                    />
                  </button>
                </h3>
                {open && (
                  <div className="border-t border-cream-300 p-3">
                    <FieldNode value={content[key]} path={[key]} bare />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <details className="mt-5 rounded-2xl border border-cream-300 bg-white p-4 text-[0.95rem] leading-relaxed">
          <summary className="cursor-pointer font-bold text-olive-900">
            كيف تظهر تعديلاتي لكل الزوار؟
          </summary>
          <p className="mt-3 text-ink/75">
            ما تعدّله هنا يُحفظ في <strong>متصفحك أنت فقط</strong>. لنشره للجميع:
          </p>
          <ol className="mt-2 list-decimal space-y-1.5 ps-5 text-ink/75">
            <li>اضغط «تنزيل ملف المحتوى» في الأسفل.</li>
            <li>
              ارفع الملف <span dir="ltr">content.json</span> إلى الاستضافة بجانب{' '}
              <span dir="ltr">index.html</span> (استبدل الملف القديم).
            </li>
            <li>حدّث الصفحة: التعديلات تظهر لكل الزوار دون إعادة بناء الموقع.</li>
          </ol>
        </details>
      </div>

      {/* الشريط السفلي: الحفظ والتصدير */}
      <div className="shrink-0 border-t border-cream-300 bg-cream-100 px-4 py-3">
        <div role="status" aria-live="polite" className="mb-2.5 text-[0.9rem] leading-snug">
          {notice ? (
            <p
              className={cn(
                'flex items-start gap-2 font-medium',
                notice.ok ? 'text-[#166534]' : 'text-[#b3261e]',
              )}
            >
              {notice.ok ? (
                <CircleCheck className="mt-0.5 size-4 shrink-0" />
              ) : (
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
              )}
              {notice.text}
            </p>
          ) : saveState === 'error' ? (
            <p className="flex items-start gap-2 font-medium text-[#b3261e]">
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              تعذّر الحفظ: مساحة المتصفح ممتلئة. احذف بعض الصور المرفوعة أو استعمل روابط صور بدلها.
            </p>
          ) : hasDraft ? (
            <p className="flex items-start gap-2 text-[#166534]">
              <CircleCheck className="mt-0.5 size-4 shrink-0" />
              تعديلاتك محفوظة في هذا المتصفح فقط.
            </p>
          ) : (
            <p className="text-ink/60">لم تُجرِ أي تعديل بعد.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={exportFile} className="btn btn-gold min-h-11 px-3 text-[0.92rem]">
            <Download className="size-4" />
            تنزيل ملف المحتوى
          </button>
          <button
            type="button"
            onClick={() => importRef.current?.click()}
            className="btn btn-line-dark min-h-11 px-3 text-[0.92rem]"
          >
            <Upload className="size-4" />
            استيراد ملف
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            onChange={importFile}
            className="hidden"
          />
        </div>

        <ConfirmButton
          onConfirm={() => {
            reset();
            setNotice({ ok: true, text: 'تم حذف تعديلاتك واسترجاع المحتوى الأصلي.' });
          }}
          disabled={!hasDraft}
          label="استرجاع المحتوى الأصلي"
          confirmText="تأكيد: حذف كل تعديلاتي"
          className="mt-2 flex min-h-10 w-full items-center justify-center gap-2 rounded-full text-[0.92rem] font-bold text-[#b3261e] transition-colors hover:bg-[#b3261e]/8 disabled:text-ink/35 disabled:hover:bg-transparent"
        >
          <RotateCcw className="size-4" />
          استرجاع المحتوى الأصلي
        </ConfirmButton>
      </div>
    </aside>
  );
}
