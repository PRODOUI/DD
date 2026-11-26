/**
 * دوال مساعدة لروابط واتساب والاتصال الهاتفي.
 */

/** بيانات نموذج طلب عرض السعر */
export interface QuoteValues {
  name: string;
  phone: string;
  eventType: string;
  date: string; // بصيغة YYYY-MM-DD كما يعيدها حقل التاريخ
  guests: string;
  city: string;
  packageName: string; // اختياري
  notes: string; // اختياري
}

/** إبقاء الأرقام فقط (يحذف + والمسافات إن كُتبت في لوحة التعديل) */
const digits = (value: string) => value.replace(/\D/g, '');

/** رابط محادثة واتساب — النص يُرمَّز دائمًا بـ encodeURIComponent */
export function waLink(intlNumber: string, text?: string): string {
  const base = `https://wa.me/${digits(intlNumber)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** رابط اتصال مباشر */
export function telLink(intlNumber: string): string {
  return `tel:+${digits(intlNumber)}`;
}

/** تحويل 2026-05-17 إلى: الأحد 17 ماي 2026 */
export function formatDateAr(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const date = new Date(y, m - 1, d);
  try {
    return new Intl.DateTimeFormat('ar-MA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoDate;
  }
}

/** بناء رسالة واتساب منظمة من بيانات النموذج */
export function buildQuoteMessage(v: QuoteValues, brand: string): string {
  const lines = [
    `*طلب عرض سعر — ${brand}*`,
    '',
    `👤 *الاسم:* ${v.name.trim()}`,
    `📞 *الهاتف:* ${v.phone.trim()}`,
    `🎉 *نوع المناسبة:* ${v.eventType}`,
    `📅 *تاريخ المناسبة:* ${formatDateAr(v.date)}`,
    `👥 *عدد الضيوف:* ${v.guests}`,
    `📍 *المدينة:* ${v.city}`,
  ];

  if (v.packageName) lines.push(`🍽️ *الباقة:* ${v.packageName}`);
  if (v.notes.trim()) lines.push('', `📝 *ملاحظات:*`, v.notes.trim());

  lines.push('', `أُرسل هذا الطلب من موقع ${brand}.`);
  return lines.join('\n');
}
