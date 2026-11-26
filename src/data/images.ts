// ⚠️ ملف مولَّد تلقائيًا بواسطة scripts/optimize-images.mjs — لا تعدّله يدويًا.
// لإضافة أو تغيير صورة: ضعها في images-src/ ثم شغّل:  node scripts/optimize-images.mjs

export const images = {
  "black-gold-table-red-chairs-1": {
    "width": 562,
    "height": 1000,
    "widths": [
      480,
      562
    ]
  },
  "black-gold-table-red-chairs-2": {
    "width": 1000,
    "height": 563,
    "widths": [
      480,
      800,
      1000
    ]
  },
  "black-table-gold-plates-beige-napkins": {
    "width": 562,
    "height": 1000,
    "widths": [
      480,
      562
    ]
  },
  "buffet-juice-milkshake-croissants": {
    "width": 750,
    "height": 1000,
    "widths": [
      480,
      750
    ]
  },
  "couscous-tfaya-almonds-eggs": {
    "width": 680,
    "height": 781,
    "widths": [
      480,
      680
    ]
  },
  "decorated-fruit-platter": {
    "width": 450,
    "height": 1000,
    "widths": [
      450
    ]
  },
  "graduation-2026-buffet": {
    "width": 1000,
    "height": 750,
    "widths": [
      480,
      800,
      1000
    ]
  },
  "lamb-mrouzia-prunes-apricots-almonds": {
    "width": 480,
    "height": 640,
    "widths": [
      480
    ]
  },
  "lamb-prunes-walnuts-almonds": {
    "width": 720,
    "height": 851,
    "widths": [
      480,
      720
    ]
  },
  "lettuce-plates-night-prep": {
    "width": 562,
    "height": 1000,
    "widths": [
      480,
      562
    ]
  },
  "mini-pastries-strawberry-raspberry-chocolate": {
    "width": 579,
    "height": 474,
    "widths": [
      480,
      579
    ]
  },
  "roast-chicken-olives-preserved-lemon": {
    "width": 720,
    "height": 678,
    "widths": [
      480,
      720
    ]
  },
  "seffa-sugar-cinnamon": {
    "width": 720,
    "height": 720,
    "widths": [
      480,
      720
    ]
  },
  "table-white-red-roses-red-tent": {
    "width": 750,
    "height": 1000,
    "widths": [
      480,
      750
    ]
  },
  "tagine-lamb-prunes-apricots-almonds": {
    "width": 447,
    "height": 447,
    "widths": [
      447
    ]
  },
  "tagine-lamb-prunes-cherries-decorated": {
    "width": 335,
    "height": 597,
    "widths": [
      335
    ]
  }
} as const;

export type ImageName = keyof typeof images;
