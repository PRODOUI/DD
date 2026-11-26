import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { CircleAlert, CircleCheck, Phone } from 'lucide-react';
import { useContent } from '../content/ContentProvider';
import { buildQuoteMessage, telLink, waLink } from '../lib/whatsapp';
import { cn } from '../utils/cn';
import { WhatsAppIcon } from './Icons';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

/** قيمة داخلية لخيار «مدينة أخرى» (النص الظاهر يأتي من المحتوى) */
const OTHER_CITY = '__other__';

type FieldName = 'name' | 'phone' | 'eventType' | 'date' | 'guests' | 'city' | 'cityOther';
type Errors = Partial<Record<FieldName, string>>;

/** ترتيب الحقول في الصفحة — لوضع المؤشر على أول حقل فيه خطأ */
const fieldOrder: FieldName[] = ['name', 'phone', 'eventType', 'date', 'guests', 'city', 'cityOther'];

const emptyValues = {
  name: '',
  phone: '',
  eventType: '',
  date: '',
  guests: '',
  city: '',
  cityOther: '',
  notes: '',
};

type Values = typeof emptyValues;

function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** رسائل التحقق من الحقول */
function validate(v: Values): Errors {
  const errors: Errors = {};

  if (v.name.trim().length < 2) errors.name = 'المرجو كتابة الاسم.';

  const digits = v.phone.replace(/\D/g, '');
  if (!/^[+\d\s().-]+$/.test(v.phone.trim()) || digits.length < 9 || digits.length > 15) {
    errors.phone = 'المرجو كتابة رقم هاتف صحيح، مثال: 0612345678';
  }

  if (!v.eventType) errors.eventType = 'المرجو اختيار نوع المناسبة.';

  if (!v.date) errors.date = 'المرجو اختيار تاريخ المناسبة.';
  else if (v.date < todayISO()) errors.date = 'التاريخ يجب أن يكون اليوم أو بعده.';

  const guests = Number(v.guests);
  if (!v.guests || !Number.isInteger(guests) || guests < 1) {
    errors.guests = 'المرجو كتابة عدد الضيوف التقريبي.';
  }

  if (!v.city) errors.city = 'المرجو اختيار المدينة.';
  else if (v.city === OTHER_CITY && v.cityOther.trim().length < 2) {
    errors.cityOther = 'المرجو كتابة اسم المدينة.';
  }

  return errors;
}

interface QuoteFormProps {
  /** الباقة المختارة (تُملأ تلقائيًا عند الضغط على زر الباقة) */
  packageName: string;
  onPackageChange: (name: string) => void;
}

export function QuoteForm({ packageName, onPackageChange }: QuoteFormProps) {
  const c = useContent();
  const { form, phones } = c;

  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [targetIndex, setTargetIndex] = useState(0);
  const [sent, setSent] = useState<{ url: string; number: string } | null>(null);

  const target = phones[targetIndex] ?? phones[0];

  const update =
    (field: keyof Values) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
      // إخفاء رسالة الخطأ فور بدء التصحيح
      setErrors((prev) => {
        if (!(field in prev)) return prev;
        const next = { ...prev };
        delete next[field as FieldName];
        return next;
      });
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const found = validate(values);
    setErrors(found);

    const firstInvalid = fieldOrder.find((f) => found[f]);
    if (firstInvalid) {
      setSent(null);
      document.getElementById(`quote-${firstInvalid}`)?.focus();
      return;
    }

    const message = buildQuoteMessage(
      {
        name: values.name,
        phone: values.phone,
        eventType: values.eventType,
        date: values.date,
        guests: values.guests,
        city: values.city === OTHER_CITY ? values.cityOther.trim() : values.city,
        packageName,
        notes: values.notes,
      },
      c.business.name,
    );

    // الرسالة تُرمَّز بـ encodeURIComponent داخل waLink
    const url = waLink(target.intl, message);
    setSent({ url, number: target.local });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  /** خصائص الوصول المشتركة لكل حقل إلزامي */
  const a11y = (field: FieldName) => ({
    id: `quote-${field}`,
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `quote-${field}-error` : undefined,
  });

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-cream-50 py-20 md:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-14">
        {/* ---------- العمود التعريفي ---------- */}
        <div className="lg:col-span-5">
          <Reveal>
            <SectionHeading
              id="contact-title"
              eyebrow={form.eyebrow}
              title={form.title}
              text={form.text}
              align="start"
            />

            {form.steps.length > 0 && (
              <ol className="mt-9 space-y-5">
                {form.steps.map((text, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-olive-800 font-display text-lg font-bold text-gold-300">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-lg leading-relaxed text-ink/80">{text}</span>
                  </li>
                ))}
              </ol>
            )}

            <div className="mt-10 rounded-3xl border border-cream-300 bg-cream-100/70 p-6">
              <p className="font-display text-xl font-bold text-olive-900">{form.directTitle}</p>
              <ul className="mt-4 space-y-3">
                {phones.map((p, i) => (
                  <li key={i} className="flex flex-wrap items-center justify-between gap-3">
                    <span dir="ltr" className="text-xl font-bold text-olive-900">
                      {p.local}
                    </span>
                    <span className="flex gap-2">
                      <a
                        href={telLink(p.intl)}
                        aria-label={`${form.callLabel} ${p.local}`}
                        className="btn btn-line-dark min-h-11 px-4 text-[0.95rem]"
                      >
                        <Phone className="size-4" />
                        {form.callLabel}
                      </a>
                      <a
                        href={waLink(p.intl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${form.whatsappLabel} ${p.local}`}
                        className="btn btn-wa min-h-11 px-4 text-[0.95rem]"
                      >
                        <WhatsAppIcon className="size-4" />
                        {form.whatsappLabel}
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* ---------- النموذج ---------- */}
        <Reveal delay={100} className="lg:col-span-7">
          <form
            noValidate
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-gold-500/40 bg-cream-100/60 p-5 shadow-soft sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="quote-name" label={form.labels.name} error={errors.name}>
                <input
                  {...a11y('name')}
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={update('name')}
                  placeholder={form.placeholders.name}
                  className="field"
                />
              </Field>

              <Field id="quote-phone" label={form.labels.phone} error={errors.phone}>
                <input
                  {...a11y('phone')}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  value={values.phone}
                  onChange={update('phone')}
                  placeholder={form.placeholders.phone}
                  className="field text-right"
                />
              </Field>

              <Field id="quote-eventType" label={form.labels.eventType} error={errors.eventType}>
                <select
                  {...a11y('eventType')}
                  value={values.eventType}
                  onChange={update('eventType')}
                  className={cn('field', !values.eventType && 'text-ink/45')}
                >
                  <option value="" disabled>
                    {form.placeholders.eventType}
                  </option>
                  {form.eventTypes.map((type, i) => (
                    <option key={i} value={type} className="text-ink">
                      {type}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="quote-date" label={form.labels.date} error={errors.date}>
                <input
                  {...a11y('date')}
                  type="date"
                  min={todayISO()}
                  value={values.date}
                  onChange={update('date')}
                  className="field"
                />
              </Field>

              <Field id="quote-guests" label={form.labels.guests} error={errors.guests}>
                <input
                  {...a11y('guests')}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  dir="ltr"
                  value={values.guests}
                  onChange={update('guests')}
                  placeholder={form.placeholders.guests}
                  className="field text-right"
                />
              </Field>

              <Field id="quote-city" label={form.labels.city} error={errors.city}>
                <select
                  {...a11y('city')}
                  value={values.city}
                  onChange={update('city')}
                  className={cn('field', !values.city && 'text-ink/45')}
                >
                  <option value="" disabled>
                    {form.placeholders.city}
                  </option>
                  {c.areas.items.map((area, i) => (
                    <option key={i} value={area} className="text-ink">
                      {area}
                    </option>
                  ))}
                  <option value={OTHER_CITY} className="text-ink">
                    {form.otherCity}
                  </option>
                </select>
              </Field>

              {values.city === OTHER_CITY && (
                <Field
                  id="quote-cityOther"
                  label={form.labels.cityOther}
                  error={errors.cityOther}
                  className="sm:col-span-2"
                >
                  <input
                    {...a11y('cityOther')}
                    type="text"
                    value={values.cityOther}
                    onChange={update('cityOther')}
                    placeholder={form.placeholders.cityOther}
                    className="field"
                  />
                </Field>
              )}

              {c.packages.visible && c.packages.items.length > 0 && (
                <Field
                  id="quote-package"
                  label={form.labels.package}
                  optional={form.optional}
                  className="sm:col-span-2"
                >
                  <select
                    id="quote-package"
                    value={packageName}
                    onChange={(e) => onPackageChange(e.target.value)}
                    className="field"
                  >
                    <option value="">{form.packageNone}</option>
                    {c.packages.items.map((p, i) => (
                      <option key={i} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <Field
                id="quote-notes"
                label={form.labels.notes}
                optional={form.optional}
                className="sm:col-span-2"
              >
                <textarea
                  id="quote-notes"
                  value={values.notes}
                  onChange={update('notes')}
                  rows={4}
                  placeholder={form.placeholders.notes}
                  className="field"
                />
              </Field>
            </div>

            {/* اختيار رقم واتساب الذي ستُرسل إليه الرسالة */}
            {phones.length > 1 && (
              <fieldset className="mt-7">
                <legend className="mb-2 font-bold text-olive-900">{form.labels.target}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {phones.map((p, i) => {
                    const selected = target === p;
                    return (
                      <label
                        key={i}
                        className={cn(
                          'flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] px-4 py-3 transition-colors',
                          'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-500',
                          selected
                            ? 'border-olive-700 bg-olive-800 text-cream-50'
                            : 'border-cream-300 bg-white hover:border-gold-400',
                        )}
                      >
                        <input
                          type="radio"
                          name="whatsapp-target"
                          value={i}
                          checked={selected}
                          onChange={() => setTargetIndex(i)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={cn(
                            'grid size-5 shrink-0 place-items-center rounded-full border-2',
                            selected ? 'border-gold-400' : 'border-olive-800/35',
                          )}
                        >
                          {selected && <span className="size-2.5 rounded-full bg-gold-400" />}
                        </span>
                        <span className="leading-tight">
                          <span
                            className={cn(
                              'block text-sm',
                              selected ? 'text-cream-100/75' : 'text-ink/60',
                            )}
                          >
                            {p.label}
                          </span>
                          <span dir="ltr" className="block text-lg font-bold">
                            {p.local}
                          </span>
                        </span>
                        <WhatsAppIcon
                          className={cn(
                            'ms-auto size-5 shrink-0',
                            selected ? 'text-gold-300' : 'text-[#15803d]',
                          )}
                        />
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <button type="submit" className="btn btn-wa mt-7 min-h-14 w-full text-lg">
              <WhatsAppIcon className="size-5" />
              {form.submit}
            </button>

            {form.hint && (
              <p className="mt-3 text-center text-[0.95rem] leading-relaxed text-ink/65">
                {form.hint}
              </p>
            )}

            {/* رسالة التأكيد بعد فتح واتساب */}
            <div role="status" aria-live="polite">
              {sent && (
                <div className="pop-in mt-5 flex items-start gap-3 rounded-2xl border border-[#15803d]/30 bg-[#15803d]/8 p-4">
                  <CircleCheck className="mt-0.5 size-6 shrink-0 text-[#15803d]" />
                  <p className="leading-relaxed text-ink/85">
                    <strong className="text-olive-900">{form.successTitle}</strong>{' '}
                    {form.successText} <span dir="ltr">{sent.number}</span>. {form.successQuestion}{' '}
                    <a
                      href={sent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#166534] underline underline-offset-4 hover:text-olive-900"
                    >
                      {form.successLink}
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  حقل واحد: العنوان + الحقل + رسالة الخطأ                             */
/* ------------------------------------------------------------------ */
interface FieldProps {
  id: string;
  label: string;
  error?: string;
  /** نص «(اختياري)» بجانب العنوان */
  optional?: string;
  className?: string;
  children: ReactNode;
}

function Field({ id, label, error, optional, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block font-bold text-olive-900">
        {label}
        {optional && <span className="font-normal text-ink/55"> {optional}</span>}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-[0.95rem] leading-snug font-medium text-[#b3261e]"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
