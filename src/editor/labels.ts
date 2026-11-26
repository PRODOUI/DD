import { builtInImageNames } from '../components/Picture';
import type { SiteContent } from '../data/site';
import { iconMap } from '../lib/icons';

/**
 * إعدادات لوحة التعديل: أسماء الأقسام والحقول بالعربية.
 * اللوحة تُبنى تلقائيًا من شكل المحتوى في src/data/site.ts —
 * إذا أضفت مفتاحًا جديدًا هناك سيظهر هنا باسمه الإنجليزي إلى أن تضيف له تسمية.
 */

/** أقسام اللوحة بالترتيب، مع القسم الذي تنتقل إليه الصفحة عند فتحها */
export const sections: { key: keyof SiteContent; title: string; target?: string }[] = [
  { key: 'business', title: 'معلومات النشاط والعنوان', target: 'footer' },
  { key: 'phones', title: 'أرقام الهاتف وواتساب', target: 'contact' },
  { key: 'messages', title: 'رسالة واتساب الجاهزة' },
  { key: 'nav', title: 'الهيدر وقائمة التنقل', target: 'top' },
  { key: 'hero', title: 'الواجهة الرئيسية', target: 'top' },
  { key: 'about', title: 'من نحن', target: 'about' },
  { key: 'services', title: 'خدماتنا', target: 'services' },
  { key: 'dishes', title: 'أطباقنا المغربية', target: 'dishes' },
  { key: 'packages', title: 'الباقات', target: 'packages' },
  { key: 'why', title: 'لماذا نحن', target: 'why' },
  { key: 'gallery', title: 'معرض الصور', target: 'gallery' },
  { key: 'video', title: 'قسم الفيديو', target: 'video' },
  { key: 'testimonials', title: 'آراء الزبناء', target: 'testimonials' },
  { key: 'areas', title: 'المناطق التي نخدمها', target: 'areas' },
  { key: 'form', title: 'نموذج طلب عرض السعر', target: 'contact' },
  { key: 'footer', title: 'الفوتر', target: 'footer' },
  { key: 'floating', title: 'زر واتساب العائم' },
];

/** تسمية الحقل حسب اسم المفتاح (تُستعمل إن لم توجد تسمية خاصة بالمسار) */
export const keyLabels: Record<string, string> = {
  visible: 'إظهار هذا القسم في الصفحة',
  eyebrow: 'العنوان الصغير (فوق العنوان)',
  title: 'العنوان',
  text: 'النص',
  name: 'الاسم',
  label: 'التسمية',
  cta: 'نص الزر',
  image: 'الصورة',
  imageAlt: 'وصف الصورة (لمحركات البحث)',
  alt: 'وصف الصورة (لمحركات البحث)',
  icon: 'الأيقونة',
  items: 'العناصر',
  tagline: 'الجملة التعريفية',
  address: 'العنوان',
  mapQuery: 'ما يُبحث عنه في خريطة Google',
  hours: 'أوقات العمل',
  days: 'الأيام',
  time: 'الوقت',
  social: 'روابط التواصل الاجتماعي',
  facebook: 'رابط فيسبوك',
  instagram: 'رابط إنستغرام',
  tiktok: 'رابط تيك توك',
  phones: 'الأرقام',
  local: 'الرقم كما يظهر للزائر',
  intl: 'الرقم بالصيغة الدولية',
  links: 'روابط القائمة',
  href: 'القسم الذي يفتحه الرابط',
  titleLead: 'السطر الأول من العنوان (ذهبي)',
  titleRest: 'بقية العنوان',
  highlights: 'المزايا السريعة',
  badge: 'الشارة فوق الصورة',
  points: 'النقاط',
  rowLabels: 'عناوين صفوف جدول المقارنة',
  summary: 'وصف قصير',
  featured: 'باقة موصى بها (تُميَّز بالألوان)',
  features: 'محتوى الباقة',
  dishes: 'عدد الأطباق',
  service: 'الخدمة',
  equipment: 'المعدات',
  waiters: 'النادلون',
  caption: 'التعليق على الصورة',
  src: 'مسار الفيديو',
  poster: 'مسار الصورة المعاينة (قبل التشغيل)',
  posterAlt: 'وصف الصورة المعاينة (لمحركات البحث)',
  playLabel: 'نص زر التشغيل',
  whatsappCta: 'نص زر واتساب',
  size: 'حجم الصورة في الشبكة',
  event: 'المناسبة والمدينة',
  rating: 'عدد النجوم',
  more: 'نص آخر القائمة',
  steps: 'الخطوات',
  labels: 'عناوين الحقول',
  placeholders: 'النصوص الإرشادية داخل الحقول',
  phone: 'رقم الهاتف',
  eventType: 'نوع المناسبة',
  date: 'تاريخ المناسبة',
  guests: 'عدد الضيوف',
  city: 'المدينة',
  cityOther: 'اسم المدينة (عند اختيار «مدينة أخرى»)',
  package: 'الباقة',
  notes: 'ملاحظات',
  target: 'اختيار رقم الإرسال',
  eventTypes: 'أنواع المناسبات',
  submit: 'نص زر الإرسال',
  hint: 'الملاحظة تحت زر الإرسال',
};

/** تسميات خاصة بمسار معيّن (بدون أرقام العناصر) — تغلب التسمية العامة */
export const pathLabels: Record<string, string> = {
  'business.name': 'اسم النشاط (الشعار)',
  'business.suffix': 'السطر الصغير تحت الاسم',
  'phones.label': 'تسمية الرقم',
  'messages.general': 'الرسالة التي تُكتب تلقائيًا عند الضغط على أزرار واتساب',
  'nav.cta': 'نص زر الحجز في الهيدر',
  'nav.callLabel': 'نص زر الاتصال (قائمة الجوال)',
  'nav.whatsappLabel': 'نص زر واتساب (قائمة الجوال)',
  'nav.links.label': 'اسم الرابط',
  'hero.text': 'الجملة الفرعية',
  'hero.primaryCta': 'نص الزر الذهبي',
  'hero.whatsappCta': 'نص زر واتساب',
  'hero.highlights': 'المزايا السريعة أسفل الواجهة',
  'about.points': 'نقاط القوة',
  'services.items': 'الخدمات',
  'dishes.items': 'الأطباق',
  'dishes.items.name': 'اسم الطبق',
  'dishes.items.text': 'وصف قصير',
  'packages.items': 'الباقات',
  'packages.items.name': 'اسم الباقة',
  'packages.featuredBadge': 'نص شارة الباقة الموصى بها',
  'packages.itemCta': 'نص زر كل باقة',
  'packages.note': 'عبارة الأسعار',
  'packages.noteCta': 'نص الزر بجانب عبارة الأسعار',
  'why.items': 'الأسباب',
  'gallery.items': 'الصور',
  'video.points': 'النقاط تحت النص',
  'video.cta': 'نص الزر الذهبي',
  'testimonials.items': 'الشهادات',
  'testimonials.items.name': 'اسم الزبون',
  'testimonials.items.text': 'نص الشهادة',
  'areas.items': 'المدن',
  'areas.ctaMessage': 'رسالة واتساب عند الضغط على الزر',
  'form.steps': 'خطوات الطلب',
  'form.directTitle': 'عنوان بطاقة التواصل المباشر',
  'form.callLabel': 'نص زر الاتصال',
  'form.whatsappLabel': 'نص زر واتساب',
  'form.otherCity': 'نص خيار «مدينة أخرى»',
  'form.packageNone': 'نص خيار «بدون باقة»',
  'form.optional': 'كلمة «اختياري»',
  'form.successTitle': 'رسالة النجاح: العنوان',
  'form.successText': 'رسالة النجاح: النص قبل الرقم',
  'form.successQuestion': 'رسالة النجاح: السؤال',
  'form.successLink': 'رسالة النجاح: نص الرابط',
  'footer.about': 'نبذة قصيرة تحت الشعار',
  'footer.phonesTitle': 'عنوان عمود الهاتف',
  'footer.addressTitle': 'عنوان فقرة العنوان',
  'footer.hoursTitle': 'عنوان أوقات العمل',
  'footer.mapTitle': 'عنوان الخريطة',
  'footer.rights': 'عبارة الحقوق',
  'footer.showEditLink': 'إظهار رابط «تعديل المحتوى» أسفل الصفحة',
  'floating.label': 'نص الزر (يظهر على الحاسوب)',
  'floating.menuTitle': 'عنوان قائمة الأرقام',
};

/** شرح صغير تحت بعض الحقول */
export const fieldHints: Record<string, string> = {
  intl: 'رمز البلد ثم الرقم بدون الصفر الأول. مثال: 212612345678',
  mapQuery: 'اكتب اسم المحل كما هو مسجّل في Google Maps، أو العنوان الكامل.',
  facebook: 'اتركه فارغًا لإخفاء الأيقونة.',
  instagram: 'اتركه فارغًا لإخفاء الأيقونة.',
  tiktok: 'اتركه فارغًا لإخفاء الأيقونة.',
  'footer.showEditLink': 'عند إخفائه، افتح هذه اللوحة بإضافة #edit في آخر رابط الموقع.',
  'video.src': 'ضع ملف الفيديو في public/video/ ثم اكتب مساره (مثال: video/اسم-الملف.mp4)، أو الصق رابطًا كاملًا. يُفضَّل MP4 بحجم أقل من 20MB.',
  'areas.items': 'هذه المدن تظهر أيضًا في قائمة «المدينة» داخل نموذج الطلب.',
};

/** حقول تُعرض كقائمة اختيار */
export const selectOptions: Record<string, { value: string; label: string }[]> = {
  icon: Object.entries(iconMap).map(([value, { label }]) => ({ value, label })),
  size: [
    { value: 'wide', label: 'كبيرة (عمودان × صفان)' },
    { value: 'land', label: 'عريضة (عمودان)' },
    { value: 'tall', label: 'طولية (صفان)' },
    { value: 'small', label: 'عادية' },
  ],
  href: [
    { value: '#about', label: 'من نحن' },
    { value: '#services', label: 'خدماتنا' },
    { value: '#dishes', label: 'الأطباق' },
    { value: '#packages', label: 'الباقات' },
    { value: '#why', label: 'لماذا نحن' },
    { value: '#gallery', label: 'معرض الصور' },
    { value: '#video', label: 'الفيديو' },
    { value: '#testimonials', label: 'آراء الزبناء' },
    { value: '#areas', label: 'المناطق التي نخدمها' },
    { value: '#contact', label: 'نموذج الطلب / تواصل معنا' },
    { value: '#top', label: 'أعلى الصفحة' },
  ],
};

/** أسماء صور الموقع بالعربية (لقائمة اختيار الصورة) */
const knownImageLabels: Record<string, string> = {
  'tagine-lamb-prunes-apricots-almonds': 'طاجين لحم بالبرقوق والمشمش واللوز',
  'tagine-lamb-prunes-cherries-decorated': 'طاجين لحم مزين بالبرقوق والكرز',
  'lamb-prunes-walnuts-almonds': 'لحم بالبرقوق والجوز واللوز',
  'lamb-mrouzia-prunes-apricots-almonds': 'لحم مروزية بالبرقوق والمشمش واللوز',
  'seffa-sugar-cinnamon': 'سفة بالسكر والقرفة',
  'couscous-tfaya-almonds-eggs': 'كسكس تفاية باللوز والبيض',
  'roast-chicken-olives-preserved-lemon': 'دجاج محمر بالزيتون والليمون المخلل',
  'graduation-2026-buffet': 'بوفي حفل التخرج 2026',
  'buffet-juice-milkshake-croissants': 'بوفي العصير والحليب والكرواصون',
  'table-white-red-roses-red-tent': 'طاولة بيضاء بورود حمراء وخيمة حمراء',
  'lettuce-plates-night-prep': 'تحضير صحون الخس فالليل',
  'mini-pastries-strawberry-raspberry-chocolate': 'ميني حلويات بالفراولة والتوت والشوكولاتة',
  'decorated-fruit-platter': 'طبق فواكه مزين',
  'black-gold-table-red-chairs-1': 'طاولة سوداء بتطريز ذهبي وكراسي حمراء (1)',
  'black-gold-table-red-chairs-2': 'طاولة سوداء بتطريز ذهبي وكراسي حمراء (2)',
  'black-table-gold-plates-beige-napkins': 'طاولة سوداء بصحون ذهبية ومناديل بيج',
};

export const imageOptions = builtInImageNames.map((name) => ({
  value: name as string,
  label: knownImageLabels[name] ?? name,
}));

/** حقول نصية طويلة تُعرض كمربع متعدد الأسطر */
export const multilineKeys = new Set([
  'text',
  'address',
  'general',
  'ctaMessage',
  'hint',
  'note',
  'about',
  'summary',
  'steps',
]);

/** حقول تُكتب من اليسار إلى اليمين (أرقام وروابط) */
export const ltrKeys = new Set(['local', 'intl', 'facebook', 'instagram', 'tiktok', 'mapQuery']);

/** الحد الأدنى لعدد العناصر في بعض القوائم */
export const minItems: Record<string, number> = { phones: 1 };
