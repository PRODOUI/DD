import {
  Armchair,
  Award,
  Baby,
  BadgeCheck,
  BookOpen,
  Cake,
  CalendarCheck,
  ChefHat,
  Clock,
  Gem,
  Gift,
  GraduationCap,
  HandCoins,
  HandHeart,
  Heart,
  HeartHandshake,
  Leaf,
  Presentation,
  Sparkles,
  Star,
  Truck,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';

/**
 * الأيقونات المتاحة للاختيار في المحتوى (الخدمات، «من نحن»، «لماذا نحن»).
 * لإضافة أيقونة: استوردها من lucide-react (https://lucide.dev/icons)
 * ثم أضف سطرًا هنا — ستظهر تلقائيًا في لوحة التعديل.
 */
export const iconMap: Record<string, { Icon: LucideIcon; label: string }> = {
  wedding: { Icon: Gem, label: 'خاتم (أعراس)' },
  aqiqa: { Icon: Baby, label: 'مولود (عقيقة)' },
  engagement: { Icon: HeartHandshake, label: 'قلب ومصافحة (خطوبة)' },
  family: { Icon: Users, label: 'أشخاص (عائلة)' },
  religious: { Icon: BookOpen, label: 'كتاب مفتوح (ديني)' },
  business: { Icon: Presentation, label: 'عرض تقديمي (ندوات)' },
  condolence: { Icon: HandHeart, label: 'يد وقلب (مواساة)' },
  party: { Icon: GraduationCap, label: 'قبعة تخرج' },
  delivery: { Icon: Truck, label: 'شاحنة (توصيل)' },
  price: { Icon: HandCoins, label: 'نقود (أسعار)' },
  clean: { Icon: Sparkles, label: 'لمعان (نظافة)' },
  team: { Icon: ChefHat, label: 'قبعة طباخ (فريق)' },
  equipment: { Icon: Armchair, label: 'كرسي (تجهيز)' },
  time: { Icon: CalendarCheck, label: 'تقويم (مواعيد)' },
  award: { Icon: Award, label: 'وسام (خبرة)' },
  check: { Icon: BadgeCheck, label: 'علامة جودة' },
  clock: { Icon: Clock, label: 'ساعة' },
  leaf: { Icon: Leaf, label: 'ورقة (طازج)' },
  cake: { Icon: Cake, label: 'كعكة (ميلاد)' },
  utensils: { Icon: UtensilsCrossed, label: 'ملعقة وشوكة' },
  heart: { Icon: Heart, label: 'قلب' },
  gift: { Icon: Gift, label: 'هدية' },
  star: { Icon: Star, label: 'نجمة' },
};

export function getIcon(name: string): LucideIcon {
  return (iconMap[name] ?? iconMap.star).Icon;
}
